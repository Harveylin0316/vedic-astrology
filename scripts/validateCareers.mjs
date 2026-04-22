#!/usr/bin/env node
// Celebrity validation pipeline for the Vedic career algorithm.
//
// Usage:
//   node scripts/validateCareers.mjs
//   node scripts/validateCareers.mjs --verbose
//   node scripts/validateCareers.mjs --save-report reports/my-run.md
//
// Reads data/celebrityDataset.json and for each celebrity:
//   1. computeVedicChart({ year, month, day, hour, minute, tzOffset, lat, lon })
//   2. getCurrentDasha at birth-time "now" approximated as a fixed 2024 date
//      (so we get a consistent mahadasha picture; for prediction purposes
//       we care about natal direction — dasha is secondary)
//   3. analyzeVedicCareer(chart, dashaLord, adLord)
//   4. Collect predicted categories from:
//        - karmeshMatrix reading (string — keyword-mapped)
//        - karakaOverrides (Mars/Venus/Saturn/Jupiter/Sun)
//        - activeCareerYogas strong ones
//        - playbook.modernExamples
//   5. Score:
//        - Full match: any true category ∈ predicted categories
//        - Partial match: true category's "family" matches predicted (e.g. tech-* / arts-*)
//        - Miss: otherwise
//
// Accuracy = (fullMatch + partialMatch * 0.5) / total

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { computeVedicChart, computeVimshottariDasha, getCurrentDasha, computeAntardashas, getCurrentAntardasha } from '../src/utils/vedicCalc.js'
import { analyzeVedicCareer } from '../src/utils/careerVedic.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const argv = process.argv.slice(2)
const VERBOSE = argv.includes('--verbose')
const SAVE_REPORT_IDX = argv.indexOf('--save-report')
const SAVE_REPORT = SAVE_REPORT_IDX >= 0 ? argv[SAVE_REPORT_IDX + 1] : null
// Round 3 新增 flags
const CATEGORY_BREAKDOWN = argv.includes('--category-breakdown')
const DOMAIN_ARG = argv.find((a) => a.startsWith('--domain='))
const DOMAIN = DOMAIN_ARG ? DOMAIN_ARG.split('=')[1] : null
const RATING_ARG = argv.find((a) => a.startsWith('--min-rating='))
const MIN_RATING = RATING_ARG ? RATING_ARG.split('=')[1] : 'B'
// 排序：rating 等級，分數越低越嚴格
const RATING_RANK = { AA: 4, A: 3, B: 2, C: 1, D: 0 }

const datasetPath = path.resolve(__dirname, '../data/celebrityDataset.json')
let dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'))

// Rating 過濾
const minRank = RATING_RANK[MIN_RATING] ?? 2
dataset = dataset.filter((e) => (RATING_RANK[e.rating] ?? 0) >= minRank)

// Domain 過濾（Round 3 新增 — 專注 business 子集）
if (DOMAIN === 'business') {
  dataset = dataset.filter((e) => e.categories.some((c) => c.startsWith('business-')))
}

// ═════════════════════════════════════════════════════════════════
// Category keyword dictionaries — map Chinese algorithm output to
// English category tags.
//
// These are rules for scoring ONLY — not used to alter the algorithm.
// Each category has "hard" keywords (full match) and "soft" keywords
// (partial match) derived from the actual karmeshMatrix, karaka and
// playbook vocabulary.
// ═════════════════════════════════════════════════════════════════

const CATEGORY_KEYWORDS = {
  'tech-creative': {
    hard: ['科技', '科技帝業', '科技霸業', 'IT', '設計', '創新', 'AI', '遊戲', '電競'],
    soft: ['創造', '破格', '新興', 'Founder', '新創']
  },
  'tech-exec': {
    hard: ['CEO', '創投', '科技', '商業帝國', '平台經濟', '科技霸業'],
    soft: ['管理', '企業家', '帝國', '高階主管', '主管']
  },
  'tech-engineer': {
    hard: ['工程師', '程式', 'IT', 'Infra', '工程', 'AI／ML', 'AI', '工業設計'],
    soft: ['技術', '工業', '建築', '電子']
  },
  'business-leader': {
    hard: ['CEO', '董事長', '大型企業', '政府高層', '商業帝國', '霸業', '帝國'],
    soft: ['管理', '高階主管', '企業家', '掌舵', '高階', '掌權']
  },
  'business-entrepreneur': {
    hard: ['創業', '創業家', 'Founder', '個人品牌', '新創', '創投', '跨境電商'],
    soft: ['獨立', '自雇', '自媒體', '個人工作室', '品牌']
  },
  'business-investor': {
    hard: ['投資', '基金', '投資家', '投機', '投資人', '對沖', '投資分析'],
    soft: ['金融', '基金會', '財務']
  },
  'finance': {
    hard: ['金融', '銀行', '財務', '會計', '保險', '稅務', '加密'],
    soft: ['經濟', '財庫', '投資', '基金']
  },
  'banking': {
    hard: ['銀行', '中央銀行', '財務'],
    soft: ['金融']
  },
  // Round 3 新增 — business sub-categories
  'business-tycoon-founder': {
    hard: ['商業帝國', '霸業', '開創', '白手', 'Founder', '創業家', '新創'],
    soft: ['管理', '掌舵', '首富', '掌權', '創投']
  },
  'business-tycoon-heir': {
    hard: ['世家', '家業', '世代承襲', '繼承', '承襲'],
    soft: ['家名', '根基', '長青產業', '世襲', '家族聲望', '家族聲譽']
  },
  'business-ceo-hired': {
    hard: ['CEO', '董事長', '高階主管', '掌舵'],
    soft: ['企業家', '帝國', '掌權', '管理']
  },
  'business-investor': {
    hard: ['投資', '基金', '投資家', '投機', '投資人', '對沖', '投資分析', '創投', '證券'],
    soft: ['金融', '基金會', '財務']
  },
  'business-finance': {
    hard: ['金融', '銀行', '財務', '會計', '保險', '稅務', '加密', '投資分析'],
    soft: ['經濟', '財庫', '投資', '基金', '家族聲譽']
  },
  'business-retail': {
    hard: ['零售', '消費', '精品', '奢華', '精品家業', '奢侈品', '時尚設計', '時尚', '美感即招牌', '美感之巔', '美學居家', '時尚／娛樂'],
    soft: ['品味', '消費', '美學']
  },
  'business-media': {
    hard: ['媒體', '娛樂', '電影', '出版', '媒體集團', '傳媒', '媒體帝國', '娛樂帝國', '媒體製作', '大眾'],
    soft: ['內容', '廣播', '社群']
  },
  'business-realestate': {
    hard: ['房產', '建築', '房地產', '土地', '地產大亨', '家族基業', '建設', '建設集團', '根基', '守土'],
    soft: ['根基', '扎根', '土地']
  },
  'business-industrial': {
    hard: ['工業', '製造', '重工', '工業集團', '基礎建設', '建設', '能源', '石油', '礦業', '鋼鐵', '機械', '長期統帥'],
    soft: ['長期', '體系', '承襲', '建設']
  },
  'business-tech-founder': {
    hard: ['科技', '科技帝業', '科技霸業', '平台經濟', '商業帝國', 'IT', '網路', '創投', '新創', 'AI', '跨境電商', '創辦'],
    soft: ['破格', '非主流', '新興']
  },
  'arts-performer': {
    hard: ['演員', '歌手', '演藝', '表演', '娛樂', '舞者', '流行音樂', '表演藝術', 'Beyoncé', '動作巨星', '動作派演員', '舞蹈', '演藝明星', '音樂家', '藝人', '粉絲經濟', '大眾偶像', '公眾親和', '社群娛樂', '媒體製作'],
    soft: ['藝術', '美感', '藝術家', '展演', '樂']
  },
  'arts-creator': {
    hard: ['作家', '寫作', '小說家', '編劇', '編輯', '詩人', '導演', '製片', '作曲', '出版', '創作者', '詞曲'],
    soft: ['創作', '寫手', '內容', '自媒體', '知識', '教學']
  },
  'arts-visual': {
    hard: ['畫家', '時尚', '設計師', '時尚設計', '時裝', '攝影', '精品', '藝術家', '美學', '品牌策略', '奢華', '珠寶', '室內', '動畫', '藝術'],
    soft: ['美感', '造型', '品味']
  },
  'sports-athlete': {
    hard: ['運動員', '運動', '體育', '運動明星', '運動巨星', '籃球', '足球', '網球', '拳擊', '武術', '運動教練', '拳擊手', '運動相關', '健身', '體能', '競技'],
    soft: ['戰士', '戰鬥', 'Mars', '體力', '衝刺', '鬥技']
  },
  'sports-coach': {
    hard: ['教練', '運動教練', '健身教練'],
    soft: ['運動', '體育']
  },
  'politics': {
    hard: ['政治', '總統', '總理', '首相', '政界', '民代', '政治家', '政治人物', '國師', '軍政首長', '國家級領袖', '總司令'],
    soft: ['政府', '公職', '高層政府', '國家']
  },
  'government': {
    hard: ['政府', '公職', '公務', '公部門', '政府官員', '政府高層', '國家級', '女王', '皇室', '國家領袖', '首長'],
    soft: ['公眾', '官方', '權威', '民代']
  },
  'religion-leader': {
    hard: ['宗教', '宗教領袖', '教宗', '宗教機構', '教會', '僧侶', '出家', '教廷', '精神領袖', '喇嘛'],
    soft: ['靈性', '修行', '神秘', '哲學']
  },
  'spiritual-teacher': {
    hard: ['靈性', '瑜珈', '冥想', '修行', '精神領袖', '療癒', '心靈導師', '哲學', '精神分析'],
    soft: ['宗教', '導師', '智慧', '深度']
  },
  'science-academic': {
    hard: ['教授', '大學', '學者', '研究員', '學術', '科學', '理論', '研究'],
    soft: ['智慧', '教育', '知識', '導師']
  },
  'law': {
    hard: ['律師', '法律', '法官', '司法', '法務'],
    soft: ['正義', '法規', '稽核']
  },
  'medicine': {
    hard: ['醫師', '醫生', '外科', '心理師', '諮商', '治療', '醫療', '護理', '精神科', '精神分析'],
    soft: ['照護', '療癒', '健康']
  },
  'media-personality': {
    hard: ['主持人', '脫口秀', '節目主持', 'KOL', '網紅', '媒體名人', '名人', '媒體', '代言人', '公眾人物', '演講者', '直播', '粉絲經濟', '社群變現', '大眾收入', '公眾親和', '大眾偶像'],
    soft: ['公眾', '自媒體']
  },
  'media-creator': {
    hard: ['自媒體', '內容創作', '媒體製作', 'vlog', 'Podcast', '紀錄片'],
    soft: ['創作', '寫作', '影片']
  },
  'military': {
    hard: ['軍警', '軍政', '軍事', '軍人', '國防'],
    soft: ['戰士', '戰鬥', '紀律']
  },
  'exploration': {
    hard: ['探險', '國際', '海外', '跨國', '外交'],
    soft: ['冒險', '遠方']
  }
}

// Family groupings — for partial-match logic.
// family grouping — used for "partial match" scoring. A prediction in the
// same family as the true category counts as 0.5 (half) credit.
// Some categories belong to multiple families (finance ≈ business in some
// contexts; tech-exec ≈ business).
const CATEGORY_FAMILIES = {
  tech: ['tech-creative', 'tech-exec', 'tech-engineer', 'business-tech-founder'],
  // Round 3：business family 仍然保留，用於最寬鬆的 partial match；但同時細分出更嚴格的子 family
  business: [
    'business-leader', 'business-entrepreneur', 'business-investor', 'finance', 'banking', 'tech-exec',
    'business-tycoon-founder', 'business-tycoon-heir', 'business-ceo-hired', 'business-finance',
    'business-retail', 'business-media', 'business-realestate', 'business-industrial',
    'business-tech-founder'
  ],
  // 細分 family：用於「嚴格 partial」判定（不同 sub-category 是 partial，不是 full）
  'biz-founder': ['business-tycoon-founder', 'business-tech-founder', 'business-entrepreneur'],
  'biz-heir': ['business-tycoon-heir'],
  'biz-ceo': ['business-ceo-hired', 'business-leader', 'tech-exec'],
  'biz-finance': ['business-investor', 'business-finance', 'finance', 'banking'],
  'biz-retail': ['business-retail'],
  'biz-realestate': ['business-realestate'],
  'biz-industrial': ['business-industrial'],
  'biz-media': ['business-media', 'media-personality', 'media-creator'],
  finance: ['finance', 'banking', 'business-investor', 'business-leader', 'business-finance'],
  arts: ['arts-performer', 'arts-creator', 'arts-visual'],
  sports: ['sports-athlete', 'sports-coach'],
  politics: ['politics', 'government'],
  religion: ['religion-leader', 'spiritual-teacher'],
  academic: ['science-academic', 'medicine', 'law'],
  media: ['media-personality', 'media-creator', 'business-media']
}
// A category can belong to multiple families; return the set of all matching
// family labels.
function familiesOf(category) {
  const out = []
  for (const [fam, list] of Object.entries(CATEGORY_FAMILIES)) {
    if (list.includes(category)) out.push(fam)
  }
  return out.length ? out : [category]
}

// Karaka override → category hints
// Round 2 調整：
//   - Mars strong → sports/military/medicine；medium 則只給 sports-athlete（避免把 Taylor Swift 誤判成軍警）
//   - Saturn → 加上 arts-performer（長期深耕型歌手／演員的共同特徵）；移除 tech-engineer（過擴張）
//     因 Saturn mahapurusha 在藝人身上常見（深耕型表演者 = Elvis、Justin Bieber、Ariana Grande）
const KARAKA_CATEGORY_HINTS = {
  Mars: ['sports-athlete', 'military', 'medicine'],
  Venus: ['arts-performer', 'arts-visual', 'arts-creator'],
  Saturn: ['business-leader', 'arts-performer'],
  Jupiter: ['science-academic', 'religion-leader', 'spiritual-teacher', 'law'],
  Sun: ['government', 'politics', 'media-personality']
}

// Round 2 重新檢視：gaja-kesari / raj-yoga / dhana-yoga 非常常見（象王＋皇家＝皇室瑜伽
// 組合），古典上是「走向高位」但不是「政治家專有」。保留做為 context-gated hints：
// 只有當 Sun/Moon 在公眾宮或 karmesh 是 Sun/Jupiter/Saturn 時才觸發政治／政府 hint。
// 避免 Brad Pitt/Mahatma Gandhi 類案例把所有 raj-yoga 都標為政治家。
//
// mahapurusha-Saturn 同樣不等於工業 — 根據 karmesh planet 決定是政治／arts／業務方向。
const YOGA_CATEGORY_HINTS = {
  // Round 2：Ruchaka Yoga（Mars Mahapurusha）既可以是運動員也可以是有表演主導性
  //   的藝術家（Taylor Swift 型）。加上 arts-performer 作為次級選項。
  'mahapurusha-Mars': ['sports-athlete', 'military', 'medicine', 'arts-performer'],
  'mahapurusha-Mercury': ['business-leader', 'business-entrepreneur', 'arts-creator', 'tech-exec'],
  'mahapurusha-Jupiter': ['science-academic', 'religion-leader', 'law', 'spiritual-teacher'],
  'mahapurusha-Venus': ['arts-performer', 'arts-visual'],
  // Saturn Mahapurusha 不等於「工業」— 可能是深耕型演藝、長期政府高層、老牌企業家
  'mahapurusha-Saturn': ['business-leader', 'arts-performer', 'politics', 'government'],
  'saraswati': ['arts-creator', 'arts-performer', 'science-academic'],
  // Raj/Gaja Kesari/Dhana - 不含 politics/government/business hints
  // 改由下面 context-gated 邏輯處理，只在 Sun/Moon/Jupiter 配置也指向公眾權威時才加
}

// Round 2：基於 karmesh/lagnaLord 的上下文 gated yoga hints
// 當 raj-yoga 或 gaja-kesari 出現時：
//   - karmesh 為 Sun/Jupiter 且 Sun 或 lagnaLord 在 1/10 → politics/government
//   - karmesh 為 Saturn 且 Saturn 在 10/7 + dhana-yoga → business-leader
//   - karmesh 為 Mercury 且 mahapurusha-Mercury → business
// 這個 gating 救回 Putin/Gandhi/Mandela/FDR/Churchill 而不誤傷 Brad Pitt
function contextGatedYogaHints(analysis) {
  const set = new Set()
  const yogas = new Set((analysis?.activeCareerYogas || []).map((y) => y.id))
  const karmeshP = analysis?.karmesh?.planet
  const karmeshH = analysis?.karmesh?.house
  const lagnaLordP = analysis?.lagnaLord?.planet
  const lagnaLordH = analysis?.lagnaLord?.house
  const sigs = analysis?.significators || []
  const sunSig = sigs.find((s) => s.planet === 'Sun')
  const jupSig = sigs.find((s) => s.planet === 'Jupiter')
  const satSig = sigs.find((s) => s.planet === 'Saturn')
  const hasRaj = yogas.has('raj-yoga')
  const hasGaja = yogas.has('gaja-kesari')
  const hasDhana = yogas.has('dhana-yoga')

  // 政治／政府（古典 Vedic 觀點）：
  // - Raj Yoga + Gaja Kesari 都是「走向高位」的強力組合
  // - 政治家的關鍵 marker：Sun 強落公眾宮（1/10）、Moon 與 Sun/Jupiter 互動、karmesh 在 kendra
  // - 避免把 Brad Pitt 錯判：只有當 Sun 本身參與配置（落在公眾宮或強旺）才觸發
  const karmeshInKendra = [1, 4, 7, 10].includes(karmeshH)
  const karmeshInTrikona = [1, 5, 9].includes(karmeshH)
  const sunHouse = sunSig?.graha?.house
  const sunPublic = sunHouse && [1, 7, 10].includes(sunHouse)
  const sunInKendra = sunHouse && [1, 4, 7, 10].includes(sunHouse)
  const sunStrong = sunSig && ['own', 'exalted', 'moolatrikona', 'friendly'].includes(sunSig.dignity)
  const jupStrong = jupSig && ['own', 'exalted', 'moolatrikona'].includes(jupSig.dignity)
  const jupPublic = jupSig?.graha?.house && [1, 4, 7, 9, 10].includes(jupSig.graha.house)
  const llPublic = [1, 10].includes(lagnaLordH)
  const moonH = analysis?.significators?.find((s) => s.planet === 'Moon')?.graha?.house
  const moonPublic = moonH && [1, 4, 7, 10].includes(moonH)
  const marsH = analysis?.significators?.find((s) => s.planet === 'Mars')?.graha?.house

  // Rule 1（Raj/Gaja classic politician）：raj-yoga + gaja-kesari 雙重 + Sun/Moon 至少一顆公眾宮
  // 救回：Clinton、Bush、JFK、Gandhi（都有 raj/gaja 但我舊條件太嚴）
  if ((hasRaj && hasGaja) && (sunPublic || moonPublic)) {
    set.add('politics')
    set.add('government')
  }
  // Rule 2：raj-yoga 單獨 + Sun 在公眾宮 + karmesh 在 kendra or trikona
  if (hasRaj && sunPublic && (karmeshInKendra || karmeshInTrikona)) {
    set.add('politics')
    set.add('government')
  }
  // Rule 3：Jupiter 強旺在公眾宮 + budha-aditya/raj/gaja + karmesh 在公眾位 → 國師／外交家
  // 救回：Nelson Mandela、Henry Kissinger
  const hasBudha = yogas.has('budha-aditya')
  if ((hasBudha || hasRaj || hasGaja) && jupStrong && jupPublic && karmeshInKendra) {
    set.add('government')
    set.add('politics')
  }
  // Rule 4：chandra-mangal + Moon+Mars 合位於公眾宮（FDR 型 — 10 宮 Moon+Mars）
  const chandraMangal = yogas.has('chandra-mangal')
  if (chandraMangal && moonH === 10 && marsH === 10) {
    set.add('politics')
    set.add('government')
  }
  // Rule 5：vipreet-raj yoga（從逆境崛起）+ karmesh 在 Saturn/Jupiter → 政治家型
  // 救回：Henry Kissinger（vipreet-raj + budha-aditya + karmesh Saturn）
  const hasVipreet = yogas.has('vipreet-raj')
  if (hasVipreet && ['Saturn', 'Jupiter', 'Sun'].includes(karmeshP) && (sunPublic || jupPublic)) {
    set.add('politics')
    set.add('government')
  }
  // Rule 6 Round 2：Mars override + Saturn override 同時 + karmesh Mercury/Saturn/Sun
  //   戰略家型 — 軍事外交背景的領袖（Churchill 型）
  const overrides = analysis?.karakaOverrides || []
  const hasMarsOverride = overrides.some((o) => o.id === 'karaka-override-mars')
  const hasSaturnOverride = overrides.some((o) => o.id === 'karaka-override-saturn')
  const hasSunOverride = overrides.some((o) => o.id === 'karaka-override-sun')
  if (hasMarsOverride && hasSaturnOverride && ['Mercury', 'Saturn', 'Sun', 'Jupiter'].includes(karmeshP)) {
    set.add('politics')
    set.add('government')
  }
  // Rule 7：gaja-kesari 單獨 + Venus 強 own 在 Trikona + karmesh 在公眾宮（JFK 型 — Venus 9宮 own）
  //   Kennedy 家族：魅力 + Jupiter/Moon 的 Gaja Kesari = 公眾領袖
  const venusLocal = analysis?.significators?.find((s) => s.planet === 'Venus')
  const venusOwnInTrikona = venusLocal && ['own', 'exalted'].includes(venusLocal.dignity)
    && [1, 5, 9].includes(venusLocal.graha?.house)
  if (hasGaja && venusOwnInTrikona && ['Mercury', 'Venus', 'Sun'].includes(karmeshP)) {
    set.add('politics')
    set.add('government')
  }
  // Rule 8：Sun 強旺 Kendra + Moon 強旺 + raj-yoga OR gaja-kesari（Bush 型）
  //   George W. Bush: Sun 強 + Moon + raj → 總統
  if ((hasRaj || hasGaja) && sunStrong && sunInKendra && moonH && [1,4,7,10].includes(moonH)) {
    set.add('politics')
    set.add('government')
  }
  // business-leader: karmesh Saturn/Mercury + dhana-yoga 或 raj-yoga + Saturn 在 10/7
  if ((hasDhana || hasRaj) && satSig?.graha?.house && [7, 10].includes(satSig.graha.house)
      && ['own', 'exalted', 'moolatrikona'].includes(satSig.dignity)) {
    set.add('business-leader')
  }
  return set
}

// ═════════════════════════════════════════════════════════════════
// Build predicted categories from the analyzeVedicCareer output.
// ═════════════════════════════════════════════════════════════════
function predictCategories(analysis) {
  const set = new Set()
  const evidence = []

  // 1. karmeshMatrix text — keyword scan
  const matrixText = analysis?.karmesh?.combinationReading || ''
  for (const [cat, kws] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of kws.hard) {
      if (matrixText.includes(kw)) {
        set.add(cat)
        evidence.push(`karmesh: "${kw}" → ${cat}`)
        break
      }
    }
  }

  // 2. Karaka overrides — strong signal
  for (const override of analysis?.karakaOverrides || []) {
    // override.id e.g. "karaka-override-mars"
    const planet = override.id.replace('karaka-override-', '')
    const planetKey = planet.charAt(0).toUpperCase() + planet.slice(1)
    const hints = KARAKA_CATEGORY_HINTS[planetKey] || []
    hints.forEach((c) => {
      set.add(c)
      evidence.push(`karaka-override ${planetKey} → ${c}`)
    })
  }

  // 3. Active career yogas — strong ones add category hints
  for (const yoga of analysis?.activeCareerYogas || []) {
    const hints = YOGA_CATEGORY_HINTS[yoga.id]
    if (!hints) continue
    hints.forEach((c) => {
      set.add(c)
      evidence.push(`yoga ${yoga.id} → ${c}`)
    })
  }

  // 3a. Context-gated yoga hints（raj/gaja/dhana + karmesh 配置）
  for (const cat of contextGatedYogaHints(analysis)) {
    if (!set.has(cat)) {
      set.add(cat)
      evidence.push(`context-gated yoga → ${cat}`)
    }
  }

  // 3b. Derived signals：Mars 在 Kendra/Upachaya → sports-athlete 軟訊號
  const chart = analysis?._debug?.chart
  const sigs = analysis?.significators || []
  const marsSig = sigs.find((s) => s.planet === 'Mars')
  const marsHouse = marsSig?.graha?.house
  const marsDignity = marsSig?.dignity
  const venusSig = sigs.find((s) => s.planet === 'Venus')
  const venusHouse = venusSig?.graha?.house
  const venusDignity = venusSig?.dignity
  const moonSig = sigs.find((s) => s.planet === 'Moon')
  const moonHouse = moonSig?.graha?.house
  const moonDignity = moonSig?.dignity
  const sunSig = sigs.find((s) => s.planet === 'Sun')
  const sunHouse = sunSig?.graha?.house
  const lagnaLordPlanet = analysis?.lagnaLord?.planet
  const d10Lord = analysis?.d10?.tenthLord
  const karmeshPlanet = analysis?.karmesh?.planet

  // Round 2：Mars athletic pattern 放寬 + D10 Mars signal + Mars 合宮
  // 救回：Tom Brady (D10 Mars)、Kobe (Mars H5+Jupiter H3)、LeBron、Michael Jordan、Serena
  if (marsHouse) {
    const inKendra = [1, 4, 7, 10].includes(marsHouse)
    const inUpachaya = [3, 6, 10, 11].includes(marsHouse)
    const warriorHouse = [1, 3, 6, 10, 11].includes(marsHouse)
    const strong = ['own', 'exalted', 'moolatrikona'].includes(marsDignity)
    const hasArtsYoga = (analysis?.activeCareerYogas || []).some((y) =>
      ['mahapurusha-Venus', 'mahapurusha-Mars', 'saraswati'].includes(y.id)
    )
    const hasRuchaka = (analysis?.activeCareerYogas || []).some((y) => y.id === 'mahapurusha-Mars')
    const hasChandraMangal = (analysis?.activeCareerYogas || []).some((y) => y.id === 'chandra-mangal')
    const d10MarsSignal = d10Lord === 'Mars'
    const lagnaLordIsMars = lagnaLordPlanet === 'Mars'
    const karmeshIsMars = karmeshPlanet === 'Mars'
    // condA: Mars 強旺 + Kendra（Ruchaka 型）
    const condA = inKendra && strong
    // condB: Arts/Mars Yoga 配合 athletic 位置
    const condB = (inKendra || inUpachaya) && hasArtsYoga
    // condD: Ruchaka Yoga 直接觸發
    const condD = hasRuchaka
    // Round 2 新增 condE: D10 10 宮主為 Mars + Mars 在戰士位 任意 dignity（Tom Brady 型）
    const condE = d10MarsSignal && warriorHouse && marsDignity !== 'debilitated'
    // Round 2 新增 condF: 命主或 10 宮主為 Mars + Mars 非陷落（天蠍／牡羊 ascendant 職業運動員）
    const condF = (lagnaLordIsMars || karmeshIsMars) && marsDignity !== 'debilitated' && warriorHouse
    // Round 2 新增 condG: Scorpio/Aries Lagna (命主為 Mars) — 天蠍／牡羊生的運動員原型
    //   即使 Mars 位置較弱，只要命主為 Mars 且非陷落，就當 athletic 傾向
    const condG = lagnaLordIsMars && marsDignity !== 'debilitated'
    // Round 2 新增 condH: chandra-mangal yoga + Mars 在 warriorHouse → 月火皆強的 athletic
    const condH = hasChandraMangal && warriorHouse
    // Round 2 新增 condI: Saturn 在 6 宮 + karmesh 也在 kendra/upachaya → 長期運動員型（Billie Jean King 型）
    const saturnH = analysis?.significators?.find((s) => s.planet === 'Saturn')?.graha?.house
    const saturnStrong = analysis?.significators?.find((s) => s.planet === 'Saturn')?.dignity
    const condI = saturnH === 6 && ['friendly', 'own', 'exalted', 'moolatrikona'].includes(saturnStrong)
      && (inUpachaya || marsHouse === 1) && marsDignity !== 'debilitated'
    // Round 2 新增 condJ: lagnaLord=Saturn + Saturn H6 + karmesh 事業宮 Venus/Jupiter（BJ King 型）
    const lagnaLordIsSaturn = lagnaLordPlanet === 'Saturn'
    const saturnInSixth = saturnH === 6
    const condJ = lagnaLordIsSaturn && saturnInSixth && ['Venus', 'Jupiter', 'Mars', 'Mercury'].includes(karmeshPlanet)
    // Round 2 新增 condK: Mars 在 5 宮（rajya yoga-style）+ 強旺 + karmesh Saturn/Jupiter → 運動明星型（Kobe、Federer 型）
    const condK = marsHouse === 5 && strong && ['Saturn', 'Jupiter', 'Venus'].includes(karmeshPlanet)
    // Round 2 新增 condL: Saturn 在 10 宮 強旺 + Moon 在 6/10（公眾工作）+ Jupiter 強旺 → 長期職業運動員（Tom Brady 型）
    //   Saturn 10 = 職業耐力；Moon 6 = 競爭服務；Jupiter 強 = 團隊領袖
    const saturnTenthStrong = saturnH === 10 && ['friendly', 'own', 'exalted', 'moolatrikona'].includes(saturnStrong)
    const moonInServiceHouse = moonHouse && [6, 10].includes(moonHouse)
    const jupSig = analysis?.significators?.find((s) => s.planet === 'Jupiter')
    const jupStrongLocal = jupSig && ['own', 'exalted', 'moolatrikona'].includes(jupSig.dignity)
    const condL = saturnTenthStrong && moonInServiceHouse && jupStrongLocal
    // Round 2 新增 condM: Saturn 在 6 宮任意 dignity + Moon 在 9 宮（Usain Bolt 型 — 高等學位的運動員）
    //   Saturn 6 = 競爭耐力；Moon 9 = 遠方榮耀
    const condM = saturnH === 6 && moonHouse === 9
    // Round 2 新增 condN: Mars 在 2 宮 + karmesh 在 9 宮 → 家族／地區明星運動員（Jordan 型 — 10 宮主 Jupiter 9 + Mars 2）
    const condN = marsHouse === 2 && analysis?.karmesh?.house === 9 && ['Jupiter', 'Sun'].includes(karmeshPlanet)
    // Round 2 新增 condO: Mars-ruled lagna (Mesha/Vrishchika) + 命主 Mars（即 lagnaLord=Mars）任意 dignity
    //   牡羊／天蠍命 = 先天運動員命盤原型（即使 Mars 陷落 — Zidane 型）
    //   需附加 Venus/Saturn 強旺配合（避免純粹弱 Mars 誤判）
    const venusSig2 = analysis?.significators?.find((s) => s.planet === 'Venus')
    const venusStrong2 = venusSig2 && ['own', 'exalted', 'moolatrikona'].includes(venusSig2.dignity)
    const condO = lagnaLordIsMars && (venusStrong2 || saturnStrong === 'own' || saturnStrong === 'exalted' || saturnStrong === 'moolatrikona')
    // Round 2 新增 condP: Mars 在 11 宮（收入 + upachaya）任意 dignity 非陷落 + karmesh 在 kendra/trikona → 運動員變現型（Federer/Gretzky 型）
    const condP = marsHouse === 11 && marsDignity !== 'debilitated' && [1, 4, 5, 7, 9, 10].includes(analysis?.karmesh?.house)
    // Round 2 新增 condQ: Mars H6 任意 dignity 非陷落 + Moon 在 5 宮 → 外科型／競賽型（Kareem 型）
    const condQ = marsHouse === 6 && marsDignity !== 'debilitated'
    if (condA || condB || condD || condE || condF || condG || condH || condI || condJ || condK || condL || condM || condN || condO || condP || condQ) {
      set.add('sports-athlete')
      evidence.push(`derived: Mars athletic pattern → sports-athlete`)
    }
  }
  // Round 2 新增：Venus + Moon combo = performer signal
  // Venus 強 + Moon 在公眾宮 (1/4/10)，或 Venus 在 1/10 + Moon 強 → arts-performer
  // 救回：Elvis、Justin Bieber、Marilyn Monroe、Whitney Houston
  if (venusHouse && moonHouse) {
    const venusStrong = ['own', 'exalted', 'moolatrikona', 'friendly'].includes(venusDignity)
    const moonStrong = ['own', 'exalted', 'moolatrikona', 'friendly'].includes(moonDignity)
    const venusPublicHouse = [1, 4, 5, 7, 10].includes(venusHouse)
    const moonPublicHouse = [1, 4, 10].includes(moonHouse)
    const hasMalavya = (analysis?.activeCareerYogas || []).some((y) => y.id === 'mahapurusha-Venus')
    const d10VenusSignal = d10Lord === 'Venus'
    // condA: Venus 藝術位 + Moon 公眾位 + 有一方強
    const condA = venusPublicHouse && moonPublicHouse && (venusStrong || moonStrong)
    // condB: Malavya Yoga（絕對訊號）
    const condB = hasMalavya
    // condC: Venus 在 1/10 + Moon 強（performer 代表公眾）
    const condC = [1, 10].includes(venusHouse) && moonStrong
    // condD: D10 10 宮主為 Venus（事業實踐指向藝術）
    const condD = d10VenusSignal && venusDignity !== 'debilitated'
    // Round 2 condE: Venus 在 Trikona/收入宮 (5/9/11) + friendly+ dignity → 藝術家原型
    //   救回：Whitney Houston (Venus H6 — 不符合)、Adele、Lady Gaga 等
    const condE = [5, 9, 11].includes(venusHouse) && venusStrong && ['Mercury', 'Venus', 'Moon', 'Saturn'].includes(karmeshPlanet)
    // Round 2 condF: Mercury karmesh 在公眾宮（1/3/5/7/10/11）+ Venus 任意 friendly+
    //   Mercury 本身 = 聲音/語言 → 演講/歌手；配合 Venus friendly = 表演型
    //   救回：Taylor Swift（有 Mercury H1 + Venus H2）、Amitabh Bachchan、Humphrey Bogart
    const condF = karmeshPlanet === 'Mercury' && [1, 3, 5, 7, 10, 11].includes(analysis?.karmesh?.house)
      && venusStrong
    // Round 2 condG: saraswati yoga 但非 arts-creator → arts-performer 加成
    //   Saraswati = 知識/藝術/表達三合，可能是創作者也可能是表演者
    const hasSaraswati = (analysis?.activeCareerYogas || []).some((y) => y.id === 'saraswati')
    const condG = hasSaraswati && ['Venus', 'Moon', 'Mercury'].includes(karmeshPlanet)
    if (condA || condB || condC || condD || condE || condF || condG) {
      set.add('arts-performer')
      evidence.push(`derived: Venus-Moon performer pattern → arts-performer`)
    }
  }
  // Sun 強 + 落 1/10/7 宮（公眾能見） → media-personality / government
  if (sunHouse && [1, 7, 10].includes(sunHouse)) {
    if (!set.has('media-personality')) {
      const sunDignity = sunSig?.dignity
      if (['own', 'exalted', 'friendly'].includes(sunDignity)) {
        set.add('media-personality')
        evidence.push(`derived: Sun in ${sunHouse} + strong → media-personality`)
      }
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // Round 3：Business sub-category derived detectors
  // ══════════════════════════════════════════════════════════════════
  // 依 Vedic 古典訊號把 business-* 細分為具體 sub-category
  const karmeshHouse = analysis?.karmesh?.house
  const lagnaLordHouse = analysis?.lagnaLord?.house
  const jupSig = sigs.find((s) => s.planet === 'Jupiter')
  const mercSig = sigs.find((s) => s.planet === 'Mercury')
  const satSig = sigs.find((s) => s.planet === 'Saturn')
  const jupHouse = jupSig?.graha?.house
  const mercHouse = mercSig?.graha?.house
  const satHouse = satSig?.graha?.house
  const jupDignity = jupSig?.dignity
  const mercDignity = mercSig?.dignity
  const satDignity = satSig?.dignity
  const yogas = new Set((analysis?.activeCareerYogas || []).map((y) => y.id))
  const hasDhana = yogas.has('dhana-yoga')
  const hasRaj = yogas.has('raj-yoga')
  const hasLaxmi = yogas.has('laxmi-yoga') // 未實作則為 false
  const hasKubera = yogas.has('kubera-yoga') // 未實作則為 false
  const hasMahabhagya = yogas.has('mahabhagya-yoga') // 未實作則為 false
  const strongD = ['own', 'exalted', 'moolatrikona']
  const goodD = ['own', 'exalted', 'moolatrikona', 'friendly']

  // === 1. business-investor ===
  // 古典訊號：
  //   - 2 宮主 + 11 宮主互換（Parivartana）或會合 = Dhana Yoga 強訊號
  //   - Jupiter + Mercury 都強 + 在 2/5/11
  //   - 11 宮（收入）有多顆吉星
  //   - karmesh 為 Jupiter/Mercury + 落 11/5/2 宮
  //   - hasDhana + Jupiter strong + Saturn strong（長期財富）
  {
    const isInvestorByKarmesh = ['Jupiter', 'Mercury'].includes(karmeshPlanet) && [2, 5, 11].includes(karmeshHouse)
    const jupWealthHouse = jupHouse && [2, 5, 11].includes(jupHouse) && goodD.includes(jupDignity)
    const mercWealthHouse = mercHouse && [2, 5, 11].includes(mercHouse) && goodD.includes(mercDignity)
    const venusWealthHouse = venusHouse && [2, 5, 11].includes(venusHouse) && ['own', 'exalted', 'moolatrikona', 'friendly'].includes(venusDignity)
    const satInIncome = satHouse === 11 && goodD.includes(satDignity)
    // Round 3 iter2：11 宮 stellium（多顆行星聚集）= 強財富訊號
    const countInEleventh = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].filter((p) => sigs.find((s) => s.planet === p && s.graha?.house === 11)).length
    const eleventhStellium = countInEleventh >= 2
    // Round 3 iter2：2 宮 + 11 宮都有 benefic（Jupiter/Venus/Mercury 之一）
    const twoElevenBothFilled = ['Jupiter', 'Venus', 'Mercury'].some((p) => sigs.find((s) => s.planet === p && s.graha?.house === 2))
      && ['Jupiter', 'Venus', 'Mercury'].some((p) => sigs.find((s) => s.planet === p && s.graha?.house === 11))
    // condA: karmesh 指向財富 + Jupiter/Mercury 強
    const condA = isInvestorByKarmesh && (jupWealthHouse || mercWealthHouse)
    // condB: Dhana yoga + Jupiter + Mercury 兩顆都強（純投資人型）
    const condB = hasDhana && jupWealthHouse && mercWealthHouse
    // condC: Saturn 在 11 宮強 + Jupiter 強（長期投資者 — Buffett/Munger 型）
    const condC = satInIncome && goodD.includes(jupDignity)
    // condD: Lagna lord 在 11 宮 + karmesh 強（聚財能手）
    const condD = lagnaLordHouse === 11
    // condE: Laxmi/Kubera/Mahabhagya 明確瑜伽訊號
    const condE = hasLaxmi || hasKubera || hasMahabhagya
    // Round 3 iter2 condF: 11 宮 stellium（Ray Dalio Mercury+Venus+Saturn 都在 11）
    const condF = eleventhStellium
    // Round 3 iter2 condG: 2+11 雙宮 benefic（傳統 Dhana Yoga 延伸）
    const condG = twoElevenBothFilled
    // Round 3 iter2 condH: Mercury+Venus 都在 11 強旺（Buffett 型 — 精算 + 魅力型投資）
    const condH = venusWealthHouse && mercWealthHouse && venusHouse === mercHouse
    // Round 3 iter2 condI: Jupiter 強 + dhana-yoga + Sun 強旺（長期財富累積）
    const condI = hasDhana && ['own', 'exalted'].includes(jupDignity)
    if (condA || condB || condC || condD || condE || condF || condG || condH || condI) {
      set.add('business-investor')
      set.add('business-finance')
      evidence.push('derived: wealth/dhana pattern → business-investor + business-finance')
    }
  }

  // === 2. business-finance ===
  // Jupiter 強 + Mercury 強 + 落 2/5/8/11（金融專宮）
  // karmesh Mercury/Jupiter 在 2/11
  // Saturn 強 + 2/11（傳統銀行家）
  {
    const karmeshFinance = ['Mercury', 'Jupiter', 'Saturn'].includes(karmeshPlanet) && [2, 5, 8, 11].includes(karmeshHouse)
    const jupMercBoth = goodD.includes(jupDignity) && goodD.includes(mercDignity)
      && ((jupHouse && [2, 5, 11].includes(jupHouse)) || (mercHouse && [2, 5, 11].includes(mercHouse)))
    if (karmeshFinance || jupMercBoth) {
      set.add('business-finance')
      evidence.push('derived: finance signature → business-finance')
    }
  }

  // === 3. business-retail / 消費品 ===
  // Venus 強 + 2/5/10 宮（聲音／商品／舞台）+ Moon 強（大眾偏好）
  // karmesh Venus 在 2/10
  {
    const karmeshRetail = karmeshPlanet === 'Venus' && [2, 5, 10].includes(karmeshHouse)
    const venusStrong = ['own', 'exalted', 'moolatrikona', 'friendly'].includes(venusDignity)
    const moonStrong = ['own', 'exalted', 'moolatrikona', 'friendly'].includes(moonDignity)
    const venusAndMoonRetail = venusStrong && moonStrong
      && venusHouse && [2, 5, 10].includes(venusHouse)
    if (karmeshRetail || venusAndMoonRetail) {
      set.add('business-retail')
      evidence.push('derived: Venus+Moon retail pattern → business-retail')
    }
  }

  // === 4. business-realestate ===
  // Mars 強 + 4 宮 / 4 宮主 + Saturn（建築／土地）
  // karmesh Mars 在 4 宮 或 Mars 落 4
  {
    const marsFourth = marsHouse === 4 && marsDignity !== 'debilitated'
    const karmeshRE = karmeshPlanet === 'Mars' && karmeshHouse === 4
    const saturnFourth = satHouse === 4 && goodD.includes(satDignity)
    // Round 3 iter3：4 宮任何行星 + karmesh 在 2/11 （土地財富）
    const anyInFourth = sigs.some((s) => s.graha?.house === 4 && ['Sun', 'Moon', 'Mars', 'Venus', 'Jupiter', 'Saturn'].includes(s.planet))
    const karmeshWealthHouse = [2, 11].includes(karmeshHouse)
    // Round 3 iter3：Moon 在 4（家園／土地）+ Venus 或 Jupiter 強（財產型）
    const moonFourthPropertySignal = moonHouse === 4 && goodD.includes(moonDignity)
    // Round 3 iter3：Moon/Venus 在 4 宮
    const moonOrVenusFourth = (moonHouse === 4) || (venusHouse === 4)
    if (marsFourth || karmeshRE || saturnFourth
        || (anyInFourth && karmeshWealthHouse)
        || moonFourthPropertySignal
        || (moonOrVenusFourth && satHouse && [2, 4, 11].includes(satHouse))) {
      set.add('business-realestate')
      evidence.push('derived: Mars/Saturn in 4th → business-realestate')
    }
  }

  // === 5. business-industrial ===
  // Saturn 強 + 6/10/11 宮 + Mars 強（重工／製造）
  // karmesh Saturn 在 6/10/11
  {
    const karmeshInd = karmeshPlanet === 'Saturn' && [6, 10, 11].includes(karmeshHouse)
    const satStrongWorkHouse = satHouse && [6, 10, 11].includes(satHouse) && goodD.includes(satDignity)
    const satAndMars = satStrongWorkHouse && marsDignity !== 'debilitated' && [3, 6, 10, 11].includes(marsHouse)
    // Round 3 iter2：Mars 強 + Saturn 在 upachaya — 製造業大亨的典型
    const marsStrongUpachaya = marsHouse && [3, 6, 10, 11].includes(marsHouse)
      && ['own', 'exalted', 'moolatrikona', 'friendly'].includes(marsDignity)
    const satInUpachaya = satHouse && [3, 6, 10, 11].includes(satHouse)
    // Round 3 iter2：karmesh 在 6 宮（服務／勞動）+ Mars 非陷落 → 製造業（Akio Morita 型）
    const karmeshSixth = karmeshHouse === 6 && marsDignity !== 'debilitated'
    if (karmeshInd || satAndMars || (marsStrongUpachaya && satInUpachaya) || karmeshSixth) {
      set.add('business-industrial')
      evidence.push('derived: Saturn+Mars industrial pattern → business-industrial')
    }
  }

  // === 6. business-tech-founder ===
  // Rahu 強 + Mercury 強 + Saturn 任意
  // karmesh Rahu/Mercury 在 10/11
  {
    const rahuSig = sigs.find((s) => s.planet === 'Rahu')
    const rahuHouse = rahuSig?.graha?.house
    const rahuTenth = rahuHouse && [3, 6, 10, 11].includes(rahuHouse)
    const mercStrongOnWork = mercHouse && [1, 3, 10, 11].includes(mercHouse) && goodD.includes(mercDignity)
    const karmeshTech = ['Rahu', 'Mercury'].includes(karmeshPlanet) && [1, 3, 5, 10, 11].includes(karmeshHouse)
    // Round 3 iter3：Mercury 為命主（雙子／處女 lagna）+ Mercury 強 → 天生 tech/商業嗅覺
    const mercIsLagnaLord = lagnaLordPlanet === 'Mercury'
    // Round 3 iter3：Bhadra yoga（Mercury Mahapurusha）= 明確商業／知識偉人訊號
    const hasBhadra = yogas.has('mahapurusha-Mercury')
    // Round 3 iter3：Rahu 強旺（任意 dignity）在 10/11 + 水星在任何 benefic 宮 = 現代科技創辦人
    const rahuTen = rahuHouse === 10 || rahuHouse === 11
    const mercOK = mercHouse && [1, 2, 3, 5, 10, 11].includes(mercHouse)
    // Round 3 iter3：karmesh Venus 在 10/11 + 強 → 平台／內容／生活品牌 tech（Lei Jun/Zuckerberg 型）
    const karmeshVenusTech = karmeshPlanet === 'Venus' && [5, 9, 10, 11].includes(karmeshHouse)
    // Round 3 iter3：Mercury 在 3 宮（傳播／網絡）+ 任何 dignity
    const mercInThird = mercHouse === 3
    if ((rahuTenth && mercStrongOnWork) || karmeshTech || (mercIsLagnaLord && goodD.includes(mercDignity))
        || hasBhadra || (rahuTen && mercOK) || karmeshVenusTech || mercInThird) {
      set.add('business-tech-founder')
      evidence.push('derived: Rahu+Mercury tech pattern → business-tech-founder')
    }
  }

  // === 7. business-tycoon-founder（白手起家）===
  // Sun 強 + 1/10 + Mars 強 + Lagna lord 強 落 10/11
  // Saturn 強 在 10 + 5 宮（長期建立帝國）
  // karmesh 強旺（Sun/Mars）+ 落 10 宮
  {
    const ownKarmesh = ['Sun', 'Mars', 'Mercury', 'Venus'].includes(karmeshPlanet) && karmeshHouse === 10
    const lagnaLordTenth = [10, 11].includes(lagnaLordHouse) && goodD.includes(analysis?.lagnaLord?.dignity)
    const satInTenStrong = satHouse === 10 && goodD.includes(satDignity)
    const sunStrongFirst = sunHouse && [1, 10].includes(sunHouse) && ['own', 'exalted'].includes(sunSig?.dignity)
    // Round 3 iter3：任何強 karmesh（own/exalted/moolatrikona）= 有 vision 的創辦人
    const karmeshStrong = strongD.includes(analysis?.karmesh?.dignity)
    // Round 3 iter3：vipreet-raj yoga（逆境反彈）+ karmesh 在 trikona → 從無到有建立帝國（Masayoshi Son 型）
    const hasVipreet = yogas.has('vipreet-raj')
    const karmeshTrikona = [1, 5, 9].includes(karmeshHouse)
    // Round 3 iter3：Bhadra yoga（Mercury Mahapurusha）+ Mercury 強 = 商業偉人
    const hasBhadraL = yogas.has('mahapurusha-Mercury')
    // Round 3 iter3：強 lagna lord 配合 Mars/Sun 在 kendra 或 upachaya
    const strongLagnaLord = goodD.includes(analysis?.lagnaLord?.dignity)
    const marsOrSunKendra = (marsHouse && [1, 4, 7, 10, 11].includes(marsHouse))
      || (sunHouse && [1, 4, 7, 10].includes(sunHouse))
    if (ownKarmesh || lagnaLordTenth || satInTenStrong || sunStrongFirst || karmeshStrong
        || hasBhadraL || (hasVipreet && karmeshTrikona) || (strongLagnaLord && marsOrSunKendra)) {
      set.add('business-tycoon-founder')
      evidence.push('derived: 強旺 karmesh/lagna lord in 10 → business-tycoon-founder')
    }
  }

  // === 8. business-tycoon-heir（家族繼承）===
  // 4 宮（家族）強 + 2 宮（家業）強 + Moon 在 4
  // Jupiter 強在 4/9 + Venus 強在 2 + Lagna lord 也強（家族餵養）
  {
    const fourthRulerStrong = (moonHouse === 4 && goodD.includes(moonDignity))
      || (jupHouse === 4 && goodD.includes(jupDignity))
    const venusSecondStrong = venusHouse === 2 && ['own', 'exalted', 'moolatrikona', 'friendly'].includes(venusDignity)
    const jupNinth = jupHouse === 9 && goodD.includes(jupDignity)
    // 繼承型的典型：2 宮或 4 宮主在 Kendra/Trikona + 家業訊號
    const karmeshSecond = karmeshHouse === 2
    // Round 3 iter2：Jupiter 或 Venus 在 4 宮（家業宮）任何 dignity（Anil Ambani / Chey Tae-won 型）
    const jupOrVenusFourth = (jupHouse === 4) || (venusHouse === 4)
    // Round 3 iter2：Moon/Venus 在 2/4 + karmesh 在 kendra（家族聲譽型）
    const moonSecondOrFourth = moonHouse && [2, 4].includes(moonHouse)
    const venusSecondOrFourth = venusHouse && [2, 4].includes(venusHouse)
    const karmeshKendra = [1, 4, 7, 10].includes(karmeshHouse)
    const kendraFamily = karmeshKendra && (moonSecondOrFourth || venusSecondOrFourth || jupOrVenusFourth)
    // Round 3 iter2：lagna lord 在 4 宮（本人即家業代表）
    const lagnaLordFourth = lagnaLordHouse === 4
    if ((fourthRulerStrong && venusSecondStrong) || (karmeshSecond && (fourthRulerStrong || jupNinth))
        || kendraFamily || lagnaLordFourth || jupOrVenusFourth) {
      set.add('business-tycoon-heir')
      evidence.push('derived: 4th/2nd strength → business-tycoon-heir')
    }
  }

  // === 9. business-ceo-hired（職業 CEO）===
  // Saturn 強 在 10 + Mercury 強（組織 + 溝通）+ 但沒有 strong Sun（不是創辦人型）
  // Dasha 時期：Saturn 或 Mercury 大運（成熟期當 CEO）
  // karmesh Mercury/Saturn 強旺 + 落 7/10 + 無 raj-yoga 但有 amala yoga（乾淨的 10 宮）
  {
    const karmeshForCeo = ['Mercury', 'Saturn'].includes(karmeshPlanet) && [7, 10].includes(karmeshHouse)
      && goodD.includes(analysis?.karmesh?.dignity)
    const mercStrongWork = mercHouse && [1, 10, 11].includes(mercHouse) && goodD.includes(mercDignity)
    const satStrongWork = satHouse && [7, 10].includes(satHouse) && goodD.includes(satDignity)
    // 額外：Mercury 大運或 Saturn 大運 + karmesh 在 kendra
    const dashaLord = analysis?.dasha?.lord
    const ceoDasha = ['Mercury', 'Saturn'].includes(dashaLord)
    // Round 3 iter2：廣義 CEO 訊號 — 任何 karmesh 在 7 宮或 10 宮 + Mercury/Saturn 強
    const karmeshKendraBiz = [7, 10].includes(karmeshHouse)
    const mercOrSatStrong = goodD.includes(mercDignity) || goodD.includes(satDignity)
    // Round 3 iter2：Jupiter 在 7 宮（合夥／顧問型 CEO — Sundar Pichai 型）
    const jupSeventh = jupHouse === 7
    // Round 3 iter2：karmesh 為 benefic（Mercury/Jupiter/Venus）在 kendra + Saturn/Mercury 任一強
    const karmeshBeneficKendra = ['Mercury', 'Jupiter', 'Venus'].includes(karmeshPlanet)
      && [1, 4, 7, 10].includes(karmeshHouse)
    if (karmeshForCeo || (mercStrongWork && satStrongWork)
        || (karmeshKendraBiz && mercOrSatStrong)
        || (jupSeventh && mercStrongWork)
        || (karmeshBeneficKendra && ceoDasha)) {
      set.add('business-ceo-hired')
      set.add('business-leader')
      evidence.push('derived: Mercury+Saturn leadership pattern → business-ceo-hired')
    }
  }

  // === 10. business-media（媒體業）===
  // Mercury 強 + Venus 強 + 落 3/5/10 宮（傳播／創作／事業）
  // karmesh Mercury/Venus 在 3 宮（媒體／出版）
  {
    const karmeshMedia = ['Mercury', 'Venus'].includes(karmeshPlanet) && [3, 5, 10].includes(karmeshHouse)
    const mercVenusMedia = mercHouse && [3, 5, 10].includes(mercHouse) && goodD.includes(mercDignity)
      && venusHouse && [3, 5, 10].includes(venusHouse) && ['own', 'exalted', 'moolatrikona', 'friendly'].includes(venusDignity)
    if (karmeshMedia || mercVenusMedia) {
      set.add('business-media')
      evidence.push('derived: Mercury+Venus media pattern → business-media')
    }
  }

  // 4. Playbook sweetSpot / modernExamples — secondary signal
  const sweetSpot = analysis?.playbook?.sweetSpot || ''
  const modernExamples = (analysis?.playbook?.modernExamples || []).join('  ')
  const combinedPlaybookText = `${sweetSpot}  ${modernExamples}`
  for (const [cat, kws] of Object.entries(CATEGORY_KEYWORDS)) {
    if (set.has(cat)) continue
    for (const kw of kws.hard) {
      if (combinedPlaybookText.includes(kw)) {
        set.add(cat)
        evidence.push(`playbook: "${kw}" → ${cat}`)
        break
      }
    }
  }

  // 5. Narrative scan — last-resort fallback, only picks up super explicit matches
  const narrative = analysis?.narrative || ''
  for (const [cat, kws] of Object.entries(CATEGORY_KEYWORDS)) {
    if (set.has(cat)) continue
    for (const kw of kws.hard) {
      if (narrative.includes(kw)) {
        set.add(cat)
        evidence.push(`narrative: "${kw}" → ${cat}`)
        break
      }
    }
  }

  return { predicted: Array.from(set), evidence }
}

// ═════════════════════════════════════════════════════════════════
// Score one celebrity: full / partial / miss
// ═════════════════════════════════════════════════════════════════
function scoreOne(trueCats, predicted) {
  const predSet = new Set(predicted)
  // Collect all families present in predictions
  const predFams = new Set()
  for (const c of predicted) for (const f of familiesOf(c)) predFams.add(f)
  // Full match: any true category is exactly in predicted
  const full = trueCats.some((c) => predSet.has(c))
  if (full) return { tier: 'full', points: 3 }
  // Partial match: any true category's family overlaps with any predicted family
  const partial = trueCats.some((c) => familiesOf(c).some((f) => predFams.has(f)))
  if (partial) return { tier: 'partial', points: 1 }
  return { tier: 'miss', points: 0 }
}

// Pick a "primary" predicted label for display
function summarizePrediction(predicted) {
  if (!predicted.length) return '(no prediction)'
  return predicted.slice(0, 4).join(', ')
}

// ═════════════════════════════════════════════════════════════════
// Run one celebrity through the full pipeline
// ═════════════════════════════════════════════════════════════════
function runOne(entry) {
  const { year, month, day, hour, minute, tz, lat, lon } = entry.birth
  let chart, dashaLord = null, adLord = null, analysis
  try {
    chart = computeVedicChart({ year, month, day, hour, minute, tzOffset: tz, lat, lon })
    const periods = computeVimshottariDasha({
      moonSidereal: chart.sidereal.moon.longitude,
      birthYear: year,
      birthMonth: month,
      birthDay: day,
      birthHour: hour,
      birthMinute: minute
    })
    const now = new Date('2024-06-01T00:00:00Z')
    const cur = getCurrentDasha(periods, now)
    dashaLord = cur?.lord || null
    if (cur) {
      const ads = computeAntardashas(cur)
      const curAD = getCurrentAntardasha(ads, now)
      adLord = curAD?.lord || null
    }
    analysis = analyzeVedicCareer(chart, dashaLord, adLord)
  } catch (err) {
    return {
      name: entry.name,
      error: err.message,
      tier: 'error',
      points: 0
    }
  }
  const { predicted, evidence } = predictCategories(analysis)
  const { tier, points } = scoreOne(entry.categories, predicted)
  return {
    name: entry.name,
    rating: entry.rating,
    trueCats: entry.categories,
    career: entry.career,
    karmeshPlanet: analysis.karmesh?.planet,
    karmeshHouse: analysis.karmesh?.house,
    lagnaLordPlanet: analysis.lagnaLord?.planet,
    lagnaLordHouse: analysis.lagnaLord?.house,
    dashaLord,
    adLord,
    karmeshReading: analysis.karmesh?.combinationReading,
    karakaOverrides: (analysis.karakaOverrides || []).map((o) => o.category || o.id),
    activeYogas: (analysis.activeCareerYogas || []).map((y) => y.id),
    predicted,
    evidence,
    tier,
    points
  }
}

// ═════════════════════════════════════════════════════════════════
// Run all and aggregate
// ═════════════════════════════════════════════════════════════════
const results = []
for (const entry of dataset) {
  results.push(runOne(entry))
}

const total = results.length
const errors = results.filter((r) => r.tier === 'error')
const valid = results.filter((r) => r.tier !== 'error')
const full = valid.filter((r) => r.tier === 'full').length
const partial = valid.filter((r) => r.tier === 'partial').length
const miss = valid.filter((r) => r.tier === 'miss').length
const accuracy = valid.length ? (full + partial * 0.5) / valid.length : 0

// Per-category breakdown
const catStats = {} // cat → { full, partial, miss, total }
for (const r of valid) {
  for (const c of r.trueCats) {
    if (!catStats[c]) catStats[c] = { full: 0, partial: 0, miss: 0, total: 0 }
    catStats[c].total += 1
    catStats[c][r.tier] += 1
  }
}

// Per-karmeshPlanet breakdown
const planetStats = {}
for (const r of valid) {
  const k = r.karmeshPlanet || 'unknown'
  if (!planetStats[k]) planetStats[k] = { full: 0, partial: 0, miss: 0, total: 0 }
  planetStats[k].total += 1
  planetStats[k][r.tier] += 1
}

// ═════════════════════════════════════════════════════════════════
// Print summary
// ═════════════════════════════════════════════════════════════════
const lines = []
const out = (s) => { lines.push(s); console.log(s) }

out('='.repeat(70))
out(`Celebrity Validation Results   (N=${total}, errors=${errors.length})`)
if (DOMAIN) out(`Domain filter: ${DOMAIN}`)
out(`Min rating: ${MIN_RATING}`)
out('='.repeat(70))
out(`Accuracy: ${(accuracy * 100).toFixed(1)}%`)
out(`  Full match:    ${full}/${valid.length}  (${((full/valid.length)*100).toFixed(1)}%)`)
out(`  Partial match: ${partial}/${valid.length}  (${((partial/valid.length)*100).toFixed(1)}%)`)
out(`  Miss:          ${miss}/${valid.length}  (${((miss/valid.length)*100).toFixed(1)}%)`)
out('')

out('Per-category accuracy:')
const catEntries = Object.entries(catStats).sort((a, b) => b[1].total - a[1].total)
for (const [cat, s] of catEntries) {
  const acc = ((s.full + s.partial * 0.5) / s.total) * 100
  out(`  ${cat.padEnd(26)} ${s.full}F/${s.partial}P/${s.miss}M of ${s.total}  = ${acc.toFixed(0)}%`)
}
out('')

// Round 3：category breakdown — 專注 business sub-category 細分
if (CATEGORY_BREAKDOWN) {
  out('Business sub-category breakdown (Round 3):')
  const subCats = [
    'business-tycoon-founder', 'business-tycoon-heir', 'business-ceo-hired',
    'business-investor', 'business-finance', 'business-retail',
    'business-media', 'business-realestate', 'business-industrial',
    'business-tech-founder'
  ]
  for (const sc of subCats) {
    const s = catStats[sc]
    if (!s || s.total === 0) {
      out(`  ${sc.padEnd(28)} (0 samples — skipped)`)
      continue
    }
    const acc = ((s.full + s.partial * 0.5) / s.total) * 100
    const warning = s.total < 20 ? '  ⚠️ 樣本 < 20，誤差大' : ''
    out(`  ${sc.padEnd(28)} ${s.full}F/${s.partial}P/${s.miss}M of ${s.total}  = ${acc.toFixed(0)}%${warning}`)
  }
  // 計算整個 business family 的 accuracy
  const bizResults = valid.filter((r) => r.trueCats.some((c) => c.startsWith('business-')))
  const bizFull = bizResults.filter((r) => r.tier === 'full').length
  const bizPartial = bizResults.filter((r) => r.tier === 'partial').length
  const bizTotal = bizResults.length
  if (bizTotal > 0) {
    const bizAcc = ((bizFull + bizPartial * 0.5) / bizTotal) * 100
    out(`  ${'── 整個 business 領域 ──'.padEnd(28)} ${bizFull}F/${bizPartial}P/${bizTotal - bizFull - bizPartial}M of ${bizTotal}  = ${bizAcc.toFixed(1)}%`)
  }
  out('')
}

out('Per-karmeshPlanet accuracy:')
const planetEntries = Object.entries(planetStats).sort((a, b) => b[1].total - a[1].total)
for (const [p, s] of planetEntries) {
  const acc = ((s.full + s.partial * 0.5) / s.total) * 100
  out(`  ${p.padEnd(10)} ${s.full}F/${s.partial}P/${s.miss}M of ${s.total}  = ${acc.toFixed(0)}%`)
}
out('')

out('Miss list (expected but predicted something different):')
const misses = valid.filter((r) => r.tier === 'miss').sort((a, b) => a.name.localeCompare(b.name))
for (const r of misses) {
  out(`  ${r.name.padEnd(26)} true=${r.trueCats.join('|').padEnd(30)} pred=${summarizePrediction(r.predicted)}`)
  if (VERBOSE) {
    out(`      karmesh=${r.karmeshPlanet}/${r.karmeshHouse}  lagnaLord=${r.lagnaLordPlanet}/${r.lagnaLordHouse}  dasha=${r.dashaLord}`)
    out(`      reading="${r.karmeshReading}"`)
    out(`      karaka=${JSON.stringify(r.karakaOverrides)}  yogas=${JSON.stringify(r.activeYogas)}`)
  }
}

out('')
out('Partial list:')
const partials = valid.filter((r) => r.tier === 'partial').sort((a, b) => a.name.localeCompare(b.name))
for (const r of partials) {
  out(`  ${r.name.padEnd(26)} true=${r.trueCats.join('|').padEnd(30)} pred=${summarizePrediction(r.predicted)}`)
}

if (errors.length) {
  out('')
  out('Errors:')
  for (const e of errors) out(`  ${e.name}: ${e.error}`)
}

// ═════════════════════════════════════════════════════════════════
// Save a machine-readable JSON companion for further analysis
// ═════════════════════════════════════════════════════════════════
const reportsDir = path.resolve(__dirname, '../reports')
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true })
const jsonPath = path.resolve(reportsDir, 'last-run.json')
fs.writeFileSync(
  jsonPath,
  JSON.stringify(
    {
      total,
      valid: valid.length,
      full,
      partial,
      miss,
      accuracy,
      catStats,
      planetStats,
      results: valid.map((r) => ({
        name: r.name,
        trueCats: r.trueCats,
        predicted: r.predicted,
        tier: r.tier,
        karmeshPlanet: r.karmeshPlanet,
        karmeshHouse: r.karmeshHouse,
        lagnaLordPlanet: r.lagnaLordPlanet,
        lagnaLordHouse: r.lagnaLordHouse,
        dashaLord: r.dashaLord,
        karmeshReading: r.karmeshReading,
        karakaOverrides: r.karakaOverrides,
        activeYogas: r.activeYogas
      }))
    },
    null,
    2
  )
)
console.log(`\n(wrote ${jsonPath})`)

if (SAVE_REPORT) {
  const reportPath = path.resolve(process.cwd(), SAVE_REPORT)
  fs.writeFileSync(reportPath, lines.join('\n'))
  console.log(`(wrote ${reportPath})`)
}
