// ═══════════════════════════════════════════════════════════════
// 小運窗口 (Antardasha Window) — 事業時間感模組
// ═══════════════════════════════════════════════════════════════
//
// 設計原則（純加法 · 不動 pyramid · 不影響準確率）：
//   1. 本模組「只讀」careerVedic 的 karakaOverrides / pyramid，不寫回
//   2. 不參與事業主軸/副軸/避開的判決 — AD 只是「時間窗」
//   3. 輸出一段 2-3 句話，講「接下來約 X 個月這組 MD+AD 讓你該把心力放在 ___」
//   4. 如果 AD 行星剛好是使用者 pyramid 的主軸 → 標記「這是你的強項時間窗」
//
// 為什麼 AD 不進 pyramid 主軸判決：
//   - 本命 pyramid 講「你這輩子該做什麼」
//   - AD 只持續幾個月到 2-3 年，不該改寫「這輩子」的結論
//   - 如果 AD 進 pyramid，使用者每半年會被告知「該換職業」→ 荒謬
//
// 資料來源：planetFriendship、naturalKaraka（都已存在 careerVedicData.js）
// ═══════════════════════════════════════════════════════════════

import { planetFriendship, naturalKaraka } from './careerVedicData.js'

// 行星中文名（用於 headline，跟事業章其他敘述的「土星／火星」一致）
const zh = {
  Sun: '太陽', Moon: '月亮', Mars: '火星', Mercury: '水星',
  Jupiter: '木星', Venus: '金星', Saturn: '土星', Rahu: '北交', Ketu: '南交'
}

// 每顆行星當 AD 時，在事業脈絡下的「這段時間該做什麼」能量表
// 跟 dashaReadings 的通用敘述不同：本表只講「事業上的時間窗建議」
const adCareerEnergy = {
  Sun: {
    verb: '站上台前',
    focus: '適合讓自己「被看見」— 爭取代表機構的位置、上台發言、寫署名作品、拿頭銜。這段期間別在幕後耗，被看見的動作會放大回報。',
    caution: '小心過度好面子、只想著頭銜。決策要看實質不要只看「誰的面子比較大」。'
  },
  Moon: {
    verb: '照顧大眾',
    focus: '適合做「跟人貼近」的事 — 經營社群、做客戶訪談、品牌故事、女性／母嬰／食品／照護相關議題。公眾緣會特別好。',
    caution: '情緒起伏會被放大，別在低潮期做重大決策。寫作／說話請人先過目一遍。'
  },
  Mars: {
    verb: '搶佔、衝刺',
    focus: '適合「打仗」的時期 — 搶市場、發新品、談判、競標、主動出擊搶位、拓展業務。身體能量也強，可以進入高強度執行週期。',
    caution: '衝動期 — 避免跟老闆／合夥人正面衝突，避免在氣頭上簽約或離職。'
  },
  Mercury: {
    verb: '寫、講、賣',
    focus: '適合「靠嘴吃飯」的動作 — 談合約、做業務、寫提案、錄 podcast、教學、談判、自媒體經營。學習新技能的吸收力也強。',
    caution: '點子多容易分心 — 同時開太多戰線會一個都收不回來。限制自己「最多 2 個主題」。'
  },
  Jupiter: {
    verb: '擴張、累積',
    focus: '最適合「擴張」的窗口 — 開分部、募資、出書／出課、找導師／前輩、報考進修、接大型顧問案。這段期間運氣基底會偏順。',
    caution: '錢容易過度樂觀 — 擴張要保底，別把所有現金押在單一方向上。'
  },
  Venus: {
    verb: '經營關係',
    focus: '適合「靠人味、靠美感」的工作 — 客戶關係修復、品牌重塑、談異業合作、做設計／創作、重要人脈的經營與維繫。',
    caution: '容易耽於享樂與拖延 — 把「社交」誤當「進度」。每週盤點真正做出的東西，別讓應酬吃掉產出。'
  },
  Saturn: {
    verb: '打地基',
    focus: '最適合「做慢活」的時期 — 體系建構、流程規範、文件整理、長期合約、家業接手、練硬技能、挺住難熬的專案。10 年回頭看，這段會是分水嶺。',
    caution: '容易陷入「都我在扛」的苦情心態。難的不是做，是承認自己可以請幫手。'
  },
  Rahu: {
    verb: '冒險、跨界',
    focus: '適合「破格」的時期 — 跨界、海外機會、新興領域（科技／網路／外國市場）、非主流路線、接「聽起來太大」的案子。能見度會異常放大。',
    caution: '慾望會蓋過理性判斷 — 越光鮮亮麗的機會越要查背景。對「現在不投就來不及」這種話一律先冷靜幾週再說。'
  },
  Ketu: {
    verb: '收斂、深化',
    focus: '適合「結束與精煉」的時期 — 完成拖延多年的事、收掉不賺錢的副業、深入一個技藝、靈性／研究／幕後工作。不適合衝新事業。',
    caution: '容易突然想「砍掉重練」。大改動（辭職／拆夥）先放 3 個月再決定，你現在看事情的角度偏出世。'
  }
}

// MD × AD 搭配關係（友敵）— 兩星友好 vs 敵對會決定「這段期間是順流還是逆風」
function pairingQuality(mdLord, adLord) {
  if (mdLord === adLord) return 'same'
  const md = planetFriendship[mdLord]
  if (!md) return 'neutral'
  if (md.friends?.includes(adLord)) return 'friend'
  if (md.enemies?.includes(adLord)) return 'enemy'
  return 'neutral'
}

const pairingNote = {
  same: 'MD 與 AD 同星 — 主題深化、加倍出現、不會分心。',
  friend: 'MD 與 AD 互為友星 — 兩股能量順流、配合度高，是這波大運裡最好做事的窗口之一。',
  neutral: 'MD 與 AD 中性 — 不衝突也不特別加成，就是切換一下檔位。',
  enemy: 'MD 與 AD 互為敵星 — 兩股能量拉扯，容易內耗。挑一個主題全力、另一個先擱置。'
}

// 判斷這個 AD 是否跟使用者 pyramid 的「主軸」能量對齊
// 如果是 → 這段期間是「本命強項被放大」的時間窗
function resolveResonance(adLord, karakaOverrides, pyramid) {
  const adZh = zh[adLord] || adLord

  // 1) AD 行星 = 10 宮主（pyramid 主軸）→ 最強共振
  const pyramidPrimaryPlanet = pyramid?.primary?.planet
  if (pyramidPrimaryPlanet === adLord) {
    return {
      tier: 'primary',
      note: `這段小運由你的 10 宮主${adZh}主宰 — 本命事業力量被直接激活，該做的事別拖。`
    }
  }

  // 2) AD 行星 = pyramid 副軸（karaka override strong）→ 強項啟動
  const pyramidSecondaryPlanet = pyramid?.secondary?.planet
  if (pyramidSecondaryPlanet === adLord) {
    return {
      tier: 'primary',
      note: `這段小運由你的副軸${adZh}主宰 — 平常用不太上的那塊能量，這段期間會被拿出來用。`
    }
  }

  // 3) AD 行星在 karakaOverrides 陣列裡（medium 也算）→ 副軸時間窗
  if (Array.isArray(karakaOverrides) && karakaOverrides.length) {
    const expectedId = `karaka-override-${adLord.toLowerCase()}`
    const match = karakaOverrides.find((o) => o.id === expectedId)
    if (match) {
      if (match.strength === 'strong') {
        return {
          tier: 'primary',
          note: `${adZh}是你命盤的強 karaka — 這段期間本命力量會被啟動，值得押。`
        }
      }
      return {
        tier: 'secondary',
        note: `${adZh}是你命盤的中等 karaka — 可以順勢試試看的副軸時間窗。`
      }
    }
  }

  return null
}

function formatMonthsPhrase(months) {
  const m = Math.round(months)
  if (m <= 1) return '接下來這一個月'
  if (m <= 3) return `接下來 ${m} 個月`
  if (m <= 6) return `接下來這 ${m} 個月`
  if (m <= 9) return '接下來大半年'
  if (m <= 11) return '接下來快一年'
  if (m === 12) return '接下來這一年'
  if (m <= 16) return '接下來一年多'
  if (m <= 20) return '接下來約一年半'
  if (m <= 26) return '接下來快兩年'
  return '接下來兩年以上'
}

// ─────────────────────────────────────────────────────────────
// 主要匯出：buildAntardashaWindow
// ─────────────────────────────────────────────────────────────
// @param {Object} params
//   - mdLord: string, 當前 MD 主星（如 'Saturn'）
//   - adLord: string, 當前 AD 主星（如 'Venus'）
//   - monthsRemaining: number, AD 剩餘月數
//   - karakaOverrides: object, careerVedic 算出的 override voting 結果
//   - pyramid: object, narrative.pyramid（可選）
// @returns Object | null — 如果缺 MD 或 AD 則回 null
export function buildAntardashaWindow({
  mdLord,
  adLord,
  monthsRemaining,
  karakaOverrides,
  pyramid
}) {
  if (!mdLord || !adLord || monthsRemaining == null) return null

  const adEnergy = adCareerEnergy[adLord]
  if (!adEnergy) return null

  const pairing = pairingQuality(mdLord, adLord)
  const resonance = resolveResonance(adLord, karakaOverrides, pyramid)

  const monthsPhrase = formatMonthsPhrase(monthsRemaining)
  const adDomains = naturalKaraka[adLord]?.domains?.slice(0, 3).join('／') || ''
  const mdZh = zh[mdLord] || mdLord
  const adZh = zh[adLord] || adLord

  // Headline：一句話定位（用中文行星名，跟事業章其他敘述一致）
  const headline =
    mdLord === adLord
      ? `${monthsPhrase}，${mdZh}大運走到「自己的小運」— 主題加倍、不會分心。`
      : `${monthsPhrase}，${mdZh}大運走到${adZh}小運 — 大框架是「${mdZh}」，眼前是「${adZh}」的動作。`

  return {
    mdLord,
    adLord,
    months: Math.round(monthsRemaining),
    monthsPhrase,
    isSame: mdLord === adLord,
    pairing,
    pairingNote: pairingNote[pairing],
    headline,
    verb: adEnergy.verb,
    adDomains,
    focus: adEnergy.focus,
    caution: adEnergy.caution,
    resonance
  }
}
