// 稀有度指數計算器
// 基於命盤中偵測到的 Yoga、稀有配置、月宿 Pada 等特徵，
// 算出一個 0-100 的分數，並映射到人口百分位
//
// 用戶看到的：
//   「你的命盤稀有度 88/100 · Top 1.5% · 極稀有」
//   + 導致稀有的具體特徵清單（用「白話標題」）

import { detectYogas } from './yogaDetector.js'
import { detectRareConfigs } from './rareConfigs.js'

// 每種配置的稀有度權重
// 每個 entry：
//   weight     — 稀有度加分
//   freq       — 該配置在人口中的出現頻率
//   plain      — 一般人讀得懂的白話標題（UI 主顯）
//   technical  — 技術/古典名（UI 小字副標，給懂行的人）
//   meaning    — 1-2 句解說「這代表你人生會怎樣」
const RARITY_WEIGHTS = {
  // ═══ 極稀有（< 1% 人口）═══
  'luminaries-same-nakshatra': {
    weight: 26,
    freq: '< 0.5%',
    plain: '靈魂與心朝同一個方向',
    technical: '雙光合宿 · Sun+Moon 同 Nakshatra',
    meaning: '你的身（太陽）跟心（月亮）指向同一主題，做事特別專注。別人內心在撕裂時，你很清楚自己要什麼。'
  },
  'empty-kendras': {
    weight: 20,
    freq: '< 1%',
    plain: '內在豐富但難開機',
    technical: '角宮皆空',
    meaning: '腦袋想法一堆、要把想法落地需要外力（deadline、夥伴、架構）。天生不是「執行派」。'
  },
  'parivartana': {
    weight: 18,
    freq: '~2%',
    plain: '兩個領域綁在一起',
    technical: 'Parivartana · 行星互換',
    meaning: '命盤裡有兩顆行星交換地盤，意思是它們管的人生領域（例如事業 × 愛情）會強力連動。一個順另一個也順。'
  },
  'neecha-bhanga': {
    weight: 18,
    freq: '~2%',
    plain: '低谷出發的逆襲命',
    technical: 'Neecha Bhanga Raja Yoga',
    meaning: '命盤裡有個看似不利的配置，但有解救力量 — 你的人生故事通常是「從很低的地方爬起、反而更強」。'
  },
  'lagna-lord-12': {
    weight: 16,
    freq: '~3%',
    plain: '非主流路線的命',
    technical: '命主星落第 12 宮',
    meaning: '你不會在大眾舞台上亮，但會在邊緣（海外、幕後、特殊領域）閃光。主流不適合你、邊緣才是你的主場。'
  },

  // ═══ 稀有（1-8% 人口）═══
  'mahapurusha': {
    weight: 15,
    freq: '~3%',
    plain: '命盤標記的「出類拔萃型」',
    technical: 'Panchamahapurusha · 五大偉人瑜伽',
    meaning: '古典認為命盤中有這個配置的人，在某個特定領域會有超乎常人的表現 — 不是平庸的命。'
  },
  'vipreet-raj': {
    weight: 14,
    freq: '~4%',
    plain: '麻煩反而成就你',
    technical: 'Vipreet Raj Yoga',
    meaning: '越跌越強的配置。你人生中那些「很糟的事」後來反而變成最珍貴的經驗與人脈。別人避之唯恐不及的路線，對你是成就之路。'
  },
  'saraswati': {
    weight: 13,
    freq: '~5%',
    plain: '知識 × 藝術 × 口才 三合',
    technical: 'Saraswati Yoga · 智慧女神瑜伽',
    meaning: '木星、金星、水星三顆「智慧類」行星在好位置 — 你在學習、表達、創作上都有天分。適合教書、寫作、做知識型內容。'
  },
  'stellium': {
    weight: 12,
    freq: '~5%',
    plain: '人生能量集中一處',
    technical: 'Stellium · 3 顆以上行星同宮',
    meaning: '你的人生主線很集中在一件事上 — 別人的人生可能是拼圖，你的人生像一支箭。'
  },
  'moon-debilitated': {
    weight: 11,
    freq: '~8%',
    plain: '情感濃烈到極端',
    technical: '月亮落陷於天蠍',
    meaning: '愛恨分明、記憶深刻、不輕易原諒。表面可能看不出來，但內心戲劇性極強。容易有成癮或深度執著傾向。'
  },

  // ═══ 不常見（8-15% 人口）═══
  'born-on-amavasya': {
    weight: 9,
    freq: '~7%',
    plain: '有「重新開始」的能力',
    technical: 'Amavasya · 新月出生',
    meaning: '你這輩子會有幾次「把一切砍掉重來」的時刻 — 而且你每次都能重新站起來。承襲了祖先的業力轉化任務。'
  },
  'born-on-purnima': {
    weight: 9,
    freq: '~7%',
    plain: '情感豐沛、自然吸睛',
    technical: 'Purnima · 滿月出生',
    meaning: '月亮能量最滿的時刻出生。你情感豐盛、有群眾緣、容易被注意到。但「內外平衡」是終身課題。'
  },
  'gaja-kesari': {
    weight: 9,
    freq: '~10%',
    plain: '智慧 × 貴人雙加持',
    technical: 'Gaja Kesari · 象王瑜伽',
    meaning: '月亮和木星在關鍵位置 — 你有天生的判斷力 + 人生重要時刻會有貴人出現。名聲跟財富會自然累積。'
  },
  'element-dominant': {
    weight: 9,
    freq: '~8%',
    plain: '個性極端鮮明',
    technical: '元素極端主導（5+ 行星同元素）',
    meaning: '你的命盤大多數行星都在同一種元素（火/土/風/水）裡 — 個性特別「純」，別人一看就懂你是什麼類型的人。'
  },
  'saturn-7th': {
    weight: 8,
    freq: '~8%',
    plain: '晚婚或配偶年紀大',
    technical: '土星坐第 7 宮（配偶宮）',
    meaning: '你的婚姻會比同齡人晚到。草率婚姻對你是災難、慢慢挑反而穩。配偶常是成熟、有經歷的類型。'
  },
  'luminaries-same-rashi': {
    weight: 8,
    freq: '~8%',
    plain: '整個人朝同方向走',
    technical: 'Sun + Moon 同星座',
    meaning: '你的外在目標跟內在渴望方向一致 — 比一般人少了「想要的 vs 現實做的」那種撕裂感。'
  },
  'rahu-axis-identity': {
    weight: 4,
    freq: '~17%',
    plain: '身份 / 關係 是人生主題',
    technical: 'Rahu 在第 1 宮或第 7 宮',
    meaning: '你這輩子會反覆問「我是誰」或「我要跟誰在一起」— 這是你的核心功課，會推動一次次的轉變。'
  },

  // ═══ 常見但仍為特殊標記（15%+ 人口）═══
  // 註：這區段權重已校準 — 頻率 ≥15% 就不該算「很稀有」
  'raj-yoga': {
    weight: 3,
    freq: '~20%',
    plain: '命中有領導格',
    technical: 'Raj Yoga · 皇家瑜伽',
    meaning: '你的事業會走到「帶人、主導、有聲望」的位置 — 不會永遠當員工。'
  },
  'dhana-yoga': {
    weight: 3,
    freq: '~18%',
    plain: '錢會自然進來的命',
    technical: 'Dhana Yoga · 財富瑜伽',
    meaning: '命盤中有財富配置，你這輩子不會為錢苦到哪裡去 — 收入會從多個管道自然累積。'
  },
  'budha-aditya': {
    weight: 3,
    freq: '~15%',
    plain: '聰明會表達、有權威感',
    technical: 'Budha Aditya Yoga · 水太陽',
    meaning: '太陽 + 水星同宮。你講話別人會聽、寫東西別人會信服。適合做知識型公眾人物。'
  },
  'chandra-mangal': {
    weight: 4,
    freq: '~10%',
    plain: '情感 × 行動力強結合',
    technical: 'Chandra Mangal · 月火瑜伽',
    meaning: '月亮 + 火星同宮。你「感覺對了就衝」的反應特別強，商業直覺也敏銳。'
  },
  'moon-strong': {
    weight: 3,
    freq: '~17%',
    plain: '情緒穩定 · 心裡有根',
    technical: '月亮落於本宮或旺宮',
    meaning: '你的情緒基底比同齡人穩。遇到事，你內心有一個「我會沒事」的聲音 — 這讓你在團體中變成那個不會崩的人。'
  }
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
      plain: w.plain,
      technical: w.technical,
      meaning: w.meaning,
      freq: w.freq,
      weight: w.weight,
      type: f.type,
      signature: f.signature
    })
  })

  // Moon Pada 基礎稀有
  score += 3
  features.push({
    name: `Moon ${chart.sidereal.moon.nakshatra.name} Pada ${chart.sidereal.moon.nakshatra.pada}`,
    plain: '你的「月宿定位」',
    technical: `Nakshatra ${chart.sidereal.moon.nakshatra.name} · Pada ${chart.sidereal.moon.nakshatra.pada}`,
    meaning: '月亮在 108 種細分月宿中的精確位置 — 這是你最深層的心智與情感模式（比 12 星座精細 9 倍）。',
    freq: '1/108 ≈ 0.93%',
    weight: 3,
    type: 'base',
    signature: '27 Nakshatra × 4 Pada = 108 種組合'
  })

  score = Math.min(100, Math.round(score))
  const tier = scoreTier(score)

  // 依 plain 標題去重 — 避免同一類 yoga 的不同 variant（如 mahapurusha-Mars / -Venus）被顯示多次
  const sorted = features.sort((a, b) => b.weight - a.weight)
  const seen = new Set()
  const deduped = []
  for (const f of sorted) {
    const key = f.plain || f.name
    if (seen.has(key)) continue
    seen.add(key)
    deduped.push(f)
  }

  return {
    score,
    ...tier,
    features: deduped
  }
}

function scoreTier(score) {
  // 門檻經過 2026 校準 — 高頻配置（raj-yoga / dhana-yoga 等 ≥15% 人口）權重已下調
  // 避免「人人都是傳奇」的通膨現象
  if (score >= 98) return { topPercent: 0.3, stars: 5, title: '傳奇級命盤', note: '1000 人裡不到 3 個跟你一樣' }
  if (score >= 90) return { topPercent: 1.5, stars: 5, title: '極稀有', note: '100 個人裡只有 1-2 個跟你類似' }
  if (score >= 80) return { topPercent: 3, stars: 4, title: '非常稀有', note: '30 個人裡才會出現 1 個' }
  if (score >= 70) return { topPercent: 7, stars: 4, title: '稀有', note: '15 個人裡 1 個' }
  if (score >= 60) return { topPercent: 15, stars: 3, title: '有特色', note: '比多數人更特別' }
  if (score >= 50) return { topPercent: 30, stars: 3, title: '較為平均', note: '平常型命盤但仍有亮點' }
  return { topPercent: 50, stars: 2, title: '樸實型', note: '你的命盤偏平衡、沒有極端配置' }
}
