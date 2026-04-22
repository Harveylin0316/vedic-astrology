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

// ═══════════════════════════════════════════════════════════════
// 工作能量特徵（代替「硬塞職業列表」的古板做法）
// ═══════════════════════════════════════════════════════════════
//
// 古典 planetAsKarmesh.coreProfessions 是「字面職業列表」（建築師／醫師／律師…）
// 放到現代用戶眼前會變成「職稱 filter」— 跟他實際興趣脫節
//
// 新做法：描述「你工作時需要的能量」+「現代具體範例」+「甜蜜點」
// 這樣即使用戶不是「建築師」，也能在 infra engineer / PM / editor 裡找到對的能量
export const careerEnergyByPlanet = {
  Sun: {
    energy: '需要「被看見、有頭銜、代表一個東西」的工作',
    modernExamples: ['公司代言人／Founder', 'PM／部門主管', '品牌負責人', 'KOL／自媒體', '公部門首長', '節目主持／演講者'],
    sweetSpot: '站在光下掌權'
  },
  Moon: {
    energy: '需要「跟大眾連結、照顧人、有情感溫度」的工作',
    modernExamples: ['UX／用戶研究', '品牌社群經營', '護理／照護', '餐飲服務', '客服主管', '兒少教育', '媒體製作'],
    sweetSpot: '面對人、不是面對機器'
  },
  Mars: {
    energy: '需要「體能挑戰、有對手、短期衝刺感」的工作',
    modernExamples: ['Growth Marketing', '新創 VP 或 COO', '業務開發', '運動相關', '健身教練', '外科／急診', '消防'],
    sweetSpot: '能戰、要快、有競爭'
  },
  Mercury: {
    energy: '需要「用腦袋 + 嘴巴 + 多線並行」的工作',
    modernExamples: ['產品經理', '業務／BD', '作家／自媒體', '投資分析', '律師', '顧問', '獵頭', '教師／講師'],
    sweetSpot: '用語言或數字把事情搞定'
  },
  Jupiter: {
    energy: '需要「傳承、智慧、有影響力」的工作',
    modernExamples: ['大學教授', '法官／資深律師', '金融高階', '主編', 'Podcast 主持', '心理師', 'NGO 創辦人', '投資人'],
    sweetSpot: '當 mentor 不當 operator'
  },
  Venus: {
    energy: '需要「美感、享受、跟人打交道」的工作',
    modernExamples: ['設計師（UI／室內／時裝）', '時尚編輯', '品牌策略', '攝影師', '公關', '演員／歌手', '甜點／餐飲品牌'],
    sweetSpot: '創造漂亮的東西 + 跟人相處'
  },
  Saturn: {
    energy: '需要「長期耕耘、扎實結構、不怕慢」的工作',
    modernExamples: ['資深 PM', 'Infra／平台工程', '建築師', '產品工業設計', '編輯', '法律事務所', '公部門高階', '家業繼承'],
    sweetSpot: '做會存在十年的東西'
  },
  Rahu: {
    energy: '需要「海外、科技、非主流、突破性」的工作',
    modernExamples: ['AI／ML 工程', 'Web3／加密貨幣', '跨境電商', '網紅經紀', '外交', '國際銷售', '遊戲開發'],
    sweetSpot: '走別人看不懂的路'
  },
  Ketu: {
    energy: '需要「深挖、獨立、少社交」的工作',
    modernExamples: ['資料科學家', '研究員', '心理治療', '占星／玄學', '紀錄片導演', '自由接案', '獨立作家'],
    sweetSpot: '一個人也能深得下去'
  }
}

import { planetAsKarmesh } from './careerVedicData.js'
import { careerSubCategoryLanguage } from './careerSubCategoryLanguage.js'
import { resolvePrimarySecondary } from './careerMatrix.js'

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
  10: '最本位 — 舞台就是你的主場',
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
// 5. 合成 Playbook（v4：三層優先級架構 — primary / secondary / avoidCareer）
// ═══════════════════════════════════════════════════════════════
//
// 改動核心：不再把 karmesh + lagnaLord + karaka + D10 平鋪並列，而是依 pyramid
// 判讀後分三層呈現：
//   - primary（主軸）     — karmesh 能量、職業範例、甜蜜點
//   - secondary（副軸）   — 執行風格（可能 null）
//   - avoidCareer（避開） — 不該當主業的方向（可能 null）
export function synthesizeCareerPlaybook(vedicCareer) {
  if (!vedicCareer) return null

  const karmeshPlanet = vedicCareer.karmesh?.planet
  const karmeshHouse = vedicCareer.karmesh?.house
  const lagnaLord = vedicCareer.lagnaLord
  const currentDashaLord = vedicCareer.dasha?.lord
  const dashaIsKarmesh = vedicCareer.dasha?.isKarmesh
  const karakaOverrides = vedicCareer.karakaOverrides || []
  const activeYogas = vedicCareer.activeCareerYogas || []
  const strongYoga = activeYogas.find((y) => y.strength === 'strong')
  const subCategoryDetection = vedicCareer.subCategoryDetection || null

  // 使用 pyramid resolver 判讀（若上游已算好則直接用，否則現場算）
  const pyramid = vedicCareer.pyramid || resolvePrimarySecondary({
    karmesh: { planet: karmeshPlanet, house: karmeshHouse, rashi: vedicCareer.karmesh?.rashi },
    lagnaLord,
    karakaOverrides,
    d10: vedicCareer.d10,
    dasha: vedicCareer.dasha,
    dignityDetails: vedicCareer.karmesh?.dignityDetails,
    karmeshContext: vedicCareer.karmeshContext || {}
  })

  // ─── 1. 身份（依 primary planet）───
  const identity = careerIdentityByPlanet[karmeshPlanet]
  const houseContext = careerHouseModifier[karmeshHouse]

  // ─── 2. PRIMARY（主軸）──────────────────────────────
  const karmeshEnergy = careerEnergyByPlanet[karmeshPlanet]
  const primary = karmeshEnergy
    ? {
        energy: karmeshEnergy.energy,
        examples: karmeshEnergy.modernExamples.slice(0, 5),
        sweetSpot: karmeshEnergy.sweetSpot,
        why: pyramid.primary?.why || `10 宮主 ${karmeshPlanet} 落第 ${karmeshHouse} 宮`,
        keyFacts: pyramid.primary?.keyFacts || []
      }
    : null

  // ─── 3. SECONDARY（副軸 · 可能 null）──────────────────
  let secondary = null
  if (pyramid.secondary?.planet) {
    const sPlanet = pyramid.secondary.planet
    const sEnergy = careerEnergyByPlanet[sPlanet]
    if (sEnergy) {
      // integration：挑能融合兩顆能量的職業 — 從 secondary 範例裡挑 2-3 個
      const integrationExamples = sEnergy.modernExamples.slice(0, 3)
      secondary = {
        planet: sPlanet,
        energy: sEnergy.energy,
        examples: integrationExamples,
        integration: pyramid.secondary.integrationAdvice ||
          `在主軸職位裡挑有 ${sEnergy.sweetSpot} 的版本`,
        why: pyramid.secondary.why,
        source: pyramid.secondary.source,
        keyFacts: pyramid.secondary.keyFacts || []
      }
    }
  }

  // ─── 4. AVOID CAREER（避開當主業 · 可能 null）─────────
  let avoidCareer = null
  if (pyramid.avoid?.planet) {
    const aPlanet = pyramid.avoid.planet
    const aEnergy = careerEnergyByPlanet[aPlanet]
    if (aEnergy) {
      avoidCareer = {
        planet: aPlanet,
        // 避開範例：挑 3-4 個該行星的代表職業當「不要當主業」清單
        examples: aEnergy.modernExamples.slice(0, 4),
        why: pyramid.avoid.why,
        keyFacts: pyramid.avoid.keyFacts || []
      }
    }
  }

  // ─── 5. 舊版「避開 environment」文本（保留作輔助說明）───
  const avoid = careerAvoidByPlanet[karmeshPlanet]

  // ─── 6. 當前大運時機訊號 ─────────────────────────────
  const dashaSignal = currentDashaLord
    ? {
        lord: currentDashaLord,
        ...dashaCareerSignal[currentDashaLord],
        isKarmesh: dashaIsKarmesh
      }
    : null

  const timing = dashaSignal ? {
    lord: dashaSignal.lord,
    phase: dashaSignal.phase,
    signal: dashaSignal.signal,
    isKarmesh: dashaSignal.isKarmesh,
    moveFriendly: dashaSignal.moveFriendly
  } : null

  // ─── 7. Action items（新架構：對齊 primary / secondary / avoid）───
  const actions = []

  // Action 1：鎖定主軸甜蜜點
  if (primary) {
    actions.push(
      `主軸先鎖死 — 找「${primary.sweetSpot}」類型的職位（${primary.examples.slice(0, 3).join('／')}）。職稱不同沒差，能量對就算。`
    )
  }

  // Action 2：副軸融合建議（若有）或大運
  if (secondary) {
    actions.push(
      `在主軸裡挑帶 ${secondary.planet} 調性的版本 — ${secondary.integration}。例：${secondary.examples.slice(0, 2).join('、')} 方向的主軸職位。`
    )
  } else if (dashaSignal) {
    const prefix = dashaSignal.isKarmesh
      ? `你正在走自己 10 宮主（${currentDashaLord}）大運 — 事業最強時刻。`
      : `你正在走 ${currentDashaLord} 大運 — ${dashaSignal.phase}。`
    actions.push(`${prefix}${dashaSignal.signal}`)
  }

  // Action 3：避開／yoga 加成
  if (avoidCareer) {
    actions.push(
      `別把「${avoidCareer.examples.slice(0, 2).join('／')}」當主業 — ${avoidCareer.why.split('—')[1]?.trim() || '那是調味料不是主食'}。`
    )
  } else if (strongYoga) {
    actions.push(
      `你命盤啟動了「${strongYoga.verdict.split('—')[0].trim()}」 — ${strongYoga.careerImplication}。找工作時挑能用到這個的位置。`
    )
  } else if (dashaSignal && !secondary) {
    // 如果 action 2 已經用過 dasha，這裡就給 avoid
    actions.push(avoid)
  } else {
    actions.push(avoid)
  }

  // ─── 8. Sub-Category（保留）───
  let subCategory = null
  if (subCategoryDetection?.primary && subCategoryDetection.confidence === 'high') {
    const lang = careerSubCategoryLanguage[subCategoryDetection.primary]
    if (lang) {
      subCategory = {
        key: subCategoryDetection.primary,
        confidence: subCategoryDetection.confidence,
        reasoning: subCategoryDetection.reasoning,
        alternates: subCategoryDetection.alternates,
        ...lang
      }
    }
  }

  return {
    // 身份（延用舊結構讓 UI 漸進 migrate）
    identity: identity
      ? {
          label: identity.label,
          houseContext,
          why: identity.why
        }
      : null,
    // 新架構：三層
    primary,
    secondary,
    avoidCareer,
    timing,
    // 舊 field 向後相容（UI 轉完可以移除）
    energyPattern: primary?.energy || null,
    modernExamples: primary?.examples || [],
    sweetSpot: primary?.sweetSpot ? `「${primary.sweetSpot}」` : null,
    avoid,
    dashaSignal,
    actions,
    subCategory
  }
}
