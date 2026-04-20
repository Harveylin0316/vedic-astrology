// 吠陀占星·接地氣解讀資料
// 為真正愛算命的人寫的：性格 hook、愛情地雷、職業清單、財運風格、幸運色、合盤

// ═════════════════════════════════════════════════════════════
// 1️⃣ Lagna 上升星座 — 第一印象 vs 真實的你
// ═════════════════════════════════════════════════════════════
export const lagnaReadings = {
  Mesha: {
    tagline: '走路有風的行動派 · 房間的第一號人物',
    firstImpression: '眼神有火、講話直接、動作俐落，走進房間會讓人自動讓路的那一種。',
    realYou: '其實內心蠻單純，容易被激將、也容易被誇獎推著走。認錯快、記仇不久，講義氣到有點天真。',
    lovableTraits: ['說做就做不囉嗦', '保護朋友超到位', '不玩心機直球對決', '行動力讓人安心'],
    redFlags: ['講話不經大腦', '耐性只有 5 分鐘', '不爽就寫在臉上', '三分鐘熱度是日常'],
    socialLabel: '朋友圈都叫你「衝衝衝」、「行動派」、「永動機」',
    lifeLesson: '學會「先想 3 秒再說」，你的人生就少走一半冤枉路'
  },
  Vrishabha: {
    tagline: '沉穩富質感 · 吃貨界的代表',
    firstImpression: '外表柔和、氣場穩、喜歡漂亮有質感的東西，講話不急、穿搭有品。',
    realYou: '認定的事就不放手，慢熱但一黏就黏一輩子。愛錢、愛美食、愛家，物質安全感是剛需。',
    lovableTraits: ['超級可靠、答應的絕對做到', '對伴侶寵到不行', '品味好、房間總是乾淨', '存錢能力一流'],
    redFlags: ['固執到爆、說服你比登天難', '懶起來連動都懶得動', '吃醋不說出口會悶到內傷', '物質主義有時重過感情'],
    socialLabel: '朋友都說你是「吃貨」、「老靈魂」、「最會找好餐廳的人」',
    lifeLesson: '放下「我認定就不變」的執念，人生才會流動起來'
  },
  Mithuna: {
    tagline: '嘴砲王 · 凍齡系資訊達人',
    firstImpression: '反應超快、講話有趣、笑點低、看起來永遠比實際年齡年輕 5 歲。',
    realYou: '頭腦轉得太快，常常同時想 10 件事。好奇心強、愛學新東西，但也很容易膩。',
    lovableTraits: ['講話超有梗、冷場救星', '資訊量爆炸適合當軍師', '交友廣闊、朋友多到記不住名字', '適應力驚人'],
    redFlags: ['三心二意、答應的事常忘記', '神經緊、睡不好', '說話太快容易讓人跟不上', '情感深度有時候留不住人'],
    socialLabel: '朋友都叫你「話題王」、「Google 人肉版」、「最懂最新梗的人」',
    lifeLesson: '學會「深度勝過廣度」，一件事做透會讓你真正發光'
  },
  Karka: {
    tagline: '天生的守護者 · 朋友圈的媽媽/爸爸',
    firstImpression: '氣質溫柔、眼神有情緒、笑起來很有感染力，讓人想靠近。',
    realYou: '感受力超強、別人一句話可以內耗三天。家人和伴侶就是你的整個世界。',
    lovableTraits: ['照顧人細膩入微', '煮飯超好吃（真的）', '記得每個人的生日', '情感忠誠度 100%'],
    redFlags: ['玻璃心、愛冷戰', '情緒勒索偶爾會出現', '太黏讓對方有壓力', '爸媽的話聽得比伴侶重'],
    socialLabel: '朋友都說你是「群組媽媽」、「最會照顧人的那個」、「情感諮詢師」',
    lifeLesson: '分清楚「你的情緒」還是「別人的情緒」，不是你的就別帶回家'
  },
  Simha: {
    tagline: '自帶主角光環 · 走到哪都是焦點',
    firstImpression: '有氣場、笑聲大、穿搭絕對不普通，站出來就是要被看見。',
    realYou: '心大、愛面子、對朋友有皇家氣派的慷慨。怕被忽視勝過怕被罵。',
    lovableTraits: ['永遠挺朋友挺到底', '捨得花錢請客', '創造力滿格', '心胸開闊不記小仇'],
    redFlags: ['愛聽好話、被吹捧很危險', '面子大過裡子', '被冷落會變得幼稚', '花錢如流水'],
    socialLabel: '朋友都叫你「老大」、「聚會主揪」、「超級大方仔」',
    lifeLesson: '學會在沒人注意時也真心做事，你的光才會變成恆星'
  },
  Kanya: {
    tagline: '細節控 · 完美主義者本人',
    firstImpression: '乾淨、有條理、講話精準、東西擺放整齊，看起來很可靠。',
    realYou: '腦袋永遠在分析，對自己和別人都高標準。焦慮是你的日常 BGM。',
    lovableTraits: ['超靠譜、交給你的事一定做好', '記憶力強細節王', '解決問題能力一流', '不愛麻煩別人'],
    redFlags: ['嘴太毒、批評太直接', '過度焦慮睡不好', '小事也糾結很久', '對自己太嚴苛'],
    socialLabel: '朋友都說你是「Excel 女王/國王」、「Life Planner」、「那個東西壞了找他就對了」',
    lifeLesson: '世界不會因為不完美就崩潰，放過自己也放過別人'
  },
  Tula: {
    tagline: '外交官 · 走到哪都左右逢源',
    firstImpression: '笑容得體、穿搭有風格、講話溫柔，第一印象幾乎 100% 加分。',
    realYou: '其實內心很糾結，做決定能拖 3 天。害怕衝突、想討好每個人，但也因此心累。',
    lovableTraits: ['人緣爆好到天花板', '美感品味一流', '外交手腕、很會喬事', '不記仇、大氣'],
    redFlags: ['優柔寡斷到讓人抓狂', '表面和氣心裡有帳', '太在乎他人眼光', '討好型人格'],
    socialLabel: '朋友都說你是「人緣王」、「最會穿的那個」、「朋友圈的 MC」',
    lifeLesson: '勇敢說「不」是你這輩子最重要的功課，讓人失望不會死'
  },
  Vrishchika: {
    tagline: '深水炸彈 · 眼神就能殺人',
    firstImpression: '安靜、眼神有戲、氣場強烈，讓人想多看你兩眼但不敢隨便靠近。',
    realYou: '感情濃烈、愛恨分明，內心小劇場很多，表面冷靜其實情緒翻天。',
    lovableTraits: ['對朋友掏心掏肺', '看穿人性一秒', '意志堅如鋼', '神祕感迷死人'],
    redFlags: ['記仇記到天荒地老', '占有慾和控制慾爆表', '多疑到讓伴侶窒息', '愛搞冷戰'],
    socialLabel: '朋友都說你是「深水區」、「看不透的那個」、「一旦信任就是一輩子的」',
    lifeLesson: '放下「控制」才能真正擁有，愛不是綁住而是信任'
  },
  Dhanu: {
    tagline: '自由的浪人 · 永遠在尋找下一場冒險',
    firstImpression: '笑容陽光、話直接、愛講大道理，身上有一股「不羈」的味道。',
    realYou: '心比天高、愛真理也愛自由。承諾恐懼症比你想像中嚴重。',
    lovableTraits: ['樂觀到能傳染別人', '眼界寬、格局大', '直覺神準', '不會讓人覺得無聊'],
    redFlags: ['講話太直容易傷人', '不喜歡被綁住、跑得快', '喜歡給建議但不喜歡聽建議', '說大話常兌現不了'],
    socialLabel: '朋友都說你是「哲學家」、「旅行狂」、「最勵志的朋友」',
    lifeLesson: '專注一件事做透，比同時跑 10 件事更能讓你自由'
  },
  Makara: {
    tagline: '職場老手 · 越老越值錢的那種',
    firstImpression: '成熟穩重、講話有分量、外表看起來比同齡人老 5 歲但比他們靠譜 10 倍。',
    realYou: '責任感重到會壓垮自己，內心其實很怕失敗。工作就是你的安全感來源。',
    lovableTraits: ['可靠到不行、說到做到', '目標感強、自律一流', '抗壓能力超高', '會把家顧得穩穩'],
    redFlags: ['嚴肅到不會放鬆', '工作狂上身健康堪憂', '情感表達障礙', '太現實不浪漫'],
    socialLabel: '朋友都叫你「老闆」、「最靠譜的那個」、「30 歲像 40 歲，40 歲像 30 歲」',
    lifeLesson: '允許自己「沒在做事」也值得被愛，你不是你的成就'
  },
  Kumbha: {
    tagline: '特立獨行的怪咖 · 走在未來的人',
    firstImpression: '眼神有想法、穿搭有自己邏輯、講話有冷幽默，跟一般人不太一樣。',
    realYou: '理性優先、情感淡定，內心有自己的小宇宙不輕易對人展開。',
    lovableTraits: ['想法獨特、靈光一閃就是金句', '對朋友極度自由尊重', '人道精神、關心弱勢', '不盲從潮流'],
    redFlags: ['情感上很抽離', '固執己見、別人說服不了', '朋友多但知心少', '該親密時會逃'],
    socialLabel: '朋友都說你是「怪咖」、「前衛份子」、「沒人懂但很喜歡的那個」',
    lifeLesson: '打開你的心讓人靠近，真正的親密不是侵犯而是禮物'
  },
  Meena: {
    tagline: '柔軟的夢者 · 藝術與靈性的容器',
    firstImpression: '眼神柔、笑容淺、氣質有點飄渺，讓人想保護你也想探究你。',
    realYou: '感受力超強、直覺準到嚇人，但界線太模糊容易被人情緒淹沒。',
    lovableTraits: ['同理心滿分', '藝術/音樂/文字天賦', '直覺敏銳能預感事情', '無條件愛人的能力'],
    redFlags: ['太好講話容易被利用', '逃避現實愛做夢', '情緒起伏大、邊界不清', '有成癮傾向要小心'],
    socialLabel: '朋友都叫你「小仙女/仙人」、「最會接住情緒的人」、「靈感來源」',
    lifeLesson: '築起界線不是冷漠，是讓你能持續給出愛的唯一方式'
  }
}

// ═════════════════════════════════════════════════════════════
// 2️⃣ Moon 月亮 — 情緒底色、愛情風格、婚姻特質
// ═════════════════════════════════════════════════════════════
export const moonReadings = {
  Mesha: {
    theme: '熱戀型 · 愛上就全力衝',
    emotional: '情緒如火，一秒炸、一秒熄。生氣直接說、開心也直接笑，不會裝。',
    loveStyle: '直球型！喜歡就追、追到手就全力寵。但熱度退得快，需要對方持續製造新鮮感。',
    howYouFlirt: '主動、直接、眼神攻勢。看對眼就約，不搞曖昧也不玩心機。',
    dealBreaker: '對方太黏、太慢、太被動，你會瞬間冷掉',
    marriageTiming: '早婚派，28 歲前後最容易遇到對的人，心動就行動不要猶豫',
    warning: '別被一見鍾情沖昏頭，認識 3 個月以上再做重大決定'
  },
  Vrishabha: {
    theme: '穩定型 · 認定就不變',
    emotional: '情緒超穩，不輕易生氣，一旦動氣就是大事。需要感官滿足（美食、按摩、好床）才安心。',
    loveStyle: '慢熱但黏人型。一旦愛上就很忠誠，會認真經營、存錢買房的那種。',
    howYouFlirt: '用行動。請吃飯、送禮物、照顧對方生活細節，話不用多。',
    dealBreaker: '對方花心、騙錢、不顧家，你會直接冷戰到分手',
    marriageTiming: '偏晚婚但穩定，30 歲後結婚較吉，婚後經濟會明顯改善',
    warning: '別讓物質成為你擇偶的唯一標準，窮小子也可能是潛力股'
  },
  Mithuna: {
    theme: '好奇型 · 聊得來最重要',
    emotional: '情緒多變、想法跳，今天愛明天煩。靠講話和幽默處理情緒。',
    loveStyle: '需要大量對話和新鮮感。聊得來比顏值重要，聊不下去三天就膩。',
    howYouFlirt: '用嘴砲、用訊息、用梗圖。文字調情是你的強項。',
    dealBreaker: '對方無聊、話少、沒幽默感，你會瞬間失去興趣',
    marriageTiming: '婚齡彈性大，可能早婚也可能不婚。重點是有沒有聊不完的話題',
    warning: '別同時跟多人曖昧，你會把自己繞進去搞得很累'
  },
  Karka: {
    theme: '深情型 · 家庭是你的一切',
    emotional: '敏感度爆表、情緒記憶超長，別人一句話可以內耗三天。',
    loveStyle: '付出型媽媽/爸爸角色。煮飯、照顧、記紀念日樣樣來，但也希望被同樣對待。',
    howYouFlirt: '用照顧。關心吃飯沒、天冷提醒穿衣、小細節都記住。',
    dealBreaker: '對方不重視家庭、不跟你爸媽處好、情感冷淡，你會死心',
    marriageTiming: '內心很想早婚，但擇偶超謹慎。一旦認定會廝守終生',
    warning: '別把伴侶當成親人也別把親人的話擺伴侶前面，界線要清楚'
  },
  Simha: {
    theme: '主角型 · 需要被愛得轟轟烈烈',
    emotional: '情緒戲劇化、愛恨分明。被讚美會爆棚、被冷落會碎。',
    loveStyle: '需要對方把你當公主/王子。喜歡被追、被誇獎、被放在第一位。',
    howYouFlirt: '用氣場和大方。送禮不手軟、約會選高級餐廳，讓對方見識你的世界。',
    dealBreaker: '對方小氣、讓你沒面子、把別人放前面，你會直接收心',
    marriageTiming: '戀愛腦，可能早婚閃婚。但要挑「願意每天讚美你」的人',
    warning: '別只挑「表面光鮮」的伴侶，內在對你好才是長久'
  },
  Kanya: {
    theme: '務實型 · 愛情也要有邏輯',
    emotional: '情緒內斂不外放，用「分析」處理感受。焦慮是你的日常。',
    loveStyle: '觀察期超長。看 3 個月才確定要不要在一起，確定後全心投入。',
    howYouFlirt: '用細心幫忙。修電腦、規劃行程、照顧細節，不大張旗鼓。',
    dealBreaker: '對方邋遢、沒規劃、說話不算話，你會默默扣分到零',
    marriageTiming: '晚婚派，30 歲後穩定。婚前一定要把所有問題討論清楚',
    warning: '放下「挑剔」，完美的伴侶不存在，合適的才存在'
  },
  Tula: {
    theme: '浪漫型 · 需要美感與儀式感',
    emotional: '情緒講求平衡，起伏不大但內心很多小劇場。和諧的關係是氧氣。',
    loveStyle: '文青系戀愛。注重約會氛圍、穿搭、照片好不好看，細節決定吸引力。',
    howYouFlirt: '用眼神、用笑容、用恰到好處的距離感。你懂得「撩」。',
    dealBreaker: '對方粗魯、沒品味、公共場合不體面，你會瞬間美感破功',
    marriageTiming: '中等婚齡 28-32 歲，重視婚禮儀式感，婚後仍需要戀愛感',
    warning: '別為了「不讓對方失望」而繼續錯的感情，學會斷捨離'
  },
  Vrishchika: {
    theme: '濃烈型 · 不愛則已一愛致命',
    emotional: '情緒深、記得久、喜怒不形於色。內心小劇場每天一齣大片。',
    loveStyle: '全有或全無。一旦愛上就是靈魂深處的那種，但也會因此控制慾爆表。',
    howYouFlirt: '用眼神、用神祕感、用「讓你想探究我」的氛圍。不會多話。',
    dealBreaker: '對方背叛、欺騙、劈腿，你會永遠不再聯絡，沒有第二次',
    marriageTiming: '可能早熟早婚也可能晚婚，但婚姻是你的重大業力課題',
    warning: '學會信任不是軟弱，放下占有才能真的擁有'
  },
  Dhanu: {
    theme: '自由型 · 愛你但不想被綁',
    emotional: '樂觀外放、情緒來去如風。不記仇也不憋著，喜歡直接說。',
    loveStyle: '冒險型。喜歡能一起旅行、聊哲學、一起闖的伴侶，不喜歡黏膩。',
    howYouFlirt: '用興奮的故事、用大計畫、用「我帶你去看世界」的氣勢。',
    dealBreaker: '對方要求報備行程、控制你的朋友圈、黏得讓你喘不過氣',
    marriageTiming: '偏晚婚（有承諾恐懼），一旦決定會找能跟你闖的伴侶',
    warning: '別用「自由」當作逃避承諾的藉口，真正的自由是選擇留下'
  },
  Makara: {
    theme: '穩重型 · 感情是長期投資',
    emotional: '情緒壓抑、不輕易示弱。工作忙起來會忽略感情訊號。',
    loveStyle: '務實派。看對方的潛力、家世、穩定度。不相信一時的浪漫。',
    howYouFlirt: '用實際行動。幫對方規劃未來、介紹家人、建立長遠承諾。',
    dealBreaker: '對方不上進、花錢沒節制、不尊重你的家人，你會默默退場',
    marriageTiming: '大器晚成型，32 歲後結婚較吉，越晚婚越穩定',
    warning: '工作不是你唯一的身份，伴侶需要的不只是一個生活費提供者'
  },
  Kumbha: {
    theme: '朋友型 · 愛情從友情開始',
    emotional: '理性優先、情感抽離。你很少情緒失控但也很少熱戀感。',
    loveStyle: '先當朋友。需要思想共鳴和個人空間，黏人型會被你嚇跑。',
    howYouFlirt: '用聊天、用深度對話、用「我們很合」的默契。你不擅長熱烈。',
    dealBreaker: '對方控制、黏、不給空間、思想不同頻，你會慢慢消失',
    marriageTiming: '非典型婚姻，可能晚婚、不婚、或閃婚。重視靈魂伴侶感',
    warning: '別因為「太獨立」錯過對你好的人，偶爾示弱是一種親密'
  },
  Meena: {
    theme: '靈魂型 · 愛是融化彼此',
    emotional: '情緒如海、共感力爆棚。別人的情緒也會變你的，需要獨處充電。',
    loveStyle: '靈魂連結型。一見鍾情機率高，容易愛上「需要你拯救」的人。',
    howYouFlirt: '用直覺、用眼神、用不經意的小舉動。你的吸引力很「說不出來」。',
    dealBreaker: '對方太理性冷漠、不懂浪漫、不相信靈性直覺的東西',
    marriageTiming: '早婚晚婚皆可，容易遇到「命中注定」感。婚姻有宿命色彩',
    warning: '別用愛拯救對方，你不是救世主，學會選擇愛自己的人'
  }
}

// ═════════════════════════════════════════════════════════════
// 3️⃣ Sun 太陽 — 職業傾向、財運風格、成功關鍵
// ═════════════════════════════════════════════════════════════
export const sunReadings = {
  Mesha: {
    theme: '衝刺型 · 不當老大會悶死',
    workStyle: '討厭被管、喜歡成為第一個做到的人。壓力下反而爆發力強。',
    bestCareers: ['CEO / 創業者', '業務總監', '急診 / 外科醫師', '運動員 / 教練', '消防 / 警察 / 軍人', '房仲 top sales'],
    avoidCareers: ['會計出納', '圖書館 / 文書', '例行客服'],
    moneyStyle: '賺得快花得也快。偏財運（業績、獎金、投資）強於正財。',
    successKey: '找一個能當「頭」的位置，不適合當螺絲釘',
    commonTrap: '太快 all-in 會燒光子彈，學會分批下注'
  },
  Vrishabha: {
    theme: '累積型 · 慢慢來比較快',
    workStyle: '耐性超強、一件事能做 10 年。不愛換工作、喜歡可預測的收入。',
    bestCareers: ['金融 / 銀行', '餐飲業老闆', '美妝 / 精品', '農業 / 食品', '不動產', '藝術家 / 歌手'],
    avoidCareers: ['高壓業務', '需頻繁出差', '變化太快的科技業'],
    moneyStyle: '正財為主、存錢高手。投資偏保守但最後累積最多。',
    successKey: '長期主義者。10 年磨一劍比 10 個月換 3 份工作更適合你',
    commonTrap: '太貪安穩會錯過機會，該冒險時還是要冒險'
  },
  Mithuna: {
    theme: '跨界型 · 斜槓是本命',
    workStyle: '坐不住、愛變化、喜歡同時做多件事。一份工作做超過 3 年就悶。',
    bestCareers: ['業務 / 行銷', '自媒體 / YouTuber', '記者 / 作家', '翻譯 / 導遊', '程式設計', '主持人 / Podcaster'],
    avoidCareers: ['重複性勞動', '工廠作業員', '安靜的研究室'],
    moneyStyle: '多元收入、常常好幾個副業。但也容易花在資訊、課程、旅遊',
    successKey: '不要逼自己選一個職業，斜槓才是你的商業模式',
    commonTrap: '想太多做太少，學會「先做完一件再說」'
  },
  Karka: {
    theme: '滋養型 · 服務與照顧他人',
    workStyle: '在乎團隊氣氛、討厭辦公室政治。家庭和諧是工作的前提。',
    bestCareers: ['護士 / 心理師', '幼教 / 照護', '餐飲 / 家常菜', '飯店業 / 民宿', '食品業', '婦產科醫師'],
    avoidCareers: ['高壓科技業', '冷血資本主義類型', '需頻繁出差離家'],
    moneyStyle: '為家庭存錢的動力無限大。喜歡買房、存女兒/兒子教育金。',
    successKey: '找一個能讓你「照顧人」的工作，能量才會源源不絕',
    commonTrap: '太善良容易被利用，學會說「這不是我的責任」'
  },
  Simha: {
    theme: '領袖型 · 要被看見要有光',
    workStyle: '需要舞台、需要被肯定、需要創造性的工作。做螺絲釘會萎靡。',
    bestCareers: ['導演 / 演員', '企業高管 / CEO', '政治 / 公關', '高級品牌行銷', '活動策劃', '時尚 / 美妝產業'],
    avoidCareers: ['幕後工作無曝光', '純行政', '不能自己做主的位置'],
    moneyStyle: '愛賺愛花、會投資自己的形象。賺大錢的命但要小心被面子拖累',
    successKey: '站到舞台中央、打造個人品牌，你天生就該發光',
    commonTrap: '別為了面子做錯的決定，實力比頭銜重要'
  },
  Kanya: {
    theme: '職人型 · 專業就是護身符',
    workStyle: '細節狂、規劃控、標準高。沒有計劃絕不出手。',
    bestCareers: ['會計 / 審計', '醫師 / 藥師 / 護理師', '研究員 / 分析師', '工程師', '編輯 / 校對', '健身教練 / 營養師'],
    avoidCareers: ['高度應酬業務', '憑感覺做事的行業', '亂糟糟的新創'],
    moneyStyle: '節流高手、Excel 理財王。收入穩定、退休金算得超精準',
    successKey: '把一項專業技能打磨到頂尖，你就永遠有飯吃',
    commonTrap: '太糾結細節錯過大局，有時候「完成」比「完美」重要'
  },
  Tula: {
    theme: '協調型 · 美感與人脈兼具',
    workStyle: '討厭衝突、喜歡合作。辦公室氣氛好你就能發揮 200%。',
    bestCareers: ['設計師 / 室內設計', '公關 / 外交', '藝術 / 精品', '律師 / 調解員', '時尚產業', '婚禮 / 活動策劃'],
    avoidCareers: ['高衝突業務', '獨自作業', '太粗糙的行業'],
    moneyStyle: '愛買美的東西、精品、藝術品。收入穩但花在自我投資多',
    successKey: '把美感和人脈結合，你的「眼光」值錢',
    commonTrap: '優柔寡斷讓機會溜走，學會 24 小時內做決定'
  },
  Vrishchika: {
    theme: '深挖型 · 看透本質的專家',
    workStyle: '專注力極強、能深入研究別人不願碰的領域。耐得住寂寞。',
    bestCareers: ['心理師 / 精神科醫師', '偵探 / 刑警 / 法醫', '外科醫師', '投資 / 股票操盤', '神祕學研究', '研究員'],
    avoidCareers: ['表面客套的業務', '一眼看透的簡單工作'],
    moneyStyle: '偏財運強、會投資、但也易陷入高風險。配偶或他人的錢會幫到你',
    successKey: '找一個能讓你深挖的領域，你是專家中的專家',
    commonTrap: '執著於秘密和控制會孤立你，學會適度透明'
  },
  Dhanu: {
    theme: '遠航型 · 要自由、要意義',
    workStyle: '不耐 routine、需要探索空間。「這工作有意義嗎？」是你常問的',
    bestCareers: ['教師 / 教授', '旅遊業 / 領隊', '國際貿易', '律師', '出版 / 作家', '宗教 / 靈性工作者'],
    avoidCareers: ['細節密集的會計', '久坐辦公室', '做不出社會意義的工作'],
    moneyStyle: '大膽投資、國際化的收入管道。常跟海外有關。Jupiter 保佑財運',
    successKey: '把工作當做傳播理念的舞台，錢會跟著意義而來',
    commonTrap: '承諾太多做不完，學會只答應真的重要的事'
  },
  Makara: {
    theme: '長期型 · 晚發但不敗',
    workStyle: '紀律大師、抗壓怪物。能在別人放棄時繼續走 10 年的那種。',
    bestCareers: ['高階管理 / CEO', '公務員 / 政府機關', '建築 / 土地開發', '重工業 / 製造業', '銀行 / 金融', '律師 / 會計師'],
    avoidCareers: ['太新潮的產業', '靠創意吃飯的工作', '沒結構的自由業'],
    moneyStyle: '存錢、投資不動產、建立長期資產。35 歲後財富快速累積',
    successKey: '把時間當作你最大的朋友，別人放棄你繼續走就贏',
    commonTrap: '工作狂上身會犧牲家庭和健康，記得下班'
  },
  Kumbha: {
    theme: '創新型 · 走別人沒走過的路',
    workStyle: '獨立作業能力強、討厭被微管理。有想法、喜歡挑戰傳統。',
    bestCareers: ['科技 / AI / 程式', '社會企業 / NGO', '科學研究', '創業家 / 新創', '獨立顧問', '航太 / 未來產業'],
    avoidCareers: ['傳統保守的大公司', '層級森嚴的行政', '重複性勞動'],
    moneyStyle: '不走尋常路賺錢。科技股、加密貨幣、網路副業是你的菜',
    successKey: '相信自己的「怪」，那就是你的競爭優勢',
    commonTrap: '太前衛別人跟不上，要學會「簡化到讓大眾懂」'
  },
  Meena: {
    theme: '療癒型 · 用慈悲與直覺工作',
    workStyle: '需要情感連結、不耐枯燥分析。靠直覺和感受做決策。',
    bestCareers: ['藝術家 / 音樂家', '心理師 / 靈性工作者', '攝影 / 電影', '護士 / 物理治療師', '慈善 / NGO', '神職人員'],
    avoidCareers: ['冷血的財務分析', '高壓業務銷售', '機械化工廠'],
    moneyStyle: '錢是流動的能量，你不執著錢也容易有錢進來。要小心被人騙',
    successKey: '相信你的直覺和藝術天賦，那是你的黃金',
    commonTrap: '太好講話容易被占便宜，學會看合約、記帳、拒絕'
  }
}

// ═════════════════════════════════════════════════════════════
// 4️⃣ 27 Nakshatra 月宿 — 深層命格解讀
// ═════════════════════════════════════════════════════════════
export const nakshatraReadings = {
  Ashwini: { theme: '療癒先行者', body: '反應快到不可思議、有「出手即救」的能力。適合醫療、急救、開創新事物。年輕時運勢啟動早。' },
  Bharani: { theme: '承載的門戶', body: '天生能承重。這輩子會經歷他人難以想像的轉折，學會「斷捨離」是關鍵課題。' },
  Krittika: { theme: '淨化的剃刀', body: '看穿虛假的能力極強、講話鋒利。早年可能經歷考驗，但中年後會發光。' },
  Rohini: { theme: '最受寵的月亮', body: '月亮最愛的星宿！異性緣爆棚、感官享受一流、物質富足。藝術與美感是你的金礦。' },
  Mrigashira: { theme: '輕盈的追尋者', body: '永遠在找下一個目標，旅行、研究、寫作是你的養分。戀愛也常「在路上」。' },
  Ardra: { theme: '風暴的淬煉', body: '人生起伏大、情緒濃烈。透過一次次破舊立新，你成為心理韌性最強的那群人。' },
  Punarvasu: { theme: '總是歸來的光', body: '跌倒會重生、失戀會重來、失業會東山再起。你有「東方不亮西方亮」的運勢。' },
  Pushya: { theme: '最吉祥的乳', body: '27 個 Nakshatra 中最吉的一個！天生受長輩與貴人照顧，是導師與療癒者。' },
  Ashlesha: { theme: '盤蛇的智慧', body: '有神祕的吸引力和洞察力。善用這能量是治療師，失衡則會陷入操控與嫉妒。' },
  Magha: { theme: '祖先的王座', body: '帶著家族的榮光與業力。早年可能與父親有課題，中年後會繼承屬於你的王國。' },
  PurvaPhalguni: { theme: '享樂的藝術家', body: '戀愛運和享樂運一流、藝術天賦強。適合演藝、時尚、娛樂產業。' },
  UttaraPhalguni: { theme: '忠誠的締結者', body: '朋友圈超廣、婚姻穩定、契約能力強。是合夥生意、婚姻的最佳合夥人。' },
  Hasta: { theme: '巧手的職人', body: '手特別靈巧！手工藝、按摩、醫療、諮商、寫作都能發揮。點石成金的才能。' },
  Chitra: { theme: '璀璨的珠寶', body: '外貌吸引力頂尖、有藝術與設計天賦。你懂得把「自己」打磨成發亮的品牌。' },
  Swati: { theme: '獨立的風', body: '外交能力一流、彈性高。適合商業、貿易、獨立創業。晚運尤其旺。' },
  Vishakha: { theme: '目標導向的戰士', body: '一旦鎖定目標全力以赴，晚年成就通常最大。感情上易「先苦後甘」。' },
  Anuradha: { theme: '虔誠的連結者', body: '朋友和團體是你的人生支柱。組織力、社群經營是你的強項。海外運佳。' },
  Jyeshtha: { theme: '長者的威嚴', body: '常在家中或團體中被推上前線。責任重、壓力大，但也因此贏得威望。' },
  Mula: { theme: '連根拔起', body: '這輩子會經歷重大的拆毀與重建。終將找到真正不動搖的根，但路上會痛。' },
  PurvaAshadha: { theme: '不敗的戰歌', body: '精神力超強、激勵他人的天賦。當演講者、領導者、激勵者。永遠不被擊倒。' },
  UttaraAshadha: { theme: '普世的勝利', body: '晚熟型贏家。你的成就屬於「長遠、正義、服務群體」的方向。越老越尊貴。' },
  Shravana: { theme: '聆聽的智者', body: '天生適合教學、諮商、深度交談。很會聽別人說話，也因此獲得智慧。' },
  Dhanishta: { theme: '節奏的鼓手', body: '富足、愛群體、有音樂或節奏感。物質成就顯眼但要注意情感深度。' },
  Shatabhisha: { theme: '百藥的療者', body: '獨行的神祕療癒者。喜歡獨處、研究深奧領域。晚年才會被大眾看見。' },
  PurvaBhadrapada: { theme: '轉化的火焰', body: '不走尋常路、思想前衛。犧牲小我追求非凡，常是思想家或改革者。' },
  UttaraBhadrapada: { theme: '深海的智者', body: '內在深沉、富同情心、靈性取向強。中年後會有重大的靈性覺醒。' },
  Revati: { theme: '守護的終點', body: '27 個 Nakshatra 的最後一站。慈悲、直覺、像旅者守護者，常幫助他人「完成一段旅程」。' }
}

// ═════════════════════════════════════════════════════════════
// 5️⃣ 幸運系統 — 按月亮星座（Vedic 以月亮為命主）
// ═════════════════════════════════════════════════════════════
export const luckySystem = {
  Mesha: { colors: '紅、橘、鮮黃', numbers: '9、18、27', luckyDay: '星期二', direction: '南', gem: 'Red Coral 紅珊瑚', avoid: '湖水藍（會讓你消極）' },
  Vrishabha: { colors: '粉、白、淡綠', numbers: '6、15、24', luckyDay: '星期五', direction: '東南', gem: 'Diamond 鑽石 / White Sapphire', avoid: '血紅（會讓你暴躁）' },
  Mithuna: { colors: '綠、黃、淺藍', numbers: '5、14、23', luckyDay: '星期三', direction: '北', gem: 'Emerald 祖母綠', avoid: '大紅（會讓你神經緊）' },
  Karka: { colors: '銀白、淡粉、海藍', numbers: '2、11、20', luckyDay: '星期一', direction: '北', gem: 'Pearl 珍珠', avoid: '黑色（會加重情緒）' },
  Simha: { colors: '金、橘、深黃', numbers: '1、10、19', luckyDay: '星期日', direction: '東', gem: 'Ruby 紅寶石', avoid: '純黑（會滅你的光）' },
  Kanya: { colors: '橄欖綠、米白、大地色', numbers: '5、14、23', luckyDay: '星期三', direction: '北', gem: 'Emerald 祖母綠', avoid: '鮮紅（會加劇焦慮）' },
  Tula: { colors: '粉白、薰衣紫、淡藍', numbers: '6、15、24', luckyDay: '星期五', direction: '西', gem: 'Diamond 鑽石', avoid: '血紅、軍綠（破壞美感）' },
  Vrishchika: { colors: '深紅、酒紅、黑紅', numbers: '9、18、27', luckyDay: '星期二', direction: '南', gem: 'Red Coral 紅珊瑚', avoid: '亮粉（降低你的氣場）' },
  Dhanu: { colors: '黃、金、栗棕', numbers: '3、12、21', luckyDay: '星期四', direction: '東北', gem: 'Yellow Sapphire 黃寶石', avoid: '青藍（壓抑你的擴張性）' },
  Makara: { colors: '深藍、黑、石墨灰', numbers: '8、17、26', luckyDay: '星期六', direction: '西', gem: 'Blue Sapphire 藍寶石', avoid: '亮橘（太浮躁）' },
  Kumbha: { colors: '電光藍、銀、靛紫', numbers: '8、17、26', luckyDay: '星期六', direction: '西', gem: 'Blue Sapphire 藍寶石', avoid: '金色（讓你更抽離）' },
  Meena: { colors: '海洋藍、薰衣草紫、金黃', numbers: '3、12、21', luckyDay: '星期四', direction: '東北', gem: 'Yellow Sapphire 黃寶石', avoid: '螢光色（刺激情緒）' }
}

// ═════════════════════════════════════════════════════════════
// 6️⃣ 合盤配對 — 以月亮星座為主
// ═════════════════════════════════════════════════════════════
export const compatibility = {
  Mesha: { best: ['Simha 獅子', 'Dhanu 射手', 'Kumbha 水瓶'], avoid: ['Karka 巨蟹', 'Makara 摩羯'], reason: '火象搭配有火花；土水太慢你受不了' },
  Vrishabha: { best: ['Kanya 處女', 'Makara 摩羯', 'Karka 巨蟹'], avoid: ['Simha 獅子', 'Kumbha 水瓶'], reason: '土象合拍、水象滋養；火風會讓你覺得不安穩' },
  Mithuna: { best: ['Tula 天秤', 'Kumbha 水瓶', 'Simha 獅子'], avoid: ['Meena 雙魚', 'Dhanu 射手'], reason: '風象聊得來；情緒型星座讓你窒息' },
  Karka: { best: ['Vrishchika 天蠍', 'Meena 雙魚', 'Vrishabha 金牛'], avoid: ['Mesha 白羊', 'Tula 天秤'], reason: '水象深情共鳴；火風太冷或太衝' },
  Simha: { best: ['Mesha 白羊', 'Dhanu 射手', 'Tula 天秤'], avoid: ['Vrishchika 天蠍', 'Kumbha 水瓶'], reason: '火象給你舞台；水象控制慾讓你窒息' },
  Kanya: { best: ['Vrishabha 金牛', 'Makara 摩羯', 'Vrishchika 天蠍'], avoid: ['Mithuna 雙子', 'Meena 雙魚'], reason: '土象踏實、水象深度；風象太跳讓你焦慮' },
  Tula: { best: ['Mithuna 雙子', 'Kumbha 水瓶', 'Simha 獅子'], avoid: ['Karka 巨蟹', 'Makara 摩羯'], reason: '風象有默契；情感太重的星座讓你累' },
  Vrishchika: { best: ['Karka 巨蟹', 'Meena 雙魚', 'Kanya 處女'], avoid: ['Simha 獅子', 'Kumbha 水瓶'], reason: '水象深度共鳴；驕傲或抽離型會激怒你' },
  Dhanu: { best: ['Mesha 白羊', 'Simha 獅子', 'Tula 天秤'], avoid: ['Mithuna 雙子', 'Kanya 處女'], reason: '火象一起瘋；太細膩的會綁住你' },
  Makara: { best: ['Vrishabha 金牛', 'Kanya 處女', 'Vrishchika 天蠍'], avoid: ['Mesha 白羊', 'Tula 天秤'], reason: '土象穩、水象深；火風太浮躁你受不了' },
  Kumbha: { best: ['Mithuna 雙子', 'Tula 天秤', 'Dhanu 射手'], avoid: ['Vrishabha 金牛', 'Vrishchika 天蠍'], reason: '風象思想共鳴；控制型會激起你的逃跑反應' },
  Meena: { best: ['Karka 巨蟹', 'Vrishchika 天蠍', 'Makara 摩羯'], avoid: ['Mithuna 雙子', 'Kanya 處女'], reason: '水象靈魂連結；過度理性的星座會讓你覺得孤單' }
}

// ═════════════════════════════════════════════════════════════
// 7️⃣ 元素平衡（不變）
// ═════════════════════════════════════════════════════════════
const rashiElement = {
  Mesha: 'fire', Simha: 'fire', Dhanu: 'fire',
  Vrishabha: 'earth', Kanya: 'earth', Makara: 'earth',
  Mithuna: 'air', Tula: 'air', Kumbha: 'air',
  Karka: 'water', Vrishchika: 'water', Meena: 'water'
}

const elementInfo = {
  fire: { name: '火 Agni', nature: '行動、熱情、衝勁', advice: '火太旺容易暴躁和燒光能量，多接觸水、綠色植物、冷靜冥想' },
  earth: { name: '土 Prithvi', nature: '穩定、務實、物質', advice: '土太重容易固守、不想動，嘗試旅行、學新東西讓生活流動' },
  air: { name: '風 Vayu', nature: '思考、溝通、變動', advice: '風太強容易焦慮失眠，規律作息、深呼吸、接地運動能平衡' },
  water: { name: '水 Jala', nature: '情感、直覺、敏感', advice: '水太滿容易情緒淹沒，多運動、曬太陽、結構化日程能穩定' }
}

export function getElementBalance({ sunRashi, moonRashi, lagnaRashi }) {
  const counts = { fire: 0, earth: 0, air: 0, water: 0 }
  ;[sunRashi, moonRashi, lagnaRashi].forEach((r) => {
    const el = rashiElement[r]
    if (el) counts[el] += 1
  })
  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
  const missing = Object.entries(counts).filter(([, v]) => v === 0).map(([k]) => k)
  return {
    counts,
    dominant,
    dominantInfo: elementInfo[dominant],
    missing,
    missingInfo: missing.map((m) => elementInfo[m])
  }
}

// ═════════════════════════════════════════════════════════════
// 8️⃣ Vimshottari Dasha 大運 — 涵蓋事業、感情、財運、健康、典型事件
// ═════════════════════════════════════════════════════════════
export const dashaReadings = {
  Ketu: {
    name: 'Ketu 計都大運',
    nickname: '清空雜物期',
    years: 7,
    theme: '出離 · 靈性 · 結束 · 覺醒',
    vibe: '像人生的「斷捨離」期。舊緣、舊工作、舊身份會自然離開。學會放手，你會進入更深的自己。',
    career: '容易想換跑道、突然離職，或被拉進靈性、療癒、神祕學領域。這是「你不再想當過去那個人」的時期。',
    love: '舊情緣會畫下句點。新的戀情傾向靈魂連結型、宿命感重，但不一定長久。',
    money: '錢的來去難以預測。可能意外損失或突然的大筆支出，也可能靠非傳統方式（靈性服務、顧問）賺錢。',
    health: '莫名的身體訊號、慢性病、精神層面的議題（失眠、焦慮、覺醒症狀）要特別注意。',
    typicalEvents: ['分手 / 離婚', '離職 / 轉行', '親人離世', '重大覺醒體驗', '放棄追求已久的目標', '開始學塔羅 / 冥想 / 神祕學'],
    goodFor: ['斷捨離', '靈修、冥想', '專研神祕學', '出家 / 長閉關', '放下執念'],
    watchOut: ['突然的失去', '意外受傷', '感情動盪', '方向迷失']
  },
  Venus: {
    name: 'Venus 金星大運',
    nickname: '最甜 20 年',
    years: 20,
    theme: '愛情 · 藝術 · 奢華 · 配偶',
    vibe: '人生最甜的 20 年。愛情、美感、物質享受同時爆發。遇到命定伴侶的機率最高，最容易靠藝術或美感致富。',
    career: '美學、藝術、時尚、精品、娛樂、高端服務業最順。如果做業務，金星會讓你「靠魅力接單」。',
    love: '結婚機率爆棚、戀愛不斷。如果已婚，婚姻會進入甜蜜期或添丁。單身的話，不主動也會有人追。',
    money: '錢進得快花得也快。投資美學、房產、珠寶、婚戒周邊容易獲利。收入跟外表、魅力、人脈正相關。',
    health: '要留意喉嚨、泌尿、生殖系統、糖分攝取。過度享樂會讓體重上升。',
    typicalEvents: ['結婚 / 訂婚', '生小孩', '買房置產（為愛）', '藝術創作爆紅', '出國度假一次又一次', '進入精品 / 時尚業'],
    goodFor: ['戀愛結婚', '藝術創作', '買美的東西', '提升外表魅力', '投資房產'],
    watchOut: ['感情三角', '揮霍無度', '依賴伴侶失去自我', '太沉迷享樂']
  },
  Sun: {
    name: 'Sun 太陽大運',
    nickname: '發光時刻',
    years: 6,
    theme: '名聲 · 父親 · 權威 · 政府',
    vibe: '6 年的「登台亮相」期。本命太陽強會登頂，弱就要學會低調別硬撐。父親 / 長輩議題凸顯。',
    career: '權威與曝光度上升。適合爭取領導位、考公職、做代言人、成為某個領域的「代表人物」。',
    love: '可能透過工作認識伴侶。對象傾向成熟、有事業心、有權威氣質的那型。已婚者配偶事業可能有轉折。',
    money: '正財為主 — 收入跟職位、頭銜連動。靠「名聲」賺錢比投機更穩。獎金、公司分紅有機會。',
    health: '注意眼睛、心臟、血壓、頭部。容易火氣大、熬夜過勞。',
    typicalEvents: ['升官 / 被賞識', '考上公職', '跟父親和解或衝突', '媒體曝光 / 採訪', '出書 / 公開演講', '成為某領域代表'],
    goodFor: ['升遷', '考公職', '代言 / 曝光', '跟長官搞好關係', '公開出道'],
    watchOut: ['跟上級衝突', '驕傲自滿樹敵', '視力、血壓', '父親健康']
  },
  Moon: {
    name: 'Moon 月亮大運',
    nickname: '情感豐盛期',
    years: 10,
    theme: '情感 · 家庭 · 母親 · 房產',
    vibe: '10 年的「心與家」階段。直覺變強、情感變深、家庭議題變主角。買房、結婚、生子都在這段期間。',
    career: '適合跟大眾、女性、食品、房產、民生、療癒相關的行業。在辦公室你會變成「大家的心靈支柱」。',
    love: '溫馨型戀愛、結婚生子高峰。已婚者家庭生活會更穩定，或因為小孩重新定位關係。',
    money: '房地產收入、家庭財富累積、靠「照顧人」的工作賺錢。女性貴人多。',
    health: '胃、消化系統、情緒型失眠、乳房健康。情緒壓力會直接影響身體。',
    typicalEvents: ['結婚', '生小孩', '買房買車', '搬家 / 回老家', '媽媽健康議題', '療癒 / 心理諮商'],
    goodFor: ['結婚生子', '買房', '情感療癒', '跟媽媽和解', '經營家庭'],
    watchOut: ['情緒起伏大', '媽媽或女性課題', '過度內耗', '睡眠']
  },
  Mars: {
    name: 'Mars 火星大運',
    nickname: '行動派衝刺期',
    years: 7,
    theme: '競爭 · 勇氣 · 房產 · 手術 · 兄弟',
    vibe: '7 年的「戰鬥模式」。衝勁十足、但也容易衝動。是創業、買房、闖蕩的黃金時期。',
    career: '衝刺、競爭、創業、業績壓力大的工作最適合。軍警、運動員、醫師、工程、房地產業特別旺。',
    love: '衝動戀愛、激情滿點。可能閃戀閃婚，也可能因為脾氣衝突分手。容易遇到火爆型伴侶。',
    money: '投資不動產最吉。賺快錢也會花快錢，要學會分批下注別一把 all-in。',
    health: '意外、受傷、手術機率高。血壓、發炎、外傷、牙齒要注意。',
    typicalEvents: ['創業', '買房', '運動受傷 / 手術', '跟兄弟衝突或合作', '軍警役', '買車 / 開始健身'],
    goodFor: ['創業、衝刺', '買房、投資不動產', '運動、健身', '跟競爭對手對戰'],
    watchOut: ['意外受傷', '跟兄弟或同事衝突', '暴怒失控', '爛桃花']
  },
  Rahu: {
    name: 'Rahu 羅睺大運',
    nickname: '戲劇化轉身',
    years: 18,
    theme: '慾望 · 海外 · 科技 · 顛覆',
    vibe: '18 年最戲劇化的大運。會讓你嚐到前所未有的滋味，也容易迷失。人生會有「大翻轉」。',
    career: '海外發展、新創、加密貨幣、科技、網路、直播、特殊行業最顯眼。非主流反而賺大錢。',
    love: '跨國戀、異文化、年齡差大、非典型關係（秘密戀情、多角關係）。戲劇性強。',
    money: '投機 / 暴利暴損。加密貨幣、股票、非傳統收入管道。錢來得快去得也快。',
    health: '皮膚、神經系統、成癮問題（手遊、酒、藥物）、怪病、不明原因症狀。',
    typicalEvents: ['突然出國 / 移民', '網紅 / 直播爆紅', '加密貨幣賺大錢或大賠', '身份戲劇化轉變', '驚世戀情', '跟外國人有關'],
    goodFor: ['出國發展', '科技 / 新創', '突破舊有身份', '挑戰禁忌領域'],
    watchOut: ['沉迷 / 上癮', '表面光鮮內心空', '詭異人際', '官司 / 法律']
  },
  Jupiter: {
    name: 'Jupiter 木星大運',
    nickname: '開花結果期',
    years: 16,
    theme: '智慧 · 子嗣 · 財富 · 導師',
    vibe: '16 年最有福氣的大運。貴人多、機會多、運勢擴張。是人生「結果」與「豐收」的階段。',
    career: '事業擴張、當老師 / 顧問 / 導師、出書、進修深造。格局變大，開始帶人。',
    love: '婚姻進入穩定甜蜜期。未婚者遇到「對的人」機率極高。生子運爆棚。',
    money: '人生最旺的財運。正財、偏財、投資、房產都順。越布施反而賺越多。',
    health: '體重上升、肝臟、糖尿病、膽固醇要注意。「中廣型身材」的宿命。',
    typicalEvents: ['結婚 / 生子', '出國進修', '創業擴張', '當老師 / 導師', '出書 / 升博士', '遇到人生貴人'],
    goodFor: ['進修、出國念書', '結婚生子', '擴張事業', '當導師 / 出書', '投資'],
    watchOut: ['過度樂觀貸款過多', '體重 / 糖分', '承諾太多做不完', '道德議題']
  },
  Saturn: {
    name: 'Saturn 土星大運',
    nickname: '苦盡甘來期',
    years: 19,
    theme: '紀律 · 責任 · 延遲 · 業力',
    vibe: '19 年最磨人但最鍛鍊的大運。前期痛後期成。熬過去你會變成自己尊敬的人。',
    career: '辛苦但穩定。大企業、公務員、政府、工程、建築、法律最吉。升遷慢但位置穩。',
    love: '感情延遲 / 被拒絕 / 長期單身。若結婚對象常有大年齡差或較成熟、穩重。',
    money: '慢慢累積、不求快。不動產、退休金、長期定存是你的財富來源。',
    health: '骨骼、關節、慢性病、憂鬱、牙齒。過勞要小心。「老化」議題凸顯。',
    typicalEvents: ['被老闆壓榨多年後升遷', '長期單身後結婚（或放棄）', '父母年老', '買地 / 蓋房', '重大手術或住院', '沉重的責任'],
    goodFor: ['長期計畫', '進入大企業 / 政府', '學習耐心', '處理家族責任'],
    watchOut: ['憂鬱 / 孤獨', '工作壓力', '感情延遲', '父母健康']
  },
  Mercury: {
    name: 'Mercury 水星大運',
    nickname: '智商與生意運',
    years: 17,
    theme: '學習 · 溝通 · 生意 · 人脈',
    vibe: '17 年的「腦袋值錢」階段。頭腦動得快、生意機會多、人脈爆炸成長。',
    career: '做生意、自媒體、教學、寫作、行銷、翻譯最旺。多元收入是你的強項。',
    love: '聊天型戀愛、年齡差不大、愛笑愛講話的伴侶。可能有姐弟戀 / 忘年交。',
    money: '生意收入、股票、多元管道、仲介、銷售、合約類收入最佳。',
    health: '神經系統、失眠、皮膚、呼吸道、肺部。想太多是主要健康隱患。',
    typicalEvents: ['創業成功', '出書 / 開課', '做自媒體 / YouTube', '出國旅行頻繁', '人脈圈翻倍', '換跑道走商業'],
    goodFor: ['考試、出書、授課', '做生意 / 副業', '擴張人脈', '投資股票'],
    watchOut: ['想太多失眠', '口舌是非', '簽合約要看清', '皮膚 / 呼吸道']
  }
}

// ═════════════════════════════════════════════════════════════
// 9️⃣ 行星建議 — 按月亮星座的守護星
// ═════════════════════════════════════════════════════════════
const rulerOfRashi = {
  Mesha: 'Mars', Vrishabha: 'Venus', Mithuna: 'Mercury', Karka: 'Moon',
  Simha: 'Sun', Kanya: 'Mercury', Tula: 'Venus', Vrishchika: 'Mars',
  Dhanu: 'Jupiter', Makara: 'Saturn', Kumbha: 'Saturn', Meena: 'Jupiter'
}

export const planetRemedies = {
  Sun: { gem: 'Ruby 紅寶石', metal: '金', day: '星期日', mantra: 'Om Suryaya Namaha', focus: '點燃自信、榮耀、與父親的關係' },
  Moon: { gem: 'Pearl 珍珠', metal: '銀', day: '星期一', mantra: 'Om Chandraya Namaha', focus: '滋養情緒、安定心靈' },
  Mars: { gem: 'Red Coral 紅珊瑚', metal: '銅', day: '星期二', mantra: 'Om Angarakaya Namaha', focus: '強化勇氣與行動力' },
  Mercury: { gem: 'Emerald 祖母綠', metal: '青銅', day: '星期三', mantra: 'Om Budhaya Namaha', focus: '提升溝通與心智清晰' },
  Jupiter: { gem: 'Yellow Sapphire 黃寶石', metal: '金', day: '星期四', mantra: 'Om Gurave Namaha', focus: '帶來智慧、擴張、祝福' },
  Venus: { gem: 'Diamond 鑽石', metal: '銀', day: '星期五', mantra: 'Om Shukraya Namaha', focus: '增進愛情、藝術與和諧' },
  Saturn: { gem: 'Blue Sapphire 藍寶石', metal: '鐵', day: '星期六', mantra: 'Om Shanicharaya Namaha', focus: '培養紀律、耐心與業力淨化' }
}

export function getRemedyForRashi(rashiName) {
  const ruler = rulerOfRashi[rashiName]
  return { ruler, ...planetRemedies[ruler] }
}

// ═════════════════════════════════════════════════════════════
// 🔟 關鍵字抽取 — 首頁「你的 5 大關鍵字」
// ═════════════════════════════════════════════════════════════
export function getKeywords({ lagna, moon, sun, nakshatra }) {
  const l = lagnaReadings[lagna]
  const m = moonReadings[moon]
  const s = sunReadings[sun]
  const n = nakshatraReadings[nakshatra]
  const picks = []
  if (l?.tagline) picks.push(l.tagline.split('·')[0].trim())
  if (m?.theme) picks.push(m.theme.split('·')[0].trim())
  if (s?.theme) picks.push(s.theme.split('·')[0].trim())
  if (n?.theme) picks.push(n.theme)
  picks.push('吠陀占星 Jyotish')
  return picks.slice(0, 5)
}

// Helper: strip spaces from Nakshatra name to match key
export function normalizeNakshatraName(name) {
  return name.replace(/\s+/g, '')
}
