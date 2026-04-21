// ═══════════════════════════════════════════════════════════════
// 事業矩陣：10 宮主 × 落宮 × 狀態 組合判讀
// ═══════════════════════════════════════════════════════════════
//
// 一句話 vs 一段話：
//   舊系統：「Mercury 當 10 宮主 → 商業/IT」
//           + 「落 2 宮 → 家族、聲音、金錢」
//           兩段獨立列出 → 讀起來很空
//
//   新系統：「Mercury 當 10 宮主 × 落 2 宮 = 金融/家族聲譽/聲音變現」
//           一句話鎖定組合意義 → 精準具體
//
// 9 行星 × 12 宮 = 108 條組合

export const karmeshMatrix = {
  Sun: {
    1: '個人品牌 × 權威 — 以名字跟臉變現的公眾人物型',
    2: '家族聲望／公職世家／繼承型權威 — 透過「家名」立業',
    3: '白手起家的領導者 — 軍政／出版／業務型開拓',
    4: '守土型管理 — 政府／教育／房產／母校為根基',
    5: '教學／演藝／創意管理 — 「舞台型」權威',
    6: '政府稽查／醫療主管／律政 — 靠處理麻煩登高位',
    7: '外交／公關／代言／合夥掌權型 — 站在台前代表機構',
    8: '保險／研究／情報／深度調查型權威',
    9: '教育體制／出版／宗教／高等政府 — 國師型',
    10: '★ 本位最強 — 政府／CEO／公眾人物，事業即人生主軸',
    11: '政界權貴／多元收入／高層人脈經營者',
    12: '海外派駐／隱居權威／幕後領導 — 在遠方或不曝光處掌權'
  },
  Moon: {
    1: '公眾親和的代言人／大眾偶像 — 情感連結型個人品牌',
    2: '家族經營／食品／聲音／情感品牌 — 母系傳承',
    3: '媒體／自媒體／社群經營 — 靠內容滋養大眾',
    4: '房產／餐飲／母嬰／居家品牌 — 最本位的月亮位置',
    5: '兒少教育／娛樂／療癒／社群娛樂創作',
    6: '護理／客服／心理諮商／食品檢驗 — 照顧型職業',
    7: '婚顧／家庭諮商／公關／大眾品牌',
    8: '心理治療／靈媒／失物尋回 — 情感深度工作',
    9: '大眾教育／家政哲學／心靈導師',
    10: '大眾偶像／女性品牌／民生霸業 — 公眾滋養者',
    11: '粉絲經濟／社群變現／大眾收入型事業',
    12: '海外家業／醫院工作／避世療癒 — 在遠方或療癒機構'
  },
  Mars: {
    1: '戰士型個人品牌 — 運動員／軍警／體能型創業家',
    2: '家族工業／武器／機械承襲 — 繼承技術與體能型家業',
    3: '白手起家戰將 — 業務衝刺／工程寫作／衝鋒型創業',
    4: '房產／建築／土地戰役 — 從土地取得財富',
    5: '運動教練／電競／子女競爭 — 「鬥技型」創造',
    6: '★ 外科／軍警／消防／衝突處理 — Mars 最強之位',
    7: '競爭型合夥／談判／運動經紀／律師',
    8: '外科急診／武術／秘密警務 — 處理危險與劇烈變動',
    9: '軍事學／法律／國際戰略 — 高階決策型',
    10: '指揮官／CEO 武將型 — 帶兵的 CEO',
    11: '多角化併購／武器貿易／投機型收入',
    12: '海外戰線／武鬥派／幕後技術 — 隱性的 Mars'
  },
  Mercury: {
    1: '知名寫手／個人 KOL／品牌代言人 — 靠嘴巴 + 臉變現',
    2: '家族金融／語言／聲音變現 — 繼承家族商道 + 口才',
    3: '記者／業務／自媒體內容 — 寫作 + 業務型白手起家',
    4: '教育／家居服務／本地商業 — 根植於地方的商業',
    5: '教學／出版／智力遊戲／投資 — 把知識變成產品',
    6: '會計／稽核／分析／醫療諮詢 — 精算師型',
    7: '諮詢顧問／公關／跨界合作 — 靠談判變現',
    8: '研究／調查／偵探／投資分析 — 深挖型智力工作',
    9: '教授／作家／出版社／國際貿易 — 高階智識傳播',
    10: '★ 商業帝國／科技／行銷管理 — 強力商業位',
    11: '平台經濟／多元副業／仲介 — 網絡節點型事業',
    12: '海外貿易／跨國會計／翻譯 — 跨境智識工作者'
  },
  Jupiter: {
    1: '教師／顧問／精神領袖型個人品牌 — 智慧變現',
    2: '金融／財務顧問／家族教育世家',
    3: '教學出版／宗教傳播／寫作講座 — 智慧延伸',
    4: '教育機構／母校歸屬／心理治療 — 根植於家學',
    5: '大學教授／子女教育／理論創作 — 智慧創造者',
    6: '法律／醫療／慈善／服務型專業',
    7: '法律合夥／婚姻諮詢／跨界導師 — 公眾導師',
    8: '研究／遺產／宗教深度／占星 — 深奧智慧',
    9: '★ 最強位 — 大學院長／教廷／國師 / 法官',
    10: '法律／教育／顧問掌舵型 — 智慧型領袖',
    11: '金融高層／基金會／慈善網絡 — 智慧變財富',
    12: '海外教育／僧侶／慈善家 — 純粹智慧追尋'
  },
  Venus: {
    1: '時尚／藝術名流個人品牌 — 美感即招牌',
    2: '奢侈品／精品家業／歌手 — 「聲音／美感」世家',
    3: '藝術寫作／時尚媒體／自媒體 — 美感傳播者',
    4: '美學居家／婚紗／花藝 — 美感根植家園',
    5: '演藝／設計師／愛情相關創作 — Venus 最自然之位',
    6: '醫美／美容醫療／疾病美容 — 美感解決問題',
    7: '婚顧／婚紗／合夥藝術 — 靠關係變美',
    8: '珠寶／遺產／情慾業務 — 奢華深度',
    9: '國際藝術／文化大使／奢華旅遊',
    10: '時尚／娛樂／高端品牌 CEO — 美感之巔',
    11: '時尚人脈／美學社群經濟 — 品味網絡',
    12: '海外藝術／幕後設計師 — 非公眾美學'
  },
  Saturn: {
    1: '長期奮鬥型個人品牌／老店 — 晚發但不敗',
    2: '家族基業／傳統金融／長青產業 — 世代承襲',
    3: '血淚自立／傳統媒體／長年撰稿 — 10 年磨一劍',
    4: '建築／房產開發／傳統製造 — 扎根型',
    5: '教育體制／保守投資／規矩教學',
    6: '法規／稽核／公務／矯正服務 — Saturn 喜歡處理麻煩',
    7: '★ 長期合夥／保險／法律事務所 — Saturn 自在位',
    8: '殯葬／保險／遺產／重症醫療 — 深重職業',
    9: '法律／傳統教育／宗教機構 — 體制型長者',
    10: '★ 大型企業／政府高層／長期統帥 — 強到無懸念',
    11: '多年累積的收入／礦業／老牌 — 時間是朋友',
    12: '海外建設／養老院／長期幕後 — 遠方的長年工作'
  },
  Rahu: {
    1: '破格型網紅／跨國新創個人 — 非主流個人品牌',
    2: '加密貨幣／跨境金融／非主流聲音 — 突破性財源',
    3: '網路自媒體／科技媒體／海外寫作',
    4: '海外房產／跨國家族事業 — 根在他鄉',
    5: '遊戲／電競／非傳統教學 — 創新創造',
    6: '爭議型律師／國際衝突／灰色領域服務',
    7: '跨國合夥／網紅聯名／外籍伴侶事業',
    8: '神秘學／非法邊界／深層研究 — Rahu 自在',
    9: '海外高教／宗教創新／跨文化教學',
    10: '★ 非主流成就／創投／科技霸業 — Rahu 頂點',
    11: '加密／病毒式收入／海外人脈 — 爆發型財富',
    12: '長期海外／隱居／跨國幕後 — Rahu 本位'
  },
  Ketu: {
    1: '獨行俠型個人品牌／極少曝光 — 神秘感變現',
    2: '古董／靈性／祕傳家族 — 小眾深度',
    3: '獨立創作／閉關寫作／傳法',
    4: '家族靈修／療癒空間 — 家即道場',
    5: '獨立創作／密傳教學 — 小眾創造',
    6: '療癒師／替代醫療／心理深療',
    7: '靈性伴侶／獨特合夥',
    8: '玄學／心理分析／通靈 — Ketu 最強位',
    9: '宗教／哲學／深層研究 — 智者幕後',
    10: '獨特專業／純技術型成就 — 低調掌權',
    11: '意外財／小眾粉絲／深度社群',
    12: '★ 出家／修行／極端幕後 — Ketu 純淨位'
  }
}

// ═══════════════════════════════════════════════════════════════
// Yoga 對事業的具體啟示
// ═══════════════════════════════════════════════════════════════
// 各 yoga ID → 它對事業判讀的「override / additional insight」
//
// 任何 yoga 判定優先於 karmesh 單點分析
export const yogaCareerReadings = {
  'mahapurusha-Mars': {
    verdict: 'Ruchaka Yoga（戰士偉人瑜伽）— 你有遠勝常人的體能／行動力／戰鬥本能',
    careerImplication: '軍警／運動員／外科醫師／創業型執行者 — 挑帶對手性、體力、危險的職業能爆發',
    strength: 'strong'
  },
  'mahapurusha-Mercury': {
    verdict: 'Bhadra Yoga（智慧偉人瑜伽）— 商業嗅覺與智力屬於頂尖',
    careerImplication: '商業家／律師／顧問／教育家／企業家 — 靠「腦子 + 嘴」登峰造極',
    strength: 'strong'
  },
  'mahapurusha-Jupiter': {
    verdict: 'Hamsa Yoga（聖者偉人瑜伽）— 具智慧威望與道德影響力',
    careerImplication: '法官／教授／宗教領袖／政商兼備的長者 — 越老越重',
    strength: 'strong'
  },
  'mahapurusha-Venus': {
    verdict: 'Malavya Yoga（藝術偉人瑜伽）— 強烈的美感＋魅力能變現',
    careerImplication: '藝術家／時尚／娛樂／高端品牌 — 你賣的是「美」本身',
    strength: 'strong'
  },
  'mahapurusha-Saturn': {
    verdict: 'Shasha Yoga（紀律偉人瑜伽）— 領導力 + 耐力都在頂尖',
    careerImplication: '大企業 CEO／政府首長／長期工程 — 越晚越值錢',
    strength: 'strong'
  },
  'gaja-kesari': {
    verdict: 'Gaja Kesari Yoga（象王瑜伽）— 智慧 × 貴人雙加持',
    careerImplication: '中年後會累積實質聲望；關鍵時刻一定有貴人出現；判斷力強',
    strength: 'medium'
  },
  'budha-aditya': {
    verdict: 'Budha Aditya Yoga（水太陽）— 講話別人會信服',
    careerImplication: '適合做「會發聲」的角色 — 顧問、律師、演講者、作家、公眾人物',
    strength: 'medium'
  },
  'chandra-mangal': {
    verdict: 'Chandra Mangal Yoga（月火）— 商業直覺 × 行動力的融合',
    careerImplication: '「感覺對了就衝」的創業家；零售／房產／金融投資常見；但情緒波動會影響財務',
    strength: 'medium'
  },
  'raj-yoga': {
    verdict: 'Raj Yoga（皇家瑜伽）— 命中帶「走向高位」的格局',
    careerImplication: '你會走到「帶人／主導／有聲望」的位置；難長期當員工',
    strength: 'medium'
  },
  'dhana-yoga': {
    verdict: 'Dhana Yoga（財富瑜伽）— 錢源多元會自然進來',
    careerImplication: '不會為錢苦；收入從多管道累積（本業＋副業＋投資＋人脈）',
    strength: 'medium'
  },
  'saraswati': {
    verdict: 'Saraswati Yoga（智慧女神瑜伽）— 知識／藝術／表達三合一天賦',
    careerImplication: '教學／寫作／創作／出版／表演 — 多才多藝的知識型職業',
    strength: 'medium'
  },
  'parivartana': {
    verdict: 'Parivartana Yoga（互換瑜伽）— 兩個生活領域強力綁定',
    careerImplication: '兩顆互換行星管轄的事業領域會聯動 — 一個起另一個跟著起',
    strength: 'strong'
  },
  'neecha-bhanga': {
    verdict: 'Neecha Bhanga Raja Yoga（低谷翻轉瑜伽）— 陷落被解消',
    careerImplication: '該行星的領域你會「從很低的起點爬起、反而更強」；早期挫折會變成後期本錢',
    strength: 'strong'
  },
  'vipreet-raj': {
    verdict: 'Vipreet Raj Yoga（反向皇家瑜伽）— 苦難轉化為成就',
    careerImplication: '你的事業故事常含「從谷底站起來」的轉折；困境反而成為人生本錢',
    strength: 'strong'
  },
  'kemadruma': {
    verdict: 'Kemadruma Yoga（月孤瑜伽）— 心智孤立',
    careerImplication: '需要刻意建立工作上的情感支援系統；單打獨鬥容易耗竭',
    strength: 'warn'
  }
}

// ═══════════════════════════════════════════════════════════════
// 合成 Narrative：把所有關鍵發現揉成一段「具體到你命盤」的描述
// ═══════════════════════════════════════════════════════════════
// 不只是列清單 — 而是把 10 宮主 × 落宮 × 尊嚴 × Yoga × Lagna Lord
// 綁成一段話，讀起來像專業占星師口中的「你這張盤」判讀
export function synthesizeCareerNarrative(analysis) {
  const { karmesh, lagnaLord, activeCareerYogas, dignityDetails } = analysis
  if (!karmesh?.planet) return null

  const parts = []

  // Part 1: 本質 — 10 宮主 × 落宮 組合
  const matrixKey = karmeshMatrix[karmesh.planet]?.[karmesh.house]
  if (matrixKey) {
    parts.push(`你的事業核心配置是「${karmesh.planet} 作為 10 宮主，落第 ${karmesh.house} 宮」— ${matrixKey}。`)
  }

  // Part 2: 尊嚴細節
  if (dignityDetails) {
    const strongMods = []
    if (dignityDetails.dignity === 'exalted') strongMods.push(`此行星旺於 ${karmesh.rashi?.chinese}，是「自然發光」的配置`)
    else if (dignityDetails.dignity === 'own') strongMods.push(`此行星在本宮 ${karmesh.rashi?.chinese}，力量穩固`)
    else if (dignityDetails.dignity === 'debilitated' && !dignityDetails.neechaBhanga) {
      strongMods.push(`此行星陷於 ${karmesh.rashi?.chinese}，需其他支持才能翻轉`)
    }
    if (dignityDetails.moolatrikona) strongMods.push('且位於 Moolatrikona 根本位 — 更具穩定力')
    if (dignityDetails.digbala) strongMods.push('此外落於 Digbala（方向力）最強宮位 — 能見度倍增')
    if (dignityDetails.neechaBhanga) strongMods.push('但 Neecha Bhanga 解消 — 低谷反而翻盤')
    if (strongMods.length) parts.push(strongMods.join('；') + '。')
  }

  // Part 3: Lagna Lord 加乘
  if (lagnaLord?.planet && lagnaLord.planet !== karmesh.planet) {
    const llMatrixKey = karmeshMatrix[lagnaLord.planet]?.[lagnaLord.house]
    if (llMatrixKey) {
      parts.push(
        `你的命主星 ${lagnaLord.planet} 落第 ${lagnaLord.house} 宮，為事業判讀加第二層重量 — 若把命主星當事業副主看：${llMatrixKey.split('—')[1]?.trim() || llMatrixKey}。`
      )
    }
  }

  // Part 4: Yoga 重要加權
  if (activeCareerYogas?.length) {
    const strongOnes = activeCareerYogas.filter((y) => y.strength === 'strong').slice(0, 2)
    if (strongOnes.length) {
      parts.push(
        `更關鍵的是：你的命盤有 ${strongOnes.map((y) => y.verdict.split('—')[0].trim()).join(' + ')}，這會 override 單點分析 — ${strongOnes[0].careerImplication}。`
      )
    }
  }

  return parts.join('\n\n')
}
