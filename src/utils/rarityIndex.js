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

// ═══════════════════════════════════════════════════════════════
// 事業強度信號加分表（2026 Round 6 · 實證校準後）
//
// 原意：讓 rarity 跟事業判讀同步，避免 Bill Gates 只是「較為平均」。
//
// 實證現實（celebrity 391 vs random 3000 lift 分析）：
//   幾乎所有事業結構信號的 lift 都接近 1.0 ±0.2。這意味著吠陀命盤
//   能預測「事業方向」（91.9%），但**不能預測「事業高度」**。
//   Bill Gates 與普通商店老闆在 karmesh/karaka 結構上沒統計差異。
//
// 因此權重全部校準到 lift-based（3-5 分），避免 random 人群爆分到傳奇。
// 用戶若要 Bill Gates = 傳奇，實質上需要 editorial override 而非公式。
// ═══════════════════════════════════════════════════════════════
const CAREER_POWER_WEIGHTS = {
  // 有弱 lift 的 signals（celebrity 略多於 random）
  karmeshMoolatrikona: { weight: 4, plain: '10 宮主根本位 · 事業基底紮實', meaning: 'Karmesh 落在 Moolatrikona — 接近本宮力量，事業根基極深。' },
  karmeshDigbala: { weight: 3, plain: '10 宮主方向力 · 能被看見', meaning: 'Karmesh 達到 Digbala 位置 — 事業有自然的能見度加持。' },

  // 中性 signals（lift ≈ 1）— 權重保持 3 分代表「有訊號但不稀有」
  karakaOverrideStrong: { weight: 3, plain: '本命核心能量壓倒性強', meaning: '某顆 karaka 強到足以重寫你的事業身份 — 這是命盤最有個性的訊號。' },
  karakaOverrideMedium: { weight: 2, plain: '本命核心能量明顯', meaning: '某顆 karaka 足夠強到成為事業副軸。' },
  d10Agreement: { weight: 3, plain: 'D10 與 D1 事業同軸', meaning: '你的事業「想做」跟「會做」指向同一顆星 — 事業穩定度訊號。' },
  karmeshOwn: { weight: 3, plain: '10 宮主本宮 · 事業主線清晰', meaning: 'Karmesh 在本宮站穩 — 事業方向不會飄、能走長遠。' },
  karmeshKendraTrikona: { weight: 2, plain: '10 宮主在吉宮', meaning: 'Karmesh 落在 Kendra 或 Trikona — 結構優勢。' },
  lagnaLordExaltedOrOwn: { weight: 3, plain: '命主星力量飽滿', meaning: 'Lagna Lord 在旺宮或本宮 — 自我驅動力有本錢。' },
  lagnaLordKendraTrikona: { weight: 2, plain: '命主星在吉宮', meaning: 'Lagna Lord 在吉位 — 把「想做」跟「能做」接起來。' },
  manyCareerYogas: { weight: 2, plain: '多重事業瑜伽疊加', meaning: '命盤有多個古典事業配置集中加乘。' },

  // 反訊號（lift < 0.85）— celebrity 反而較少，但為保留命盤資訊給最低分
  karmeshExalted: { weight: 2, plain: '10 宮主旺位', meaning: 'Karmesh 在旺宮（古典強事業位，但實證在 celebrity 群中並不顯著）。' }
}

export function computeRarityIndex(chart, vedicCareer = null) {
  // 嚴格模式：只偵測古典意義上真正稀有的 yoga
  // （事業判讀呼叫 detectYogas(chart) 不傳 options，繼續用 permissive 模式）
  const yogas = detectYogas(chart, { strict: true })
  const rareConfigs = detectRareConfigs(chart, { strict: true })
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

  // ═══ 事業強度加分層 ═══
  // 如果傳入了 vedicCareer（從 analyzeVedicCareer 的結果），讀它的結構訊號
  if (vedicCareer) {
    addCareerPowerSignals(vedicCareer, features, (w) => { score += w })
  }

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

// ═══ 事業強度訊號：讀 vedicCareer 結果加分 ═══
//
// 不動 analyzeVedicCareer 邏輯，純讀取它產出的結構信號
function addCareerPowerSignals(vc, features, addScore) {
  const KENDRA = [1, 4, 7, 10]
  const TRIKONA = [5, 9]  // 1 已在 KENDRA
  const pushFeature = (key, weight) => {
    const spec = CAREER_POWER_WEIGHTS[key]
    if (!spec) return
    features.push({
      name: spec.plain,
      plain: spec.plain,
      technical: `Career signal: ${key}`,
      meaning: spec.meaning,
      freq: '基於事業判讀',
      weight,
      type: 'career-power',
      signature: key
    })
    addScore(weight)
  }

  // ─── Karmesh (10 宮主) dignity + 位置 ───
  const k = vc.karmesh
  if (k && k.planet) {
    const d = k.dignity
    const dd = k.dignityDetails || {}
    if (d === 'exalted') {
      pushFeature('karmeshExalted', CAREER_POWER_WEIGHTS.karmeshExalted.weight)
    } else if (dd.moolatrikona) {
      pushFeature('karmeshMoolatrikona', CAREER_POWER_WEIGHTS.karmeshMoolatrikona.weight)
    } else if (d === 'own') {
      pushFeature('karmeshOwn', CAREER_POWER_WEIGHTS.karmeshOwn.weight)
    }
    if (k.house && ([...KENDRA, ...TRIKONA].includes(k.house)) && d !== 'exalted' && d !== 'own') {
      // 已經 exalted/own 的不重複加「在吉宮」分
      pushFeature('karmeshKendraTrikona', CAREER_POWER_WEIGHTS.karmeshKendraTrikona.weight)
    }
    if (dd.digbala) {
      pushFeature('karmeshDigbala', CAREER_POWER_WEIGHTS.karmeshDigbala.weight)
    }
  }

  // ─── Karaka Overrides 強度 ───
  const overrides = vc.karakaOverrides || []
  const topOverride = overrides[0]
  if (topOverride) {
    if (topOverride.strength === 'strong') {
      pushFeature('karakaOverrideStrong', CAREER_POWER_WEIGHTS.karakaOverrideStrong.weight)
    } else if (topOverride.strength === 'medium') {
      pushFeature('karakaOverrideMedium', CAREER_POWER_WEIGHTS.karakaOverrideMedium.weight)
    }
  }

  // ─── Lagna Lord 位置 ───
  const ll = vc.lagnaLord
  if (ll && ll.planet) {
    const llD = ll.dignity
    if (llD === 'exalted' || llD === 'own') {
      pushFeature('lagnaLordExaltedOrOwn', CAREER_POWER_WEIGHTS.lagnaLordExaltedOrOwn.weight)
    } else if (ll.house && [...KENDRA, ...TRIKONA].includes(ll.house)) {
      pushFeature('lagnaLordKendraTrikona', CAREER_POWER_WEIGHTS.lagnaLordKendraTrikona.weight)
    }
  }

  // ─── D10 與 D1 一致性（agreement = D10 10 宮主等於 D1 10 宮主）───
  if (vc.d10 && vc.d10.agreement) {
    pushFeature('d10Agreement', CAREER_POWER_WEIGHTS.d10Agreement.weight)
  }

  // ─── 多重 career yogas ───
  const careerYogas = vc.activeCareerYogas || []
  if (careerYogas.length >= 3) {
    pushFeature('manyCareerYogas', CAREER_POWER_WEIGHTS.manyCareerYogas.weight)
  }
}

// scoreTier 收未 clamp 的 rawScore — 讓「被 clamp 到 100」的人還能依原始分數再分級
//
// 【Round 7 · framing 改寫】
// 實證（391 celebrity vs 3000 random）顯示：命盤稀有度跟事業成功沒有
// 統計相關（Bill Gates「有特色」、Churchill「樸實型」）。
//
// 因此 tier 的意義從「你有多稀有/特別」改為「你命盤的戲劇強度 /
// 結構鋒利度」—— 不是 comparative 而是 descriptive。
//
// - 鋒利型 = 命盤充滿極端配置（旺陷並存、yoga 密集）· 人生張力大
// - 平衡型 = 命盤結構均勻 · 走穩定路線（Churchill / Bill Gates 屬這一類）
//
// 新 framing 讓 Churchill「平衡型」跟 Einstein「極致型」都是**正面描述**，
// 不再隱含「誰比誰成功」。
function scoreTier(rawScore) {
  if (rawScore >= 106) return { topPercent: 0.6, stars: 5, title: '極致鋒利型', note: '命盤多處極端配置並存 · 結構張力罕見地高' }
  if (rawScore >= 92)  return { topPercent: 2,   stars: 5, title: '烈性命格',   note: '數個極端配置並存 · 命盤個性非常鮮明' }
  if (rawScore >= 80)  return { topPercent: 6,   stars: 4, title: '對比鮮明型', note: '強弱對比明顯 · 命盤走非常規路線' }
  if (rawScore >= 66)  return { topPercent: 18,  stars: 4, title: '鮮明型',     note: '命盤個性輪廓清晰 · 不會被歸為路人型' }
  if (rawScore >= 55)  return { topPercent: 51,  stars: 3, title: '有輪廓型',   note: '命盤有明確主題 · 跟多數人走不同節奏' }
  if (rawScore >= 46)  return { topPercent: 91,  stars: 2, title: '平衡型',     note: '命盤結構均勻 · 你是那種平衡、可靠、不出亂子的類型' }
  return                       { topPercent: 100, stars: 2, title: '淡雅型',     note: '本命走低調路線 · 命盤如水，不追光環' }
}
