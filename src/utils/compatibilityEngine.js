// 雙人合盤引擎 — Ashta Kuta 8 因子 36 分制（吠陀傳統）
//
// 輸入：兩人各自的 chart object（computeVedicChart 的結果）
// 輸出：{ totalScore, maxScore, percent, category, kutas: [{...}], dynamics: {...} }
//
// 8 Kutas 權重：
//   Varna (1) · Vashya (2) · Tara (3) · Yoni (4) · Graha Maitri (5) · Gana (6) · Bhakoot (7) · Nadi (8)
//   總分 36，> 18 可接受、> 24 良好、> 30 極佳

// ────────────────────────────────────────
// 基礎資料表
// ────────────────────────────────────────

// Varna（種姓）
const VARNA_BY_RASHI = {
  Karka: 'brahmin', Vrishchika: 'brahmin', Meena: 'brahmin',
  Mesha: 'kshatriya', Simha: 'kshatriya', Dhanu: 'kshatriya',
  Vrishabha: 'vaishya', Kanya: 'vaishya', Makara: 'vaishya',
  Mithuna: 'shudra', Tula: 'shudra', Kumbha: 'shudra'
}
const VARNA_ORDER = { brahmin: 4, kshatriya: 3, vaishya: 2, shudra: 1 }

// Vashya（支配性）
const VASHYA_BY_RASHI = {
  Mesha: 'chatushpada', Vrishabha: 'chatushpada', Dhanu: 'chatushpada_manav',
  Makara: 'chatushpada_jalachar',
  Mithuna: 'manav', Kanya: 'manav', Tula: 'manav', Kumbha: 'manav',
  Karka: 'jalachar', Meena: 'jalachar',
  Simha: 'vanachar',
  Vrishchika: 'keet'
}

// Tara 計分：從 A 的 Nakshatra 數到 B 的，除 9 取餘（1, 3, 5, 7 吉；0, 2, 4, 6, 8 依分數）
// 傳統：餘 3, 5, 7 = Vipat/Pratyari/Vadha 不吉 → 0; 其他 → 3
function taraScore(nakshatraA, nakshatraB) {
  // nakshatras 1-indexed 1-27
  const diff = ((nakshatraB - nakshatraA + 27) % 27) + 1
  const mod = diff % 9
  if (mod === 3 || mod === 5 || mod === 7) return 0
  return 3
}

// Yoni（生育相容）— 14 種 Yoni 動物
const YONI_BY_NAKSHATRA = {
  1: 'horse_m', 15: 'horse_f', // Ashwini / Swati
  2: 'elephant_m', 26: 'elephant_f', // Bharani / Uttara Bhadrapada
  3: 'sheep_f', 23: 'sheep_m', // Krittika / Dhanishta
  4: 'serpent_m', 19: 'serpent_f', // Rohini / Mula (實際上 Rohini=snake_m, Mrigashira=snake_f, 簡化)
  5: 'serpent_f',
  6: 'dog_f', 24: 'dog_m', // Ardra / Shatabhisha
  7: 'cat_f', 20: 'cat_m', // Punarvasu / Purva Ashadha
  8: 'sheep_m',            // Pushya
  9: 'cat_m',              // Ashlesha
  10: 'rat_m', 11: 'rat_f', // Magha / PurvaPhalguni
  12: 'cow_f', 27: 'cow_m', // UttaraPhalguni / Revati
  13: 'buffalo_f',          // Hasta
  14: 'tiger_f',            // Chitra
  16: 'tiger_m',            // Vishakha
  17: 'deer_f',             // Anuradha
  18: 'deer_m',             // Jyeshtha
  21: 'mongoose_m',         // UttaraAshadha
  22: 'monkey_m',           // Shravana
  25: 'lion_m'              // PurvaBhadrapada
}

// 基本 Yoni 動物分類（公母不影響 score）
const yoniType = (n) => (YONI_BY_NAKSHATRA[n] || '').split('_')[0]

// 友好 yoni 對照：same = 4, friendly = 3, neutral = 2, enemy = 1, arch_enemy = 0
const YONI_ENEMIES = {
  horse: ['buffalo'],
  elephant: ['lion'],
  sheep: ['monkey'],
  serpent: ['mongoose'],
  dog: ['deer'],
  cat: ['rat'],
  rat: ['cat'],
  cow: ['tiger'],
  buffalo: ['horse'],
  tiger: ['cow'],
  deer: ['dog'],
  monkey: ['sheep'],
  mongoose: ['serpent'],
  lion: ['elephant']
}

function yoniScore(nA, nB) {
  const a = yoniType(nA)
  const b = yoniType(nB)
  if (!a || !b) return 2
  if (a === b) return 4
  if ((YONI_ENEMIES[a] || []).includes(b)) return 0
  return 2
}

// Graha Maitri（月亮星座主星間的友誼）
const LORD_OF_RASHI = {
  Mesha: 'Mars', Vrishabha: 'Venus', Mithuna: 'Mercury', Karka: 'Moon',
  Simha: 'Sun', Kanya: 'Mercury', Tula: 'Venus', Vrishchika: 'Mars',
  Dhanu: 'Jupiter', Makara: 'Saturn', Kumbha: 'Saturn', Meena: 'Jupiter'
}

// 簡化：Sun=火, Moon=水, Mars=火, Mercury=風, Jupiter=火水, Venus=水, Saturn=風
const PLANET_FRIENDS = {
  Sun: ['Moon', 'Mars', 'Jupiter'],
  Moon: ['Sun', 'Mercury'],
  Mars: ['Sun', 'Moon', 'Jupiter'],
  Mercury: ['Sun', 'Venus'],
  Jupiter: ['Sun', 'Moon', 'Mars'],
  Venus: ['Mercury', 'Saturn'],
  Saturn: ['Mercury', 'Venus']
}
const PLANET_ENEMIES = {
  Sun: ['Venus', 'Saturn'],
  Moon: [],
  Mars: ['Mercury'],
  Mercury: ['Moon'],
  Jupiter: ['Mercury', 'Venus'],
  Venus: ['Sun', 'Moon'],
  Saturn: ['Sun', 'Moon', 'Mars']
}

function grahaMaitriScore(lordA, lordB) {
  if (lordA === lordB) return 5
  const aFriend = (PLANET_FRIENDS[lordA] || []).includes(lordB)
  const bFriend = (PLANET_FRIENDS[lordB] || []).includes(lordA)
  const aEnemy = (PLANET_ENEMIES[lordA] || []).includes(lordB)
  const bEnemy = (PLANET_ENEMIES[lordB] || []).includes(lordA)
  if (aFriend && bFriend) return 5
  if (aFriend || bFriend) return 4
  if (aEnemy && bEnemy) return 0
  if (aEnemy || bEnemy) return 1
  return 3
}

// Gana（氣質）
const GANA_BY_NAKSHATRA = {
  // Deva 神族
  1: 'deva', 5: 'deva', 7: 'deva', 8: 'deva', 13: 'deva', 17: 'deva', 22: 'deva', 27: 'deva',
  // Manushya 人族
  2: 'manushya', 4: 'manushya', 11: 'manushya', 12: 'manushya', 20: 'manushya', 21: 'manushya', 25: 'manushya', 26: 'manushya',
  // Rakshasa 羅剎族
  3: 'rakshasa', 6: 'rakshasa', 9: 'rakshasa', 10: 'rakshasa', 14: 'rakshasa', 15: 'rakshasa', 16: 'rakshasa', 18: 'rakshasa', 19: 'rakshasa', 23: 'rakshasa', 24: 'rakshasa'
}

function ganaScore(nA, nB) {
  const a = GANA_BY_NAKSHATRA[nA]
  const b = GANA_BY_NAKSHATRA[nB]
  if (!a || !b) return 3
  if (a === b) return 6
  if ((a === 'deva' && b === 'manushya') || (a === 'manushya' && b === 'deva')) return 5
  if ((a === 'manushya' && b === 'rakshasa') || (a === 'rakshasa' && b === 'manushya')) return 1
  // Deva - Rakshasa = 0
  return 0
}

// Bhakoot（情感和諧）
// 計算兩人月亮星座距離，某些距離被視為不吉
const RASHI_ORDER = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
  'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'
]

function bhakootScore(rashiA, rashiB) {
  const a = RASHI_ORDER.indexOf(rashiA)
  const b = RASHI_ORDER.indexOf(rashiB)
  const forward = ((b - a + 12) % 12) + 1
  const backward = ((a - b + 12) % 12) + 1
  const dist = Math.min(forward, backward)
  // Dosha distances: 2-12, 5-9, 6-8 (implies diffs of 1, 4, 2 or 11, 8, 10)
  // Standard rule: unfavorable diffs are 2/12, 5/9, 6/8
  // diff = (forward)，2 = 2-12, 5 = 5-9, 6 = 6-8
  const forwardDosha = [2, 5, 6, 8, 9, 12]
  if (forwardDosha.includes(forward)) return 0
  return 7
}

// Nadi（脈息）
// 27 Nakshatras 分 3 群：Aadi, Madhya, Antya
const NADI_BY_NAKSHATRA = {
  1: 'aadi', 6: 'aadi', 7: 'aadi', 12: 'aadi', 13: 'aadi', 18: 'aadi', 19: 'aadi', 24: 'aadi', 25: 'aadi',
  2: 'madhya', 5: 'madhya', 8: 'madhya', 11: 'madhya', 14: 'madhya', 17: 'madhya', 20: 'madhya', 23: 'madhya', 26: 'madhya',
  3: 'antya', 4: 'antya', 9: 'antya', 10: 'antya', 15: 'antya', 16: 'antya', 21: 'antya', 22: 'antya', 27: 'antya'
}

function nadiScore(nA, nB) {
  const a = NADI_BY_NAKSHATRA[nA]
  const b = NADI_BY_NAKSHATRA[nB]
  if (!a || !b) return 4
  return a === b ? 0 : 8
}

// Varna 計分（簡化：同級或更高 = 1）
function varnaScore(rashiA, rashiB) {
  const a = VARNA_ORDER[VARNA_BY_RASHI[rashiA]]
  const b = VARNA_ORDER[VARNA_BY_RASHI[rashiB]]
  if (a >= b) return 1
  return 0
}

// Vashya 計分（簡化：同類 = 2，若有親近關係 = 1.5，否則 = 0 or 1）
function vashyaScore(rashiA, rashiB) {
  const a = VASHYA_BY_RASHI[rashiA]
  const b = VASHYA_BY_RASHI[rashiB]
  if (a === b) return 2
  const manavGroups = ['manav', 'chatushpada_manav']
  if (manavGroups.includes(a) && manavGroups.includes(b)) return 1.5
  if ((a === 'chatushpada' && b === 'jalachar') || (a === 'jalachar' && b === 'chatushpada')) return 0
  return 1
}

// ────────────────────────────────────────
// 主要函數
// ────────────────────────────────────────

export function computeCompatibility(chartA, chartB) {
  const moonA = chartA.sidereal.moon
  const moonB = chartB.sidereal.moon

  const rashiA = moonA.rashi.name
  const rashiB = moonB.rashi.name
  const nakA = moonA.nakshatra.id
  const nakB = moonB.nakshatra.id

  const lordA = LORD_OF_RASHI[rashiA]
  const lordB = LORD_OF_RASHI[rashiB]

  const kutas = [
    { id: 'varna', label: 'Varna · 性格層次', max: 1, score: varnaScore(rashiA, rashiB), meaning: '性格與精神層次的匹配' },
    { id: 'vashya', label: 'Vashya · 彼此引力', max: 2, score: vashyaScore(rashiA, rashiB), meaning: '誰對誰有主導力、默契' },
    { id: 'tara', label: 'Tara · 幸運指數', max: 3, score: taraScore(nakA, nakB), meaning: '彼此帶來的運勢互動' },
    { id: 'yoni', label: 'Yoni · 肢體吸引', max: 4, score: yoniScore(nakA, nakB), meaning: '身體與性的相容度' },
    { id: 'graha_maitri', label: 'Graha Maitri · 心智默契', max: 5, score: grahaMaitriScore(lordA, lordB), meaning: '你們的心智和情感是否合拍' },
    { id: 'gana', label: 'Gana · 氣質相配', max: 6, score: ganaScore(nakA, nakB), meaning: '天性的氣質類型（神／人／羅剎）' },
    { id: 'bhakoot', label: 'Bhakoot · 情感流動', max: 7, score: bhakootScore(rashiA, rashiB), meaning: '愛情能否自然流動' },
    { id: 'nadi', label: 'Nadi · 能量互補', max: 8, score: nadiScore(nakA, nakB), meaning: '能量／健康／子嗣層面的互補' }
  ]

  const totalScore = kutas.reduce((sum, k) => sum + k.score, 0)
  const maxScore = 36
  const percent = Math.round((totalScore / maxScore) * 100)

  // 分類
  let category
  let tagline
  if (totalScore >= 30) {
    category = '天作之合'
    tagline = '你們的業力是寫好的 — 這組能量在吠陀傳統裡是「祖先加持」等級。'
  } else if (totalScore >= 24) {
    category = '極佳配對'
    tagline = '你們天生合得來。平常不用吵的事你們本能就會站在同一邊。'
  } else if (totalScore >= 18) {
    category = '互補型配對'
    tagline = '你們會互相改變對方 — 這種關係有張力但也有深度。'
  } else if (totalScore >= 12) {
    category = '磨合型配對'
    tagline = '你們代表兩種不同的世界觀。要走得長，要下更多功夫。'
  } else {
    category = '挑戰型配對'
    tagline = '你們的靈魂走在非常不同的軌道上。這不代表沒救，是需要彼此非常清醒才能平衡。'
  }

  return {
    totalScore,
    maxScore,
    percent,
    category,
    tagline,
    kutas,
    moonA: { rashi: rashiA, nakshatra: moonA.nakshatra, lord: lordA },
    moonB: { rashi: rashiB, nakshatra: moonB.nakshatra, lord: lordB }
  }
}

// 取得 Kuta 狀態（用於 UI 顯示）
export function getKutaStatus(score, max) {
  const ratio = score / max
  if (ratio >= 0.8) return 'excellent'
  if (ratio >= 0.5) return 'good'
  if (ratio >= 0.25) return 'ok'
  return 'poor'
}
