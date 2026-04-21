import { useState } from 'react'
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  UserRound,
  Sparkles,
  AlertCircle,
  Sparkle,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Flame,
  Swords
} from 'lucide-react'
import { computeVedicChart } from '../utils/vedicCalc.js'
import { computeCompatibility, getKutaStatus } from '../utils/compatibilityEngine.js'
import { buildCompatibilityNarrative, CATEGORY_META } from '../data/compatibilityReadings.js'
import { cities, findCity } from '../data/cities.js'
import MysticalTransition from '../components/MysticalTransition.jsx'
import CompatibilityShareCard from '../components/CompatibilityShareCard.jsx'
import ShareCardSection from '../components/ShareCardSection.jsx'

const emptyPerson = () => ({
  name: '',
  gender: '',
  date: '',
  time: '',
  city: '',
  lat: '25.0478',
  lon: '121.5319',
  tz: '8'
})

export default function Compatibility() {
  const [you, setYou] = useState(emptyPerson())
  const [them, setThem] = useState(emptyPerson())
  const [relationship, setRelationship] = useState('romantic')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(null)
  const [result, setResult] = useState(null)
  const [showTransition, setShowTransition] = useState(false)

  const updateYou = (k, v) => setYou((p) => ({ ...p, [k]: v }))
  const updateThem = (k, v) => setThem((p) => ({ ...p, [k]: v }))

  const handleCityChangeFor = (setter) => (value) => {
    const matched = findCity(value)
    if (matched) {
      setter((p) => ({
        ...p,
        city: matched.name,
        lat: String(matched.lat),
        lon: String(matched.lon),
        tz: String(matched.tz)
      }))
    } else {
      setter((p) => ({ ...p, city: value }))
    }
  }

  const computeChartFor = (person) => {
    const [year, month, day] = person.date.split('-').map(Number)
    const [hour, minute] = person.time.split(':').map(Number)
    return computeVedicChart({
      year,
      month,
      day,
      hour,
      minute,
      tzOffset: parseFloat(person.tz),
      lat: parseFloat(person.lat),
      lon: parseFloat(person.lon)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!you.date || !you.time || !them.date || !them.time) {
      setError('兩邊都要填出生日期與時間')
      return
    }
    try {
      const chartA = computeChartFor(you)
      const chartB = computeChartFor(them)
      const compat = computeCompatibility(chartA, chartB)
      const nameA = (you.name || '').trim() || '你'
      const nameB = (them.name || '').trim() || 'TA'
      const narrative = buildCompatibilityNarrative(compat, chartA, chartB, nameA, nameB)
      setPending({ compat, narrative, you: { ...you }, them: { ...them } })
      setShowTransition(true)
    } catch (err) {
      console.error(err)
      setError('計算失敗，請檢查格式。')
    }
  }

  const handleTransitionComplete = () => {
    setResult(pending)
    setShowTransition(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {showTransition && (
        <MysticalTransition onComplete={handleTransitionComplete} duration={1500} />
      )}

      <div className="text-center mb-10">
        <h1 className="section-title">雙人合盤 · 你們的業力契合度</h1>
        <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm">
          用吠陀傳統 Ashta Kuta 8 因子 36 分制，看你跟 TA 天生合不合 — 附接地氣的關係解析。
        </p>
      </div>

      {!result ? (
        <form onSubmit={handleSubmit}>
          {/* 關係類型 */}
          <div className="glass-panel p-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-slate-300">關係類型：</span>
              {[
                { v: 'romantic', label: '💕 戀人 / 伴侶' },
                { v: 'family', label: '👨‍👩‍👧 家人' },
                { v: 'friend', label: '🤝 朋友 / 合夥人' }
              ].map((opt) => (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => setRelationship(opt.v)}
                  className={`rounded-full px-4 py-1.5 text-sm border transition ${
                    relationship === opt.v
                      ? 'border-saffron-500 bg-saffron-500/15 text-saffron-400'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <PersonForm
              person={you}
              update={updateYou}
              onCityChange={handleCityChangeFor(setYou)}
              title="你"
              accent="saffron"
            />
            <PersonForm
              person={them}
              update={updateThem}
              onCityChange={handleCityChangeFor(setThem)}
              title="TA"
              accent="vermilion"
            />
          </div>

          {error && (
            <div className="mt-6 flex items-start gap-2 text-sm text-vermilion-500 bg-vermilion-500/10 border border-vermilion-500/30 rounded-lg p-3">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full mt-8 text-lg py-4">
            <Sparkles className="h-5 w-5" />
            算我們的合盤
          </button>

          <p className="text-center text-xs text-slate-500 mt-3">
            請放心輸入，不收集任何個資
          </p>
        </form>
      ) : (
        <CompatibilityResult
          result={result}
          relationship={relationship}
          onReset={() => {
            setResult(null)
            setPending(null)
          }}
        />
      )}
    </div>
  )
}

// ════════════════════════════════════════
// 單人表單
// ════════════════════════════════════════
function PersonForm({ person, update, onCityChange, title, accent }) {
  const accentClasses =
    accent === 'saffron'
      ? 'border-saffron-500/40 bg-saffron-500/5'
      : 'border-vermilion-500/40 bg-vermilion-500/5'
  const accentText = accent === 'saffron' ? 'text-saffron-400' : 'text-vermilion-500'

  return (
    <div className={`glass-panel p-5 ${accentClasses}`}>
      <div className={`text-xs uppercase tracking-widest mb-3 ${accentText}`}>
        {title} 的生辰
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-slate-300 mb-1.5 block">暱稱（選填）</label>
          <input
            type="text"
            value={person.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder={title === '你' ? '例：小明' : '例：小美'}
            className="input-field"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-slate-300 mb-1.5">
            <UserRound className="h-4 w-4" />
            性別（選填）
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
                className={`rounded-xl border px-2 py-2 text-sm transition ${
                  person.gender === opt.v
                    ? `border-${accent === 'saffron' ? 'saffron' : 'vermilion'}-500 bg-white/5`
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-slate-300 mb-1.5">
            <Calendar className="h-4 w-4" />
            出生日期
          </label>
          <input
            type="date"
            required
            value={person.date}
            onChange={(e) => update('date', e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-slate-300 mb-1.5">
            <Clock className="h-4 w-4" />
            出生時間
          </label>
          <input
            type="time"
            required
            value={person.time}
            onChange={(e) => update('time', e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-slate-300 mb-1.5">
            <MapPin className="h-4 w-4" />
            出生城市
          </label>
          <input
            type="text"
            list={`${title}-cities`}
            value={person.city}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="台北、高雄、Tokyo..."
            className="input-field"
          />
          <datalist id={`${title}-cities`}>
            {cities.map((c) => (
              <option key={c.name} value={c.name}>
                {c.display}
              </option>
            ))}
          </datalist>
          {findCity(person.city) && (
            <div className="mt-1 text-[11px] text-emerald-400">
              ✓ 已自動填入座標（時區 UTC{person.tz >= 0 ? '+' : ''}
              {person.tz}）
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════
// 結果呈現
// ════════════════════════════════════════
function CompatibilityResult({ result, relationship, onReset }) {
  const { compat, narrative, you, them } = result
  const meta = CATEGORY_META[compat.category] || CATEGORY_META['互補型配對']

  const youName = you.name || '你'
  const themName = them.name || 'TA'

  return (
    <div className="space-y-6">
      {/* 總分 Hero */}
      <div className="glass-panel p-8 text-center bg-gradient-to-br from-saffron-500/10 to-vermilion-500/10 border-saffron-500/40">
        <div className="text-6xl mb-3">{meta.icon}</div>
        <div className="text-xs uppercase tracking-widest text-slate-400 mb-1">
          {youName} × {themName}
        </div>
        <h2 className="font-serif text-4xl md:text-5xl gradient-text mb-3">
          {compat.category}
        </h2>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-5xl md:text-6xl font-serif gradient-text">
            {compat.totalScore}
          </div>
          <div className="text-slate-400 text-lg">/ {compat.maxScore}</div>
          <div className="text-sm text-saffron-400">
            ({compat.percent}%)
          </div>
        </div>
        <p className="text-slate-300 leading-relaxed max-w-lg mx-auto">
          {compat.tagline}
        </p>
      </div>

      {/* 分享卡（IG / 朋友圈 / LINE 下載） */}
      <ShareCardSection
        filename={`${youName}-x-${themName}-合盤.png`}
        title="下載這張卡片分享給 TA"
      >
        <CompatibilityShareCard
          result={result}
          youName={youName}
          themName={themName}
        />
      </ShareCardSection>

      {/* 3 段敘事 */}
      <div className="grid md:grid-cols-3 gap-4">
        <NarrativeCard
          icon={<Sparkle className="h-5 w-5" />}
          title="為什麼吸引彼此"
          body={narrative.attract}
          color="saffron"
        />
        <NarrativeCard
          icon={<Swords className="h-5 w-5" />}
          title="會吵什麼 · 死穴"
          body={narrative.fight}
          color="vermilion"
        />
        <NarrativeCard
          icon={<Heart className="h-5 w-5" />}
          title="如何走得長久"
          body={narrative.last}
          color="emerald"
        />
      </div>

      {/* 8 Kutas 細項 */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-saffron-400 mb-3">
          <Flame className="h-4 w-4" />
          Ashta Kuta · 8 因子 36 分制
        </div>
        <h3 className="font-serif text-2xl gradient-text mb-4">合盤分項拆解</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {compat.kutas.map((k) => {
            const status = getKutaStatus(k.score, k.max)
            const colors = {
              excellent: 'border-emerald-500/40 bg-emerald-500/5',
              good: 'border-saffron-500/30 bg-saffron-500/5',
              ok: 'border-white/10 bg-white/5',
              poor: 'border-vermilion-500/30 bg-vermilion-500/5'
            }
            const dotColors = {
              excellent: 'bg-emerald-400',
              good: 'bg-saffron-400',
              ok: 'bg-slate-500',
              poor: 'bg-vermilion-500'
            }
            return (
              <div
                key={k.id}
                className={`rounded-xl border p-3 ${colors[status]}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-200">{k.label}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{k.meaning}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-cosmic-950 font-semibold ${dotColors[status]}`}>
                      {k.score}/{k.max}
                    </div>
                  </div>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${dotColors[status]}`}
                    style={{ width: `${(k.score / k.max) * 100}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 額外警示 / 亮點（Dosha or Strength） */}
      {narrative.extras && narrative.extras.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {narrative.extras.map((ex, i) => (
            <div
              key={i}
              className={`glass-panel p-5 ${
                ex.type === 'dosha'
                  ? 'border-vermilion-500/30 bg-vermilion-500/5'
                  : 'border-emerald-500/30 bg-emerald-500/5'
              }`}
            >
              <div
                className={`flex items-center gap-2 text-sm mb-2 font-medium ${
                  ex.type === 'dosha' ? 'text-vermilion-500' : 'text-emerald-400'
                }`}
              >
                {ex.type === 'dosha' ? (
                  <ShieldAlert className="h-4 w-4" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                {ex.title}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{ex.body}</p>
            </div>
          ))}
        </div>
      )}

      {/* 兩人的月亮資訊對照 */}
      <div className="glass-panel p-6">
        <div className="text-xs uppercase tracking-widest text-saffron-400 mb-3">
          兩人月亮位置對照
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <MoonSummary person={youName} moon={compat.moonA} color="saffron" />
          <MoonSummary person={themName} moon={compat.moonB} color="vermilion" />
        </div>
      </div>

      {/* CTA */}
      <div className="glass-panel p-6 text-center">
        <p className="text-slate-300 mb-4">想看其他人的合盤？</p>
        <button onClick={onReset} className="btn-primary">
          <ArrowRight className="h-4 w-4" />
          再算一組
        </button>
      </div>
    </div>
  )
}

function NarrativeCard({ icon, title, body, color }) {
  const colorMap = {
    saffron: 'border-saffron-500/30 bg-saffron-500/5 text-saffron-400',
    vermilion: 'border-vermilion-500/30 bg-vermilion-500/5 text-vermilion-500',
    emerald: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400'
  }
  const cls = colorMap[color]
  return (
    <div className={`glass-panel p-5 ${cls.split(' ').slice(0, 2).join(' ')}`}>
      <div className={`flex items-center gap-2 text-sm font-medium mb-3 ${cls.split(' ')[2]}`}>
        {icon}
        {title}
      </div>
      <p className="text-sm text-slate-200 leading-relaxed">{body}</p>
    </div>
  )
}

function MoonSummary({ person, moon, color }) {
  const accent = color === 'saffron' ? 'text-saffron-400' : 'text-vermilion-500'
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className={`text-sm font-medium mb-2 ${accent}`}>{person}</div>
      <div className="space-y-1 text-sm">
        <div>
          <span className="text-slate-400">Rashi：</span>
          <span className="text-slate-100">{moon.rashi}</span>
        </div>
        <div>
          <span className="text-slate-400">Nakshatra：</span>
          <span className="text-slate-100">
            {moon.nakshatra.name} Pada {moon.nakshatra.pada}
          </span>
        </div>
        <div>
          <span className="text-slate-400">主星：</span>
          <span className="text-slate-100">{moon.lord}</span>
        </div>
      </div>
    </div>
  )
}
