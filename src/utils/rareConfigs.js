// 稀有配置偵測器 — 找出這張命盤「跟別人不一樣」的特殊組合
// 這些是 Signal > Coverage 的核心素材 — 因為稀有所以有渲染力
//
// 輸出格式與 yogas 相容：{ id, name, type, rarity, signature, meaning, prediction }

const RASHI_ELEMENTS = {
  Mesha: 'fire', Simha: 'fire', Dhanu: 'fire',
  Vrishabha: 'earth', Kanya: 'earth', Makara: 'earth',
  Mithuna: 'air', Tula: 'air', Kumbha: 'air',
  Karka: 'water', Vrishchika: 'water', Meena: 'water'
}

const RASHI_MODALITIES = {
  Mesha: 'cardinal', Karka: 'cardinal', Tula: 'cardinal', Makara: 'cardinal',
  Vrishabha: 'fixed', Simha: 'fixed', Vrishchika: 'fixed', Kumbha: 'fixed',
  Mithuna: 'mutable', Kanya: 'mutable', Dhanu: 'mutable', Meena: 'mutable'
}

export function detectRareConfigs(chart) {
  const configs = []
  const g = chart.sidereal.grahas

  // ═════ 1. Sun-Moon 同 Nakshatra（< 0.5% 人口）═════
  if (g.Sun.nakshatra.name === g.Moon.nakshatra.name) {
    configs.push({
      id: 'luminaries-same-nakshatra',
      name: '雙光合宿',
      type: 'special',
      rarity: 'very_rare',
      signature: `太陽與月亮同落於 ${g.Sun.nakshatra.name}（室宿指標）`,
      meaning: '身心合一的罕見配置（全人口 < 0.5%）',
      prediction: `你的身（Sun）與心（Moon）指向同一個主題 — ${g.Sun.nakshatra.name}。別人在「理性想一套、情緒想另一套」時感到撕裂，你反而是「整個人朝同一方向燒」。這讓你在那個方向上特別有力量，但也讓你失去「內在調節」的機制，容易走火入魔。`
    })
  }

  // ═════ 2. 新月出生（Sun-Moon 近合，< 12°）═════
  const sunMoonDiff = Math.min(
    Math.abs(g.Sun.longitude - g.Moon.longitude),
    360 - Math.abs(g.Sun.longitude - g.Moon.longitude)
  )
  if (sunMoonDiff < 12) {
    configs.push({
      id: 'born-on-amavasya',
      name: '新月出生（Amavasya）',
      type: 'special',
      rarity: 'uncommon',
      signature: `太陽與月亮相距 ${sunMoonDiff.toFixed(1)}° — 出生時幾乎無月光`,
      meaning: '帶著祖先業力與「重啟」能量的誕生',
      prediction: '你生於新月時刻（每月 2-3 天的窗口）。這意味著你攜帶強烈的「家族轉化」任務 — 某個祖先留下的未完成議題會透過你處理。你對「清空重來」有本能理解，人生會有幾次「整個推翻」的大翻轉。'
    })
  }

  // ═════ 3. 滿月出生（Sun-Moon 接近 180°）═════
  if (sunMoonDiff > 168) {
    configs.push({
      id: 'born-on-purnima',
      name: '滿月出生（Purnima）',
      type: 'special',
      rarity: 'uncommon',
      signature: `太陽與月亮相距 ${sunMoonDiff.toFixed(1)}° — 出生時月光最強`,
      meaning: '情感豐盛、具公眾吸引力的誕生',
      prediction: '你生於滿月時刻（每月 2-3 天的窗口）。這意味著你情感充盈、具有群眾吸引力、能自然地被注意到。但「內外平衡」是你的終身功課 — 當外界太滿時你會內耗，當內在太滿時你會迫切想表達。'
    })
  }

  // ═════ 4. Stellium（3+ 行星同宮）═════
  const houseCounts = {}
  for (const p of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']) {
    const h = g[p].house
    houseCounts[h] = (houseCounts[h] || 0) + 1
  }
  for (const [house, count] of Object.entries(houseCounts)) {
    if (count >= 3) {
      configs.push({
        id: `stellium-${house}`,
        name: `第 ${house} 宮 Stellium（三星聚`,
        type: 'special',
        rarity: 'uncommon',
        signature: `${count} 顆行星同聚於第 ${house} 宮`,
        meaning: '人生能量高度集中於一個生活領域',
        prediction: houseStelliumReading(parseInt(house), count)
      })
    }
  }

  // ═════ 5. Sun-Moon 同星座（非同 Nakshatra）═════
  if (
    g.Sun.rashi.name === g.Moon.rashi.name &&
    g.Sun.nakshatra.name !== g.Moon.nakshatra.name
  ) {
    configs.push({
      id: 'luminaries-same-rashi',
      name: '雙光同宮',
      type: 'special',
      rarity: 'uncommon',
      signature: `太陽與月亮同在 ${g.Sun.rashi.chinese}（但不同 Nakshatra）`,
      meaning: '身心朝同一方向、但細節節奏不同',
      prediction: `你的核心驅動力跟情感方向大致對齊 — 你在「${g.Sun.rashi.chinese}」這個主題上走得很深。優勢是動機單一、不糾結；弱點是你看世界的角度比較窄，容易忽略不同頻率的人。`
    })
  }

  // ═════ 6. 月亮 Vargottama（月亮在本宮 + 第九分盤也在本宮）═════
  //   簡化偵測：僅檢查月亮是否落在「自己／旺宮」而穩定
  if (g.Moon.rashi.name === 'Karka' || g.Moon.rashi.name === 'Vrishabha') {
    configs.push({
      id: 'moon-strong',
      name: '月亮旺位',
      type: 'benefic',
      rarity: 'common',
      signature: `月亮在 ${g.Moon.rashi.chinese}（${g.Moon.rashi.name === 'Karka' ? '本宮' : '旺宮'}）`,
      meaning: '強大的心理穩定度與情感能量',
      prediction: '你的情緒狀態比同齡人穩定。遇到困難時，你內在有一個「我會沒事」的聲音。這種穩定是你的武器 — 你會變成團體裡的「不會崩的那個」。'
    })
  }

  // ═════ 7. 月亮嚴重弱化（月亮在 Vrishchika）═════
  if (g.Moon.rashi.name === 'Vrishchika') {
    configs.push({
      id: 'moon-debilitated',
      name: '月亮落陷',
      type: 'challenging',
      rarity: 'uncommon',
      signature: '月亮落在 Vrishchika（天蠍，弱宮）',
      meaning: '情緒深度強但穩定度低',
      prediction: '你的情緒比一般人更濃烈、更深、更記仇。表面可能看不出來，但內在戲劇性很強。這個配置的人常有「成癮傾向」— 可能是工作狂、可能是某種情感依附 — 這是你要終身警覺的暗面。'
    })
  }

  // ═════ 8. 土星 2/7 宮（晚婚／晚財）═════
  if (g.Saturn.house === 7) {
    configs.push({
      id: 'saturn-7th',
      name: '土星在 7 宮',
      type: 'challenging',
      rarity: 'uncommon',
      signature: '土星坐鎮配偶／合夥宮',
      meaning: '婚姻延遲或沉重責任感',
      prediction: '你的婚姻會比同齡人晚到 — 不是你不好，是你的命盤設定「時間會幫你篩對的人」。草率婚姻對你是災難，晚婚或大年齡差伴侶反而穩。合夥生意也要簽清楚。'
    })
  }

  // ═════ 9. Rahu-Ketu 交軸問題（Rahu 在 1/7 宮）═════
  if (g.Rahu.house === 1 || g.Rahu.house === 7) {
    configs.push({
      id: 'rahu-axis-identity',
      name: `Rahu 在第 ${g.Rahu.house} 宮（身份／關係軸線）`,
      type: 'special',
      rarity: 'uncommon',
      signature: `Rahu 落在${g.Rahu.house === 1 ? '命宮' : '配偶宮'}`,
      meaning: '終身的身份認同／關係議題',
      prediction:
        g.Rahu.house === 1
          ? '你這輩子會反覆問「我到底是誰？」— 會換跑道、換形象、換城市、換朋友圈。這不是不安定，是你靈魂本來就要「重塑自己」很多次。'
          : '你的親密關係會有一種「戲劇感」— 跨國戀、大年齡差、非典型組合、或突然的分合。這不是運氣問題，是命盤的學習課題 — 透過親密關係學會「認識真正的自己」。'
    })
  }

  // ═════ 10. 元素嚴重失衡（只在一個元素）═════
  const elementCounts = { fire: 0, earth: 0, air: 0, water: 0 }
  for (const p of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']) {
    const el = RASHI_ELEMENTS[g[p].rashi.name]
    if (el) elementCounts[el]++
  }
  const maxElement = Object.entries(elementCounts).sort((a, b) => b[1] - a[1])[0]
  if (maxElement[1] >= 5) {
    const elementNames = { fire: '火', earth: '土', air: '風', water: '水' }
    configs.push({
      id: `element-dominant-${maxElement[0]}`,
      name: `${elementNames[maxElement[0]]}元素主導（${maxElement[1]}/7 行星）`,
      type: 'special',
      rarity: 'uncommon',
      signature: `7 顆經典行星中 ${maxElement[1]} 顆都落在${elementNames[maxElement[0]]}元素星座`,
      meaning: '極端單一元素命格',
      prediction: elementDominantReading(maxElement[0], maxElement[1])
    })
  }

  // ═════ 11. Lagna Lord 在 12 宮（自我隱藏）═════
  const lagnaLord = {
    Mesha: 'Mars', Vrishabha: 'Venus', Mithuna: 'Mercury', Karka: 'Moon',
    Simha: 'Sun', Kanya: 'Mercury', Tula: 'Venus', Vrishchika: 'Mars',
    Dhanu: 'Jupiter', Makara: 'Saturn', Kumbha: 'Saturn', Meena: 'Jupiter'
  }[chart.sidereal.ascendant.rashi.name]
  if (lagnaLord && g[lagnaLord].house === 12) {
    configs.push({
      id: 'lagna-lord-12',
      name: '命主星落 12 宮',
      type: 'special',
      rarity: 'rare',
      signature: `命主星 ${lagnaLord} 落在第 12 宮（靈修/損失/出國宮）`,
      meaning: '自我能量隱藏、不易被主流看見',
      prediction: '你是那種「在主流舞台上不會特別亮，但在某個邊緣圈子裡閃光」的人。出國、靈修、深夜工作、幕後貢獻者、非典型生活路線都會是你的家。不必勉強自己當主角。'
    })
  }

  // ═════ 12. Kendra 全空（4 個角宮都沒行星）═════
  const kendraFilled = [1, 4, 7, 10].filter((h) =>
    ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].some((p) => g[p].house === h)
  )
  if (kendraFilled.length === 0) {
    configs.push({
      id: 'empty-kendras',
      name: '角宮皆空',
      type: 'special',
      rarity: 'rare',
      signature: '1/4/7/10 四個角宮都沒有古典行星',
      meaning: '內在動能強、但缺乏「世間出招」的結構',
      prediction: '你有很多想法和感受，但要「讓這些東西出現在現實世界」對你是個功課。你常在「我知道該做什麼但就是開不了手」的狀態。這不是懶，是命盤設定 — 你需要外在的 deadline / 夥伴 / 結構才能把東西生出來。'
    })
  }

  return configs
}

function houseStelliumReading(house, count) {
  const themes = {
    1: `你整個人生被「自我塑造」這件事主導。${count} 顆行星聚集在命宮 — 外表、個性、氣場都會非常鮮明，但你也會耗很多能量在「我是誰」這個問題上。`,
    2: `你的人生重心在「累積」— 金錢、家庭、語言、價值觀。${count} 顆行星聚集在 2 宮，但也要小心為錢或為家族付出過多。`,
    4: `家、母親、內心世界是你的軸心。${count} 顆行星聚集在 4 宮，你比一般人更受家庭影響 — 無論是正面還是創傷。`,
    5: `創造、子女、戀愛是你的舞台。${count} 顆行星聚集在 5 宮，意味著浪漫、創意、教學會主導你的人生。`,
    6: `你人生有很多「不得不克服」的東西 — 疾病、競爭、債務、日常壓力。${count} 顆行星聚集在 6 宮，但這也讓你成為打敗對手的高手。`,
    7: `配偶與合夥關係是你人生的核心戲碼。${count} 顆行星聚集在 7 宮 — 關係會帶你最深的學習，也是最深的痛。`,
    8: `祕密、轉化、他人資源、深度議題主導你的人生。${count} 顆行星聚集在 8 宮，你會在別人避開的地方找到力量。`,
    10: `事業與公眾身份是你人生最強力量。${count} 顆行星聚集在 10 宮 — 你會被看見、被記住，但也活在某種公眾壓力下。`,
    11: `朋友、收入、夢想是你的主場。${count} 顆行星聚集在 11 宮 — 你的人脈與網絡就是你的財富。`,
    12: `隱居、出國、靈修、損失是你人生的主題。${count} 顆行星聚集在 12 宮 — 你比同齡人更早接觸「看不見的世界」。`
  }
  return themes[house] || `${count} 顆行星聚集在第 ${house} 宮，這個生活領域是你的命運主軸。`
}

function elementDominantReading(element, count) {
  const readings = {
    fire: `火元素主導（${count} 星）：你的人生主旋律是「行動、熱情、開創」。你會比一般人更早出招、更常衝。缺點：燒光會累、太急躁。要學會慢下來。`,
    earth: `土元素主導（${count} 星）：你的人生主旋律是「累積、務實、穩定」。你會比一般人更能長期耕耘、把東西做實在。缺點：抗拒變化、容易僵化。`,
    air: `風元素主導（${count} 星）：你的人生主旋律是「思考、溝通、變化」。你比一般人更能在概念和資訊間穿梭。缺點：焦慮、浮動、不落地。`,
    water: `水元素主導（${count} 星）：你的人生主旋律是「情感、直覺、連結」。你比一般人更能感受、共鳴、照顧人。缺點：容易被情緒淹沒、界線模糊。`
  }
  return readings[element]
}
