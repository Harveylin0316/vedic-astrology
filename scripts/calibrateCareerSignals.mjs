#!/usr/bin/env node
// 針對事業強度訊號做 celebrity vs random 校準
// 找出真正有 lift 的事業信號，反推合理權重

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  computeVedicChart, computeVimshottariDasha, getCurrentDasha,
  computeAntardashas, getCurrentAntardasha
} from '../src/utils/vedicCalc.js'
import { analyzeVedicCareer } from '../src/utils/careerVedic.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const KENDRA = [1, 4, 7, 10]
const TRIKONA = [5, 9]
const EXALTATION = {
  Sun: 'Mesha', Moon: 'Vrishabha', Mars: 'Makara', Mercury: 'Kanya',
  Jupiter: 'Karka', Venus: 'Meena', Saturn: 'Tula'
}

function extractSignals(chart) {
  const dasha = computeVimshottariDasha(chart)
  const curDasha = dasha?.length ? getCurrentDasha(dasha) : null
  const curAD = curDasha ? getCurrentAntardasha(computeAntardashas(curDasha)) : null
  const vc = analyzeVedicCareer(chart, curDasha?.lord || null, curAD?.lord || null)

  const signals = new Set()

  // Karmesh dignity
  const k = vc.karmesh
  if (k && k.planet) {
    const d = k.dignity
    const dd = k.dignityDetails || {}
    if (d === 'exalted') signals.add('karmeshExalted')
    if (dd.moolatrikona) signals.add('karmeshMoolatrikona')
    if (d === 'own') signals.add('karmeshOwn')
    if (k.house && [...KENDRA, ...TRIKONA, 1].includes(k.house)) signals.add('karmeshKendraTrikona')
    if (dd.digbala) signals.add('karmeshDigbala')
  }

  // Karaka overrides
  const overrides = vc.karakaOverrides || []
  const top = overrides[0]
  if (top) {
    if (top.strength === 'strong') signals.add('karakaOverrideStrong')
    else if (top.strength === 'medium') signals.add('karakaOverrideMedium')
  }

  // Lagna Lord
  const ll = vc.lagnaLord
  if (ll && ll.planet) {
    const llD = ll.dignity
    if (llD === 'exalted' || llD === 'own') signals.add('lagnaLordExaltedOrOwn')
    if (ll.house && [...KENDRA, ...TRIKONA, 1].includes(ll.house)) signals.add('lagnaLordKendraTrikona')
  }

  // D10 agreement
  if (vc.d10 && vc.d10.agreement) signals.add('d10Agreement')

  // Many career yogas
  const careerYogas = vc.activeCareerYogas || []
  if (careerYogas.length >= 3) signals.add('manyCareerYogas')
  if (careerYogas.length >= 5) signals.add('manyCareerYogas_5plus')

  return signals
}

function statSignals(samples, compute) {
  const counts = {}
  let n = 0
  for (const s of samples) {
    try {
      const chart = compute(s)
      for (const sig of extractSignals(chart)) {
        counts[sig] = (counts[sig] || 0) + 1
      }
      n++
    } catch (_) {}
  }
  return { counts, n }
}

// Celebrity
const celebrities = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'data', 'celebrityDataset.json'), 'utf-8'))
console.log(`跑 ${celebrities.length} celebrity...`)
const celebStats = statSignals(
  celebrities,
  (c) => computeVedicChart({
    year: c.birth.year, month: c.birth.month, day: c.birth.day,
    hour: c.birth.hour, minute: c.birth.minute,
    tzOffset: c.birth.tz, lat: c.birth.lat, lon: c.birth.lon
  })
)

// Random
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
const randSamples = []
for (let i = 0; i < 3000; i++) {
  const city = CITIES[randInt(0, CITIES.length - 1)]
  randSamples.push({
    year: randInt(1940, 2010), month: randInt(1, 12), day: randInt(1, 28),
    hour: randInt(0, 23), minute: randInt(0, 59), ...city
  })
}
console.log('跑 3000 random...')
const randStats = statSignals(
  randSamples,
  (s) => computeVedicChart({ ...s, tzOffset: s.tz })
)

console.log('\n══════════════════════════════════════════════════════════════')
console.log('  事業強度訊號：Celebrity 391 vs Random 3000')
console.log('══════════════════════════════════════════════════════════════\n')

const allKeys = new Set([...Object.keys(celebStats.counts), ...Object.keys(randStats.counts)])
const rows = []
for (const key of allKeys) {
  const celebCount = celebStats.counts[key] || 0
  const randCount = randStats.counts[key] || 0
  const celebRate = celebCount / celebStats.n
  const randRate = randCount / randStats.n
  const lift = randRate > 0 ? celebRate / randRate : (celebRate > 0 ? 99 : 0)
  rows.push({ key, celebRate, randRate, lift })
}
rows.sort((a, b) => b.lift - a.lift)

console.log(`  ${'Signal'.padEnd(28)} ${'Celeb'.padStart(8)} ${'Random'.padStart(8)} ${'Lift'.padStart(7)}  推薦權重`)
console.log('  ' + '─'.repeat(68))
for (const r of rows) {
  const celebStr = `${(r.celebRate * 100).toFixed(1)}%`
  const randStr = `${(r.randRate * 100).toFixed(1)}%`
  const liftStr = r.lift.toFixed(2) + '×'

  // 權重推算：baseline 4 分對應 lift=1
  //   lift ≥ 1.5 → weight = round(4 × lift^1.3)
  //   lift 0.9-1.3 → weight 3
  //   lift < 0.8 → weight = max(0, round(4 × lift))
  // 且考慮觸發率：觸發率 > 60% 的 signal 權重砍半（避免普遍性通膨）
  let w
  if (r.lift >= 1.5) w = Math.round(4 * Math.pow(r.lift, 1.3))
  else if (r.lift >= 1.2) w = Math.round(4 * r.lift)
  else if (r.lift >= 0.9) w = 3
  else w = Math.max(0, Math.round(4 * r.lift))

  if (r.celebRate > 0.6) w = Math.max(1, Math.round(w / 2)) // 常見者砍半
  w = Math.min(30, Math.max(0, w))

  console.log(`  ${r.key.padEnd(28)} ${celebStr.padStart(8)} ${randStr.padStart(8)} ${liftStr.padStart(7)}  → ${w}`)
}
