// 人格簽名資料 — 12 Lagna「派」+ 12 Moon「心」
// 用於生成命盤頁 Hero 主視覺的「靈魂簽名」
// 格式：「{Lagna派} × {Moon心}」 + 一句話說明

// Lagna 外殼：別人第一眼看到的你
export const lagnaLabel = {
  Mesha: { short: '衝動派', surface: '講話直、動作快、第一個舉手' },
  Vrishabha: { short: '穩定派', surface: '慢熟、有品味、坐下就不動' },
  Mithuna: { short: '嘴砲派', surface: '反應快、話多、有梗' },
  Karka: { short: '守護派', surface: '柔軟、記細節、像大家的媽' },
  Simha: { short: '主角派', surface: '氣場強、愛面子、自帶光' },
  Kanya: { short: '完美派', surface: '乾淨、規劃強、細節狂' },
  Tula: { short: '外交派', surface: '優雅、人緣好、穿搭有品' },
  Vrishchika: { short: '深水派', surface: '眼神有戲、不輕易敞開' },
  Dhanu: { short: '冒險派', surface: '樂觀外放、愛真理愛跑' },
  Makara: { short: '務實派', surface: '嚴肅、穩重、抗壓王' },
  Kumbha: { short: '獨行派', surface: '有想法、不走尋常路' },
  Meena: { short: '夢幻派', surface: '柔軟飄渺、藝術氣質' }
}

// Moon 內心：只有你自己知道的內在
export const moonLabel = {
  Mesha: { short: '火心', inner: '一下就炸、情緒全寫臉上' },
  Vrishabha: { short: '貪享心', inner: '物質安全感強、愛存錢愛好物' },
  Mithuna: { short: '想太多腦', inner: '深夜重播當天對話 5 次' },
  Karka: { short: '玻璃心', inner: '一句話可以內耗 3 天' },
  Simha: { short: '戲劇心', inner: '要被放心上不然會碎' },
  Kanya: { short: '焦慮腦', inner: '自我批判音量比別人大 10 倍' },
  Tula: { short: '討好心', inner: '做決定 3 天、怕讓人失望' },
  Vrishchika: { short: '記仇王', inner: '帳記 10 年、不會先開口' },
  Dhanu: { short: '自由魂', inner: '怕被綁、拒絕承諾' },
  Makara: { short: '扛責任', inner: '外冷內熱、從不示弱' },
  Kumbha: { short: '疏離腦', inner: '親密邊界一靠近就想逃' },
  Meena: { short: '接收器', inner: '別人情緒變成自己的' }
}

// 組合成最終「靈魂簽名」顯示
export function buildPersonaSignature(lagnaRashi, moonRashi) {
  const l = lagnaLabel[lagnaRashi]
  const m = moonLabel[moonRashi]
  if (!l || !m) return null
  return {
    primary: `${l.short} × ${m.short}`,
    lagnaShort: l.short,
    lagnaSurface: l.surface,
    moonShort: m.short,
    moonInner: m.inner,
    secondary: `外表是${l.short}，內心是${m.short}`,
    detail: `別人看到你 ${l.surface}，但只有你自己知道 — 你內心 ${m.inner}。`
  }
}
