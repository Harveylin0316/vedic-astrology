// 規則式吠陀占星解讀（不依賴 LLM）
// 根據 Lagna（上升）/ 太陽 / 月亮 所在 Rashi 以及月亮所在 Nakshatra 提供解讀

// ─────────────────────────────────────────────────────────────
// Lagna 上升星座解讀（外在性格、外貌、人生起點）
// ─────────────────────────────────────────────────────────────
export const lagnaReadings = {
  Mesha: {
    headline: '開拓者的身影',
    body: '上升白羊使你天生具有開創精神，走路有風、行動派。第一印象鮮明，讓人感受到熱度。挑戰在於學會等待與傾聽，不被衝動帶著走。',
    strengths: ['果斷行動', '充沛活力', '直來直往'],
    challenges: ['急躁', '不耐煩', '好勝心強']
  },
  Vrishabha: {
    headline: '大地的穩定者',
    body: '上升金牛使你散發沉穩的氣場，外表柔和卻意志堅定。你偏愛美感、舒適與品質，人生節奏緩慢而踏實。挑戰是別讓執著變成僵化。',
    strengths: ['耐心穩健', '感官敏銳', '忠實可靠'],
    challenges: ['固執', '抗拒改變', '重物質享樂']
  },
  Mithuna: {
    headline: '靈活的信使',
    body: '上升雙子使你思維敏捷、言語機巧，擅於社交與切換情境。你外表年輕、氣質活潑。挑戰是深度不足、容易分心，學會聚焦會為你打開新層次。',
    strengths: ['溝通能力', '學習力強', '適應力高'],
    challenges: ['三心二意', '浮躁', '神經緊繃']
  },
  Karka: {
    headline: '柔軟的守護者',
    body: '上升巨蟹讓你散發母性/父性的滋養氣質，敏感度高、情緒豐沛。家庭與根源是你人生的核心課題。挑戰是學會不把他人情緒攬在身上。',
    strengths: ['共感力', '細膩體貼', '守護本能'],
    challenges: ['情緒化', '過度黏附', '易受傷']
  },
  Simha: {
    headline: '天生的王者',
    body: '上升獅子使你自帶舞台光芒，自信、驕傲、慷慨。你渴望被認可，也願意為所愛付出一切。挑戰是放下驕傲、接受平凡時刻同樣有價值。',
    strengths: ['領導魅力', '創造力', '慷慨大方'],
    challenges: ['自我中心', '過於在意面子', '控制欲']
  },
  Kanya: {
    headline: '精進的職人',
    body: '上升處女使你觀察細膩、追求完美，對品質與細節有近乎本能的掌握。你擅於分析與服務他人。挑戰是放下過度批判，容許自己與他人不完美。',
    strengths: ['分析力', '實用智慧', '責任感'],
    challenges: ['過度挑剔', '焦慮', '自我批判']
  },
  Tula: {
    headline: '優雅的外交官',
    body: '上升天秤使你散發平衡與美感，擅長協調與人際關係。你重視公平，也害怕衝突。挑戰是學會做決定、不害怕讓他人失望。',
    strengths: ['美感敏銳', '外交手腕', '公正態度'],
    challenges: ['優柔寡斷', '依賴他人', '表面和諧']
  },
  Vrishchika: {
    headline: '深邃的探索者',
    body: '上升天蠍使你有穿透力的眼神與強烈的存在感。你擅於看穿表象、探入深層真相。挑戰是不讓懷疑與占有慾吞噬你的關係。',
    strengths: ['洞察力', '意志堅強', '轉化能力'],
    challenges: ['多疑', '控制慾', '記仇']
  },
  Dhanu: {
    headline: '追尋真理的弓箭手',
    body: '上升射手使你嚮往自由、擴張與意義。你熱愛旅行、哲學與高等學問，樂觀而富遠見。挑戰是學會把廣度收斂為專注，避免承諾恐懼。',
    strengths: ['樂觀豁達', '追求智慧', '直覺準'],
    challenges: ['過度承諾', '不耐細節', '說話欠思']
  },
  Makara: {
    headline: '山的建造者',
    body: '上升摩羯使你外表嚴肅、內心深沉，對成就與責任有強烈驅動力。你是慢熟型的贏家，越老越有光。挑戰是讓自己也能享受當下。',
    strengths: ['耐力紀律', '務實規劃', '責任承擔'],
    challenges: ['自我要求太高', '嚴肅', '難以放鬆']
  },
  Kumbha: {
    headline: '自由的改革者',
    body: '上升水瓶使你獨立、理性、視野遼闊，常帶有「與眾不同」的氣質。你關心群體與未來。挑戰是學會進入親密關係，不用距離保護自己。',
    strengths: ['原創思維', '人道關懷', '獨立自主'],
    challenges: ['情感疏離', '固守己見', '叛逆']
  },
  Meena: {
    headline: '靈魂的夢者',
    body: '上升雙魚使你柔軟、富同情心、容易與宇宙共振。你擁有藝術與靈性天賦，也容易被環境影響。挑戰是建立界線、不讓他人的痛苦淹沒你。',
    strengths: ['慈悲', '直覺', '想像力'],
    challenges: ['邊界模糊', '逃避現實', '自我懷疑']
  }
}

// ─────────────────────────────────────────────────────────────
// 太陽（Surya）在各 Rashi 的解讀 — 靈魂、父親、人生目標
// ─────────────────────────────────────────────────────────────
export const sunReadings = {
  Mesha: { theme: '戰士之魂', body: '太陽在白羊屬於「旺宮」，你天生具有開創力與領袖才能。人生召喚你站到前線、為自己的信念而戰。' },
  Vrishabha: { theme: '沉穩的建造者', body: '太陽在金牛，你的靈魂主題是穩定與累積。透過耐心耕耘，你能建立真實、長久的成就。' },
  Mithuna: { theme: '訊息的傳遞者', body: '太陽在雙子，你的目的是透過語言、寫作或教學來傳遞知識。學習與分享是你人生的光。' },
  Karka: { theme: '守護的心', body: '太陽在巨蟹，你的靈魂透過滋養他人綻放。家庭、情感與根源是你核心的課題與榮耀。' },
  Simha: { theme: '王者回到王座', body: '太陽回到自己守護的星座，力量最強。你天生就是主角，創造與領導是你的天命。' },
  Kanya: { theme: '精進的服務者', body: '太陽在處女，你透過專業技藝與細膩服務找到意義。完美主義若用在對的地方，會是你最大的禮物。' },
  Tula: { theme: '尋找平衡的靈魂', body: '太陽在天秤屬於「弱宮」，需要多花心力建立自我。透過合作與關係，你學會看見自己。' },
  Vrishchika: { theme: '轉化的煉金師', body: '太陽在天蠍，你的靈魂主題是深度與重生。一次次穿越暗夜，你將綻放出最真實的光。' },
  Dhanu: { theme: '真理的追尋者', body: '太陽在射手，你的靈魂召喚你向外擴張、向內求道。人生是一場壯闊的朝聖之旅。' },
  Makara: { theme: '山頂的遠望者', body: '太陽在摩羯，你的目的是透過紀律與長遠規劃達成實質成就。你是時間的朋友。' },
  Kumbha: { theme: '人類的夢想者', body: '太陽在水瓶，你來為群體服務、為未來鋪路。你的光屬於眾人，而非只照一個房間。' },
  Meena: { theme: '慈悲的海洋', body: '太陽在雙魚，你的靈魂透過慈悲、藝術與靈性綻放。超越小我的奉獻是你的功課。' }
}

// ─────────────────────────────────────────────────────────────
// 月亮（Chandra）在各 Rashi 的解讀 — 心、情緒、內在需求
// 吠陀占星最重要：月亮星座決定情緒底色與心智傾向
// ─────────────────────────────────────────────────────────────
export const moonReadings = {
  Mesha: { theme: '戰鬥的心', body: '月亮在白羊，你的情緒如火，反應快速、直接。需要行動與挑戰才能感到活著。學會在爆發前停一拍。' },
  Vrishabha: { theme: '豐饒的心', body: '月亮在金牛屬於「旺宮」，情感穩定、滋養他人。需要美感、身體感官與安定的環境才能安心。' },
  Mithuna: { theme: '好奇的心', body: '月亮在雙子，情緒隨思緒流動，喜歡溝通與變化。需要多樣的刺激，但也要學會讓心靜下來。' },
  Karka: { theme: '深海的心', body: '月亮回到自己守護的星座，感受力極強。家與情感歸屬是你的氧氣。學會辨認：哪些情緒是你的，哪些是他人的。' },
  Simha: { theme: '驕傲的心', body: '月亮在獅子，情緒戲劇化、愛憎分明。需要被欣賞與看見。當你真心發光時，整個房間都會暖起來。' },
  Kanya: { theme: '細緻的心', body: '月亮在處女，你透過整理、分析、服務來處理情緒。易焦慮，學會放下「必須完美」。' },
  Tula: { theme: '和諧的心', body: '月亮在天秤，情緒追求平衡與美感。需要陪伴與和諧的關係。學會不為了他人而壓抑自己的真實。' },
  Vrishchika: { theme: '深淵的心', body: '月亮在天蠍屬於「弱宮」，感情強烈、執著且深沉。透過轉化痛苦，你將擁有他人無法觸及的智慧。' },
  Dhanu: { theme: '遠方的心', body: '月亮在射手，情緒樂觀外放，需要自由與意義感。理念比形式重要，避免變成教條主義者。' },
  Makara: { theme: '堅忍的心', body: '月亮在摩羯，情緒含蓄、責任感重。外冷內熱，需要時間建立信任。允許自己也有脆弱的時刻。' },
  Kumbha: { theme: '獨立的心', body: '月亮在水瓶，情緒抽離、理性。你在群體中仍保持自我，但別讓距離變成孤立。' },
  Meena: { theme: '融化的心', body: '月亮在雙魚，情緒如海，極敏感與富同情。藝術與靈修是你的錨，否則容易被外界淹沒。' }
}

// ─────────────────────────────────────────────────────────────
// Nakshatra 詳細解讀 — 月宿決定深層業力與心智底色
// ─────────────────────────────────────────────────────────────
export const nakshatraReadings = {
  Ashwini: { theme: '療癒的先行者', body: '你是開拓者，擁有療癒與瞬間行動的能力。適合與醫療、運動、創新相關的道路。' },
  Bharani: { theme: '承載生死的門戶', body: '你是轉化者，懂得承擔重量、陪伴他人經歷生命的起伏。內在充滿創造與犧牲的張力。' },
  Krittika: { theme: '淨化的火焰', body: '如剃刀般敏銳，看穿虛假。使命是燃燒雜質、顯化真理。可能早年經歷考驗，後期發光。' },
  Rohini: { theme: '大地的豐饒', body: '美麗、有吸引力、富創造力。Rohini 是月亮最愛的 Nakshatra，帶來感官、藝術與物質的豐盛。' },
  Mrigashira: { theme: '輕盈的追尋者', body: '如鹿般溫柔、好奇，永遠在尋找更遠的風景。旅行、研究、寫作都可能是你的道路。' },
  Ardra: { theme: '暴風的洗禮', body: '透過巨大的情緒風暴與破舊立新，你鍛鍊出敏銳的心智與更新自己的勇氣。' },
  Punarvasu: { theme: '歸來的光', body: '一次次跌倒、一次次重生。你為他人帶來寬容、家的感覺與信念的溫度。' },
  Pushya: { theme: '滋養的乳', body: '最吉祥的 Nakshatra 之一。你天生具有導師、滋養者、療癒者的特質。受人信任與愛戴。' },
  Ashlesha: { theme: '盤蛇的智慧', body: '擁有神祕、催眠般的吸引力，洞察力極深。若善用這股能量，是治療師與靈修者；若失衡，會陷入操控。' },
  Magha: { theme: '祖先的王座', body: '你攜帶著祖先的榮光與業力。早年或許需要「離開父親」才能真正繼承自己的王國。' },
  PurvaPhalguni: { theme: '享樂的藝術家', body: '你懂得愛、享樂與創造。藝術、戀愛、表演是你與世界連結的方式。' },
  UttaraPhalguni: { theme: '忠誠的締結者', body: '你在友誼、婚姻、契約中發光。穩定、可信任、公正的你，常被委以重任。' },
  Hasta: { theme: '掌心的技藝', body: '巧手精工。手工、醫療、諮商都是你的場域。你有「把事情做到恰到好處」的天賦。' },
  Chitra: { theme: '璀璨的珠寶', body: '迷人、具有藝術與設計天賦。你懂得把自己或作品打磨成閃閃發亮的寶石。' },
  Swati: { theme: '獨立的風', body: '如風中的幼苗，彎腰卻不折斷。你需要自由、外交能力強、善於商業或外交。' },
  Vishakha: { theme: '凱旋的決心', body: '目標導向、勝負心強。一旦鎖定目標便全力以赴，但要避免為達目的不擇手段。' },
  Anuradha: { theme: '虔誠的連結', body: '善於建立深厚友誼與團體。你的奉獻與組織力，讓群體因你而存在。' },
  Jyeshtha: { theme: '長者的威嚴', body: '你具有保護與權威感，常是家中或團體中被推上前線的人。學會不獨自承擔一切。' },
  Mula: { theme: '連根拔起', body: '你的使命是挖掘真相，哪怕需要拆毀表象。經歷動盪後，你會找到真正不可動搖的根。' },
  PurvaAshadha: { theme: '不敗的戰歌', body: '具有激勵人心的能量，說話有力、精神永不被擊倒。容易吸引群眾。' },
  UttaraAshadha: { theme: '普世的勝利', body: '你的成功屬於長遠、正義、為眾人服務的方向。晚熟、但一旦站穩便屹立不搖。' },
  Shravana: { theme: '聆聽的智者', body: '你透過聆聽、學習、傳承而成長。適合教學、諮商、深度交談的工作。' },
  Dhanishta: { theme: '節奏的鼓手', body: '富足、愛群體、具音樂或節奏感。可能在物質成就上顯眼，但需注意情感連結。' },
  Shatabhisha: { theme: '百藥的療者', body: '獨行的神祕療癒者。可能喜歡獨處、研究深奧領域。你的光在幕後最亮。' },
  PurvaBhadrapada: { theme: '轉化的火焰', body: '帶有強烈、熱烈、不走尋常路的氣質。犧牲小我、追求非凡，常是思想家或改革者。' },
  UttaraBhadrapada: { theme: '深海的智者', body: '內在深沉、富同情心、靈性取向強。你能觸碰到他人沒看見的深度。' },
  Revati: { theme: '守護的終點', body: '你是旅者的守護者，慈悲且具直覺。Revati 是 27 個 Nakshatra 的最後一個，帶有完成與送別的力量。' }
}

// ─────────────────────────────────────────────────────────────
// 元素平衡分析
// ─────────────────────────────────────────────────────────────
const rashiElement = {
  Mesha: 'fire', Simha: 'fire', Dhanu: 'fire',
  Vrishabha: 'earth', Kanya: 'earth', Makara: 'earth',
  Mithuna: 'air', Tula: 'air', Kumbha: 'air',
  Karka: 'water', Vrishchika: 'water', Meena: 'water'
}

const elementInfo = {
  fire: {
    name: '火 Agni',
    nature: '行動、意志、熱情',
    advice: '火過強時易急躁與耗損，記得透過冥想、飲水、大自然的接觸來冷卻能量。'
  },
  earth: {
    name: '土 Prithvi',
    nature: '穩定、實用、感官',
    advice: '土過強時易固著，嘗試旅行、學習新事物，讓生活流動起來。'
  },
  air: {
    name: '風 Vayu',
    nature: '思考、溝通、流動',
    advice: '風過強時易焦慮、神經緊繃，練習規律作息與深呼吸來接地。'
  },
  water: {
    name: '水 Jala',
    nature: '情感、直覺、連結',
    advice: '水過強時易情緒氾濫，透過運動、日光、結構化的行程來平衡。'
  }
}

export function getElementBalance({ sunRashi, moonRashi, lagnaRashi }) {
  const counts = { fire: 0, earth: 0, air: 0, water: 0 }
  ;[sunRashi, moonRashi, lagnaRashi].forEach((r) => {
    const el = rashiElement[r]
    if (el) counts[el] += 1
  })
  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
  const missing = Object.entries(counts)
    .filter(([, v]) => v === 0)
    .map(([k]) => k)
  return {
    counts,
    dominant,
    dominantInfo: elementInfo[dominant],
    missing,
    missingInfo: missing.map((m) => elementInfo[m])
  }
}

// ─────────────────────────────────────────────────────────────
// 行星建議（寶石、曼陀羅、主管日）— 基於月亮 Rashi 的守護星
// ─────────────────────────────────────────────────────────────
export const planetRemedies = {
  Sun: { gem: 'Ruby 紅寶石', metal: '金', day: '星期日', mantra: 'Om Suryaya Namaha', focus: '點燃自信、榮耀與父親關係' },
  Moon: { gem: 'Pearl 珍珠', metal: '銀', day: '星期一', mantra: 'Om Chandraya Namaha', focus: '滋養情緒、心靈安定' },
  Mars: { gem: 'Red Coral 紅珊瑚', metal: '銅', day: '星期二', mantra: 'Om Angarakaya Namaha', focus: '強化勇氣、行動力' },
  Mercury: { gem: 'Emerald 祖母綠', metal: '青銅', day: '星期三', mantra: 'Om Budhaya Namaha', focus: '提升溝通與心智清晰' },
  Jupiter: { gem: 'Yellow Sapphire 黃寶石', metal: '金', day: '星期四', mantra: 'Om Gurave Namaha', focus: '智慧、擴張、祝福' },
  Venus: { gem: 'Diamond 鑽石', metal: '銀', day: '星期五', mantra: 'Om Shukraya Namaha', focus: '愛情、藝術與和諧' },
  Saturn: { gem: 'Blue Sapphire 藍寶石', metal: '鐵', day: '星期六', mantra: 'Om Shanicharaya Namaha', focus: '紀律、業力與耐心' }
}

export function getRemedyForRashi(rashiName) {
  const rulerMap = {
    Mesha: 'Mars', Vrishabha: 'Venus', Mithuna: 'Mercury', Karka: 'Moon',
    Simha: 'Sun', Kanya: 'Mercury', Tula: 'Venus', Vrishchika: 'Mars',
    Dhanu: 'Jupiter', Makara: 'Saturn', Kumbha: 'Saturn', Meena: 'Jupiter'
  }
  const ruler = rulerMap[rashiName]
  return { ruler, ...planetRemedies[ruler] }
}

// Normalize nakshatra name (strip spaces) to match key
export function normalizeNakshatraName(name) {
  return name.replace(/\s+/g, '')
}
