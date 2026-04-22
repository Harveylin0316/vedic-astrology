import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  Heart,
  Briefcase,
  Sparkle,
  ShieldCheck,
  Clock4,
  Settings2,
  UserRound,
  Link2,
  Check
} from 'lucide-react'
import { cities, findCity } from '../data/cities.js'
import MysticalTransition from '../components/MysticalTransition.jsx'
import BirthChartShareCard from '../components/BirthChartShareCard.jsx'
import ShareCardSection from '../components/ShareCardSection.jsx'
import { trackEvent } from '../components/Analytics.jsx'
import { computeRarityIndex } from '../utils/rarityIndex.js'
import { renderSignatureSentences } from '../utils/sentenceTemplates.js'
import { buildPersonaSignature } from '../data/personaLabels.js'
import { buildCardPunchlines } from '../data/cardPunchlines.js'
import { buildAstrologerNote } from '../utils/astrologerNoteBuilder.js'
import { dashaLifeStages, getLifeFlavor, lifePhaseLabel } from '../data/dashaLifeStages.js'
import { analyzeVedicCareer } from '../utils/careerVedic.js'
import { dignityLabels } from '../data/careerVedicData.js'
import SmartDateInput from '../components/SmartDateInput.jsx'
import SmartTimeInput from '../components/SmartTimeInput.jsx'
import { useI18n } from '../i18n/I18nProvider.jsx'
import {
  encodeBirthPayload,
  decodeBirthPayload,
  replaceUrlParam,
  copyToClipboard
} from '../utils/permalink.js'
import {
  computeVedicChart,
  formatDegrees,
  computeVimshottariDasha,
  getCurrentDasha,
  computeAntardashas,
  getCurrentAntardasha
} from '../utils/vedicCalc.js'
import ChartWheel from '../components/ChartWheel.jsx'
import {
  lagnaReadings,
  sunReadings,
  moonReadings,
  nakshatraReadings,
  luckySystem,
  compatibility,
  dashaReadings,
  getElementBalance,
  getRemedyForRashi,
  getKeywords,
  getPersonalitySummary,
  getDashaEventsForAge,
  normalizeNakshatraName
} from '../data/interpretations.js'

const defaultForm = {
  date: '',
  time: '',
  tz: '8',
  lat: '25.0478',
  lon: '121.5319',
  city: '台北',
  gender: '',
  unknownTime: false
}

// 命盤依據區塊用的行星名中文化（只作顯示層替換，不動變數）
const PLANET_ZH = {
  Sun: '太陽',
  Moon: '月亮',
  Mars: '火星',
  Mercury: '水星',
  Jupiter: '木星',
  Venus: '金星',
  Saturn: '土星',
  Rahu: '北交點',
  Ketu: '南交點'
}
const zhPlanet = (name) => (name && PLANET_ZH[name]) || name

// sectionTabs will be built inside the component to use t()

export default function BirthChart() {
  const { t, lang } = useI18n()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState(defaultForm)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [chart, setChart] = useState(null)
  const [pendingChart, setPendingChart] = useState(null)
  const [pendingMeta, setPendingMeta] = useState(null)
  const [showTransition, setShowTransition] = useState(false)
  const [submittedCity, setSubmittedCity] = useState('')
  const [submittedStamp, setSubmittedStamp] = useState('')
  const [submittedGender, setSubmittedGender] = useState('')
  const [submittedUnknownTime, setSubmittedUnknownTime] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('self')
  const [closingCopied, setClosingCopied] = useState(false)

  // 從 URL 參數還原（永久連結）
  useEffect(() => {
    const encoded = searchParams.get('d')
    if (!encoded) return
    const restored = decodeBirthPayload(encoded)
    if (!restored) return
    setForm(restored)
    try {
      const [year, month, day] = restored.date.split('-').map(Number)
      const [hour, minute] = restored.time.split(':').map(Number)
      const result = computeVedicChart({
        year, month, day, hour, minute,
        tzOffset: parseFloat(restored.tz),
        lat: parseFloat(restored.lat),
        lon: parseFloat(restored.lon)
      })
      setChart(result)
      setSubmittedCity(restored.city || `${restored.lat}, ${restored.lon}`)
      setSubmittedStamp(`${restored.date} ${restored.time}`)
      setSubmittedGender(restored.gender)
      trackEvent('birth_chart_permalink_view')
    } catch (err) {
      console.error(err)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  // 城市 autocomplete：選到已知城市自動填 lat/lon/tz
  const handleCityChange = (value) => {
    const matched = findCity(value)
    if (matched) {
      setForm((f) => ({
        ...f,
        city: matched.name,
        lat: String(matched.lat),
        lon: String(matched.lon),
        tz: String(matched.tz)
      }))
    } else {
      setForm((f) => ({ ...f, city: value }))
    }
  }

  const handleCompute = (e) => {
    e.preventDefault()
    setError('')
    if (!form.date || !form.time) {
      setError(t('form.error.dateTime'))
      return
    }
    try {
      const [year, month, day] = form.date.split('-').map(Number)
      const [hour, minute] = form.time.split(':').map(Number)
      const result = computeVedicChart({
        year, month, day, hour, minute,
        tzOffset: parseFloat(form.tz),
        lat: parseFloat(form.lat),
        lon: parseFloat(form.lon)
      })
      // 先暫存結果，啟動神祕過場；動畫結束後才揭曉命盤
      setPendingChart(result)
      setPendingMeta({
        city: form.city || `${form.lat}, ${form.lon}`,
        stamp: `${form.date} ${form.time}`,
        gender: form.gender,
        unknownTime: !!form.unknownTime
      })
      setShowTransition(true)
      // 把生辰編進 URL（永久連結）
      replaceUrlParam('d', encodeBirthPayload(form))
      trackEvent('compute_birth_chart', {
        has_gender: !!form.gender,
        has_city: !!findCity(form.city)
      })
    } catch (err) {
      setError(t('form.error.generic'))
      console.error(err)
    }
  }

  const handleTransitionComplete = () => {
    setChart(pendingChart)
    setSubmittedCity(pendingMeta.city)
    setSubmittedStamp(pendingMeta.stamp)
    setSubmittedGender(pendingMeta.gender)
    setSubmittedUnknownTime(!!pendingMeta.unknownTime)
    setShowTransition(false)
    // 轉場結束後滑到頁頂讓命盤從頭呈現
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 性別代稱
  const partnerTerm = submittedGender === 'male' ? '女友 / 老婆'
    : submittedGender === 'female' ? '男友 / 老公'
    : '另一半 / 伴侶'

  // 錨點平滑捲動
  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveTab(id)
  }

  // Raman-framework 混合策略：
  // • 西方 Tropical 用於「性格解讀」— 用戶熟悉的星座
  // • 吠陀 Sidereal 用於「運勢預測」— Nakshatra + Dasha (Vedic 獨有)
  const tropLagnaName = chart ? chart.tropical.ascendant.rashi.name : null
  const tropMoonName = chart ? chart.tropical.moon.rashi.name : null
  const tropSunName = chart ? chart.tropical.sun.rashi.name : null

  const lagna = chart ? lagnaReadings[tropLagnaName] : null
  const moon = chart ? moonReadings[tropMoonName] : null
  const sun = chart ? sunReadings[tropSunName] : null
  const nakshatra = chart
    ? nakshatraReadings[normalizeNakshatraName(chart.sidereal.moon.nakshatra.name)]
    : null
  const lucky = chart ? luckySystem[tropMoonName] : null
  const match = chart ? compatibility[tropMoonName] : null
  const remedy = chart ? getRemedyForRashi(tropMoonName) : null
  const elementBalance = chart
    ? getElementBalance({
        sunRashi: tropSunName,
        moonRashi: tropMoonName,
        lagnaRashi: tropLagnaName
      })
    : null

  const dashaPeriods = chart
    ? computeVimshottariDasha({
        moonSidereal: chart.sidereal.moon.longitude,
        birthYear: chart._input.year,
        birthMonth: chart._input.month,
        birthDay: chart._input.day,
        birthHour: chart._input.hour,
        birthMinute: chart._input.minute
      })
    : null
  const currentDasha = dashaPeriods ? getCurrentDasha(dashaPeriods) : null
  const currentDashaReading = currentDasha ? dashaReadings[currentDasha.lord] : null
  const nextDashaReading = currentDasha?.next ? dashaReadings[currentDasha.next.lord] : null

  // Antardasha (sub-periods) within current Mahadasha — Raman 法
  const antardashas = currentDasha ? computeAntardashas(currentDasha) : []
  const currentAD = antardashas.length ? getCurrentAntardasha(antardashas) : null
  const currentADReading = currentAD ? dashaReadings[currentAD.lord] : null
  const upcomingADs = currentAD
    ? antardashas.filter((a) => a.start > new Date()).slice(0, 3)
    : []

  // Split periods into past / present / future with age calculation
  const birthDateObj = chart
    ? new Date(Date.UTC(chart._input.year, chart._input.month - 1, chart._input.day, chart._input.hour, chart._input.minute))
    : null
  const now = new Date()
  const ageOf = (d) => ((d - birthDateObj) / (365.25 * 24 * 60 * 60 * 1000))
  const pastPeriods = dashaPeriods ? dashaPeriods.filter((p) => p.end <= now) : []
  const futurePeriods = dashaPeriods
    ? dashaPeriods.filter((p) => p.start > now).slice(0, 4)
    : []

  const keywords = chart
    ? getKeywords({
        lagna: tropLagnaName,
        moon: tropMoonName,
        sun: tropSunName,
        nakshatra: normalizeNakshatraName(chart.sidereal.moon.nakshatra.name)
      })
    : null

  const personality = chart
    ? getPersonalitySummary({
        lagna: tropLagnaName,
        moon: tropMoonName,
        sun: tropSunName
      })
    : null

  const rarity = chart ? computeRarityIndex(chart) : null

  const signatures = chart
    ? renderSignatureSentences({
        lagnaRashi: tropLagnaName,
        moonRashi: tropMoonName,
        sunRashi: tropSunName,
        moonNakshatra: chart.sidereal.moon.nakshatra.name
      })
    : []

  const persona = chart ? buildPersonaSignature(tropLagnaName, tropMoonName) : null

  const cardPunchlines = chart
    ? buildCardPunchlines({
        lagnaRashi: tropLagnaName,
        sunRashi: tropSunName,
        moonRashi: tropMoonName,
        nakshatraName: chart.sidereal.moon.nakshatra.name
      })
    : []

  const vedicCareer = chart
    ? analyzeVedicCareer(chart, currentDasha?.lord, currentAD?.lord)
    : null

  const astrologerNote = chart ? buildAstrologerNote(chart, persona) : null
  // 取得某段筆記 body 的小工具（把筆記內容散佈到對應 section 用）
  const noteBody = (id) => astrologerNote?.sections?.find((s) => s.id === id)?.body || null

  const sectionTabs = [
    { id: 'self', label: t('chart.section.self'), icon: '🪞' },
    { id: 'note', label: t('chart.section.note'), icon: '📜' },
    { id: 'love', label: t('chart.section.love'), icon: '💘' },
    { id: 'career', label: t('chart.section.career'), icon: '💼' },
    { id: 'health', label: t('chart.section.health'), icon: '🏥' },
    { id: 'fortune', label: t('chart.section.fortune'), icon: '🔮' }
  ]

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {showTransition && (
        <MysticalTransition
          onComplete={handleTransitionComplete}
          duration={1500}
        />
      )}
      <div className="text-center mb-10">
        <h1 className="section-title">{t('chart.pageTitle')}</h1>
        <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm">
          {t('chart.pageSubtitle')}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* Form */}
        <form onSubmit={handleCompute} className="glass-panel p-6 space-y-5 h-fit lg:sticky lg:top-6">
          {/* 性別 */}
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-300 mb-2">
              <UserRound className="h-4 w-4 text-saffron-400" />{t('form.gender')}
              <span className="text-xs text-slate-500 ml-auto">{t('form.gender.hint')}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { v: 'male', label: t('form.gender.male') },
                { v: 'female', label: t('form.gender.female') },
                { v: 'other', label: t('form.gender.other') }
              ].map((opt) => (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => update('gender', opt.v)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                    form.gender === opt.v
                      ? 'border-saffron-500 bg-saffron-500/10 text-saffron-400'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 日期 */}
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-300 mb-2">
              <Calendar className="h-4 w-4 text-saffron-400" />{t('form.date')}
            </label>
            <SmartDateInput
              required
              value={form.date}
              onChange={(v) => update('date', v)}
            />
          </div>

          {/* 時間 */}
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-300 mb-2">
              <Clock className="h-4 w-4 text-saffron-400" />{t('form.time')} {t('form.time.hint24h')}
            </label>
            <SmartTimeInput
              required={!form.unknownTime}
              disabled={form.unknownTime}
              lang={lang}
              value={form.time}
              onChange={(v) => update('time', v)}
            />
            <label className="mt-2 flex items-start gap-2 text-xs text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.unknownTime}
                onChange={(e) => {
                  const checked = e.target.checked
                  setForm((f) => ({
                    ...f,
                    unknownTime: checked,
                    time: checked ? '12:00' : f.time === '12:00' ? '' : f.time
                  }))
                }}
                className="mt-0.5 h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-saffron-500"
              />
              <span>
                不知道出生時間？<span className="text-saffron-400">勾這裡用日運模式</span> —
                仍可算太陽 / 月亮 / Nakshatra，但<strong className="text-slate-300">上升星座</strong>會是估算值（建議問父母後回來重算更準）。
              </span>
            </label>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              {t('form.time.helpText')}
            </p>
          </div>

          {/* 城市（含 autocomplete） */}
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-300 mb-2">
              <MapPin className="h-4 w-4 text-saffron-400" />{t('form.city')}
              <span className="text-xs text-slate-500 ml-auto">{t('form.city.hint')}</span>
            </label>
            <input
              type="text"
              list="city-list"
              placeholder="台北、Tokyo、New York…"
              className="input-field"
              value={form.city}
              onChange={(e) => handleCityChange(e.target.value)}
            />
            <datalist id="city-list">
              {cities.map((c) => (
                <option key={c.name} value={c.name}>{c.display}</option>
              ))}
            </datalist>
            {findCity(form.city) && (
              <div className="mt-1.5 text-[11px] text-emerald-400">
                ✓ {t('form.city.autoFilled')} {findCity(form.city).lat.toFixed(2)}°N / {findCity(form.city).lon.toFixed(2)}°E · UTC{form.tz >= 0 ? '+' : ''}{form.tz}
              </div>
            )}
            {!findCity(form.city) && form.city && (
              <div className="mt-1.5 text-[11px] text-slate-400">
                {t('form.city.notFound')}
              </div>
            )}
          </div>

          {/* 進階設定 */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-saffron-400 transition"
            >
              <Settings2 className="h-3.5 w-3.5" />
              {showAdvanced ? t('form.advanced.hide') : t('form.advanced.show')}
            </button>
            {showAdvanced && (
              <div className="mt-3 space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div>
                  <label className="text-xs text-slate-300 mb-1.5 block">{t('form.tz')} UTC±</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    className="input-field text-sm"
                    value={form.tz}
                    onChange={(e) => update('tz', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-300 mb-1.5 block">{t('form.lat')} °N</label>
                    <input type="number" step="0.001" required className="input-field text-sm" value={form.lat} onChange={(e) => update('lat', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 mb-1.5 block">{t('form.lon')} °E</label>
                    <input type="number" step="0.001" required className="input-field text-sm" value={form.lon} onChange={(e) => update('lon', e.target.value)} />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {t('form.advanced.tip')}
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-vermilion-500 bg-vermilion-500/10 border border-vermilion-500/30 rounded-lg p-3">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />{error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full">
            <Sparkles className="h-4 w-4" />
            {t('form.submit.chart')}
          </button>

          <p className="text-xs text-slate-500 leading-relaxed text-center">
            {t('form.privacy')}
          </p>
        </form>

        {/* Result */}
        <div className="space-y-6">
          {!chart ? (
            <WelcomePanel />
          ) : (
            <>
              {/* ⓪ Sticky Section Nav — 讓使用者快速在區塊間跳 */}
              <div className="sticky top-0 z-20 -mx-6 px-6 py-3 bg-cosmic-950/80 backdrop-blur-md border-b border-white/10">
                <div className="flex gap-2 overflow-x-auto scrollbar-none">
                  {sectionTabs.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => scrollToSection(s.id)}
                      className={`flex-shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                        activeTab === s.id
                          ? 'border-saffron-500 bg-saffron-500/15 text-saffron-400'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <span className="mr-1.5">{s.icon}</span>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ⚠️ 沒輸入出生時間 — 精度提示 + 回訪鉤子 */}
              {submittedUnknownTime && (
                <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-200 leading-relaxed">
                    <div className="font-medium text-amber-300 mb-1">你用的是日運模式（沒輸入出生時間）</div>
                    <p className="text-slate-300">
                      太陽 / 月亮 / Nakshatra / Dasha 依然精準 — 但<strong className="text-amber-200">上升星座</strong>跟<strong className="text-amber-200">宮位排列</strong>是估算值，影響個性外顯跟事業宮判讀。
                      <br />
                      👉 <span className="text-saffron-400">問到父母（或看出生證明）後，回到本頁重算一次，準度會跳一階。</span>
                    </p>
                  </div>
                </div>
              )}

              <div id="self" className="scroll-mt-28 -mt-6" />

              {/* ①-a 靈魂簽名（殼 × 芯）— 我是誰先於我有多特別 */}
              <div className="glass-panel p-6 md:p-10 bg-gradient-to-br from-saffron-500/10 to-vermilion-500/5 border-saffron-500/30 relative overflow-hidden">
                {/* 背景裝飾光暈 */}
                <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-saffron-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-vermilion-500/10 blur-3xl pointer-events-none" />

                <div className="relative">
                  <div className="text-sm text-saffron-400/80 font-serif italic mb-3">
                    你的靈魂簽名
                  </div>

                  {persona ? (
                    <>
                      <h2 className="font-serif text-4xl md:text-6xl gradient-text leading-tight">
                        {persona.primary}
                      </h2>
                      <p className="mt-4 text-base md:text-lg text-slate-200 leading-relaxed max-w-2xl">
                        {persona.detail}
                      </p>
                    </>
                  ) : (
                    <h2 className="font-serif text-3xl md:text-4xl gradient-text leading-tight">
                      {lagna?.tagline?.split('·')[0]?.trim()}
                    </h2>
                  )}

                  {keywords && keywords.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {keywords.map((k) => (
                        <span
                          key={k}
                          className="rounded-full border border-saffron-500/30 bg-saffron-500/10 px-3 py-1 text-xs font-medium"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between gap-3 flex-wrap pt-4 border-t border-white/10">
                    <div className="text-sm text-slate-400">
                      {submittedCity} · {submittedStamp}
                      <span
                        className="ml-1"
                        title="Ayanamsha = 吠陀與西方曆差距；用於把西方座標轉成吠陀座標"
                      >
                        · 吠陀座標差 {chart.ayanamsha.toFixed(2)}°
                      </span>
                    </div>
                    <CopyLinkButton />
                  </div>
                </div>
              </div>

              {/* ①-b 稀有度 — 在靈魂簽名之後揭曉「我有多特別」 */}
              {rarity && <RarityCard rarity={rarity} />}

              {/* ②-b 分享卡（IG / 朋友圈 / LINE）— 緊鄰在 Hero + 稀有度之下 */}
              <ShareCardSection
                filename={`我的吠陀命盤-${submittedStamp}.png`}
                title="下載你的命盤卡"
                shareTitle={
                  rarity
                    ? `我是 Top ${rarity.topPercent}% 的「${rarity.title}」`
                    : '我的吠陀命盤'
                }
                shareText={
                  rarity
                    ? `剛算完吠陀命盤，全人口只有 ${rarity.topPercent}% 長這樣 😳\n你也算一下看看是哪種？→ ${typeof window !== 'undefined' ? window.location.href : ''}`
                    : `剛算了自己的吠陀命盤 ✨\n你也來算看看 → ${typeof window !== 'undefined' ? window.location.href : ''}`
                }
              >
                <BirthChartShareCard
                  chart={chart}
                  persona={persona}
                  stamp={submittedStamp}
                  city={submittedCity}
                  rarity={rarity}
                  punchlines={cardPunchlines}
                  axisInsight={astrologerNote?.axisInsight?.axis}
                  shareUrl={typeof window !== 'undefined' ? window.location.href : ''}
                />
              </ShareCardSection>

              {/* 📜 完整占星師筆記 */}
              {astrologerNote && (
                <>
                  <div id="note" className="scroll-mt-28 -mt-6" />
                  <Section icon={<Sparkle className="h-4 w-4" />} badge="占星師手記" title="命盤跟你說的事" highlight>
                    <div className="max-w-3xl mx-auto">
                      <div className="relative rounded-2xl border border-saffron-500/20 bg-gradient-to-br from-saffron-500/[0.06] via-saffron-500/[0.02] to-white/[0.02] p-6 md:p-10">
                        {/* greeting */}
                        <p className="font-serif text-[15px] md:text-base text-slate-100 leading-[1.95] italic">
                          {astrologerNote.greeting}
                        </p>

                        {/* 軸心洞察 */}
                        {astrologerNote.axisInsight && (
                          <div className="mt-7 pl-5 border-l-2 border-saffron-500/60 bg-saffron-500/[0.03] py-4 pr-4 rounded-r-lg">
                            <p className="font-serif text-lg md:text-2xl text-saffron-200 leading-snug italic mb-4">
                              「{astrologerNote.axisInsight.axis}」
                            </p>
                            <p className="font-serif text-[15px] md:text-base text-slate-200 leading-[1.95]">
                              {astrologerNote.axisInsight.opener}
                            </p>
                          </div>
                        )}

                        {/* 9 段主題 */}
                        <div className="mt-8 space-y-7">
                          {astrologerNote.sections.map((s) => (
                            <div key={s.id}>
                              <div className="flex items-center gap-3 mb-3">
                                <span className="text-saffron-400/80 text-lg leading-none">✦</span>
                                <h4 className="font-serif text-lg md:text-xl text-saffron-200">{s.title}</h4>
                                <div className="flex-1 h-px bg-gradient-to-r from-saffron-500/20 to-transparent" />
                              </div>
                              <p className="font-serif text-[15px] md:text-base text-slate-100/95 leading-[1.95] pl-1">
                                {s.body}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* 結語 closing */}
                        {astrologerNote.closing && (
                          <div className="mt-10 pt-6 border-t border-saffron-500/20">
                            <div className="text-sm text-saffron-400/80 font-serif italic mb-3">── 最後一段</div>
                            <p className="font-serif text-[15px] md:text-base text-slate-100 leading-[1.95]">
                              {astrologerNote.closing}
                            </p>
                          </div>
                        )}

                        {/* 署名 */}
                        <div className="mt-8 text-right text-sm text-slate-400/80 font-serif italic">
                          — 2026 年 4 月，寫給你
                        </div>
                      </div>
                    </div>
                  </Section>
                </>
              )}

              {/* 💘 愛情章 */}
              <div id="love" className="scroll-mt-28 -mt-6" />
              {moon && (
                <Section icon={<Heart className="h-4 w-4" />} badge="愛情" title={`你的愛情模式：${moon.theme}`} highlight>
                  <div className="max-w-3xl mx-auto space-y-5 font-serif text-[15px] md:text-base text-slate-100 leading-[1.95]">
                    {noteBody('intimacy') && <p>{noteBody('intimacy')}</p>}
                    {noteBody('family') && <p>{noteBody('family')}</p>}
                    {moon.marriageTiming && (
                      <p>
                        {moon.marriageTiming}
                        {match && match.best?.length > 0 && (
                          <>
                            {' '}你最容易跟<span className="text-saffron-300">{match.best.slice(0, 3).join('、')}</span>的人來電，碰上<span className="text-vermilion-400">{match.avoid?.slice(0, 3).join('、')}</span>會有根本矛盾 — 不是誰的錯，是氣場節奏不同步。
                          </>
                        )}
                      </p>
                    )}
                    {/* 結尾：命盤依據 */}
                    <div className="pt-4 mt-4 border-t border-saffron-500/20">
                      <div className="text-sm text-saffron-400/80 font-serif italic mb-2">為什麼我知道你是這樣？</div>
                      <p className="text-xs text-slate-400 leading-relaxed italic">
                        月亮落在 {astrologerNote?.meta?.moonRashi || tropMoonName}
                        {chart?.sidereal?.moon?.nakshatra?.name && ` · ${chart.sidereal.moon.nakshatra.name}`}
                        {' '}— 所以你愛起人來是這個節奏
                        {astrologerNote?.meta?.venusRashi && (
                          <> · 金星落在 {astrologerNote.meta.venusRashi} — 所以你對美感／親密感的敏感方式固定走這條線</>
                        )}
                        {match?.best?.[0] && <> · 合盤上最合 {match.best[0]}，是因為互補你這套節奏</>}
                      </p>
                    </div>
                  </div>
                </Section>
              )}

              {/* 💼 事業章 */}
              <div id="career" className="scroll-mt-28 -mt-6" />
              {vedicCareer && (
                <Section icon={<Briefcase className="h-4 w-4" />} badge="事業" title="你的事業命格" highlight>
                  <div className="max-w-3xl mx-auto space-y-5 font-serif text-[15px] md:text-base text-slate-100 leading-[1.95]">
                    {vedicCareer.narrative && vedicCareer.narrative.split('\n\n').map((para, i) => (
                      <p key={`narr-${i}`}>{para}</p>
                    ))}

                    {/* Sub-Category（商業 / 政治圈細分型）— 只在 confidence=high 時顯示 */}
                    {vedicCareer.playbook?.subCategory && (
                      <div className="space-y-3">
                        <div className="text-sm text-saffron-400/80 font-serif italic">
                          你在商業／政治圈裡的細分型 —
                        </div>
                        <p>
                          <span className="text-saffron-300 font-medium">{vedicCareer.playbook.subCategory.label}</span>
                          ：{vedicCareer.playbook.subCategory.tagline}。
                        </p>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {vedicCareer.playbook.subCategory.sweetSpot}。避開：{vedicCareer.playbook.subCategory.avoid}。
                        </p>
                        {vedicCareer.playbook.subCategory.timingAdvice && (
                          <p className="text-sm text-saffron-200/90 italic leading-relaxed">
                            {vedicCareer.playbook.subCategory.timingAdvice}
                          </p>
                        )}
                      </div>
                    )}

                    {noteBody('money') && <p>{noteBody('money')}</p>}
                    {vedicCareer.activeCareerYogas?.find((y) => y.strength === 'strong') && (
                      <p>
                        另外你這張盤其實藏了一個格局 ——「{vedicCareer.activeCareerYogas.find((y) => y.strength === 'strong').verdict}」。
                        {vedicCareer.activeCareerYogas.find((y) => y.strength === 'strong').careerImplication}
                      </p>
                    )}

                    {/* Playbook — 那現在實際該怎麼找工作？ */}
                    {vedicCareer.playbook && (
                      <div className="pt-6 mt-4 border-t border-saffron-500/25 space-y-6 not-italic">
                        <h4 className="font-serif text-xl md:text-2xl text-saffron-200">
                          那，現在實際該怎麼走？
                        </h4>

                        {/* 身份 */}
                        {vedicCareer.playbook.identity && (
                          <div>
                            <div className="text-sm text-saffron-400/80 font-serif italic mb-2">
                              你在職場裡是哪種人
                            </div>
                            <p className="text-base md:text-lg text-slate-100 leading-snug">
                              <span className="font-serif text-saffron-300">
                                {vedicCareer.playbook.identity.label}
                              </span>
                              {vedicCareer.playbook.identity.houseContext && (
                                <span className="text-slate-300">
                                  {' '}·{' '}{vedicCareer.playbook.identity.houseContext}
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                              {vedicCareer.playbook.identity.why}
                            </p>
                          </div>
                        )}

                        {/* 工作能量特徵（不再是職業列表） */}
                        {vedicCareer.playbook.energyPattern && (
                          <div>
                            <div className="text-sm text-saffron-400/80 font-serif italic mb-2">
                              你工作時需要的能量
                            </div>
                            <p className="text-base text-slate-100 leading-relaxed">
                              {vedicCareer.playbook.energyPattern}
                            </p>
                            {vedicCareer.playbook.sweetSpot && (
                              <p className="text-sm text-saffron-200/90 mt-2 leading-relaxed">
                                甜蜜點：{vedicCareer.playbook.sweetSpot}
                              </p>
                            )}
                            {vedicCareer.playbook.modernExamples?.length > 0 && (
                              <div className="mt-3">
                                <div className="text-xs text-slate-400 mb-1.5">現代工作舉例（能量對得上就算）：</div>
                                <p className="text-sm text-slate-200 leading-relaxed">
                                  {vedicCareer.playbook.modernExamples.join('、')}
                                </p>
                              </div>
                            )}
                            {vedicCareer.playbook.karakaHint && (
                              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                                {vedicCareer.playbook.karakaHint}
                              </p>
                            )}
                            <p className="text-xs text-slate-500 italic mt-3 leading-relaxed">
                              ※ 古典用「建築師／藝術家」這些詞，不是字面要你蓋房子或畫畫 — 而是在描述你工作時需要的「能量」。讀到某個職稱沒共鳴很正常，重點是能量匹配。
                            </p>
                          </div>
                        )}

                        {/* 避開 */}
                        {vedicCareer.playbook.avoid && (
                          <div>
                            <div className="text-sm text-amber-400/90 font-serif italic mb-2">
                              ⚠️ 千萬別進這種環境
                            </div>
                            <p className="text-base text-slate-100 leading-relaxed">
                              {vedicCareer.playbook.avoid}
                            </p>
                          </div>
                        )}

                        {/* 當前大運時機 */}
                        {vedicCareer.playbook.dashaSignal && (
                          <div>
                            <div className="text-sm text-saffron-400/80 font-serif italic mb-2">
                              現在這段時期的時機信號
                            </div>
                            <p className="text-base text-slate-100 leading-relaxed">
                              你正在走 <span className="text-saffron-300 font-medium">{vedicCareer.playbook.dashaSignal.lord}</span> 大運 ·{' '}
                              <span className="text-saffron-300">{vedicCareer.playbook.dashaSignal.phase}</span>
                              {vedicCareer.playbook.dashaSignal.isKarmesh && (
                                <span className="text-emerald-400">（10 宮主大運 = 事業最強時刻）</span>
                              )}
                              <br />
                              <span className="text-slate-300">— {vedicCareer.playbook.dashaSignal.signal}</span>
                            </p>
                          </div>
                        )}

                        {/* 下一步具體 action */}
                        {vedicCareer.playbook.actions?.length > 0 && (
                          <div>
                            <div className="text-sm text-saffron-400/80 font-serif italic mb-3">
                              接下來具體該做的 {vedicCareer.playbook.actions.length} 件事
                            </div>
                            <ol className="space-y-3">
                              {vedicCareer.playbook.actions.map((a, i) => (
                                <li key={i} className="flex gap-3 items-start">
                                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-saffron-500/20 border border-saffron-500/40 text-saffron-300 text-xs flex items-center justify-center font-medium mt-0.5">
                                    {i + 1}
                                  </span>
                                  <span className="text-base text-slate-100 leading-relaxed flex-1">
                                    {a}
                                  </span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 結尾：命盤依據 */}
                    <div className="pt-4 mt-4 border-t border-saffron-500/20">
                      <div className="text-sm text-saffron-400/80 font-serif italic mb-2">為什麼我知道你是這樣？</div>
                      <p className="text-xs text-slate-400 leading-relaxed italic">
                        {vedicCareer.karmesh?.planet && vedicCareer.karmesh?.house && (
                          <>10 宮主 {zhPlanet(vedicCareer.karmesh.planet)} 落第 {vedicCareer.karmesh.house} 宮 — 所以事業的核心會朝這個方向開展</>
                        )}
                        {vedicCareer.lagnaLord?.planet && vedicCareer.lagnaLord?.house && !vedicCareer.lagnaLord?.isSameAsKarmesh && (
                          <> · 命主星 {zhPlanet(vedicCareer.lagnaLord.planet)} 落第 {vedicCareer.lagnaLord.house} 宮 — 你「想做」的方向由此決定</>
                        )}
                        {currentDasha && (
                          <> · 當前走 {zhPlanet(currentDasha.lord)} 大運{currentAD && ` / ${zhPlanet(currentAD.lord)} 小運`} — 這個主題現在正被放大</>
                        )}
                        {vedicCareer.playbook?.subCategory?.reasoning?.length > 0 && (
                          <> · 偵測到「{vedicCareer.playbook.subCategory.label}」— 依據：{vedicCareer.playbook.subCategory.reasoning.slice(0, 2).join('、')}</>
                        )}
                      </p>
                    </div>
                  </div>
                </Section>
              )}

              {/* 🏥 健康章 */}
              <div id="health" className="scroll-mt-28 -mt-6" />
              <Section icon={<ShieldCheck className="h-4 w-4" />} badge="健康" title="你的身體與精神的使用說明">
                <div className="max-w-3xl mx-auto space-y-5 font-serif text-[15px] md:text-base text-slate-100 leading-[1.95]">
                  {noteBody('bodyWarning') && <p>{noteBody('bodyWarning')}</p>}
                  {currentDashaReading?.health && (
                    <p>
                      而你這陣子（{currentDashaReading.name}．{currentDashaReading.nickname}）要特別留意 ——{currentDashaReading.health}
                    </p>
                  )}
                  {noteBody('authorization') && <p>{noteBody('authorization')}</p>}
                  {noteBody('contrarian') && <p>{noteBody('contrarian')}</p>}
                  {remedy && (
                    <p className="text-slate-200/90">
                      傳統給你守護星（{remedy.ruler}）這型人的建議是：專注<span className="text-saffron-300">{remedy.focus}</span>，身上可配<span className="text-saffron-300">{remedy.gem}</span>。不迷信，但心理暗示有時候是最便宜的續命方式。
                    </p>
                  )}
                  {/* 結尾：命盤依據 */}
                  <div className="pt-4 mt-4 border-t border-saffron-500/20">
                    <div className="text-sm text-saffron-400/80 font-serif italic mb-2">為什麼我知道你是這樣？</div>
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                      {astrologerNote?.meta?.marsRashi && (
                        <>火星落在 {astrologerNote.meta.marsRashi} — 所以身體「發火」的點固定落在這條線</>
                      )}
                      {astrologerNote?.meta?.saturnRashi && (
                        <> · 土星落在 {astrologerNote.meta.saturnRashi} — 所以你長期的結構性壓力會從這個地方累積</>
                      )}
                      {remedy?.ruler && <> · 守護星 {zhPlanet(remedy.ruler)} — 這是你身體＆精神最該優先「餵飽」的那顆星</>}
                    </p>
                  </div>
                </div>
              </Section>

              {/* 🔮 運勢章 */}
              <div id="fortune" className="scroll-mt-28 -mt-6" />
              {currentDasha && currentDashaReading && (
                <Section icon={<Clock4 className="h-4 w-4" />} badge="運勢" title={`你現在正走：${currentDashaReading.name}（${currentDashaReading.nickname}）`}>
                  <div className="max-w-3xl mx-auto space-y-5 font-serif text-[15px] md:text-base text-slate-100 leading-[1.95]">
                    <p>
                      你今年大約<span className="text-saffron-300">{ageOf(now).toFixed(0)} 歲</span>，正在走<span className="text-saffron-300">{currentDashaReading.name}</span>這段大運 —— 也就是「{currentDashaReading.nickname}」的年代。{currentDashaReading.vibe} 這段還會持續<span className="text-saffron-300">約 {currentDasha.yearsRemaining.toFixed(1)} 年</span>，所以別急著下結論你自己「就是這樣」—— 是這段時期把你磨成這樣，下一段又會再翻一頁。
                    </p>
                    {currentAD && currentADReading && (
                      <p>
                        更近距離看，你正在走{currentDashaReading.nickname}裡的<span className="text-saffron-300">{currentADReading.nickname}</span>子階段（{currentDasha.lord} / {currentAD.lord}）
                        ，這個小運還剩<span className="text-saffron-300">約 {(currentAD.yearsRemaining * 12).toFixed(0)} 個月</span>。
                        {currentAD.lord === currentDasha.lord ? '同主題深化、加倍出現。' : `${currentADReading.theme.split('·')[0]}的議題會在${currentDashaReading.theme.split('·')[0]}的大框架下浮現 —— 這就是最近身邊那些事的底層原因。`}
                      </p>
                    )}
                    {noteBody('lifeCourse') && <p>{noteBody('lifeCourse')}</p>}
                    {futurePeriods[0] && (() => {
                      const next = futurePeriods[0]
                      const nextReading = dashaReadings[next.lord]
                      const nextAge = Math.max(0, ageOf(next.start))
                      if (!nextReading) return null
                      return (
                        <p>
                          下一個翻頁時刻大概在<span className="text-saffron-300">{nextAge.toFixed(0)} 歲（{next.start.getFullYear()} 年）</span>，
                          你會走到<span className="text-saffron-300">{nextReading.name}（{nextReading.nickname}）</span>大運 —— 屆時你關心的東西、生活的重心會整個換一套：{nextReading.vibe}
                        </p>
                      )
                    })()}
                    {/* 結尾：命盤依據 */}
                    <div className="pt-4 mt-4 border-t border-saffron-500/20">
                      <div className="text-sm text-saffron-400/80 font-serif italic mb-2">為什麼我知道你是這樣？</div>
                      <p className="text-xs text-slate-400 leading-relaxed italic">
                        當前大運 {zhPlanet(currentDasha.lord)}{currentAD && ` / 小運 ${zhPlanet(currentAD.lord)}`} — 所以現在的劇本由這組行星在寫
                        {astrologerNote?.meta?.rahuHouse && (
                          <> · 北交點落第 {astrologerNote.meta.rahuHouse} 宮 — 所以你今生的「想要更多」會被導向這個領域</>
                        )}
                        {chart?.sidereal?.moon?.nakshatra?.name && (
                          <> · 月宿 {chart.sidereal.moon.nakshatra.name} — 時間感與節奏感的底色</>
                        )}
                      </p>
                    </div>
                  </div>
                </Section>
              )}

              {/* 結語 push — 最後推你一下 */}
              {astrologerNote?.closing && (
                <div className="max-w-3xl mx-auto pt-6 pb-4 font-serif text-[15px] md:text-lg text-slate-100 leading-[1.95] md:leading-loose italic border-t border-saffron-500/20">
                  <p className="pt-6">{astrologerNote.closing}</p>

                  {/* 分享 CTA */}
                  <div className="mt-10 not-italic flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      type="button"
                      onClick={async () => {
                        const ok = await copyToClipboard(
                          typeof window !== 'undefined' ? window.location.href : ''
                        )
                        if (ok) {
                          trackEvent('closing_copy_link', { rarity: rarity?.topPercent })
                          setClosingCopied(true)
                          setTimeout(() => setClosingCopied(false), 2500)
                        }
                      }}
                      className="btn-primary min-w-[220px]"
                      disabled={closingCopied}
                    >
                      {closingCopied ? (
                        <>
                          <Check className="h-4 w-4" />
                          已複製連結
                        </>
                      ) : (
                        '複製連結，傳給 3 個好朋友'
                      )}
                    </button>
                    <a href="/compatibility" className="btn-ghost">
                      👉 或問 TA 生辰，算你們合盤
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// UI Subcomponents
// ─────────────────────────────────────────────────────────────

function WelcomePanel() {
  return (
    <div className="glass-panel p-8 md:p-12 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-saffron-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs text-saffron-400/80 mb-4">
          <Sparkles className="h-4 w-4" />
          <span className="font-serif italic">占星師的話</span>
        </div>

        <p className="font-serif text-xl md:text-3xl text-slate-100 leading-relaxed">
          填好左邊，你會看到一個沒人跟你講過的、關於你自己的故事。
        </p>

        <p className="mt-5 text-slate-400 text-base leading-relaxed">
          包括你朋友從來沒注意、但你自己心裡一直懷疑的那些事。
        </p>

        <p className="mt-8 text-xs text-slate-500">
          30 秒 · 免註冊 · 算完可以分享給朋友逼 TA 也算
        </p>
      </div>
    </div>
  )
}

function Section({ icon, badge, title, children, highlight }) {
  return (
    <div className={`glass-panel p-6 ${highlight ? 'border-saffron-500/40 bg-saffron-500/5' : ''}`}>
      <div className="flex items-center gap-2 text-sm text-saffron-400/80 font-serif italic mb-2">
        {icon}{badge}
      </div>
      <h3 className="font-serif text-2xl gradient-text mb-4">{title}</h3>
      {children}
    </div>
  )
}

function RarityCard({ rarity }) {
  if (!rarity) return null
  const comparison = buildRarityComparison(rarity.topPercent)
  // 依 plain 標題去重取 top 4
  const uniqueFeatures = []
  const seen = new Set()
  for (const f of rarity.features || []) {
    const key = f.plain || f.name
    if (seen.has(key)) continue
    seen.add(key)
    uniqueFeatures.push(f)
    if (uniqueFeatures.length >= 4) break
  }

  return (
    <div className="glass-panel p-6 md:p-8 bg-gradient-to-br from-vermilion-500/10 via-saffron-500/10 to-amber-500/5 border-saffron-500/40 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-saffron-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-vermilion-500/10 blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2 text-sm text-saffron-400/80 font-serif italic mb-3">
          <Sparkles className="h-4 w-4" />
          命盤稀有度指數
        </div>

        <div className="grid md:grid-cols-[auto_1fr] gap-6 items-center">
          {/* 左：大圓分數 + 星星 */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <svg width="140" height="140" className="transform -rotate-90">
                <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  fill="none"
                  stroke="url(#rarity-gradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(rarity.score / 100) * 377} 377`}
                />
                <defs>
                  <linearGradient id="rarity-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffc266" />
                    <stop offset="100%" stopColor="#e34234" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-serif text-5xl gradient-text leading-none">{rarity.score}</div>
                <div className="text-xs text-slate-400 mt-1">/ 100</div>
              </div>
            </div>
            <div className="mt-3 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-lg ${i < rarity.stars ? 'text-saffron-400' : 'text-white/15'}`}>★</span>
              ))}
            </div>
          </div>

          {/* 右：tier 標題 + Top X% + 比喻 + 特徵 */}
          <div className="flex-1">
            <h3 className="font-serif text-3xl md:text-4xl gradient-text">{rarity.title}</h3>
            <div className="mt-1 text-lg text-saffron-400">
              位於全人口 <strong className="font-serif text-2xl">Top {rarity.topPercent}%</strong>
            </div>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">{rarity.note}。</p>

            {/* 人口比較 */}
            <div className="mt-3 rounded-xl border border-saffron-500/20 bg-saffron-500/5 p-3">
              <div className="text-sm text-saffron-400/80 font-serif italic mb-1.5">
                放在世界人口裡比比看
              </div>
              <div className="text-sm text-slate-200 leading-relaxed">{comparison}</div>
            </div>

            {/* 關鍵配置（去重取 top 4，不再用花俏的分級邊框） */}
            {uniqueFeatures.length > 0 && (
              <div className="mt-4">
                <div className="text-sm text-saffron-400/80 font-serif italic mb-2">
                  讓你與眾不同的 {uniqueFeatures.length} 個關鍵配置
                </div>
                <div className="space-y-2">
                  {uniqueFeatures.map((f, i) => (
                    <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-100">
                            {f.plain || f.name}
                          </div>
                          {f.technical && (
                            <div className="text-[11px] text-slate-500 mt-0.5">{f.technical}</div>
                          )}
                        </div>
                        {f.freq && (
                          <span className="flex-shrink-0 text-[10px] tabular-nums rounded-full px-2 py-0.5 border border-saffron-500/30 text-saffron-300">
                            人口 {f.freq}
                          </span>
                        )}
                      </div>
                      {f.meaning && (
                        <p className="mt-2 text-xs text-slate-300 leading-relaxed">{f.meaning}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-500 italic leading-relaxed mt-6 pt-5 border-t border-white/5">
          ※ 稀有度 ≠「命好 / 命不好」。這是掃了你盤上 23 種古典吠陀配置（五大偉人瑜伽、財富瑜伽、逆轉型瑜伽、雙光合宿等）依人口頻率算的。低分是「均衡型」— 日子反而平穩。
        </p>
      </div>
    </div>
  )
}

// 依據 topPercent 挑合適的人口對比（全部是真實全球統計）
function buildRarityComparison(topPercent) {
  // 真實參考：
  //   雙胞胎 ~1.2% · 紅髮 ~2% · 綠眼 ~2% · O 型陰性血 ~6.6% ·
  //   AB 型血 ~4% · 左撇子 ~10% · 藍眼 ~8-10%
  if (topPercent <= 0.5) {
    return '你比「雙胞胎出生者」（約 1.2%）還稀有。在 1000 個人裡，大概只有 3-5 個人的命盤配置跟你類似。'
  }
  if (topPercent <= 2) {
    return `你的命盤稀有度跟「紅髮」（全球約 2%）、「綠眼睛」（約 2%）同級。100 個朋友裡，大概只有 1-2 個人會有類似配置。`
  }
  if (topPercent <= 5) {
    return '你的稀有度大致跟「AB 型血」（全球約 4%）同等級。20 個人裡會有 1 個人跟你配置相近。'
  }
  if (topPercent <= 10) {
    return '你的稀有度接近「左撇子」（約 10% 全球人口）。10 個人裡會有 1 個人配置類似 — 不是罕見，但也明顯有特色。'
  }
  if (topPercent <= 20) {
    return '你的配置較有特色但非極罕見。每 5 個人裡大概有 1 個類似 — 像是「藍眼睛 + 某個血型」這種程度的組合。'
  }
  return '你的命盤屬於均衡型。這不代表平庸 — 反而是少了極端配置所以「日子比較穩」的類型。'
}


function CopyLinkButton() {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    const ok = await copyToClipboard(window.location.href)
    if (ok) {
      setCopied(true)
      trackEvent('copy_permalink', { page: 'birth_chart' })
      setTimeout(() => setCopied(false), 2000)
    }
  }
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-saffron-500/30 bg-saffron-500/10 px-3 py-1.5 text-xs font-medium text-saffron-400 hover:bg-saffron-500/20 transition"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          已複製
        </>
      ) : (
        <>
          <Link2 className="h-3.5 w-3.5" />
          複製分享連結
        </>
      )}
    </button>
  )
}

