// 必殺句型引擎 — 根據命盤配置生成高命中率的個人化句子
// 5 種結構（用戶規範）：
//   1. 表象 vs 真相：「別人以為你 X，其實你內心 Y」
//   2. 循環慣性：「你在 X 情境下總是會 Y，然後後悔 Z」
//   3. 延遲反應：「你不會當下 X，但會在 Y 時候 X」
//   4. 相反吸引：「你表面追求 X，但真正讓你動心的是 Y」
//   5. 童年傷痕：「你小時候某次 X 的經驗，讓你現在遇到 Y 就會過度反應」

// ═════ 表象 vs 真相 (by Lagna vs Moon) ═════
// Lagna = 別人看到的外殼；Moon = 你內在真實的情緒
export const surfaceVsTruthTemplates = {
  // Key: `${lagnaRashi}-${moonRashi}`（用 Tropical）
  // 若無特定組合，使用 default fallback
  default: (lagnaText, moonText) =>
    `別人看到你是${lagnaText}的那種人，但你半夜真正在想的，是${moonText}的那些事。`
}

// Lagna 性格標籤（Tropical Rashi）
const LAGNA_SURFACE_LABEL = {
  Mesha: '衝得最快、最有行動力',
  Vrishabha: '沉穩、有品味、講求穩定',
  Mithuna: '反應快、會說話、人緣好',
  Karka: '溫柔、會照顧人、家庭感強',
  Simha: '有自信、氣場強、像天生主角',
  Kanya: '細心、靠譜、什麼都幫你算好',
  Tula: '優雅、EQ 高、左右逢源',
  Vrishchika: '深沉、神祕、看穿人心',
  Dhanu: '樂觀、愛冒險、講話直',
  Makara: '嚴肅、成熟、做事紮實',
  Kumbha: '獨立、聰明、跟人不一樣',
  Meena: '柔軟、富同情、有藝術氣質'
}

// Moon 真實內在（Tropical Rashi）
const MOON_TRUTH_LABEL = {
  Mesha: '沒人真的看到你在怕什麼 — 你怕停下來',
  Vrishabha: '你骨子裡在計算「這段關係／工作能撐多久」',
  Mithuna: '你腦袋停不下來，一個人時會把事情反覆回放',
  Karka: '你很怕被丟下，但你不會承認',
  Simha: '你不是在炫耀，你只是很怕沒人記得你',
  Kanya: '你的自我批判音量比別人以為的大十倍',
  Tula: '你做每個決定都在思考「別人會怎麼想」',
  Vrishchika: '你記住的恩怨比你表現出的多很多',
  Dhanu: '你其實害怕被綁死、害怕沒有退路',
  Makara: '你的累積安全感的本能，底下是「我怕失敗」',
  Kumbha: '你跟人保持距離不是冷淡，是你怕太靠近會失去自己',
  Meena: '你吸收別人情緒太多了，常覺得自己快被淹沒'
}

// ═════ 循環慣性（依 Moon Nakshatra 設計）═════
export const circularPatternByNakshatra = {
  Ashwini: '你看到機會會立刻衝進去，等跑到一半才想「這個我真的要嗎」— 然後硬著頭皮完成，再後悔',
  Bharani: '你一直忍著某個人/事，累積到極限時突然冷斷 — 別人完全摸不著頭緒',
  Krittika: '你對別人的錯誤看得很清楚會講出來，講完後又開始想「是不是我太直了」',
  Rohini: '你會為美感／享受消費超預算，事後看帳單心疼兩週，下個月又繼續',
  Mrigashira: '你追某個東西（戀人、目標、興趣）時很投入，追到後興趣減一半 — 然後找下個',
  Ardra: '你發生衝突當下會爆發，冷靜後會覺得自己反應過度，道歉但隔幾週又被同樣的事觸發',
  Punarvasu: '你會反覆回到同一類型的人或狀況裡 — 分手後又找一個本質相同的',
  Pushya: '你照顧所有人，當你累的時候沒人發現 — 然後你會心裡默默記「我對他這麼好但...」',
  Ashlesha: '你看穿一個人的本質後會保持表面禮貌，心裡把對方降級 — 但你不會 confront',
  Magha: '你在家族話題前會有一種「我不能讓他們失望」的壓力 — 即使你已經 30 歲',
  PurvaPhalguni: '你享樂時會有罪惡感，但又管不住自己 — 每次都說「下次不這樣」然後下次照樣',
  UttaraPhalguni: '你答應的事做到底，但累積的壓力讓你對「答應新事情」越來越抗拒',
  Hasta: '你接手一個東西就想做到完美 — 但完美主義讓你比別人晚交件，然後自責',
  Chitra: '你外表完美但私下很隨便 — 「人前一套人後一套」的壓力是你的日常',
  Swati: '你跟人親近一段時間後會覺得「太近了」然後默默疏遠 — 幾個月後又想回來',
  Vishakha: '你鎖定目標全力以赴，達成後發現「咦，這好像不是我真正想要的」— 然後找下個',
  Anuradha: '你在群組中扮演黏合劑，當群組散了你會特別失落 — 然後又去建下一個群',
  Jyeshtha: '你扛下太多責任，累積到爆炸時會突然「不想做了」— 全部推翻',
  Mula: '你一段時間後會想把某件事（工作／關係／生活）整個拆掉重來',
  PurvaAshadha: '你在衝刺期會自我鼓勵「我可以」，然後一個小挫折讓你懷疑整個方向',
  UttaraAshadha: '你默默耕耘很久都沒回饋時，會開始懷疑自己選對了嗎 — 但你繼續做',
  Shravana: '你聽別人倒垃圾聽太多，自己的情緒反而無處放 — 深夜會獨自消化',
  Dhanishta: '你設定節奏讓人跟上，當別人跟不上時你會煩 — 最後乾脆自己做',
  Shatabhisha: '你享受獨處但偶爾會 FOMO — 然後覺得群體活動很累，又回到獨處',
  PurvaBhadrapada: '你做到 60-70% 時會突然覺得「方向錯了」— 想砍掉重做',
  UttaraBhadrapada: '你有深刻的感受但很難說出口，累積到夢境裡、藝術裡、深夜哭出來',
  Revati: '你陪人過渡難關後會精疲力盡 — 但下次有人需要你還是會接'
}

// ═════ 延遲反應（依 Moon Rashi 設計）═════
export const delayedReactionByMoonRashi = {
  Mesha: '你在衝突當下會直接反擊，但事後開車回家或洗澡時會想「我剛剛是不是太衝了」',
  Vrishabha: '你當下會壓下不舒服，回家後吃很多、喝很多、買東西 — 用物質平衡情緒',
  Mithuna: '你當下會講笑話帶過，但回家後會在腦中把對話重播 5 次',
  Karka: '你當下會笑著說沒事，回家對家人或伴侶冷戰兩天',
  Simha: '你當下維持優雅，但私底下會跟最親的朋友抱怨那個人很久',
  Kanya: '你當下會分析出對方邏輯漏洞但不講，回家後會寫下所有細節',
  Tula: '你當下會微笑化解，睡前會翻來覆去「我該不該回嘴」',
  Vrishchika: '你當下表情不變，但心裡那筆帳會記 10 年',
  Dhanu: '你當下會笑著反擊，但事後會在跑步、健身、旅行時一直想那件事',
  Makara: '你當下沒反應，幾週後在會議上用冷靜邏輯把那個人 KO',
  Kumbha: '你當下會用一句幽默話遠離，幾天後會跟信任的朋友分析這整件事的結構',
  Meena: '你當下會接收所有情緒，回家後會哭／失眠／做噩夢'
}

// ═════ 相反吸引（依 Lagna Rashi 設計）═════
export const oppositeAttractionByLagna = {
  Mesha: '你嘴上說要「平等能互相 push」的伴侶，但真正讓你心跳加速的是那種「讓你想慢下來、想保護」的溫柔型',
  Vrishabha: '你嘴上說要找「穩定踏實」的人，但真正讓你動心的是那種「帶點危險、不好掌控」的不安分者',
  Mithuna: '你嘴上說要找「聊得來」的，但真正讓你上癮的是那種「話不多但每句都打中你」的沉穩型',
  Karka: '你嘴上說要找「溫暖顧家」的伴侶，但真正吸引你的是那種「有世界觀、來去自由」的人',
  Simha: '你嘴上說要找「欣賞你、給你空間」的人，但真正讓你死心塌地的是那種「敢對你說不」的強者',
  Kanya: '你嘴上說要找「乾淨整齊、有條理」的伴侶，但真正打動你的是那種「有點亂但很真誠」的人',
  Tula: '你嘴上說要找「有品味、和諧」的伴侶，但真正讓你迷戀的是那種「不在乎別人看法」的獨立者',
  Vrishchika: '你嘴上說要找「深度、能懂你」的人，但真正吸引你的是那種「明朗陽光、讓你不用那麼沉重」的人',
  Dhanu: '你嘴上說要找「自由、能一起闖」的人，但真正讓你想安定的是那種「願意陪你在同一個地方」的伴侶',
  Makara: '你嘴上說要找「務實、有成就」的伴侶，但真正讓你放鬆的是那種「不在乎世俗成就、只在乎你的」人',
  Kumbha: '你嘴上說要找「理性、不黏膩」的，但真正讓你破防的是那種「情感濃烈、直白熱切」的人',
  Meena: '你嘴上說要找「浪漫、懂你夢」的人，但真正讓你有安全感的是那種「腳踏實地、幫你處理現實」的人'
}

// ═════ 童年傷痕（依 Sun Rashi 設計）═════
// Sun = 父親、權威；依 Sun 配置推論童年與權威/認可的關係
export const childhoodWoundBySunRashi = {
  Mesha: '你小時候可能有過「想成為第一卻被忽視」的經驗，讓你現在對「我的努力沒被看到」特別敏感',
  Vrishabha: '你小時候可能經歷過「物質不夠安全」或「家裡為錢吵過架」，讓你現在對「錢不夠」有超乎常人的焦慮',
  Mithuna: '你小時候可能有過「我說的話沒人在聽」的經驗，讓你現在對「被打斷、被忽略」特別敏感',
  Karka: '你小時候可能感受到「媽媽有情緒但不能說」的壓力，讓你現在對他人情緒超級敏感、也容易攬在身上',
  Simha: '你小時候可能有一次「努力表現卻沒被稱讚」的經驗，讓你現在對「被看見」有深層需求',
  Kanya: '你小時候可能被要求「完美」或「不能犯錯」，讓你現在對自己的容錯率比對別人低',
  Tula: '你小時候可能經歷過家中衝突，讓你現在對「維持和諧」有近乎強迫的本能 — 寧可自己吞下不適',
  Vrishchika: '你小時候可能有一次「被背叛或欺騙」的經驗（朋友、家人），讓你現在對「別人靠近」有天生的警戒',
  Dhanu: '你小時候可能被期待「出人頭地、做有意義的事」，讓你現在對「過平凡生活」有潛在抗拒',
  Makara: '你小時候可能被迫「早熟、承擔大人的事」，讓你現在很難真正放鬆、享受不需負責的時刻',
  Kumbha: '你小時候可能有「跟家人不同頻、覺得自己是外星人」的經驗，讓你現在對「格格不入」既習慣又厭倦',
  Meena: '你小時候可能吸收了太多家人的情緒（父母爭執、親人生病等），讓你現在很容易把別人的情緒變成自己的'
}

// ═════ 渲染器 ═════
// 根據 chart 配置，從模板挑適合的填充並生成句子
// 返回 5 類各一句（如果資料齊全）

export function renderSignatureSentences({ lagnaRashi, moonRashi, sunRashi, moonNakshatra }) {
  const sentences = []

  // 1. 表象 vs 真相
  const lagnaSurface = LAGNA_SURFACE_LABEL[lagnaRashi]
  const moonTruth = MOON_TRUTH_LABEL[moonRashi]
  if (lagnaSurface && moonTruth) {
    sentences.push({
      type: '表象 vs 真相',
      text: `別人以為你是${lagnaSurface}的人，${moonTruth}。`
    })
  }

  // 2. 循環慣性（from Moon Nakshatra）
  const nakshatraKey = (moonNakshatra || '').replace(/\s+/g, '')
  const circular = circularPatternByNakshatra[nakshatraKey]
  if (circular) {
    sentences.push({
      type: '循環慣性',
      text: circular + '。'
    })
  }

  // 3. 延遲反應（from Moon Rashi）
  const delayed = delayedReactionByMoonRashi[moonRashi]
  if (delayed) {
    sentences.push({
      type: '延遲反應',
      text: delayed + '。'
    })
  }

  // 4. 相反吸引（from Lagna Rashi）
  const opposite = oppositeAttractionByLagna[lagnaRashi]
  if (opposite) {
    sentences.push({
      type: '相反吸引',
      text: opposite + '。'
    })
  }

  // 5. 童年傷痕（from Sun Rashi）
  const childhood = childhoodWoundBySunRashi[sunRashi]
  if (childhood) {
    sentences.push({
      type: '童年傷痕',
      text: childhood + '。'
    })
  }

  return sentences
}
