#!/usr/bin/env node
// 模擬使用者題目中的命盤：Saturn 10 主 × 9 宮 × Venus 12 × Mars 強 × D10 Mars
// 用直接呼叫 synthesizeCareerNarrative + synthesizeCareerPlaybook 的方式測試

import { synthesizeCareerNarrative, resolvePrimarySecondary } from '../src/data/careerMatrix.js'
import { synthesizeCareerPlaybook } from '../src/data/careerPlaybook.js'

// ═══════════════════════════════════════════════════════════════
// 模擬分析結果：使用者題目中的命盤
// ═══════════════════════════════════════════════════════════════
const mockAnalysis = {
  karmesh: {
    planet: 'Saturn',
    house: 9,
    rashi: { name: 'Makara', chinese: '摩羯' }
  },
  lagnaLord: {
    planet: 'Venus',
    house: 12,
    dignity: 'neutral',
    isSameAsKarmesh: false
  },
  dignityDetails: {
    dignity: 'own',
    moolatrikona: false,
    digbala: false,
    neechaBhanga: false
  },
  karmeshContext: {
    conjoinPlanets: [],
    amatyakarakaPlanet: null,
    strongSignificators: ['Mars', 'Saturn']
  },
  karakaOverrides: [
    {
      id: 'karaka-override-mars',
      category: '運動 / 軍警 / 外科',
      verdict: '運動員型 · 戰士型職業身份',
      implication: 'Mars 強到壓過 10 宮主，戰士型身份浮上來',
      source: 'Mars 角色分 8（AMK 且強旺；Mars 在 Kendra + 強旺）',
      strength: 'strong'
    }
  ],
  d10: {
    tenthLord: 'Mars',
    agreement: false,
    verdict: 'D1 跟 D10 不一致'
  },
  dasha: {
    lord: 'Saturn',
    isKarmesh: true
  },
  activeCareerYogas: [],
  subCategoryDetection: null
}

console.log('==================== 使用者題目命盤 ====================')
console.log('Karmesh: Saturn 10 主 × 9 宮 × 摩羯（本宮）')
console.log('Lagna Lord: Venus 12 宮')
console.log('Karaka Override: Mars（強）')
console.log('D10 10 宮主: Mars（與 D1 不一致）')
console.log('當前 Dasha: Saturn（10 宮主自己的大運）')
console.log('')

const pyramid = resolvePrimarySecondary(mockAnalysis)
console.log('━━━━━━━━━━ resolvePrimarySecondary ━━━━━━━━━━')
console.log('PRIMARY:', pyramid.primary?.planet, '·', pyramid.primary?.direction)
console.log('SECONDARY:', pyramid.secondary ? `${pyramid.secondary.planet} · ${pyramid.secondary.source}` : '(none)')
console.log('AVOID:', pyramid.avoid ? `${pyramid.avoid.planet}` : '(none)')
console.log('')

const narrative = synthesizeCareerNarrative(mockAnalysis)
console.log('━━━━━━━━━━ NARRATIVE ━━━━━━━━━━')
console.log('\n【主判讀】')
console.log('  ', narrative?.mainStatement)
console.log('\n【Tiers】')
for (const t of (narrative?.tiers || [])) {
  console.log(`\n  [${t.layer.toUpperCase()}] ${t.label}`)
  console.log(`    身份：${t.identity}  (planet: ${t.planet})`)
  if (t.reading) console.log(`    Reading: ${t.reading}`)
  if (t.why) console.log(`    Why: ${t.why}`)
  if (t.keyFacts?.length) console.log(`    KeyFacts: ${t.keyFacts.join(', ')}`)
  if (t.integrationAdvice) console.log(`    Integration: ${t.integrationAdvice}`)
}

const playbook = synthesizeCareerPlaybook({
  karmesh: { planet: 'Saturn', house: 9, rashi: { chinese: '摩羯' }, dignityDetails: mockAnalysis.dignityDetails },
  lagnaLord: mockAnalysis.lagnaLord,
  dasha: mockAnalysis.dasha,
  karakaOverrides: mockAnalysis.karakaOverrides,
  activeCareerYogas: [],
  d10: mockAnalysis.d10,
  karmeshContext: mockAnalysis.karmeshContext,
  subCategoryDetection: null,
  pyramid
})

console.log('\n━━━━━━━━━━ PLAYBOOK ━━━━━━━━━━')
console.log('\n[primary]')
if (playbook.primary) {
  console.log(`  energy: ${playbook.primary.energy}`)
  console.log(`  examples: ${playbook.primary.examples.join('、')}`)
  console.log(`  sweetSpot: ${playbook.primary.sweetSpot}`)
}
console.log('\n[secondary]')
if (playbook.secondary) {
  console.log(`  planet: ${playbook.secondary.planet} (source=${playbook.secondary.source})`)
  console.log(`  energy: ${playbook.secondary.energy}`)
  console.log(`  examples: ${playbook.secondary.examples.join('、')}`)
  console.log(`  integration: ${playbook.secondary.integration}`)
} else console.log('  (none)')

console.log('\n[avoidCareer]')
if (playbook.avoidCareer) {
  console.log(`  planet: ${playbook.avoidCareer.planet}`)
  console.log(`  examples: ${playbook.avoidCareer.examples.join('、')}`)
  console.log(`  why: ${playbook.avoidCareer.why}`)
} else console.log('  (none)')

console.log('\n[actions]')
for (const act of (playbook.actions || [])) console.log(`  · ${act}`)
