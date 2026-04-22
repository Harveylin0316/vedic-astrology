import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { nakshatras } from '../data/nakshatras.js'
import { nakshatraReadings, normalizeNakshatraName } from '../data/interpretations.js'

// slug 規則：`Ashwini` → `ashwini`、`Purva Phalguni` → `purva-phalguni`
export function nakshatraSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-')
}
export function nakshatraFromSlug(slug) {
  return nakshatras.find(
    (n) => nakshatraSlug(n.name) === slug?.toLowerCase()
  )
}

export default function NakshatraDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const n = nakshatraFromSlug(slug)
  const reading = n ? nakshatraReadings[normalizeNakshatraName(n.name)] : null

  // 前 / 後鄰居
  const idx = n ? nakshatras.findIndex((x) => x.id === n.id) : -1
  const prev = idx > 0 ? nakshatras[idx - 1] : nakshatras[nakshatras.length - 1]
  const next = idx < nakshatras.length - 1 ? nakshatras[idx + 1] : nakshatras[0]

  // 無效 slug → 回列表（useEffect 必須無條件 call）
  useEffect(() => {
    if (!n) navigate('/nakshatras', { replace: true })
  }, [n, navigate])

  // SEO meta tags
  useEffect(() => {
    if (!n) return
    const title = `${n.name} 月宿（${n.chinese}）· 吠陀占星 ${reading?.theme ? '· ' + reading.theme : ''}`
    document.title = title

    const desc = reading?.body ||
      `${n.name}（${n.chinese}）是 27 個吠陀月宿的第 ${n.id} 個，守護神${n.deity}，主宰行星${n.ruler}。${n.trait}。`
    const setMeta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('name', name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }
    const setOg = (property, content) => {
      let el = document.querySelector(`meta[property="${property}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('property', property)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }
    setMeta('description', desc)
    setOg('og:title', title)
    setOg('og:description', desc)

    return () => {
      document.title = '吠陀占星 · Vedic Astrology'
    }
  }, [n, reading])

  if (!n) return null

  const sanskritChar = NAK_SANSKRIT[n.name] || 'नक्षत्र'
  const romanNumeral = toRomanNumeral(n.id)

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* ═══ Hero 雜誌頁首 ═══ */}
      <div className="relative mb-16 pt-10 pb-14 overflow-hidden">
        <div
          className="giant-numeral absolute left-[-30px] md:left-[-50px] top-[-10%] z-0"
          aria-hidden="true"
        >
          {romanNumeral}
        </div>
        <div
          className="sanskrit-decoration absolute right-[-40px] bottom-[-10%] z-0 hidden md:block"
          aria-hidden="true"
        >
          {sanskritChar}
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <Link
            to="/nakshatras"
            className="inline-block mb-6 font-caps text-[10px] uppercase tracking-[0.4em] text-gold-500/70 hover:text-gold-300 transition"
          >
            ← 回 27 月宿
          </Link>

          <div className="font-caps text-[10px] md:text-xs uppercase tracking-[0.5em] text-gold-500 mb-6">
            Nakshatra&nbsp;No.&nbsp;{toRomanNumeral(n.id)} · Of&nbsp;XXVII
          </div>

          <h1
            className="font-serif leading-[0.95] text-parchment-50 tracking-tight mb-4"
            style={{
              fontSize: 'clamp(52px, 10vw, 160px)',
              fontWeight: 600,
              fontVariationSettings: '"opsz" 144, "wght" 600, "SOFT" 30'
            }}
          >
            {n.name}
          </h1>
          <div className="font-serif italic text-2xl md:text-3xl text-gold-300 mb-8">
            {n.chinese}
          </div>

          <div className="flex items-center justify-center gap-4 mb-6 text-gold-400/60">
            <span className="h-px w-20 bg-gold-500/40" />
            <span className="font-serif text-lg">✦</span>
            <span className="h-px w-20 bg-gold-500/40" />
          </div>

          {reading?.theme && (
            <p className="epigraph max-w-xl mx-auto">
              {reading.theme}
            </p>
          )}
        </div>
      </div>

      {/* ═══ 基本資訊 4 格 ═══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gold-500/15 mb-16 border border-gold-500/15">
        <InfoCell label="守護神" value={n.deity} />
        <InfoCell label="主宰行星" value={n.ruler} sub={PLANET_ZH[n.ruler]} />
        <InfoCell label="符號" value={n.symbol} />
        <InfoCell label="特質" value={n.trait} />
      </div>

      {/* ═══ 深度解讀 ═══ */}
      {reading && (
        <section className="relative py-12 md:py-16 px-6 md:px-10 border-y border-gold-500/15 mb-16">
          <div className="max-w-3xl mx-auto">
            <div className="chapter-eyebrow mb-3">深度解讀 · Profunditas</div>
            <h2 className="font-serif text-3xl md:text-5xl text-gold-200 tracking-tight leading-[1.05] mb-8">
              月亮落在 {n.name} 的人
            </h2>
            <p
              className="font-body text-[17px] md:text-[19px] leading-[1.9] text-parchment-200"
              style={{ textIndent: '2em' }}
            >
              {reading.body}
            </p>

            {/* 延伸：4 Pada 一句話 */}
            <div className="mt-12 pt-8 border-t border-gold-500/20">
              <div className="chapter-eyebrow mb-6">四個 Pada</div>
              <div className="grid md:grid-cols-2 gap-5">
                {[1, 2, 3, 4].map((p) => (
                  <div key={p} className="border-l-2 border-gold-500/40 pl-4">
                    <div className="font-caps text-[10px] uppercase tracking-[0.3em] text-gold-500 mb-1">
                      Pada {p}
                    </div>
                    <div className="font-body text-[15px] text-parchment-200/80 leading-[1.7]">
                      {PADA_HINTS[n.id]?.[p - 1] || `第 ${p} 個 Pada 細分了這個 Nakshatra 的能量層次。`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ CTA：算我的 ═══ */}
      <section className="text-center mb-16">
        <div className="chapter-eyebrow mb-4">Want to know yours?</div>
        <h2 className="font-serif text-4xl md:text-6xl text-gold-200 tracking-tight mb-8">
          你的月亮落在哪個 Nakshatra？
        </h2>
        <p className="epigraph max-w-xl mx-auto mb-8">
          輸入生辰 · 30 秒免費算你的月宿 + 完整命盤解讀
        </p>
        <Link to="/birth-chart" className="btn-primary">
          算我的命盤 →
        </Link>
      </section>

      {/* ═══ 前後鄰居導覽 ═══ */}
      <nav className="flex items-center justify-between border-t border-gold-500/20 pt-8 mt-16">
        <Link
          to={`/nakshatras/${nakshatraSlug(prev.name)}`}
          className="group flex flex-col items-start gap-1 text-parchment-200/70 hover:text-gold-200 transition"
        >
          <span className="font-caps text-[9px] uppercase tracking-[0.4em] text-gold-500/70">
            ← 前一個
          </span>
          <span className="font-serif italic text-xl">{prev.name}</span>
          <span className="text-xs text-parchment-200/50">{prev.chinese}</span>
        </Link>
        <Link
          to={`/nakshatras/${nakshatraSlug(next.name)}`}
          className="group flex flex-col items-end gap-1 text-parchment-200/70 hover:text-gold-200 transition text-right"
        >
          <span className="font-caps text-[9px] uppercase tracking-[0.4em] text-gold-500/70">
            下一個 →
          </span>
          <span className="font-serif italic text-xl">{next.name}</span>
          <span className="text-xs text-parchment-200/50">{next.chinese}</span>
        </Link>
      </nav>
    </div>
  )
}

function InfoCell({ label, value, sub }) {
  return (
    <div className="bg-ink-900/60 p-6">
      <div className="font-caps text-[9px] uppercase tracking-[0.35em] text-gold-500/70 mb-2">
        {label}
      </div>
      <div className="font-serif text-xl md:text-2xl text-gold-200 leading-tight">
        {value}
        {sub && <span className="text-sm text-parchment-200/60 ml-2 font-body">· {sub}</span>}
      </div>
    </div>
  )
}

// ─── Helper data ──────────────────────────────

const PLANET_ZH = {
  Ketu: '南交', Venus: '金星', Sun: '太陽', Moon: '月亮',
  Mars: '火星', Rahu: '北交', Jupiter: '木星', Saturn: '土星', Mercury: '水星'
}

const NAK_SANSKRIT = {
  Ashwini: 'अश्विनी', Bharani: 'भरणी', Krittika: 'कृत्तिका', Rohini: 'रोहिणी',
  Mrigashira: 'मृगशिरा', Ardra: 'आर्द्रा', Punarvasu: 'पुनर्वसु', Pushya: 'पुष्य',
  Ashlesha: 'आश्लेषा', Magha: 'मघा', 'Purva Phalguni': 'पूर्व फाल्गुनी',
  'Uttara Phalguni': 'उत्तर फाल्गुनी', Hasta: 'हस्त', Chitra: 'चित्रा',
  Swati: 'स्वाती', Vishakha: 'विशाखा', Anuradha: 'अनुराधा', Jyeshtha: 'ज्येष्ठा',
  Mula: 'मूल', 'Purva Ashadha': 'पूर्वाषाढ़ा', 'Uttara Ashadha': 'उत्तराषाढ़ा',
  Shravana: 'श्रवण', Dhanishta: 'धनिष्ठा', Shatabhisha: 'शतभिषा',
  'Purva Bhadrapada': 'पूर्व भाद्रपदा', 'Uttara Bhadrapada': 'उत्तर भाद्रपदा',
  Revati: 'रेवती'
}

const PADA_HINTS = {
  1: ['初動：全速衝刺', '節奏：快', '衝撞感：高', '開拓欲：強'],
  2: ['初動：謹慎承重', '節奏：穩', '耐力感：高', '承諾感：深'],
  3: ['初動：銳利評估', '節奏：準', '淨化感：強', '焦點：清晰'],
  4: ['初動：享受此刻', '節奏：豐', '感官感：濃', '創造：自然'],
  5: ['初動：好奇出發', '節奏：輕', '流動感：強', '探索：多路'],
  6: ['初動：情緒激盪', '節奏：起伏', '張力：高', '誠實：至上'],
  7: ['初動：歸鄉重啟', '節奏：循環', '修復力：強', '寬容：多'],
  8: ['初動：滋養長者', '節奏：吉', '責任感：高', '智慧感：深'],
  9: ['初動：暗中觀察', '節奏：慢', '洞察：深', '神秘：重'],
  10: ['初動：繼承王權', '節奏：端正', '威嚴：強', '祖業：重'],
  11: ['初動：享樂藝術', '節奏：慵', '魅力：強', '感情：濃'],
  12: ['初動：契約連結', '節奏：穩', '忠誠：深', '結盟：穩'],
  13: ['初動：巧手動作', '節奏：精', '技藝：高', '點石：成金'],
  14: ['初動：閃耀登場', '節奏：亮', '吸引力：強', '工藝：美'],
  15: ['初動：獨立起飛', '節奏：自由', '彈性：高', '商業：敏'],
  16: ['初動：盯緊目標', '節奏：衝', '意志：強', '晚成：大'],
  17: ['初動：連結組織', '節奏：穩', '友情：深', '海外：多'],
  18: ['初動：承擔長老', '節奏：重', '威望：高', '壓力：大'],
  19: ['初動：連根拔起', '節奏：劇變', '真理：不讓', '拆解：徹底'],
  20: ['初動：戰歌激勵', '節奏：熱', '精神力：強', '不敗：永'],
  21: ['初動：晚來勝利', '節奏：久', '正義：重', '服務：廣'],
  22: ['初動：傾聽智慧', '節奏：靜', '學習力：高', '連結：深'],
  23: ['初動：敲鼓集群', '節奏：節拍', '富足：顯', '社交：旺'],
  24: ['初動：獨行療癒', '節奏：隱', '神秘：深', '晚成：靈'],
  25: ['初動：轉化火焰', '節奏：烈', '改革：強', '犧牲：大'],
  26: ['初動：深海探索', '節奏：深', '同情：廣', '靈性：覺醒'],
  27: ['初動：終點守護', '節奏：溫', '慈悲：深', '完結：美']
}

function toRomanNumeral(num) {
  const romans = [
    { v: 27, r: 'XXVII' }, { v: 26, r: 'XXVI' }, { v: 25, r: 'XXV' },
    { v: 24, r: 'XXIV' }, { v: 23, r: 'XXIII' }, { v: 22, r: 'XXII' },
    { v: 21, r: 'XXI' }, { v: 20, r: 'XX' }, { v: 19, r: 'XIX' },
    { v: 18, r: 'XVIII' }, { v: 17, r: 'XVII' }, { v: 16, r: 'XVI' },
    { v: 15, r: 'XV' }, { v: 14, r: 'XIV' }, { v: 13, r: 'XIII' },
    { v: 12, r: 'XII' }, { v: 11, r: 'XI' }, { v: 10, r: 'X' },
    { v: 9, r: 'IX' }, { v: 8, r: 'VIII' }, { v: 7, r: 'VII' },
    { v: 6, r: 'VI' }, { v: 5, r: 'V' }, { v: 4, r: 'IV' },
    { v: 3, r: 'III' }, { v: 2, r: 'II' }, { v: 1, r: 'I' }
  ]
  for (const { v, r } of romans) if (num >= v) return r
  return String(num)
}
