// 事業類別排名引擎（雙維度：力量 + 契合度）
//
// 力量分數 strengthScore ─ 主宰星在命盤中的力量（Raman 嚴格規則）
//                         = 主宰星分數 × 1.0 + 輔助星分數 × 0.5
//                         回答：「你能不能做好這類工作」
//
// 契合分數 fitScore ─ 你的 Lagna × Sun × Moon 元素 vs 類別元素需求
//                     Moon 加權 ×2（月亮代表真正的情感偏好）
//                     回答：「你性格上會不會喜歡這類工作」
//
// 綜合分 combined = 力量 50% + 契合 50%（normalized）

import { CAREER_CATEGORIES } from '../data/careerCategoriesRanked.js'
import { scoreAllPlanets } from './planetStrength.js'

// Rashi → 元素
const RASHI_ELEMENT = {
  Mesha: 'fire', Simha: 'fire', Dhanu: 'fire',
  Vrishabha: 'earth', Kanya: 'earth', Makara: 'earth',
  Mithuna: 'air', Tula: 'air', Kumbha: 'air',
  Karka: 'water', Vrishchika: 'water', Meena: 'water'
}

// 計算用戶三大元素分佈（Moon ×2, Sun/Lagna ×1）
function computeUserElements(chart) {
  const elements = { fire: 0, earth: 0, air: 0, water: 0 }
  const lagna = RASHI_ELEMENT[chart.tropical.ascendant.rashi.name]
  const sun = RASHI_ELEMENT[chart.tropical.sun.rashi.name]
  const moon = RASHI_ELEMENT[chart.tropical.moon.rashi.name]
  if (lagna) elements[lagna] += 1
  if (sun) elements[sun] += 1
  if (moon) elements[moon] += 2 // 月亮是情感偏好核心，加權
  return elements
}

// 計算單一類別的契合分（0-12 raw → 0-10 normalized）
function computeFitScore(category, userElements) {
  const aff = category.elementAffinity || { fire: 1, earth: 1, air: 1, water: 1 }
  // Dot product: sum(userElement × affinity)
  let raw = 0
  for (const el of ['fire', 'earth', 'air', 'water']) {
    raw += (userElements[el] || 0) * (aff[el] || 0)
  }
  // Max possible: 4 (user 總元素數) × 3 (max affinity) = 12
  return Math.max(0, Math.min(10, (raw / 12) * 10))
}

// 力量分 → 0-10 normalized（raw strength 範圍約 -5 到 +25，典型 0-15）
function normalizeStrength(s) {
  // 線性 map：0 分 = 0, 20 分 = 10
  return Math.max(0, Math.min(10, s / 2))
}

// 星等（1-5）
export function scoreToStars(score10) {
  if (score10 >= 8) return 5
  if (score10 >= 6) return 4
  if (score10 >= 4) return 3
  if (score10 >= 2) return 2
  if (score10 >= 1) return 1
  return 0
}

// 綜合分數的層級文字
export function combinedToLevel(score10) {
  if (score10 >= 8) return '極度契合'
  if (score10 >= 6.5) return '非常適合'
  if (score10 >= 5) return '適合'
  if (score10 >= 3.5) return '普通'
  if (score10 >= 2) return '一般'
  return '不建議'
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 主函數：產生完整排名
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function rankCareers(chart, currentDashaLord = null, currentAntardashaLord = null) {
  const planetScores = scoreAllPlanets(chart, currentDashaLord, currentAntardashaLord)
  const userElements = computeUserElements(chart)

  const ranked = CAREER_CATEGORIES.map((cat) => {
    const primaryScore = planetScores[cat.primary]?.score || 0
    const secondaryScore = planetScores[cat.secondary]?.score || 0
    const rawStrength = primaryScore + secondaryScore * 0.5

    // 雙維度：力量 + 契合
    const strength10 = Math.round(normalizeStrength(rawStrength) * 10) / 10
    const fit10 = Math.round(computeFitScore(cat, userElements) * 10) / 10

    // 綜合：50/50 加權
    const combined = Math.round(((strength10 + fit10) / 2) * 10) / 10

    return {
      ...cat,
      rawStrength,
      strength: strength10,
      strengthStars: scoreToStars(strength10),
      fit: fit10,
      fitStars: scoreToStars(fit10),
      combined,
      combinedStars: scoreToStars(combined),
      level: combinedToLevel(combined),
      primaryPlanet: {
        name: cat.primary,
        score: primaryScore,
        reasons: planetScores[cat.primary]?.reasons || []
      },
      secondaryPlanet: {
        name: cat.secondary,
        score: secondaryScore,
        reasons: planetScores[cat.secondary]?.reasons || []
      },
      userElements
    }
  }).sort((a, b) => b.combined - a.combined)

  // 排名
  ranked.forEach((c, i) => {
    c.rank = i + 1
  })

  return ranked
}
