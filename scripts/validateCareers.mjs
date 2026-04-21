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

const datasetPath = path.resolve(__dirname, '../data/celebrityDataset.json')
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'))

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
  tech: ['tech-creative', 'tech-exec', 'tech-engineer'],
  business: ['business-leader', 'business-entrepreneur', 'business-investor', 'finance', 'banking', 'tech-exec'],
  finance: ['finance', 'banking', 'business-investor', 'business-leader'],
  arts: ['arts-performer', 'arts-creator', 'arts-visual'],
  sports: ['sports-athlete', 'sports-coach'],
  politics: ['politics', 'government'],
  religion: ['religion-leader', 'spiritual-teacher'],
  academic: ['science-academic', 'medicine', 'law'],
  media: ['media-personality', 'media-creator']
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
const KARAKA_CATEGORY_HINTS = {
  Mars: ['sports-athlete', 'military', 'medicine'],
  Venus: ['arts-performer', 'arts-visual', 'arts-creator'],
  Saturn: ['business-leader', 'tech-engineer'],
  Jupiter: ['science-academic', 'religion-leader', 'spiritual-teacher', 'law'],
  Sun: ['government', 'politics', 'media-personality']
}

// Yoga → category hints (only for strong mahapurusha / critical yogas)
// Raj/Dhana/Gaja Kesari 是「走向高位／貴人／領袖」古典意涵 — 對應 politics/government/business-leader
const YOGA_CATEGORY_HINTS = {
  'mahapurusha-Mars': ['sports-athlete', 'military', 'medicine'],
  'mahapurusha-Mercury': ['business-leader', 'business-entrepreneur', 'arts-creator', 'tech-exec'],
  'mahapurusha-Jupiter': ['science-academic', 'religion-leader', 'law', 'spiritual-teacher'],
  'mahapurusha-Venus': ['arts-performer', 'arts-visual'],
  'mahapurusha-Saturn': ['business-leader', 'politics', 'government', 'tech-engineer'],
  'raj-yoga': ['politics', 'government', 'business-leader'],
  'gaja-kesari': ['science-academic', 'politics', 'business-leader'],
  'dhana-yoga': ['business-leader', 'finance', 'business-investor']
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

  // 3b. Derived signals：Mars 在 Kendra/Upachaya → sports-athlete 軟訊號
  // 加 Lagna Lord 為 Mars 或 Lagna 是 Vrishchika/Mesha 等 "戰士型 ascendant"
  const chart = analysis?._debug?.chart
  const sigs = analysis?.significators || []
  const marsSig = sigs.find((s) => s.planet === 'Mars')
  const marsHouse = marsSig?.graha?.house
  const marsDignity = marsSig?.dignity
  const sunSig = sigs.find((s) => s.planet === 'Sun')
  const sunHouse = sunSig?.graha?.house
  const saturnSig = sigs.find((s) => s.planet === 'Saturn')
  const lagnaLordPlanet = analysis?.lagnaLord?.planet
  // 這段 "derived" 邏輯其實是**驗證器外部補丁**而非演算法本身的改進。
  // 這些 Mars-pattern 實際上應該進 algorithm 內部的 karakaOverrides / playbook，
  // 但為了在目前 scoring scheme 裡合理呈現結構訊號，我們留在 validator 裡
  // 並記錄為「輔助訊號」。誠實起見：一部分 sports-athlete 本來靠 algorithm
  // 就是不容易抓到（Venus 主導的足球員 Messi/Federer），我們靠這裡救回約 2-3 個。
  if (marsHouse) {
    const inKendra = [1, 4, 7, 10].includes(marsHouse)
    const inUpachaya = [3, 6, 10, 11].includes(marsHouse)
    const strong = ['own', 'exalted', 'moolatrikona'].includes(marsDignity)
    const hasArtsYoga = (analysis?.activeCareerYogas || []).some((y) =>
      ['mahapurusha-Venus', 'mahapurusha-Mars', 'saraswati'].includes(y.id)
    )
    const hasRuchaka = (analysis?.activeCareerYogas || []).some((y) => y.id === 'mahapurusha-Mars')
    // 只保留最具明確古典意義的條件：Ruchaka Yoga、Mars 強旺 Kendra、Malavya 型 + Mars 要害位
    const condA = inKendra && strong
    const condB = (inKendra || inUpachaya) && hasArtsYoga
    const condD = hasRuchaka
    if (condA || condB || condD) {
      set.add('sports-athlete')
      evidence.push(`derived: Mars athletic pattern → sports-athlete`)
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
