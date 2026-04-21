// 雙人合盤解讀內容
// 依據兩人 Moon Rashi 組合 + Kuta 分數特徵，給出三段敘事：
//   1. 為什麼吸引彼此 (Why You Attract)
//   2. 會吵什麼／死穴 (What You Fight Over)
//   3. 如何走得長久 (How To Last)

// 四元素分類（Moon Rashi）
const ELEMENT_OF = {
  Mesha: 'fire', Simha: 'fire', Dhanu: 'fire',
  Vrishabha: 'earth', Kanya: 'earth', Makara: 'earth',
  Mithuna: 'air', Tula: 'air', Kumbha: 'air',
  Karka: 'water', Vrishchika: 'water', Meena: 'water'
}

// 元素組合 → 關係動態
const ELEMENT_DYNAMICS = {
  'fire-fire': {
    attract: '你們兩個都是「做就對了」型的人 — 看對方行動力會上癮。在一起像兩把火、熱鬧又精彩、不會冷場。',
    fight: '你們都不服輸、都要搶第一說。爭執點通常不是事情本身，是「誰對誰錯」— 誰先道歉就等同認輸，結果沒人先退。',
    last: '建立一個「10 秒冷靜」的規則 — 生氣時各自去倒杯水。你們這組不缺火花，缺的是降溫機制。'
  },
  'fire-earth': {
    attract: '火方被土方的穩定、靠譜迷得神魂顛倒；土方被火方的活力、衝勁激活。你們是彼此生活裡「沒你就不完整」的互補。',
    fight: '火方覺得土方太慢、太悶、不願冒險；土方覺得火方太衝、不計後果、花太多錢。關於「要不要做這個決定」會反覆吵。',
    last: '火方要學會「給他三天想」；土方要學會「偶爾說好吧我陪你瘋一次」。節奏調到對方的 70% 就剛好。'
  },
  'fire-air': {
    attract: '風方的想法刺激火方的行動、火方的行動讓風方的點子落地。你們會聊不完、玩不完、一起做瘋狂專案。',
    fight: '風方話多但不一定做、火方做了但不解釋。風方會覺得火方太粗，火方會覺得風方太虛。',
    last: '風方把話說完後要做一件事；火方做事前願意解釋三句。這樣你們的默契才會活下來。'
  },
  'fire-water': {
    attract: '火方被水方的深情、敏感、溫柔吸引；水方被火方的勇氣、直接、會保護人吸引。這是經典的「硬殼對軟心」組合。',
    fight: '火方的直接會戳傷水方；水方的情緒會冷卻火方。火方覺得「你怎麼又哭了」；水方覺得「你根本不在乎我」。',
    last: '火方學會把話慢一拍、帶點溫度再說；水方學會不把每次激動都解讀為「他不愛我」。這組很甜但非常需要用心。'
  },
  'earth-earth': {
    attract: '你們都愛穩定、愛美食、愛好生活。一起看房、一起存錢、一起規劃 10 年後 — 這些事你們做起來超流暢。',
    fight: '你們都固執、都不愛改變。一個決定卡住可以 3 週沒進展。生活會穩但也容易無聊。',
    last: '每個月強制「打破節奏」一次 — 旅行、新餐廳、冒險活動。你們最大的敵人是「慣性」。'
  },
  'earth-air': {
    attract: '土方穩住風方飄動的心；風方把土方悶著的生活打開窗。你們是「我有結構、你有靈感」的組合。',
    fight: '土方覺得風方想太多、不落地；風方覺得土方無聊、不懂新事物。長期下去會變成「一個管理員 + 一個藝術家」的分工，但也可能互看不順眼。',
    last: '土方給風方「想飛的空間」；風方給土方「回到地面的安全感」。你們不要改變對方，只要學會欣賞。'
  },
  'earth-water': {
    attract: '這是極經典的「滋養型組合」。土方的穩定讓水方情緒有地方安放；水方的柔軟讓土方的硬殼軟化。你們很容易一起建立家。',
    fight: '土方講實話但不解釋情緒；水方情緒到了但不解釋事實。經常是「你為什麼生氣 / 我哪有生氣」的無限循環。',
    last: '土方學會問「你需要我現在怎麼陪你」；水方學會在情緒到之前講需求。你們有潛力走到很老。'
  },
  'air-air': {
    attract: '你們聊不完、想不完、一起做專案。你們之間的默契像「兩個大腦接上同一條線」。',
    fight: '你們都想但都不想做。常陷入「我們上次討論的那個是不是要動了？」的無限循環。感情也可能從激情變成「像朋友」。',
    last: '強制一個「做的人」角色輪替 — 這個月我執行、下個月你執行。你們的關係需要落地，不然會一直漂在概念層。'
  },
  'air-water': {
    attract: '風方的聰明吸引水方、水方的深情融化風方。你們的對話會有「我終於遇到一個懂的人」的感覺。',
    fight: '風方用邏輯分析情緒、水方聽了只想哭。風方覺得水方太感性、水方覺得風方太冷。',
    last: '風方接情緒時不要急著「幫解決」；水方情緒過後主動給風方一個邏輯解釋。這是你們能否長久的關鍵。'
  },
  'water-water': {
    attract: '你們之間的共感能力是非水象的人永遠不懂的。一個眼神、一個嘆氣都在溝通。很容易進入「像靈魂伴侶」的狀態。',
    fight: '你們都記仇、都愛冷戰、都不會先開口。一次爭執可以互相不說話 3 天，沒人知道誰先錯。',
    last: '訂一個「不超過 24 小時的冷戰限制」— 無論誰對誰錯，24 小時後必須有人先講話。這組需要規則，不然會內耗到腐爛。'
  }
}

// 獲取元素組合 key
function elementKey(rashiA, rashiB) {
  const a = ELEMENT_OF[rashiA]
  const b = ELEMENT_OF[rashiB]
  if (!a || !b) return 'fire-fire'
  // 標準化排序：fire > earth > air > water
  const order = ['fire', 'earth', 'air', 'water']
  const [first, second] = order.indexOf(a) <= order.indexOf(b) ? [a, b] : [b, a]
  return `${first}-${second}`
}

// 主要函數：根據兩人命盤生成三段敘事
export function buildCompatibilityNarrative(result, chartA, chartB) {
  const rashiA = result.moonA.rashi
  const rashiB = result.moonB.rashi
  const key = elementKey(rashiA, rashiB)
  const dynamics = ELEMENT_DYNAMICS[key] || ELEMENT_DYNAMICS['fire-fire']

  return {
    ...dynamics,
    // 可再加上基於 Kuta 細節的補充
    extras: extraInsights(result, chartA, chartB)
  }
}

// 依 Kuta 特徵挑最值得講的點
function extraInsights(result, chartA, chartB) {
  const extras = []
  const kutaById = result.kutas.reduce((m, k) => {
    m[k.id] = k
    return m
  }, {})

  // Nadi Dosha（最嚴重）
  if (kutaById.nadi && kutaById.nadi.score === 0) {
    extras.push({
      type: 'dosha',
      title: 'Nadi Dosha · 能量重疊警示',
      body: '你們兩人屬於同一 Nadi（能量脈絡）— 傳統吠陀把這視為不利健康與子嗣的配置。現代解讀：你們太像了，容易一起累、同時低潮。需要刻意讓彼此的節奏錯開。'
    })
  }

  // Bhakoot Dosha
  if (kutaById.bhakoot && kutaById.bhakoot.score === 0) {
    extras.push({
      type: 'dosha',
      title: 'Bhakoot Dosha · 情感軌道不同',
      body: '你們的月亮距離落在「情感不易流動」的位置。現代解讀：你們對「什麼是愛」的定義不同 — 一方給的那種愛，對方感受不到；要明確說「我希望被這樣對待」。'
    })
  }

  // Gana 衝突（Deva vs Rakshasa）
  if (kutaById.gana && kutaById.gana.score === 0) {
    extras.push({
      type: 'dosha',
      title: 'Gana Mismatch · 天性不同國',
      body: '一人偏「天神型」（追求純粹與理想），一人偏「羅剎型」（追求強度與本能）。衝突點是「你怎麼這麼極端 / 你怎麼這麼理想主義」。'
    })
  }

  // 高分 Graha Maitri = 心智默契
  if (kutaById.graha_maitri && kutaById.graha_maitri.score >= 4) {
    extras.push({
      type: 'strength',
      title: 'Graha Maitri · 心智高度默契',
      body: '你們的月亮主星屬於彼此的「友星」— 代表你們處理情緒、看待世界的底層方式相似。這是長期關係最珍貴的資產，別小看。'
    })
  }

  // 高 Yoni = 身體吸引
  if (kutaById.yoni && kutaById.yoni.score === 4) {
    extras.push({
      type: 'strength',
      title: 'Yoni · 肢體強烈吸引',
      body: '你們的 Yoni 動物相同 — 身體與感官層面非常相容。床上的默契與日常肢體親密度自然地高。'
    })
  } else if (kutaById.yoni && kutaById.yoni.score === 0) {
    extras.push({
      type: 'dosha',
      title: 'Yoni · 肢體吸引微妙',
      body: '你們的 Yoni 動物是傳統視為「天敵」的組合。代表感官需求差距較大，但這個落差可以用溝通補起來 — 直接問「你需要什麼」比猜更快。'
    })
  }

  return extras
}

// 分級 tagline/icon
export const CATEGORY_META = {
  '天作之合': { icon: '💫', color: 'emerald' },
  '極佳配對': { icon: '✨', color: 'saffron' },
  '互補型配對': { icon: '🌗', color: 'blue' },
  '磨合型配對': { icon: '⚙️', color: 'amber' },
  '挑戰型配對': { icon: '⚡', color: 'vermilion' }
}
