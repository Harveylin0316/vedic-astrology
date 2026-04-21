// 創業傾向指數計算器
//
// 創業在吠陀占星裡不是「某個事業類別」，而是「工作的模式」。
// 因此要跨多個命盤因子綜合評估：
//
// 創業傾向（適合自己做老闆）：
//   - Mars 力量（勇氣、行動、抗壓）
//   - Sun 力量（自主、領導、不臣服）
//   - Rahu 在 3/10/11 宮（非典型企圖心）
//   - 10 宮主坐 1/10/11（自主事業）
//   - 11 宮主強（收入多元、靠人脈賺錢）
//   - Jupiter 強（建立事業的智慧與貴人）
//
// 上班傾向（適合進組織、領薪水）：
//   - Jupiter 強（接受指導、有師徒緣）
//   - Mercury 強（擅長團體協作、溝通）
//   - Saturn 坐 10 宮（耐得住組織層級）
//   - 6 宮有行星（服務導向、處理任務）
//   - Moon 在 Karka/Meena（需要穩定環境）
//   - Mars 溫和（不必要冒險）

import { scoreAllPlanets } from './planetStrength.js'

const RASHI_LORD = {
  Mesha: 'Mars', Vrishabha: 'Venus', Mithuna: 'Mercury', Karka: 'Moon',
  Simha: 'Sun', Kanya: 'Mercury', Tula: 'Venus', Vrishchika: 'Mars',
  Dhanu: 'Jupiter', Makara: 'Saturn', Kumbha: 'Saturn', Meena: 'Jupiter'
}

export function computeEntrepreneurship(chart, currentDashaLord, currentAntardashaLord) {
  const planetScores = scoreAllPlanets(chart, currentDashaLord, currentAntardashaLord)
  const g = chart.sidereal.grahas

  // ═════ 創業傾向 ═════
  const entScore = { score: 0, reasons: [] }
  const pushEnt = (text, points) => {
    entScore.score += points
    entScore.reasons.push({ text, points })
  }

  // Mars 力量（勇氣）
  const marsS = planetScores.Mars?.score || 0
  if (marsS >= 7) pushEnt('Mars 強（勇氣、行動力、抗壓）', 2)
  else if (marsS >= 4) pushEnt('Mars 中等（有行動力）', 1)

  // Sun 力量（自主）
  const sunS = planetScores.Sun?.score || 0
  if (sunS >= 7) pushEnt('Sun 強（自主性、不容易服從他人）', 2)
  else if (sunS >= 4) pushEnt('Sun 中等（有自主傾向）', 1)

  // Rahu 在 3/10/11
  const rahu = g.Rahu
  if (rahu) {
    if (rahu.house === 10) pushEnt('Rahu 坐第 10 宮（非典型的事業企圖心）', 3)
    else if (rahu.house === 11) pushEnt('Rahu 坐第 11 宮（突破式收入管道）', 2)
    else if (rahu.house === 3) pushEnt('Rahu 坐第 3 宮（強烈開創驅力）', 2)
  }

  // 10 宮主位置
  const tenthLord = RASHI_LORD[chart.sidereal.houses[9].rashi.name]
  const tenthG = tenthLord ? g[tenthLord] : null
  if (tenthG) {
    if (tenthG.house === 1) pushEnt(`10 宮主 ${tenthLord} 坐第 1 宮（事業 = 你本人）`, 2)
    else if (tenthG.house === 10) pushEnt(`10 宮主 ${tenthLord} 坐第 10 宮（自立事業格）`, 3)
    else if (tenthG.house === 11) pushEnt(`10 宮主 ${tenthLord} 坐第 11 宮（事業變收入網絡）`, 2)
    else if (tenthG.house === 3) pushEnt(`10 宮主 ${tenthLord} 坐第 3 宮（靠自己努力）`, 1)
  }

  // 11 宮主力量（收入多元）
  const eleventhLord = RASHI_LORD[chart.sidereal.houses[10].rashi.name]
  if (eleventhLord && planetScores[eleventhLord]?.score >= 6) {
    pushEnt(`11 宮主 ${eleventhLord} 力量強（靠網絡與多元收入）`, 2)
  }

  // Jupiter 強
  const jupS = planetScores.Jupiter?.score || 0
  if (jupS >= 7) pushEnt('Jupiter 強（建立事業的智慧與貴人）', 2)

  entScore.score = Math.max(0, Math.min(10, entScore.score))

  // ═════ 上班傾向 ═════
  const empScore = { score: 0, reasons: [] }
  const pushEmp = (text, points) => {
    empScore.score += points
    empScore.reasons.push({ text, points })
  }

  // Jupiter 強（但不會用了兩次，這裡是「可與人配合」角度）
  if (jupS >= 7) pushEmp('Jupiter 強（有師徒緣、適合組織內成長）', 1)

  // Mercury 強
  const merS = planetScores.Mercury?.score || 0
  if (merS >= 7) pushEmp('Mercury 強（擅長協作、溝通無礙）', 2)

  // Saturn 坐 10 宮
  if (g.Saturn?.house === 10) {
    pushEmp('Saturn 坐第 10 宮（耐得住長期結構與階級）', 3)
  } else if (g.Saturn?.house === 6) {
    pushEmp('Saturn 坐第 6 宮（擅長處理職場日常瑣事）', 2)
  }

  // 6 宮行星（服務導向）
  const planetsInSix = Object.entries(g)
    .filter(([name, p]) => p.house === 6 && !['Rahu', 'Ketu'].includes(name))
    .map(([name]) => name)
  if (planetsInSix.length >= 1) {
    pushEmp(`第 6 宮有 ${planetsInSix.length} 顆行星（${planetsInSix.join(', ')}）— 服務性工作自然`, 1 + planetsInSix.length)
  }

  // Moon 需要穩定
  const moonR = chart.sidereal.moon.rashi.name
  if (moonR === 'Karka' || moonR === 'Vrishabha') {
    pushEmp(`月亮在 ${moonR}（需要穩定的工作環境）`, 2)
  }

  // Mars 溫和
  if (marsS < 4) pushEmp('Mars 溫和（沒強烈冒險驅力、適合穩定工作）', 1)

  // Rahu 在溫和宮位（非 3/10/11）
  if (rahu && ![3, 10, 11].includes(rahu.house)) {
    pushEmp('Rahu 不在事業激進宮（較無「不顧一切衝」的傾向）', 1)
  }

  empScore.score = Math.max(0, Math.min(10, empScore.score))

  // 判定文字
  const diff = entScore.score - empScore.score
  let verdict = ''
  if (diff >= 3) {
    verdict = '你命盤偏向「自己做」— 組織內會覺得被綁住。'
  } else if (diff >= 1) {
    verdict = '你略偏向自主，但也能接受穩定的組織工作。'
  } else if (diff >= -1) {
    verdict = '兩種都能走 — 可以先在組織累積資源再出來創業。'
  } else if (diff >= -3) {
    verdict = '你略偏向穩定上班，但不排斥某些合夥或副業。'
  } else {
    verdict = '你命盤偏向「進體系」— 組織或大企業的穩定能讓你發揮。'
  }

  return {
    entrepreneurship: entScore,
    employment: empScore,
    diff,
    verdict
  }
}
