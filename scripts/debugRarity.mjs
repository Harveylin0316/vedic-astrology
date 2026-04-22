// 逐一跑指定名人的命盤，看 rarity 分數 + features + tier
// Usage: node scripts/debugRarity.mjs

import { computeVedicChart, computeVimshottariDasha, getCurrentDasha, computeAntardashas, getCurrentAntardasha } from '../src/utils/vedicCalc.js'
import { analyzeVedicCareer } from '../src/utils/careerVedic.js'
import { computeRarityIndex } from '../src/utils/rarityIndex.js'

const PEOPLE = [
  {
    name: 'Bill Gates (22:00 PST)',
    year: 1955, month: 10, day: 28, hour: 22, minute: 0,
    tzOffset: -8, lat: 47.6062, lon: -122.3321
  },
  {
    name: 'Bill Gates (21:15 PST · AstroDatabank)',
    year: 1955, month: 10, day: 28, hour: 21, minute: 15,
    tzOffset: -8, lat: 47.6062, lon: -122.3321
  },
  {
    name: 'Steve Jobs (19:15 PST)',
    year: 1955, month: 2, day: 24, hour: 19, minute: 15,
    tzOffset: -8, lat: 37.3382, lon: -121.8863
  },
  {
    name: 'Elon Musk (07:30 SAST)',
    year: 1971, month: 6, day: 28, hour: 7, minute: 30,
    tzOffset: 2, lat: -25.7461, lon: 28.1881
  }
]

for (const p of PEOPLE) {
  console.log('\n══════════════════════════════════════════════════════════')
  console.log(`  ${p.name}`)
  console.log('══════════════════════════════════════════════════════════')
  const chart = computeVedicChart(p)
  // 模擬 BirthChart.jsx 的呼叫順序：先事業、後 rarity
  const dasha = computeVimshottariDasha(chart)
  const curDasha = dasha?.length ? getCurrentDasha(dasha) : null
  const curAD = curDasha ? getCurrentAntardasha(computeAntardashas(curDasha)) : null
  const vc = analyzeVedicCareer(chart, curDasha?.lord || null, curAD?.lord || null)
  const r = computeRarityIndex(chart, vc)
  console.log(`  Score:      ${r.score} / 100`)
  console.log(`  RawScore:   ${r.rawScore}`)
  console.log(`  Tier:       ${r.title}  (Top ${r.topPercent}%)`)
  console.log(`  Note:       ${r.note}`)
  console.log(`  觸發特徵（${r.features.length} 個）:`)
  r.features.forEach((f, i) => {
    const sym = f.weight > 0 ? '+' : ' '
    const typeTag = f.type === 'career-power' ? '[事業]' : f.type === 'base' ? '[基底]' : '[古典]'
    console.log(`    ${sym}${String(f.weight).padStart(2)} ${typeTag} ${f.plain}`)
  })
}
