// 12 Rashis (Vedic Zodiac Signs) — sidereal
export const rashis = [
  {
    id: 1,
    name: 'Mesha',
    chinese: '白羊',
    symbol: '♈',
    element: '火',
    quality: '動',
    ruler: 'Mars',
    rulerChinese: '火星',
    trait: '開創、勇氣、領袖',
    description: '第一宮的象徵，代表起始、意志力與自我。火星守護，能量銳利。'
  },
  {
    id: 2,
    name: 'Vrishabha',
    chinese: '金牛',
    symbol: '♉',
    element: '土',
    quality: '固定',
    ruler: 'Venus',
    rulerChinese: '金星',
    trait: '穩定、感官、耐心',
    description: '物質享受與大地的連結。金星守護，重視美感、舒適與財富累積。'
  },
  {
    id: 3,
    name: 'Mithuna',
    chinese: '雙子',
    symbol: '♊',
    element: '風',
    quality: '變動',
    ruler: 'Mercury',
    rulerChinese: '水星',
    trait: '溝通、好奇、靈巧',
    description: '資訊與語言的流動。水星守護，思維敏捷、擅長多工與人際交流。'
  },
  {
    id: 4,
    name: 'Karka',
    chinese: '巨蟹',
    symbol: '♋',
    element: '水',
    quality: '動',
    ruler: 'Moon',
    rulerChinese: '月亮',
    trait: '情感、母性、家庭',
    description: '內在情感與滋養。月亮守護，敏感且具直覺，珍惜家庭與根源。'
  },
  {
    id: 5,
    name: 'Simha',
    chinese: '獅子',
    symbol: '♌',
    element: '火',
    quality: '固定',
    ruler: 'Sun',
    rulerChinese: '太陽',
    trait: '榮耀、創造、王者',
    description: '太陽所守護的王座。自信、慷慨、天生具有領袖氣質與藝術才華。'
  },
  {
    id: 6,
    name: 'Kanya',
    chinese: '處女',
    symbol: '♍',
    element: '土',
    quality: '變動',
    ruler: 'Mercury',
    rulerChinese: '水星',
    trait: '分析、服務、完美',
    description: '細節與精進。水星守護，重視秩序、健康與實用智慧。'
  },
  {
    id: 7,
    name: 'Tula',
    chinese: '天秤',
    symbol: '♎',
    element: '風',
    quality: '動',
    ruler: 'Venus',
    rulerChinese: '金星',
    trait: '平衡、公正、合作',
    description: '關係與和諧。金星守護，追求美感、外交技巧與夥伴關係。'
  },
  {
    id: 8,
    name: 'Vrishchika',
    chinese: '天蠍',
    symbol: '♏',
    element: '水',
    quality: '固定',
    ruler: 'Mars',
    rulerChinese: '火星',
    trait: '深度、轉化、神祕',
    description: '潛意識與重生。火星守護，擁有穿透力、熱情與探索幽微的能力。'
  },
  {
    id: 9,
    name: 'Dhanu',
    chinese: '射手',
    symbol: '♐',
    element: '火',
    quality: '變動',
    ruler: 'Jupiter',
    rulerChinese: '木星',
    trait: '哲思、探索、信念',
    description: '廣大的視野與真理。木星守護，嚮往智慧、遠方與高等學問。'
  },
  {
    id: 10,
    name: 'Makara',
    chinese: '摩羯',
    symbol: '♑',
    element: '土',
    quality: '動',
    ruler: 'Saturn',
    rulerChinese: '土星',
    trait: '野心、紀律、責任',
    description: '結構與長遠目標。土星守護，具備堅毅、務實與長期耕耘的精神。'
  },
  {
    id: 11,
    name: 'Kumbha',
    chinese: '水瓶',
    symbol: '♒',
    element: '風',
    quality: '固定',
    ruler: 'Saturn',
    rulerChinese: '土星',
    trait: '創新、人道、獨立',
    description: '未來與群體。土星守護，理性、獨立，且常具有改革精神。'
  },
  {
    id: 12,
    name: 'Meena',
    chinese: '雙魚',
    symbol: '♓',
    element: '水',
    quality: '變動',
    ruler: 'Jupiter',
    rulerChinese: '木星',
    trait: '慈悲、直覺、靈性',
    description: '融合與超越。木星守護，富想像力、共感力，連結靈性與夢境。'
  }
]

export function getRashiByIndex(index) {
  return rashis[((index % 12) + 12) % 12]
}
