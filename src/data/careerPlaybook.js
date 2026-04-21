// 事業實操 Playbook
//
// 解決「看完不知道怎麼找工作」的痛點 — 把命盤分析轉成 5 個具體問題：
//   1. 你是什麼型
//   2. 該鎖定的產業
//   3. 要避開的工作類型
//   4. 當前大運的時機信號
//   5. 接下來 3 件具體該做的事
//
// 依據：
//   karmesh planet + house → 身份 + 適合產業 + 避開
//   lagna lord planet     → 補充角度
//   current dasha lord    → 時機信號
//   active yogas          → 加權建議

import { planetAsKarmesh } from './careerVedicData.js'

// ═══════════════════════════════════════════════════════════════
// 1. 身份（karmesh planet → 一句話職業人格）
// ═══════════════════════════════════════════════════════════════
export const careerIdentityByPlanet = {
  Sun: {
    label: '權威登台型',
    why: '你不是員工命 — 不站出來的話你會內心爛掉。一定要有「頭銜／光環／代表位」才會活過來。'
  },
  Moon: {
    label: '公眾滋養型',
    why: '事業要跟「大眾／家／情感」連結。純技術、純邏輯的崗位會讓你空虛。'
  },
  Mars: {
    label: '戰鬥執行型',
    why: '坐辦公室會爛 — 你需要有「對手」或「體力挑戰」。承平型工作對你是酷刑。'
  },
  Mercury: {
    label: '智慧商業型',
    why: '你靠「腦袋 + 嘴」賺錢 — 純體力活會累死你。要有資訊、有談判、有腦袋空間。'
  },
  Jupiter: {
    label: '導師顧問型',
    why: '你不是打工仔 — 你需要「傳承、帶人、被請教」的位置。打雜工作會讓你覺得浪費生命。'
  },
  Venus: {
    label: '美感表演型',
    why: '醜的環境會把你吸乾 — 美感不是 nice-to-have，是你的工作燃料。'
  },
  Saturn: {
    label: '體系建設型',
    why: '不要急 — 你的成就是 10 年後的人。扎實的、長期的、結構性的事業才是你的戰場。'
  },
  Rahu: {
    label: '破格創新型',
    why: '走非主流路線你才贏 — 傳統路線你會卡死。海外、科技、網紅、新興是你的主場。'
  },
  Ketu: {
    label: '幕後深度型',
    why: '不要上舞台 — 你的力量在深挖。研究、靈性、療癒、獨立創作最適合你。'
  }
}

// ═══════════════════════════════════════════════════════════════
// 2. House 脈絡（告訴你「身份要套用在哪種場合」）
// ═══════════════════════════════════════════════════════════════
export const careerHouseModifier = {
  1: '用自己的名字立身（個人品牌型）',
  2: '家族／語言／聲音是你的護城河',
  3: '白手起家 — 靠業務、寫作、短程衝刺',
  4: '根植於「家」— 房產、本地、家族事業',
  5: '透過創造、教學、子女型產出變現',
  6: '處理麻煩、服務別人是你的天職',
  7: '靠合夥、客戶、公眾面對變現',
  8: '深挖、研究、他人資源是你的領域',
  9: '遠方、教學、高等知識帶你走',
  10: '★ 最本位 — 舞台就是你的主場',
  11: '多元網絡、社群、平台是你的放大器',
  12: '在幕後、海外、療癒空間發光'
}

// ═══════════════════════════════════════════════════════════════
// 3. 要避開的工作類型（karmesh planet → 避開模式）
// ═══════════════════════════════════════════════════════════════
export const careerAvoidByPlanet = {
  Sun: '避開沒有能見度、永遠不能代表公司的位置 — 你會失去自己。階層太多、上面永遠壓你的環境也要閃。',
  Moon: '避開冷冰冰、純邏輯、無大眾連結的崗位 — 你會情感枯竭。只面對機器不面對人的工作是你的地獄。',
  Mars: '避開官僚、僵化、需要長期被壓的環境 — 你會內耗到爆。太和諧、不能爭的公司也會悶死你。',
  Mercury: '避開重複單調、沒溝通機會、不用動腦的職位 — 你的優勢發揮不出來。單純操作、不能談判的工作是浪費你。',
  Jupiter: '避開格局小、不能成長、讓你覺得「意義很低」的工作。純執行、沒有 mentorship 的環境會讓你內心萎縮。',
  Venus: '避開醜、粗糙、沒有美感、只講效率不講人的環境 — 你的天賦會被吸乾。純工程、純理性的公司不適合。',
  Saturn: '避開短期、浮誇、靠口號的新創 — 10 年後還在的公司才是你的戰場。不穩定、朝令夕改的環境會讓你崩潰。',
  Rahu: '避開太傳統、太守規矩的大公司 — 你會很快無聊並出錯。純本土、沒有突破空間的環境也會壓死你。',
  Ketu: '避開需要大量社交、表演、推銷的職位 — 那對你是酷刑。純面對人、要裝 high 的工作是你的反向。'
}

// ═══════════════════════════════════════════════════════════════
// 4. 當前大運時機信號（current dasha lord → 換工作建議）
// ═══════════════════════════════════════════════════════════════
export const dashaCareerSignal = {
  Sun: {
    phase: '登台期',
    signal: '爭取曝光位、能見度、代表職 — 現在不是蹲在幕後的時候。這 6 年適合站出來拿頭銜。',
    moveFriendly: true
  },
  Moon: {
    phase: '情感大眾期',
    signal: '靠親和力 + 照顧人的職位最順。跟大眾、女性、民生、療癒相關的方向這 10 年最有利。',
    moveFriendly: true
  },
  Mars: {
    phase: '衝刺期',
    signal: '適合跳槽、開戰、挑戰型職位 — 這 7 年是戰神能量，守著舊職會浪費這個大運。',
    moveFriendly: true
  },
  Mercury: {
    phase: '商業智慧爆發',
    signal: '適合跳到更大平台 — 這 17 年是你人生最具生產力的黃金歲月，別待在小池子裡。',
    moveFriendly: true
  },
  Jupiter: {
    phase: '擴張期',
    signal: '跨國／教學／顧問型機會會找上門 — 接下來 16 年是你名聲與智慧擴張的時候。',
    moveFriendly: true
  },
  Venus: {
    phase: '美感享受期',
    signal: '創作、品牌、客戶關係、美感產業最甜的 20 年 — 如果現職沒讓你享受到美，該換了。',
    moveFriendly: true
  },
  Saturn: {
    phase: '扎根期',
    signal: '這 19 年適合守城、深耕長期專案 — 不是頻繁換跑道的時候。跳槽前要確認能做長才值得。',
    moveFriendly: false
  },
  Rahu: {
    phase: '破格期',
    signal: '非主流／國際／科技／新興行業最有利 — 這 18 年就是要「做別人覺得奇怪但你知道對的事」。',
    moveFriendly: true
  },
  Ketu: {
    phase: '清空期',
    signal: '可以斷捨離舊身份、準備轉向 — 這 7 年不強求立刻定位。錯過也沒關係。',
    moveFriendly: false
  }
}

// ═══════════════════════════════════════════════════════════════
// 5. 合成 Playbook
// ═══════════════════════════════════════════════════════════════
export function synthesizeCareerPlaybook(vedicCareer) {
  if (!vedicCareer) return null

  const karmeshPlanet = vedicCareer.karmesh?.planet
  const karmeshHouse = vedicCareer.karmesh?.house
  const lagnaLordPlanet = vedicCareer.lagnaLord?.planet
  const lagnaLordHouse = vedicCareer.lagnaLord?.house
  const currentDashaLord = vedicCareer.dasha?.lord
  const dashaIsKarmesh = vedicCareer.dasha?.isKarmesh
  const karakaOverrides = vedicCareer.karakaOverrides || []
  const activeYogas = vedicCareer.activeCareerYogas || []
  const strongYoga = activeYogas.find((y) => y.strength === 'strong')

  // 1. 身份
  const identity = careerIdentityByPlanet[karmeshPlanet]
  const houseContext = careerHouseModifier[karmeshHouse]

  // 2. 產業推薦（合併 karmesh 主行 + lagnaLord 主行 + karaka override category）
  const industrySet = []
  const seen = new Set()
  const addIndustry = (s) => {
    if (!s) return
    if (seen.has(s)) return
    seen.add(s)
    industrySet.push(s)
  }

  // 主路線：karmesh 的職業（拿 coreProfessions 前 3 個）
  const karmeshProfs = planetAsKarmesh[karmeshPlanet]?.coreProfessions || []
  karmeshProfs.slice(0, 3).forEach(addIndustry)

  // 輔助路線：lagna lord 的職業（與 karmesh 不同才加）
  if (lagnaLordPlanet && lagnaLordPlanet !== karmeshPlanet) {
    const lagnaLordProfs = planetAsKarmesh[lagnaLordPlanet]?.coreProfessions || []
    lagnaLordProfs.slice(0, 2).forEach(addIndustry)
  }

  // Karaka override 的 category（運動／藝術／工業等身份）
  karakaOverrides.slice(0, 1).forEach((k) => {
    if (k?.category) addIndustry(k.category)
  })

  const industries = industrySet.slice(0, 6)

  // 3. 避開
  const avoid = careerAvoidByPlanet[karmeshPlanet]

  // 4. 當前大運訊號
  const dashaSignal = currentDashaLord
    ? {
        lord: currentDashaLord,
        ...dashaCareerSignal[currentDashaLord],
        isKarmesh: dashaIsKarmesh
      }
    : null

  // 5. Action items（3 條具體）
  const actions = []

  // Action 1: 產業鎖定
  if (industries.length >= 3) {
    actions.push(
      `先鎖定「${industries.slice(0, 3).join(' / ')}」這三類方向投履歷、聽 podcast、看職缺 — 這是你命盤給的主軸。`
    )
  }

  // Action 2: 當前大運行動
  if (dashaSignal) {
    const prefix = dashaSignal.isKarmesh
      ? `你正在走自己的 10 宮主大運（${currentDashaLord}）— 事業最強時刻。`
      : `你正在走 ${currentDashaLord} 大運 — ${dashaSignal.phase}。`
    actions.push(`${prefix}${dashaSignal.signal}`)
  }

  // Action 3: 依據 yoga / karaka override / lagnaLord 給具體建議
  if (strongYoga) {
    actions.push(
      `你命盤啟動了「${strongYoga.verdict.split('—')[0].trim()}」 — ${strongYoga.careerImplication} · 這是你比同齡人多的「天賦加成」，找工作時要挑能用到這個的位置。`
    )
  } else if (karakaOverrides[0]) {
    actions.push(
      `你的 Amatyakaraka（事業靈魂星）指向 ${karakaOverrides[0].category} — 即使 10 宮主沒直接指這個方向，靈魂層面你要的是這個。把它當副業或長期目標。`
    )
  } else if (lagnaLordPlanet && lagnaLordHouse) {
    const lagnaProfs = planetAsKarmesh[lagnaLordPlanet]?.coreProfessions?.slice(0, 2).join('、')
    actions.push(
      `你的命主星 ${lagnaLordPlanet} 落第 ${lagnaLordHouse} 宮 — 這意味著「${lagnaProfs}」類路線會給你第二層動力，可以當副線同時推。`
    )
  } else {
    actions.push(avoid)
  }

  return {
    identity: identity
      ? {
          label: identity.label,
          houseContext,
          why: identity.why
        }
      : null,
    industries,
    avoid,
    dashaSignal,
    actions
  }
}
