import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Globe,
  AlertCircle,
  Sun,
  Moon,
  ArrowUpRight,
  Gem,
  Flame,
  Mountain,
  Wind,
  Droplets,
  Heart,
  Briefcase,
  Users,
  TrendingUp,
  Star,
  Sparkle,
  ShieldCheck,
  ShieldAlert,
  Clock4,
  History,
  CircleDot,
  Telescope,
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
import SmartDateInput from '../components/SmartDateInput.jsx'
import SmartTimeInput from '../components/SmartTimeInput.jsx'
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
  gender: ''
}

const elementIcon = { fire: Flame, earth: Mountain, air: Wind, water: Droplets }

const sectionTabs = [
  { id: 'self', label: '自我', icon: '🪞' },
  { id: 'love', label: '愛情', icon: '💘' },
  { id: 'career', label: '事業', icon: '💼' },
  { id: 'dasha', label: '運勢', icon: '📅' },
  { id: 'energy', label: '開運', icon: '🍀' }
]

export default function BirthChart() {
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
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('self')

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
      setError('請填寫出生日期與時間')
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
        gender: form.gender
      })
      setShowTransition(true)
      // 把生辰編進 URL（永久連結）
      replaceUrlParam('d', encodeBirthPayload(form))
      trackEvent('compute_birth_chart', {
        has_gender: !!form.gender,
        has_city: !!findCity(form.city)
      })
    } catch (err) {
      setError('計算失敗：請檢查輸入格式。')
      console.error(err)
    }
  }

  const handleTransitionComplete = () => {
    setChart(pendingChart)
    setSubmittedCity(pendingMeta.city)
    setSubmittedStamp(pendingMeta.stamp)
    setSubmittedGender(pendingMeta.gender)
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

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {showTransition && (
        <MysticalTransition
          onComplete={handleTransitionComplete}
          duration={1500}
        />
      )}
      <div className="text-center mb-10">
        <h1 className="section-title">吠陀命盤 · 超接地氣解讀</h1>
        <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm">
          輸入生辰，看看你這輩子的愛情、事業、財運、大運走向 — 以及你朋友都不好意思告訴你的那些事
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* Form */}
        <form onSubmit={handleCompute} className="glass-panel p-6 space-y-5 h-fit lg:sticky lg:top-6">
          {/* 性別 */}
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-300 mb-2">
              <UserRound className="h-4 w-4 text-saffron-400" />性別
              <span className="text-xs text-slate-500 ml-auto">影響伴侶解讀用語</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { v: 'male', label: '男' },
                { v: 'female', label: '女' },
                { v: 'other', label: '不選' }
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
              <Calendar className="h-4 w-4 text-saffron-400" />出生日期
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
              <Clock className="h-4 w-4 text-saffron-400" />出生時間（24 小時制）
            </label>
            <SmartTimeInput
              required
              value={form.time}
              onChange={(v) => update('time', v)}
            />
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              吠陀占星上升星座每 2 小時換一次，時間越精確越好
            </p>
          </div>

          {/* 城市（含 autocomplete） */}
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-300 mb-2">
              <MapPin className="h-4 w-4 text-saffron-400" />出生城市
              <span className="text-xs text-slate-500 ml-auto">選擇後自動填入座標</span>
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
                ✓ 已自動填入 {findCity(form.city).lat.toFixed(2)}°N / {findCity(form.city).lon.toFixed(2)}°E · UTC{form.tz >= 0 ? '+' : ''}{form.tz}
              </div>
            )}
            {!findCity(form.city) && form.city && (
              <div className="mt-1.5 text-[11px] text-slate-400">
                城市不在清單中 · 請在「進階設定」手動填入座標
              </div>
            )}
          </div>

          {/* 進階設定（預設隱藏） */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-saffron-400 transition"
            >
              <Settings2 className="h-3.5 w-3.5" />
              {showAdvanced ? '隱藏' : '顯示'}進階設定（時區與經緯度微調）
            </button>
            {showAdvanced && (
              <div className="mt-3 space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div>
                  <label className="text-xs text-slate-300 mb-1.5 block">時區 UTC±（台灣 +8）</label>
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
                    <label className="text-xs text-slate-300 mb-1.5 block">緯度 °N</label>
                    <input type="number" step="0.001" required className="input-field text-sm" value={form.lat} onChange={(e) => update('lat', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 mb-1.5 block">經度 °E</label>
                    <input type="number" step="0.001" required className="input-field text-sm" value={form.lon} onChange={(e) => update('lon', e.target.value)} />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  小貼士：南半球城市請用負值緯度、西半球請用負值經度。夏令時出生請手動把時區 -1。
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
            算我的命盤 & 解讀
          </button>

          <p className="text-xs text-slate-500 leading-relaxed text-center">
            請放心輸入，不收集任何個資
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

              {/* ① Summary Hero — 西方主顯 + 吠陀副顯 */}
              <div id="self" className="glass-panel p-6 md:p-8 bg-gradient-to-br from-saffron-500/10 to-vermilion-500/5 border-saffron-500/30 scroll-mt-20">
                <div className="text-xs uppercase tracking-widest text-saffron-400 mb-2">你的命盤關鍵字</div>
                <h2 className="font-serif text-3xl md:text-4xl gradient-text leading-tight">
                  {lagna?.tagline?.split('·')[0]?.trim()}
                </h2>
                <div className="flex flex-wrap gap-2 mt-4">
                  {keywords?.map((k) => (
                    <span key={k} className="rounded-full border border-saffron-500/30 bg-saffron-500/10 px-3 py-1 text-xs font-medium">
                      {k}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
                  <div className="text-sm text-slate-400">
                    {submittedCity} · {submittedStamp} · Lahiri Ayanamsha {chart.ayanamsha.toFixed(2)}°
                  </div>
                  <CopyLinkButton />
                </div>
              </div>

              {/* ①-c 稀有度指數 */}
              {rarity && <RarityCard rarity={rarity} />}

              {/* ① -b 雙系統對照說明 */}
              <div className="glass-panel p-5 bg-white/[0.02] border-white/10">
                <div className="text-xs uppercase tracking-widest text-slate-400 mb-3">Tropical（西方）vs Sidereal（吠陀）· 兩套系統並列</div>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3">
                    <div className="text-sky-400 font-medium mb-2">🌐 西方 Tropical（主要，用於性格）</div>
                    <div className="space-y-1 text-slate-200">
                      <div>⬆️ 上升：<span className="text-sky-300">{chart.tropical.ascendant.rashi.chinese} {chart.tropical.ascendant.rashi.symbol}</span> · {formatDegrees(chart.tropical.ascendant.degreeInSign)}</div>
                      <div>🌞 太陽：<span className="text-sky-300">{chart.tropical.sun.rashi.chinese} {chart.tropical.sun.rashi.symbol}</span> · {formatDegrees(chart.tropical.sun.degreeInSign)}</div>
                      <div>🌙 月亮：<span className="text-sky-300">{chart.tropical.moon.rashi.chinese} {chart.tropical.moon.rashi.symbol}</span> · {formatDegrees(chart.tropical.moon.degreeInSign)}</div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-saffron-500/20 bg-saffron-500/5 p-3">
                    <div className="text-saffron-400 font-medium mb-2">🕉️ 吠陀 Sidereal（用於運勢預測）</div>
                    <div className="space-y-1 text-slate-200">
                      <div>⬆️ Lagna：<span className="text-saffron-300">{chart.sidereal.ascendant.rashi.chinese} {chart.sidereal.ascendant.rashi.symbol}</span> · {formatDegrees(chart.sidereal.ascendant.degreeInSign)}</div>
                      <div>🌞 Surya：<span className="text-saffron-300">{chart.sidereal.sun.rashi.chinese} {chart.sidereal.sun.rashi.symbol}</span> · {formatDegrees(chart.sidereal.sun.degreeInSign)}</div>
                      <div>🌙 Chandra：<span className="text-saffron-300">{chart.sidereal.moon.rashi.chinese} {chart.sidereal.moon.rashi.symbol}</span> · {formatDegrees(chart.sidereal.moon.degreeInSign)} · {chart.sidereal.moon.nakshatra.name} Pada {chart.sidereal.moon.nakshatra.pada}</div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                  💡 兩套系統差 ~{chart.ayanamsha.toFixed(1)}°（歲差 Ayanamsha）。本站把你<strong className="text-sky-400">熟悉的西方星座</strong>用於性格解讀（「準不準」的基礎），把吠陀獨有的<strong className="text-saffron-400"> Nakshatra 月宿 + Vimshottari 大運</strong>用於人生運勢預測 — 兩者互補，這是現代吠陀大師 Raman 派的整合路線。
                </p>
              </div>

              {/* ② Chart + Badges（西方星座為主） */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-panel p-6">
                  <ChartWheel chart={chart} />
                </div>
                <div className="space-y-4">
                  <PlanetBadge icon={<ArrowUpRight className="h-5 w-5" />} label="上升 Rising" rashi={chart.tropical.ascendant.rashi} degree={chart.tropical.ascendant.degreeInSign} sideLabel={`吠陀 ${chart.sidereal.ascendant.rashi.chinese}`} />
                  <PlanetBadge icon={<Sun className="h-5 w-5" />} label="太陽 Sun" rashi={chart.tropical.sun.rashi} degree={chart.tropical.sun.degreeInSign} sideLabel={`吠陀 ${chart.sidereal.sun.rashi.chinese}`} />
                  <PlanetBadge icon={<Moon className="h-5 w-5" />} label="月亮 Moon" rashi={chart.tropical.moon.rashi} degree={chart.tropical.moon.degreeInSign} nakshatra={chart.sidereal.moon.nakshatra} sideLabel={`吠陀 ${chart.sidereal.moon.rashi.chinese}`} highlight />
                </div>
              </div>

              {/* ②-a 命盤金句（必殺句型呈現 · 最毒戳點） */}
              {signatures.length > 0 && (
                <Section
                  icon={<Sparkle className="h-4 w-4" />}
                  badge="命盤金句 · 這些話朋友不敢跟你說"
                  title="關於你的 5 個戳點"
                >
                  <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                    根據你的上升、太陽、月亮、月宿組合產生的「命中句」。讀完覺得有被戳到的，就是你命盤寫好的個性模式。
                  </p>
                  <div className="space-y-3">
                    {signatures.map((s, i) => (
                      <div
                        key={i}
                        className="relative rounded-xl border border-saffron-500/20 bg-gradient-to-r from-saffron-500/5 to-transparent p-4 md:p-5"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {['🪞', '🔁', '⏳', '🎭', '🩹'][i] || '✦'}
                          </div>
                          <div className="flex-1">
                            <div className="text-[11px] uppercase tracking-widest text-saffron-400 mb-1 font-medium">
                              {s.type}
                            </div>
                            <p className="text-base text-slate-100 leading-relaxed font-serif">
                              {s.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                    💡 這 5 句話如果命中 3 句以上 — 你的 Lagna × Moon × Sun × Nakshatra 組合就是這樣運作的。下載下方命盤卡，這些句子會進到分享圖裡。
                  </p>
                </Section>
              )}

              {/* ②-b 分享卡（IG / 朋友圈 / LINE） */}
              <ShareCardSection
                filename={`我的吠陀命盤-${submittedStamp}.png`}
                title="下載你的命盤卡"
              >
                <BirthChartShareCard
                  chart={chart}
                  keywords={keywords}
                  stamp={submittedStamp}
                  city={submittedCity}
                  rarity={rarity}
                  signatures={signatures}
                />
              </ShareCardSection>

              {/* ③ 個性優缺點 — 最快「准不准」的判斷 */}
              {personality && (
                <Section
                  icon={<Sparkle className="h-4 w-4" />}
                  badge="個性優缺點 · 最快 10 秒測準度"
                  title="來看看你中了幾條 👀"
                  highlight
                >
                  <p className="text-sm text-slate-400 mb-4">
                    這些是把你 <span className="text-saffron-400">上升 + 太陽 + 月亮</span> 三個核心星位加總之後的綜合個性。看看朋友是不是就是這樣形容你的？
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">👍</span>
                        <div className="text-sm font-medium text-emerald-400">朋友會私下誇你的點</div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {personality.strengths.map((s) => (
                          <span key={s} className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs text-slate-100">
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 text-xs text-slate-400 pt-3 border-t border-white/5">
                        共 {personality.strengths.length} 個優點特徵 · 中越多越準
                      </div>
                    </div>

                    <div className="rounded-2xl border border-vermilion-500/30 bg-vermilion-500/5 p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">😅</span>
                        <div className="text-sm font-medium text-vermilion-500">朋友私下吐槽你的點</div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {personality.weaknesses.map((w) => (
                          <span key={w} className="rounded-full bg-vermilion-500/10 border border-vermilion-500/30 px-3 py-1 text-xs text-slate-100">
                            {w}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 text-xs text-slate-400 pt-3 border-t border-white/5">
                        共 {personality.weaknesses.length} 個地雷 · 中越多越該修
                      </div>
                    </div>
                  </div>
                </Section>
              )}

              {/* ④ Personality — 第一印象 vs 真實的你 */}
              {lagna && (
                <Section icon={<Sparkle className="h-4 w-4" />} badge={`上升 · ${chart.ascendant.rashi.chinese}`} title={lagna.tagline}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <InfoCard label="🪞 朋友眼中的你" body={lagna.firstImpression} />
                    <InfoCard label="🫥 真實的你（深入認識才知道）" body={lagna.realYou} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <TagCard icon={<ShieldCheck className="h-4 w-4 text-emerald-400" />} title="讓人愛上你的點" tags={lagna.lovableTraits} tone="good" />
                    <TagCard icon={<ShieldAlert className="h-4 w-4 text-vermilion-500" />} title="讓人想跟你打架的點" tags={lagna.redFlags} tone="bad" />
                  </div>
                  <div className="mt-4 grid md:grid-cols-2 gap-4">
                    <QuoteBlock icon="👥" title="朋友對你的標籤" body={lagna.socialLabel} />
                    <QuoteBlock icon="🎯" title="這輩子的功課" body={lagna.lifeLesson} accent />
                  </div>
                </Section>
              )}

              <div id="love" className="scroll-mt-20 -mt-6" />
              {/* ④ Moon + Love */}
              {moon && (
                <Section icon={<Heart className="h-4 w-4" />} badge={`月亮 · ${chart.tropical.moon.rashi.chinese}`} title={`你的愛情模式：${moon.theme}`} highlight>
                  <p className="text-slate-300 leading-relaxed">{moon.emotional}</p>
                  <div className="grid md:grid-cols-2 gap-3 mt-4">
                    <InfoCard label="💘 你的戀愛風格" body={moon.loveStyle} />
                    <InfoCard label="💬 你是怎麼撩人的" body={moon.howYouFlirt} />
                    <InfoCard label="🚫 你的地雷" body={moon.dealBreaker} />
                    <InfoCard label="💍 婚姻時機" body={moon.marriageTiming} />
                  </div>
                  <div className="mt-4 rounded-xl border border-vermilion-500/20 bg-vermilion-500/5 p-4 text-sm leading-relaxed">
                    <div className="font-medium text-vermilion-500 mb-1">⚠️ 感情忠告</div>
                    <div className="text-slate-200">{moon.warning}</div>
                  </div>
                  {submittedGender && submittedGender !== 'other' && (
                    <div className="mt-3 text-xs text-slate-500">
                      💡 本區解讀適用你找<strong className="text-saffron-400">{partnerTerm}</strong>時的判斷
                    </div>
                  )}
                </Section>
              )}

              {/* ⑤ Compatibility */}
              {match && (
                <Section icon={<Users className="h-4 w-4" />} badge="合盤配對" title={`你最適合 / 最該閃的${partnerTerm.split(' / ')[0]}星座`}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                      <div className="text-sm text-emerald-400 font-medium mb-2">💚 最合的三個</div>
                      <div className="space-y-1.5">
                        {match.best.map((b) => (
                          <div key={b} className="text-slate-200 text-sm">{b}</div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-vermilion-500/30 bg-vermilion-500/5 p-4">
                      <div className="text-sm text-vermilion-500 font-medium mb-2">❌ 最好保持距離</div>
                      <div className="space-y-1.5">
                        {match.avoid.map((a) => (
                          <div key={a} className="text-slate-200 text-sm">{a}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-400">💡 {match.reason}</p>
                </Section>
              )}

              <div id="career" className="scroll-mt-20 -mt-6" />
              {/* ⑥ Sun + Career + Money */}
              {sun && (
                <Section icon={<Briefcase className="h-4 w-4" />} badge={`太陽 · ${chart.tropical.sun.rashi.chinese}`} title={`事業與財運：${sun.theme}`}>
                  <p className="text-slate-300 leading-relaxed">{sun.workStyle}</p>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <TagCard icon={<ShieldCheck className="h-4 w-4 text-emerald-400" />} title="超適合你的職業" tags={sun.bestCareers} tone="good" />
                    <TagCard icon={<ShieldAlert className="h-4 w-4 text-vermilion-500" />} title="不推薦的職業" tags={sun.avoidCareers} tone="bad" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <InfoCard label="💰 你的賺錢風格" body={sun.moneyStyle} />
                    <InfoCard label="🎯 成功關鍵" body={sun.successKey} />
                  </div>
                  <div className="mt-4 rounded-xl border border-saffron-500/20 bg-saffron-500/5 p-4 text-sm leading-relaxed">
                    <div className="font-medium text-saffron-400 mb-1">⚠️ 事業陷阱</div>
                    <div className="text-slate-200">{sun.commonTrap}</div>
                  </div>
                </Section>
              )}

              <div id="dasha" className="scroll-mt-20 -mt-6" />
              {/* ⑦-0 人生大運地圖 — 完整 120 年 Vimshottari 總覽 */}
              {dashaPeriods && dashaPeriods.length > 0 && (
                <Section
                  icon={<Clock4 className="h-4 w-4" />}
                  badge="人生大運地圖 · Vimshottari 全貌"
                  title="你這輩子會走過的每一個大運"
                >
                  <p className="text-sm text-slate-400 mb-4">
                    吠陀占星 120 年大運循環 — 你每個年齡階段由哪一顆行星主導，一張表看完。
                  </p>
                  <div className="space-y-2">
                    {dashaPeriods.map((p, i) => {
                      const reading = dashaReadings[p.lord]
                      const ageStart = Math.max(0, ageOf(p.start))
                      const ageEnd = ageOf(p.end)
                      const isPast = p.end <= now
                      const isCurrent = p.start <= now && p.end > now
                      const status = isCurrent ? 'current' : isPast ? 'past' : 'future'
                      return (
                        <DashaMapRow
                          key={i}
                          index={i + 1}
                          ageRange={`${ageStart.toFixed(0)}–${ageEnd.toFixed(0)} 歲`}
                          dateRange={`${p.start.getFullYear()}–${p.end.getFullYear()}`}
                          years={p.years.toFixed(1)}
                          name={reading?.name}
                          nickname={reading?.nickname}
                          theme={reading?.theme}
                          status={status}
                        />
                      )
                    })}
                  </div>
                  <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                    💡 大運總長 120 年。不是每個人都會走完整個循環 — 這張表顯示「如果你活到 120 歲」會經歷的全部，現實中你會走到你壽數所在的位置。
                  </p>
                </Section>
              )}

              {/* ⑦-1 PAST 過去運勢（按年齡過濾事件） */}
              {pastPeriods.length > 0 && (
                <Section icon={<History className="h-4 w-4" />} badge="過去運勢 · 你走過的大運" title="你這輩子經歷過的人生階段">
                  <p className="text-sm text-slate-400 mb-4">
                    Vimshottari Dasha 的 120 年週期，看出你在每個年齡段被哪顆星帶著。每張卡顯示的事件都按你當時的年齡段過濾。
                  </p>
                  <div className="space-y-3">
                    {pastPeriods.map((p, i) => {
                      const r = dashaReadings[p.lord]
                      const ageStart = ageOf(p.start)
                      const ageEnd = ageOf(p.end)
                      const events = getDashaEventsForAge(p.lord, Math.max(0, ageStart), ageEnd)
                      return (
                        <DashaTimelineCard
                          key={i}
                          ageRange={`${ageStart < 0 ? 0 : ageStart.toFixed(0)} – ${ageEnd.toFixed(0)} 歲`}
                          dateRange={`${p.start.getFullYear()} – ${p.end.getFullYear()}`}
                          name={r.name}
                          nickname={r.nickname}
                          theme={r.theme}
                          typicalEvents={events}
                          tone="past"
                        />
                      )
                    })}
                  </div>
                </Section>
              )}

              {/* ⑦-2 PRESENT 現在運勢 + Antardasha */}
              {currentDasha && currentDashaReading && (
                <Section icon={<CircleDot className="h-4 w-4" />} badge="現在運勢 · 目前大運 + 小運" title={`你現在正在走：${currentDashaReading.name}（${currentDashaReading.nickname}）`} highlight>
                  <div className="grid md:grid-cols-4 gap-3 mb-5">
                    <DashaStat label="目前年齡" value={`${ageOf(now).toFixed(0)} 歲`} />
                    <DashaStat label="大運主題" value={currentDashaReading.theme} />
                    <DashaStat label="此大運共" value={`${currentDashaReading.years} 年`} />
                    <DashaStat label="還剩" value={`約 ${currentDasha.yearsRemaining.toFixed(1)} 年`} accent />
                  </div>
                  <p className="text-slate-200 leading-relaxed text-base mb-2 border-l-2 border-saffron-500/60 pl-4">
                    {currentDashaReading.vibe}
                  </p>
                  <p className="text-xs text-slate-500 mb-5 pl-4">
                    <span className="text-saffron-400">Karaka（自然徵象）：</span> {currentDashaReading.karaka}
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <InfoCard label="💼 事業運" body={currentDashaReading.career} />
                    <InfoCard label="💘 感情運" body={currentDashaReading.love} />
                    <InfoCard label="💰 財運" body={currentDashaReading.money} />
                    <InfoCard label="🏥 健康運" body={currentDashaReading.health} />
                  </div>

                  {/* 當下年齡對應的事件 */}
                  <div className="mt-4 rounded-xl border border-saffron-500/20 bg-saffron-500/5 p-4">
                    <div className="text-sm text-saffron-400 font-medium mb-2">📌 你這個年齡在此大運常見的事件</div>
                    <div className="flex flex-wrap gap-1.5">
                      {getDashaEventsForAge(currentDasha.lord, ageOf(now), ageOf(now) + 0.1).map((e) => (
                        <span key={e} className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-xs">{e}</span>
                      ))}
                    </div>
                  </div>

                  {/* Antardasha — Raman 預測關鍵 */}
                  {currentAD && currentADReading && (
                    <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-400 mb-3">
                        🔍 Antardasha 小運（Raman 法則：細到月的預測）
                      </div>
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-serif text-xl text-emerald-300">
                          {currentDasha.lord} / {currentAD.lord}
                        </span>
                        <span className="text-sm text-slate-400">
                          {currentDashaReading.nickname} 中的{currentADReading.nickname}子階段
                        </span>
                      </div>
                      <div className="text-sm text-slate-300 mt-2 leading-relaxed">
                        {currentAD.start.toLocaleDateString('zh-TW')} ~ {currentAD.end.toLocaleDateString('zh-TW')}
                        <span className="text-slate-500"> · 約 {(currentAD.years * 12).toFixed(0)} 個月 · 剩 {(currentAD.yearsRemaining * 12).toFixed(1)} 個月</span>
                      </div>
                      <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                        <span className="text-slate-400">重點主題 → </span>
                        {currentAD.lord === currentDasha.lord ? '同主題深化、加倍。' : `${currentADReading.theme.split('·')[0]}的議題會在${currentDashaReading.theme.split('·')[0]}的大框架下浮現。`}
                      </p>
                      {upcomingADs.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-emerald-500/20">
                          <div className="text-xs text-slate-400 mb-2">接下來 3 個小運：</div>
                          <div className="space-y-1.5">
                            {upcomingADs.map((ad, i) => {
                              const ar = dashaReadings[ad.lord]
                              return (
                                <div key={i} className="text-sm flex items-center justify-between gap-3">
                                  <span className="text-slate-200">
                                    {currentDasha.lord} / <span className="text-emerald-300">{ad.lord}</span>
                                    <span className="text-slate-500 ml-2 text-xs">{ar.nickname}</span>
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    {ad.start.toLocaleDateString('zh-TW')} ({(ad.years * 12).toFixed(0)} 個月)
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-3 mt-4">
                    <TagCard icon={<TrendingUp className="h-4 w-4 text-emerald-400" />} title="這段時間適合做的事" tags={currentDashaReading.goodFor} tone="good" />
                    <TagCard icon={<ShieldAlert className="h-4 w-4 text-vermilion-500" />} title="需要特別注意的事" tags={currentDashaReading.watchOut} tone="bad" />
                  </div>
                </Section>
              )}

              {/* ⑦-3 FUTURE 未來運勢（按年齡過濾事件） */}
              {futurePeriods.length > 0 && (
                <Section icon={<Telescope className="h-4 w-4" />} badge="未來運勢 · 接下來的大運" title="你未來 50 年的人生地圖">
                  <p className="text-sm text-slate-400 mb-4">
                    每個大運切換點就是人生的「翻頁時刻」。事件顯示會根據你那時候的年齡自動調整 — 童年看不到結婚、80 歲不會出現考大學。
                  </p>
                  <div className="space-y-3">
                    {futurePeriods.map((p, i) => {
                      const r = dashaReadings[p.lord]
                      const ageStart = ageOf(p.start)
                      const ageEnd = ageOf(p.end)
                      const events = getDashaEventsForAge(p.lord, ageStart, ageEnd)
                      return (
                        <DashaTimelineCard
                          key={i}
                          ageRange={`${ageStart.toFixed(0)} – ${ageEnd.toFixed(0)} 歲`}
                          dateRange={`${p.start.getFullYear()} – ${p.end.getFullYear()}`}
                          name={r.name}
                          nickname={r.nickname}
                          theme={r.theme}
                          vibe={r.vibe}
                          career={r.career}
                          love={r.love}
                          money={r.money}
                          typicalEvents={events}
                          tone="future"
                          turningPoint={i === 0}
                        />
                      )
                    })}
                  </div>
                </Section>
              )}

              {/* ⑧ Nakshatra */}
              {nakshatra && (
                <Section icon={<Star className="h-4 w-4" />} badge={`月宿 · ${chart.sidereal.moon.nakshatra.name} · Pada ${chart.sidereal.moon.nakshatra.pada}`} title={nakshatra.theme}>
                  <p className="text-slate-300 leading-relaxed">{nakshatra.body}</p>
                </Section>
              )}

              <div id="energy" className="scroll-mt-20 -mt-6" />
              {/* ⑨ Lucky System */}
              {lucky && (
                <Section icon={<Gem className="h-4 w-4" />} badge="幸運系統" title="你的幸運色、幸運數字、幸運方位">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <LuckyTile emoji="🎨" label="幸運色" value={lucky.colors} />
                    <LuckyTile emoji="🔢" label="幸運數字" value={lucky.numbers} />
                    <LuckyTile emoji="📅" label="幸運日" value={lucky.luckyDay} />
                    <LuckyTile emoji="🧭" label="幸運方位" value={lucky.direction} />
                    <LuckyTile emoji="💎" label="開運寶石" value={lucky.gem} />
                    <LuckyTile emoji="🚫" label="要避開" value={lucky.avoid} warn />
                  </div>
                </Section>
              )}

              {/* ⑩ Element balance */}
              {elementBalance && (
                <Section icon={<Flame className="h-4 w-4" />} badge="元素平衡" title={`你的主導元素：${elementBalance.dominantInfo.name}`}>
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {['fire', 'earth', 'air', 'water'].map((el) => {
                      const Icon = elementIcon[el]
                      const count = elementBalance.counts[el]
                      const isDominant = elementBalance.dominant === el
                      return (
                        <div key={el} className={`rounded-xl border p-3 text-center ${isDominant ? 'border-saffron-500/40 bg-saffron-500/10' : count === 0 ? 'border-white/5 bg-white/[0.02] opacity-50' : 'border-white/10 bg-white/5'}`}>
                          <Icon className="h-5 w-5 mx-auto text-saffron-400" />
                          <div className="text-xs text-slate-400 mt-1.5">{{ fire: '火', earth: '土', air: '風', water: '水' }[el]}</div>
                          <div className="font-serif text-lg">{count}</div>
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-sm text-slate-300">{elementBalance.dominantInfo.advice}</p>
                  {elementBalance.missing.length > 0 && (
                    <p className="mt-3 text-xs text-slate-400 pt-3 border-t border-white/5">
                      缺的元素：{elementBalance.missingInfo.map((m) => m.name).join('、')}——建議刻意補足
                    </p>
                  )}
                </Section>
              )}

              {/* ⑪ Remedy */}
              {remedy && (
                <Section icon={<Sparkles className="h-4 w-4" />} badge="開運建議" title={`你的守護星是 ${remedy.ruler}`}>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <LuckyTile emoji="💎" label="對應寶石" value={remedy.gem} />
                    <LuckyTile emoji="⚙️" label="主管金屬" value={remedy.metal} />
                    <LuckyTile emoji="📅" label="主管日" value={remedy.day} />
                    <LuckyTile emoji="🕉️" label="曼陀羅" value={remedy.mantra} />
                  </div>
                  <p className="text-xs text-slate-400 mt-4">專注方向：{remedy.focus}。傳統建議主管日持誦 108 次，清晨最佳。</p>
                </Section>
              )}

              {/* ⑫ Houses */}
              <Section icon={<MapPin className="h-4 w-4" />} badge="12 宮位 · 吠陀人生地圖" title="你的 Bhavas（12 宮位）">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {chart.sidereal.houses.map((h) => {
                    const grahasHere = Object.entries(chart.sidereal.grahas)
                      .filter(([, g]) => g.house === h.house)
                      .map(([name]) => name)
                    return (
                      <div key={h.house} className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <div className="text-xs text-slate-400">第 {h.house} 宮</div>
                        <div className="font-serif text-lg">{h.rashi.symbol} {h.rashi.chinese}</div>
                        <div className="text-xs text-slate-500">{h.rashi.name}</div>
                        {grahasHere.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-white/5 flex flex-wrap gap-1">
                            {grahasHere.map((g) => (
                              <span key={g} className="text-[10px] rounded bg-saffron-500/20 text-saffron-300 px-1.5 py-0.5">
                                {g}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </Section>

              {/* ⑬ 9 Grahas Table */}
              <Section icon={<Sparkles className="h-4 w-4" />} badge="九大行星 Navagraha · 全部落點" title="你命盤裡所有行星的位置">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-xs uppercase text-slate-400">
                        <th className="text-left py-2 px-2">行星</th>
                        <th className="text-left py-2 px-2">星座 Rashi</th>
                        <th className="text-left py-2 px-2">度數</th>
                        <th className="text-left py-2 px-2">月宿 Nakshatra</th>
                        <th className="text-left py-2 px-2">宮位</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(chart.sidereal.grahas).map(([name, g]) => (
                        <tr key={name} className="border-b border-white/5 hover:bg-white/[0.02]">
                          <td className="py-2 px-2 font-medium text-saffron-400">{name}</td>
                          <td className="py-2 px-2">
                            <span className="text-base">{g.rashi.symbol}</span>
                            <span className="ml-1 text-slate-200">{g.rashi.chinese}</span>
                          </td>
                          <td className="py-2 px-2 text-slate-400 text-xs">{formatDegrees(g.degreeInSign)}</td>
                          <td className="py-2 px-2 text-xs">
                            <span className="text-slate-200">{g.nakshatra.name}</span>
                            <span className="text-slate-500 ml-1">P{g.nakshatra.pada}</span>
                          </td>
                          <td className="py-2 px-2 text-slate-400">第 {g.house} 宮</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                  💡 這是你命盤的完整行星佈局。後續的進階解讀（Yoga、大運、衝突點）都會依這張表計算。
                </p>
              </Section>
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
    <div className="glass-panel p-10 text-center">
      <Sparkles className="h-12 w-12 mx-auto text-saffron-400/60 mb-4" />
      <h3 className="font-serif text-2xl mb-2">你的命盤解讀包含：</h3>
      <div className="grid sm:grid-cols-2 gap-3 mt-5 text-left">
        {[
          ['🪞', '朋友眼中 vs 真實的你'],
          ['💘', '你的戀愛模式 + 地雷'],
          ['💚', '最合 / 最雷的星座配對'],
          ['💼', '超適合你的職業清單'],
          ['💰', '你的賺錢風格'],
          ['📅', '你現在走哪個大運、剩幾年'],
          ['🍀', '幸運色、數字、方位、寶石'],
          ['🎯', '你這輩子的宿命功課']
        ].map(([e, t]) => (
          <div key={t} className="flex items-start gap-2 text-sm text-slate-300">
            <span className="text-lg">{e}</span>{t}
          </div>
        ))}
      </div>
      <div className="mt-6 text-sm text-slate-500">← 在左邊填入你的生辰資料開始</div>
    </div>
  )
}

function PlanetBadge({ icon, label, rashi, degree, nakshatra, sideLabel, highlight }) {
  return (
    <div className={`rounded-2xl border p-5 ${highlight ? 'border-saffron-500/40 bg-saffron-500/5' : 'border-white/10 bg-white/5'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300 text-sm">
          <span className="text-saffron-400">{icon}</span>{label}
        </div>
        <div className="text-2xl">{rashi.symbol}</div>
      </div>
      <div className="mt-3 font-serif text-xl">{rashi.chinese} · {rashi.name}</div>
      <div className="text-sm text-slate-400 mt-1">{formatDegrees(degree)} · 守護 {rashi.rulerChinese}</div>
      {sideLabel && (
        <div className="mt-1 text-xs text-slate-500">{sideLabel}</div>
      )}
      {nakshatra && (
        <div className="mt-3 pt-3 border-t border-white/10 text-sm">
          <div className="text-xs text-slate-400">Nakshatra 月宿</div>
          <div className="font-medium text-saffron-400">{nakshatra.name} · Pada {nakshatra.pada}</div>
          <div className="text-xs text-slate-500 mt-0.5">{nakshatra.trait}</div>
        </div>
      )}
    </div>
  )
}

function Section({ icon, badge, title, children, highlight }) {
  return (
    <div className={`glass-panel p-6 ${highlight ? 'border-saffron-500/40 bg-saffron-500/5' : ''}`}>
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-saffron-400 mb-2">
        {icon}{badge}
      </div>
      <h3 className="font-serif text-2xl gradient-text mb-4">{title}</h3>
      {children}
    </div>
  )
}

function InfoCard({ label, body }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-saffron-400 font-medium mb-1.5">{label}</div>
      <div className="text-sm text-slate-200 leading-relaxed">{body}</div>
    </div>
  )
}

function TagCard({ icon, title, tags, tone }) {
  const border = tone === 'good' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-vermilion-500/20 bg-vermilion-500/5'
  return (
    <div className={`rounded-xl border ${border} p-4`}>
      <div className="flex items-center gap-2 text-sm font-medium mb-2">
        {icon}{title}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span key={t} className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-xs">{t}</span>
        ))}
      </div>
    </div>
  )
}

function QuoteBlock({ icon, title, body, accent }) {
  return (
    <div className={`rounded-xl border p-4 ${accent ? 'border-saffron-500/30 bg-saffron-500/5' : 'border-white/10 bg-white/5'}`}>
      <div className="text-xs text-slate-400 mb-1">{icon} {title}</div>
      <div className="text-sm text-slate-200 leading-relaxed">{body}</div>
    </div>
  )
}

function LuckyTile({ emoji, label, value, warn }) {
  return (
    <div className={`rounded-xl border p-3 ${warn ? 'border-vermilion-500/20 bg-vermilion-500/5' : 'border-white/10 bg-white/5'}`}>
      <div className="text-xs text-slate-400">{emoji} {label}</div>
      <div className="text-sm text-slate-100 font-medium mt-0.5">{value}</div>
    </div>
  )
}

function DashaMapRow({ index, ageRange, dateRange, years, name, nickname, theme, status }) {
  const styles = {
    past: 'border-white/10 bg-white/[0.02] opacity-70',
    current: 'border-saffron-500/60 bg-gradient-to-r from-saffron-500/15 to-vermilion-500/10 shadow-lg shadow-saffron-500/20',
    future: 'border-white/10 bg-white/5'
  }
  const badges = {
    past: { text: '已過', cls: 'bg-slate-700/60 text-slate-300' },
    current: { text: '● 現在', cls: 'bg-saffron-500 text-cosmic-950 font-semibold animate-pulse' },
    future: { text: '將到', cls: 'bg-white/10 text-slate-300' }
  }
  const badge = badges[status]

  return (
    <div className={`relative rounded-xl border p-3 md:p-4 ${styles[status]} transition-all`}>
      <div className="flex items-center gap-3 md:gap-4">
        {/* 順序 */}
        <div className="flex-shrink-0 h-9 w-9 md:h-10 md:w-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-sm font-serif text-slate-300">
          {index}
        </div>
        {/* 年齡 + 年份 */}
        <div className="flex-shrink-0 text-center min-w-[90px]">
          <div className={`text-sm md:text-base font-medium ${status === 'current' ? 'text-saffron-300' : 'text-slate-200'}`}>
            {ageRange}
          </div>
          <div className="text-[11px] text-slate-500">{dateRange}</div>
        </div>
        {/* 大運名稱 + 主題 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-serif text-base md:text-lg ${status === 'current' ? 'text-saffron-400' : 'text-slate-200'}`}>
              {name}
            </span>
            <span className="text-[11px] text-slate-500">· {nickname}</span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{theme}</div>
        </div>
        {/* 狀態徽章 */}
        <div className="flex-shrink-0 flex flex-col items-end gap-1">
          <span className={`rounded-full px-2 py-0.5 text-[10px] ${badge.cls}`}>
            {badge.text}
          </span>
          <span className="text-[10px] text-slate-500">{years} 年</span>
        </div>
      </div>
    </div>
  )
}

function DashaTimelineCard({ ageRange, dateRange, name, nickname, theme, vibe, career, love, money, typicalEvents, tone, turningPoint }) {
  const isPast = tone === 'past'
  const isFuture = tone === 'future'
  return (
    <div
      className={`relative rounded-xl border p-4 ${
        isPast
          ? 'border-white/10 bg-white/[0.03] opacity-90'
          : isFuture
          ? 'border-saffron-500/20 bg-saffron-500/[0.04]'
          : 'border-white/10 bg-white/5'
      }`}
    >
      {turningPoint && (
        <div className="absolute -top-2 right-4 rounded-full bg-gradient-to-r from-saffron-500 to-vermilion-500 px-2.5 py-0.5 text-[10px] font-semibold text-cosmic-950">
          下一個翻頁時刻
        </div>
      )}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-serif text-saffron-400 text-lg">{name}</span>
            <span className="text-xs text-slate-500">· {nickname}</span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">{theme}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={`text-sm font-medium ${isFuture ? 'text-saffron-400' : 'text-slate-200'}`}>
            {ageRange}
          </div>
          <div className="text-xs text-slate-500">{dateRange}</div>
        </div>
      </div>

      {vibe && (
        <p className="mt-3 text-sm text-slate-300 leading-relaxed">
          {vibe}
        </p>
      )}

      {(career || love || money) && (
        <div className="mt-3 grid sm:grid-cols-3 gap-2 text-xs">
          {career && (
            <div className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5">
              <div className="text-emerald-400 mb-0.5">💼 事業</div>
              <div className="text-slate-300 leading-relaxed">{career}</div>
            </div>
          )}
          {love && (
            <div className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5">
              <div className="text-pink-400 mb-0.5">💘 感情</div>
              <div className="text-slate-300 leading-relaxed">{love}</div>
            </div>
          )}
          {money && (
            <div className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5">
              <div className="text-amber-400 mb-0.5">💰 財運</div>
              <div className="text-slate-300 leading-relaxed">{money}</div>
            </div>
          )}
        </div>
      )}

      {typicalEvents && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {typicalEvents.slice(0, isPast ? 4 : 6).map((e) => (
            <span key={e} className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[11px] text-slate-300">
              {e}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function RarityCard({ rarity }) {
  const [showDetails, setShowDetails] = useState(false)
  // 從對比參考中挑一個比你「更稀有」的屬性（讓用戶有「哇」的反應）
  const comparison = buildRarityComparison(rarity.topPercent)

  return (
    <div className="glass-panel p-6 md:p-8 bg-gradient-to-br from-vermilion-500/10 via-saffron-500/10 to-amber-500/5 border-saffron-500/40 relative overflow-hidden">
      {/* 背景裝飾 */}
      <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-saffron-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-vermilion-500/10 blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-saffron-400 mb-2">
          <Sparkles className="h-4 w-4" />
          命盤稀有度指數
        </div>

        <div className="grid md:grid-cols-[auto_1fr] gap-6 items-center">
          {/* 左：大圓分數 */}
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

          {/* 右：標題 + 特徵清單 */}
          <div className="flex-1">
            <h3 className="font-serif text-3xl md:text-4xl gradient-text">{rarity.title}</h3>
            <div className="mt-1 text-lg text-saffron-400">
              位於全人口 <strong className="font-serif text-2xl">Top {rarity.topPercent}%</strong>
            </div>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">{rarity.note}。</p>

            {/* 人口比較 — 真實統計數據作對比 */}
            <div className="mt-3 rounded-xl border border-saffron-500/20 bg-saffron-500/5 p-3">
              <div className="text-[11px] text-saffron-400 font-medium uppercase tracking-wider mb-1.5">
                放在世界人口裡比比看
              </div>
              <div className="text-sm text-slate-200 leading-relaxed">{comparison}</div>
            </div>

            {/* 特徵 chips */}
            {rarity.features.length > 0 && (
              <div className="mt-4">
                <div className="text-xs text-slate-400 mb-2 font-medium">
                  讓你與眾不同的 {rarity.features.length} 個關鍵配置：
                </div>
                <div className="flex flex-wrap gap-2">
                  {rarity.features.slice(0, 10).map((f, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
                        f.weight >= 15
                          ? 'border-vermilion-500/40 bg-vermilion-500/10 text-vermilion-300'
                          : f.weight >= 10
                          ? 'border-saffron-500/40 bg-saffron-500/10 text-saffron-300'
                          : 'border-white/15 bg-white/5 text-slate-300'
                      }`}
                      title={f.signature}
                    >
                      <span className="font-medium">{f.label}</span>
                      <span className="text-[10px] opacity-70">{f.freq}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 展開：分數拆解 + 方法論 + 經典出處 */}
        <div className="mt-5 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={() => setShowDetails((s) => !s)}
            className="flex items-center gap-2 text-sm text-saffron-400 hover:text-saffron-300 transition"
          >
            {showDetails ? '收合' : '展開'}「怎麼算的？分數從哪裡來？」
            <span className="text-xs">{showDetails ? '▲' : '▼'}</span>
          </button>

          {showDetails && (
            <div className="mt-4 space-y-5 text-sm leading-relaxed">
              {/* 分數拆解 */}
              <div>
                <div className="text-saffron-400 font-medium mb-2">📊 你的分數組成</div>
                <div className="rounded-xl border border-white/10 bg-cosmic-950/40 overflow-hidden">
                  <table className="w-full text-xs">
                    <tbody>
                      <tr className="border-b border-white/5">
                        <td className="py-2 px-3 text-slate-400">基礎分（人人皆有）</td>
                        <td className="py-2 px-3 text-right text-slate-300 tabular-nums">+40</td>
                      </tr>
                      {rarity.features.map((f, i) => (
                        <tr key={i} className="border-b border-white/5 last:border-b-0">
                          <td className="py-2 px-3">
                            <div className="text-slate-200">{f.label}</div>
                            <div className="text-[10px] text-slate-500">
                              出現頻率 {f.freq} · {f.signature}
                            </div>
                          </td>
                          <td className="py-2 px-3 text-right text-saffron-400 tabular-nums font-medium">
                            +{f.weight}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-saffron-500/5">
                        <td className="py-2 px-3 font-semibold text-saffron-400">合計（上限 100）</td>
                        <td className="py-2 px-3 text-right font-serif text-xl gradient-text tabular-nums">
                          {rarity.score}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 方法論 */}
              <div>
                <div className="text-saffron-400 font-medium mb-2">🔬 計算方法</div>
                <div className="text-slate-300 space-y-2">
                  <p>
                    我們掃描你的命盤中 <strong>23 種古典吠陀配置</strong>，每個配置根據「在一般人口中的出現頻率」給一個權重（越罕見 = 權重越高）。
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 ml-2">
                    <li>5 種 Panchamahapurusha Yoga（五大偉人瑜伽）</li>
                    <li>4 種吉星組合（Raj / Dhana / Gaja Kesari / Budha-Aditya）</li>
                    <li>3 種逆轉型瑜伽（Neecha Bhanga / Vipreet Raj / Parivartana）</li>
                    <li>11 種特殊配置（雙光合宿、新/滿月、Stellium、元素主導等）</li>
                  </ul>
                  <p className="text-xs text-slate-500">
                    頻率估計基於古典 Jyotish 文獻的經驗統計（見下方出處），並參考現代吠陀占星家（B.V. Raman、K.N. Rao）的統計資料。
                  </p>
                </div>
              </div>

              {/* 經典出處 */}
              <div>
                <div className="text-saffron-400 font-medium mb-2">📚 經典出處</div>
                <div className="space-y-1.5 text-xs text-slate-400">
                  <div>
                    <strong className="text-slate-200">Brihat Parashara Hora Shastra</strong> — 帕拉薩拉尊者著，吠陀占星最權威的古典文本（c. 300 BCE – 600 CE 編纂），定義多數 Yoga 與 Dosha
                  </div>
                  <div>
                    <strong className="text-slate-200">Saravali</strong> — Kalyana Varma 著（11 世紀），五大偉人瑜伽的系統化來源
                  </div>
                  <div>
                    <strong className="text-slate-200">Phaladeepika</strong> — Mantreswara 著（14 世紀），Nakshatra Pada 分段與宮位解讀權威
                  </div>
                  <div>
                    <strong className="text-slate-200">B.V. Raman 著作</strong>（1912-1998）— 現代吠陀占星標準化的奠基者，Hindu Predictive Astrology / Three Hundred Important Combinations
                  </div>
                </div>
              </div>

              {/* 警語 */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-slate-400 leading-relaxed">
                ⚠️ <strong className="text-slate-300">重要提醒</strong>：稀有度 ≠「命好 / 命不好」。
                高分代表命盤中有較多「在古典文獻被特別記載」的配置，這些配置往往伴隨明顯的人格或人生特徵（可能是吉、可能是挑戰）。
                分數低的命盤不代表平庸，可能是「均衡型」— 沒有極端配置，日子反而平穩。
                這個指數的核心用途是<strong className="text-saffron-400">幫你認識自己的獨特點</strong>，不是用來比較高低。
              </div>
            </div>
          )}
        </div>
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

function DashaStat({ label, value, accent }) {
  return (
    <div className={`rounded-xl border p-3 ${accent ? 'border-saffron-500/40 bg-saffron-500/10' : 'border-white/10 bg-white/5'}`}>
      <div className="text-xs text-slate-400">{label}</div>
      <div className={`text-base font-medium mt-0.5 ${accent ? 'text-saffron-400' : 'text-slate-100'}`}>{value}</div>
    </div>
  )
}
