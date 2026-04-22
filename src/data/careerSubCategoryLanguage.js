// Sub-Category Language Pack — 19 個子類別的中文展示資料
//
// 每個 sub-category 都有：
//   label       — 3〜5 字中文名
//   tagline     — 一句話定位
//   traits      — 3 條 bullet（目前未在 UI 露出，保留給未來擴充）
//   sweetSpot   — 該型最能發揮的場景
//   avoid       — 該型不適合的環境
//   timingAdvice— 大運 / 階段的行動建議
//   role        — 粗略角色類型（給未來 filter 用）
//
// UI 目前會輸出：label + tagline + sweetSpot + avoid + timingAdvice
// （見 src/pages/BirthChart.jsx 的事業章 sub-category 段落）

export const careerSubCategoryLanguage = {
  // ═══════════════ BUSINESS ═══════════════

  'business-tycoon-founder': {
    label: '創業帝王型',
    tagline: '白手創建大型事業、不是當員工的命',
    traits: [
      '從零到一的執行力特強',
      '遇到空白市場會無法自控地想填補',
      '能承擔「剛開始沒人相信你」的孤獨'
    ],
    sweetSpot: '初期 0→1 的不確定性、跨領域的整合、讓一個想法變成一間公司',
    avoid: '大公司下面當小螺絲、重複性工作、需要完全聽命的環境',
    timingAdvice: '你當前大運特別指向「開始一件大事」— 如果有創業念頭，這是大運給的信號',
    role: 'founder'
  },

  'business-tycoon-heir': {
    label: '家業承襲型',
    tagline: '把家族或既有品牌推到下一代的高度',
    traits: [
      '對「長久存在的東西」有天然敬意',
      '能在既有脈絡裡看出升級的切點',
      '不急著推翻前人、但能悄悄把它放大'
    ],
    sweetSpot: '接手家業、品牌第二代、傳統產業現代化、讓老店變長青',
    avoid: '從零起家的新創、需要完全砍掉重練的環境、跟過去斷裂的行業',
    timingAdvice: '你的命格更偏「守成 + 放大」，不是「打破 + 重建」。當前大運是整理與承襲的節奏',
    role: 'heir'
  },

  'business-ceo-hired': {
    label: '職業 CEO 型',
    tagline: '進入成熟組織把它推到下一個層次',
    traits: [
      '懂政治也懂業務',
      '能在既有架構裡「重整 + 放大」',
      '對數字跟人都有掌控感'
    ],
    sweetSpot: '接手已有規模的公司把它推到新 Level、上市公司／跨國企業高管',
    avoid: '純早期新創（你會覺得東西都沒建好無從發揮）',
    timingAdvice: '你的命格走的是「體系內爬到頂」的路線 — 累積年資跟人脈比跳槽重要',
    role: 'ceo-hired'
  },

  'business-investor': {
    label: '投資資本型',
    tagline: '用資本而不是用力氣賺錢',
    traits: [
      '對數字與機率有天生敏感',
      '能冷靜處理別人覺得賭博的決策',
      '長線勝過短打、複利勝過 flip'
    ],
    sweetSpot: '投資、基金、創投、家族辦公室、任何「錢生錢」的角色',
    avoid: '純靠時間賣勞務的工作、只有固定月薪沒有資本積累的位置',
    timingAdvice: '你當前大運對「把錢放對位置」特別有幫助，比換工作更值得盤整資產',
    role: 'investor'
  },

  'business-finance': {
    label: '金融專業型',
    tagline: '在金融體系裡當那個「看得懂」的人',
    traits: [
      '對利率、現金流、風險有本能反應',
      '喜歡結構清楚的專業體系',
      '比起舞台更偏好幕後操盤'
    ],
    sweetSpot: '銀行、投行、會計、稅務、風控、財務長，以及任何需要「把錢管好」的位置',
    avoid: '純創意 / 表演型工作、規則極不透明的小公司',
    timingAdvice: '你適合在金融體系內長期耕耘 — 換公司比換跑道更划算',
    role: 'finance'
  },

  'business-retail': {
    label: '消費品牌型',
    tagline: '靠美感 + 大眾喜好打造消費事業',
    traits: [
      '能感受大眾當下「想要什麼」',
      '對產品外觀與體驗的直覺很準',
      '把生活品味變成商品不費力'
    ],
    sweetSpot: '時尚、零售、餐飲品牌、美妝、精品、任何 B2C 的美感事業',
    avoid: '純 B2B、純技術、完全看不到最終用戶的位置',
    timingAdvice: '你的美感偏好本身就是商業直覺 — 當前大運適合把它變成一個 SKU 或品牌',
    role: 'retail'
  },

  'business-media': {
    label: '媒體內容型',
    tagline: '內容、傳播、出版是你的主戰場',
    traits: [
      '擅長把複雜的事說成大家都懂',
      '對「故事」跟「聲量」都有敏銳度',
      '能在訊息海裡找到被傳播的節點'
    ],
    sweetSpot: '媒體集團、出版、自媒體、廣告／行銷、Podcast、內容平台',
    avoid: '純製造業、完全靜默不溝通的職位',
    timingAdvice: '你適合做「讓訊息跑起來」的事 — 累積個人品牌比跳公司有用',
    role: 'media'
  },

  'business-realestate': {
    label: '地產扎根型',
    tagline: '靠土地、房產、基礎建設累積財富',
    traits: [
      '對「擁有實物」有強烈安全感',
      '耐得住長週期回報',
      '能看出一塊地 / 一棟樓的潛力'
    ],
    sweetSpot: '房地產開發、建設、REITs、家族地產、土地與基建',
    avoid: '純虛擬 / 無形資產、快速轉手的 flip 模式',
    timingAdvice: '你適合「買下來、持有、放大」的節奏 — 不是短期套利',
    role: 'realestate'
  },

  'business-industrial': {
    label: '製造工業型',
    tagline: '做實體的、做得久的、能量化的大事業',
    traits: [
      '尊重供應鏈與製程',
      '耐得住 5–10 年 ROI',
      '能把複雜系統跑起來不出錯'
    ],
    sweetSpot: '製造業、能源、礦業、重工、基礎建設、大型供應鏈',
    avoid: '純行銷 / 純內容、完全不碰實體的位置',
    timingAdvice: '你是「十年布局型」— 當前大運適合投入需要時間回報的大項目',
    role: 'industrial'
  },

  'business-tech-founder': {
    label: '科技創辦型',
    tagline: '靠科技、網路、新興技術打造新物種',
    traits: [
      '對「以前不可能」的東西特別有感',
      '喜歡用槓桿放大（平台、演算法、自動化）',
      '不怕做沒人懂的事'
    ],
    sweetSpot: '科技新創、AI／ML、網路平台、跨境電商、Web3、遊戲',
    avoid: '百年老店、流程僵硬的傳統企業、禁止實驗的環境',
    timingAdvice: '你的命格特別鼓勵「走別人看不懂的路」— 大運給你試錯的空間',
    role: 'tech-founder'
  },

  // ═══════════════ POLITICS ═══════════════

  'politics-head-state': {
    label: '國家元首型',
    tagline: '你的命格走的是「代表國家／代表一個群體」的位置',
    traits: [
      '天然被大眾看見',
      '能把個人形象變成集體象徵',
      '重大時刻能站出來負責'
    ],
    sweetSpot: '國家領袖、集團總裁、國際組織領導、任何需要「最高代表」的位置',
    avoid: '完全幕後、沒有儀式感的純執行崗位',
    timingAdvice: '你的命盤指向「被大眾認識」的路線 — 公眾能見度比薪水重要',
    role: 'head-state'
  },

  'politics-head-gov': {
    label: '行政首長型',
    tagline: '不是站在光下的代表、而是讓政府機器跑起來的人',
    traits: [
      '懂制度、懂流程、懂談判',
      '能在複雜組織裡推動改變',
      '務實勝過魅力'
    ],
    sweetSpot: '總理、首相、部會首長、大型組織的營運長、政府體系內的高階文官',
    avoid: '純形象 / 純舞台的位置、沒有實權的榮譽職',
    timingAdvice: '你的命格是「用制度做事」的類型 — 慢慢爬體系比一步登天更符合你',
    role: 'head-gov'
  },

  'politics-revolutionary': {
    label: '改革革命型',
    tagline: '你的命盤寫著「要推翻一個東西、建立一個新的」',
    traits: [
      '對不公義有強烈反應',
      '能承擔反叛的代價',
      '把理想當燃料不當裝飾'
    ],
    sweetSpot: '社會運動、政治改革、獨立運動、體制突破、顛覆型創業',
    avoid: '保守的體制內、不允許批評的環境',
    timingAdvice: '你的命格天生反骨 — 當前大運可能會讓你對某個「現狀」忍無可忍',
    role: 'revolutionary'
  },

  'politics-military': {
    label: '軍政戰將型',
    tagline: '靠戰場、紀律、危機時刻崛起',
    traits: [
      '體力 + 決斷 + 紀律三合',
      '能在混亂中建立秩序',
      '不怕承擔人命級決策'
    ],
    sweetSpot: '軍事、警政、危機管理、戰時領袖、高壓執法部門',
    avoid: '和平平淡的環境、需要「溫柔說話」的位置',
    timingAdvice: '你命盤的戰將能量在大運配合時最容易被看見 — 不是避難、是迎戰',
    role: 'military'
  },

  'politics-authoritarian': {
    label: '強勢集權型',
    tagline: '不是靠民意、而是靠掌控結構贏',
    traits: [
      '對權力運作看得比多數人清楚',
      '能忍一般人不願意承擔的決斷',
      '願意為長期目標得罪短期利害'
    ],
    sweetSpot: '需要強勢領導的局面、轉型期的公司、需要鐵腕整頓的組織',
    avoid: '需要溫和民主氛圍的工作、完全共識決的團隊',
    timingAdvice: '你的命盤不怕當那個「作決定的人」— 但要小心長期把自己孤立',
    role: 'authoritarian'
  },

  'politics-diplomat': {
    label: '外交國師型',
    tagline: '你是談判桌上的那個「橋」',
    traits: [
      '語言 + 情境判斷能力強',
      '能在對立雙方之間找到第三條路',
      '把複雜局面說得簡單'
    ],
    sweetSpot: '外交、跨國談判、國際組織、戰略顧問、國與國之間的橋梁角色',
    avoid: '完全不跟人打交道的純技術崗、狹隘的本地事務',
    timingAdvice: '你的命格走的是國際 / 跨界 — 累積外語、跨文化資歷會開路',
    role: 'diplomat'
  },

  'government-judicial': {
    label: '司法法律型',
    tagline: '你是體系內負責「公平 / 規則」的那條脊椎',
    traits: [
      '對是非有很深的本能判斷',
      '能承受長期審理的重量',
      '把邏輯放在情緒之前'
    ],
    sweetSpot: '法官、大法官、檢察、仲裁、合規法務、司法體系內的高階職位',
    avoid: '規則模糊、標準天天變的環境',
    timingAdvice: '你的命盤適合長線 + 權威位 — 這種路需要 15–20 年累積',
    role: 'judicial'
  },

  // ═══════════════ ARTS (Round 5) ═══════════════

  'arts-performer-film-actor': {
    label: '電影演員型',
    tagline: '你的事業核心是「在鏡頭前成為另一個人」',
    traits: [
      '被看見不會讓你縮起來、反而放大',
      '能把自己當工具、不怕情緒暴露',
      '對角色的內在邏輯有天生的入戲力'
    ],
    sweetSpot: '劇情片 / 影集主演、舞台劇、需要長時間沉浸角色的演出類型',
    avoid: '純幕後工作、完全不需要表演只靠技術的位置',
    timingAdvice: '你的命盤是「面對大眾」路線 — 舞台曝光比行政位更能激活你的命格',
    role: 'film-actor'
  },

  'arts-performer-musician-singer': {
    label: '歌手聲線型',
    tagline: '你的聲音本身就是作品、不是運載訊息的載體',
    traits: [
      '情緒會在聲音裡被聽出來',
      '大眾對你的聲線有辨識度',
      '比起話語更會用音高、氣流傳訊'
    ],
    sweetSpot: '歌手、聲優、現場演出、Podcast 主持、任何「靠聲音被記住」的工作',
    avoid: '完全文字為主、禁止任何表演成分的位置',
    timingAdvice: '你當前大運對「發聲」特別友善 — 累積聲音作品比頭銜重要',
    role: 'musician-singer'
  },

  'arts-performer-musician-instrument': {
    label: '樂手職人型',
    tagline: '你的手跟樂器比你的嘴更會說話',
    traits: [
      '對細微的律動 / 技巧差異超敏感',
      '願意花十年練一件事',
      '在樂團 / 合奏裡能感受到別人聽不到的縫隙'
    ],
    sweetSpot: '樂手、作曲家、編曲、配樂、任何需要「長期打磨一項手藝」的位置',
    avoid: '必須即時產出、不允許練習曲線的環境',
    timingAdvice: '你適合把「技藝深度」當核心資本 — 比紅起來更重要的是被同行尊敬',
    role: 'musician-instrument'
  },

  'arts-performer-dancer': {
    label: '舞者肢體型',
    tagline: '你用身體說話、而不是用語言',
    traits: [
      '對空間、節奏、肌肉記憶有本能掌握',
      '能把情緒變成可見的動作',
      '體能紀律 + 美感同時在線'
    ],
    sweetSpot: '舞者、編舞、動作設計、表演藝術、任何「身體就是作品」的位置',
    avoid: '完全坐在電腦前的工作、禁止肢體表達的環境',
    timingAdvice: '你的命盤把「身體」放在事業中心 — 訓練跟表演兩條線都要持續',
    role: 'dancer'
  },

  'arts-performer-comedian': {
    label: '喜劇演員型',
    tagline: '你能把世界看歪一度、然後讓大家跟著笑',
    traits: [
      '觀察細節的角度跟大多數人不一樣',
      '不怕自嘲、也不怕當那個「講實話的人」',
      '能在尷尬裡找到節奏'
    ],
    sweetSpot: '脫口秀、情境喜劇、綜藝主持、即興表演、任何需要「把觀察變笑點」的位置',
    avoid: '必須完全嚴肅、禁止任何幽默的職位',
    timingAdvice: '你的命格把「機智 + 親和」放在核心 — 舞台時間比學歷重要',
    role: 'comedian'
  },

  'arts-creator-writer': {
    label: '作家文字型',
    tagline: '你用文字建世界、讓別人住進去',
    traits: [
      '對語言的質感很挑',
      '需要長時間獨處才能產出',
      '能把日常觀察蒸餾成普遍性的東西'
    ],
    sweetSpot: '小說、劇本、詩、長篇文章、任何需要「獨自坐下來寫」的位置',
    avoid: '必須即時反應的會議導向職位、禁止深度思考的環境',
    timingAdvice: '你的命盤強調「用文字留下來」— 作品壽命比薪水重要',
    role: 'writer'
  },

  'arts-creator-director': {
    label: '導演統籌型',
    tagline: '你的天賦是「把幕後的視野變成大眾體驗」',
    traits: [
      '能同時看到整體跟細節',
      '會選人、會挑戰演員',
      '對「畫面該是什麼樣」有強烈主張'
    ],
    sweetSpot: '電影導演、影集 showrunner、舞台劇導演、大型製作的藝術總監',
    avoid: '完全執行別人願景的職位、沒有創作決策權的位置',
    timingAdvice: '你的命格是「領導創作」的型態 — 累積代表作比累積年資關鍵',
    role: 'director'
  },

  'arts-creator-producer': {
    label: '製作統籌型',
    tagline: '你是那個「把一堆天才組合起來讓作品出得來」的人',
    traits: [
      '識人、識聲音、識市場',
      '能在商業跟藝術之間找到平衡',
      '不搶光但作品離不開你'
    ],
    sweetSpot: '音樂製作人、節目製作人、策展人、任何需要「統籌一群創作者」的位置',
    avoid: '必須自己站台的純表演位、完全獨立創作的角色',
    timingAdvice: '你的命格是「幕後聚合器」— 人脈跟眼光是你的真正資本',
    role: 'producer'
  },

  'arts-visual-painter': {
    label: '畫家視覺型',
    tagline: '你需要一塊空白 + 很長的時間 + 沒人打擾',
    traits: [
      '對色彩、質感、構圖有本能直覺',
      '願意長期獨自面對自己的作品',
      '能把看不見的東西畫出來'
    ],
    sweetSpot: '畫家、插畫、視覺藝術、雕塑、任何需要「長時間獨自創作實體作品」的位置',
    avoid: '必須每天合作、完全團隊決議的環境、禁止實驗的氛圍',
    timingAdvice: '你的命盤是「長線 + 獨立」— 作品累積需要 10–20 年才被看見',
    role: 'painter'
  },

  'arts-visual-photographer': {
    label: '攝影觀察型',
    tagline: '你看世界的角度跟多數人不一樣、而且會按下快門',
    traits: [
      '能在一瞬間辨認出「這個畫面值得」',
      '願意長時間等一個瞬間',
      '對光跟影的敏感度超越一般人'
    ],
    sweetSpot: '紀實攝影、肖像、風景、時尚攝影、任何需要「把瞬間變永恆」的位置',
    avoid: '完全按 brief 產出、不允許個人視角的攝影工作',
    timingAdvice: '你的命格走「獨立觀察」路線 — 個人視角比設備重要',
    role: 'photographer'
  }
}

// 翻譯 sub-category key → 展示 label（給 footer 依據用）
export function labelOfSubCategory(key) {
  return careerSubCategoryLanguage[key]?.label || key
}
