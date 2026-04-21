// 稀有度指數計算器
// 基於命盤中偵測到的 Yoga、稀有配置、月宿 Pada 等特徵，
// 算出一個 0-100 的分數，並映射到人口百分位
//
// 用戶看到的：
//   「你的命盤稀有度 88/100 · Top 1.5% · 極稀有」
//   + 導致稀有的具體特徵清單

import { detectYogas } from './yogaDetector.js'
import { detectRareConfigs } from './rareConfigs.js'

// 每種配置的稀有度權重（數字越大 = 越稀有）
// 按類別對應傳統 / 現代實際人口頻率
const RARITY_WEIGHTS = {
  // ═══ 極稀有（< 1% 人口）═══
  'luminaries-same-nakshatra': { weight: 26, freq: '< 0.5%', label: '雙光合宿' },
  'empty-kendras': { weight: 20, freq: '< 1%', label: '角宮皆空' },
  'parivartana': { weight: 18, freq: '~2%', label: '行星互換' },
  'neecha-bhanga': { weight: 18, freq: '~2%', label: '挫折轉化' },
  'lagna-lord-12': { weight: 16, freq: '~3%', label: '命主星落 12 宮' },

  // ═══ 稀有（1-8% 人口）═══
  'mahapurusha': { weight: 15, freq: '~3%', label: '五大偉人瑜伽' },
  'vipreet-raj': { weight: 14, freq: '~4%', label: '反向皇家瑜伽' },
  'saraswati': { weight: 13, freq: '~5%', label: '智慧女神瑜伽' },
  'stellium': { weight: 12, freq: '~5%', label: '行星聚集（3+同宮）' },
  'moon-debilitated': { weight: 11, freq: '~8%', label: '月亮落陷' },

  // ═══ 不常見（8-15% 人口）═══
  'born-on-amavasya': { weight: 9, freq: '~7%', label: '新月出生' },
  'born-on-purnima': { weight: 9, freq: '~7%', label: '滿月出生' },
  'gaja-kesari': { weight: 9, freq: '~10%', label: '象王瑜伽' },
  'element-dominant': { weight: 9, freq: '~8%', label: '元素極端主導' },
  'saturn-7th': { weight: 8, freq: '~8%', label: '土星坐配偶宮' },
  'luminaries-same-rashi': { weight: 8, freq: '~8%', label: '雙光同宮' },
  'rahu-axis-identity': { weight: 7, freq: '~17%', label: 'Rahu 軸線課題' },

  // ═══ 常見但仍為特殊標記（15%+ 人口）═══
  'raj-yoga': { weight: 6, freq: '~20%', label: '皇家瑜伽' },
  'dhana-yoga': { weight: 6, freq: '~18%', label: '財富瑜伽' },
  'budha-aditya': { weight: 5, freq: '~15%', label: '水太陽瑜伽' },
  'chandra-mangal': { weight: 5, freq: '~10%', label: '月火瑜伽' },
  'moon-strong': { weight: 5, freq: '~17%', label: '月亮強位' }
}

const BASE_SCORE = 40

function getWeightForFinding(finding) {
  if (RARITY_WEIGHTS[finding.id]) return RARITY_WEIGHTS[finding.id]
  // Prefix 比對（處理 mahapurusha-Mars / stellium-10 / parivartana-Mars-Venus 等）
  for (const key of Object.keys(RARITY_WEIGHTS)) {
    if (finding.id.startsWith(key + '-')) return RARITY_WEIGHTS[key]
  }
  return null
}

export function computeRarityIndex(chart) {
  const yogas = detectYogas(chart)
  const rareConfigs = detectRareConfigs(chart)
  const allFindings = [...yogas, ...rareConfigs]

  let score = BASE_SCORE
  const features = []

  allFindings.forEach((f) => {
    const w = getWeightForFinding(f)
    if (!w) return
    score += w.weight
    features.push({
      name: f.name,
      label: w.label,
      freq: w.freq,
      weight: w.weight,
      type: f.type,
      signature: f.signature
    })
  })

  // 月宿 Pada 本身已是 1/108，加一點基礎稀有
  score += 3
  features.push({
    name: `Moon ${chart.sidereal.moon.nakshatra.name} Pada ${chart.sidereal.moon.nakshatra.pada}`,
    label: '月宿 Pada 定位',
    freq: '1/108 ≈ 0.93%',
    weight: 3,
    type: 'base',
    signature: '27 Nakshatra × 4 Pada = 108 種組合'
  })

  // 上限 100
  score = Math.min(100, Math.round(score))

  // 映射到百分位與稱號
  const tier = scoreTier(score)

  return {
    score,
    ...tier,
    features: features.sort((a, b) => b.weight - a.weight)
  }
}

function scoreTier(score) {
  if (score >= 95) return { topPercent: 0.3, stars: 5, title: '傳奇級命盤', note: '1000 人裡不到 3 個跟你一樣' }
  if (score >= 85) return { topPercent: 1.5, stars: 5, title: '極稀有', note: '100 個人裡只有 1-2 個跟你類似' }
  if (score >= 75) return { topPercent: 3, stars: 4, title: '非常稀有', note: '30 個人裡才會出現 1 個' }
  if (score >= 65) return { topPercent: 7, stars: 4, title: '稀有', note: '15 個人裡 1 個' }
  if (score >= 55) return { topPercent: 15, stars: 3, title: '有特色', note: '比多數人更特別' }
  if (score >= 45) return { topPercent: 30, stars: 3, title: '較為平均', note: '平常型命盤但仍有亮點' }
  return { topPercent: 50, stars: 2, title: '樸實型', note: '你的命盤偏平衡、沒有極端配置' }
}
