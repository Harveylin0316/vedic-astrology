// 事業多因子分析
// 結合 Lagna + Sun + Moon + 10宮 + Saturn + 當前大運，產出結構化的職場解讀

import {
  workIdentityByLagna,
  workSoulBySun,
  workStressByMoon,
  careerDirectionByTenthLord,
  careerFocusBy10thLordHouse,
  careerCeilingBySaturn,
  dashaCareerVector,
  rashiLordMap
} from '../data/careerReadings.js'

// 產出完整事業分析結構
// 入參：chart（computeVedicChart 結果）+ dashaLord（當前大運行星名，可選）
export function analyzeCareer(chart, dashaLord = null) {
  const tropLagna = chart.tropical.ascendant.rashi.name
  const tropSun = chart.tropical.sun.rashi.name
  const tropMoon = chart.tropical.moon.rashi.name

  // 事業宮 = 10 宮 (sidereal)
  const tenthHouseRashi = chart.sidereal.houses[9].rashi
  const tenthLord = rashiLordMap[tenthHouseRashi.name]
  const tenthLordGraha = chart.sidereal.grahas[tenthLord]
  const tenthLordHouse = tenthLordGraha?.house

  // 10 宮當前有哪些行星
  const tenantsInTenth = Object.entries(chart.sidereal.grahas)
    .filter(([, g]) => g.house === 10)
    .map(([name]) => name)

  const saturnHouse = chart.sidereal.grahas.Saturn?.house

  return {
    identity: workIdentityByLagna[tropLagna] || null,
    soul: workSoulBySun[tropSun] || null,
    stress: workStressByMoon[tropMoon] || null,

    tenthHouse: {
      rashi: tenthHouseRashi,
      lord: tenthLord,
      lordHouse: tenthLordHouse,
      tenants: tenantsInTenth,
      direction: careerDirectionByTenthLord[tenthLord] || null,
      focus: tenthLordHouse ? careerFocusBy10thLordHouse[tenthLordHouse] : null
    },

    saturn: {
      house: saturnHouse,
      ceiling: saturnHouse ? careerCeilingBySaturn[saturnHouse] : null
    },

    dasha: dashaLord
      ? { lord: dashaLord, vector: dashaCareerVector[dashaLord] }
      : null
  }
}
