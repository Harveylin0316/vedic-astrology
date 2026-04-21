// 10 個事業類別 — 每類由特定行星主宰
// 排名分數 = 主宰行星的力量分數（Raman 規則）
//
// 每個類別包含：
//   - id / name / icon
//   - primary (主宰星，權重 1.0)
//   - secondary (輔助星，權重 0.5)
//   - examples (具體職業清單)
//   - thriveIn (你在什麼環境能發光)
//   - rashiAlignmentHint (如果 Sun/Moon/Lagna 在對應元素 / 星座會加分)

export const CAREER_CATEGORIES = [
  {
    id: 'authority',
    name: '權威 · 管理 · 公眾',
    icon: '👑',
    primary: 'Sun',
    secondary: 'Saturn',
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
    examples: ['設計師 / UI/UX', '時尚 / 服飾 / 化妝品', '室內設計 / 建築', '婚禮 / 精品珠寶', '娛樂 / 演藝 / 歌手', '美食 / 餐廳主理'],
    thriveIn: '以「美」做價值交換的場域',
    avoidIf: 'Venus 落陷於 Kanya → 太理性會失去美感判斷'
  },
  {
    id: 'education',
    name: '教育 · 法律 · 顧問',
    icon: '📚',
    primary: 'Jupiter',
    secondary: 'Mercury',
    examples: ['大學教授 / 教師', '律師 / 法務', '財務顧問 / 會計師', '心理師 / 諮商師', '出版 / 宗教 / 哲學', '高級智庫'],
    thriveIn: '用智慧影響他人、長期建立專業權威',
    avoidIf: 'Jupiter 落陷於 Makara → 樂觀會變成盲目'
  },
  {
    id: 'warrior',
    name: '競爭 · 創業 · 戰鬥',
    icon: '⚔️',
    primary: 'Mars',
    secondary: 'Sun',
    examples: ['創業家 / 業務主管', '軍警 / 消防', '外科醫師 / 急診', '運動員 / 教練', '房地產 / 仲介', '工程 / 機械'],
    thriveIn: '有明確對手、贏得出名字的戰場',
    avoidIf: 'Mars 落陷於 Karka → 行動力易受情緒綁架'
  },
  {
    id: 'service',
    name: '服務 · 照顧 · 民生',
    icon: '🤲',
    primary: 'Moon',
    secondary: 'Venus',
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
    examples: ['房仲 / 地產開發', '農業 / 食品原料', '家族企業承接', '民宿 / 飯店', '建材 / 家居', '母嬰 / 幼教'],
    thriveIn: '有實體資產、跟土地/家庭相關的產業',
    avoidIf: '4 宮被凶星占據 → 家業穩定度受影響'
  }
]
