// 10 個事業類別 — 每類由特定行星主宰 + 元素親和度
// 排名分數 = 力量分數（行星強弱）+ 契合分數（你性格元素跟這類搭不搭）
//
// 每個類別包含：
//   - primary / secondary：主宰行星（決定「能力分」）
//   - elementAffinity：此類事業偏好的元素 0-3 分（決定「契合分」）
//   - examples / thriveIn / avoidIf

export const CAREER_CATEGORIES = [
  {
    id: 'authority',
    name: '權威 · 管理 · 公眾',
    icon: '👑',
    primary: 'Sun',
    secondary: 'Saturn',
    // 領袖/管理：火象最適、土象也行（務實紀律）、水風較不搭
    elementAffinity: { fire: 3, earth: 2, air: 1, water: 0 },
    examples: ['CEO / 高階主管', '公務員 / 政府機關', '政治 / 民代', '公眾人物 / 媒體主持', '總監 / 領導職', '軍警最高領導'],
    thriveIn: '有層級、有曝光、能被看見的組織',
    avoidIf: 'Sun 落陷在 Tula + 無強化 → 不適合當頭'
  },
  {
    id: 'commerce',
    name: '商業 · 寫作 · 智識',
    icon: '📝',
    primary: 'Mercury',
    secondary: 'Jupiter',
    // 商業智識：風象最適（溝通/思考）、火象次之（行動）
    elementAffinity: { fire: 2, earth: 1, air: 3, water: 1 },
    examples: ['PM / 業務 / 市場', '作家 / 記者 / 編輯', '顧問 / 分析師', '工程師 / 程式', '講師 / 教練', '投資分析'],
    thriveIn: '高智識密度、腦力變現、靠「嘴跟腦」的工作',
    avoidIf: 'Mercury 燃燒 / 落陷於 Meena → 商業嗅覺不穩'
  },
  {
    id: 'aesthetic',
    name: '美學 · 設計 · 精品',
    icon: '🎨',
    primary: 'Venus',
    secondary: 'Moon',
    // 美學：水象（感性）+ 土象（感官/質感）最搭、火象太衝、風象太理性
    elementAffinity: { fire: 1, earth: 2, air: 1, water: 3 },
    examples: ['設計師 / UI/UX', '時尚 / 服飾 / 化妝品', '室內設計', '婚禮 / 精品珠寶', '娛樂 / 演藝 / 歌手', '美食 / 餐廳主理'],
    thriveIn: '以「美」做價值交換的場域',
    avoidIf: 'Venus 落陷於 Kanya → 太理性會失去美感判斷'
  },
  {
    id: 'education',
    name: '教育 · 法律 · 顧問',
    icon: '📚',
    primary: 'Jupiter',
    secondary: 'Mercury',
    // 教育顧問：火（意義）+ 風（知識）+ 水（共感）均衡
    elementAffinity: { fire: 2, earth: 1, air: 2, water: 2 },
    examples: ['大學教授 / 教師', '律師 / 法務', '財務顧問 / 會計師', '心理師 / 諮商師', '出版 / 宗教 / 哲學', '高級智庫'],
    thriveIn: '用智慧影響他人、長期建立專業權威',
    avoidIf: 'Jupiter 落陷於 Makara → 樂觀會變成盲目'
  },
  {
    id: 'warrior',
    name: '競爭 · 業務 · 行動派',
    icon: '⚔️',
    primary: 'Mars',
    secondary: 'Sun',
    // 純 Mars 能量：戰鬥、衝刺、體能、對抗
    elementAffinity: { fire: 3, earth: 1, air: 1, water: 0 },
    examples: ['業務主管 / 銷售冠軍', '軍警 / 消防', '外科醫師 / 急診', '運動員 / 教練', '高壓談判', '機械 / 技工'],
    thriveIn: '有明確對手、靠體力或勝負賺錢的戰場',
    avoidIf: 'Mars 落陷於 Karka → 行動力易受情緒綁架',
    note: '此類是「純粹 Mars 能量的行業」。「創業」不在此類 — 因為創業是工作方式（可在任何類別中發生），下方有獨立的「創業傾向指數」。'
  },
  {
    id: 'service',
    name: '服務 · 照顧 · 民生',
    icon: '🤲',
    primary: 'Moon',
    secondary: 'Venus',
    // 服務業：水象最適（共感）、土象穩定服務、火風較難持久
    elementAffinity: { fire: 0, earth: 2, air: 1, water: 3 },
    examples: ['護理 / 照護', '餐飲 / 食品', '婦幼相關', '公關 / 客服', '家居 / 民生產品', '公益 / NPO'],
    thriveIn: '跟「多數人的日常」有關的行業',
    avoidIf: 'Moon 落陷於 Vrishchika → 情緒會拖累服務業的穩定性'
  },
  {
    id: 'structure',
    name: '工程 · 建築 · 長期型',
    icon: '🏗️',
    primary: 'Saturn',
    secondary: 'Mars',
    // 建築/工程：純土最適、火象能扛、水風感覺枯燥
    elementAffinity: { fire: 1, earth: 3, air: 1, water: 0 },
    examples: ['建築師 / 工程師', '土地 / 不動產開發', '重工 / 製造業', '保險 / 稅務', '政府工程', '能源 / 交通'],
    thriveIn: '10 年為單位累積、有 deadlines 跟合規的大系統',
    avoidIf: 'Saturn 燃燒 / 落陷於 Mesha → 紀律不穩'
  },
  {
    id: 'tech_disruption',
    name: '科技 · 新創 · 海外',
    icon: '🚀',
    primary: 'Rahu',
    secondary: 'Mercury',
    // 科技新創：風（創新）+ 火（衝）最搭、土象保守不合、水象太情緒
    elementAffinity: { fire: 2, earth: 1, air: 3, water: 0 },
    examples: ['科技新創', '加密貨幣 / Web3', '跨國貿易', '網紅 / 自媒體', '遊戲產業', '數位行銷 / 成長駭客'],
    thriveIn: '沒有前例可循、一次翻桌可能大贏的賭場型產業',
    avoidIf: 'Rahu 無其他強星支持 → 沉迷風險高'
  },
  {
    id: 'research_spiritual',
    name: '研究 · 療癒 · 靈性',
    icon: '🔮',
    primary: 'Ketu',
    secondary: 'Jupiter',
    // 研究靈性：水（深度）+ 風（抽象）最搭、火象坐不住、土象要具體
    elementAffinity: { fire: 1, earth: 1, air: 2, water: 3 },
    examples: ['研究員 / 學者', '心理治療 / 神經科', '中醫 / 自然療法', '神秘學 / 塔羅 / 占星', '哲學 / 宗教', '獨立創作 / 冥想導師'],
    thriveIn: '不需要被看見、深入研究的幕後領域',
    avoidIf: 'Ketu 無 Jupiter 支持 → 會變成逃避'
  },
  {
    id: 'property_agri',
    name: '不動產 · 農業 · 家庭產業',
    icon: '🏡',
    primary: 'Mars',
    secondary: 'Moon',
    // 不動產/農業：土（實質資產）+ 水（家庭情感）最搭
    elementAffinity: { fire: 1, earth: 3, air: 0, water: 2 },
    examples: ['房仲 / 地產開發', '農業 / 食品原料', '家族企業承接', '民宿 / 飯店', '建材 / 家居', '母嬰 / 幼教'],
    thriveIn: '有實體資產、跟土地/家庭相關的產業',
    avoidIf: '4 宮被凶星占據 → 家業穩定度受影響'
  }
]
