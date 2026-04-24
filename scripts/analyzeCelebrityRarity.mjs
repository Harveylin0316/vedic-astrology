#!/usr/bin/env node
// 檢視 391 celebrity 在新 rarity 系統（Round 6 含事業信號）下的分佈
//
// Usage: node scripts/analyzeCelebrityRarity.mjs

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  computeVedicChart, computeVimshottariDasha, getCurrentDasha,
  computeAntardashas, getCurrentAntardasha
} from '../src/utils/vedicCalc.js'
import { analyzeVedicCareer } from '../src/utils/careerVedic.js'
import { computeRarityIndex } from '../src/utils/rarityIndex.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const celebrities = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '..', 'data', 'celebrityDataset.json'), 'utf-8')
)

console.log(`\n跑 ${celebrities.length} celebrity...\n`)

const results = []
for (const c of celebrities) {
  try {
    const chart = computeVedicChart({
      year: c.birth.year, month: c.birth.month, day: c.birth.day,
      hour: c.birth.hour, minute: c.birth.minute,
      tzOffset: c.birth.tz, lat: c.birth.lat, lon: c.birth.lon
    })
    const dasha = computeVimshottariDasha(chart)
    const curDasha = dasha?.length ? getCurrentDasha(dasha) : null
    const curAD = curDasha ? getCurrentAntardasha(computeAntardashas(curDasha)) : null
    const vc = analyzeVedicCareer(chart, curDasha?.lord || null, curAD?.lord || null)
    const r = computeRarityIndex(chart, vc)
    results.push({
      name: c.name,
      career: c.career,
      categories: c.categories,
      rating: c.rating,
      score: r.score,
      rawScore: r.rawScore,
      title: r.title,
      topPercent: r.topPercent
    })
  } catch (e) {
    console.warn(`  ${c.name} 算不出來：${e.message}`)
  }
}

// ═══ Tier 分佈統計 ═══
const TIER_ORDER = ['傳奇級命盤', '極稀有', '非常稀有', '稀有', '有特色', '較為平均', '樸實型']
const tierCounts = {}
for (const r of results) {
  tierCounts[r.title] = (tierCounts[r.title] || 0) + 1
}

// Random baseline (對照組)
const RANDOM_PROFILE = {
  '傳奇級命盤': 1.03,
  '極稀有': 2.53,
  '非常稀有': 7.13,
  '稀有': 25.07,
  '有特色': 41.30,
  '較為平均': 20.80,
  '樸實型': 2.13
}

console.log('══════════════════════════════════════════════════════════════')
console.log('  391 Celebrity 的 Rarity 分佈 vs Random 3000')
console.log('══════════════════════════════════════════════════════════════\n')

let cumCeleb = 0
let cumRand = 0
console.log(`  ${'Tier'.padEnd(10, '　')}   Celeb   vs   Random   差距`)
console.log('  ' + '─'.repeat(52))
for (const tier of TIER_ORDER) {
  const celebCount = tierCounts[tier] || 0
  const celebPct = (celebCount / results.length) * 100
  const randPct = RANDOM_PROFILE[tier] || 0
  cumCeleb += celebPct
  cumRand += randPct
  const delta = celebPct - randPct
  const sign = delta >= 0 ? '+' : ''
  const bar = '█'.repeat(Math.round(celebPct / 2))
  console.log(
    `  ${tier.padEnd(10, '　')} ${celebPct.toFixed(1).padStart(5)}%  ${randPct.toFixed(1).padStart(5)}%   ${sign}${delta.toFixed(1).padStart(5)}pp ${bar}`
  )
}
console.log()
console.log(`  稀有以上累計：celebrity ${results.filter(r => ['傳奇級命盤','極稀有','非常稀有','稀有'].includes(r.title)).length / results.length * 100 | 0}% · random 35.8%`)

// ═══ 按分數排序輸出 top / bottom ═══
results.sort((a, b) => b.score - a.score)

console.log('\n══════════════════════════════════════════════════════════════')
console.log('  Top 20 分數最高的 celebrity')
console.log('══════════════════════════════════════════════════════════════')
console.log(`  ${'Name'.padEnd(24)} ${'Score'.padStart(5)} ${'Tier'.padEnd(8)}  Career`)
console.log('  ' + '─'.repeat(70))
for (const r of results.slice(0, 20)) {
  const name = r.name.length > 22 ? r.name.slice(0, 21) + '…' : r.name
  const title = r.title.padEnd(8, '　')
  const career = (r.career || '').slice(0, 26)
  console.log(`  ${name.padEnd(24)} ${String(r.score).padStart(5)} ${title}  ${career}`)
}

console.log('\n══════════════════════════════════════════════════════════════')
console.log('  Bottom 20 分數最低的 celebrity')
console.log('══════════════════════════════════════════════════════════════')
console.log(`  ${'Name'.padEnd(24)} ${'Score'.padStart(5)} ${'Tier'.padEnd(8)}  Career`)
console.log('  ' + '─'.repeat(70))
for (const r of results.slice(-20).reverse()) {
  const name = r.name.length > 22 ? r.name.slice(0, 21) + '…' : r.name
  const title = r.title.padEnd(8, '　')
  const career = (r.career || '').slice(0, 26)
  console.log(`  ${name.padEnd(24)} ${String(r.score).padStart(5)} ${title}  ${career}`)
}

// ═══ 按 category 分組平均 ═══
console.log('\n══════════════════════════════════════════════════════════════')
console.log('  按領域分組的平均分數')
console.log('══════════════════════════════════════════════════════════════')
const domainMap = {
  business: ['business-'],
  arts: ['arts-'],
  politics: ['politics', 'government'],
  sports: ['sports'],
  science: ['science', 'medicine'],
  military: ['military']
}
for (const [domain, prefixes] of Object.entries(domainMap)) {
  const matched = results.filter(r =>
    (r.categories || []).some(cat => prefixes.some(p => cat.startsWith(p)))
  )
  if (matched.length === 0) continue
  const avg = matched.reduce((s, r) => s + r.score, 0) / matched.length
  const topTierCount = matched.filter(r => ['傳奇級命盤','極稀有','非常稀有','稀有'].includes(r.title)).length
  const topPct = (topTierCount / matched.length) * 100
  console.log(
    `  ${domain.padEnd(10)} n=${String(matched.length).padStart(3)}  平均 ${avg.toFixed(1)} 分 · 「稀有」以上 ${topPct.toFixed(1)}%`
  )
}

// ═══ 指標名人對照 ═══
console.log('\n══════════════════════════════════════════════════════════════')
console.log('  指標名人逐個檢視（rating AA/A 為主）')
console.log('══════════════════════════════════════════════════════════════')
const SPOTLIGHT = [
  'Steve Jobs', 'Bill Gates', 'Elon Musk', 'Jeff Bezos', 'Warren Buffett',
  'Oprah Winfrey', 'Taylor Swift', 'Beyoncé', 'Michael Jackson', 'John Lennon',
  'Elvis Presley', 'Marilyn Monroe', 'Leonardo DiCaprio', 'Tom Cruise',
  'Steven Spielberg', 'Quentin Tarantino', 'Nelson Mandela',
  'Barack Obama', 'Donald Trump', 'Queen Elizabeth II',
  'Albert Einstein', 'Nikola Tesla', 'Thomas Edison'
]
for (const name of SPOTLIGHT) {
  const r = results.find(x => x.name === name)
  if (!r) continue
  console.log(
    `  ${name.padEnd(24)} ${String(r.score).padStart(3)} · ${r.title}`
  )
}

console.log('\n══════════════════════════════════════════════════════════════\n')
