// 占星師深度筆記 · 組裝器 v2
//
// v2 新增：
//   - axisInsight（軸心洞察）← Moon rashi
//   - authorization（授權時刻）← Venus rashi
//   - bodyWarning（身體警告）← Mars rashi
//   - contrarian（反主流建議）← Saturn rashi
//   - closings 重寫為「推你一下」
//
// 判讀依據：
//   - greeting        → Lagna rashi
//   - axisInsight     → Moon rashi（整份筆記的軸心）
//   - family          → Moon rashi
//   - intimacy        → Venus rashi
//   - reaction        → Lagna rashi
//   - selfCriticism   → Moon rashi（取 shadow side）
//   - authorization   → Venus rashi（主慾望、該屬於你的）
//   - money           → Jupiter rashi
//   - bodyWarning     → Mars rashi（主身體、衝動、意外）
//   - contrarian      → Saturn rashi（主體制、社會期待、責任）
//   - lifeCourse      → Rahu 所在宮位 (1-12)
//   - closing         → Atmakaraka（度數最高行星，排除 Rahu/Ketu）

import {
  greetings,
  axisInsights,
  familyReadings,
  intimacyReadings,
  reactionReadings,
  selfCriticismReadings,
  authorizationReadings,
  moneyReadings,
  bodyWarnings,
  contrarianAdvice,
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
  const marsRashi = safeRashiName(chart.sidereal.grahas?.Mars)
  const jupiterRashi = safeRashiName(chart.sidereal.grahas?.Jupiter)
  const saturnRashi = safeRashiName(chart.sidereal.grahas?.Saturn)
  const rahuHouse = chart.sidereal.grahas?.Rahu?.house

  // ── 開場白（依 Lagna；若取不到退回月亮）
  const greeting =
    greetings[lagnaRashi] ||
    greetings[moonRashi] ||
    greetings.Tula

  // ── 軸心洞察（依 Moon rashi）— 整份筆記其實只在講一件事
  const axisInsight =
    axisInsights[moonRashi] ||
    axisInsights.Karka

  // ── 9 個主題段落（v2 新增 authorization / bodyWarning / contrarian）
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
      id: 'authorization',
      title: sectionTitles.authorization,
      rashi: venusRashi,
      body: authorizationReadings[venusRashi] || authorizationReadings.Tula
    },
    {
      id: 'money',
      title: sectionTitles.money,
      rashi: jupiterRashi,
      body: moneyReadings[jupiterRashi] || moneyReadings.Dhanu
    },
    {
      id: 'bodyWarning',
      title: sectionTitles.bodyWarning,
      rashi: marsRashi,
      body: bodyWarnings[marsRashi] || bodyWarnings.Mesha
    },
    {
      id: 'contrarian',
      title: sectionTitles.contrarian,
      rashi: saturnRashi,
      body: contrarianAdvice[saturnRashi] || contrarianAdvice.Makara
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
    axisInsight,
    sections,
    closing,
    meta: {
      lagnaRashi,
      moonRashi,
      venusRashi,
      marsRashi,
      jupiterRashi,
      saturnRashi,
      rahuHouse,
      atmakaraka: ak?.planet || null
    }
  }
}
