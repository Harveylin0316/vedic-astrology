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
  ScrollText
} from 'lucide-react'
import { computeVedicChart, formatDegrees } from '../utils/vedicCalc.js'
import ChartWheel from '../components/ChartWheel.jsx'
import {
  lagnaReadings,
  sunReadings,
  moonReadings,
  nakshatraReadings,
  getElementBalance,
  getRemedyForRashi,
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

const elementIcon = {
  fire: Flame,
  earth: Mountain,
  air: Wind,
  water: Droplets
}

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
        year,
        month,
        day,
        hour,
        minute,
        tzOffset: parseFloat(form.tz),
        lat: parseFloat(form.lat),
        lon: parseFloat(form.lon)
      })
      setChart(result)
      setSubmittedCity(form.city)
      setSubmittedStamp(`${form.date} ${form.time}`)
    } catch (err) {
      setError('計算失敗：請檢查輸入格式。')
      console.error(err)
    }
  }

  const lagnaReading = chart ? lagnaReadings[chart.ascendant.rashi.name] : null
  const sunReading = chart ? sunReadings[chart.sun.rashi.name] : null
  const moonReading = chart ? moonReadings[chart.moon.rashi.name] : null
  const nakshatraReading = chart
    ? nakshatraReadings[normalizeNakshatraName(chart.moon.nakshatra.name)]
    : null
  const elementBalance = chart
    ? getElementBalance({
        sunRashi: chart.sun.rashi.name,
        moonRashi: chart.moon.rashi.name,
        lagnaRashi: chart.ascendant.rashi.name
      })
    : null
  const remedy = chart ? getRemedyForRashi(chart.moon.rashi.name) : null

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="section-title">吠陀命盤 Kundali</h1>
        <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm">
          以 Lahiri ayanamsha 計算 sidereal 恆星黃道上的太陽、月亮、Lagna 上升點，並給出完整解讀。
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
        {/* Form */}
        <form
          onSubmit={handleCompute}
          className="glass-panel p-6 space-y-5 h-fit lg:sticky lg:top-6"
        >
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-300 mb-2">
              <Calendar className="h-4 w-4 text-saffron-400" />
              出生日期
            </label>
            <input
              type="date"
              required
              className="input-field"
              value={form.date}
              onChange={(e) => update('date', e.target.value)}
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-300 mb-2">
              <Clock className="h-4 w-4 text-saffron-400" />
              出生時間（24h 當地時間）
            </label>
            <input
              type="time"
              required
              className="input-field"
              value={form.time}
              onChange={(e) => update('time', e.target.value)}
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-300 mb-2">
              <Globe className="h-4 w-4 text-saffron-400" />
              時區（UTC 偏移，例如 +8）
            </label>
            <input
              type="number"
              step="0.5"
              required
              className="input-field"
              value={form.tz}
              onChange={(e) => update('tz', e.target.value)}
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-300 mb-2">
              <MapPin className="h-4 w-4 text-saffron-400" />
              出生城市（顯示用）
            </label>
            <input
              type="text"
              className="input-field"
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">緯度（°N）</label>
              <input
                type="number"
                step="0.01"
                required
                className="input-field"
                value={form.lat}
                onChange={(e) => update('lat', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-2 block">經度（°E）</label>
              <input
                type="number"
                step="0.01"
                required
                className="input-field"
                value={form.lon}
                onChange={(e) => update('lon', e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-vermilion-500 bg-vermilion-500/10 border border-vermilion-500/30 rounded-lg p-3">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}

          <button type="submit" className="btn-primary w-full">
            <Sparkles className="h-4 w-4" />
            計算命盤與解讀
          </button>

          <p className="text-xs text-slate-500 leading-relaxed">
            註：採用簡化演算法，作為教學與自我探索之用。如需高精度命盤，請諮詢專業 Jyotishi。
          </p>
        </form>

        {/* Result */}
        <div className="space-y-6">
          {!chart ? (
            <div className="glass-panel p-12 text-center text-slate-500">
              <Sparkles className="h-10 w-10 mx-auto text-saffron-400/40 mb-3" />
              <div>填入資料後，你的命盤與解讀將顯示於此。</div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="glass-panel p-6">
                <div className="text-xs uppercase tracking-widest text-slate-400 mb-1">
                  Your Kundali
                </div>
                <h2 className="font-serif text-2xl">
                  {submittedCity} · {submittedStamp}
                </h2>
                <div className="text-sm text-slate-400 mt-1">
                  Ayanamsha (Lahiri) {chart.ayanamsha.toFixed(4)}°
                </div>
              </div>

              {/* Chart + Badges */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-panel p-6">
                  <ChartWheel chart={chart} />
                </div>

                <div className="space-y-4">
                  <PlanetBadge
                    icon={<ArrowUpRight className="h-5 w-5" />}
                    label="上升 Lagna"
                    rashi={chart.ascendant.rashi}
                    degree={chart.ascendant.degreeInSign}
                  />
                  <PlanetBadge
                    icon={<Sun className="h-5 w-5" />}
                    label="太陽 Surya"
                    rashi={chart.sun.rashi}
                    degree={chart.sun.degreeInSign}
                    nakshatra={chart.sun.nakshatra}
                  />
                  <PlanetBadge
                    icon={<Moon className="h-5 w-5" />}
                    label="月亮 Chandra"
                    rashi={chart.moon.rashi}
                    degree={chart.moon.degreeInSign}
                    nakshatra={chart.moon.nakshatra}
                    highlight
                  />
                </div>
              </div>

              {/* Readings */}
              <ReadingCard
                icon={<ArrowUpRight className="h-5 w-5" />}
                badge={`上升 · ${chart.ascendant.rashi.chinese}`}
                title={lagnaReading?.headline}
                body={lagnaReading?.body}
                strengths={lagnaReading?.strengths}
                challenges={lagnaReading?.challenges}
              />

              <ReadingCard
                icon={<Sun className="h-5 w-5" />}
                badge={`太陽 · ${chart.sun.rashi.chinese}`}
                title={sunReading?.theme}
                body={sunReading?.body}
              />

              <ReadingCard
                icon={<Moon className="h-5 w-5" />}
                badge={`月亮 · ${chart.moon.rashi.chinese}`}
                title={moonReading?.theme}
                body={moonReading?.body}
                highlight
              />

              {nakshatraReading && (
                <ReadingCard
                  icon={<Sparkles className="h-5 w-5" />}
                  badge={`月宿 · ${chart.moon.nakshatra.name}・Pada ${chart.moon.nakshatra.pada}`}
                  title={nakshatraReading.theme}
                  body={nakshatraReading.body}
                />
              )}

              {/* Element balance */}
              {elementBalance && (
                <div className="glass-panel p-6">
                  <div className="flex items-center gap-2 text-sm text-saffron-400 mb-3">
                    <ScrollText className="h-4 w-4" />
                    元素平衡
                  </div>
                  <div className="grid grid-cols-4 gap-3 mb-5">
                    {['fire', 'earth', 'air', 'water'].map((el) => {
                      const Icon = elementIcon[el]
                      const count = elementBalance.counts[el]
                      const isDominant = elementBalance.dominant === el
                      return (
                        <div
                          key={el}
                          className={`rounded-xl border p-3 text-center ${
                            isDominant
                              ? 'border-saffron-500/40 bg-saffron-500/10'
                              : count === 0
                              ? 'border-white/5 bg-white/[0.02] opacity-50'
                              : 'border-white/10 bg-white/5'
                          }`}
                        >
                          <Icon className="h-5 w-5 mx-auto text-saffron-400" />
                          <div className="text-xs text-slate-400 mt-1.5">
                            {{ fire: '火', earth: '土', air: '風', water: '水' }[el]}
                          </div>
                          <div className="font-serif text-lg">{count}</div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="space-y-2 text-sm leading-relaxed">
                    <div>
                      <span className="text-saffron-400 font-medium">
                        主導元素：{elementBalance.dominantInfo.name}
                      </span>
                      <span className="text-slate-400">（{elementBalance.dominantInfo.nature}）</span>
                    </div>
                    <p className="text-slate-300">{elementBalance.dominantInfo.advice}</p>
                    {elementBalance.missing.length > 0 && (
                      <p className="text-slate-400 text-xs pt-2 border-t border-white/5">
                        缺失元素：
                        {elementBalance.missingInfo.map((m) => m.name).join('、')}
                        ——適合刻意補足。
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Remedy */}
              {remedy && (
                <div className="glass-panel p-6">
                  <div className="flex items-center gap-2 text-sm text-saffron-400 mb-3">
                    <Gem className="h-4 w-4" />
                    能量建議（基於你的月亮守護星 {remedy.ruler}）
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Remedy label="對應寶石" value={remedy.gem} />
                    <Remedy label="主管金屬" value={remedy.metal} />
                    <Remedy label="主管日" value={remedy.day} />
                    <Remedy label="建議曼陀羅" value={remedy.mantra} />
                  </div>
                  <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                    專注方向：{remedy.focus}。
                    吠陀傳統建議在主管日進行冥想、穿戴寶石或持誦曼陀羅，以平衡該行星能量。
                  </p>
                </div>
              )}

              {/* Houses */}
              <div className="glass-panel p-6">
                <h3 className="font-serif text-xl mb-4">12 宮位 · Bhavas</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {chart.houses.map((h) => (
                    <div
                      key={h.house}
                      className="rounded-xl border border-white/10 bg-white/5 p-3"
                    >
                      <div className="text-xs text-slate-400">第 {h.house} 宮</div>
                      <div className="font-serif text-lg">
                        {h.rashi.symbol} {h.rashi.chinese}
                      </div>
                      <div className="text-xs text-slate-500">{h.rashi.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function PlanetBadge({ icon, label, rashi, degree, nakshatra, highlight }) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight
          ? 'border-saffron-500/40 bg-saffron-500/5'
          : 'border-white/10 bg-white/5'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300 text-sm">
          <span className="text-saffron-400">{icon}</span>
          {label}
        </div>
        <div className="text-2xl">{rashi.symbol}</div>
      </div>
      <div className="mt-3 font-serif text-xl">
        {rashi.chinese} · {rashi.name}
      </div>
      <div className="text-sm text-slate-400 mt-1">
        {formatDegrees(degree)} · 守護: {rashi.rulerChinese}
      </div>
      {nakshatra && (
        <div className="mt-3 pt-3 border-t border-white/10 text-sm">
          <div className="text-xs text-slate-400">Nakshatra</div>
          <div className="font-medium text-saffron-400">
            {nakshatra.name} · Pada {nakshatra.pada}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">{nakshatra.trait}</div>
        </div>
      )}
    </div>
  )
}

function ReadingCard({ icon, badge, title, body, strengths, challenges, highlight }) {
  if (!title && !body) return null
  return (
    <div
      className={`glass-panel p-6 ${
        highlight ? 'border-saffron-500/40 bg-saffron-500/5' : ''
      }`}
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-saffron-400 mb-2">
        {icon}
        {badge}
      </div>
      <h3 className="font-serif text-2xl gradient-text">{title}</h3>
      <p className="mt-3 text-slate-300 leading-relaxed">{body}</p>
      {(strengths?.length || challenges?.length) && (
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          {strengths?.length > 0 && (
            <div className="rounded-xl border border-saffron-500/20 bg-saffron-500/5 p-3">
              <div className="text-xs text-saffron-400 mb-1.5">優勢</div>
              <div className="flex flex-wrap gap-1.5">
                {strengths.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-xs"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          {challenges?.length > 0 && (
            <div className="rounded-xl border border-vermilion-500/20 bg-vermilion-500/5 p-3">
              <div className="text-xs text-vermilion-500 mb-1.5">課題</div>
              <div className="flex flex-wrap gap-1.5">
                {challenges.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-xs"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Remedy({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-0.5 text-slate-200 text-sm font-medium">{value}</div>
    </div>
  )
}
