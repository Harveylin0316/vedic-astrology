// 驗證 AD window 文案 — 走 9 個 AD 行星 × 幾種 pairing / resonance 組合
// 直接 import 模組，不需要真的組一個命盤

import { buildAntardashaWindow } from '../src/data/antardashaWindow.js'

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']

// ── Case 1：每顆行星當 AD 的基本文案（MD 固定 Saturn, 無 pyramid） ──
console.log('═'.repeat(78))
console.log('Case 1：MD = Saturn, 不同 AD, 無 pyramid（無 resonance）')
console.log('═'.repeat(78))
for (const ad of PLANETS) {
  const w = buildAntardashaWindow({
    mdLord: 'Saturn',
    adLord: ad,
    monthsRemaining: 8,
    karakaOverrides: [],
    pyramid: null
  })
  if (!w) { console.log(`  [${ad}] SKIPPED (null)`); continue }
  console.log(`\n【MD=Saturn / AD=${ad}】pairing=${w.pairing} · verb=${w.verb} · resonance=${w.resonance?.tier || 'none'}`)
  console.log(`  headline : ${w.headline}`)
  console.log(`  pairing  : ${w.pairingNote}`)
  console.log(`  focus    : ${w.focus}`)
  console.log(`  caution  : ${w.caution}`)
}

// ── Case 2：AD 恰好是 pyramid 主軸（Primary resonance） ──
console.log('\n' + '═'.repeat(78))
console.log('Case 2：MD=Jupiter / AD=Mercury, pyramid primary=Mercury → Primary resonance')
console.log('═'.repeat(78))
const w2 = buildAntardashaWindow({
  mdLord: 'Jupiter',
  adLord: 'Mercury',
  monthsRemaining: 14,
  karakaOverrides: [],
  pyramid: { primary: { planet: 'Mercury' } }
})
console.log(`  headline : ${w2.headline}`)
console.log(`  pairing  : ${w2.pairingNote}`)
console.log(`  focus    : ${w2.focus}`)
console.log(`  caution  : ${w2.caution}`)
console.log(`  resonance: [${w2.resonance.tier}] ${w2.resonance.note}`)

// ── Case 3：AD 是 karaka override strong（Primary resonance, karaka path） ──
console.log('\n' + '═'.repeat(78))
console.log('Case 3：MD=Moon / AD=Mars, karaka override Mars strong → Primary resonance')
console.log('═'.repeat(78))
const w3 = buildAntardashaWindow({
  mdLord: 'Moon',
  adLord: 'Mars',
  monthsRemaining: 3,
  karakaOverrides: [
    { id: 'karaka-override-mars', strength: 'strong', category: '運動 / 軍警 / 外科' }
  ],
  pyramid: { primary: { planet: 'Venus' } }  // primary is Venus, not Mars
})
console.log(`  headline : ${w3.headline}`)
console.log(`  pairing  : ${w3.pairingNote}`)
console.log(`  focus    : ${w3.focus}`)
console.log(`  caution  : ${w3.caution}`)
console.log(`  resonance: [${w3.resonance.tier}] ${w3.resonance.note}`)

// ── Case 4：AD 是 karaka override medium（Secondary resonance） ──
console.log('\n' + '═'.repeat(78))
console.log('Case 4：MD=Sun / AD=Venus, karaka override Venus medium → Secondary resonance')
console.log('═'.repeat(78))
const w4 = buildAntardashaWindow({
  mdLord: 'Sun',
  adLord: 'Venus',
  monthsRemaining: 18,
  karakaOverrides: [
    { id: 'karaka-override-venus', strength: 'medium', category: '演藝 / 藝術 / 時尚' }
  ],
  pyramid: { primary: { planet: 'Sun' } }
})
console.log(`  headline : ${w4.headline}`)
console.log(`  pairing  : ${w4.pairingNote}`)
console.log(`  focus    : ${w4.focus}`)
console.log(`  caution  : ${w4.caution}`)
console.log(`  resonance: [${w4.resonance.tier}] ${w4.resonance.note}`)

// ── Case 5：MD === AD（同星深化）──
console.log('\n' + '═'.repeat(78))
console.log('Case 5：MD=Mercury / AD=Mercury（同星深化）')
console.log('═'.repeat(78))
const w5 = buildAntardashaWindow({
  mdLord: 'Mercury',
  adLord: 'Mercury',
  monthsRemaining: 10,
  karakaOverrides: [],
  pyramid: null
})
console.log(`  headline : ${w5.headline}`)
console.log(`  pairing  : ${w5.pairingNote}`)

// ── Case 6：極短 AD（<1 個月） ──
console.log('\n' + '═'.repeat(78))
console.log('Case 6：MD=Saturn / AD=Sun, 剩餘 0.5 個月（即將切換）')
console.log('═'.repeat(78))
const w6 = buildAntardashaWindow({
  mdLord: 'Saturn',
  adLord: 'Sun',
  monthsRemaining: 0.5,
  karakaOverrides: [],
  pyramid: null
})
console.log(`  headline : ${w6.headline}`)
console.log(`  pairing  : ${w6.pairingNote}`)

// ── Case 7：敵星組合（pairing=enemy） ──
console.log('\n' + '═'.repeat(78))
console.log('Case 7：MD=Sun / AD=Saturn（敵星，Sun-Saturn）')
console.log('═'.repeat(78))
const w7 = buildAntardashaWindow({
  mdLord: 'Sun',
  adLord: 'Saturn',
  monthsRemaining: 20,
  karakaOverrides: [],
  pyramid: null
})
console.log(`  headline : ${w7.headline}`)
console.log(`  pairing  : ${w7.pairingNote}`)

console.log('\n' + '═'.repeat(78))
console.log('完成。如果文案有任何奇怪的地方（斷句、錯字、邏輯矛盾），請指出。')
console.log('═'.repeat(78))
