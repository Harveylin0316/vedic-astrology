// 正統吠陀事業分析引擎 · v2 (增強版)
//
// v2 相對 v1 的升級：
//   ✅ 加入 Lagna Lord（命主星）分析 — 古典 K.N. Rao 派三王交叉第一王
//   ✅ 加入 Yoga 偵測 → 事業啟示 (override 單點判讀)
//   ✅ D10 (Dasamsa) 事業專盤交叉驗證
//   ✅ 尊嚴 Dignity 擴展：Moolatrikona / Digbala / Neecha Bhanga 解消
//   ✅ 108 組合矩陣（9 行星 × 12 宮）取代原本 9×1 + 12×1 並列
//   ✅ Synthesized Narrative：把所有發現組合成「像專業占星師寫的」一段話
//
// 依據：Brihat Parashara Hora Shastra + Phaladeepika + K.N. Rao + B.V. Raman

import {
  planetAsKarmesh,
  karmeshInHouse,
  naturalKaraka,
  rashiLord,
  nakshatraRuler,
  planetDignityMap,
  dignityLabels,
  planetFriendship,
  digbalaHouse
} from '../data/careerVedicData.js'
import { scorePlanetForCareer } from './planetStrength.js'
import { detectYogas } from './yogaDetector.js'
import {
  karmeshMatrix,
  yogaCareerReadings,
  synthesizeCareerNarrative,
  selectKarmeshReading,
  buildKarakaOverrides
} from '../data/careerMatrix.js'
import { synthesizeCareerPlaybook } from '../data/careerPlaybook.js'
import { detectCareerSubCategory } from '../data/careerSubCategoryDetector.js'
import { computeDasamsa } from './vedicCalc.js'

// ═══════════════════════════════════════════════
// 基礎尊嚴 Dignity 計算（簡版 — 僅傳 rashi 名稱判斷）
// ═══════════════════════════════════════════════
export function computeDignity(planet, rashiName) {
  const d = planetDignityMap[planet]
  if (!d) return 'neutral'
  if (d.exalted === rashiName) return 'exalted'
  if (d.own && d.own.includes(rashiName)) return 'own'
  if (d.debilitated === rashiName) return 'debilitated'
  const signLord = rashiLord[rashiName]
  if (!signLord || planet === 'Rahu' || planet === 'Ketu') return 'neutral'
  const fr = planetFriendship[planet]
  if (!fr) return 'neutral'
  if (fr.friends.includes(signLord)) return 'friendly'
  if (fr.enemies.includes(signLord)) return 'enemy'
  return 'neutral'
}

// ═══════════════════════════════════════════════
// 詳細 Dignity Details — Digbala + Moolatrikona + Neecha Bhanga 解消
// ═══════════════════════════════════════════════
export function computeDignityDetails(planet, graha, activeYogas = []) {
  if (!graha) {
    return { dignity: 'neutral', moolatrikona: false, digbala: false, neechaBhanga: false }
  }
  const dignity = computeDignity(planet, graha.rashi.name)
  const d = planetDignityMap[planet]

  // Moolatrikona 判定：行星在 moolatrikona 星座 + 度數在範圍內
  let moolatrikona = false
  if (d?.moolatrikona && graha.rashi.name === d.moolatrikona.rashi) {
    const deg = graha.degreeInSign
    moolatrikona = deg >= d.moolatrikona.from && deg <= d.moolatrikona.to
  }

  // Digbala 判定：行星在對的宮位（太陽/火星→10; 木/水→1; 土→7; 月/金→4）
  const targetHouse = digbalaHouse[planet]
  const digbala = targetHouse && graha.house === targetHouse

  // Neecha Bhanga 判定：從 activeYogas 找是否有 neecha-bhanga-<planet>
  const neechaBhanga = activeYogas.some((y) => y.id === `neecha-bhanga-${planet}`)

  return { dignity, moolatrikona, digbala, neechaBhanga }
}

// ═══════════════════════════════════════════════
// Amatyakaraka 計算（Jaimini 派）
// 度數最高的行星中第 2 名（排除 Rahu/Ketu）
// ═══════════════════════════════════════════════
export function computeAmatyakaraka(chart) {
  const candidates = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']
  const withDegrees = candidates
    .map((p) => {
      const g = chart.sidereal.grahas[p]
      return g ? { planet: p, deg: g.degreeInSign } : null
    })
    .filter(Boolean)
    .sort((a, b) => b.deg - a.deg)
  return {
    atmakaraka: withDegrees[0] || null,
    amatyakaraka: withDegrees[1] || null,
    ranking: withDegrees
  }
}

// ═══════════════════════════════════════════════
// 主分析函數（v2）
// ═══════════════════════════════════════════════
export function analyzeVedicCareer(chart, currentDashaLord = null, currentADLord = null) {
  // ════ 第 0 部分：Yogas（重要！優先於單點判讀）════
  const allYogas = detectYogas(chart)
  // 只挑事業相關的 yoga（且有對應的 career reading）
  const activeCareerYogas = allYogas
    .map((y) => {
      const reading = yogaCareerReadings[y.id]
      if (!reading) return null
      return {
        id: y.id,
        name: y.name,
        signature: y.signature,
        verdict: reading.verdict,
        careerImplication: reading.careerImplication,
        strength: reading.strength,
        type: y.type
      }
    })
    .filter(Boolean)

  // ════ 第 1 部分：10 宮本體 ════
  const tenthRashi = chart.sidereal.houses[9].rashi
  const karmeshPlanet = rashiLord[tenthRashi.name]
  const tenthOccupants = Object.entries(chart.sidereal.grahas)
    .filter(([, g]) => g.house === 10)
    .map(([name, g]) => ({
      planet: name,
      rashi: g.rashi,
      nakshatra: g.nakshatra,
      dignity: computeDignity(name, g.rashi.name),
      naturalDomain: naturalKaraka[name]?.domains || []
    }))

  // ════ 第 2 部分：10 宮主深度分析 + 擴展尊嚴 ════
  const karmeshGraha = chart.sidereal.grahas[karmeshPlanet]
  const karmeshDignity = karmeshGraha ? computeDignity(karmeshPlanet, karmeshGraha.rashi.name) : 'neutral'
  const karmeshDignityDetails = computeDignityDetails(karmeshPlanet, karmeshGraha, allYogas)
  const karmeshNakshatraLord = karmeshGraha ? nakshatraRuler[karmeshGraha.nakshatra.name] : null
  const karmeshScore = karmeshGraha
    ? scorePlanetForCareer(karmeshPlanet, chart, currentDashaLord, currentADLord)
    : { score: 0, reasons: [] }
  const inKarmeshDasha = currentDashaLord === karmeshPlanet

  // 建立 karmesh context（10 宮 + karmesh 所在宮的共位行星）
  const karmeshHouseNum = karmeshGraha?.house
  const conjoinPlanets = karmeshHouseNum
    ? Object.entries(chart.sidereal.grahas)
        .filter(([name, g]) => name !== karmeshPlanet && g.house === karmeshHouseNum)
        .map(([name]) => name)
    : []
  // 也把 10 宮內其他行星納入 context（可能不與 karmesh 共位但在事業宮）
  const tenthHousePlanets = Object.entries(chart.sidereal.grahas)
    .filter(([name, g]) => name !== karmeshPlanet && g.house === 10)
    .map(([name]) => name)
  const allContextPlanets = Array.from(new Set([...conjoinPlanets, ...tenthHousePlanets]))

  const karmeshContext = {
    conjoinPlanets: allContextPlanets,
    amatyakarakaPlanet: null, // 稍後填
    strongSignificators: []   // 稍後填
  }

  // 組合字典判讀（9 × 12，多語境）— 先算一個 conjoin-only 版本，
  // 等 AMK + strongSignificators 備好後於 part 8 後重新計算一次。
  let combinationReading = karmeshGraha
    ? selectKarmeshReading(karmeshPlanet, karmeshGraha.house, karmeshContext)
    : null

  // ════ 第 2b 部分：Lagna Lord（命主星）— 古典三王交叉第一王 ════
  const lagnaRashi = chart.sidereal.ascendant.rashi
  const lagnaLordPlanet = rashiLord[lagnaRashi.name]
  const lagnaLordGraha = chart.sidereal.grahas[lagnaLordPlanet]
  const lagnaLord = lagnaLordGraha
    ? {
        planet: lagnaLordPlanet,
        graha: lagnaLordGraha,
        rashi: lagnaLordGraha.rashi,
        house: lagnaLordGraha.house,
        nakshatra: lagnaLordGraha.nakshatra,
        dignity: computeDignity(lagnaLordPlanet, lagnaLordGraha.rashi.name),
        dignityDetails: computeDignityDetails(lagnaLordPlanet, lagnaLordGraha, allYogas),
        score: scorePlanetForCareer(lagnaLordPlanet, chart, currentDashaLord, currentADLord),
        combinationReading: karmeshMatrix[lagnaLordPlanet]?.[lagnaLordGraha.house] || null,
        isSameAsKarmesh: lagnaLordPlanet === karmeshPlanet
      }
    : null

  // ════ 第 3 部分：九大徵象星事業力量 ════
  const significatorRanking = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']
    .map((p) => ({
      planet: p,
      scoreData: scorePlanetForCareer(p, chart, currentDashaLord, currentADLord),
      graha: chart.sidereal.grahas[p],
      dignity: computeDignity(p, chart.sidereal.grahas[p]?.rashi.name),
      karaka: naturalKaraka[p]
    }))
    .sort((a, b) => b.scoreData.score - a.scoreData.score)

  // ════ 第 4 部分：Saturn 特別強調 ════
  const saturnInfo = {
    planet: 'Saturn',
    scoreData: scorePlanetForCareer('Saturn', chart, currentDashaLord, currentADLord),
    graha: chart.sidereal.grahas.Saturn,
    dignity: computeDignity('Saturn', chart.sidereal.grahas.Saturn?.rashi.name)
  }

  // ════ 第 5 部分：Amatyakaraka ════
  const amk = computeAmatyakaraka(chart)
  const amkPlanet = amk.amatyakaraka?.planet || null
  // 更新 karmeshContext（把 AMK 塞進去）
  karmeshContext.amatyakarakaPlanet = amkPlanet

  // ════ 第 6 部分：Dasha 影響 ════
  const dashaImpact = currentDashaLord
    ? {
        lord: currentDashaLord,
        isKarmesh: inKarmeshDasha,
        karaka: naturalKaraka[currentDashaLord],
        meaning: inKarmeshDasha
          ? `你正在走「10 宮主 ${currentDashaLord}」自己的大運 — 這是事業最可能起飛 / 定型的時期。`
          : `當前 ${currentDashaLord} 大運會用它的徵象（${naturalKaraka[currentDashaLord]?.domains.join('、')}）影響你的事業。`
      }
    : null

  // ════ 第 7 部分：D10 (Dasamsa) 事業專盤交叉 ════
  const dasamsa = computeDasamsa(chart)
  let d10Karmesh = null
  if (dasamsa) {
    // D10 10 宮主 = D10 Lagna 往後數到第 10 個 rashi 的 lord
    const d10TenthSignIdx0 = (dasamsa.lagna.signIndex0 + 9) % 12
    const rashisOrder = ['Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya','Tula','Vrishchika','Dhanu','Makara','Kumbha','Meena']
    const d10TenthSign = rashisOrder[d10TenthSignIdx0]
    const d10TenthLord = rashiLord[d10TenthSign]
    d10Karmesh = {
      lagnaRashi: dasamsa.lagna.rashi,
      tenthRashiName: d10TenthSign,
      tenthLord: d10TenthLord,
      tenthLordPositionInD10: dasamsa.grahas[d10TenthLord],
      planetPositions: dasamsa.grahas,
      agreement: d10TenthLord === karmeshPlanet,  // D1 跟 D10 10 宮主一致 = 事業方向穩定
      verdict:
        d10TenthLord === karmeshPlanet
          ? `D1 與 D10 10 宮主都是 ${karmeshPlanet} — 事業方向一致、執行與潛能同軌`
          : `D1 10 宮主是 ${karmeshPlanet}（潛能），D10 10 宮主是 ${d10TenthLord}（實踐） — 事業的「想做」與「會做」可能不同領域`
    }
  }

  // ════ 第 8 部分：Karaka Overrides（v5 Round 2：多訊號 voting + D10 交叉）════
  // 不再只看 AMK/Top-Significator 的 dignity，而是綜合：
  //   - AMK/Top-3 的強度
  //   - 行星所在 house 的事業意義（Mars 3/6/10/11、Sun 1/10、Venus 1/5/10、Jupiter 1/5/9/10、Saturn 7/10）
  //   - Mahapurusha Yoga 加成
  //   - D10 10 宮主交叉驗證（Round 2 新增）
  //   - Mars 合宮 / Venus+Moon combo（Round 2 新增）
  const karakaOverrides = buildKarakaOverrides({
    amatyakaraka: amk.amatyakaraka
      ? {
          planet: amk.amatyakaraka.planet,
          graha: chart.sidereal.grahas[amk.amatyakaraka.planet]
        }
      : null,
    significators: significatorRanking,
    computeDignity,
    chart,
    activeYogas: allYogas,
    d10: d10Karmesh
  })

  // Strong significators 列表供 selectKarmeshReading 做雙重確認
  const strongSignificators = significatorRanking
    .filter((s) => ['exalted', 'own', 'moolatrikona'].includes(s.dignity))
    .slice(0, 4)
    .map((s) => s.planet)
  karmeshContext.strongSignificators = strongSignificators

  // 重算 combinationReading：AMK + strongSignificators 備好後，才能做正確的 variant 選擇
  if (karmeshGraha) {
    combinationReading = selectKarmeshReading(karmeshPlanet, karmeshGraha.house, karmeshContext)
  }

  // ════ 第 9 部分：Narrative Synthesis — 最關鍵的一段文字（含 Karaka Override + D10）════
  const narrative = synthesizeCareerNarrative({
    karmesh: {
      planet: karmeshPlanet,
      house: karmeshGraha?.house,
      rashi: karmeshGraha?.rashi
    },
    lagnaLord,
    activeCareerYogas,
    dignityDetails: karmeshDignityDetails,
    karmeshContext,
    karakaOverrides,
    d10: d10Karmesh
  })

  // ════ 最後一部分：Playbook（實操建議）════
  // 解決「看完不知道怎麼找工作」的痛點
  //
  // 先跑 sub-category detector（business / politics 子類別）— 把結果先組好
  // 再塞進 playbook，這樣 playbook 可以直接 pick up，UI 也能拿到一致的物件。
  const subCategoryDetection = detectCareerSubCategory({
    karmesh: {
      planet: karmeshPlanet,
      house: karmeshGraha?.house,
      dignity: karmeshDignity
    },
    lagnaLord: lagnaLord
      ? {
          planet: lagnaLord.planet,
          house: lagnaLord.house,
          dignity: lagnaLord.dignity
        }
      : null,
    significators: significatorRanking,
    karakaOverrides,
    activeCareerYogas,
    dasha: dashaImpact,
    d10: d10Karmesh
  })

  const playbook = synthesizeCareerPlaybook({
    karmesh: { planet: karmeshPlanet, house: karmeshGraha?.house },
    lagnaLord,
    dasha: dashaImpact,
    karakaOverrides,
    activeCareerYogas,
    subCategoryDetection
  })

  return {
    // 最核心：合成敘事（放在 UI 最上面）
    narrative,
    // Playbook（實操建議 — 那現在該怎麼找工作？）
    playbook,
    // Karaka Overrides（v3 新增）— 自然本命星壓倒性強 → 身份標籤
    karakaOverrides,
    // Yoga 事業啟示（優先級最高）
    activeCareerYogas,
    // 第 1 部分
    foundation: { tenthRashi, tenthOccupants, karmeshPlanet },
    // 第 2 部分（最重要）
    karmesh: {
      planet: karmeshPlanet,
      graha: karmeshGraha,
      rashi: karmeshGraha?.rashi,
      house: karmeshGraha?.house,
      nakshatra: karmeshGraha?.nakshatra,
      nakshatraLord: karmeshNakshatraLord,
      dignity: karmeshDignity,
      dignityInfo: dignityLabels[karmeshDignity],
      dignityDetails: karmeshDignityDetails,
      score: karmeshScore,
      reading: planetAsKarmesh[karmeshPlanet],
      environment: karmeshGraha ? karmeshInHouse[karmeshGraha.house] : null,
      combinationReading,
      specificDirection: karmeshNakshatraLord
        ? {
            nakshatraLord: karmeshNakshatraLord,
            fineDirection: naturalKaraka[karmeshNakshatraLord]
          }
        : null
    },
    // 第 2b 部分（Lagna Lord 加權）
    lagnaLord,
    // 第 3 部分
    significators: significatorRanking,
    // 第 4 部分
    saturn: saturnInfo,
    // 第 5 部分
    amatyakaraka: amk.amatyakaraka
      ? {
          planet: amk.amatyakaraka.planet,
          degree: amk.amatyakaraka.deg,
          karaka: naturalKaraka[amk.amatyakaraka.planet],
          allRanking: amk.ranking
        }
      : null,
    // 第 6 部分
    dasha: dashaImpact,
    // 第 7 部分
    d10: d10Karmesh,
    // Sub-category 偵測（business / politics 細分）— 也在 top-level 露出
    subCategoryDetection
  }
}
