import { useState } from 'react'
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
  Telescope
} from 'lucide-react'
import { computeVedicChart, formatDegrees, computeVimshottariDasha, getCurrentDasha } from '../utils/vedicCalc.js'
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
  normalizeNakshatraName
} from '../data/interpretations.js'

const defaultForm = {
  date: '1990-01-01',
  time: '12:00',
  tz: '8',
  lat: '25.04',
  lon: '121.56',
  city: '台北, 台灣'
}

const elementIcon = { fire: Flame, earth: Mountain, air: Wind, water: Droplets }

export default function BirthChart() {
  const [form, setForm] = useState(defaultForm)
  const [chart, setChart] = useState(null)
  const [submittedCity, setSubmittedCity] = useState('')
  const [submittedStamp, setSubmittedStamp] = useState('')
  const [error, setError] = useState('')

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleCompute = (e) => {
    e.preventDefault()
    setError('')
    try {
      const [year, month, day] = form.date.split('-').map(Number)
      const [hour, minute] = form.time.split(':').map(Number)
      const result = computeVedicChart({
        year, month, day, hour, minute,
        tzOffset: parseFloat(form.tz),
        lat: parseFloat(form.lat),
        lon: parseFloat(form.lon)
      })
      setChart(result)
      setSubmittedCity(form.city)
      setSubmittedStamp(`${form.date} ${form.time}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError('計算失敗：請檢查輸入格式。')
      console.error(err)
    }
  }

  // Derived data
  const lagna = chart ? lagnaReadings[chart.ascendant.rashi.name] : null
  const moon = chart ? moonReadings[chart.moon.rashi.name] : null
  const sun = chart ? sunReadings[chart.sun.rashi.name] : null
  const nakshatra = chart
    ? nakshatraReadings[normalizeNakshatraName(chart.moon.nakshatra.name)]
    : null
  const lucky = chart ? luckySystem[chart.moon.rashi.name] : null
  const match = chart ? compatibility[chart.moon.rashi.name] : null
  const remedy = chart ? getRemedyForRashi(chart.moon.rashi.name) : null
  const elementBalance = chart
    ? getElementBalance({
        sunRashi: chart.sun.rashi.name,
        moonRashi: chart.moon.rashi.name,
        lagnaRashi: chart.ascendant.rashi.name
      })
    : null

  const dashaPeriods = chart
    ? computeVimshottariDasha({
        moonSidereal: chart.moon.sidereal,
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
        lagna: chart.ascendant.rashi.name,
        moon: chart.moon.rashi.name,
        sun: chart.sun.rashi.name,
        nakshatra: normalizeNakshatraName(chart.moon.nakshatra.name)
      })
    : null

  const personality = chart
    ? getPersonalitySummary({
        lagna: chart.ascendant.rashi.name,
        moon: chart.moon.rashi.name,
        sun: chart.sun.rashi.name
      })
    : null

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="section-title">吠陀命盤 · 超接地氣解讀</h1>
        <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm">
          輸入生辰，看看你這輩子的愛情、事業、財運、大運走向 — 以及你朋友都不好意思告訴你的那些事
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
        {/* Form */}
        <form onSubmit={handleCompute} className="glass-panel p-6 space-y-5 h-fit lg:sticky lg:top-6">
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-300 mb-2">
              <Calendar className="h-4 w-4 text-saffron-400" />出生日期
            </label>
            <input type="date" required className="input-field" value={form.date} onChange={(e) => update('date', e.target.value)} />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-300 mb-2">
              <Clock className="h-4 w-4 text-saffron-400" />出生時間（24h）
            </label>
            <input type="time" required className="input-field" value={form.time} onChange={(e) => update('time', e.target.value)} />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-300 mb-2">
              <Globe className="h-4 w-4 text-saffron-400" />時區（UTC，台灣 +8）
            </label>
            <input type="number" step="0.5" required className="input-field" value={form.tz} onChange={(e) => update('tz', e.target.value)} />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-300 mb-2">
              <MapPin className="h-4 w-4 text-saffron-400" />出生城市（顯示用）
            </label>
            <input type="text" className="input-field" value={form.city} onChange={(e) => update('city', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">緯度 °N</label>
              <input type="number" step="0.01" required className="input-field" value={form.lat} onChange={(e) => update('lat', e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-2 block">經度 °E</label>
              <input type="number" step="0.01" required className="input-field" value={form.lon} onChange={(e) => update('lon', e.target.value)} />
            </div>
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

          <p className="text-xs text-slate-500 leading-relaxed">
            沒有要 key 也沒有第三方 API，純本地計算。想精準的話建議查出生地的經緯度再填。
          </p>
        </form>

        {/* Result */}
        <div className="space-y-6">
          {!chart ? (
            <WelcomePanel />
          ) : (
            <>
              {/* ① Summary Hero */}
              <div className="glass-panel p-6 md:p-8 bg-gradient-to-br from-saffron-500/10 to-vermilion-500/5 border-saffron-500/30">
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
                <div className="mt-5 text-sm text-slate-400">
                  {submittedCity} · {submittedStamp} · Ayanamsha {chart.ayanamsha.toFixed(2)}°
                </div>
              </div>

              {/* ② Chart + Badges */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-panel p-6">
                  <ChartWheel chart={chart} />
                </div>
                <div className="space-y-4">
                  <PlanetBadge icon={<ArrowUpRight className="h-5 w-5" />} label="上升 Lagna" rashi={chart.ascendant.rashi} degree={chart.ascendant.degreeInSign} />
                  <PlanetBadge icon={<Sun className="h-5 w-5" />} label="太陽 Surya" rashi={chart.sun.rashi} degree={chart.sun.degreeInSign} nakshatra={chart.sun.nakshatra} />
                  <PlanetBadge icon={<Moon className="h-5 w-5" />} label="月亮 Chandra" rashi={chart.moon.rashi} degree={chart.moon.degreeInSign} nakshatra={chart.moon.nakshatra} highlight />
                </div>
              </div>

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

              {/* ④ Moon + Love */}
              {moon && (
                <Section icon={<Heart className="h-4 w-4" />} badge={`月亮 · ${chart.moon.rashi.chinese}`} title={`你的愛情模式：${moon.theme}`} highlight>
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
                </Section>
              )}

              {/* ⑤ Compatibility */}
              {match && (
                <Section icon={<Users className="h-4 w-4" />} badge="合盤配對" title="你最適合 / 最該閃的星座">
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

              {/* ⑥ Sun + Career + Money */}
              {sun && (
                <Section icon={<Briefcase className="h-4 w-4" />} badge={`太陽 · ${chart.sun.rashi.chinese}`} title={`事業與財運：${sun.theme}`}>
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

              {/* ⑦-1 PAST 過去運勢 */}
              {pastPeriods.length > 0 && (
                <Section icon={<History className="h-4 w-4" />} badge="過去運勢 · 你走過的大運" title="你這輩子經歷過的人生階段">
                  <p className="text-sm text-slate-400 mb-4">
                    吠陀占星用 Vimshottari 120 年週期，看出你在每個年齡段被哪顆星帶著。回頭看看，那些日子是不是都被命中了？
                  </p>
                  <div className="space-y-3">
                    {pastPeriods.map((p, i) => {
                      const r = dashaReadings[p.lord]
                      const ageStart = ageOf(p.start)
                      const ageEnd = ageOf(p.end)
                      return (
                        <DashaTimelineCard
                          key={i}
                          ageRange={`${ageStart < 0 ? 0 : ageStart.toFixed(0)} – ${ageEnd.toFixed(0)} 歲`}
                          dateRange={`${p.start.getFullYear()} – ${p.end.getFullYear()}`}
                          name={r.name}
                          nickname={r.nickname}
                          theme={r.theme}
                          typicalEvents={r.typicalEvents}
                          tone="past"
                        />
                      )
                    })}
                  </div>
                </Section>
              )}

              {/* ⑦-2 PRESENT 現在運勢（詳細） */}
              {currentDasha && currentDashaReading && (
                <Section icon={<CircleDot className="h-4 w-4" />} badge="現在運勢 · 目前大運" title={`你現在正在走：${currentDashaReading.name}（${currentDashaReading.nickname}）`} highlight>
                  <div className="grid md:grid-cols-4 gap-3 mb-5">
                    <DashaStat label="目前年齡" value={`${ageOf(now).toFixed(0)} 歲`} />
                    <DashaStat label="大運主題" value={currentDashaReading.theme} />
                    <DashaStat label="此大運共" value={`${currentDashaReading.years} 年`} />
                    <DashaStat label="還剩" value={`約 ${currentDasha.yearsRemaining.toFixed(1)} 年`} accent />
                  </div>
                  <p className="text-slate-200 leading-relaxed text-base mb-5 border-l-2 border-saffron-500/60 pl-4">
                    {currentDashaReading.vibe}
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <InfoCard label="💼 事業運" body={currentDashaReading.career} />
                    <InfoCard label="💘 感情運" body={currentDashaReading.love} />
                    <InfoCard label="💰 財運" body={currentDashaReading.money} />
                    <InfoCard label="🏥 健康運" body={currentDashaReading.health} />
                  </div>
                  <div className="mt-4 rounded-xl border border-saffron-500/20 bg-saffron-500/5 p-4">
                    <div className="text-sm text-saffron-400 font-medium mb-2">📌 這段期間常見的人生事件</div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentDashaReading.typicalEvents.map((e) => (
                        <span key={e} className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-xs">{e}</span>
                      ))}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 mt-3">
                    <TagCard icon={<TrendingUp className="h-4 w-4 text-emerald-400" />} title="這段時間適合做的事" tags={currentDashaReading.goodFor} tone="good" />
                    <TagCard icon={<ShieldAlert className="h-4 w-4 text-vermilion-500" />} title="需要特別注意的事" tags={currentDashaReading.watchOut} tone="bad" />
                  </div>
                </Section>
              )}

              {/* ⑦-3 FUTURE 未來運勢 */}
              {futurePeriods.length > 0 && (
                <Section icon={<Telescope className="h-4 w-4" />} badge="未來運勢 · 接下來的大運" title="你未來 50 年的人生地圖">
                  <p className="text-sm text-slate-400 mb-4">
                    每個大運切換點就是人生的「翻頁時刻」。事先知道，你就能做好準備 — 該衝的衝、該收的收。
                  </p>
                  <div className="space-y-3">
                    {futurePeriods.map((p, i) => {
                      const r = dashaReadings[p.lord]
                      const ageStart = ageOf(p.start)
                      const ageEnd = ageOf(p.end)
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
                          typicalEvents={r.typicalEvents}
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
                <Section icon={<Star className="h-4 w-4" />} badge={`月宿 · ${chart.moon.nakshatra.name} · Pada ${chart.moon.nakshatra.pada}`} title={nakshatra.theme}>
                  <p className="text-slate-300 leading-relaxed">{nakshatra.body}</p>
                </Section>
              )}

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
              <Section icon={<MapPin className="h-4 w-4" />} badge="12 宮位" title="你的人生地圖">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {chart.houses.map((h) => (
                    <div key={h.house} className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="text-xs text-slate-400">第 {h.house} 宮</div>
                      <div className="font-serif text-lg">{h.rashi.symbol} {h.rashi.chinese}</div>
                      <div className="text-xs text-slate-500">{h.rashi.name}</div>
                    </div>
                  ))}
                </div>
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

function PlanetBadge({ icon, label, rashi, degree, nakshatra, highlight }) {
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
      {nakshatra && (
        <div className="mt-3 pt-3 border-t border-white/10 text-sm">
          <div className="text-xs text-slate-400">Nakshatra</div>
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

function DashaStat({ label, value, accent }) {
  return (
    <div className={`rounded-xl border p-3 ${accent ? 'border-saffron-500/40 bg-saffron-500/10' : 'border-white/10 bg-white/5'}`}>
      <div className="text-xs text-slate-400">{label}</div>
      <div className={`text-base font-medium mt-0.5 ${accent ? 'text-saffron-400' : 'text-slate-100'}`}>{value}</div>
    </div>
  )
}
