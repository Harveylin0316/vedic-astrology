#!/usr/bin/env node
// 測試新版三層架構的 career narrative
// Usage: node scripts/testCareerTiers.mjs "Steve Jobs"

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { computeVedicChart, computeVimshottariDasha, getCurrentDasha, computeAntardashas, getCurrentAntardasha } from '../src/utils/vedicCalc.js'
import { analyzeVedicCareer } from '../src/utils/careerVedic.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const name = process.argv[2] || 'Steve Jobs'

const dataset = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/celebrityDataset.json'), 'utf8'))
const entry = dataset.find((x) => x.name.toLowerCase() === name.toLowerCase())
if (!entry) {
  console.error(`Not found: ${name}`)
  process.exit(1)
}

const { year, month, day, hour, minute, tz, lat, lon } = entry.birth
const chart = computeVedicChart({ year, month, day, hour, minute, tzOffset: tz, lat, lon })
const periods = computeVimshottariDasha({
  moonSidereal: chart.sidereal.moon.longitude,
  birthYear: year, birthMonth: month, birthDay: day, birthHour: hour, birthMinute: minute
})
const now = new Date('2024-06-01T00:00:00Z')
const cur = getCurrentDasha(periods, now)
const dashaLord = cur?.lord || null
const adLord = cur ? getCurrentAntardasha(computeAntardashas(cur), now)?.lord : null
const a = analyzeVedicCareer(chart, dashaLord, adLord)

console.log(`==================== ${entry.name} ====================`)
console.log(`真實職業：${entry.career}`)
console.log(`類別：${entry.categories.join(', ')}`)
console.log(`Karmesh: ${a.karmesh?.planet} in house ${a.karmesh?.house} (${a.karmesh?.dignity})`)
console.log(`Lagna Lord: ${a.lagnaLord?.planet} in house ${a.lagnaLord?.house}`)
console.log(`Karaka Overrides: ${a.karakaOverrides.map(o => o.category).join(' | ') || '(none)'}`)
console.log(`D10 agreement: ${a.d10?.agreement} · D10 10th lord: ${a.d10?.tenthLord}`)
console.log(`Dasha: ${dashaLord} (isKarmesh=${a.dasha?.isKarmesh})`)
console.log('')
console.log('━━━━━━━━━━ NARRATIVE (新結構) ━━━━━━━━━━')
console.log('\n【主判讀】')
console.log('  ', a.narrative?.mainStatement || '(null)')
console.log('\n【Tiers】')
for (const t of (a.narrative?.tiers || [])) {
  console.log(`\n  [${t.layer.toUpperCase()}] ${t.label}`)
  console.log(`    身份：${t.identity}  (planet: ${t.planet})`)
  if (t.reading) console.log(`    Reading: ${t.reading}`)
  if (t.why) console.log(`    Why: ${t.why}`)
  if (t.keyFacts?.length) console.log(`    KeyFacts: ${t.keyFacts.join(', ')}`)
  if (t.integrationAdvice) console.log(`    Integration: ${t.integrationAdvice}`)
}
if (a.narrative?.yogaAddendum?.yogas?.length) {
  console.log('\n【Yoga Addendum】')
  for (const y of a.narrative.yogaAddendum.yogas) {
    console.log(`  · ${y.name} — ${y.implication}`)
  }
}

console.log('\n━━━━━━━━━━ PLAYBOOK (新結構) ━━━━━━━━━━')
const pb = a.playbook
console.log('\n[identity]', pb?.identity?.label, '·', pb?.identity?.houseContext)
console.log('\n[primary]')
if (pb?.primary) {
  console.log(`  energy: ${pb.primary.energy}`)
  console.log(`  examples: ${pb.primary.examples.join('、')}`)
  console.log(`  sweetSpot: ${pb.primary.sweetSpot}`)
  console.log(`  why: ${pb.primary.why}`)
} else console.log('  (none)')

console.log('\n[secondary]')
if (pb?.secondary) {
  console.log(`  planet: ${pb.secondary.planet} (source=${pb.secondary.source})`)
  console.log(`  energy: ${pb.secondary.energy}`)
  console.log(`  examples: ${pb.secondary.examples.join('、')}`)
  console.log(`  integration: ${pb.secondary.integration}`)
  console.log(`  why: ${pb.secondary.why}`)
} else console.log('  (none) ← 沒 secondary（訊號乾淨）')

console.log('\n[avoidCareer]')
if (pb?.avoidCareer) {
  console.log(`  planet: ${pb.avoidCareer.planet}`)
  console.log(`  examples: ${pb.avoidCareer.examples.join('、')}`)
  console.log(`  why: ${pb.avoidCareer.why}`)
} else console.log('  (none) ← 沒需要避開')

console.log('\n[timing]', pb?.timing ? `${pb.timing.lord} · ${pb.timing.phase}` : '(none)')

console.log('\n[actions]')
for (const act of (pb?.actions || [])) console.log(`  · ${act}`)
