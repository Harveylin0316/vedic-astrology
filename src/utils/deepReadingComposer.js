// 深度解讀組合器 — Signal > Coverage 原則
// 把所有偵測結果（yogas, rare configs, padas, planet-in-house）評分
// 挑最有 signal 的幾個，組成 Raman 風格的五段式輸出

import { padaReadings, getPadaReading } from '../data/padaReadings.js'
import { grahaInHouse } from '../data/grahaInHouse.js'
import { getLagnaMoonCombo } from '../data/lagnaMoonCombos.js'
import { lagnaReadings, moonReadings, sunReadings, dashaReadings, getDashaEventsForAge, luckySystem, compatibility } from '../data/interpretations.js'
import { detectYogas } from './yogaDetector.js'
import { detectRareConfigs } from './rareConfigs.js'
import { renderSignatureSentences } from './sentenceTemplates.js'
import { computeVimshottariDasha, getCurrentDasha, computeAntardashas, getCurrentAntardasha, formatDegrees } from './vedicCalc.js'

// ═════ Signal 評分權重 ═════
const RARITY_SCORE = {
  very_rare: 10,  // < 0.5% 人口
  rare: 7,
  uncommon: 4,
  common: 2
}

// ═════ 主要組合函數 ═════
// 輸入：完整 chart + userContext{age,gender,situation,question}
// 輸出：Raman 格式的完整 markdown 解讀
export function composeDeepReading(chart, userContext) {
  const { age, gender, situation = '', question = '' } = userContext || {}

  // 1. 取得 Tropical 為主的命盤關鍵位置（用戶熟悉）
  const tropLagna = chart.tropical.ascendant.rashi.name
  const tropMoon = chart.tropical.moon.rashi.name
  const tropSun = chart.tropical.sun.rashi.name
  const sidLagna = chart.sidereal.ascendant.rashi.name
  const sidMoon = chart.sidereal.moon.rashi.name
  const sidMoonNakshatra = chart.sidereal.moon.nakshatra

  // 2. 偵測所有 Yogas + Rare Configs
  const yogas = detectYogas(chart)
  const rareConfigs = detectRareConfigs(chart)
  const allFindings = [...yogas, ...rareConfigs]

  // 3. Signal 評分：稀有度 + 生活影響
  const scored = allFindings.map((f) => ({
    ...f,
    score: RARITY_SCORE[f.rarity] || 1
  })).sort((a, b) => b.score - a.score)

  // 4. 取 top 3 做「3 命中級斷言」素材
  const topFindings = scored.slice(0, 3)

  // 5. 生成 5 種必殺句型
  const signatures = renderSignatureSentences({
    lagnaRashi: tropLagna,
    moonRashi: tropMoon,
    sunRashi: tropSun,
    moonNakshatra: sidMoonNakshatra.name
  })

  // 6. 取 Pada 詳細解讀（月宿 Pada 是深度人格）
  const padaReading = getPadaReading(sidMoonNakshatra.name, sidMoonNakshatra.pada)

  // 7. Lagna-Moon 關係
  const combo = getLagnaMoonCombo(tropLagna, tropMoon)

  // 8. 當前大運與小運
  const dashas = computeVimshottariDasha({
    moonSidereal: chart.sidereal.moon.longitude,
    birthYear: chart._input.year,
    birthMonth: chart._input.month,
    birthDay: chart._input.day,
    birthHour: chart._input.hour,
    birthMinute: chart._input.minute
  })
  const currentDasha = getCurrentDasha(dashas)
  const antardashas = currentDasha ? computeAntardashas(currentDasha) : []
  const currentAD = antardashas.length ? getCurrentAntardasha(antardashas) : null

  // ════ 開始組合 markdown ════
  const lines = []

  // === 標頭 ===
  const ageStr = age ? `${age} 歲` : '你'
  const genderStr = gender === 'male' ? '男性' : gender === 'female' ? '女性' : ''
  lines.push(`# 吠陀命盤深度解讀`)
  lines.push(``)
  lines.push(`> **${ageStr}${genderStr ? ' · ' + genderStr : ''}** · 上升 ${chart.tropical.ascendant.rashi.chinese}（西方）/ ${chart.sidereal.ascendant.rashi.chinese}（吠陀）· 月亮 ${sidMoonNakshatra.name} Pada ${sidMoonNakshatra.pada}`)
  lines.push(``)
  if (question) {
    lines.push(`> 你問：「${question}」`)
    lines.push(``)
  }

  // === Part 1：3 個命中級斷言 ===
  lines.push(`## Part 1 · 3 個「這就是在講你」的斷言`)
  lines.push(``)

  // 先用必殺句型（最高命中）
  if (signatures.length > 0) {
    const pick = signatures.slice(0, 3)
    pick.forEach((s, i) => {
      lines.push(`### 斷言 ${i + 1} · ${s.type}`)
      lines.push(`**${s.text}**`)
      lines.push(``)
    })
  }

  // === Part 2：命盤核心矛盾（用稀有配置） ===
  lines.push(`## Part 2 · 你命盤的核心矛盾 / 亮點`)
  lines.push(``)
  if (topFindings.length > 0) {
    topFindings.forEach((f) => {
      const tag =
        f.type === 'benefic'
          ? '[吉]'
          : f.type === 'malefic' || f.type === 'challenging'
            ? '[警]'
            : '[異]'
      lines.push(`### ${tag} ${f.name}`)
      lines.push(`*${f.signature}*`)
      lines.push(``)
      lines.push(`${f.prediction}`)
      lines.push(``)
    })
  } else {
    // 若無特殊配置，用 Lagna-Moon 關係 fallback
    if (combo) {
      lines.push(`### ${combo.theme}`)
      lines.push(combo.body)
      lines.push(``)
    }
  }

  // 月宿 Pada 深度
  if (padaReading) {
    lines.push(`### 你的月宿人格（${sidMoonNakshatra.name} Pada ${sidMoonNakshatra.pada}）`)
    lines.push(`**${padaReading.theme}** — ${padaReading.body}`)
    lines.push(``)
    lines.push(`> 戳心點：${padaReading.hotspot}`)
    lines.push(``)
  }

  // === Part 3：9 大領域現況（年齡對照） ===
  lines.push(`## Part 3 · 你的九大領域現況`)
  lines.push(``)
  const dashboard = buildDashboard(chart, age, currentDasha)
  lines.push('| 領域 | 分數 | 趨勢 | 一句話 |')
  lines.push('|---|---|---|---|')
  dashboard.forEach((row) => {
    lines.push(`| ${row.label} | ${row.score} | ${row.trend} | ${row.note} |`)
  })
  lines.push(``)

  // === Part 4：當前大運 + 小運 ===
  if (currentDasha && age !== undefined) {
    const mdReading = dashaReadings[currentDasha.lord]
    lines.push(`## Part 4 · 你現在的生命階段`)
    lines.push(``)
    lines.push(`**${mdReading.name}（${mdReading.nickname}）· 剩 ${currentDasha.yearsRemaining.toFixed(1)} 年**`)
    lines.push(``)
    lines.push(mdReading.vibe)
    lines.push(``)

    if (currentAD) {
      const adReading = dashaReadings[currentAD.lord]
      lines.push(`**小運（Antardasha）：${currentDasha.lord} / ${currentAD.lord}** · 剩 ${(currentAD.yearsRemaining * 12).toFixed(1)} 個月`)
      lines.push(``)
      lines.push(`這段時間的細節主題：${adReading.theme}。${currentAD.lord === currentDasha.lord ? '主題加深。' : `在「${mdReading.theme.split('·')[0].trim()}」大框架下，${adReading.theme.split('·')[0].trim()}的議題會浮現。`}`)
      lines.push(``)
    }

    // 年齡對應的具體事件
    if (age !== undefined) {
      const events = getDashaEventsForAge(currentDasha.lord, age, age + 0.1)
      if (events.length > 0) {
        lines.push(`**這段期間常見的具體事件**：`)
        lines.push(events.map((e) => `\`${e}\``).join(' · '))
        lines.push(``)
      }
    }

    // 大運建議
    lines.push(`**此階段適合做的事**：${mdReading.goodFor.join('、')}`)
    lines.push(``)
    lines.push(`**需要警覺的事**：${mdReading.watchOut.join('、')}`)
    lines.push(``)
  }

  // === Part 5：未來 6 個月三件事 ===
  lines.push(`## Part 5 · 未來 6 個月的 3 件事`)
  lines.push(``)
  const advice = buildNextSixMonthsAdvice(chart, currentDasha, currentAD, age)
  advice.forEach((item, i) => {
    lines.push(`**${i + 1}. ${item.title}**`)
    lines.push(`> ${item.body}`)
    lines.push(``)
  })

  // === Part 6：金句 ===
  lines.push(`## Part 6 · 你的人生金句`)
  lines.push(``)
  lines.push(`> ${buildPunchline(tropLagna, sidMoonNakshatra.name, sidMoonNakshatra.pada)}`)
  lines.push(``)

  // === Part 7：占星邏輯追溯 ===
  lines.push(`---`)
  lines.push(``)
  lines.push(`## 【占星邏輯追溯】`)
  lines.push(``)
  lines.push(`每個論點對應的技術依據（讓你判斷準度）：`)
  lines.push(``)
  lines.push('| 論點 | 來自配置 | 信心度 |')
  lines.push('|---|---|---|')
  signatures.forEach((s) => {
    lines.push(`| ${s.type} | ${getBasisForSignature(s.type, tropLagna, tropMoon, tropSun, sidMoonNakshatra.name)} | **中高** |`)
  })
  topFindings.forEach((f) => {
    lines.push(`| ${f.name} | ${f.signature} | **${f.rarity === 'very_rare' ? '最高' : f.rarity === 'rare' ? '高' : '中高'}** |`)
  })
  if (currentDasha) {
    lines.push(`| 當前大運 | Vimshottari 機械推算 | **最高** |`)
  }
  lines.push(``)

  return lines.join('\n')
}

// ═════ 輔助：建立 9 大領域儀表板 ═════
function buildDashboard(chart, age, currentDasha) {
  const g = chart.sidereal.grahas
  const rows = [
    { label: '事業', key: 'career' },
    { label: '財富', key: 'wealth' },
    { label: '愛情', key: 'love' },
    { label: '婚姻', key: 'marriage' },
    { label: '健康', key: 'health' },
    { label: '家人', key: 'family' },
    { label: '學業', key: 'study' },
    { label: '人際', key: 'social' },
    { label: '靈性', key: 'spiritual' }
  ]

  const score = (n) => '★'.repeat(n) + '☆'.repeat(5 - n)
  const dashaLord = currentDasha?.lord

  return rows.map((r) => {
    let stars = 3
    let trend = '→'
    let note = ''

    switch (r.key) {
      case 'career':
        // 10 宮有行星加分，土星/木星／太陽在強位加分
        stars = 3 + (has10thHousePlanets(g) ? 1 : 0) + (dashaLord === 'Mercury' || dashaLord === 'Sun' || dashaLord === 'Saturn' ? 1 : 0)
        trend = ['Mercury', 'Sun', 'Saturn', 'Jupiter'].includes(dashaLord) ? '↗' : '→'
        note = dashaLord === 'Mercury' ? 'Mercury 大運 = 多元事業起飛' : dashaLord === 'Saturn' ? '土星大運，慢但穩，別急' : '穩定期'
        break
      case 'wealth':
        stars = 3 + (has2ndOr11thHousePlanets(g) ? 1 : 0)
        trend = ['Jupiter', 'Venus', 'Mercury'].includes(dashaLord) ? '↗' : '→'
        note = dashaLord === 'Jupiter' ? '木星大運財運最旺' : dashaLord === 'Venus' ? '金星大運多元收入' : '穩定'
        break
      case 'love':
        stars = 3 + (g.Venus.house === 5 || g.Venus.house === 7 ? 1 : 0)
        trend = dashaLord === 'Venus' ? '↗' : '→'
        note = dashaLord === 'Venus' ? '金星大運，18 個月桃花窗' : '依 Antardasha 變動'
        break
      case 'marriage':
        stars = g.Saturn.house === 7 ? 2 : (g.Venus.house === 7 ? 4 : 3)
        trend = dashaLord === 'Venus' || dashaLord === 'Jupiter' ? '↗' : '→'
        note = g.Saturn.house === 7 ? '土星 7 宮，晚婚或大年齡差' : dashaLord === 'Venus' ? '適合推進承諾' : '看時機'
        break
      case 'health':
        stars = dashaLord === 'Saturn' || dashaLord === 'Mars' ? 2 : 3
        trend = dashaLord === 'Mercury' ? '↘' : dashaLord === 'Jupiter' ? '↗' : '→'
        note = dashaLord === 'Mercury' ? '注意神經系統 / 睡眠' : dashaLord === 'Mars' ? '注意意外 / 發炎' : '注意作息'
        break
      case 'family':
        stars = (g.Moon.house === 4 || g.Moon.house === 1 ? 4 : 3)
        trend = '→'
        note = '看月亮位置的家庭連結度'
        break
      case 'study':
        stars = dashaLord === 'Mercury' || dashaLord === 'Jupiter' ? 5 : 3
        trend = dashaLord === 'Mercury' || dashaLord === 'Jupiter' ? '↗' : '→'
        note = dashaLord === 'Mercury' ? '一生最會吸收新知的時期' : dashaLord === 'Jupiter' ? '哲學 / 進修 / 出國學習最佳' : '穩定學習'
        break
      case 'social':
        stars = (g.Jupiter.house === 11 || g.Venus.house === 11 ? 5 : 4)
        trend = dashaLord === 'Mercury' || dashaLord === 'Venus' ? '↗' : '→'
        note = dashaLord === 'Mercury' ? '人脈爆炸成長' : '穩定'
        break
      case 'spiritual':
        stars = (g.Ketu.house === 12 || g.Jupiter.house === 9 ? 5 : 4)
        trend = dashaLord === 'Ketu' || dashaLord === 'Jupiter' ? '↗' : '→'
        note = '吠陀命盤天然偏靈性深度'
        break
    }

    stars = Math.max(1, Math.min(5, stars))
    return { ...r, score: score(stars), trend, note }
  })
}

function has10thHousePlanets(grahas) {
  return Object.values(grahas).some((g) => g.house === 10)
}

function has2ndOr11thHousePlanets(grahas) {
  return Object.values(grahas).some((g) => g.house === 2 || g.house === 11)
}

// ═════ 輔助：未來 6 個月建議 ═════
function buildNextSixMonthsAdvice(chart, currentDasha, currentAD, age) {
  const advice = []
  const dashaLord = currentDasha?.lord
  const adLord = currentAD?.lord

  // 建議 1：基於 Antardasha（小運）
  if (adLord) {
    const adMap = {
      Sun: { title: '爭取曝光與權威位', body: '這半年太陽能量開啟 — 升遷、考公職、公開演講、主動求被看見的機會要把握。' },
      Moon: { title: '經營情感與家庭', body: '月亮小運適合結婚、買房、生小孩、和家人和解。你的情感直覺特別準，相信它。' },
      Mars: { title: '創業／衝刺重大目標', body: '火星小運是行動窗。拿大案子、買房、創業、運動/健身都對。但避免跟人硬碰硬。' },
      Mercury: { title: '擴大商業與人脈', body: '水星小運頭腦最快。適合出書、做副業、考試、擴人脈、簽合約。簽前要看清細節。' },
      Jupiter: { title: '出國學習或擴大事業', body: '木星是最吉的小運。進修、出國、擴張事業、做導師、結婚、生子都吉。' },
      Venus: { title: '把創意變現 + 推進感情', body: '金星小運是「愛與美」的窗口。藝術變現、感情推進、買美的東西、提升魅力。' },
      Saturn: { title: '專注長期計畫', body: '土星小運是「累積」期。選一件值得做 3-5 年的事投入，短線不適合。' },
      Rahu: { title: '顛覆舊框架', body: '羅睺小運會出現「戲劇化機會」。要警覺好壞都會放大。科技 / 海外機會先看。' },
      Ketu: { title: '斷捨離與內觀', body: '計都小運適合清舊東西 — 舊關係、舊工作、舊物品。外顯行動減少，內觀增加。' }
    }
    const a = adMap[adLord]
    if (a) advice.push(a)
  }

  // 建議 2：基於大運核心議題
  if (dashaLord) {
    const dashaMap = {
      Sun: { title: '建立你的名聲資產', body: '太陽大運是「你被記住」的階段。把自己的「品牌／作品／專業認證」做實。' },
      Moon: { title: '把家的根基打穩', body: '月亮大運是情感與家庭主軸。買房、結婚、療癒原生家庭議題都在此期。' },
      Mars: { title: '拿下最硬的戰場', body: '火星大運是最好的「攻下一座山」的時期。創業、競爭、大案子衝。' },
      Mercury: { title: '把副業或專業變多元收入', body: '水星大運 17 年是你「腦袋變現」的巔峰。不要只做一份工作。' },
      Jupiter: { title: '進入教導與擴張者角色', body: '木星大運是結果期。開始教別人、寫作、做顧問、擴張你的領域。' },
      Venus: { title: '讓人生更有美感', body: '金星大運 20 年是人生最甜期。多投入愛情、藝術、生活品質。' },
      Saturn: { title: '接受「慢」才能真的穩', body: '土星大運最長（19 年）最磨人。選一件值得的事，做 10 年別換。' },
      Rahu: { title: '承認你要的人生不走尋常路', body: '羅睺大運會戲劇化翻你的人生。接受「非主流」是你的命。' },
      Ketu: { title: '清掉不屬於你的東西', body: '計都大運是「減法」。舊工作、舊關係、舊身份離開是 OK 的。' }
    }
    const a = dashaMap[dashaLord]
    if (a) advice.push(a)
  }

  // 建議 3：健康 / 自我照顧（依大運）
  const healthAdvice = {
    Sun: { title: '警覺心臟與視力', body: '太陽大運注意眼睛、心臟、血壓。不要熬夜硬撐。' },
    Moon: { title: '照顧胃與情緒', body: '月亮大運情緒直接影響身體。胃、失眠、免疫力要定期維護。' },
    Mars: { title: '避免意外與發炎', body: '火星大運意外機率高。開車小心、運動要暖身、牙齒不要拖。' },
    Mercury: { title: '保養神經系統', body: '水星大運最傷神經。失眠、肩頸、呼吸道是高危。每週規律運動 3 次。' },
    Jupiter: { title: '控制體重與糖分', body: '木星大運最容易變胖、糖尿病風險上升。飲食要節制。' },
    Venus: { title: '注意泌尿與生殖', body: '金星大運喉嚨、泌尿、生殖系統要檢查。別過度享樂。' },
    Saturn: { title: '保護骨骼與關節', body: '土星大運老化感強。骨骼、關節、牙齒要提早保養。' },
    Rahu: { title: '避免成癮傾向', body: '羅睺大運最易沉迷（手機、酒、甜食、工作狂）。設限很重要。' },
    Ketu: { title: '身心信號要留意', body: '計都大運身體訊號可能奇怪。信直覺，有異狀就檢查。' }
  }
  const healthA = healthAdvice[dashaLord]
  if (healthA) advice.push(healthA)

  // 保底：若沒有東西，塞個通用建議
  while (advice.length < 3) {
    advice.push({
      title: '記錄你的直覺',
      body: '每週花 20 分鐘寫下你當週的感受、疑惑、小事件。3 個月後回看會看到你的模式。'
    })
  }

  return advice.slice(0, 3)
}

// ═════ 輔助：生成金句 ═════
function buildPunchline(tropLagna, moonNakshatra, pada) {
  const lagnaTraits = {
    Mesha: '衝', Vrishabha: '穩', Mithuna: '快', Karka: '柔',
    Simha: '亮', Kanya: '細', Tula: '和', Vrishchika: '深',
    Dhanu: '遠', Makara: '硬', Kumbha: '異', Meena: '化'
  }
  const nakshatraFlavor = {
    Ashwini: '火', Bharani: '重', Krittika: '利', Rohini: '美',
    Mrigashira: '尋', Ardra: '雨', Punarvasu: '歸', Pushya: '滋',
    Ashlesha: '蛇', Magha: '王', PurvaPhalguni: '享', UttaraPhalguni: '信',
    Hasta: '巧', Chitra: '光', Swati: '風', Vishakha: '攻',
    Anuradha: '黏', Jyeshtha: '老', Mula: '拔', PurvaAshadha: '戰',
    UttaraAshadha: '勝', Shravana: '聽', Dhanishta: '節', Shatabhisha: '祕',
    PurvaBhadrapada: '燒', UttaraBhadrapada: '深', Revati: '守'
  }
  const l = lagnaTraits[tropLagna] || '你'
  const nakKey = moonNakshatra.replace(/\s+/g, '')
  const n = nakshatraFlavor[nakKey] || '心'

  return `**你是用「${l}」的外殼，裝著「${n}」的芯。\n哪天這兩個東西和解了，你的人生就會翻頁。**`
}

// ═════ 輔助：句型依據追溯 ═════
function getBasisForSignature(type, lagna, moon, sun, nakshatra) {
  const map = {
    '表象 vs 真相': `Lagna ${lagna} (外在) vs Moon ${moon} (內在)`,
    '循環慣性': `Moon 落於 ${nakshatra} 星宿`,
    '延遲反應': `Moon ${moon} 的情緒處理模式`,
    '相反吸引': `Lagna ${lagna} 的理想型 vs 真正吸引力`,
    '童年傷痕': `Sun ${sun} 父親／權威議題`
  }
  return map[type] || '—'
}
