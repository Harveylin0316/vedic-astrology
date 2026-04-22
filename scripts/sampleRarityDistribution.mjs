#!/usr/bin/env node
// 隨機採樣 N 個虛擬生辰，跑 rarity index，統計各 tier 實際觸發率
//
// 用途：驗證「傳奇級命盤」、「極稀有」等是否真有宣稱的罕見度
// 不動任何 rarity / 事業邏輯，純觀察。
//
// Usage:
//   node scripts/sampleRarityDistribution.mjs              # 預設 3000 人
//   node scripts/sampleRarityDistribution.mjs --n=5000     # 自訂樣本數
//   node scripts/sampleRarityDistribution.mjs --seed=42    # 固定隨機種子（可重現）

import { computeVedicChart } from '../src/utils/vedicCalc.js'
import { computeRarityIndex } from '../src/utils/rarityIndex.js'

const argv = process.argv.slice(2)
const N_ARG = argv.find((a) => a.startsWith('--n='))
const SEED_ARG = argv.find((a) => a.startsWith('--seed='))
const N = N_ARG ? parseInt(N_ARG.split('=')[1], 10) : 3000
const SEED = SEED_ARG ? parseInt(SEED_ARG.split('=')[1], 10) : Date.now()

// 簡易 PRNG（mulberry32）— 允許 --seed 重現
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

const rng = makeRng(SEED)
const randInt = (min, max) => Math.floor(rng() * (max - min + 1)) + min
const randFloat = (min, max) => rng() * (max - min) + min

// 代表性人口地理分布（非嚴謹人口加權，主要求多元 timezone / lat）
const CITIES = [
  { name: 'Taipei', lat: 25.05, lon: 121.53, tz: 8 },
  { name: 'Shanghai', lat: 31.23, lon: 121.47, tz: 8 },
  { name: 'Beijing', lat: 39.90, lon: 116.40, tz: 8 },
  { name: 'Hong Kong', lat: 22.32, lon: 114.17, tz: 8 },
  { name: 'Tokyo', lat: 35.68, lon: 139.69, tz: 9 },
  { name: 'Seoul', lat: 37.57, lon: 126.98, tz: 9 },
  { name: 'Singapore', lat: 1.35, lon: 103.82, tz: 8 },
  { name: 'Mumbai', lat: 19.08, lon: 72.88, tz: 5.5 },
  { name: 'Delhi', lat: 28.61, lon: 77.21, tz: 5.5 },
  { name: 'Bangkok', lat: 13.76, lon: 100.50, tz: 7 },
  { name: 'London', lat: 51.51, lon: -0.13, tz: 0 },
  { name: 'Paris', lat: 48.86, lon: 2.35, tz: 1 },
  { name: 'Berlin', lat: 52.52, lon: 13.40, tz: 1 },
  { name: 'NYC', lat: 40.71, lon: -74.00, tz: -5 },
  { name: 'LA', lat: 34.05, lon: -118.25, tz: -8 },
  { name: 'Sydney', lat: -33.87, lon: 151.21, tz: 10 },
  { name: 'São Paulo', lat: -23.55, lon: -46.63, tz: -3 },
  { name: 'Lagos', lat: 6.52, lon: 3.38, tz: 1 },
  { name: 'Cairo', lat: 30.04, lon: 31.24, tz: 2 },
  { name: 'Moscow', lat: 55.76, lon: 37.62, tz: 3 }
]

function randomBirth() {
  const year = randInt(1940, 2010)
  const month = randInt(1, 12)
  // 避免月底日期越界：通用 28
  const day = randInt(1, 28)
  const hour = randInt(0, 23)
  const minute = randInt(0, 59)
  const city = CITIES[randInt(0, CITIES.length - 1)]
  return { year, month, day, hour, minute, ...city }
}

// ─── Helpers ───
// 宣稱值與 rarityIndex.js 的 scoreTier 保持同步（Round 5 · 嚴格 detector 校準後）
const CLAIMED_RATES = {
  '傳奇級命盤': 0.6,
  '極稀有': 2,
  '非常稀有': 6,
  '稀有': 18,
  '有特色': 51,
  '較為平均': 91,
  '樸實型': 100
}

function tierThreshold(title) {
  return {
    '傳奇級命盤': 98,
    '極稀有': 90,
    '非常稀有': 80,
    '稀有': 70,
    '有特色': 60,
    '較為平均': 50,
    '樸實型': 0
  }[title]
}

// ════ 主迴圈 ════
console.log(`\n隨機採樣 ${N} 個虛擬生辰（seed=${SEED}）\n`)
console.log('══════════════════════════════════════════════════════════')

const scoreDistribution = [] // 全部 scores
const tierCounts = {}
const featureCounts = {} // plain → count（看哪些配置貢獻最多）
let errorCount = 0

const t0 = Date.now()

for (let i = 0; i < N; i++) {
  const birth = randomBirth()
  try {
    const chart = computeVedicChart({
      year: birth.year,
      month: birth.month,
      day: birth.day,
      hour: birth.hour,
      minute: birth.minute,
      tzOffset: birth.tz,
      lat: birth.lat,
      lon: birth.lon
    })
    const rarity = computeRarityIndex(chart)
    scoreDistribution.push(rarity.score)
    const tierKey = `${rarity.title} (≥${tierThreshold(rarity.title)})`
    tierCounts[tierKey] = (tierCounts[tierKey] || 0) + 1

    rarity.features.forEach((f) => {
      const key = f.plain || f.name
      featureCounts[key] = (featureCounts[key] || 0) + 1
    })
  } catch (err) {
    errorCount++
  }

  if ((i + 1) % 500 === 0) {
    process.stdout.write(`  [${i + 1}/${N}]\r`)
  }
}

const elapsedMs = Date.now() - t0
const successful = N - errorCount

console.log(`\n完成 ${successful}/${N}（耗時 ${(elapsedMs / 1000).toFixed(1)}s）`)
if (errorCount) console.log(`  (${errorCount} 個錯誤跳過)\n`)

// ═══ Tier 分佈 ═══
console.log('\n══════════════════════════════════════════════════════════')
console.log('Tier 分佈')
console.log('══════════════════════════════════════════════════════════')
const TIER_ORDER = ['傳奇級命盤', '極稀有', '非常稀有', '稀有', '有特色', '較為平均', '樸實型']
let cumulativePct = 0
TIER_ORDER.forEach((name) => {
  const entry = Object.entries(tierCounts).find(([k]) => k.startsWith(name))
  if (!entry) return
  const [label, count] = entry
  const singlePct = (count / successful) * 100
  cumulativePct += singlePct
  const claimed = CLAIMED_RATES[name]
  const bar = '█'.repeat(Math.round(singlePct / 2))
  console.log(`  ${name.padEnd(10, '　')} 單層 ${String(count).padStart(4)} (${singlePct.toFixed(2)}%) | 累計 ${cumulativePct.toFixed(2)}% ${bar}`)
  if (claimed) {
    const delta = cumulativePct - claimed
    const sign = delta >= 0 ? '+' : ''
    console.log(`    宣稱 Top ${claimed}% · 實際累計 ${cumulativePct.toFixed(2)}% · 差距 ${sign}${delta.toFixed(2)}pp`)
  }
})

// ═══ Score 分佈（直方圖）═══
console.log('\n══════════════════════════════════════════════════════════')
console.log('Score 分佈（直方圖，每 5 分一格）')
console.log('══════════════════════════════════════════════════════════')
const buckets = {}
for (const s of scoreDistribution) {
  const b = Math.floor(s / 5) * 5
  buckets[b] = (buckets[b] || 0) + 1
}
Object.keys(buckets)
  .map(Number)
  .sort((a, b) => a - b)
  .forEach((b) => {
    const c = buckets[b]
    const pct = ((c / successful) * 100).toFixed(1)
    const bar = '▊'.repeat(Math.round((c / successful) * 200))
    console.log(`  ${String(b).padStart(3)}-${String(b + 4).padEnd(3)} ${String(c).padStart(5)} (${pct.padStart(5)}%) ${bar}`)
  })

// ═══ Top 10 最常貢獻特徵 ═══
console.log('\n══════════════════════════════════════════════════════════')
console.log('Top 15 最常觸發的特徵（看哪些「稀有」其實很常見）')
console.log('══════════════════════════════════════════════════════════')
const sortedFeatures = Object.entries(featureCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15)
sortedFeatures.forEach(([name, count]) => {
  const pct = ((count / successful) * 100).toFixed(1)
  console.log(`  ${name.padEnd(28, '　')} ${String(count).padStart(5)} (${pct.padStart(5)}%)`)
})

// ═══ 百分位 ═══
console.log('\n══════════════════════════════════════════════════════════')
console.log('百分位（各 tier 切割點實際對應的 Top %）')
console.log('══════════════════════════════════════════════════════════')
const sorted = [...scoreDistribution].sort((a, b) => b - a)
const getTopPct = (threshold) => {
  const above = sorted.filter((s) => s >= threshold).length
  return ((above / successful) * 100).toFixed(2)
}
console.log(`  ≥98（傳奇級）     Top ${getTopPct(98).padStart(5)}%   [宣稱 0.3%]`)
console.log(`  ≥90（極稀有）     Top ${getTopPct(90).padStart(5)}%   [宣稱 1.5%]`)
console.log(`  ≥80（非常稀有）   Top ${getTopPct(80).padStart(5)}%   [宣稱   3%]`)
console.log(`  ≥70（稀有）       Top ${getTopPct(70).padStart(5)}%   [宣稱   7%]`)
console.log(`  ≥60（有特色）     Top ${getTopPct(60).padStart(5)}%   [宣稱  15%]`)
console.log(`  ≥50（較為平均）   Top ${getTopPct(50).padStart(5)}%   [宣稱  30%]`)

console.log('\n══════════════════════════════════════════════════════════\n')
