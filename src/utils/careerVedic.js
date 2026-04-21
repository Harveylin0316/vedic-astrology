// 正統吠陀事業分析引擎
//
// 依據 Brihat Parashara Hora Shastra（BPHS）+ Phaladeepika：
//
// 核心分析流程：
//   1. 10 宮本體（Karma Bhava）— 星座、占星
//   2. 10 宮主（Dashamesh）深度分析 — 最關鍵
//      - 所在宮位（事業環境）
//      - 所在星座（尊嚴 Dignity）
//      - 所在月宿（Nakshatra → 精細職業）
//   3. 九大自然徵象（Natural Karakas）— 每顆行星的職業領域
//   4. 特別強調：Saturn = 所有人事業的自然本命星
//   5. Amatyakaraka（AMK）— Jaimini 派的事業靈魂星（度數第 2 高）
//   6. 當前 Dasha 對事業的影響

import {
  planetAsKarmesh,
  karmeshInHouse,
  naturalKaraka,
  rashiLord,
  nakshatraRuler,
  planetDignityMap,
  dignityLabels,
  planetFriendship
} from '../data/careerVedicData.js'
import { scorePlanetForCareer } from './planetStrength.js'

// ═══════════════════════════════════════════════
// 尊嚴 Dignity 計算
// ═══════════════════════════════════════════════
export function computeDignity(planet, rashiName) {
  const d = planetDignityMap[planet]
  if (!d) return 'neutral'
  if (d.exalted === rashiName) return 'exalted'
  if (d.own && d.own.includes(rashiName)) return 'own'
  if (d.debilitated === rashiName) return 'debilitated'
  // 友敵判定
  const signLord = rashiLord[rashiName]
  if (!signLord || planet === 'Rahu' || planet === 'Ketu') return 'neutral'
  const fr = planetFriendship[planet]
  if (!fr) return 'neutral'
  if (fr.friends.includes(signLord)) return 'friendly'
  if (fr.enemies.includes(signLord)) return 'enemy'
  return 'neutral'
}

// ═══════════════════════════════════════════════
// Amatyakaraka 計算（Jaimini 派）
// 度數最高的行星中第 2 名（排除 Rahu/Ketu）
// 通常取 Sun/Moon/Mars/Mercury/Jupiter/Venus/Saturn 7 個行星的度數
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
  // AK = 第 1 名（最高度數）
  // AMK = 第 2 名
  return {
    atmakaraka: withDegrees[0] || null,
    amatyakaraka: withDegrees[1] || null,
    ranking: withDegrees
  }
}

// ═══════════════════════════════════════════════
// 主分析函數
// ═══════════════════════════════════════════════
export function analyzeVedicCareer(chart, currentDashaLord = null, currentADLord = null) {
  // ════ 第 1 部分：10 宮本體 ════
  const tenthRashi = chart.sidereal.houses[9].rashi // index 9 = 10th house
  const karmeshPlanet = rashiLord[tenthRashi.name]

  // 10 宮內的行星（不含 Rahu/Ketu 可選）
  const tenthOccupants = Object.entries(chart.sidereal.grahas)
    .filter(([, g]) => g.house === 10)
    .map(([name, g]) => ({
      planet: name,
      rashi: g.rashi,
      nakshatra: g.nakshatra,
      dignity: computeDignity(name, g.rashi.name),
      naturalDomain: naturalKaraka[name]?.domains || []
    }))

  // ════ 第 2 部分：10 宮主深度分析 ════
  const karmeshGraha = chart.sidereal.grahas[karmeshPlanet]
  const karmeshDignity = karmeshGraha
    ? computeDignity(karmeshPlanet, karmeshGraha.rashi.name)
    : 'neutral'
  const karmeshNakshatraLord = karmeshGraha
    ? nakshatraRuler[karmeshGraha.nakshatra.name]
    : null

  // 力量分數（給 Dasha 時間與整體強弱判斷）
  const karmeshScore = karmeshGraha
    ? scorePlanetForCareer(karmeshPlanet, chart, currentDashaLord, currentADLord)
    : { score: 0, reasons: [] }

  // 是否當前走 10 宮主大運（重要時機）
  const inKarmeshDasha = currentDashaLord === karmeshPlanet

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

  // ════ 第 4 部分：Saturn 特別強調（事業自然本命星）════
  const saturnInfo = {
    planet: 'Saturn',
    scoreData: scorePlanetForCareer('Saturn', chart, currentDashaLord, currentADLord),
    graha: chart.sidereal.grahas.Saturn,
    dignity: computeDignity('Saturn', chart.sidereal.grahas.Saturn?.rashi.name)
  }

  // ════ 第 5 部分：Amatyakaraka ════
  const amk = computeAmatyakaraka(chart)

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

  return {
    // 第 1 部分
    foundation: {
      tenthRashi,
      tenthOccupants,
      karmeshPlanet
    },
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
      score: karmeshScore,
      reading: planetAsKarmesh[karmeshPlanet],
      environment: karmeshGraha ? karmeshInHouse[karmeshGraha.house] : null,
      specificDirection: karmeshNakshatraLord
        ? {
            nakshatraLord: karmeshNakshatraLord,
            fineDirection: naturalKaraka[karmeshNakshatraLord]
          }
        : null
    },
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
    dasha: dashaImpact
  }
}
