// 雙人合盤解讀內容
// 依據兩人 Moon Rashi 組合 + Kuta 分數特徵，給出三段敘事：
//   1. 為什麼吸引彼此 (Why You Attract)
//   2. 會吵什麼／死穴 (What You Fight Over)
//   3. 如何走得長久 (How To Last)
//
// 敘事中使用占位符：
//   {A} / {B}       — 用於「同元素」配對（兩人是同類，直接用名字）
//   {fire} {earth} {air} {water}
//                    — 用於「跨元素」配對（渲染時換成對應元素方的名字）

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
    attract: '{A} 跟 {B} 都是「做就對了」型的人 — 看對方行動力會上癮。在一起像兩把火、熱鬧又精彩、不會冷場。',
    fight: '{A} 跟 {B} 都不服輸、都要搶第一說。爭執點通常不是事情本身，是「誰對誰錯」— 誰先道歉就等同認輸，結果沒人先退。',
    last: '{A} 跟 {B} 要共同建立一個「10 秒冷靜」的規則 — 生氣時各自去倒杯水。你們這組不缺火花，缺的是降溫機制。'
  },
  'fire-earth': {
    attract: '{fire} 被 {earth} 的穩定、靠譜迷得神魂顛倒；{earth} 被 {fire} 的活力、衝勁激活。你們是彼此生活裡「沒你就不完整」的互補。',
    fight: '{fire} 覺得 {earth} 太慢、太悶、不願冒險；{earth} 覺得 {fire} 太衝、不計後果、花太多錢。關於「要不要做這個決定」會反覆吵。',
    last: '{fire} 要學會「給 {earth} 三天想」；{earth} 要學會「偶爾說好吧我陪你瘋一次」。節奏調到對方的 70% 就剛好。'
  },
  'fire-air': {
    attract: '{air} 的想法刺激 {fire} 的行動、{fire} 的行動讓 {air} 的點子落地。你們會聊不完、玩不完、一起做瘋狂專案。',
    fight: '{air} 話多但不一定做、{fire} 做了但不解釋。{air} 會覺得 {fire} 太粗，{fire} 會覺得 {air} 太虛。',
    last: '{air} 把話說完後要做一件事；{fire} 做事前願意解釋三句。這樣你們的默契才會活下來。'
  },
  'fire-water': {
    attract: '{fire} 被 {water} 的深情、敏感、溫柔吸引；{water} 被 {fire} 的勇氣、直接、會保護人吸引。這是經典的「硬殼對軟心」組合。',
    fight: '{fire} 的直接會戳傷 {water}；{water} 的情緒會冷卻 {fire}。{fire} 覺得「你怎麼又哭了」；{water} 覺得「你根本不在乎我」。',
    last: '{fire} 學會把話慢一拍、帶點溫度再說；{water} 學會不把每次激動都解讀為「他不愛我」。這組很甜但非常需要用心。'
  },
  'earth-earth': {
    attract: '{A} 跟 {B} 都愛穩定、愛美食、愛好生活。一起看房、一起存錢、一起規劃 10 年後 — 這些事你們做起來超流暢。',
    fight: '{A} 跟 {B} 都固執、都不愛改變。一個決定卡住可以 3 週沒進展。生活會穩但也容易無聊。',
    last: '{A} 跟 {B} 每個月強制「打破節奏」一次 — 旅行、新餐廳、冒險活動。你們最大的敵人是「慣性」。'
  },
  'earth-air': {
    attract: '{earth} 穩住 {air} 飄動的心；{air} 把 {earth} 悶著的生活打開窗。你們是「我有結構、你有靈感」的組合。',
    fight: '{earth} 覺得 {air} 想太多、不落地；{air} 覺得 {earth} 無聊、不懂新事物。長期下去會變成「一個管理員 + 一個藝術家」的分工，但也可能互看不順眼。',
    last: '{earth} 給 {air}「想飛的空間」；{air} 給 {earth}「回到地面的安全感」。你們不要改變對方，只要學會欣賞。'
  },
  'earth-water': {
    attract: '這是極經典的「滋養型組合」。{earth} 的穩定讓 {water} 情緒有地方安放；{water} 的柔軟讓 {earth} 的硬殼軟化。你們很容易一起建立家。',
    fight: '{earth} 講實話但不解釋情緒；{water} 情緒到了但不解釋事實。經常是「你為什麼生氣 / 我哪有生氣」的無限循環。',
    last: '{earth} 學會問「你需要我現在怎麼陪你」；{water} 學會在情緒到之前講需求。你們有潛力走到很老。'
  },
  'air-air': {
    attract: '{A} 跟 {B} 聊不完、想不完、一起做專案。你們之間的默契像「兩個大腦接上同一條線」。',
    fight: '{A} 跟 {B} 都想但都不想做。常陷入「我們上次討論的那個是不是要動了？」的無限循環。感情也可能從激情變成「像朋友」。',
    last: '{A} 跟 {B} 強制一個「做的人」角色輪替 — 這個月我執行、下個月你執行。你們的關係需要落地，不然會一直漂在概念層。'
  },
  'air-water': {
    attract: '{air} 的聰明吸引 {water}、{water} 的深情融化 {air}。你們的對話會有「我終於遇到一個懂的人」的感覺。',
    fight: '{air} 用邏輯分析情緒、{water} 聽了只想哭。{air} 覺得 {water} 太感性、{water} 覺得 {air} 太冷。',
    last: '{air} 接情緒時不要急著「幫解決」；{water} 情緒過後主動給 {air} 一個邏輯解釋。這是你們能否長久的關鍵。'
  },
  'water-water': {
    attract: '{A} 跟 {B} 之間的共感能力是非水象的人永遠不懂的。一個眼神、一個嘆氣都在溝通。很容易進入「像靈魂伴侶」的狀態。',
    fight: '{A} 跟 {B} 都記仇、都愛冷戰、都不會先開口。一次爭執可以互相不說話 3 天，沒人知道誰先錯。',
    last: '{A} 跟 {B} 訂一個「不超過 24 小時的冷戰限制」— 無論誰對誰錯，24 小時後必須有人先講話。這組需要規則，不然會內耗到腐爛。'
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

// 把敘事中的占位符換成實際名字
function substituteNames(text, { nameA, nameB, elementA, elementB }) {
  let out = text
  // 同元素配對：用 {A} / {B}
  if (elementA === elementB) {
    out = out.replace(/\{A\}/g, nameA).replace(/\{B\}/g, nameB)
    return out
  }
  // 跨元素配對：把 {element} 換成對應方的名字
  out = out
    .replace(new RegExp(`\\{${elementA}\\}`, 'g'), nameA)
    .replace(new RegExp(`\\{${elementB}\\}`, 'g'), nameB)
  // 若還有殘留的 {fire}/{water}/{earth}/{air}（不在此配對裡的），用元素中文
  const elementLabel = { fire: '火象方', earth: '土象方', air: '風象方', water: '水象方' }
  out = out.replace(/\{(fire|earth|air|water)\}/g, (_, k) => elementLabel[k])
  return out
}

// 主要函數：根據兩人命盤生成三段敘事
export function buildCompatibilityNarrative(result, chartA, chartB, nameA = '你', nameB = 'TA') {
  const rashiA = result.moonA.rashi
  const rashiB = result.moonB.rashi
  const elementA = ELEMENT_OF[rashiA]
  const elementB = ELEMENT_OF[rashiB]
  const key = elementKey(rashiA, rashiB)
  const rawDynamics = ELEMENT_DYNAMICS[key] || ELEMENT_DYNAMICS['fire-fire']

  const ctx = { nameA, nameB, elementA, elementB }
  const dynamics = {
    attract: substituteNames(rawDynamics.attract, ctx),
    fight: substituteNames(rawDynamics.fight, ctx),
    last: substituteNames(rawDynamics.last, ctx)
  }

  return {
    ...dynamics,
    extras: extraInsights(result, chartA, chartB, nameA, nameB)
  }
}

// 依 Kuta 特徵挑最值得講的點
function extraInsights(result, chartA, chartB, nameA, nameB) {
  const extras = []
  const kutaById = result.kutas.reduce((m, k) => {
    m[k.id] = k
    return m
  }, {})

  if (kutaById.nadi && kutaById.nadi.score === 0) {
    extras.push({
      type: 'dosha',
      title: 'Nadi Dosha · 能量重疊警示',
      body: `${nameA} 跟 ${nameB} 屬於同一 Nadi（能量脈絡）— 傳統吠陀把這視為不利健康與子嗣的配置。現代解讀：你們太像了，容易一起累、同時低潮。需要刻意讓彼此的節奏錯開。`
    })
  }

  if (kutaById.bhakoot && kutaById.bhakoot.score === 0) {
    extras.push({
      type: 'dosha',
      title: 'Bhakoot Dosha · 情感軌道不同',
      body: `${nameA} 跟 ${nameB} 的月亮距離落在「情感不易流動」的位置。現代解讀：你們對「什麼是愛」的定義不同 — 一方給的那種愛，對方感受不到；要明確說「我希望被這樣對待」。`
    })
  }

  if (kutaById.gana && kutaById.gana.score === 0) {
    extras.push({
      type: 'dosha',
      title: 'Gana Mismatch · 天性不同國',
      body: '一人偏「天神型」（追求純粹與理想），一人偏「羅剎型」（追求強度與本能）。衝突點是「你怎麼這麼極端 / 你怎麼這麼理想主義」。'
    })
  }

  if (kutaById.graha_maitri && kutaById.graha_maitri.score >= 4) {
    extras.push({
      type: 'strength',
      title: 'Graha Maitri · 心智高度默契',
      body: `${nameA} 跟 ${nameB} 的月亮主星屬於彼此的「友星」— 代表你們處理情緒、看待世界的底層方式相似。這是長期關係最珍貴的資產，別小看。`
    })
  }

  if (kutaById.yoni && kutaById.yoni.score === 4) {
    extras.push({
      type: 'strength',
      title: 'Yoni · 肢體強烈吸引',
      body: `${nameA} 跟 ${nameB} 的 Yoni 動物相同 — 身體與感官層面非常相容。床上的默契與日常肢體親密度自然地高。`
    })
  } else if (kutaById.yoni && kutaById.yoni.score === 0) {
    extras.push({
      type: 'dosha',
      title: 'Yoni · 肢體吸引微妙',
      body: `${nameA} 跟 ${nameB} 的 Yoni 動物是傳統視為「天敵」的組合。代表感官需求差距較大，但這個落差可以用溝通補起來 — 直接問「你需要什麼」比猜更快。`
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
