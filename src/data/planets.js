// Navagraha — 9 celestial bodies in Vedic Astrology
export const planets = [
  {
    id: 'sun',
    name: 'Surya',
    chinese: '太陽',
    english: 'Sun',
    symbol: '☉',
    color: '#ffa733',
    nature: 'Malefic (溫和)',
    day: '星期日',
    metal: '金',
    gem: 'Ruby · 紅寶石',
    meaning: '靈魂、自我、父親',
    description: '代表靈魂（Atma）、生命力與光明意識。決定人生的主要方向與榮耀之源。'
  },
  {
    id: 'moon',
    name: 'Chandra',
    chinese: '月亮',
    english: 'Moon',
    symbol: '☽',
    color: '#c8d6ff',
    nature: 'Benefic',
    day: '星期一',
    metal: '銀',
    gem: 'Pearl · 珍珠',
    meaning: '心、情緒、母親',
    description: '代表心智（Manas）與情緒。吠陀占星中月亮比太陽更重要，是命盤核心。'
  },
  {
    id: 'mars',
    name: 'Mangala',
    chinese: '火星',
    english: 'Mars',
    symbol: '♂',
    color: '#e34234',
    nature: 'Malefic',
    day: '星期二',
    metal: '銅',
    gem: 'Red Coral · 紅珊瑚',
    meaning: '勇氣、行動、兄弟',
    description: '能量的戰士。掌管體能、競爭、意志與性驅力。'
  },
  {
    id: 'mercury',
    name: 'Budha',
    chinese: '水星',
    english: 'Mercury',
    symbol: '☿',
    color: '#55cc88',
    nature: 'Neutral',
    day: '星期三',
    metal: '混合金屬',
    gem: 'Emerald · 祖母綠',
    meaning: '智力、語言、學習',
    description: '心智的王子。掌管理性思維、溝通、商業與年輕。'
  },
  {
    id: 'jupiter',
    name: 'Guru',
    chinese: '木星',
    english: 'Jupiter',
    symbol: '♃',
    color: '#ffd166',
    nature: 'Benefic (最吉)',
    day: '星期四',
    metal: '黃金',
    gem: 'Yellow Sapphire · 黃寶石',
    meaning: '智慧、導師、財富',
    description: '偉大的吉星與老師。代表智慧、信仰、子嗣與人生的擴張與祝福。'
  },
  {
    id: 'venus',
    name: 'Shukra',
    chinese: '金星',
    english: 'Venus',
    symbol: '♀',
    color: '#f7c8e0',
    nature: 'Benefic',
    day: '星期五',
    metal: '鉑金',
    gem: 'Diamond · 鑽石',
    meaning: '愛、藝術、配偶',
    description: '美與愛的詩人。掌管愛情、藝術、感官享樂與婚姻。'
  },
  {
    id: 'saturn',
    name: 'Shani',
    chinese: '土星',
    english: 'Saturn',
    symbol: '♄',
    color: '#8a8fa3',
    nature: 'Malefic (最凶)',
    day: '星期六',
    metal: '鐵',
    gem: 'Blue Sapphire · 藍寶石',
    meaning: '業力、紀律、時間',
    description: '嚴厲的法官與時間之王。代表責任、限制、業力與人生的考驗與成熟。'
  },
  {
    id: 'rahu',
    name: 'Rahu',
    chinese: '羅睺',
    english: 'North Node',
    symbol: '☊',
    color: '#9b59b6',
    nature: 'Shadow (陰影)',
    day: '—',
    metal: '鉛',
    gem: 'Hessonite · 肉桂石',
    meaning: '慾望、外在、業力方向',
    description: '月亮北交點。代表這世的靈魂渴望、外在物質追求與幻象。'
  },
  {
    id: 'ketu',
    name: 'Ketu',
    chinese: '計都',
    english: 'South Node',
    symbol: '☋',
    color: '#34495e',
    nature: 'Shadow (陰影)',
    day: '—',
    metal: '無',
    gem: "Cat's Eye · 貓眼石",
    meaning: '解脫、過去、靈性',
    description: '月亮南交點。代表過去世的業力成就、出離與通往解脫的道路。'
  }
]

export function getPlanetById(id) {
  return planets.find((p) => p.id === id)
}
