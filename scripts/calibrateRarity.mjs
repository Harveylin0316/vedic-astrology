#!/usr/bin/env node
// 監督式校準：以「事業成功 = 命盤稀有」為假設，用 391 celebrity vs
// 3000 random 對照，找出真正預測成功的 yoga 特徵
//
// 核心邏輯：
//   1. 跑 celebrity → 統計每個 yoga 的 celebrity_rate
//   2. 跑 random → 統計每個 yoga 的 random_rate
//   3. lift = celebrity_rate / random_rate
//      - lift > 1.5: celebrity 顯著多 → 真正的成功預測訊號（權重↑）
//      - lift ~ 1:   跟成功無關（權重 ≈ 基準）
//      - lift < 0.8: celebrity 反而少（權重↓）
//   4. 輸出建議權重表
//
// Usage: node scripts/calibrateRarity.mjs

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { computeVedicChart } from '../src/utils/vedicCalc.js'
import { detectYogas } from '../src/utils/yogaDetector.js'
import { detectRareConfigs } from '../src/utils/rareConfigs.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ─── Helper：歸一 yoga id 到類別（例如 'mahapurusha-Mars' → 'mahapurusha') ───
function normalizeCategoryKey(id) {
  for (const cat of ['mahapurusha', 'parivartana', 'stellium', 'neecha-bhanga', 'element-dominant']) {
    if (id === cat) return cat
    if (id.startsWith(cat + '-')) return cat
  }
  return id
}

// ─── 跑 chart 並取出（去重後的）yoga 類別清單 ───
// STRICT_MODE: 與 rarityIndex.js 呼叫一致
function getYogaCategoriesForChart(chart, strict = true) {
  const yogas = detectYogas(chart, { strict })
  const rareConfigs = detectRareConfigs(chart, { strict })
  const cats = new Set()
  for (const f of [...yogas, ...rareConfigs]) {
    cats.add(normalizeCategoryKey(f.id))
  }
  return cats
}

// ─── 累計一批命盤的 yoga 觸發統計 ───
function statYogas(samples, compute) {
  const counts = {}
  let n = 0
  for (const s of samples) {
    try {
      const chart = compute(s)
      const cats = getYogaCategoriesForChart(chart, true)
      for (const c of cats) {
        counts[c] = (counts[c] || 0) + 1
      }
      n++
    } catch (_) {}
  }
  return { counts, n }
}

// ═══ 載入 391 celebrity ═══
const celebrityPath = path.resolve(__dirname, '..', 'data', 'celebrityDataset.json')
const celebrities = JSON.parse(fs.readFileSync(celebrityPath, 'utf-8'))

console.log(`\n跑 ${celebrities.length} celebrity...`)
const celebStats = statYogas(
  celebrities,
  (c) => computeVedicChart({
    year: c.birth.year, month: c.birth.month, day: c.birth.day,
    hour: c.birth.hour, minute: c.birth.minute,
    tzOffset: c.birth.tz, lat: c.birth.lat, lon: c.birth.lon
  })
)

// ═══ 跑 3000 random ═══
console.log('跑 3000 random...')

function makeRng(seed) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rng = makeRng(42)
const randInt = (a, b) => Math.floor(rng() * (b - a + 1)) + a
const CITIES = [
  { lat: 25.05, lon: 121.53, tz: 8 }, { lat: 31.23, lon: 121.47, tz: 8 },
  { lat: 35.68, lon: 139.69, tz: 9 }, { lat: 19.08, lon: 72.88, tz: 5.5 },
  { lat: 51.51, lon: -0.13, tz: 0 }, { lat: 40.71, lon: -74.00, tz: -5 },
  { lat: 34.05, lon: -118.25, tz: -8 }, { lat: -23.55, lon: -46.63, tz: -3 },
  { lat: 30.04, lon: 31.24, tz: 2 }, { lat: 55.76, lon: 37.62, tz: 3 }
]
const randomSamples = []
for (let i = 0; i < 3000; i++) {
  const city = CITIES[randInt(0, CITIES.length - 1)]
  randomSamples.push({
    year: randInt(1940, 2010), month: randInt(1, 12), day: randInt(1, 28),
    hour: randInt(0, 23), minute: randInt(0, 59), ...city
  })
}
const randStats = statYogas(
  randomSamples,
  (s) => computeVedicChart({ ...s, tzOffset: s.tz })
)

// ═══ 分析：lift ═══
console.log('\n══════════════════════════════════════════════════════════════')
console.log('  Yoga 觸發率：Celebrity 391 vs Random 3000')
console.log('══════════════════════════════════════════════════════════════\n')

const allKeys = new Set([...Object.keys(celebStats.counts), ...Object.keys(randStats.counts)])
const rows = []
for (const key of allKeys) {
  const celebCount = celebStats.counts[key] || 0
  const randCount = randStats.counts[key] || 0
  const celebRate = celebCount / celebStats.n
  const randRate = randCount / randStats.n
  // 防除 0 — 如果 random 為 0，把 lift 當 infinity-ish
  const lift = randRate > 0 ? celebRate / randRate : (celebRate > 0 ? 99 : 0)
  rows.push({ key, celebCount, celebRate, randCount, randRate, lift })
}
// 依 lift desc 排序
rows.sort((a, b) => b.lift - a.lift)

console.log(
  `  ${'Yoga'.padEnd(26)} ${'Celeb'.padStart(8)} ${'Random'.padStart(8)} ${'Lift'.padStart(7)}  建議`
)
console.log('  ' + '─'.repeat(64))
for (const r of rows) {
  const celebStr = `${(r.celebRate * 100).toFixed(1)}%`
  const randStr = `${(r.randRate * 100).toFixed(1)}%`
  const liftStr = r.lift.toFixed(2) + '×'
  let hint
  if (r.lift >= 1.5) hint = '✓ 強訊號（權重↑）'
  else if (r.lift >= 1.15) hint = '· 弱訊號'
  else if (r.lift <= 0.7) hint = '✗ 反訊號（權重↓）'
  else hint = '  無訊號'
  console.log(
    `  ${r.key.padEnd(26)} ${celebStr.padStart(8)} ${randStr.padStart(8)} ${liftStr.padStart(7)}  ${hint}`
  )
}

// ═══ 建議新權重 ═══
// 根據 lift 推算新權重：
//   baseline = 3（對應 lift ≈ 1）
//   強訊號 lift ≥ 1.5 → weight = round(baseline * lift^1.5)
//   反訊號 lift < 0.8 → weight = round(baseline * lift) 最少 1
console.log('\n══════════════════════════════════════════════════════════════')
console.log('  建議新權重（baseline 3）')
console.log('══════════════════════════════════════════════════════════════\n')
for (const r of rows) {
  if (r.celebRate < 0.01) continue // celebrity 都沒有的跳過
  let recommended
  if (r.lift >= 2) recommended = Math.round(3 * Math.pow(r.lift, 1.4))
  else if (r.lift >= 1.3) recommended = Math.round(3 * Math.pow(r.lift, 1.2))
  else if (r.lift >= 0.9) recommended = 3
  else recommended = Math.max(1, Math.round(3 * r.lift))
  recommended = Math.min(35, Math.max(1, recommended)) // clamp
  console.log(`  ${r.key.padEnd(26)} lift ${r.lift.toFixed(2)}× → weight ${recommended}`)
}

console.log('\n══════════════════════════════════════════════════════════════')
console.log('  說明')
console.log('══════════════════════════════════════════════════════════════')
console.log(`
  lift = celebrity 觸發率 / random 觸發率
  · lift ≥ 1.5: celebrity 顯著多 → 真正預測成功的訊號，加重權重
  · lift 0.9-1.3: 跟成功無關
  · lift < 0.8: celebrity 反而少 → 可能是雜訊或反指標

  * celebrity 是事業驗證 91.9% 的 391 人（知道他們成功）
  * random 是隨機生辰 3000 人（代表大眾）
  * 兩者 yoga 分佈差異 = 真正的成功預測特徵
`)
