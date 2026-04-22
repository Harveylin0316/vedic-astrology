// Yoga 偵測引擎 — 偵測命盤中的古典吠陀 Yoga（行星特殊組合）
// 每個 Yoga 偵測需要知道：哪些行星、在哪些宮位/星座、相對關係
//
// Raman 派重視：Panchamahapurusha Yoga（五大偉人瑜伽）、Raj Yoga（皇家組合）、
// Dhana Yoga（財富）、Gaja Kesari（象王）、Kemadruma（月孤）、Neecha Bhanga（挫折轉化）

import { rashis } from '../data/rashis.js'

// ── Kendra 宮 = 1, 4, 7, 10（角宮，最強力量）
// ── Trikona 宮 = 1, 5, 9（三角宮，最吉）
// ── Dushtana 宮 = 6, 8, 12（挫折宮）
// ── Upachaya 宮 = 3, 6, 10, 11（增長宮）
const KENDRA = [1, 4, 7, 10]
const TRIKONA = [1, 5, 9]
const DUSHTANA = [6, 8, 12]

// 行星「自己的星座」
const OWN_SIGNS = {
  Sun: ['Simha'],
  Moon: ['Karka'],
  Mars: ['Mesha', 'Vrishchika'],
  Mercury: ['Mithuna', 'Kanya'],
  Jupiter: ['Dhanu', 'Meena'],
  Venus: ['Vrishabha', 'Tula'],
  Saturn: ['Makara', 'Kumbha']
  // Rahu/Ketu 無 own sign
}

// 行星 Exaltation（旺）
const EXALTATION = {
  Sun: 'Mesha',
  Moon: 'Vrishabha',
  Mars: 'Makara',
  Mercury: 'Kanya',
  Jupiter: 'Karka',
  Venus: 'Meena',
  Saturn: 'Tula',
  Rahu: 'Vrishabha',
  Ketu: 'Vrishchika'
}

// 行星 Debilitation（弱）
const DEBILITATION = {
  Sun: 'Tula',
  Moon: 'Vrishchika',
  Mars: 'Karka',
  Mercury: 'Meena',
  Jupiter: 'Makara',
  Venus: 'Kanya',
  Saturn: 'Mesha',
  Rahu: 'Vrishchika',
  Ketu: 'Vrishabha'
}

// 5 Panchamahapurusha Yoga — 行星在自己／旺宮且在 Kendra（角宮）
const PANCHAMAHAPURUSHA = {
  Mars: 'Ruchaka',    // 行動英雄
  Mercury: 'Bhadra',  // 智慧行者
  Jupiter: 'Hamsa',   // 天鵝（純粹）
  Venus: 'Malavya',   // 藝術家
  Saturn: 'Shasha'    // 領導者
}

// 相互交換（Parivartana）— 兩行星互相進入對方的星座
function detectParivartana(grahas) {
  const detected = []
  const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i]
      const p2 = planets[j]
      const r1 = grahas[p1].rashi.name
      const r2 = grahas[p2].rashi.name
      const p1Owns = OWN_SIGNS[p1] || []
      const p2Owns = OWN_SIGNS[p2] || []
      if (p1Owns.includes(r2) && p2Owns.includes(r1)) {
        detected.push({ p1, p2, r1, r2 })
      }
    }
  }
  return detected
}

// 主要 Yoga 偵測邏輯
//
// @param {Object} chart
// @param {Object} [options]
//   - strict: boolean — 嚴格模式（用於 rarity 計算，讓古典 yoga 真的少見）
//     · Mahapurusha：只接受 exalted，不接受 own-sign
//     · Gaja Kesari：Moon 與 Jupiter 都不能 debilitated
//     · Parivartana：只計 Kendra / Trikona 宮位的互換
//     · Budha Aditya：Mercury 不能被 Sun 焚燒（>= 6° 分隔）
//     · Raj Yoga：兩個 lord 都必須 non-debilitated
//   - 事業判讀（analyzeVedicCareer）用預設 permissive 模式，不受 strict 影響
export function detectYogas(chart, options = {}) {
  const { strict = false } = options
  const yogas = []
  const g = chart.sidereal.grahas
  const ascLord = rashiLord(chart.sidereal.ascendant.rashi.name)

  // ═════ 1-5. Panchamahapurusha Yoga（五大偉人瑜伽）═════
  for (const [planet, yogaName] of Object.entries(PANCHAMAHAPURUSHA)) {
    const graha = g[planet]
    const isExalted = EXALTATION[planet] === graha.rashi.name
    const isOwnSign = (OWN_SIGNS[planet] || []).includes(graha.rashi.name)
    const isInOwnOrExalt = isExalted || isOwnSign
    const isInKendra = KENDRA.includes(graha.house)
    // strict: 只接受 exalted（真正罕見的古典定義）
    const qualifies = strict ? (isExalted && isInKendra) : (isInOwnOrExalt && isInKendra)
    if (qualifies) {
      yogas.push({
        id: `mahapurusha-${planet}`,
        name: `${yogaName} Yoga`,
        type: 'benefic',
        rarity: 'uncommon',
        signature: `${planet} 在 ${graha.rashi.chinese}（${isExalted ? '旺宮' : '本宮'}）落第 ${graha.house} 宮`,
        meaning: mahapurushaMeaning(yogaName),
        prediction: mahapurushaPrediction(yogaName)
      })
    }
  }

  // ═════ 6. Gaja Kesari Yoga（象王瑜伽）═════
  // Moon 與 Jupiter 形成 Kendra（1, 4, 7, 10 宮位相距）
  {
    const moonHouse = g.Moon.house
    const jupHouse = g.Jupiter.house
    const diff = ((jupHouse - moonHouse + 12) % 12) + 1
    const inKendra = [1, 4, 7, 10].includes(diff)
    // strict: 要求 Moon 跟 Jupiter 都不 debilitated（Parashara 派）
    const moonDebilitated = g.Moon.rashi.name === DEBILITATION.Moon
    const jupDebilitated = g.Jupiter.rashi.name === DEBILITATION.Jupiter
    const qualifies = strict ? (inKendra && !moonDebilitated && !jupDebilitated) : inKendra
    if (qualifies) {
      yogas.push({
        id: 'gaja-kesari',
        name: 'Gaja Kesari 象王瑜伽',
        type: 'benefic',
        rarity: 'common',
        signature: `月亮在第 ${moonHouse} 宮、木星在第 ${jupHouse} 宮（成 Kendra 角宮）`,
        meaning: '智慧、聲望、貴人、情感與理性的和諧',
        prediction: '你有天生的智慧與群眾魅力。中年後會累積實質的聲望與財富。重要時刻會有貴人出現。'
      })
    }
  }

  // ═════ 7. Budha Aditya Yoga（水太陽同宮）═════
  // Sun + Mercury 同宮 → 智慧與表達力強
  // strict: Mercury 不能被 Sun 焚燒（> 6° 分隔），否則水星力量消失
  {
    const sameHouse = g.Sun.house === g.Mercury.house
    let qualifies = sameHouse
    if (strict && sameHouse) {
      const lonDiff = Math.abs(g.Sun.longitude - g.Mercury.longitude)
      const separation = Math.min(lonDiff, 360 - lonDiff)
      qualifies = separation >= 6 // 水星離太陽 >=6° 才算非焚燒
    }
    if (qualifies) {
      yogas.push({
        id: 'budha-aditya',
        name: 'Budha Aditya Yoga 水太陽',
        type: 'benefic',
        rarity: 'common',
        signature: `太陽和水星同在第 ${g.Sun.house} 宮`,
        meaning: '智慧＋表達力＋權威的組合',
        prediction: '你頭腦清晰、能把想法說出來讓人信服。適合學者、作家、演講者、知識型工作。'
      })
    }
  }

  // ═════ 8. Chandra Mangal Yoga（月火瑜伽）═════
  // Moon + Mars 同宮 → 情緒＋行動力，多為賺錢動能
  if (g.Moon.house === g.Mars.house) {
    yogas.push({
      id: 'chandra-mangal',
      name: 'Chandra Mangal Yoga 月火瑜伽',
      type: 'benefic',
      rarity: 'uncommon',
      signature: `月亮和火星同在第 ${g.Moon.house} 宮`,
      meaning: '情感 × 行動力 = 特殊的財富動能',
      prediction: '你把情感變成行動力，特別會「想到就做」。商業嗅覺強，但情緒波動也會影響財務決策。'
    })
  }

  // ═════ 9. Raj Yoga（Kendra + Trikona 宮主結合）═════
  // Lagna/4/7/10 宮主 與 1/5/9 宮主同宮、互視、互換 → 皇家運勢
  // 簡化偵測：Lagna 主（1 宮主）與 5 或 9 宮主同宮或互換
  // strict: 兩個 lord 都必須非 debilitated
  {
    const lord1 = rashiLord(chart.sidereal.houses[0].rashi.name)
    const lord5 = rashiLord(chart.sidereal.houses[4].rashi.name)
    const lord9 = rashiLord(chart.sidereal.houses[8].rashi.name)
    const candidates = [lord5, lord9].filter((l) => l && g[lord1] && g[l] && g[lord1].house === g[l].house)
    const hit = candidates.length > 0
    let qualifies = hit
    if (strict && hit) {
      // 兩 lord 都不能 debilitated
      const lord1Debil = g[lord1].rashi.name === DEBILITATION[lord1]
      const matchLord = candidates[0]
      const matchLordDebil = g[matchLord].rashi.name === DEBILITATION[matchLord]
      qualifies = !lord1Debil && !matchLordDebil
    }
    if (qualifies) {
      yogas.push({
        id: 'raj-yoga',
        name: 'Raj Yoga 皇家瑜伽',
        type: 'benefic',
        rarity: 'common',
        signature: `1 宮主 ${lord1} 與 5/9 宮主同宮`,
        meaning: '具有領導力、公共聲望、命中的成就位',
        prediction: '你有「站到高位」的命格。事業會比同齡人走得遠，但要在對的時間出手。'
      })
    }
  }

  // ═════ 10. Dhana Yoga（財富瑜伽）═════
  // 2 宮主 與 11 宮主同宮或互視（簡化偵測）
  {
    const lord2 = rashiLord(chart.sidereal.houses[1].rashi.name)
    const lord11 = rashiLord(chart.sidereal.houses[10].rashi.name)
    if (lord2 && lord11 && g[lord2] && g[lord11] && g[lord2].house === g[lord11].house) {
      yogas.push({
        id: 'dhana-yoga',
        name: 'Dhana Yoga 財富瑜伽',
        type: 'benefic',
        rarity: 'common',
        signature: `2 宮主 ${lord2} 與 11 宮主 ${lord11} 同宮`,
        meaning: '財庫與收入管道的融合',
        prediction: '你有穩定生財的命格。收入會透過多管道進入，特別是人脈與親友關係。'
      })
    }
  }

  // ═════ 11. Kemadruma Yoga（月孤瑜伽）═════
  // 月亮前後宮位都無行星（除太陽、Rahu、Ketu 外），且月亮自身不受其他行星守望
  {
    const moonHouse = g.Moon.house
    const prevHouse = ((moonHouse - 2 + 12) % 12) + 1
    const nextHouse = (moonHouse % 12) + 1
    const planetsOther = ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']
    const hasNeighbor = planetsOther.some(
      (p) => g[p].house === prevHouse || g[p].house === nextHouse || g[p].house === moonHouse
    )
    if (!hasNeighbor) {
      yogas.push({
        id: 'kemadruma',
        name: 'Kemadruma Yoga 月孤瑜伽',
        type: 'malefic',
        rarity: 'uncommon',
        signature: `月亮在第 ${moonHouse} 宮，前後宮及本宮都沒有行星陪伴`,
        meaning: '心智孤立、情感易空虛',
        prediction: '你比同齡人更容易感到「沒人真的懂我」。需要刻意建立情感支援系統，獨處會是你的常態也可能是負擔。'
      })
    }
  }

  // ═════ 12. Parivartana Yoga（相互交換）═════
  // strict: 只算落在 Kendra (1/4/7/10) 或 Trikona (1/5/9) 的互換
  //         （其他宮位的互換不屬於古典 Raja Parivartana）
  detectParivartana(g).forEach(({ p1, p2, r1, r2 }) => {
    if (strict) {
      const goodHouses = [1, 4, 5, 7, 9, 10]
      if (!(goodHouses.includes(g[p1].house) && goodHouses.includes(g[p2].house))) {
        return
      }
    }
    yogas.push({
      id: `parivartana-${p1}-${p2}`,
      name: `${p1}-${p2} Parivartana 交換瑜伽`,
      type: 'benefic',
      rarity: 'rare',
      signature: `${p1} 在 ${rashis.find((r) => r.name === r1)?.chinese}、${p2} 在 ${rashis.find((r) => r.name === r2)?.chinese}（互換本宮）`,
      meaning: '兩行星的生活領域強力交織',
      prediction: `你的「${p1} 領域」與「${p2} 領域」有強烈互動。其中一個變動會帶動另一個。`
    })
  })

  // ═════ 13. Neecha Bhanga Raja Yoga（挫折轉化）═════
  // 有行星在 Debilitation 星座 + 另一行星能「解救」它（同宮或守星座的主星在 Kendra）
  // strict 模式：只計 7 classical planets（不含 Rahu/Ketu）
  //             且解救者必須 non-debilitated + 在 Kendra（需雙條件）
  const debilPlanets = strict
    ? ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']
    : Object.keys(DEBILITATION)
  for (const planet of debilPlanets) {
    const debilSign = DEBILITATION[planet]
    if (!g[planet] || !debilSign) continue
    if (g[planet].rashi.name === debilSign) {
      const debilSignLord = rashiLord(debilSign)
      const exaltSign = EXALTATION[planet]
      const exaltSignLord = rashiLord(exaltSign)
      const rescuerOk = (lord) => {
        if (!lord || !g[lord]) return false
        if (!KENDRA.includes(g[lord].house)) return false
        // strict: rescuer 本身不能也 debilitated
        if (strict && DEBILITATION[lord] === g[lord].rashi.name) return false
        return true
      }
      const redemption = rescuerOk(debilSignLord) || rescuerOk(exaltSignLord)
      if (redemption) {
        yogas.push({
          id: `neecha-bhanga-${planet}`,
          name: `${planet} Neecha Bhanga Raja Yoga 挫折轉化`,
          type: 'benefic',
          rarity: 'rare',
          signature: `${planet} 雖落陷於 ${rashis.find((r) => r.name === debilSign)?.chinese}，但有解救者在 Kendra`,
          meaning: '低谷中反而長出力量',
          prediction: `${planet} 相關的生活面向（見領域對照），你會經歷早期不順但後期強力翻轉。這種困境反而成為你的獨特武器。`
        })
      }
    }
  }

  // ═════ 14. Vipreet Raj Yoga（反向皇家瑜伽）═════
  // 6/8/12 宮的宮主互相置於 6/8/12 宮（困境轉勝）
  {
    const lord6 = rashiLord(chart.sidereal.houses[5].rashi.name)
    const lord8 = rashiLord(chart.sidereal.houses[7].rashi.name)
    const lord12 = rashiLord(chart.sidereal.houses[11].rashi.name)
    const lordsInDushtana = [lord6, lord8, lord12].filter(
      (l) => l && g[l] && DUSHTANA.includes(g[l].house)
    )
    if (lordsInDushtana.length >= 2) {
      yogas.push({
        id: 'vipreet-raj',
        name: 'Vipreet Raj Yoga 反向皇家瑜伽',
        type: 'benefic',
        rarity: 'uncommon',
        signature: '6/8/12 宮主彼此落於挫折宮 — 困境相消',
        meaning: '苦難轉化為成就的命格',
        prediction: '你的人生有一個「從谷底站起來」的故事 — 而且那段經驗反而成為你的人生本錢。'
      })
    }
  }

  // ═════ 15. Saraswati Yoga（智慧瑜伽）═════
  // 木星、金星、水星都在 Kendra 或 Trikona
  {
    const jupKendraOrTrikona = [...KENDRA, ...TRIKONA].includes(g.Jupiter.house)
    const venKendraOrTrikona = [...KENDRA, ...TRIKONA].includes(g.Venus.house)
    const merKendraOrTrikona = [...KENDRA, ...TRIKONA].includes(g.Mercury.house)
    if (jupKendraOrTrikona && venKendraOrTrikona && merKendraOrTrikona) {
      yogas.push({
        id: 'saraswati',
        name: 'Saraswati Yoga 智慧女神瑜伽',
        type: 'benefic',
        rarity: 'uncommon',
        signature: '木星、金星、水星同時落於 Kendra 或 Trikona',
        meaning: '藝術、知識、表達的全方位天賦',
        prediction: '你在知識、寫作、藝術、語言方面有天賦。適合教學、創作、出版類工作。'
      })
    }
  }

  return yogas
}

// 星座 → 主星
function rashiLord(rashiName) {
  const map = {
    Mesha: 'Mars', Vrishabha: 'Venus', Mithuna: 'Mercury', Karka: 'Moon',
    Simha: 'Sun', Kanya: 'Mercury', Tula: 'Venus', Vrishchika: 'Mars',
    Dhanu: 'Jupiter', Makara: 'Saturn', Kumbha: 'Saturn', Meena: 'Jupiter'
  }
  return map[rashiName]
}

function mahapurushaMeaning(yogaName) {
  const map = {
    Ruchaka: '戰士、英雄、勇氣型成就者',
    Bhadra: '智者、演說家、學術／商業天才',
    Hamsa: '清高的導師、信念強的靈性領袖',
    Malavya: '藝術家、美的大師、感官享受者',
    Shasha: '沉穩領導者、服務大眾的掌權者'
  }
  return map[yogaName]
}

function mahapurushaPrediction(yogaName) {
  const map = {
    Ruchaka: '你有戰士型的命格，敢衝敢拚、體能好、領導力強。軍警、運動、創業、外科都能發揮。一生會有「關鍵大戰」般的重大挑戰但你會贏。',
    Bhadra: '你有智慧型的命格，讀書快、表達強、嗅覺商業敏感。適合學者、律師、顧問、企業家。中年後會累積很大的知識影響力。',
    Hamsa: '你有導師型的命格，氣度寬宏、信念堅定、受人尊敬。適合教育、宗教、文化、高等學問。貴人多，人生後期特別豐盛。',
    Malavya: '你有藝術家型的命格，審美強、異性緣好、享受人生。適合時尚、設計、藝術、娛樂、精品業。一生物質與精神都不匱乏。',
    Shasha: '你有紀律領導型的命格，耐力強、能服務大眾、晚運最旺。適合政府、大企業、工程、建築。你是越老越有份量的那種人。'
  }
  return map[yogaName]
}
