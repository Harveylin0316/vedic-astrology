// 27 Nakshatras (月宿) — each spans 13°20' of the sidereal zodiac
export const nakshatras = [
  { id: 1, name: 'Ashwini', chinese: '阿說你', deity: 'Ashwini Kumaras', ruler: 'Ketu', symbol: '馬頭', trait: '療癒、迅捷、開創' },
  { id: 2, name: 'Bharani', chinese: '婆羅尼', deity: 'Yama', ruler: 'Venus', symbol: '女陰', trait: '承載、轉化、紀律' },
  { id: 3, name: 'Krittika', chinese: '昴宿', deity: 'Agni', ruler: 'Sun', symbol: '剃刀', trait: '淨化、銳利、光明' },
  { id: 4, name: 'Rohini', chinese: '畢宿', deity: 'Brahma', ruler: 'Moon', symbol: '戰車', trait: '豐盛、美麗、感官' },
  { id: 5, name: 'Mrigashira', chinese: '觜宿', deity: 'Soma', ruler: 'Mars', symbol: '鹿首', trait: '探索、溫柔、好奇' },
  { id: 6, name: 'Ardra', chinese: '參宿', deity: 'Rudra', ruler: 'Rahu', symbol: '淚珠', trait: '風暴、破舊立新' },
  { id: 7, name: 'Punarvasu', chinese: '井宿', deity: 'Aditi', ruler: 'Jupiter', symbol: '箭筒', trait: '重生、家宅、寬容' },
  { id: 8, name: 'Pushya', chinese: '鬼宿', deity: 'Brihaspati', ruler: 'Saturn', symbol: '乳房', trait: '滋養、吉祥、導師' },
  { id: 9, name: 'Ashlesha', chinese: '柳宿', deity: 'Nagas', ruler: 'Mercury', symbol: '盤蛇', trait: '潛伏、神祕、智慧' },
  { id: 10, name: 'Magha', chinese: '星宿', deity: 'Pitris', ruler: 'Ketu', symbol: '王座', trait: '榮耀、祖先、王權' },
  { id: 11, name: 'Purva Phalguni', chinese: '張宿', deity: 'Bhaga', ruler: 'Venus', symbol: '床腳', trait: '享樂、創造、戀愛' },
  { id: 12, name: 'Uttara Phalguni', chinese: '翼宿', deity: 'Aryaman', ruler: 'Sun', symbol: '床頭', trait: '契約、穩定、朋友' },
  { id: 13, name: 'Hasta', chinese: '軫宿', deity: 'Savitar', ruler: 'Moon', symbol: '手掌', trait: '技藝、療癒、掌握' },
  { id: 14, name: 'Chitra', chinese: '角宿', deity: 'Tvashtar', ruler: 'Mars', symbol: '明珠', trait: '華麗、工藝、魅力' },
  { id: 15, name: 'Swati', chinese: '亢宿', deity: 'Vayu', ruler: 'Rahu', symbol: '幼苗', trait: '自由、彈性、獨立' },
  { id: 16, name: 'Vishakha', chinese: '氐宿', deity: 'Indra-Agni', ruler: 'Jupiter', symbol: '凱旋門', trait: '決心、目標、熱情' },
  { id: 17, name: 'Anuradha', chinese: '房宿', deity: 'Mitra', ruler: 'Saturn', symbol: '蓮花', trait: '友誼、奉獻、組織' },
  { id: 18, name: 'Jyeshtha', chinese: '心宿', deity: 'Indra', ruler: 'Mercury', symbol: '耳環', trait: '長者、保護、權威' },
  { id: 19, name: 'Mula', chinese: '尾宿', deity: 'Nirriti', ruler: 'Ketu', symbol: '樹根', trait: '根源、拆解、真理' },
  { id: 20, name: 'Purva Ashadha', chinese: '箕宿', deity: 'Apah', ruler: 'Venus', symbol: '象牙', trait: '不敗、戰勝、激勵' },
  { id: 21, name: 'Uttara Ashadha', chinese: '斗宿', deity: 'Vishvadevas', ruler: 'Sun', symbol: '象牙', trait: '勝利、正義、持久' },
  { id: 22, name: 'Shravana', chinese: '女宿', deity: 'Vishnu', ruler: 'Moon', symbol: '耳朵', trait: '聆聽、學習、連結' },
  { id: 23, name: 'Dhanishta', chinese: '虛宿', deity: 'Vasus', ruler: 'Mars', symbol: '鼓', trait: '節奏、富足、群體' },
  { id: 24, name: 'Shatabhisha', chinese: '危宿', deity: 'Varuna', ruler: 'Rahu', symbol: '百花', trait: '療癒、祕密、獨行' },
  { id: 25, name: 'Purva Bhadrapada', chinese: '室宿', deity: 'Aja Ekapada', ruler: 'Jupiter', symbol: '劍', trait: '犧牲、熱烈、轉化' },
  { id: 26, name: 'Uttara Bhadrapada', chinese: '壁宿', deity: 'Ahirbudhnya', ruler: 'Saturn', symbol: '雙人', trait: '深度、慈悲、靈性' },
  { id: 27, name: 'Revati', chinese: '奎宿', deity: 'Pushan', ruler: 'Mercury', symbol: '魚', trait: '守護、旅程、終結' }
]

// Each nakshatra spans 360/27 = 13.3333° of sidereal longitude
export const NAKSHATRA_SPAN = 360 / 27

export function getNakshatraByLongitude(siderealLongitude) {
  const normalized = ((siderealLongitude % 360) + 360) % 360
  const index = Math.floor(normalized / NAKSHATRA_SPAN)
  const pada = Math.floor((normalized % NAKSHATRA_SPAN) / (NAKSHATRA_SPAN / 4)) + 1
  return { ...nakshatras[index], pada }
}
