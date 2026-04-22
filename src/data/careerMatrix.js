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
    5: {
      default: '運動教練／電競／子女競爭 — 「鬥技型」創造',
      withVenus: '運動明星／舞者／動感藝術家（Messi 型）',
      withMercury: '運動解說／體育寫手／競技策略家',
      withJupiter: '運動哲學家／武術宗師／體育教育'
    },
    6: '★ 外科／軍警／消防／衝突處理 — Mars 最強之位',
    7: '競爭型合夥／談判／運動經紀／律師',
    8: '外科急診／武術／秘密警務 — 處理危險與劇烈變動',
    9: {
      default: '軍事學／法律／國際戰略 — 高階決策型',
      withVenus: '國際運動巨星／動作巨星（SRK 型）／武術表演',
      withMercury: '國際體育評論／跨國軍事學者',
      withJupiter: '軍事哲學／國際法律／戰略智囊'
    },
    10: {
      default: '指揮官／CEO 武將型 — 帶兵的 CEO',
      withVenus: '運動時尚品牌 CEO／動作片製片人／運動員企業家',
      withMercury: '體育傳媒集團／運動電商／競技商業帝國',
      withSun: '軍政首長／國家級領袖／總司令型'
    },
    11: '多角化併購／武器貿易／投機型收入',
    12: '海外戰線／武鬥派／幕後技術 — 隱性的 Mars'
  },
  Mercury: {
    1: '知名寫手／個人 KOL／品牌代言人 — 靠嘴巴 + 臉變現',
    2: '家族金融／語言／聲音變現 — 繼承家族商道 + 口才',
    3: {
      default: '記者／業務／自媒體內容 — 寫作 + 業務型白手起家',
      withVenus: '時尚媒體／藝術書寫／美感內容創作',
      withMars: '體育記者／競技評論／業務衝刺型寫作',
      withSaturn: '傳統媒體／嚴肅書寫／工業報導',
      withJupiter: '教學型寫作／哲學散文／正統知識傳播'
    },
    4: '教育／家居服務／本地商業 — 根植於地方的商業',
    5: '教學／出版／智力遊戲／投資 — 把知識變成產品',
    6: '會計／稽核／分析／醫療諮詢 — 精算師型',
    7: '諮詢顧問／公關／跨界合作 — 靠談判變現',
    8: '研究／調查／偵探／投資分析 — 深挖型智力工作',
    9: {
      default: '教授／作家／出版社／國際貿易 — 高階智識傳播',
      withVenus: '國際演藝／海外音樂／跨國時尚表演 — 智識 × 藝術',
      withMars: '國際運動／跨國競技／海外軍事戰略 — 智識 × 戰鬥',
      withSaturn: '國際工業／跨國法律／長期外貿 — 智識 × 體系',
      withJupiter: '學術殿堂／哲學大師／國際宗教領袖 — 最正統智識'
    },
    10: {
      default: '★ 商業帝國／科技／行銷管理 — 強力商業位',
      withVenus: '娛樂／時尚／藝術商業帝國 — 美感變商業',
      withMars: '運動商業／體育帝國／競技事業 — 戰士型商業',
      withSaturn: '傳統工業／重工／建設集團 — 長期型商業',
      withJupiter: '教育帝國／宗教組織／智慧大師 — 非商業的正統權威'
    },
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
    4: {
      default: '美學居家／婚紗／花藝 — 美感根植家園',
      withMars: '動感美學／舞蹈／運動美妝 — 美 × 動',
      withMercury: '美學內容創作／時尚文案／設計教學',
      withSaturn: '傳統精品／家族老牌／工藝傳承',
      withSun: '公眾美學／皇室級精品／官方代言 — 美 × 權威'
    },
    5: '演藝／設計師／愛情相關創作 — Venus 最自然之位',
    6: '醫美／美容醫療／疾病美容 — 美感解決問題',
    7: '婚顧／婚紗／合夥藝術 — 靠關係變美',
    8: '珠寶／遺產／情慾業務 — 奢華深度',
    9: {
      default: '國際藝術／文化大使／奢華旅遊',
      withMercury: '跨國演藝／海外歌手／多語言藝術 — 藝 × 智',
      withMars: '國際運動美學／舞蹈家／武術表演',
      withJupiter: '跨國宗教藝術／文化傳承者／學院派美學'
    },
    10: {
      default: '時尚／娛樂／高端品牌 CEO — 美感之巔',
      withMercury: '歌手 × 商業帝國（Beyoncé 型）／時尚寫手兼 CEO',
      withMars: '動作派演員／運動時尚／舞者 CEO',
      withSun: '皇室級演藝／國家級表演藝術／名譽藝術家'
    },
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
// 選擇 karmeshMatrix 讀法（支援多語境）
// ═══════════════════════════════════════════════════════════════
//
// karmeshMatrix[planet][house] 可以是：
//   - string         — 直接返回
//   - object         — { default, withMars, withVenus, withMercury, withJupiter, withSaturn, withSun }
//                       按照 context 選擇最相關的
//
// context.conjoinPlanets — 10 宮內（或與 karmesh 同宮）的其他行星
// context.amatyakarakaPlanet — 若 AMK 是特定行星，也作為 override 參考
//
// v4：只有 conjoinPlanets 才會直接切換 variant；AMK 單獨不足以切換，必須配合
// strongSignificators（強旺徵象星 top-3）才能生效，避免 Lincoln（AMK Venus）
// 被誤判成「動作／運動巨星」。
export function selectKarmeshReading(planet, house, context = {}) {
  const cell = karmeshMatrix[planet]?.[house]
  if (!cell) return null
  if (typeof cell === 'string') return cell

  // object 版本：依照 context 挑
  const conjoinList = context.conjoinPlanets || []
  const amkPlanet = context.amatyakarakaPlanet
  const strongSigs = context.strongSignificators || []
  const priorityOrder = ['Venus', 'Mars', 'Saturn', 'Jupiter', 'Mercury', 'Sun'] // 影響力順序

  // Pass 1：conjoin 共位直接觸發（最強訊號）
  for (const checkPlanet of priorityOrder) {
    const variant = cell[`with${checkPlanet}`]
    if (!variant) continue
    if (conjoinList.includes(checkPlanet)) return variant
  }
  // Pass 2：AMK + strong significator 雙重確認 才觸發
  for (const checkPlanet of priorityOrder) {
    const variant = cell[`with${checkPlanet}`]
    if (!variant) continue
    if (amkPlanet === checkPlanet && strongSigs.includes(checkPlanet)) return variant
  }
  return cell.default
}

// ═══════════════════════════════════════════════════════════════
// Karaka Override Layer — 自然事業徵象星壓倒性強時，加身份標籤
// ═══════════════════════════════════════════════════════════════
//
// 當 Amatyakaraka（事業靈魂星）或 Top Significator 是下列其一且旺/本宮：
//   Mars  → 運動／軍警／外科 身份加權 override
//   Venus → 演藝／藝術／時尚 身份加權 override
//   Saturn → 工業／重工／長期建設 身份加權 override
//   Jupiter → 教學／宗教／法律／智慧領袖 身份加權 override
//   Sun  → 政府／公職／名譽 身份加權
//
// 目的：救回 Beyoncé（Venus 藝術）、Messi（Mars 運動）、Dalai Lama（Jupiter 宗教）、Tata（Saturn 工業）
// 這類「被 10 宮主決定論壓過」的案例
export const karakaOverrideReadings = {
  Mars: {
    id: 'karaka-override-mars',
    category: '運動 / 軍警 / 外科',
    verdict: '運動員型 · 戰士型職業身份',
    implication: '不論 10 宮主指哪方向，你命盤中 Mars 強到足以讓「運動／軍警／外科／體力型創業」成為核心身份。Mars 主導的案例常在「靠身體／靠膽量」的領域發光。'
  },
  Venus: {
    id: 'karaka-override-venus',
    category: '演藝 / 藝術 / 時尚',
    verdict: '藝術家／表演者型職業身份',
    implication: '不論 10 宮主指哪方向，你命盤中 Venus 強到足以讓「演藝／音樂／時尚／美感產業」成為核心身份。Venus 主導的案例常在「靠美感／靠魅力」的領域發光。'
  },
  Saturn: {
    id: 'karaka-override-saturn',
    category: '工業 / 重工 / 長期建設',
    verdict: '工業家／體系建設者型職業身份',
    implication: '不論 10 宮主指哪方向，你命盤中 Saturn 強到足以讓「工業／重工／基礎建設／長期體系」成為核心身份。Saturn 主導的案例常走「10 年磨一劍」路線、晚發但不敗。'
  },
  Jupiter: {
    id: 'karaka-override-jupiter',
    category: '教學 / 宗教 / 法律',
    verdict: '智者／導師／宗教領袖型職業身份',
    implication: '不論 10 宮主指哪方向，你命盤中 Jupiter 強到足以讓「教學／宗教／法律／哲學／智慧指導」成為核心身份。Jupiter 主導的案例常在「智慧傳承」的領域發光。'
  },
  Sun: {
    id: 'karaka-override-sun',
    category: '政府 / 公職 / 名譽',
    verdict: '權威型／公職型職業身份',
    implication: '不論 10 宮主指哪方向，你命盤中 Sun 強到足以讓「政府／公職／名譽位置／公眾人物」成為核心身份。'
  }
}

// v5（Round 2）：加入 D10 10th lord、Mars/Venus 寬鬆位置加分、藝術家雙訊號
//
// 每顆 override 候選行星（Mars/Venus/Saturn/Jupiter/Sun）會累積一個 roleScore：
//   +4 AMK 且 strong dignity（own/exalted/moolatrikona）
//   +3 top-3 significator + strong dignity
//   +3 在 Kendra (1/4/7/10) 且 own/exalted
//   +2 在 own/exalted（不在 Kendra 也算）
//   +2 Mars/Sun 在 Upachaya (3/6/10/11)
//   +2 Sun 在 1st/10th（公眾能見度）
//   +2 Mars 在 3rd/6th（體能／競爭徵象）
//   +2 Mars 在 1st/10th/11th 任意 dignity（戰士能量位）★ Round 2 新增
//   +2 Venus 在 1st/5th/10th（藝術徵象）
//   +1 Venus 在 2/7/9（次要藝術位）★ Round 2 新增
//   +2 Jupiter 在 1st/5th/9th/10th（智慧／導師徵象）
//   +2 Saturn 在 10th/7th（建設／體系徵象）
//   +2 Mahapurusha Yoga 對應行星（Ruchaka/Malavya/Hamsa/Bhadra/Shasha）
//   +1 在 Kendra 但 non-strong dignity
//   +3 D10 10th lord 是這顆星 + 本顆 D1 strong/own/mahapurusha 之一 ★ Round 2 新增
//   +2 Mars 與 karmesh/Moon/Jupiter 共位或互望（athletic combo）★ Round 2 新增
//   +2 Venus + Moon 共位或互望且有一方強旺（performer combo）★ Round 2 新增
//
// roleScore ≥ 5 才啟用 override（medium），Mars/Sun 門檻 4；≥ 7 為 strong。
//
// 優勢：
//   ✔ 救回 Messi / Ronaldo 類型（Mars 雖未 own，但在關鍵 house）
//   ✔ 救回 Lincoln / JFK 類型（Sun 在關鍵宮可觸發 government override）
//   ✔ 避免 Lincoln AMK Venus 觸發 Venus override 的誤判
//   ✔ Beyoncé / Tiger Woods / Dalai Lama 仍可正確觸發
//   ✔ Round 2：D10 Mars athletic signal 救回 Tom Brady、Kobe、LeBron
//   ✔ Round 2：Venus + Moon combo 救回 Elvis、Marilyn、Whitney
export function buildKarakaOverrides({ amatyakaraka, significators, computeDignity, chart, activeYogas, d10 }) {
  const strongDignities = ['exalted', 'own', 'moolatrikona']
  const candidates = ['Mars', 'Venus', 'Saturn', 'Jupiter', 'Sun']
  const scoreMap = Object.fromEntries(candidates.map((p) => [p, { score: 0, reasons: [] }]))

  // AMK 貢獻
  if (amatyakaraka?.planet && candidates.includes(amatyakaraka.planet)) {
    const amkP = amatyakaraka.planet
    const amkGraha = amatyakaraka.graha
    const amkDignity = amkGraha && computeDignity ? computeDignity(amkP, amkGraha.rashi.name) : null
    if (amkDignity && strongDignities.includes(amkDignity)) {
      scoreMap[amkP].score += 4
      scoreMap[amkP].reasons.push(`AMK 且強旺（${amkDignity}）`)
    } else if (amkDignity && ['friendly', 'neutral'].includes(amkDignity)) {
      // AMK 中性也加一點點，但不夠門檻觸發
      scoreMap[amkP].score += 1
      scoreMap[amkP].reasons.push(`AMK（${amkDignity}）`)
    }
  }

  // Significator 貢獻（top-3）
  if (significators?.length) {
    for (let i = 0; i < Math.min(3, significators.length); i++) {
      const s = significators[i]
      if (!candidates.includes(s.planet)) continue
      if (strongDignities.includes(s.dignity)) {
        scoreMap[s.planet].score += 3
        scoreMap[s.planet].reasons.push(`Top-${i + 1} significator 強旺（${s.dignity}）`)
      } else if (i === 0) {
        // 連 Top-1 都不強就不加分
      }
    }
  }

  // House-based 訊號（來自 chart.sidereal.grahas）
  if (chart?.sidereal?.grahas) {
    const g = chart.sidereal.grahas
    const ascRashi = chart.sidereal.ascendant.rashi.name
    const dignityFor = (p) => computeDignity ? computeDignity(p, g[p]?.rashi.name) : null
    const inKendra = (h) => [1, 4, 7, 10].includes(h)
    const inUpachaya = (h) => [3, 6, 10, 11].includes(h)
    const inTrikona = (h) => [1, 5, 9].includes(h)

    // Mars role：3/6/10/11（Upachaya + 戰鬥能量）
    if (g.Mars) {
      const d = dignityFor('Mars')
      if (strongDignities.includes(d)) {
        scoreMap.Mars.score += 2
        scoreMap.Mars.reasons.push(`Mars 強旺於 ${g.Mars.rashi.chinese}`)
      }
      if (inKendra(g.Mars.house) && strongDignities.includes(d)) {
        scoreMap.Mars.score += 3
        scoreMap.Mars.reasons.push(`Mars 在 Kendra + 強旺（Ruchaka 型）`)
      } else if (inKendra(g.Mars.house)) {
        scoreMap.Mars.score += 1
        scoreMap.Mars.reasons.push(`Mars 在 Kendra (${g.Mars.house})`)
      }
      if ([3, 6].includes(g.Mars.house)) {
        scoreMap.Mars.score += 2
        scoreMap.Mars.reasons.push(`Mars 在 ${g.Mars.house} 宮（戰鬥/體能本位）`)
      }
      // Round 2：Mars 在 1/10/11 任意 dignity 都加分（戰士本位位）
      if ([1, 10, 11].includes(g.Mars.house) && d !== 'debilitated') {
        scoreMap.Mars.score += 2
        scoreMap.Mars.reasons.push(`Mars 在 ${g.Mars.house} 宮（戰士能量位）`)
      }
      if (inUpachaya(g.Mars.house) && d !== 'debilitated') {
        scoreMap.Mars.score += 1
        scoreMap.Mars.reasons.push(`Mars 在 Upachaya`)
      }
    }

    // Venus role：1/5/10（藝術展現）
    if (g.Venus) {
      const d = dignityFor('Venus')
      if (strongDignities.includes(d)) {
        scoreMap.Venus.score += 2
        scoreMap.Venus.reasons.push(`Venus 強旺`)
      }
      if (inKendra(g.Venus.house) && strongDignities.includes(d)) {
        scoreMap.Venus.score += 3
        scoreMap.Venus.reasons.push(`Venus 在 Kendra + 強旺（Malavya 型）`)
      } else if ([1, 5, 10].includes(g.Venus.house)) {
        scoreMap.Venus.score += 2
        scoreMap.Venus.reasons.push(`Venus 在 ${g.Venus.house} 宮（藝術核心）`)
      }
      // Round 2：Venus 在 2/7/9 算次要藝術位
      if ([2, 7, 9].includes(g.Venus.house) && d !== 'debilitated') {
        scoreMap.Venus.score += 1
        scoreMap.Venus.reasons.push(`Venus 在 ${g.Venus.house} 宮（次要藝術位）`)
      }
    }

    // Saturn role：10th（建設／體系）+ 7th（Digbala）
    if (g.Saturn) {
      const d = dignityFor('Saturn')
      if (strongDignities.includes(d)) {
        scoreMap.Saturn.score += 2
        scoreMap.Saturn.reasons.push(`Saturn 強旺`)
      }
      if (inKendra(g.Saturn.house) && strongDignities.includes(d)) {
        scoreMap.Saturn.score += 3
        scoreMap.Saturn.reasons.push(`Saturn 在 Kendra + 強旺（Shasha 型）`)
      } else if ([7, 10].includes(g.Saturn.house)) {
        scoreMap.Saturn.score += 2
        scoreMap.Saturn.reasons.push(`Saturn 在 ${g.Saturn.house} 宮（體系核心）`)
      }
    }

    // Jupiter role：1/5/9/10（導師／智慧）
    if (g.Jupiter) {
      const d = dignityFor('Jupiter')
      if (strongDignities.includes(d)) {
        scoreMap.Jupiter.score += 2
        scoreMap.Jupiter.reasons.push(`Jupiter 強旺`)
      }
      if (inKendra(g.Jupiter.house) && strongDignities.includes(d)) {
        scoreMap.Jupiter.score += 3
        scoreMap.Jupiter.reasons.push(`Jupiter 在 Kendra + 強旺（Hamsa 型）`)
      } else if ([1, 5, 9, 10].includes(g.Jupiter.house)) {
        scoreMap.Jupiter.score += 2
        scoreMap.Jupiter.reasons.push(`Jupiter 在 ${g.Jupiter.house} 宮（智慧核心）`)
      }
    }

    // Sun role：1/10（公眾能見度）+ Kendra
    if (g.Sun) {
      const d = dignityFor('Sun')
      if (strongDignities.includes(d)) {
        scoreMap.Sun.score += 2
        scoreMap.Sun.reasons.push(`Sun 強旺`)
      }
      if ([1, 10].includes(g.Sun.house)) {
        scoreMap.Sun.score += 2
        scoreMap.Sun.reasons.push(`Sun 在 ${g.Sun.house} 宮（公眾能見度）`)
      }
      if (inKendra(g.Sun.house) && strongDignities.includes(d)) {
        scoreMap.Sun.score += 2
        scoreMap.Sun.reasons.push(`Sun 在 Kendra + 強旺`)
      }
    }
  }

  // Mahapurusha yoga 明確加分
  if (activeYogas?.length) {
    for (const y of activeYogas) {
      const m = y.id?.match(/^mahapurusha-(Mars|Venus|Saturn|Jupiter|Mercury)$/)
      if (m && scoreMap[m[1]]) {
        scoreMap[m[1]].score += 2
        scoreMap[m[1]].reasons.push(`${m[1]} Mahapurusha Yoga`)
      }
    }
  }

  // Round 2 新增：D10 10th lord 交叉驗證
  // 當 D10 事業專盤的 10 宮主是候選行星之一，且本人在 D1 盤該星有一定基礎
  // （dignity 不陷落 + 位於 1/3/5/6/9/10/11 之一），則額外 +3 強訊號
  // D10 主要在事業實踐面發揮 — Tom Brady Moon karmesh but D10 Mars
  if (d10 && chart?.sidereal?.grahas) {
    const d10Lord = d10.tenthLord
    if (d10Lord && candidates.includes(d10Lord) && scoreMap[d10Lord]) {
      const g = chart.sidereal.grahas[d10Lord]
      if (g) {
        const dd = computeDignity ? computeDignity(d10Lord, g.rashi.name) : null
        const nonDebilitated = dd !== 'debilitated'
        const goodHouses = [1, 3, 5, 6, 9, 10, 11]
        if (nonDebilitated && goodHouses.includes(g.house)) {
          scoreMap[d10Lord].score += 3
          scoreMap[d10Lord].reasons.push(`D10 10 宮主為 ${d10Lord}（事業實踐指向）`)
        } else if (nonDebilitated) {
          // 即使位置較弱，D10 signal 仍給 +1（弱訊號）
          scoreMap[d10Lord].score += 1
          scoreMap[d10Lord].reasons.push(`D10 10 宮主為 ${d10Lord}`)
        }
      }
    }
  }

  // Round 2 新增：Mars 與 Jupiter/Moon/Saturn 合宮／互望的 athletic combo
  // Mars-Jupiter 合位 = 運動教練／體育導師；Mars-Saturn = 耐久型運動員；
  // Mars 在 karmesh 宮或 karmesh 共位 = 事業本就是戰鬥型
  if (chart?.sidereal?.grahas?.Mars) {
    const g = chart.sidereal.grahas
    const marsHouse = g.Mars.house
    // Mars 與 Jupiter/Moon/Saturn 同宮（conjunction）
    const marsConjoined = ['Jupiter', 'Moon', 'Saturn'].filter((p) => g[p] && g[p].house === marsHouse)
    if (marsConjoined.length) {
      const goodHouses = [1, 3, 5, 6, 10, 11]
      if (goodHouses.includes(marsHouse)) {
        scoreMap.Mars.score += 2
        scoreMap.Mars.reasons.push(`Mars 與 ${marsConjoined.join('/')} 合於 ${marsHouse} 宮（athletic combo）`)
      }
    }
    // Mars 對 7 宮望（即 Mars 位於 karmesh 10 宮時 opposite 的情況一般已算過 house）
    // 加上：Mars 在 3rd aspect 10th（Mars 4th aspect rule — Mars 在 7 看 10）
    // Mars 的特殊望：4th / 7th / 8th
    const marsAspects = [(marsHouse + 3) % 12 || 12, (marsHouse + 6) % 12 || 12, (marsHouse + 7) % 12 || 12]
    // Mars 望到 10 宮（事業宮）
    const marsD = computeDignity ? computeDignity('Mars', g.Mars.rashi.name) : null
    if (marsAspects.includes(10) && marsD !== 'debilitated') {
      scoreMap.Mars.score += 1
      scoreMap.Mars.reasons.push(`Mars 望到 10 宮（戰鬥能量注入事業）`)
    }
  }

  // Round 2 新增：Venus + Moon combo = performer / 歌手訊號
  // Venus 與 Moon 合位或互望 + 至少一方強旺 → 表演者／歌手
  if (chart?.sidereal?.grahas?.Venus && chart.sidereal.grahas.Moon) {
    const g = chart.sidereal.grahas
    const venusHouse = g.Venus.house
    const moonHouse = g.Moon.house
    const houseDiff = Math.abs(venusHouse - moonHouse)
    const isConjunct = houseDiff === 0
    const isOpposite = houseDiff === 6
    const venusD = computeDignity ? computeDignity('Venus', g.Venus.rashi.name) : null
    const moonD = computeDignity ? computeDignity('Moon', g.Moon.rashi.name) : null
    const eitherStrong = ['exalted', 'own', 'moolatrikona', 'friendly'].includes(venusD)
      || ['exalted', 'own', 'moolatrikona'].includes(moonD)
    if ((isConjunct || isOpposite) && eitherStrong) {
      scoreMap.Venus.score += 2
      scoreMap.Venus.reasons.push(`Venus + Moon ${isConjunct ? '合' : '望'}（performer combo）`)
    }
    // Moon 在 H1/H10 且強旺 也給 Venus 一點加分（大眾藝術象徵）
    if ([1, 10].includes(moonHouse) && ['exalted', 'own', 'moolatrikona'].includes(moonD)) {
      scoreMap.Venus.score += 1
      scoreMap.Venus.reasons.push(`Moon 強旺於 ${moonHouse} 宮（大眾藝術能量）`)
    }
  }

  // 轉化為 overrides：按 score desc 排序，最多 2 個
  // 門檻差異化：Mars/Sun 稍低（≥4），其他 ≥5；≥7 為 strong
  const sorted = candidates
    .map((p) => ({ planet: p, ...scoreMap[p] }))
    .filter((x) => {
      const lowThreshold = x.planet === 'Mars' || x.planet === 'Sun'
      return x.score >= (lowThreshold ? 4 : 5)
    })
    .sort((a, b) => b.score - a.score)

  const overrides = []
  for (const s of sorted) {
    if (overrides.length >= 2) break
    const reading = karakaOverrideReadings[s.planet]
    if (!reading) continue
    overrides.push({
      ...reading,
      source: `${s.planet} 角色分 ${s.score}（${s.reasons.slice(0, 2).join('；')}）`,
      strength: s.score >= 7 ? 'strong' : 'medium'
    })
  }

  return overrides
}

// ═══════════════════════════════════════════════════════════════
// 合成 Narrative：把所有關鍵發現揉成一段「具體到你命盤」的描述
// ═══════════════════════════════════════════════════════════════
// v3: 新增 Karaka Override + D10 交叉驗證的 narrative 片段
export function synthesizeCareerNarrative(analysis) {
  const {
    karmesh,
    lagnaLord,
    activeCareerYogas,
    dignityDetails,
    karmeshContext,
    karakaOverrides,
    d10
  } = analysis
  if (!karmesh?.planet) return null

  const parts = []

  // Part 1: 本質 — 10 宮主 × 落宮 組合（多語境版）
  const matrixKey = selectKarmeshReading(karmesh.planet, karmesh.house, karmeshContext || {})
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
    const llMatrixKey = selectKarmeshReading(lagnaLord.planet, lagnaLord.house, karmeshContext || {})
    if (llMatrixKey) {
      // 保留完整 reading（舊版 split('—')[1] 會把「大型企業／政府高層／長期統帥」等關鍵詞
      // 截掉，造成 politics/government 訊號丟失）
      parts.push(
        `你的命主星 ${lagnaLord.planet} 落第 ${lagnaLord.house} 宮，為事業判讀加第二層重量 — 若把命主星當事業副主看：${llMatrixKey}。`
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

  // Part 5（v3 NEW）：Karaka Override — 當自然本命星強到壓過 10 宮主時
  if (karakaOverrides?.length) {
    const top = karakaOverrides[0]
    parts.push(
      `⚡ Karaka 加權 — ${top.source}。這代表：${top.implication}`
    )
  }

  // Part 6（v3 NEW）：D10 交叉驗證
  if (d10) {
    if (d10.agreement) {
      parts.push(
        `D10（事業專盤）與 D1 方向一致：${karmesh.planet} 兩盤都主事業 — 你「想做的」跟「實際會做的」方向同軌，事業動力集中。`
      )
    } else {
      parts.push(
        `⚠️ D10（事業專盤）與 D1 方向分歧：D1 潛能指向 ${karmesh.planet}，但 D10 實踐是 ${d10.tenthLord} 主導 — 你可能「想做 A 但最後靠 B 成功」，兩條路線都是你的真相。`
      )
    }
  }

  return parts.join('\n\n')
}
