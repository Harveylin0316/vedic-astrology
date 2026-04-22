// Sub-category Detector — 從 analyzeVedicCareer 的輸出再細分 business/politics 子類別
//
// 這裡的邏輯是把 scripts/validateCareers.mjs 裡累積 4 輪的 sub-category rules
// 抽出成可以 validator + user UI 共用的單一函式。
//
// 來源準確率（基於 data/celebrityDataset.json 回測）：
//   - business 子集：91.9%
//   - politics 子集：95.1%
//   - 全 dataset：90.1%
//
// 用法：
//   import { detectCareerSubCategory } from './careerSubCategoryDetector.js'
//   const result = detectCareerSubCategory(analysis)
//   // result = {
//   //   predicted: Set<string>,        // 所有被 trigger 的 sub-category（含粗類 politics/government）
//   //   primary: string | null,        // UI 顯示的首選 sub-category key
//   //   confidence: 'high' | 'medium' | 'low' | null,
//   //   reasoning: string[],           // Detector trigger reasons（用來組「為什麼我知道你是這型」）
//   //   alternates: string[]           // 次選 sub-category（UI 不一定秀）
//   // }
//
// confidence 規則：
//   - high：至少兩條獨立 trigger 命中同一個 sub-category（或一條 trigger + karmesh/karaka 雙重支持）
//   - medium：只有一條 trigger
//   - low：只是粗 family（politics / government）沒指向特定子類
//
// 樣本太少的 sub-category（politics-diplomat n=3、government-judicial n=1）
// 在 validator 準確率看起來高但統計不可信 — 本模組會標記為 UI 不輸出。

const UI_SUPPRESSED_SUBCATS = new Set([
  // Round 4 validator 裡樣本量 < 5 的 sub-cat，不對 UI 輸出
  'politics-diplomat',
  'government-judicial',
  // Round 5：樣本量 < 5 的 arts sub-cat，不對 UI 輸出
  'arts-creator-producer',       // N=2
  'arts-visual-photographer'     // N=3
])

// Sub-cat 粗分，給 UI 一個 fallback（某些盤只命中粗類但沒命中細類）
const COARSE_SUBCATS = new Set(['politics', 'government'])

const BUSINESS_SUBCATS = [
  'business-tycoon-founder',
  'business-tycoon-heir',
  'business-ceo-hired',
  'business-investor',
  'business-finance',
  'business-retail',
  'business-media',
  'business-realestate',
  'business-industrial',
  'business-tech-founder'
]

const POLITICS_SUBCATS = [
  'politics-head-state',
  'politics-head-gov',
  'politics-revolutionary',
  'politics-military',
  'politics-authoritarian',
  'politics-diplomat',
  'government-judicial'
]

// Round 5 — arts sub-categories
const ARTS_SUBCATS = [
  'arts-performer-film-actor',
  'arts-performer-musician-singer',
  'arts-performer-musician-instrument',
  'arts-performer-dancer',
  'arts-performer-comedian',
  'arts-creator-writer',
  'arts-creator-director',
  'arts-creator-producer',
  'arts-visual-painter',
  'arts-visual-photographer'
]

const ALL_DETECTABLE = [...BUSINESS_SUBCATS, ...POLITICS_SUBCATS, ...ARTS_SUBCATS]

// ═════════════════════════════════════════════════════════════════
// Context-gated yoga hints — 決定整體是否有政治傾向
// （來自 validateCareers.mjs 的 contextGatedYogaHints）
// ═════════════════════════════════════════════════════════════════
export function contextGatedYogaHints(analysis) {
  const set = new Set()
  const yogas = new Set((analysis?.activeCareerYogas || []).map((y) => y.id))
  const karmeshP = analysis?.karmesh?.planet
  const karmeshH = analysis?.karmesh?.house
  const lagnaLordP = analysis?.lagnaLord?.planet
  const lagnaLordH = analysis?.lagnaLord?.house
  const sigs = analysis?.significators || []
  const sunSig = sigs.find((s) => s.planet === 'Sun')
  const jupSig = sigs.find((s) => s.planet === 'Jupiter')
  const satSig = sigs.find((s) => s.planet === 'Saturn')
  const hasRaj = yogas.has('raj-yoga')
  const hasGaja = yogas.has('gaja-kesari')
  const hasDhana = yogas.has('dhana-yoga')

  const karmeshInKendra = [1, 4, 7, 10].includes(karmeshH)
  const karmeshInTrikona = [1, 5, 9].includes(karmeshH)
  const sunHouse = sunSig?.graha?.house
  const sunPublic = sunHouse && [1, 7, 10].includes(sunHouse)
  const sunInKendra = sunHouse && [1, 4, 7, 10].includes(sunHouse)
  const sunStrong = sunSig && ['own', 'exalted', 'moolatrikona', 'friendly'].includes(sunSig.dignity)
  const jupStrong = jupSig && ['own', 'exalted', 'moolatrikona'].includes(jupSig.dignity)
  const jupPublic = jupSig?.graha?.house && [1, 4, 7, 9, 10].includes(jupSig.graha.house)
  const llPublic = [1, 10].includes(lagnaLordH)
  const moonH = analysis?.significators?.find((s) => s.planet === 'Moon')?.graha?.house
  const moonPublic = moonH && [1, 4, 7, 10].includes(moonH)
  const marsH = analysis?.significators?.find((s) => s.planet === 'Mars')?.graha?.house

  if ((hasRaj && hasGaja) && (sunPublic || moonPublic)) {
    set.add('politics'); set.add('government')
  }
  if ((hasRaj && hasGaja) && [1, 9, 10, 11].includes(karmeshH)) {
    set.add('politics'); set.add('government')
  }
  if (hasGaja && yogas.has('budha-aditya') && [1, 9, 10, 11].includes(karmeshH)) {
    set.add('politics'); set.add('government')
  }
  if ((hasRaj && hasGaja) && [6, 8, 12].includes(karmeshH)) {
    set.add('politics'); set.add('government')
  }
  if (hasGaja && yogas.has('vipreet-raj')) {
    set.add('politics'); set.add('government')
  }
  if (hasGaja && yogas.has('dhana-yoga') && yogas.has('vipreet-raj')) {
    set.add('politics'); set.add('government')
  }
  const karmeshIsMars = karmeshP === 'Mars'
  if (karmeshIsMars && (hasRaj || hasGaja || yogas.has('budha-aditya')
    || yogas.has('mahapurusha-Mars') || yogas.has('chandra-mangal')
    || yogas.has('mahapurusha-Venus'))) {
    set.add('politics'); set.add('government')
  }
  if (hasGaja && yogas.has('chandra-mangal')) {
    set.add('politics'); set.add('government')
  }
  if (yogas.has('budha-aditya') && yogas.has('vipreet-raj')) {
    set.add('politics'); set.add('government')
  }
  if (yogas.has('mahapurusha-Venus') && yogas.has('budha-aditya')) {
    set.add('politics'); set.add('government')
  }
  if (karmeshP === 'Moon' && yogas.has('vipreet-raj')) {
    set.add('politics'); set.add('government')
  }
  if (karmeshP === 'Saturn' && [6, 8, 12].includes(karmeshH)
    && (hasRaj || hasGaja || yogas.has('budha-aditya') || yogas.has('vipreet-raj'))) {
    set.add('politics'); set.add('government')
  }
  if (lagnaLordP === 'Jupiter' && hasRaj && yogas.has('mahapurusha-Venus')) {
    set.add('politics'); set.add('government')
  }
  const marsLocalH = sigs.find(s => s.planet === 'Mars')?.graha?.house
  const marsLocalD = sigs.find(s => s.planet === 'Mars')?.dignity
  if (lagnaLordP === 'Venus' && [8, 12].includes(lagnaLordH) && hasGaja
    && ['own', 'exalted', 'moolatrikona', 'friendly'].includes(marsLocalD)) {
    set.add('politics'); set.add('government')
  }
  if (hasRaj && sunPublic && (karmeshInKendra || karmeshInTrikona)) {
    set.add('politics'); set.add('government')
  }
  const hasBudha = yogas.has('budha-aditya')
  if ((hasBudha || hasRaj || hasGaja) && jupStrong && jupPublic && karmeshInKendra) {
    set.add('government'); set.add('politics')
  }
  const chandraMangal = yogas.has('chandra-mangal')
  if (chandraMangal && moonH === 10 && marsH === 10) {
    set.add('politics'); set.add('government')
  }
  const hasVipreet = yogas.has('vipreet-raj')
  if (hasVipreet && ['Saturn', 'Jupiter', 'Sun'].includes(karmeshP) && (sunPublic || jupPublic)) {
    set.add('politics'); set.add('government')
  }
  const overrides = analysis?.karakaOverrides || []
  const hasMarsOverride = overrides.some((o) => o.id === 'karaka-override-mars')
  const hasSaturnOverride = overrides.some((o) => o.id === 'karaka-override-saturn')
  if (hasMarsOverride && hasSaturnOverride && ['Mercury', 'Saturn', 'Sun', 'Jupiter'].includes(karmeshP)) {
    set.add('politics'); set.add('government')
  }
  const venusLocal = analysis?.significators?.find((s) => s.planet === 'Venus')
  const venusOwnInTrikona = venusLocal && ['own', 'exalted'].includes(venusLocal.dignity)
    && [1, 5, 9].includes(venusLocal.graha?.house)
  if (hasGaja && venusOwnInTrikona && ['Mercury', 'Venus', 'Sun'].includes(karmeshP)) {
    set.add('politics'); set.add('government')
  }
  if ((hasRaj || hasGaja) && sunStrong && sunInKendra && moonH && [1, 4, 7, 10].includes(moonH)) {
    set.add('politics'); set.add('government')
  }
  if ((hasDhana || hasRaj) && satSig?.graha?.house && [7, 10].includes(satSig.graha.house)
    && ['own', 'exalted', 'moolatrikona'].includes(satSig.dignity)) {
    set.add('business-leader')
  }
  return set
}

// ═════════════════════════════════════════════════════════════════
// 主偵測器 — 跑完一次 business + politics sub-category detector
// 回傳 { predicted: Set<string>, reasonsBySubCat: Map<string, string[]> }
//
// 第二參數 preseededPredicted: Set<string>
//   — validator call path 專用。validator 在 call detector 之前已經用
//     其他來源（karmesh keyword scan、karaka hint、yoga hint）把 set 加上了
//     'politics' / 'government'；要把那個狀態也列入 alreadyPolitics 判定，
//     才能保住原本 Round 4 的 politics sub-cat 觸發率。
//   UI call path 不需要傳 — 只靠 contextGatedYogaHints 作為唯一 gate。
// ═════════════════════════════════════════════════════════════════
function runAllDetectors(analysis, preseededPredicted = null) {
  const predicted = new Set()
  const reasonsBySubCat = new Map()
  const addWithReason = (subCat, reason) => {
    predicted.add(subCat)
    if (!reasonsBySubCat.has(subCat)) reasonsBySubCat.set(subCat, [])
    reasonsBySubCat.get(subCat).push(reason)
  }

  const sigs = analysis?.significators || []
  const marsSig = sigs.find((s) => s.planet === 'Mars')
  const venusSig = sigs.find((s) => s.planet === 'Venus')
  const moonSig = sigs.find((s) => s.planet === 'Moon')
  const sunSig = sigs.find((s) => s.planet === 'Sun')
  const jupSig = sigs.find((s) => s.planet === 'Jupiter')
  const mercSig = sigs.find((s) => s.planet === 'Mercury')
  const satSig = sigs.find((s) => s.planet === 'Saturn')
  const rahuSig = sigs.find((s) => s.planet === 'Rahu')
  const ketuSig = sigs.find((s) => s.planet === 'Ketu')

  const marsHouse = marsSig?.graha?.house
  const marsDignity = marsSig?.dignity
  const venusHouse = venusSig?.graha?.house
  const venusDignity = venusSig?.dignity
  const moonHouse = moonSig?.graha?.house
  const moonDignity = moonSig?.dignity
  const sunHouse = sunSig?.graha?.house
  const sunDignity = sunSig?.dignity
  const jupHouse = jupSig?.graha?.house
  const jupDignity = jupSig?.dignity
  const mercHouse = mercSig?.graha?.house
  const mercDignity = mercSig?.dignity
  const satHouse = satSig?.graha?.house
  const satDignity = satSig?.dignity
  const rahuHouse = rahuSig?.graha?.house
  const ketuHouse = ketuSig?.graha?.house

  const karmeshPlanet = analysis?.karmesh?.planet
  const karmeshHouse = analysis?.karmesh?.house
  const karmeshDignity = analysis?.karmesh?.dignity
  const lagnaLordPlanet = analysis?.lagnaLord?.planet
  const lagnaLordHouse = analysis?.lagnaLord?.house
  const lagnaLordDignity = analysis?.lagnaLord?.dignity
  const d10Lord = analysis?.d10?.tenthLord

  const yogas = new Set((analysis?.activeCareerYogas || []).map((y) => y.id))
  const hasDhana = yogas.has('dhana-yoga')
  const hasRaj = yogas.has('raj-yoga')
  const hasGaja = yogas.has('gaja-kesari')
  const hasBudha = yogas.has('budha-aditya')
  const hasVipreet = yogas.has('vipreet-raj')
  const hasChandraMangal = yogas.has('chandra-mangal')
  const hasLaxmi = yogas.has('laxmi-yoga')
  const hasKubera = yogas.has('kubera-yoga')
  const hasMahabhagya = yogas.has('mahabhagya-yoga')
  const hasBhadra = yogas.has('mahapurusha-Mercury')
  const hasMalavya = yogas.has('mahapurusha-Venus')
  const hasRuchaka = yogas.has('mahapurusha-Mars')

  const strongD = ['own', 'exalted', 'moolatrikona']
  const goodD = ['own', 'exalted', 'moolatrikona', 'friendly']

  // ─── BUSINESS SUB-CATEGORIES ────────────────────────────────

  // 1. business-investor
  {
    const isInvestorByKarmesh = ['Jupiter', 'Mercury'].includes(karmeshPlanet) && [2, 5, 11].includes(karmeshHouse)
    const jupWealthHouse = jupHouse && [2, 5, 11].includes(jupHouse) && goodD.includes(jupDignity)
    const mercWealthHouse = mercHouse && [2, 5, 11].includes(mercHouse) && goodD.includes(mercDignity)
    const venusWealthHouse = venusHouse && [2, 5, 11].includes(venusHouse) && goodD.includes(venusDignity)
    const satInIncome = satHouse === 11 && goodD.includes(satDignity)
    const countInEleventh = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']
      .filter((p) => sigs.find((s) => s.planet === p && s.graha?.house === 11)).length
    const eleventhStellium = countInEleventh >= 2
    const twoElevenBothFilled = ['Jupiter', 'Venus', 'Mercury'].some((p) => sigs.find((s) => s.planet === p && s.graha?.house === 2))
      && ['Jupiter', 'Venus', 'Mercury'].some((p) => sigs.find((s) => s.planet === p && s.graha?.house === 11))

    if (isInvestorByKarmesh && (jupWealthHouse || mercWealthHouse)) {
      addWithReason('business-investor', `${karmeshPlanet} 10 宮主落 ${karmeshHouse} 宮 + Jupiter/Mercury 強旺於財富位`)
      addWithReason('business-finance', `${karmeshPlanet} 10 宮主落 ${karmeshHouse} 宮 + Jupiter/Mercury 強旺於財富位`)
    }
    if (hasDhana && jupWealthHouse && mercWealthHouse) {
      addWithReason('business-investor', 'Dhana Yoga 啟動 + 木水雙強於財位')
      addWithReason('business-finance', 'Dhana Yoga 啟動 + 木水雙強於財位')
    }
    if (satInIncome && goodD.includes(jupDignity)) {
      addWithReason('business-investor', 'Saturn 強旺 11 宮 + Jupiter 強（長期資本累積）')
      predicted.add('business-finance')
    }
    if (lagnaLordHouse === 11) {
      addWithReason('business-investor', '命主星落 11 宮（聚財能手）')
      predicted.add('business-finance')
    }
    if (hasLaxmi || hasKubera || hasMahabhagya) {
      addWithReason('business-investor', '古典財富 yoga 命格（Laxmi / Kubera / Mahabhagya）')
      predicted.add('business-finance')
    }
    if (eleventhStellium) {
      addWithReason('business-investor', `11 宮多星聚集（${countInEleventh} 顆行星）= 強財富訊號`)
      predicted.add('business-finance')
    }
    if (twoElevenBothFilled) {
      addWithReason('business-investor', '2 + 11 宮雙宮都有吉星（擴展 Dhana Yoga）')
      predicted.add('business-finance')
    }
    if (venusWealthHouse && mercWealthHouse && venusHouse === mercHouse) {
      addWithReason('business-investor', 'Mercury + Venus 同宮落 2/5/11 強旺（精算 + 魅力型）')
      predicted.add('business-finance')
    }
    if (hasDhana && ['own', 'exalted'].includes(jupDignity)) {
      addWithReason('business-investor', 'Dhana Yoga + Jupiter own/exalted（長期資本家）')
      predicted.add('business-finance')
    }
  }

  // 2. business-finance
  {
    const karmeshFinance = ['Mercury', 'Jupiter', 'Saturn'].includes(karmeshPlanet) && [2, 5, 8, 11].includes(karmeshHouse)
    const jupMercBoth = goodD.includes(jupDignity) && goodD.includes(mercDignity)
      && ((jupHouse && [2, 5, 11].includes(jupHouse)) || (mercHouse && [2, 5, 11].includes(mercHouse)))
    if (karmeshFinance) {
      addWithReason('business-finance', `10 宮主 ${karmeshPlanet} 落財務宮（${karmeshHouse}）`)
    }
    if (jupMercBoth) {
      addWithReason('business-finance', 'Jupiter + Mercury 都強旺落財務宮')
    }
  }

  // 3. business-retail
  {
    const karmeshRetail = karmeshPlanet === 'Venus' && [2, 5, 10].includes(karmeshHouse)
    const venusStrongL = goodD.includes(venusDignity)
    const moonStrongL = goodD.includes(moonDignity)
    const venusAndMoonRetail = venusStrongL && moonStrongL
      && venusHouse && [2, 5, 10].includes(venusHouse)
    if (karmeshRetail) {
      addWithReason('business-retail', `10 宮主 Venus 落 ${karmeshHouse} 宮（美感消費事業）`)
    }
    if (venusAndMoonRetail) {
      addWithReason('business-retail', 'Venus + Moon 雙強旺於聲量/商品宮')
    }
  }

  // 4. business-realestate
  {
    const marsFourth = marsHouse === 4 && marsDignity !== 'debilitated'
    const karmeshRE = karmeshPlanet === 'Mars' && karmeshHouse === 4
    const saturnFourth = satHouse === 4 && goodD.includes(satDignity)
    const anyInFourth = sigs.some((s) => s.graha?.house === 4 && ['Sun', 'Moon', 'Mars', 'Venus', 'Jupiter', 'Saturn'].includes(s.planet))
    const karmeshWealthHouse = [2, 11].includes(karmeshHouse)
    const moonFourthPropertySignal = moonHouse === 4 && goodD.includes(moonDignity)
    const moonOrVenusFourth = (moonHouse === 4) || (venusHouse === 4)

    if (marsFourth) {
      addWithReason('business-realestate', 'Mars 強旺 4 宮（建設 / 土地）')
    }
    if (karmeshRE) {
      addWithReason('business-realestate', '10 宮主 Mars 落 4 宮（家業 / 地產）')
    }
    if (saturnFourth) {
      addWithReason('business-realestate', 'Saturn 強旺 4 宮（扎根家業）')
    }
    if (anyInFourth && karmeshWealthHouse) {
      addWithReason('business-realestate', `4 宮有行星 + 10 宮主落 ${karmeshHouse} 宮（土地財富）`)
    }
    if (moonFourthPropertySignal) {
      addWithReason('business-realestate', 'Moon 強旺 4 宮（家園財產型）')
    }
    if (moonOrVenusFourth && satHouse && [2, 4, 11].includes(satHouse)) {
      addWithReason('business-realestate', 'Moon/Venus 落 4 宮 + Saturn 落家業宮')
    }
  }

  // 5. business-industrial
  {
    const karmeshInd = karmeshPlanet === 'Saturn' && [6, 10, 11].includes(karmeshHouse)
    const satStrongWorkHouse = satHouse && [6, 10, 11].includes(satHouse) && goodD.includes(satDignity)
    const satAndMars = satStrongWorkHouse && marsDignity !== 'debilitated' && [3, 6, 10, 11].includes(marsHouse)
    const marsStrongUpachaya = marsHouse && [3, 6, 10, 11].includes(marsHouse)
      && goodD.includes(marsDignity)
    const satInUpachaya = satHouse && [3, 6, 10, 11].includes(satHouse)
    const karmeshSixth = karmeshHouse === 6 && marsDignity !== 'debilitated'

    if (karmeshInd) {
      addWithReason('business-industrial', `10 宮主 Saturn 落 ${karmeshHouse} 宮（製造 / 重工）`)
    }
    if (satAndMars) {
      addWithReason('business-industrial', 'Saturn 強旺於工作宮 + Mars 在 upachaya')
    }
    if (marsStrongUpachaya && satInUpachaya) {
      addWithReason('business-industrial', 'Mars + Saturn 雙落 upachaya 宮（製造業大亨模板）')
    }
    if (karmeshSixth) {
      addWithReason('business-industrial', '10 宮主落 6 宮（服務 / 勞動事業）')
    }
  }

  // 6. business-tech-founder
  {
    const rahuTenth = rahuHouse && [3, 6, 10, 11].includes(rahuHouse)
    const mercStrongOnWork = mercHouse && [1, 3, 10, 11].includes(mercHouse) && goodD.includes(mercDignity)
    const karmeshTech = ['Rahu', 'Mercury'].includes(karmeshPlanet) && [1, 3, 5, 10, 11].includes(karmeshHouse)
    const mercIsLagnaLord = lagnaLordPlanet === 'Mercury'
    const rahuTen = rahuHouse === 10 || rahuHouse === 11
    const mercOK = mercHouse && [1, 2, 3, 5, 10, 11].includes(mercHouse)
    const karmeshVenusTech = karmeshPlanet === 'Venus' && [5, 9, 10, 11].includes(karmeshHouse)
    const mercInThird = mercHouse === 3

    if (rahuTenth && mercStrongOnWork) {
      addWithReason('business-tech-founder', 'Rahu 落 upachaya + Mercury 強旺於工作宮（科技創辦人）')
    }
    if (karmeshTech) {
      addWithReason('business-tech-founder', `10 宮主 ${karmeshPlanet} 落 ${karmeshHouse} 宮（科技 / 新興事業）`)
    }
    if (mercIsLagnaLord && goodD.includes(mercDignity)) {
      addWithReason('business-tech-founder', '命主星 Mercury 強旺（天生商業 / 科技嗅覺）')
    }
    if (hasBhadra) {
      addWithReason('business-tech-founder', 'Bhadra Yoga（Mercury Mahapurusha）— 商業偉人格')
    }
    if (rahuTen && mercOK) {
      addWithReason('business-tech-founder', 'Rahu 落 10/11 宮 + Mercury 落 benefic 宮（現代科技創辦人）')
    }
    if (karmeshVenusTech) {
      addWithReason('business-tech-founder', `10 宮主 Venus 落 ${karmeshHouse} 宮（平台 / 內容 / 生活品牌）`)
    }
    if (mercInThird) {
      addWithReason('business-tech-founder', 'Mercury 落 3 宮（傳播 / 網絡）')
    }
  }

  // 7. business-tycoon-founder
  {
    const ownKarmesh = ['Sun', 'Mars', 'Mercury', 'Venus'].includes(karmeshPlanet) && karmeshHouse === 10
    const lagnaLordTenth = [10, 11].includes(lagnaLordHouse) && goodD.includes(lagnaLordDignity)
    const satInTenStrong = satHouse === 10 && goodD.includes(satDignity)
    const sunStrongFirst = sunHouse && [1, 10].includes(sunHouse) && ['own', 'exalted'].includes(sunDignity)
    const karmeshStrong = strongD.includes(karmeshDignity)
    const karmeshTrikona = [1, 5, 9].includes(karmeshHouse)
    const strongLagnaLord = goodD.includes(lagnaLordDignity)
    const marsOrSunKendra = (marsHouse && [1, 4, 7, 10, 11].includes(marsHouse))
      || (sunHouse && [1, 4, 7, 10].includes(sunHouse))

    if (ownKarmesh) {
      addWithReason('business-tycoon-founder', `10 宮主 ${karmeshPlanet} 落 10 宮（事業核心主導）`)
    }
    if (lagnaLordTenth) {
      addWithReason('business-tycoon-founder', `命主星強旺落 ${lagnaLordHouse} 宮（親自掌舵的帝王）`)
    }
    if (satInTenStrong) {
      addWithReason('business-tycoon-founder', 'Saturn 強旺 10 宮（長期經營 + 建立帝國）')
    }
    if (sunStrongFirst) {
      addWithReason('business-tycoon-founder', `Sun 強旺 ${sunHouse} 宮（天生領袖位）`)
    }
    if (karmeshStrong) {
      addWithReason('business-tycoon-founder', `10 宮主 ${karmeshPlanet} 強旺（${karmeshDignity}）— 有 vision 的創辦人`)
    }
    if (hasBhadra) {
      addWithReason('business-tycoon-founder', 'Bhadra Yoga — 商業偉人格')
    }
    if (hasVipreet && karmeshTrikona) {
      addWithReason('business-tycoon-founder', 'Vipreet Raj + 10 宮主落 trikona（從無到有建立帝國）')
    }
    if (strongLagnaLord && marsOrSunKendra) {
      addWithReason('business-tycoon-founder', '命主星強旺 + Mars/Sun 落 kendra（領導型創辦人）')
    }
  }

  // 8. business-tycoon-heir
  {
    const fourthRulerStrong = (moonHouse === 4 && goodD.includes(moonDignity))
      || (jupHouse === 4 && goodD.includes(jupDignity))
    const venusSecondStrong = venusHouse === 2 && goodD.includes(venusDignity)
    const jupNinth = jupHouse === 9 && goodD.includes(jupDignity)
    const karmeshSecond = karmeshHouse === 2
    const jupOrVenusFourth = (jupHouse === 4) || (venusHouse === 4)
    const moonSecondOrFourth = moonHouse && [2, 4].includes(moonHouse)
    const venusSecondOrFourth = venusHouse && [2, 4].includes(venusHouse)
    const karmeshKendra = [1, 4, 7, 10].includes(karmeshHouse)
    const kendraFamily = karmeshKendra && (moonSecondOrFourth || venusSecondOrFourth || jupOrVenusFourth)
    const lagnaLordFourth = lagnaLordHouse === 4

    if (fourthRulerStrong && venusSecondStrong) {
      addWithReason('business-tycoon-heir', '4 宮 + 2 宮雙強（家族聲望 + 家業）')
    }
    if (karmeshSecond && (fourthRulerStrong || jupNinth)) {
      addWithReason('business-tycoon-heir', '10 宮主落 2 宮 + 4/9 宮強（家族事業繼承）')
    }
    if (kendraFamily) {
      addWithReason('business-tycoon-heir', '10 宮主落 kendra + 2/4 宮有吉星（家族聲譽）')
    }
    if (lagnaLordFourth) {
      addWithReason('business-tycoon-heir', '命主星落 4 宮（本人即家業代表）')
    }
    if (jupOrVenusFourth) {
      addWithReason('business-tycoon-heir', 'Jupiter / Venus 落 4 宮（家族庇蔭）')
    }
  }

  // 9. business-ceo-hired
  {
    const karmeshForCeo = ['Mercury', 'Saturn'].includes(karmeshPlanet) && [7, 10].includes(karmeshHouse)
      && goodD.includes(karmeshDignity)
    const mercStrongWork = mercHouse && [1, 10, 11].includes(mercHouse) && goodD.includes(mercDignity)
    const satStrongWork = satHouse && [7, 10].includes(satHouse) && goodD.includes(satDignity)
    const dashaLord = analysis?.dasha?.lord
    const ceoDasha = ['Mercury', 'Saturn'].includes(dashaLord)
    const karmeshKendraBiz = [7, 10].includes(karmeshHouse)
    const mercOrSatStrong = goodD.includes(mercDignity) || goodD.includes(satDignity)
    const jupSeventh = jupHouse === 7
    const karmeshBeneficKendra = ['Mercury', 'Jupiter', 'Venus'].includes(karmeshPlanet)
      && [1, 4, 7, 10].includes(karmeshHouse)

    if (karmeshForCeo) {
      addWithReason('business-ceo-hired', `10 宮主 ${karmeshPlanet} 強旺落 ${karmeshHouse} 宮（體系內往上爬）`)
      predicted.add('business-leader')
    }
    if (mercStrongWork && satStrongWork) {
      addWithReason('business-ceo-hired', 'Mercury + Saturn 雙強旺於事業宮（組織 + 紀律）')
      predicted.add('business-leader')
    }
    if (karmeshKendraBiz && mercOrSatStrong) {
      addWithReason('business-ceo-hired', `10 宮主落 ${karmeshHouse} 宮 + Mercury/Saturn 強旺`)
      predicted.add('business-leader')
    }
    if (jupSeventh && mercStrongWork) {
      addWithReason('business-ceo-hired', 'Jupiter 7 宮（合夥 / 顧問型）+ Mercury 強旺')
      predicted.add('business-leader')
    }
    if (karmeshBeneficKendra && ceoDasha) {
      addWithReason('business-ceo-hired', `當前走 ${dashaLord} 大運 + 10 宮主落 kendra`)
      predicted.add('business-leader')
    }
  }

  // 10. business-media
  {
    const karmeshMedia = ['Mercury', 'Venus'].includes(karmeshPlanet) && [3, 5, 10].includes(karmeshHouse)
    const mercVenusMedia = mercHouse && [3, 5, 10].includes(mercHouse) && goodD.includes(mercDignity)
      && venusHouse && [3, 5, 10].includes(venusHouse) && goodD.includes(venusDignity)

    if (karmeshMedia) {
      addWithReason('business-media', `10 宮主 ${karmeshPlanet} 落 ${karmeshHouse} 宮（傳播 / 出版）`)
    }
    if (mercVenusMedia) {
      addWithReason('business-media', 'Mercury + Venus 雙強旺落媒體宮')
    }
  }

  // ─── POLITICS SUB-CATEGORIES ────────────────────────────────

  const contextHints = contextGatedYogaHints(analysis)
  // 政治前置閘：validator 傳進來的 preseededPredicted 也算（來自 keyword scan 等）
  const alreadyPolitics =
    contextHints.has('politics') || contextHints.has('government')
    || (preseededPredicted && (preseededPredicted.has('politics') || preseededPredicted.has('government')))

  const sunStrong = ['own', 'exalted', 'moolatrikona'].includes(sunDignity)
  const sunAnyStrong = ['own', 'exalted', 'moolatrikona', 'friendly'].includes(sunDignity)
  const sunKendra = sunHouse && [1, 4, 7, 10].includes(sunHouse)
  const sunTrikona = sunHouse && [1, 5, 9].includes(sunHouse)
  const sunPublic = sunHouse && [1, 7, 10].includes(sunHouse)
  const jupKendra = jupHouse && [1, 4, 7, 10].includes(jupHouse)
  const jupTrikona = jupHouse && [1, 5, 9].includes(jupHouse)
  const jupStrong = ['own', 'exalted', 'moolatrikona'].includes(jupDignity)
  const jupGood = goodD.includes(jupDignity)
  const moonPublic = moonHouse && [1, 4, 7, 10].includes(moonHouse)
  const marsKendra = marsHouse && [1, 4, 7, 10].includes(marsHouse)
  const marsStrong = ['own', 'exalted', 'moolatrikona'].includes(marsDignity)
  const marsAny = ['own', 'exalted', 'moolatrikona', 'friendly'].includes(marsDignity)
  const satKendra = satHouse && [1, 4, 7, 10].includes(satHouse)
  const satStrong = ['own', 'exalted', 'moolatrikona'].includes(satDignity)
  const satGood = goodD.includes(satDignity)

  const kingSignals =
    (sunStrong && sunKendra) ||
    (hasRaj && hasGaja) ||
    (hasBudha && jupStrong && jupKendra) ||
    (sunPublic && jupKendra && jupGood) ||
    (karmeshPlanet === 'Mercury' && [9, 10, 11].includes(karmeshHouse) && (hasRaj || hasGaja || hasBudha)) ||
    (lagnaLordHouse && [10, 11].includes(lagnaLordHouse)
      && goodD.includes(lagnaLordDignity) && (hasRaj || hasGaja || hasBudha)) ||
    ((hasRaj || hasGaja) && [1, 4, 5, 7, 9, 10, 11].includes(karmeshHouse)) ||
    (sunPublic && sunAnyStrong) ||
    (hasVipreet && (hasGaja || hasDhana || hasRaj)) ||
    (karmeshPlanet === 'Saturn' && [6, 8, 12].includes(karmeshHouse) && (hasGaja || hasRaj || hasBudha || hasVipreet)) ||
    (karmeshPlanet === 'Mars' && (hasGaja || hasRaj || hasBudha || hasChandraMangal)) ||
    ([1, 10].includes(karmeshHouse) && (hasRaj || hasGaja || hasBudha || hasDhana)) ||
    (hasGaja && goodD.includes(lagnaLordDignity)) ||
    (hasBudha && (
      (lagnaLordHouse && [1, 4, 7, 10].includes(lagnaLordHouse))
      || ['Mercury', 'Jupiter', 'Venus'].includes(karmeshPlanet)
    )) ||
    (hasChandraMangal && hasDhana) ||
    (karmeshPlanet === 'Moon' && (hasBudha || hasGaja || hasRaj)) ||
    (hasMalavya && hasBudha)

  // propagate contextHints to predicted（粗類）— 這些沒細到子類但可當 fallback
  for (const c of contextHints) predicted.add(c)

  // 政治 sub-cat trigger 時會連帶補加粗類 politics + government — 與原 validator 語意保持一致
  const addPolitics = (subKey, reason, withGov = true) => {
    addWithReason(subKey, reason)
    predicted.add('politics')
    if (withGov) predicted.add('government')
  }

  // 1. politics-head-state
  {
    const karmeshPublic = [1, 10].includes(karmeshHouse)
    const condA = sunStrong && sunKendra && (hasRaj || hasGaja)
    const condB = sunAnyStrong && sunPublic && moonPublic
    const condC = sunKendra && karmeshPublic && ['Sun', 'Jupiter', 'Mars', 'Moon'].includes(karmeshPlanet)
    const condD = lagnaLordHouse && [1, 10].includes(lagnaLordHouse)
      && goodD.includes(lagnaLordDignity) && sunAnyStrong
    const condE = sunHouse && [9, 10].includes(sunHouse) && sunAnyStrong && moonPublic

    if ((alreadyPolitics || kingSignals) && condA) {
      addPolitics('politics-head-state', 'Sun 強旺 kendra + Raja/Gaja Yoga（古典元首格）')
    }
    if ((alreadyPolitics || kingSignals) && condB) {
      addPolitics('politics-head-state', 'Sun + Moon 雙落公眾宮（天生被大眾看見）')
    }
    if ((alreadyPolitics || kingSignals) && condC) {
      addPolitics('politics-head-state', `10 宮主 ${karmeshPlanet} 落公眾位 + Sun 落 kendra`)
    }
    if ((alreadyPolitics || kingSignals) && condD) {
      addPolitics('politics-head-state', `命主星落 ${lagnaLordHouse} 宮 + Sun 有力（天生領袖）`)
    }
    if ((alreadyPolitics || kingSignals) && condE) {
      addPolitics('politics-head-state', `Sun 落 ${sunHouse} 宮（皇家位）+ Moon 公眾`)
    }
  }

  // 2. politics-head-gov
  {
    const satTenOrSeven = satHouse && [7, 10].includes(satHouse) && satGood
    const mercGood = goodD.includes(mercDignity)
    const karmeshExec = ['Saturn', 'Mercury', 'Jupiter'].includes(karmeshPlanet) && [7, 10].includes(karmeshHouse)
    const condA = satTenOrSeven && mercGood
    const condB = karmeshExec && (satGood || mercGood)
    const condC = jupHouse === 10 && jupGood && hasRaj
    const condD = lagnaLordHouse === 10 && (satGood || mercGood)

    if ((alreadyPolitics || kingSignals) && condA) {
      addPolitics('politics-head-gov', `Saturn 強旺 ${satHouse} 宮 + Mercury 強（行政首長型）`)
    }
    if ((alreadyPolitics || kingSignals) && condB) {
      addPolitics('politics-head-gov', `10 宮主 ${karmeshPlanet} 落 ${karmeshHouse} 宮 + Saturn/Mercury 好`)
    }
    if ((alreadyPolitics || kingSignals) && condC) {
      addPolitics('politics-head-gov', 'Jupiter 10 宮強 + Raja Yoga（智慧型首相）')
    }
    if ((alreadyPolitics || kingSignals) && condD) {
      addPolitics('politics-head-gov', '命主星落 10 宮 + Saturn/Mercury 好（工作導向首相）')
    }
  }

  // 3. politics-revolutionary
  {
    const marsAndSunNear = (sunHouse && marsHouse && Math.abs(sunHouse - marsHouse) <= 1)
    const marsStrong10or1 = marsHouse && [1, 10].includes(marsHouse) && marsAny
    const karmeshFire = ['Mars', 'Sun', 'Ketu'].includes(karmeshPlanet)
    const condA = marsStrong10or1 && karmeshFire
    const condB = marsAndSunNear && (marsAny || sunAnyStrong) && (hasRaj || hasGaja)
    const condC = ketuHouse === 9 && jupGood && (sunPublic || moonPublic)
    const condD = rahuHouse === 10 && sunAnyStrong
    const condE = karmeshPlanet === 'Mars' && [1, 4, 5, 9, 10].includes(karmeshHouse) && marsAny
    const condF = hasChandraMangal && (sunAnyStrong || marsStrong)

    if ((alreadyPolitics || kingSignals) && condA) {
      addPolitics('politics-revolutionary', `Mars 強旺 ${marsHouse} 宮 + 10 宮主屬火（戰鬥革命者）`, false)
    }
    if ((alreadyPolitics || kingSignals) && condB) {
      addPolitics('politics-revolutionary', 'Sun + Mars 緊鄰 + Raja/Gaja Yoga（戰鬥型理想主義）', false)
    }
    if ((alreadyPolitics || kingSignals) && condC) {
      addPolitics('politics-revolutionary', 'Ketu 落 9 宮 + Jupiter 強（脫離物質的精神革命者）', false)
    }
    if ((alreadyPolitics || kingSignals) && condD) {
      addPolitics('politics-revolutionary', 'Rahu 落 10 宮 + Sun 有力（政治突破 / 反體制）', false)
    }
    if ((alreadyPolitics || kingSignals) && condE) {
      addPolitics('politics-revolutionary', `10 宮主 Mars 落 ${karmeshHouse} 宮（軍事革命者）`, false)
    }
    if ((alreadyPolitics || kingSignals) && condF) {
      addPolitics('politics-revolutionary', 'Chandra-Mangal Yoga + 火 / 日有力（激情革命）', false)
    }
  }

  // 4. politics-military
  {
    const karmeshMilitary = karmeshPlanet === 'Mars' && [3, 6, 10].includes(karmeshHouse)
    const marsKendraStrong = marsKendra && marsAny
    const condA = karmeshMilitary && satGood
    const condB = marsKendraStrong && satGood && (sunAnyStrong || jupGood)
    const condC = hasRuchaka && sunAnyStrong
    const condD = marsHouse && [3, 6].includes(marsHouse) && marsStrong && [1, 10].includes(karmeshHouse)

    if ((alreadyPolitics || kingSignals) && condA) {
      addPolitics('politics-military', `10 宮主 Mars 落 ${karmeshHouse} 宮 + Saturn 好（軍政）`, false)
    }
    if ((alreadyPolitics || kingSignals) && condB) {
      addPolitics('politics-military', 'Mars 強旺 kendra + Saturn 紀律 + Sun/Jupiter 好', false)
    }
    if ((alreadyPolitics || kingSignals) && condC) {
      addPolitics('politics-military', 'Ruchaka Yoga（Mars Mahapurusha）+ Sun 有力', false)
    }
    if ((alreadyPolitics || kingSignals) && condD) {
      addPolitics('politics-military', `Mars 強旺 ${marsHouse} 宮 + 10 宮主落公眾位（戰將）`, false)
    }
  }

  // 5. politics-authoritarian
  {
    const rahuTenOrOne = rahuHouse && [1, 10].includes(rahuHouse)
    const karmeshHard = ['Saturn', 'Mars', 'Sun', 'Rahu'].includes(karmeshPlanet)
    const condA = rahuTenOrOne && sunAnyStrong && karmeshHard
    const satMarsConj = satHouse && marsHouse && satHouse === marsHouse
    const satMars7th = satHouse && marsHouse && Math.abs(satHouse - marsHouse) === 6
    const condB = (satMarsConj || satMars7th) && sunAnyStrong && karmeshHard
    const condC = ['Rahu', 'Ketu'].includes(karmeshPlanet) && karmeshHouse === 10 && sunAnyStrong

    if ((alreadyPolitics || kingSignals) && condA) {
      addPolitics('politics-authoritarian', `Rahu 落 ${rahuHouse} 宮 + Sun 有力 + 10 宮主強硬`, false)
    }
    if ((alreadyPolitics || kingSignals) && condB) {
      addPolitics('politics-authoritarian', 'Saturn + Mars 合 / 互對 + Sun 強（鐵腕）', false)
    }
    if ((alreadyPolitics || kingSignals) && condC) {
      addPolitics('politics-authoritarian', `10 宮主 ${karmeshPlanet} 落 10 宮 + Sun 有力（非常規集權）`, false)
    }
  }

  // 6. politics-diplomat（UI 不輸出 — 樣本太少）
  {
    const jupNinthOrTenth = jupHouse && [9, 10].includes(jupHouse) && jupGood
    const mercGood2 = goodD.includes(mercDignity)
    const karmeshDiplomat = ['Jupiter', 'Mercury'].includes(karmeshPlanet) && [7, 9, 10].includes(karmeshHouse)
    const condA = jupNinthOrTenth && (hasBudha || mercGood2)
    const condB = karmeshDiplomat && jupGood
    const condC = hasVipreet && (jupGood || mercGood2) && sunAnyStrong
    const condD = hasVipreet && hasBudha && karmeshPlanet === 'Saturn'

    if ((alreadyPolitics || kingSignals) && condA) {
      addPolitics('politics-diplomat', 'Jupiter 強旺 9/10 宮 + Budha-Aditya/Mercury（國師 / 外交）', false)
    }
    if ((alreadyPolitics || kingSignals) && condB) {
      addPolitics('politics-diplomat', `10 宮主 ${karmeshPlanet} 落 ${karmeshHouse} 宮 + Jupiter 好`, false)
    }
    if ((alreadyPolitics || kingSignals) && condC) {
      addPolitics('politics-diplomat', 'Vipreet Raj + Jupiter/Mercury 好 + Sun 有力', false)
    }
    if ((alreadyPolitics || kingSignals) && condD) {
      addPolitics('politics-diplomat', 'Vipreet + Budha-Aditya + Saturn karmesh（Kissinger 型）', false)
    }
  }

  // 7. government-judicial（UI 不輸出 — 樣本太少）
  {
    const jupStrongDharma = jupHouse && [8, 9].includes(jupHouse) && jupGood
    const satStrongDharma = satHouse && [8, 9].includes(satHouse) && satGood
    const karmeshLaw = ['Jupiter', 'Saturn'].includes(karmeshPlanet) && [8, 9, 11].includes(karmeshHouse)
    const condA = (jupStrongDharma || satStrongDharma) && karmeshLaw
    const condB = jupStrongDharma && satGood && goodD.includes(mercDignity)

    // government-judicial 原本在 validator 裡同步加 'law'，保留此語意
    if (alreadyPolitics && condA) {
      addWithReason('government-judicial', 'Jupiter / Saturn 強旺達摩宮 + 10 宮主指法')
      predicted.add('law')
    }
    if (alreadyPolitics && condB) {
      addWithReason('government-judicial', 'Jupiter 達摩宮 + Saturn/Mercury 好（司法）')
      predicted.add('law')
    }
  }

  // ─── ARTS SUB-CATEGORIES (Round 5) ────────────────────────────
  //
  // 設計紀律：
  // 1. arts detector 獨立跑、和 biz/politics detector 不互斥
  //    （同一個人可能同時被偵測為 arts-performer-film-actor + business-tycoon-heir，
  //     UI 排序會挑 trigger count 多者；這跟 biz/pol 對稱的作法一致）
  // 2. arts trigger 不 backfill 粗類（不加 arts-performer / arts-creator / arts-visual）
  //    — 粗類已經由 KARAKA_CATEGORY_HINTS (Venus) + derived Venus-Moon combo 走另一條路徑
  // 3. 觸發閘 artsFlag：
  //    - Venus 非 debilitated（Venus 是 arts/performer 的主 karaka）
  //    - AND （karmesh 為 Venus/Moon/Mercury/Mars OR d10Lord 為 Venus/Moon/Mercury
  //      OR 有 Malavya/Saraswati/Budha-Aditya yoga OR Venus 在 kendra/trikona
  //      OR Ruchaka yoga — Mars Mahapurusha 也可以是運動員或 performer）
  //    不滿足 artsFlag → arts sub-cat 不 fire，避開非藝術盤誤判

  const addArts = (subKey, reason) => {
    addWithReason(subKey, reason)
  }

  const venusNonDebilitated = venusDignity !== 'debilitated'
  const karmeshArtCreator = ['Venus', 'Moon', 'Mercury', 'Mars', 'Jupiter'].includes(karmeshPlanet)
  const d10ArtCreator = ['Venus', 'Moon', 'Mercury'].includes(d10Lord)
  const hasSaraswati = yogas.has('saraswati')
  const hasMalavyaL = hasMalavya
  const hasBudhaAditya = yogas.has('budha-aditya')
  const venusKendraL = venusHouse && [1, 4, 7, 10].includes(venusHouse)
  const venusTrikonaL = venusHouse && [1, 5, 9].includes(venusHouse)
  const moonKendraL = moonHouse && [1, 4, 7, 10].includes(moonHouse)
  const moonStrongL = goodD.includes(moonDignity)
  const venusStrongL = goodD.includes(venusDignity)
  const mercStrongL = goodD.includes(mercDignity)
  const jupStrongL = goodD.includes(jupDignity)
  const satGoodL = goodD.includes(satDignity)

  // Neecha Bhanga rescue: Venus debilitated in Virgo but Mercury exalted in same
  //   sign cancels the debilitation classically. Detect: Venus & Mercury same
  //   house + Mercury exalted. This rescues Amitabh Bachchan (AA-rated actor).
  const venusMercSameHouse = venusHouse && mercHouse && venusHouse === mercHouse
  const neechaBhangaVenus = venusDignity === 'debilitated' && venusMercSameHouse
    && mercDignity === 'exalted'

  const artsFlag =
    (venusNonDebilitated || neechaBhangaVenus) &&
    (
      karmeshArtCreator ||
      d10ArtCreator ||
      hasSaraswati || hasMalavyaL || hasBudhaAditya ||
      venusKendraL || venusTrikonaL ||
      hasRuchaka
    )

  // 1. arts-performer-film-actor
  {
    const sunOrMoonPublic = (sunHouse && [1, 7, 10].includes(sunHouse))
      || (moonHouse && [1, 4, 7, 10].includes(moonHouse))
    const publicFace = venusKendraL && sunOrMoonPublic
    const karmeshActor = ['Venus', 'Mars', 'Mercury', 'Moon'].includes(karmeshPlanet) && [1, 7, 10].includes(karmeshHouse)
    const saturnSpot = satHouse && [1, 4, 10].includes(satHouse) && satGoodL && venusStrongL
    // Neecha-Bhanga 救援：當 Venus 衰陷 + Mercury 同宮 exalted + D10 也主 Mercury/Venus/Moon
    // → 演藝事業（Bollywood Amitabh Bachchan 型）
    const neechaBhangaActor = neechaBhangaVenus && d10ArtCreator && hasBudhaAditya

    if (artsFlag && publicFace) {
      addArts('arts-performer-film-actor', `Venus 落 ${venusHouse} 宮（kendra）+ Sun/Moon 公眾宮（舞台存在感）`)
    }
    if (artsFlag && karmeshActor) {
      addArts('arts-performer-film-actor', `10 宮主 ${karmeshPlanet} 落 ${karmeshHouse} 宮（表演事業）`)
    }
    if (artsFlag && hasMalavyaL) {
      addArts('arts-performer-film-actor', 'Malavya Yoga（Venus Mahapurusha）— 表演偉人格')
    }
    if (artsFlag && saturnSpot) {
      addArts('arts-performer-film-actor', `Saturn 強旺 ${satHouse} 宮 + Venus 強（深耕型演員）`)
    }
    if (neechaBhangaActor) {
      addArts('arts-performer-film-actor', 'Neecha-Bhanga Venus（衰陷被水星 exalted 同宮救）+ D10 指演藝 + Budha-Aditya')
    }
  }

  // 2. arts-performer-musician-singer
  {
    const jupInVoiceHouse = jupHouse === 2 && jupStrongL
    const moonVenusCombo = moonStrongL && venusStrongL && venusHouse && [1, 2, 5, 7, 10, 11].includes(venusHouse)
    const karmeshSinger = ['Moon', 'Venus', 'Jupiter', 'Mercury'].includes(karmeshPlanet) && [2, 5, 10, 11].includes(karmeshHouse)
    const moonStrongPublic = moonKendraL && moonStrongL
    const sunH11Ex = sunHouse === 11 && sunDignity === 'exalted'

    if (artsFlag && jupInVoiceHouse) {
      addArts('arts-performer-musician-singer', 'Jupiter 強旺 2 宮（古典聲音宮）')
    }
    if (artsFlag && moonVenusCombo) {
      addArts('arts-performer-musician-singer', `Venus + Moon 雙強（聲音 + 情感）— Venus ${venusHouse} 宮`)
    }
    if (artsFlag && karmeshSinger) {
      addArts('arts-performer-musician-singer', `10 宮主 ${karmeshPlanet} 落 ${karmeshHouse} 宮（聲音／情感事業）`)
    }
    if (artsFlag && moonStrongPublic) {
      addArts('arts-performer-musician-singer', `Moon 強旺 ${moonHouse} 宮（公眾親和感）`)
    }
    if (artsFlag && sunH11Ex && karmeshPlanet === 'Jupiter' && karmeshHouse === 11) {
      addArts('arts-performer-musician-singer', 'Sun exalted 11 + Jupiter karmesh 11（大舞台歌手）')
    }
  }

  // 3. arts-performer-musician-instrument
  {
    const mercVenusTech = mercStrongL && venusStrongL
      && mercHouse && [1, 3, 5, 10, 11].includes(mercHouse)
    const ketuFifth = ketuHouse === 5
    const satVenusDiscipline = satGoodL && venusStrongL
      && venusHouse && [1, 5, 10].includes(venusHouse)

    if (artsFlag && mercVenusTech) {
      addArts('arts-performer-musician-instrument', `Mercury + Venus 雙強（技巧 + 美感）— Mercury ${mercHouse} 宮`)
    }
    if (artsFlag && ketuFifth) {
      addArts('arts-performer-musician-instrument', 'Ketu 落 5 宮（靈感通道 / 即興）')
    }
    if (artsFlag && satVenusDiscipline) {
      addArts('arts-performer-musician-instrument', 'Saturn 好 + Venus 強旺於 1/5/10（技術紀律）')
    }
    if (artsFlag && hasSaraswati) {
      addArts('arts-performer-musician-instrument', 'Saraswati Yoga（水星金星木星三合）— 典型樂手格')
    }
  }

  // 4. arts-performer-dancer
  {
    const marsVenusDancer = marsAny && venusStrongL
      && venusHouse && [1, 3, 5, 10].includes(venusHouse)
    const thirdHouseStrong = sigs.some((s) => s.graha?.house === 3 && ['Venus', 'Moon', 'Mars', 'Mercury'].includes(s.planet))
    const fifthHouseStrong = sigs.some((s) => s.graha?.house === 5 && ['Venus', 'Moon', 'Jupiter', 'Sun'].includes(s.planet))
    const marsDigbala = marsHouse === 10

    if (artsFlag && marsVenusDancer) {
      addArts('arts-performer-dancer', `Mars + Venus 雙強（體能 + 美感）— Venus ${venusHouse} 宮`)
    }
    if (artsFlag && thirdHouseStrong && venusStrongL) {
      addArts('arts-performer-dancer', '3 宮有金／月／火／水 + Venus 強（體能表達）')
    }
    if (artsFlag && fifthHouseStrong && marsAny) {
      addArts('arts-performer-dancer', '5 宮聚吉星（創造力）+ Mars 非陷落')
    }
    if (artsFlag && marsDigbala && venusStrongL) {
      addArts('arts-performer-dancer', 'Mars 落 10 宮 digbala + Venus 強（舞台型）')
    }
  }

  // 5. arts-performer-comedian
  {
    const mercJupStrong = mercStrongL && jupStrongL
    const mercKendra2 = mercHouse && [1, 4, 7, 10].includes(mercHouse)
    const jupPublicL = jupHouse && [1, 4, 7, 9, 10].includes(jupHouse)
    const karmeshComedian = ['Mercury', 'Jupiter'].includes(karmeshPlanet) && [1, 3, 5, 10, 11].includes(karmeshHouse)

    if (artsFlag && mercJupStrong && (mercKendra2 || jupPublicL)) {
      addArts('arts-performer-comedian', 'Mercury + Jupiter 雙強（機智 + 智慧）')
    }
    if (artsFlag && hasBudhaAditya && moonStrongL) {
      addArts('arts-performer-comedian', 'Budha-Aditya Yoga + Moon 強（講話有大眾親和力）')
    }
    if (artsFlag && karmeshComedian && moonKendraL) {
      addArts('arts-performer-comedian', `10 宮主 ${karmeshPlanet} 落 ${karmeshHouse} 宮 + Moon 公眾`)
    }
  }

  // 6. arts-creator-writer
  {
    const merc3rd = mercHouse === 3 && mercStrongL
    const mercStrong1or10 = mercHouse && [1, 10].includes(mercHouse) && mercStrongL
    const jup9th = jupHouse === 9 && jupStrongL
    const ketuFifthL = ketuHouse === 5
    const karmeshWriter = karmeshPlanet === 'Mercury' && [1, 3, 5, 10].includes(karmeshHouse)
    const jupMercCombo = jupStrongL && mercStrongL

    if (artsFlag && merc3rd) {
      addArts('arts-creator-writer', 'Mercury 強旺 3 宮（寫作宮）')
    }
    if (artsFlag && mercStrong1or10) {
      addArts('arts-creator-writer', `Mercury 強旺 ${mercHouse} 宮（表達導向）`)
    }
    if (artsFlag && jup9th) {
      addArts('arts-creator-writer', 'Jupiter 強旺 9 宮（哲學 / 敘事深度）')
    }
    if (artsFlag && ketuFifthL && jupStrongL) {
      addArts('arts-creator-writer', 'Ketu 5 宮（靈感）+ Jupiter 強（深度作品）')
    }
    if (artsFlag && hasSaraswati) {
      addArts('arts-creator-writer', 'Saraswati Yoga（智慧 / 語言 / 藝術三合）')
    }
    if (artsFlag && karmeshWriter) {
      addArts('arts-creator-writer', `10 宮主 Mercury 落 ${karmeshHouse} 宮（文字事業）`)
    }
    if (artsFlag && jupMercCombo && jupHouse && [5, 9].includes(jupHouse)) {
      addArts('arts-creator-writer', `Jupiter + Mercury 雙強；Jupiter ${jupHouse} 宮（智慧敘事）`)
    }
  }

  // 7. arts-creator-director
  {
    const venusJupBoth = venusStrongL && jupStrongL
    const karmeshDirector = ['Venus', 'Jupiter', 'Mercury'].includes(karmeshPlanet) && [1, 5, 9, 10, 11].includes(karmeshHouse)
    const malavyaAndHamsa = hasMalavyaL && yogas.has('mahapurusha-Jupiter')
    const fifthHouseCreate = sigs.some((s) => s.graha?.house === 5
      && ['Venus', 'Jupiter', 'Moon', 'Mercury'].includes(s.planet))
    const sunKendra2 = sunHouse && [1, 4, 7, 10].includes(sunHouse)
    const rahuCreate = rahuHouse && [5, 10, 11].includes(rahuHouse)
    const karmeshTenth = karmeshHouse === 10 && goodD.includes(karmeshDignity)

    if (artsFlag && venusJupBoth && karmeshTenth) {
      addArts('arts-creator-director', '10 宮主強旺 + Venus + Jupiter 雙強（領導創作）')
    }
    if (artsFlag && karmeshDirector && (jupStrongL || venusStrongL)) {
      addArts('arts-creator-director', `10 宮主 ${karmeshPlanet} 落 ${karmeshHouse} 宮 + Venus/Jupiter 強`)
    }
    if (artsFlag && malavyaAndHamsa) {
      addArts('arts-creator-director', 'Malavya + Hamsa 雙偉人格（美感 + 智慧領導創作）')
    }
    if (artsFlag && fifthHouseCreate && sunKendra2) {
      addArts('arts-creator-director', '5 宮聚吉星（視覺創造）+ Sun kendra（舞台主導）')
    }
    if (artsFlag && rahuCreate && karmeshTenth && venusNonDebilitated) {
      addArts('arts-creator-director', `Rahu 落 ${rahuHouse} 宮（視覺突破）+ 10 宮主強旺`)
    }
  }

  // 8. arts-creator-producer (UI_SUPPRESSED — N=2)
  {
    const mercSatBoth = mercStrongL && satGoodL
    const eleventhStrong = sigs.some((s) => s.graha?.house === 11
      && ['Venus', 'Mercury', 'Jupiter', 'Moon'].includes(s.planet))
    const karmeshProducer = ['Mercury', 'Saturn'].includes(karmeshPlanet) && [10, 11].includes(karmeshHouse)

    if (artsFlag && mercSatBoth && eleventhStrong) {
      addArts('arts-creator-producer', 'Mercury + Saturn 雙強 + 11 宮有吉星（統籌型）')
    }
    if (artsFlag && karmeshProducer) {
      addArts('arts-creator-producer', `10 宮主 ${karmeshPlanet} 落 ${karmeshHouse} 宮（幕後統籌）`)
    }
  }

  // 9. arts-visual-painter
  {
    const venusFifth = venusHouse === 5 && venusStrongL
    const venusFourth = venusHouse === 4 && venusStrongL
    const ketuSolo = ketuHouse && [1, 5, 12].includes(ketuHouse)
    const satCraft = satHouse && [2, 5, 10].includes(satHouse) && satGoodL
    const karmeshPainter = karmeshPlanet === 'Venus' && [1, 4, 5, 10].includes(karmeshHouse)
    const jupHamsa = yogas.has('mahapurusha-Jupiter')
    const rahuArt = rahuHouse && [5, 9, 12].includes(rahuHouse) && venusStrongL

    if (artsFlag && venusFifth) {
      addArts('arts-visual-painter', 'Venus 強旺 5 宮（視覺創造）')
    }
    if (artsFlag && venusFourth) {
      addArts('arts-visual-painter', 'Venus 強旺 4 宮（內在美感）')
    }
    if (artsFlag && ketuSolo && venusStrongL) {
      addArts('arts-visual-painter', `Ketu 落 ${ketuHouse} 宮（獨立 / 脫俗）+ Venus 強`)
    }
    if (artsFlag && satCraft && venusStrongL) {
      addArts('arts-visual-painter', `Saturn 強旺 ${satHouse} 宮（工藝耐力）+ Venus 強`)
    }
    if (artsFlag && karmeshPainter) {
      addArts('arts-visual-painter', `10 宮主 Venus 落 ${karmeshHouse} 宮（純美感事業）`)
    }
    if (artsFlag && jupHamsa && venusStrongL && ketuSolo) {
      addArts('arts-visual-painter', 'Hamsa Yoga + Venus 強 + Ketu 獨立位（聖者型視覺創作）')
    }
    if (artsFlag && rahuArt) {
      addArts('arts-visual-painter', `Rahu 落 ${rahuHouse} 宮 + Venus 強（前衛視覺）`)
    }
  }

  // 10. arts-visual-photographer (UI_SUPPRESSED — N=3)
  {
    const mercVenusPhoto = mercStrongL && venusStrongL
    const rahuPhoto = rahuHouse && [5, 11].includes(rahuHouse)
    const ketuObserver = ketuHouse && [1, 4, 12].includes(ketuHouse)
    const karmeshPhoto = ['Mercury', 'Venus'].includes(karmeshPlanet) && [3, 5, 10, 11].includes(karmeshHouse)

    if (artsFlag && mercVenusPhoto && rahuPhoto) {
      addArts('arts-visual-photographer', `Mercury + Venus 雙強 + Rahu 落 ${rahuHouse} 宮（前衛視覺）`)
    }
    if (artsFlag && ketuObserver && venusStrongL) {
      addArts('arts-visual-photographer', `Ketu 落 ${ketuHouse} 宮（獨立觀察者）+ Venus 強`)
    }
    if (artsFlag && karmeshPhoto) {
      addArts('arts-visual-photographer', `10 宮主 ${karmeshPlanet} 落 ${karmeshHouse} 宮（影像網絡）`)
    }
  }

  return { predicted, reasonsBySubCat, contextHints, kingSignals }
}

// ═════════════════════════════════════════════════════════════════
// 公開 API：回傳 UI-ready 的結果
// ═════════════════════════════════════════════════════════════════
export function detectCareerSubCategory(analysis) {
  if (!analysis) return null

  const { predicted, reasonsBySubCat } = runAllDetectors(analysis)

  // 只考慮「非粗類 + 非 UI-suppressed」的 sub-category
  const candidateKeys = [...predicted].filter((k) =>
    ALL_DETECTABLE.includes(k) && !UI_SUPPRESSED_SUBCATS.has(k)
  )

  if (candidateKeys.length === 0) {
    return {
      predicted,           // Set — 完整預測（給 validator 用）
      primary: null,
      confidence: null,
      reasoning: [],
      alternates: []
    }
  }

  // 排序規則（反映真實分布）：
  //   多數用戶是商人而非政治人物。Vedic 古典訊號下「Sun H10 + raja-yoga」
  //   之類配置經常觸發 politics-head-state，但這些人十有八九是商業領袖。
  //   所以採用不對稱優先權：
  //     - 如果同時命中 business 與 politics sub-cat，business 獲選
  //       除非 politics sub-cat 的 trigger 數比任何 business sub-cat 多 ≥ 2
  //       （= 政治訊號壓倒性勝出時才顯示政治身份）
  const bizList = candidateKeys
    .filter((k) => BUSINESS_SUBCATS.includes(k))
    .map((k) => ({ key: k, reasons: reasonsBySubCat.get(k) || [], isBiz: true }))
  const polList = candidateKeys
    .filter((k) => POLITICS_SUBCATS.includes(k))
    .map((k) => ({ key: k, reasons: reasonsBySubCat.get(k) || [], isBiz: false }))

  bizList.sort((a, b) => b.reasons.length - a.reasons.length)
  polList.sort((a, b) => b.reasons.length - a.reasons.length)

  const topBiz = bizList[0]
  const topPol = polList[0]

  // UI primary 策略（避免「Warren Buffett = 國家元首型」這種誤報）：
  //   - politics-head-state 本質是「Sun H10 + raja yoga」就觸發，但這個組合
  //     在 CEO/企業領袖身上也非常常見 → head-state 一律不當 primary，只能
  //     當 alternates。
  //   - 真・政治 sub-cat（revolutionary / military / authoritarian / head-gov /
  //     diplomat）才允許作為 primary。這些 sub-cat 的命中條件涵蓋更具體的
  //     火性 / 行政配置，誤報率低很多。
  const REAL_POLITICS = new Set([
    'politics-revolutionary',
    'politics-military',
    'politics-authoritarian',
    'politics-head-gov',
    'politics-diplomat'
  ])
  const realPolList = polList.filter((p) => REAL_POLITICS.has(p.key))
  const softPolList = polList.filter((p) => !REAL_POLITICS.has(p.key))

  // 選 primary：bizList top / realPolList top 誰 trigger 多就誰；tie 時 biz 贏
  let ranked
  const topReal = realPolList[0]
  if (topBiz && topReal) {
    if (topReal.reasons.length > topBiz.reasons.length) {
      ranked = [...realPolList, ...bizList, ...softPolList]
    } else {
      ranked = [...bizList, ...realPolList, ...softPolList]
    }
  } else if (topBiz) {
    ranked = [...bizList, ...softPolList]
  } else if (topReal) {
    ranked = [...realPolList, ...softPolList]
  } else {
    ranked = polList
  }

  // 保險：primary 不能是 politics-head-state（容易誤報，見上面 REAL_POLITICS 註解）
  // 若 ranked[0] 是 head-state，視同沒偵測到 primary（只當 alternate）
  const HEAD_STATE_BLOCKED_AS_PRIMARY = 'politics-head-state'
  const primaryIndex = ranked.findIndex((r) => r.key !== HEAD_STATE_BLOCKED_AS_PRIMARY)
  if (primaryIndex === -1) {
    return {
      predicted,
      primary: null,
      confidence: null,
      reasoning: [],
      alternates: ranked.slice(0, 3).map((r) => r.key)
    }
  }
  const top = ranked[primaryIndex]
  const triggerCount = top.reasons.length

  // confidence 規則：
  //   - high：≥ 2 條獨立 reason 命中同一個 sub-cat
  //   - medium：1 條 reason
  //   - low：（保險閘）
  let confidence
  if (triggerCount >= 2) confidence = 'high'
  else if (triggerCount === 1) confidence = 'medium'
  else confidence = 'low'

  return {
    predicted,
    primary: top.key,
    confidence,
    reasoning: top.reasons,
    alternates: ranked.filter((_, i) => i !== primaryIndex).slice(0, 3).map((r) => r.key)
  }
}

// ═════════════════════════════════════════════════════════════════
// Legacy API for validator — 回傳完整 predicted Set（含粗類 politics/government）
// 傳入 preseededPredicted（validator 其他來源已加入 set 的 categories）
// 以維持 Round 4 Politics sub-cat regression。
// ═════════════════════════════════════════════════════════════════
export function predictSubCategoriesForValidator(analysis, preseededPredicted = null) {
  const { predicted, reasonsBySubCat } = runAllDetectors(analysis, preseededPredicted)
  return { predicted, reasonsBySubCat }
}

export const SUB_CATEGORY_KEYS = [...BUSINESS_SUBCATS, ...POLITICS_SUBCATS]
export const UI_SUPPRESSED = UI_SUPPRESSED_SUBCATS
