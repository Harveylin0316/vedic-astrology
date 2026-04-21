// 行星職業力量計分 — 完全基於古典 Vedic 規則
// 每一分都可追溯到具體的命盤位置（宮位、星座、主星、大運）
//
// 計分依據（古典 Parashara + Raman 派綜合）：
//   1. Shadbala（六力）簡化版：星座強度、宮位強度
//   2. Kendra / Trikona / Dusthana 宮位分類
//   3. 與 10 宮（事業宮）的直接連結
//   4. 是否為 10 宮主星
//   5. 在財庫宮（2、11 宮）的加分
//   6. 當前 Dasha 支持度
//   7. 落陷 / 燃燒（combust）的扣分

// 行星原始屬性（星座歸屬）
const PLANET_ATTRIBUTES = {
  Sun: {
    ownSigns: ['Simha'],
    exalted: 'Mesha',
    debilitated: 'Tula'
  },
  Moon: {
    ownSigns: ['Karka'],
    exalted: 'Vrishabha',
    debilitated: 'Vrishchika'
  },
  Mars: {
    ownSigns: ['Mesha', 'Vrishchika'],
    exalted: 'Makara',
    debilitated: 'Karka'
  },
  Mercury: {
    ownSigns: ['Mithuna', 'Kanya'],
    exalted: 'Kanya',
    debilitated: 'Meena'
  },
  Jupiter: {
    ownSigns: ['Dhanu', 'Meena'],
    exalted: 'Karka',
    debilitated: 'Makara'
  },
  Venus: {
    ownSigns: ['Vrishabha', 'Tula'],
    exalted: 'Meena',
    debilitated: 'Kanya'
  },
  Saturn: {
    ownSigns: ['Makara', 'Kumbha'],
    exalted: 'Tula',
    debilitated: 'Mesha'
  },
  Rahu: {
    ownSigns: [],
    exalted: 'Vrishabha',
    debilitated: 'Vrishchika'
  },
  Ketu: {
    ownSigns: [],
    exalted: 'Vrishchika',
    debilitated: 'Vrishabha'
  }
}

// 星座 → 主星對照
const RASHI_LORD = {
  Mesha: 'Mars', Vrishabha: 'Venus', Mithuna: 'Mercury', Karka: 'Moon',
  Simha: 'Sun', Kanya: 'Mercury', Tula: 'Venus', Vrishchika: 'Mars',
  Dhanu: 'Jupiter', Makara: 'Saturn', Kumbha: 'Saturn', Meena: 'Jupiter'
}

const KENDRA = [1, 4, 7, 10]
const TRIKONA = [1, 5, 9]
const DUSTHANA = [6, 8, 12]

// 主要計分函數
// @returns { score, reasons: [{text, points}] }
export function scorePlanetForCareer(planet, chart, currentDashaLord, currentAntardashaLord) {
  const g = chart.sidereal.grahas[planet]
  if (!g) return { score: 0, reasons: [] }
  const attrs = PLANET_ATTRIBUTES[planet]

  let score = 0
  const reasons = []

  const addReason = (text, points) => {
    score += points
    reasons.push({ text, points })
  }

  // 1. 星座強度（核心）
  if (attrs.ownSigns.includes(g.rashi.name)) {
    addReason(`在自己星座 ${g.rashi.chinese}（Swakshetra）`, 3)
  } else if (g.rashi.name === attrs.exalted) {
    addReason(`旺於 ${g.rashi.chinese}（Uccha）`, 4)
  } else if (g.rashi.name === attrs.debilitated) {
    addReason(`陷於 ${g.rashi.chinese}（Neecha）`, -3)
  }

  // 2. 宮位強度
  if (KENDRA.includes(g.house)) {
    addReason(`坐角宮（第 ${g.house} 宮 Kendra）`, 2)
  } else if (TRIKONA.includes(g.house) && !KENDRA.includes(g.house)) {
    addReason(`坐三角宮（第 ${g.house} 宮 Trikona）`, 2)
  } else if (DUSTHANA.includes(g.house)) {
    addReason(`坐凶宮（第 ${g.house} 宮 Dusthana）`, -2)
  }

  // 3. 直接坐事業宮
  if (g.house === 10) {
    addReason(`直接坐第 10 宮（事業宮）`, 5)
  }

  // 4. 是否為 10 宮主星
  const tenthRashi = chart.sidereal.houses[9].rashi.name
  const tenthLord = RASHI_LORD[tenthRashi]
  if (planet === tenthLord) {
    addReason(`是你的第 10 宮主星（事業方向決定者）`, 4)
  }

  // 5. 在財庫宮
  if (g.house === 2) {
    addReason(`坐第 2 宮（財庫）`, 2)
  } else if (g.house === 11) {
    addReason(`坐第 11 宮（收入與人脈）`, 2)
  }

  // 6. Dasha 支持度
  if (planet === currentDashaLord) {
    addReason(`當前走 ${planet} 大運 — 直接激活`, 5)
  } else if (planet === currentAntardashaLord && planet !== currentDashaLord) {
    addReason(`當前小運（Antardasha）是 ${planet}`, 3)
  }

  // 7. 燃燒（combust）— 太近太陽
  if (planet !== 'Sun' && planet !== 'Rahu' && planet !== 'Ketu') {
    const sunLon = chart.sidereal.sun.longitude
    const planetLon = g.longitude
    const diff = Math.abs(((planetLon - sunLon + 540) % 360) - 180)
    const separation = 180 - diff
    const combustOrb = combustOrbFor(planet)
    if (separation < combustOrb) {
      addReason(`燃燒於太陽 ${separation.toFixed(1)}°（Astangata）`, -2)
    }
  }

  return { planet, score, reasons }
}

function combustOrbFor(planet) {
  // 古典 orb（度）
  const orbs = { Moon: 12, Mars: 17, Mercury: 14, Jupiter: 11, Venus: 10, Saturn: 15 }
  return orbs[planet] || 10
}

// 一次算所有 9 顆行星
export function scoreAllPlanets(chart, currentDashaLord, currentAntardashaLord) {
  const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']
  const results = {}
  for (const p of planets) {
    results[p] = scorePlanetForCareer(p, chart, currentDashaLord, currentAntardashaLord)
  }
  return results
}

export { RASHI_LORD }
