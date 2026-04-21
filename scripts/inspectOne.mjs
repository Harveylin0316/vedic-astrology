#!/usr/bin/env node
// Deep inspection of a single celebrity's chart analysis.
// Usage: node scripts/inspectOne.mjs "Lionel Messi"

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { computeVedicChart, computeVimshottariDasha, getCurrentDasha, computeAntardashas, getCurrentAntardasha } from '../src/utils/vedicCalc.js'
import { analyzeVedicCareer } from '../src/utils/careerVedic.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const name = process.argv[2]
if (!name) {
  console.error('Usage: node scripts/inspectOne.mjs "Celebrity Name"')
  process.exit(1)
}

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

console.log(`========================  ${entry.name}  ========================`)
console.log(`True career: ${entry.career}`)
console.log(`True categories: ${entry.categories.join(', ')}`)
console.log(`Ascendant: ${chart.sidereal.ascendant.rashi.name} (${chart.sidereal.ascendant.rashi.chinese})`)
console.log(`Moon in: ${chart.sidereal.moon.rashi.name} / nakshatra ${chart.sidereal.moon.nakshatra.name}`)
console.log(`Current Dasha: ${dashaLord} / AD: ${adLord}`)
console.log('')
console.log(`Karmesh (10 宮主): ${a.karmesh?.planet}落第${a.karmesh?.house}宮 at ${a.karmesh?.rashi?.name}`)
console.log(`  Dignity: ${a.karmesh?.dignity}  score=${a.karmesh?.score?.score}`)
console.log(`  Reading: ${a.karmesh?.combinationReading}`)
console.log(`  DignityDetails: ${JSON.stringify(a.karmesh?.dignityDetails)}`)
console.log('')
console.log(`Lagna Lord: ${a.lagnaLord?.planet}落第${a.lagnaLord?.house}宮 dignity=${a.lagnaLord?.dignity}`)
console.log(`  sameAsKarmesh=${a.lagnaLord?.isSameAsKarmesh}  combo=${a.lagnaLord?.combinationReading}`)
console.log('')
console.log(`Active career yogas (${a.activeCareerYogas.length}):`)
for (const y of a.activeCareerYogas) console.log(`  - ${y.id}: ${y.verdict.slice(0, 100)}`)
console.log('')
console.log(`Karaka overrides (${a.karakaOverrides.length}):`)
for (const o of a.karakaOverrides) console.log(`  - ${o.id}  ${o.category}  (${o.source})`)
console.log('')
console.log('Top 5 significators by career score:')
for (let i = 0; i < 5; i++) {
  const s = a.significators[i]
  console.log(`  ${i+1}. ${s.planet.padEnd(8)} score=${s.scoreData.score}  dignity=${s.dignity}  house=${s.graha?.house}`)
  for (const r of s.scoreData.reasons) console.log(`       ${r.points > 0 ? '+':''}${r.points} ${r.text}`)
}
console.log('')
console.log(`D10: agreement=${a.d10?.agreement}  D10 10th lord=${a.d10?.tenthLord}`)
console.log('')
console.log('Playbook:')
console.log(`  identity=${a.playbook?.identity?.label}  sweetSpot=${a.playbook?.sweetSpot}`)
console.log(`  modernExamples: ${a.playbook?.modernExamples?.join(', ')}`)
console.log('')
console.log('Narrative:')
console.log(a.narrative)
