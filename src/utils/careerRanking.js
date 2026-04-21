// 事業類別排名引擎
// 把每顆行星的力量分數 → 對應到 10 個事業類別
// 每個類別分數 = 主宰星 × 1.0 + 輔助星 × 0.5

import { CAREER_CATEGORIES } from '../data/careerCategoriesRanked.js'
import { scoreAllPlanets } from './planetStrength.js'

// 把分數轉換成星等（用於 UI）
export function scoreToStars(score) {
  if (score >= 14) return 5
  if (score >= 10) return 4
  if (score >= 6) return 3
  if (score >= 3) return 2
  if (score >= 0) return 1
  return 0
}

// 把分數轉換成適配度文字
export function scoreToLevel(score) {
  if (score >= 14) return '極度契合'
  if (score >= 10) return '非常適合'
  if (score >= 6) return '適合'
  if (score >= 3) return '普通'
  if (score >= 0) return '一般'
  return '不建議'
}

// 主要函數
export function rankCareers(chart, currentDashaLord = null, currentAntardashaLord = null) {
  const planetScores = scoreAllPlanets(chart, currentDashaLord, currentAntardashaLord)

  const ranked = CAREER_CATEGORIES.map((cat) => {
    const primaryScore = planetScores[cat.primary]?.score || 0
    const secondaryScore = planetScores[cat.secondary]?.score || 0
    const combined = primaryScore + secondaryScore * 0.5
    const rounded = Math.round(combined * 10) / 10

    return {
      ...cat,
      score: rounded,
      stars: scoreToStars(rounded),
      level: scoreToLevel(rounded),
      primaryPlanet: {
        name: cat.primary,
        score: primaryScore,
        reasons: planetScores[cat.primary]?.reasons || []
      },
      secondaryPlanet: {
        name: cat.secondary,
        score: secondaryScore,
        reasons: planetScores[cat.secondary]?.reasons || []
      }
    }
  }).sort((a, b) => b.score - a.score)

  // 加上排名
  ranked.forEach((c, i) => {
    c.rank = i + 1
  })

  return ranked
}
