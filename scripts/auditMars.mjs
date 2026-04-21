#!/usr/bin/env node
// Audit how Mars is placed across athletes vs non-athletes
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { computeVedicChart } from '../src/utils/vedicCalc.js'
import { computeDignity } from '../src/utils/careerVedic.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataset = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/celebrityDataset.json'), 'utf8'))

const athletes = dataset.filter((d) => d.categories.includes('sports-athlete'))
const nonAthletes = dataset.filter((d) => !d.categories.includes('sports-athlete'))

function audit(entries, label) {
  console.log(`\n=== ${label} (N=${entries.length}) ===`)
  console.log('name                        Asc    Mars-house Mars-rashi  Mars-dignity inKendra inUpachaya ownOrExalt')
  let kendraCount = 0, upachayaCount = 0, strongCount = 0, kendraOrOwnCount = 0
  for (const e of entries) {
    const { year, month, day, hour, minute, tz, lat, lon } = e.birth
    const chart = computeVedicChart({ year, month, day, hour, minute, tzOffset: tz, lat, lon })
    const mars = chart.sidereal.grahas.Mars
    const marsDignity = computeDignity('Mars', mars.rashi.name)
    const inKendra = [1, 4, 7, 10].includes(mars.house)
    const inUpachaya = [3, 6, 10, 11].includes(mars.house)
    const strong = ['own', 'exalted', 'moolatrikona'].includes(marsDignity)
    const kendraOrOwn = inKendra || strong
    if (inKendra) kendraCount++
    if (inUpachaya) upachayaCount++
    if (strong) strongCount++
    if (kendraOrOwn) kendraOrOwnCount++
    console.log(`  ${e.name.padEnd(26)} ${chart.sidereal.ascendant.rashi.name.padEnd(6)} ${String(mars.house).padEnd(10)} ${mars.rashi.name.padEnd(11)} ${marsDignity.padEnd(12)} ${inKendra?'Y':' '}        ${inUpachaya?'Y':' '}          ${strong?'Y':' '}`)
  }
  console.log(`  ---`)
  console.log(`  Mars inKendra: ${kendraCount}/${entries.length} = ${(kendraCount/entries.length*100).toFixed(0)}%`)
  console.log(`  Mars inUpachaya: ${upachayaCount}/${entries.length} = ${(upachayaCount/entries.length*100).toFixed(0)}%`)
  console.log(`  Mars strong (own/exalted): ${strongCount}/${entries.length} = ${(strongCount/entries.length*100).toFixed(0)}%`)
  console.log(`  Mars Kendra OR strong: ${kendraOrOwnCount}/${entries.length} = ${(kendraOrOwnCount/entries.length*100).toFixed(0)}%`)
}

audit(athletes, 'ATHLETES')
audit(nonAthletes.slice(0, 30), 'NON-ATHLETES (first 30)')
