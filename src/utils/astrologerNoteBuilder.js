// 占星師深度筆記 · 組裝器
//
// 輸入：chart（來自 computeVedicChart）、persona（可選）
// 輸出：{ greeting, sections[], closing }
//
// 判讀依據：
//   - greeting  → Lagna rashi
//   - family    → Moon rashi
//   - intimacy  → Venus rashi
//   - reaction  → Lagna rashi
//   - selfCriticism → Moon rashi（取 shadow side）
//   - money     → Jupiter rashi
//   - lifeCourse → Rahu 所在宮位 (1-12)
//   - closing   → Atmakaraka（度數最高行星，排除 Rahu/Ketu）

import {
  greetings,
  familyReadings,
  intimacyReadings,
  reactionReadings,
  selfCriticismReadings,
  moneyReadings,
  lifeCourseReadings,
  closings,
  sectionTitles
} from '../data/astrologerNote.js'

// ────────────────────────────────────────────────
// 計算 Atmakaraka（不依賴 careerVedic，避免循環引用）
// 規則：9 行星裡度數最高者（排除 Rahu/Ketu）
// ────────────────────────────────────────────────
function computeAtmakaraka(chart) {
  if (!chart?.sidereal?.grahas) return null
  const candidates = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']
  const ranked = candidates
    .map((p) => {
      const g = chart.sidereal.grahas[p]
      return g ? { planet: p, deg: g.degreeInSign } : null
    })
    .filter(Boolean)
    .sort((a, b) => b.deg - a.deg)
  return ranked[0] || null
}

function safeRashiName(graha) {
  return graha?.rashi?.name || null
}

// ────────────────────────────────────────────────
// 主 builder
// ────────────────────────────────────────────────
export function buildAstrologerNote(chart /*, persona */) {
  if (!chart?.sidereal) return null

  const lagnaRashi = chart.sidereal.ascendant?.rashi?.name
  const moonRashi = safeRashiName(chart.sidereal.grahas?.Moon)
  const venusRashi = safeRashiName(chart.sidereal.grahas?.Venus)
  const jupiterRashi = safeRashiName(chart.sidereal.grahas?.Jupiter)
  const rahuHouse = chart.sidereal.grahas?.Rahu?.house

  // ── 開場白（依 Lagna；若取不到退回月亮）
  const greeting =
    greetings[lagnaRashi] ||
    greetings[moonRashi] ||
    greetings.Tula

  // ── 6 個主題段落
  const sections = [
    {
      id: 'family',
      title: sectionTitles.family,
      rashi: moonRashi,
      body: familyReadings[moonRashi] || familyReadings.Karka
    },
    {
      id: 'intimacy',
      title: sectionTitles.intimacy,
      rashi: venusRashi,
      body: intimacyReadings[venusRashi] || intimacyReadings.Tula
    },
    {
      id: 'reaction',
      title: sectionTitles.reaction,
      rashi: lagnaRashi,
      body: reactionReadings[lagnaRashi] || reactionReadings.Tula
    },
    {
      id: 'selfCriticism',
      title: sectionTitles.selfCriticism,
      rashi: moonRashi,
      body: selfCriticismReadings[moonRashi] || selfCriticismReadings.Karka
    },
    {
      id: 'money',
      title: sectionTitles.money,
      rashi: jupiterRashi,
      body: moneyReadings[jupiterRashi] || moneyReadings.Dhanu
    },
    {
      id: 'lifeCourse',
      title: sectionTitles.lifeCourse,
      house: rahuHouse,
      body: lifeCourseReadings[rahuHouse] || lifeCourseReadings[1]
    }
  ]

  // ── 結語（依 Atmakaraka）
  const ak = computeAtmakaraka(chart)
  const closing =
    (ak && closings[ak.planet]) ||
    closings.Sun

  return {
    greeting,
    sections,
    closing,
    meta: {
      lagnaRashi,
      moonRashi,
      venusRashi,
      jupiterRashi,
      rahuHouse,
      atmakaraka: ak?.planet || null
    }
  }
}
