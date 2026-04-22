// 稀有度指數計算器
// 基於命盤中偵測到的 Yoga、稀有配置、月宿 Pada 等特徵，
// 算出一個 0-100 的分數，並映射到人口百分位
//
// 用戶看到的：
//   「你的命盤稀有度 88/100 · Top 1.5% · 極稀有」
//   + 導致稀有的具體特徵清單（用「白話標題」）

import { detectYogas } from './yogaDetector.js'
import { detectRareConfigs } from './rareConfigs.js'

// 每種配置的稀有度權重 — 2026 校準（基於 3000 人實證樣本）
// 權重全面重配：過去 freq 標示完全失準，rare yoga 大量成為「每 3 人 1 個」
// 新規則：
//   · freq 欄位用 3000-sample 實測頻率
//   · weight 依照 -log(freq) 公式反推，並手工微調讓金字塔對稱
//   · 同類 yoga 的多 variant（例 mahapurusha-Mars + mahapurusha-Venus）只算一次分
//     （computeRarityIndex 內做 dedup by RARITY_WEIGHTS key）
const RARITY_WEIGHTS = {
  // ═══ 真正極稀有（< 2% 人口）═══
  'luminaries-same-nakshatra': {
    weight: 28,
    freq: '< 1%',
    plain: '靈魂與心朝同一個方向',
    technical: '雙光合宿 · Sun+Moon 同 Nakshatra',
    meaning: '你的身（太陽）跟心（月亮）指向同一主題，做事特別專注。別人內心在撕裂時，你很清楚自己要什麼。'
  },
  'empty-kendras': {
    weight: 24,
    freq: '< 2%',
    plain: '內在豐富但難開機',
    technical: '角宮皆空',
    meaning: '腦袋想法一堆、要把想法落地需要外力（deadline、夥伴、架構）。天生不是「執行派」。'
  },
  'lagna-lord-12': {
    weight: 10,
    freq: '~9%',
    plain: '非主流路線的命',
    technical: '命主星落第 12 宮',
    meaning: '你不會在大眾舞台上亮，但會在邊緣（海外、幕後、特殊領域）閃光。主流不適合你、邊緣才是你的主場。'
  },

  // ═══ 稀有（5-15% 人口）═══
  'moon-debilitated': {
    weight: 10,
    freq: '~8%',
    plain: '情感濃烈到極端',
    technical: '月亮落陷於天蠍',
    meaning: '愛恨分明、記憶深刻、不輕易原諒。表面可能看不出來，但內心戲劇性極強。容易有成癮或深度執著傾向。'
  },
  'saraswati': {
    weight: 8,
    freq: '~13%',
    plain: '知識 × 藝術 × 口才 三合',
    technical: 'Saraswati Yoga · 智慧女神瑜伽',
    meaning: '木星、金星、水星三顆「智慧類」行星在好位置 — 你在學習、表達、創作上都有天分。適合教書、寫作、做知識型內容。'
  },
  'element-dominant': {
    weight: 9,
    freq: '~8%',
    plain: '個性極端鮮明',
    technical: '元素極端主導（5+ 行星同元素）',
    meaning: '你的命盤大多數行星都在同一種元素（火/土/風/水）裡 — 個性特別「純」，別人一看就懂你是什麼類型的人。'
  },
  'saturn-7th': {
    weight: 7,
    freq: '~9%',
    plain: '晚婚或配偶年紀大',
    technical: '土星坐第 7 宮（配偶宮）',
    meaning: '你的婚姻會比同齡人晚到。草率婚姻對你是災難、慢慢挑反而穩。配偶常是成熟、有經歷的類型。'
  },
  'luminaries-same-rashi': {
    weight: 7,
    freq: '~8%',
    plain: '整個人朝同方向走',
    technical: 'Sun + Moon 同星座',
    meaning: '你的外在目標跟內在渴望方向一致 — 比一般人少了「想要的 vs 現實做的」那種撕裂感。'
  },
  'born-on-amavasya': {
    weight: 8,
    freq: '~7%',
    plain: '有「重新開始」的能力',
    technical: 'Amavasya · 新月出生',
    meaning: '你這輩子會有幾次「把一切砍掉重來」的時刻 — 而且你每次都能重新站起來。承襲了祖先的業力轉化任務。'
  },
  'born-on-purnima': {
    weight: 8,
    freq: '~7%',
    plain: '情感豐沛、自然吸睛',
    technical: 'Purnima · 滿月出生',
    meaning: '月亮能量最滿的時刻出生。你情感豐盛、有群眾緣、容易被注意到。但「內外平衡」是終身課題。'
  },
  'vipreet-raj': {
    weight: 6,
    freq: '~16%',
    plain: '麻煩反而成就你',
    technical: 'Vipreet Raj Yoga',
    meaning: '越跌越強的配置。你人生中那些「很糟的事」後來反而變成最珍貴的經驗與人脈。別人避之唯恐不及的路線，對你是成就之路。'
  },

  // ═══ 常見配置（15-35% 人口）— 實測頻率遠高於原宣稱，權重大幅下調 ═══
  'neecha-bhanga': {
    weight: 5,
    freq: '~30%',
    plain: '低谷出發的逆襲命',
    technical: 'Neecha Bhanga Raja Yoga',
    meaning: '命盤裡有個看似不利的配置，但有解救力量 — 你的人生故事通常是「從很低的地方爬起、反而更強」。'
  },
  'mahapurusha': {
    weight: 4,
    freq: '~30%',
    plain: '命盤標記的「出類拔萃型」',
    technical: 'Panchamahapurusha · 五大偉人瑜伽',
    meaning: '古典認為命盤中有這個配置的人，在某個特定領域會有超乎常人的表現 — 不是平庸的命。'
  },
  'parivartana': {
    weight: 4,
    freq: '~35%',
    plain: '兩個領域綁在一起',
    technical: 'Parivartana · 行星互換',
    meaning: '命盤裡有兩顆行星交換地盤，意思是它們管的人生領域（例如事業 × 愛情）會強力連動。一個順另一個也順。'
  },
  'gaja-kesari': {
    weight: 3,
    freq: '~30%',
    plain: '智慧 × 貴人雙加持',
    technical: 'Gaja Kesari · 象王瑜伽',
    meaning: '月亮和木星在關鍵位置 — 你有天生的判斷力 + 人生重要時刻會有貴人出現。名聲跟財富會自然累積。'
  },
  'stellium': {
    weight: 3,
    freq: '~40%',
    plain: '人生能量集中一處',
    technical: 'Stellium · 3 顆以上行星同宮',
    meaning: '你的人生主線很集中在一件事上 — 別人的人生可能是拼圖，你的人生像一支箭。'
  },

  // ═══ 非常常見（15%+ 人口）═══
  'moon-strong': {
    weight: 3,
    freq: '~17%',
    plain: '情緒穩定 · 心裡有根',
    technical: '月亮落於本宮或旺宮',
    meaning: '你的情緒基底比同齡人穩。遇到事，你內心有一個「我會沒事」的聲音 — 這讓你在團體中變成那個不會崩的人。'
  },
  'rahu-axis-identity': {
    weight: 3,
    freq: '~17%',
    plain: '身份 / 關係 是人生主題',
    technical: 'Rahu 在第 1 宮或第 7 宮',
    meaning: '你這輩子會反覆問「我是誰」或「我要跟誰在一起」— 這是你的核心功課，會推動一次次的轉變。'
  },
  'chandra-mangal': {
    weight: 3,
    freq: '~10%',
    plain: '情感 × 行動力強結合',
    technical: 'Chandra Mangal · 月火瑜伽',
    meaning: '月亮 + 火星同宮。你「感覺對了就衝」的反應特別強，商業直覺也敏銳。'
  },
  'raj-yoga': {
    weight: 2,
    freq: '~23%',
    plain: '命中有領導格',
    technical: 'Raj Yoga · 皇家瑜伽',
    meaning: '你的事業會走到「帶人、主導、有聲望」的位置 — 不會永遠當員工。'
  },
  'dhana-yoga': {
    weight: 2,
    freq: '~25%',
    plain: '錢會自然進來的命',
    technical: 'Dhana Yoga · 財富瑜伽',
    meaning: '命盤中有財富配置，你這輩子不會為錢苦到哪裡去 — 收入會從多個管道自然累積。'
  },
  'budha-aditya': {
    weight: 1,
    freq: '~50%',
    plain: '聰明會表達、有權威感',
    technical: 'Budha Aditya Yoga · 水太陽',
    meaning: '太陽 + 水星同宮。你講話別人會聽、寫東西別人會信服。適合做知識型公眾人物。'
  }
}

const BASE_SCORE = 40

function getWeightForFinding(finding) {
  if (RARITY_WEIGHTS[finding.id]) {
    return { categoryKey: finding.id, ...RARITY_WEIGHTS[finding.id] }
  }
  // Prefix 比對（處理 mahapurusha-Mars / stellium-10 / parivartana-Mars-Venus 等）
  for (const key of Object.keys(RARITY_WEIGHTS)) {
    if (finding.id.startsWith(key + '-')) {
      return { categoryKey: key, ...RARITY_WEIGHTS[key] }
    }
  }
  return null
}

export function computeRarityIndex(chart) {
  const yogas = detectYogas(chart)
  const rareConfigs = detectRareConfigs(chart)
  const allFindings = [...yogas, ...rareConfigs]

  let score = BASE_SCORE
  const features = []
  // 防重複加分：同類 yoga 的多 variant 只算第一次
  // 例：mahapurusha-Mars + mahapurusha-Venus 只 +weight 一次
  //     parivartana-Sun-Mercury + parivartana-Mars-Venus 只 +weight 一次
  const scoredCategories = new Set()

  allFindings.forEach((f) => {
    const w = getWeightForFinding(f)
    if (!w) return
    const alreadyScored = scoredCategories.has(w.categoryKey)
    if (!alreadyScored) {
      score += w.weight
      scoredCategories.add(w.categoryKey)
    }
    features.push({
      name: f.name,
      plain: w.plain,
      technical: w.technical,
      meaning: w.meaning,
      freq: w.freq,
      weight: alreadyScored ? 0 : w.weight,
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

  // 保留未 clamp 的原始分數給 tier 判斷（避免 clamp 100 的人全擠同一 tier）
  const rawScore = score
  const displayScore = Math.min(100, Math.round(rawScore))
  const tier = scoreTier(rawScore)

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
    score: displayScore,
    rawScore,
    ...tier,
    features: deduped
  }
}

// scoreTier 收未 clamp 的 rawScore — 讓「被 clamp 到 100」的人還能依原始分數再分級
function scoreTier(rawScore) {
  // 門檻經過 2026 三輪校準（3000 人實證樣本）：
  //   - Round 1: 原宣稱值失真（傳奇 0.3% 實測 30%）
  //   - Round 2: 修 dedup + 重配權重，傳奇降到 1.6%
  //   - Round 3: 拉高 tier 門檻 + 擴大中段，讓真正金字塔成立
  //   - Round 4: 用 raw 分判 tier — clamp 100 的人不再全擠進「傳奇」
  //     目標：傳奇 <1% / 極稀有 3-5% / 非常稀有 10-15% / 稀有 25-35%
  //   - note 文案兼顧金字塔中下段用戶體感（避免「我很普通」的挫折感）
  if (rawScore >= 106) return { topPercent: 0.7, stars: 5, title: '傳奇級命盤', note: '140 個人裡不到 1 個跟你一樣' }
  if (rawScore >= 92) return { topPercent: 3, stars: 5, title: '極稀有', note: '30 個人裡才出現 1 個' }
  if (rawScore >= 80) return { topPercent: 8.5, stars: 4, title: '非常稀有', note: '大約 12 個人裡 1 個' }
  if (rawScore >= 66) return { topPercent: 27, stars: 4, title: '稀有', note: '3-4 個人裡 1 個' }
  if (rawScore >= 55) return { topPercent: 66, stars: 3, title: '有特色', note: '算是偏特別的那一群' }
  if (rawScore >= 46) return { topPercent: 97, stars: 2, title: '較為平均', note: '命盤沒有極端配置 — 你是那個平衡、可靠、不出亂子的類型' }
  return { topPercent: 100, stars: 2, title: '樸實型', note: '本命走低調路線 — 不追求光環，人生靜水深流' }
}
