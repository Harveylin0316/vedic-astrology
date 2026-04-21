// 正統吠陀事業分析資料（基於 Brihat Parashara Hora Shastra + Phaladeepika）
//
// 三大核心資料：
// 1. planetAsKarmesh — 某行星當 10 宮主星（Dashamesh）時的事業意義（9 個行星）
// 2. karmeshInHouse — 10 宮主落在某宮時的事業環境（12 個宮位）
// 3. naturalKaraka — 每顆行星在命盤中擔任的自然事業徵象（9 個行星）

// ═══════════════════════════════════════════════════
// 1. 10 宮主 = 某行星時，事業的基本性格
// ═══════════════════════════════════════════════════
export const planetAsKarmesh = {
  Sun: {
    title: '太陽當事業主宰',
    essence: '權威、政府、公眾位置',
    coreProfessions: ['政府官員', '政治 / 民代', '公務員', '公司高階主管', '醫師（特別外科）', '珠寶 / 黃金業', '公眾人物', '父親角色相關'],
    style: '需要「被看見」、有權威感的工作。你的事業需要有「名字」— 不只是領薪水、是要留下標記。',
    strengthsWhenWeak: '太陽弱 → 會活在他人陰影下、難獲得直接權威；改以專業實力累積聲望。'
  },
  Moon: {
    title: '月亮當事業主宰',
    essence: '大眾、女性、滋養、民生',
    coreProfessions: ['護理 / 照護', '餐飲 / 食品業', '母嬰幼教', '社群媒體 / vlog 內容', '公關客服', '家居 / 日用品', '乳品 / 液體類商品', '旅遊／飯店業'],
    style: '透過「服務大眾、照顧他人」的方式賺錢。你的事業情感含量高、跟女性 / 家庭關聯強。',
    strengthsWhenWeak: '月亮弱（特別在 Vrishchika）→ 情緒影響工作穩定度；需要穩定的情感根基才能發揮。'
  },
  Mars: {
    title: '火星當事業主宰',
    essence: '行動、土地、戰鬥、技術',
    coreProfessions: ['軍警 / 消防', '外科醫師 / 急診', '工程師（特別機械、電子）', '運動員 / 教練', '房地產 / 仲介', '業務衝刺型', '自衛工業', 'IPS / IFS（警／外交）'],
    style: '事業需要「對手」或「體力挑戰」— 純坐辦公室會悶到窒息。',
    strengthsWhenWeak: '火星弱（特別在 Karka）→ 行動力被情緒拖累；適合透過紀律訓練強化。'
  },
  Mercury: {
    title: '水星當事業主宰',
    essence: '溝通、商業、智識、年輕感',
    coreProfessions: ['PM / 業務 / 市場', '作家 / 記者 / 編輯', '程式 / IT', '會計 / 審計 / 分析', '翻譯 / 口譯', '教學 / 培訓', '占星 / 塔羅', '自媒體 / 內容創作'],
    style: '事業靠「嘴 + 腦」轉化成價值 — 你是資訊的轉譯者。',
    strengthsWhenWeak: '水星燃燒或陷於 Meena → 商業嗅覺不穩、常做出「事後發現不對」的決定。'
  },
  Jupiter: {
    title: '木星當事業主宰',
    essence: '智慧、傳承、法律、信仰',
    coreProfessions: ['大學教授 / 教師', '律師 / 法官', '財務顧問 / 銀行高階', '心理師 / 諮商', '出版 / 宗教', '政治（搭配 Sun）', '中央銀行 / 金融監管', '慈善 / NGO'],
    style: '事業依賴你的「智慧」被人信服 — 適合帶人、當 mentor、寫書、當顧問。',
    strengthsWhenWeak: '木星落於 Makara → 過度樂觀 / 理論過剩；需要踏實驗證才不空轉。'
  },
  Venus: {
    title: '金星當事業主宰',
    essence: '藝術、美、奢華、女性',
    coreProfessions: ['設計師（UI/UX、室內、時裝）', '藝術家 / 音樂家', '時尚 / 美妝 / 精品', '婚禮 / 珠寶', '娛樂 / 演藝', '高端餐飲 / 酒', '女性相關品牌', '香水 / 美容產品'],
    style: '透過「美」或「享樂」交換價值 — 你賣的是感受、不是功能。',
    strengthsWhenWeak: 'Venus 陷於 Kanya → 太理性壓住了感性直覺；要刻意保留「不那麼實用」的空間。'
  },
  Saturn: {
    title: '土星當事業主宰（事業本命星）',
    essence: '結構、紀律、長期、勞動',
    coreProfessions: ['建築師 / 工程師', '不動產開發', '重工 / 製造業', '政府 / 公營事業', '法律 / 保險 / 稅務', '礦業 / 石油', '傳統工藝', '殯葬 / 老人相關'],
    style: '10 年磨一劍的事業 — 你不會年輕爆紅，但過了 35 歲會穩到讓人嫉妒。',
    strengthsWhenWeak: 'Saturn 燃燒或陷於 Mesha → 紀律不穩、事業延遲更重；需要刻意建立日常結構。',
    special: '⚠️ Saturn 是所有人事業的自然徵象星（Karaka） — 無論你的 10 宮主是什麼，Saturn 在命盤中的力量都深刻影響你的事業成就。'
  },
  Rahu: {
    title: '羅睺當事業主宰（非典型）',
    essence: '海外、科技、破格、創新',
    coreProfessions: ['科技新創 / AI / Web3', '跨國貿易 / 移民', '網紅 / KOL / 直播', '加密貨幣 / 投機市場', '外交 / 跨文化', '非主流創意', '藥物 / 煙酒業', '遊戲產業'],
    style: '你的事業會是「別人看不懂但你知道對的」那種 — 非主流 = 你的主流。',
    strengthsWhenWeak: 'Rahu 無強星（特別是 Jupiter）守護 → 沉迷 / 走偏風險；需要導師或穩定架構制衡。'
  },
  Ketu: {
    title: '計都當事業主宰（幕後 / 靈性）',
    essence: '研究、幕後、療癒、靈性',
    coreProfessions: ['研究員 / 學者', '心理治療 / 精神科', '中醫 / 自然療法', '神秘學 / 占星 / 塔羅', '哲學 / 宗教', '獨立創作', '冥想 / 瑜珈導師', '稀有專業技術'],
    style: '事業在「看不見的地方」發光 — 你享受深挖、不需要舞台。',
    strengthsWhenWeak: 'Ketu 無 Jupiter 支持 → 容易「逃避 = 靈性」；需要明確的實務產出避免空轉。'
  }
}

// ═══════════════════════════════════════════════════
// 2. 10 宮主落某宮 → 事業的「發生地」／環境
// ═══════════════════════════════════════════════════
export const karmeshInHouse = {
  1: {
    label: '10 宮主落第 1 宮（命宮）',
    meaning: '你的事業 = 你本人。個人品牌型 — 名字、臉、個性就是你的招牌。',
    best: '自雇、個人工作室、顧問、KOL、個人品牌'
  },
  2: {
    label: '10 宮主落第 2 宮（財庫 / 家族）',
    meaning: '事業與家族、語言、金錢密不可分。可能繼承家業、或靠聲音 / 語言賺錢。',
    best: '家族事業、金融、語言類工作、珠寶 / 貴金屬、聲音 / 唱作'
  },
  3: {
    label: '10 宮主落第 3 宮（努力 / 溝通）',
    meaning: '靠自己努力闖的事業格。短旅行、寫作、業務。白手起家的典型配置。',
    best: '業務、寫作、媒體、短程物流、業務導向的創業'
  },
  4: {
    label: '10 宮主落第 4 宮（家 / 土地 / 母親）',
    meaning: '事業跟「家、土地、民生」綁在一起。可能經營跟「家」有關的領域。',
    best: '房地產、家居、餐飲、教育、民生產品、飯店業'
  },
  5: {
    label: '10 宮主落第 5 宮（創造 / 子女）',
    meaning: '事業靠「創造力、教學、娛樂」發展。適合把專業變作品、把知識傳授。',
    best: '設計、教學、娛樂、子女教育、投機（謹慎）、藝術創作'
  },
  6: {
    label: '10 宮主落第 6 宮（服務 / 敵人 / 疾病）',
    meaning: '事業本質是「處理麻煩、服務他人」。常會是醫療、法律、處理衝突的角色。',
    best: '醫療、法律、會計（處理稅務）、客服、競爭型業務、健身服務'
  },
  7: {
    label: '10 宮主落第 7 宮（合夥 / 公眾）',
    meaning: '事業靠「夥伴」推動。需要合夥、客戶、公眾面對的工作。',
    best: '公關、外交、諮詢顧問、貿易、婚慶、合夥生意'
  },
  8: {
    label: '10 宮主落第 8 宮（深度 / 秘密 / 轉化）',
    meaning: '事業跟「深挖、研究、他人資源」有關。可能波折但能掌握他人看不見的領域。',
    best: '研究、心理學、神秘學、保險、稅務、調查、遺產規劃'
  },
  9: {
    label: '10 宮主落第 9 宮（遠方 / 教學 / 父親）',
    meaning: '事業跟「遠方、哲學、高等知識」有關。教學、出國、出版、宗教。',
    best: '教育（高等）、出版、律師、外貿、哲學 / 宗教、跨國顧問'
  },
  10: {
    label: '10 宮主落第 10 宮（本位 — 最強）',
    meaning: '自立事業、社會聲望型的命格。事業是你人生最突出的一環。',
    best: '政府 / 公職、管理職、公眾人物、事業型的主軸角色',
    special: '★ 這是事業最吉的位置之一，Raman 派稱「自立格」'
  },
  11: {
    label: '10 宮主落第 11 宮（收入 / 人脈 / 願望）',
    meaning: '事業變成「賺錢機器」— 人脈與網絡驅動收入，多元管道。',
    best: '社群、平台、仲介、多元事業、靠網絡放大的商業'
  },
  12: {
    label: '10 宮主落第 12 宮（出國 / 隱居 / 損失）',
    meaning: '事業跟「遠方、幕後、靈性」有關。可能在海外、在醫院、在寺院發展。',
    best: '海外工作、靈修相關、醫療（特別是醫院）、慈善、幕後研究'
  }
}

// ═══════════════════════════════════════════════════
// 3. 每顆行星的「自然徵象」事業領域（Natural Karaka）
// ═══════════════════════════════════════════════════
export const naturalKaraka = {
  Sun: { domains: ['政府', '權威', '醫學（外科）', '政治', '公眾'], strength_means: '當頭 / 曝光 / 領導機會' },
  Moon: { domains: ['大眾', '女性', '食品', '照護', '媒體'], strength_means: '親和力 / 公眾緣 / 服務機會' },
  Mars: { domains: ['工程', '軍警', '外科', '運動', '土地 / 房產'], strength_means: '行動力 / 競爭優勢 / 技術' },
  Mercury: { domains: ['商業', '寫作', '溝通', '教學', 'IT'], strength_means: '溝通變現 / 學習能力 / 談判' },
  Jupiter: { domains: ['教育', '法律', '宗教', '金融', '顧問'], strength_means: '智慧 / 貴人 / 擴張機會' },
  Venus: { domains: ['藝術', '奢華', '美業', '娛樂', '女性產品'], strength_means: '魅力 / 美感 / 感性變現' },
  Saturn: { domains: ['結構', '長期', '勞動', '工程', '傳統'], strength_means: '耐力 / 穩定性 / 晚發但不敗', isNaturalCareerKaraka: true },
  Rahu: { domains: ['海外', '科技', '非主流', '網路', '新興'], strength_means: '突破性 / 國際化 / 破格機會' },
  Ketu: { domains: ['研究', '靈性', '療癒', '幕後', '稀有技術'], strength_means: '深度 / 獨立性 / 精神追求' }
}

// 星座 → 主星（用來找 10 宮主）
export const rashiLord = {
  Mesha: 'Mars', Vrishabha: 'Venus', Mithuna: 'Mercury', Karka: 'Moon',
  Simha: 'Sun', Kanya: 'Mercury', Tula: 'Venus', Vrishchika: 'Mars',
  Dhanu: 'Jupiter', Makara: 'Saturn', Kumbha: 'Saturn', Meena: 'Jupiter'
}

// 27 Nakshatra 的主宰行星（Vimshottari 順序）
export const nakshatraRuler = {
  Ashwini: 'Ketu', Bharani: 'Venus', Krittika: 'Sun',
  Rohini: 'Moon', Mrigashira: 'Mars', Ardra: 'Rahu',
  Punarvasu: 'Jupiter', Pushya: 'Saturn', Ashlesha: 'Mercury',
  Magha: 'Ketu', 'Purva Phalguni': 'Venus', 'Uttara Phalguni': 'Sun',
  Hasta: 'Moon', Chitra: 'Mars', Swati: 'Rahu',
  Vishakha: 'Jupiter', Anuradha: 'Saturn', Jyeshtha: 'Mercury',
  Mula: 'Ketu', 'Purva Ashadha': 'Venus', 'Uttara Ashadha': 'Sun',
  Shravana: 'Moon', Dhanishta: 'Mars', Shatabhisha: 'Rahu',
  'Purva Bhadrapada': 'Jupiter', 'Uttara Bhadrapada': 'Saturn', Revati: 'Mercury'
}

// 行星本宮 / 旺 / 陷 + Moolatrikona（判定尊嚴 Dignity）
// Moolatrikona 帶度數範圍，力量僅次於本宮
export const planetDignityMap = {
  Sun: { own: ['Simha'], exalted: 'Mesha', debilitated: 'Tula', moolatrikona: { rashi: 'Simha', from: 0, to: 20 } },
  Moon: { own: ['Karka'], exalted: 'Vrishabha', debilitated: 'Vrishchika', moolatrikona: { rashi: 'Vrishabha', from: 3, to: 30 } },
  Mars: { own: ['Mesha', 'Vrishchika'], exalted: 'Makara', debilitated: 'Karka', moolatrikona: { rashi: 'Mesha', from: 0, to: 12 } },
  Mercury: { own: ['Mithuna', 'Kanya'], exalted: 'Kanya', debilitated: 'Meena', moolatrikona: { rashi: 'Kanya', from: 16, to: 20 } },
  Jupiter: { own: ['Dhanu', 'Meena'], exalted: 'Karka', debilitated: 'Makara', moolatrikona: { rashi: 'Dhanu', from: 0, to: 10 } },
  Venus: { own: ['Vrishabha', 'Tula'], exalted: 'Meena', debilitated: 'Kanya', moolatrikona: { rashi: 'Tula', from: 0, to: 15 } },
  Saturn: { own: ['Makara', 'Kumbha'], exalted: 'Tula', debilitated: 'Mesha', moolatrikona: { rashi: 'Kumbha', from: 0, to: 20 } },
  Rahu: { own: [], exalted: 'Vrishabha', debilitated: 'Vrishchika', moolatrikona: null },
  Ketu: { own: [], exalted: 'Vrishchika', debilitated: 'Vrishabha', moolatrikona: null }
}

// Digbala — 方向力（行星在哪一宮達到最大「方向力量」）
// Parashara 鐵律：Jupiter/Mercury → 1 宮（東）；Mars/Sun → 10 宮（南）；Saturn → 7 宮（西）；Moon/Venus → 4 宮（北）
export const digbalaHouse = {
  Jupiter: 1,
  Mercury: 1,
  Mars: 10,
  Sun: 10,
  Saturn: 7,
  Moon: 4,
  Venus: 4
  // Rahu/Ketu 無 Digbala
}

// 尊嚴文字
export const dignityLabels = {
  exalted: { label: '旺位 Uccha', color: 'emerald', strength: 5, note: '最強力量、此領域會發光' },
  own: { label: '本宮 Swakshetra', color: 'saffron', strength: 4, note: '穩定強力、自在發揮' },
  moolatrikona: { label: '根本 Moolatrikona', color: 'saffron', strength: 4, note: '接近本宮力量' },
  friendly: { label: '友宮 Mitra', color: 'slate', strength: 3, note: '中等力量、能成功但需努力' },
  neutral: { label: '中性 Sama', color: 'slate', strength: 2, note: '平平、沒特別加分' },
  enemy: { label: '敵宮 Shatru', color: 'amber', strength: 1, note: '挑戰性、表現不穩' },
  debilitated: { label: '陷位 Neecha', color: 'vermilion', strength: 0, note: '最弱、需要其他支持才能翻轉' }
}

// 行星友敵簡化表（Natural Relationships - Parashara）
export const planetFriendship = {
  Sun: { friends: ['Moon', 'Mars', 'Jupiter'], enemies: ['Venus', 'Saturn'], neutrals: ['Mercury'] },
  Moon: { friends: ['Sun', 'Mercury'], enemies: [], neutrals: ['Mars', 'Jupiter', 'Venus', 'Saturn'] },
  Mars: { friends: ['Sun', 'Moon', 'Jupiter'], enemies: ['Mercury'], neutrals: ['Venus', 'Saturn'] },
  Mercury: { friends: ['Sun', 'Venus'], enemies: ['Moon'], neutrals: ['Mars', 'Jupiter', 'Saturn'] },
  Jupiter: { friends: ['Sun', 'Moon', 'Mars'], enemies: ['Mercury', 'Venus'], neutrals: ['Saturn'] },
  Venus: { friends: ['Mercury', 'Saturn'], enemies: ['Sun', 'Moon'], neutrals: ['Mars', 'Jupiter'] },
  Saturn: { friends: ['Mercury', 'Venus'], enemies: ['Sun', 'Moon', 'Mars'], neutrals: ['Jupiter'] }
}
