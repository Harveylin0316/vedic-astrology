// 分享卡專用：超短「命盤洩密」金句
// 每條都是一個場景化、戳心、別人看了會說「這也太準」的 punch line
// 用於 Instagram / 朋友圈分享，最適合 1-2 秒吸睛 + 5 秒看完

// ═══════════════════ Lagna · 外在給人的感覺 ═══════════════════
export const lagnaPunchlines = {
  Mesha: '你走進會議室 30 秒就想主導',
  Vrishabha: '你慢熟但一旦黏上就黏一輩子',
  Mithuna: '你什麼都懂一點，但都沒鑽很深',
  Karka: '你是朋友圈那個媽／爸',
  Simha: '被冷落 10 分鐘你就不爽',
  Kanya: '你 Excel 的完美會讓人害怕',
  Tula: '你可以跟最難搞的人坐下來談',
  Vrishchika: '你看穿人性的速度讓人緊張',
  Dhanu: '你會突然推翻討論 30 分鐘的結論',
  Makara: '你的 Slack 簡短到像在生氣',
  Kumbha: '你的想法 2 年後別人才懂',
  Meena: '要你做細節表單你會想罷工'
}

// ═══════════════════ Sun · 靈魂的驅動 ═══════════════════
export const sunPunchlines = {
  Mesha: '你要做「第一個做到」的人',
  Vrishabha: '你要的是「我擁有這個」的踏實',
  Mithuna: '你靠嘴跟腦袋把想法變錢',
  Karka: '你要別人說「沒你不行」',
  Simha: '你要上台、要被記得',
  Kanya: '你要做到「只有你能做對」',
  Tula: '你要讓事情美 + 和諧',
  Vrishchika: '你要做沒人敢碰的事',
  Dhanu: '你要做有意義的、不只為錢',
  Makara: '你要用 10 年建一座山',
  Kumbha: '你要做「走在時代前」的人',
  Meena: '你要做會讓人「哭」的作品'
}

// ═══════════════════ Moon · 情緒底色 ═══════════════════
export const moonPunchlines = {
  Mesha: '你情緒來得快、退得更快',
  Vrishabha: '你認定的事就絕不改',
  Mithuna: '你晚上睡不著、腦袋開 10 個分頁',
  Karka: '一句話讓你內耗 3 天',
  Simha: '你要被放在心上才會安心',
  Kanya: '你的自我批判音量是別人的 10 倍',
  Tula: '你做決定可以拖 3 天',
  Vrishchika: '你為一句話可以記 10 年',
  Dhanu: '你把自由看得比穩定重',
  Makara: '你外冷內熱，但不示弱',
  Kumbha: '親密感太近你會想逃',
  Meena: '別人的情緒會變成你的'
}

// ═══════════════════ Sun Rashi 父親議題（童年 scar） ═══════════════════
export const sunShadowPunchlines = {
  Mesha: '你爸有句話讓你想證明自己',
  Vrishabha: '家裡為錢吵過，你現在仍有陰影',
  Mithuna: '你說的話家人沒在聽的記憶',
  Karka: '你媽的情緒你扛到現在',
  Simha: '你想被家人看見但沒被看見過',
  Kanya: '你從小被要求「不可以犯錯」',
  Tula: '家中衝突讓你學會壓抑',
  Vrishchika: '家族有段被背叛的舊事',
  Dhanu: '家人要你出人頭地的壓力',
  Makara: '你從小就要當「大人」',
  Kumbha: '你從小感覺跟家人不同國',
  Meena: '你吸收了家人的情緒當成自己的'
}

// ═══════════════════ Nakshatra · 深層命格 ═══════════════════
export const nakshatraPunchlines = {
  Ashwini: '你反應快到不像人類',
  Bharani: '你扛的東西比別人想像多',
  Krittika: '你嘴毒但都講真話',
  Rohini: '你天生就被人喜歡',
  Mrigashira: '你永遠在找「下一個」',
  Ardra: '你走過幾段崩潰期，現在更強',
  Punarvasu: '你總能從哪裡都重新站起來',
  Pushya: '你是朋友圈的治療師',
  Ashlesha: '你看穿別人但不說破',
  Magha: '你活在回應家族的期待裡',
  'Purva Phalguni': '你懂享樂、戀愛老手',
  'Uttara Phalguni': '對朋友忠誠到一個傳奇',
  Hasta: '你手特別巧，細節做得漂亮',
  Chitra: '你把自己打磨成作品',
  Swati: '你不喜歡被任何人綁',
  Vishakha: '你鎖定目標就不會回頭',
  Anuradha: '你是把群體黏住的那個人',
  Jyeshtha: '你常是那個扛責任的人',
  Mula: '你敢把整件事拆掉重來',
  'Purva Ashadha': '你永遠不認輸',
  'Uttara Ashadha': '你晚熟但到位就不敗',
  Shravana: '你聽別人說話比自己說多',
  Dhanishta: '你有節奏感、商業腦',
  Shatabhisha: '你享受獨處、不需要陪',
  'Purva Bhadrapada': '你做到 60% 會想砍掉重來',
  'Uttara Bhadrapada': '你內在比外表深 10 倍',
  Revati: '你是別人的「終點守護者」'
}

// ═══════════════════ 組合器 ═══════════════════
// 從 4 個維度各抽 1 條，組成「命盤洩密」4 句
export function buildCardPunchlines({ lagnaRashi, sunRashi, moonRashi, nakshatraName }) {
  const lines = []

  const lagnaLine = lagnaPunchlines[lagnaRashi]
  if (lagnaLine) lines.push(lagnaLine)

  const moonLine = moonPunchlines[moonRashi]
  if (moonLine) lines.push(moonLine)

  const nakLine = nakshatraPunchlines[nakshatraName]
  if (nakLine) lines.push(nakLine)

  // 最後一條從太陽 rashi 的「靈魂驅動」或「童年陰影」中擇一
  // 擇其一讓它不重複前面已出現的元素
  const sunLine = sunShadowPunchlines[sunRashi] || sunPunchlines[sunRashi]
  if (sunLine) lines.push(sunLine)

  return lines.slice(0, 4)
}
