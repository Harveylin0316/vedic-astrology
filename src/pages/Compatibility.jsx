import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
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
  ShieldQuestion,
  ArrowRight,
  Flame,
  Swords,
  Link2,
  Check,
  Share2,
  Mail
} from 'lucide-react'
import { computeVedicChart } from '../utils/vedicCalc.js'
import { computeCompatibility, getKutaStatus } from '../utils/compatibilityEngine.js'
import { buildCompatibilityNarrative } from '../data/compatibilityReadings.js'
// cities / findCity 由 SmartCityInput 內部處理，不需 import
import MysticalTransition from '../components/MysticalTransition.jsx'
import CompatibilityShareCard from '../components/CompatibilityShareCard.jsx'
import ShareCardSection from '../components/ShareCardSection.jsx'
import { trackEvent } from '../components/Analytics.jsx'
import {
  encodeCompatPayload,
  decodeCompatPayload,
  encodeBirthPayload,
  decodeBirthPayload,
  replaceUrlParam,
  copyToClipboard
} from '../utils/permalink.js'
import SmartDateInput from '../components/SmartDateInput.jsx'
import SmartTimeInput from '../components/SmartTimeInput.jsx'
import SmartCityInput from '../components/SmartCityInput.jsx'
import { useI18n } from '../i18n/I18nProvider.jsx'

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
  const { t, lang } = useI18n()
  const [searchParams] = useSearchParams()
  const [you, setYou] = useState(emptyPerson())
  const [them, setThem] = useState(emptyPerson())
  const [relationship, setRelationship] = useState('romantic')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(null)
  const [result, setResult] = useState(null)
  const [showTransition, setShowTransition] = useState(false)
  const [inviteMode, setInviteMode] = useState(false)
  const [inviterName, setInviterName] = useState('')

  // 從 URL 參數還原（永久連結 or 邀請模式）
  useEffect(() => {
    // 邀請模式：?invite=<encoded-inviter>&from=<name>&rel=<relationship>
    const inviteEncoded = searchParams.get('invite')
    if (inviteEncoded) {
      const inviterData = decodeBirthPayload(inviteEncoded)
      if (inviterData) {
        setYou(inviterData)
        const fromName = (searchParams.get('from') || '').trim() || (inviterData.name || '').trim() || '對方'
        setInviterName(fromName)
        const rel = searchParams.get('rel')
        if (rel === 'romantic' || rel === 'family' || rel === 'friend') setRelationship(rel)
        setInviteMode(true)
        trackEvent('compatibility_invite_landing', { from: fromName, rel: rel || 'romantic' })
        return
      }
    }

    const encoded = searchParams.get('d')
    if (!encoded) return
    const payload = decodeCompatPayload(encoded)
    if (!payload) return

    setYou(payload.you)
    setThem(payload.them)
    setRelationship(payload.relationship)

    // 直接計算 + 顯示（跳過過場，因為是朋友點進來看結果的）
    try {
      const [yY, yM, yD] = payload.you.date.split('-').map(Number)
      const [yH, yMin] = payload.you.time.split(':').map(Number)
      const [tY, tM, tD] = payload.them.date.split('-').map(Number)
      const [tH, tMin] = payload.them.time.split(':').map(Number)
      const chartA = computeVedicChart({
        year: yY, month: yM, day: yD, hour: yH, minute: yMin,
        tzOffset: parseFloat(payload.you.tz),
        lat: parseFloat(payload.you.lat),
        lon: parseFloat(payload.you.lon)
      })
      const chartB = computeVedicChart({
        year: tY, month: tM, day: tD, hour: tH, minute: tMin,
        tzOffset: parseFloat(payload.them.tz),
        lat: parseFloat(payload.them.lat),
        lon: parseFloat(payload.them.lon)
      })
      const compat = computeCompatibility(chartA, chartB)
      const nameA = (payload.you.name || '').trim() || '你'
      const nameB = (payload.them.name || '').trim() || 'TA'
      const narrative = buildCompatibilityNarrative(compat, chartA, chartB, nameA, nameB)
      setResult({ compat, narrative, you: payload.you, them: payload.them })
      trackEvent('compatibility_permalink_view', {
        relationship: payload.relationship,
        category: compat.category,
        score: compat.totalScore
      })
    } catch (err) {
      console.error(err)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateYou = (k, v) => setYou((p) => ({ ...p, [k]: v }))
  const updateThem = (k, v) => setThem((p) => ({ ...p, [k]: v }))


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
      setError(t('form.error.both'))
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
      // 把兩人生辰編進 URL（永久連結）
      const payload = encodeCompatPayload({ you, them, relationship })
      replaceUrlParam('d', payload)
      trackEvent('compute_compatibility', {
        relationship,
        category: compat.category,
        score: compat.totalScore
      })
    } catch (err) {
      console.error(err)
      setError(t('form.error.generic'))
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

      <div className="relative mb-20 pt-10 pb-14 overflow-hidden">
        {/* 左貼邊巨型羅馬數字 VIII（Compatibility 在 Vol. VIII） */}
        <div
          className="giant-numeral absolute left-[-30px] md:left-[-50px] top-[-10%] z-0"
          aria-hidden="true"
        >
          III
        </div>
        {/* Devanagari 浮動裝飾 */}
        <div
          className="sanskrit-decoration absolute right-[-40px] bottom-[-10%] z-0"
          aria-hidden="true"
        >
          प्रेम
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="font-caps text-[10px] md:text-xs uppercase tracking-[0.5em] text-gold-500 mb-6">
            Vol.&nbsp;III &nbsp;·&nbsp; Karmikae Congruentia
          </div>
          <h1
            className="font-serif leading-[0.95] text-parchment-50 tracking-tight mb-8"
            style={{
              fontSize: 'clamp(48px, 9vw, 144px)',
              fontWeight: 600,
              fontVariationSettings: '"opsz" 144, "wght" 600, "SOFT" 30'
            }}
          >
            {t('compat.pageTitle')}
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6 text-gold-400/60">
            <span className="h-px w-20 bg-gold-500/40" />
            <span className="font-serif text-lg">✦</span>
            <span className="h-px w-20 bg-gold-500/40" />
          </div>
          <p className="epigraph max-w-xl mx-auto">
            {t('compat.pageSubtitle')}
          </p>
        </div>
      </div>

      {!result ? (
        <form onSubmit={handleSubmit}>
          {/* 邀請模式 Banner */}
          {inviteMode && (
            <div className="glass-panel p-5 mb-6 bg-gradient-to-br from-saffron-500/10 to-vermilion-500/10 border-saffron-500/50">
              <div className="flex items-start gap-3">
                <Mail className="h-7 w-7 text-saffron-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-serif text-xl md:text-2xl gradient-text leading-tight">
                    {inviterName} 想跟你算合盤
                  </div>
                  <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
                    TA 已經填好自己的生日 — <strong className="text-saffron-400">你只要填你的，30 秒就有結果</strong>。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 關係類型 */}
          <div className="glass-panel p-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-slate-300">{t('compat.relationship')}：</span>
              {[
                { v: 'romantic', label: t('compat.relationship.romantic') },
                { v: 'family', label: t('compat.relationship.family') },
                { v: 'friend', label: t('compat.relationship.friend') }
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
            {inviteMode ? (
              <InvitedSummaryCard inviterName={inviterName} you={you} />
            ) : (
              <PersonForm
                person={you}
                update={updateYou}
                setPerson={setYou}
                title={t('compat.person.you')}
                accent="saffron"
                t={t}
                lang={lang}
              />
            )}
            <PersonForm
              person={them}
              update={updateThem}
              setPerson={setThem}
              title={inviteMode ? '你的生辰' : t('compat.person.them')}
              accent="vermilion"
              t={t}
              lang={lang}
            />
          </div>

          {/* 裂變鉤子：生成給 TA 的邀請連結（非邀請模式才顯示） */}
          {!inviteMode && (
            <InviteLinkButton you={you} relationship={relationship} t={t} />
          )}

          {error && (
            <div className="mt-6 flex items-start gap-2 text-sm text-vermilion-500 bg-vermilion-500/10 border border-vermilion-500/30 rounded-lg p-3">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full mt-8 text-lg py-4">
            <Sparkles className="h-5 w-5" />
            {t('form.submit.compatibility')}
          </button>

          <p className="text-center text-xs text-slate-500 mt-3">
            {t('form.privacy')}
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
function PersonForm({ person, update, setPerson, title, accent, t, lang }) {
  const handleSelectCity = (c) =>
    setPerson((p) => ({
      ...p,
      city: c.name,
      lat: String(c.lat),
      lon: String(c.lon),
      tz: String(c.tz)
    }))
  const handleFreeText = (txt) => setPerson((p) => ({ ...p, city: txt }))
  const accentClasses =
    accent === 'saffron'
      ? 'border-saffron-500/40 bg-saffron-500/5'
      : 'border-vermilion-500/40 bg-vermilion-500/5'
  const accentText = accent === 'saffron' ? 'text-saffron-400' : 'text-vermilion-500'
  const birthOf = lang === 'en' ? `${title}'s birth data` : `${title} 的生辰`

  return (
    <div className={`glass-panel p-5 ${accentClasses}`}>
      <div className={`text-xs uppercase tracking-widest mb-3 ${accentText}`}>
        {birthOf}
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-slate-300 mb-1.5 block">{t('form.name')}</label>
          <input
            type="text"
            value={person.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder={lang === 'en' ? (title === 'You' ? 'e.g. Alex' : 'e.g. Sam') : (title === '你' ? '例：小明' : '例：小美')}
            className="input-field"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-slate-300 mb-1.5">
            <UserRound className="h-4 w-4" />
            {t('form.gender')}
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
            {t('form.date')}
          </label>
          <SmartDateInput
            required
            value={person.date}
            onChange={(v) => update('date', v)}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-slate-300 mb-1.5">
            <Clock className="h-4 w-4" />
            {t('form.time')}
          </label>
          <SmartTimeInput
            required
            lang={lang}
            value={person.time}
            onChange={(v) => update('time', v)}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-slate-300 mb-1.5">
            <MapPin className="h-4 w-4" />
            {t('form.city')}
          </label>
          <SmartCityInput
            value={person.city}
            onSelectCity={handleSelectCity}
            onFreeText={handleFreeText}
          />
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════
// 結果呈現
// ════════════════════════════════════════
function CompatibilityResult({ result, relationship, onReset }) {
  const { t } = useI18n()
  const { compat, narrative, you, them } = result

  const youName = you.name || '你'
  const themName = them.name || 'TA'

  return (
    <div className="space-y-6">
      {/* 總分 Hero */}
      <div className="glass-panel p-8 text-center bg-gradient-to-br from-saffron-500/10 to-vermilion-500/10 border-saffron-500/40">
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
        shareTitle={`${youName} × ${themName}：${compat.category}（${compat.percent}% 吻合）`}
        shareText={`${youName} × ${themName} 吠陀合盤：${compat.category}\n${compat.tagline}\n你們的合盤也算一下？→ ${typeof window !== 'undefined' ? window.location.href : ''}`}
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

      {/* 8 Kutas 細項 — 分兩類 */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-2 text-sm text-saffron-400/80 font-serif italic mb-4">
          <Flame className="h-4 w-4" />
          <span>你們 8 個面向的對拍 / 打架</span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 天生對拍 */}
          <div>
            <h4 className="font-serif text-lg text-emerald-400 mb-3 inline-flex items-center gap-2">
              <Heart className="h-4 w-4" />
              天生對拍的地方
            </h4>
            <div className="space-y-3">
              {compat.kutas
                .filter((k) => {
                  const s = getKutaStatus(k.score, k.max)
                  return s === 'excellent' || s === 'good'
                })
                .map((k) => (
                  <div key={k.id} className="text-sm">
                    <div className="text-slate-100 font-medium">{k.label}</div>
                    <div className="text-slate-400 leading-relaxed mt-0.5">{k.meaning}</div>
                  </div>
                ))}
              {compat.kutas.filter((k) => {
                const s = getKutaStatus(k.score, k.max)
                return s === 'excellent' || s === 'good'
              }).length === 0 && (
                <p className="text-sm text-slate-500 italic">沒有特別突出的對拍點 — 不是不合，只是沒有先天加分。</p>
              )}
            </div>
          </div>

          {/* 會打架 */}
          <div>
            <h4 className="font-serif text-lg text-vermilion-500 mb-3 inline-flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              容易打架的地方
            </h4>
            <div className="space-y-3">
              {compat.kutas
                .filter((k) => {
                  const s = getKutaStatus(k.score, k.max)
                  return s === 'poor' || s === 'ok'
                })
                .map((k) => (
                  <div key={k.id} className="text-sm">
                    <div className="text-slate-100 font-medium">{k.label}</div>
                    <div className="text-slate-400 leading-relaxed mt-0.5">{k.meaning}</div>
                  </div>
                ))}
              {compat.kutas.filter((k) => {
                const s = getKutaStatus(k.score, k.max)
                return s === 'poor' || s === 'ok'
              }).length === 0 && (
                <p className="text-sm text-slate-500 italic">沒有明顯的衝突點 — 你們之間基本不會因為占星面向吵架。</p>
              )}
            </div>
          </div>
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
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <CopyLinkButton />
          <button onClick={onReset} className="btn-ghost">
            <ArrowRight className="h-4 w-4" />
            {t('compat.result.rematch')}
          </button>
        </div>
      </div>
    </div>
  )
}

function CopyLinkButton() {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    const ok = await copyToClipboard(window.location.href)
    if (ok) {
      setCopied(true)
      trackEvent('copy_permalink', { page: 'compatibility' })
      setTimeout(() => setCopied(false), 2000)
    }
  }
  return (
    <button type="button" onClick={handleCopy} className="btn-primary">
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          {t('chart.copied')}
        </>
      ) : (
        <>
          <Link2 className="h-4 w-4" />
          {t('compat.result.copyLink')}
        </>
      )}
    </button>
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

// ════════════════════════════════════════
// 邀請模式：對方已填好的摘要卡（取代 PersonForm）
// ════════════════════════════════════════
function InvitedSummaryCard({ inviterName, you }) {
  return (
    <div className="glass-panel p-5 border-saffron-500/40 bg-saffron-500/5">
      <div className="text-xs uppercase tracking-widest text-saffron-400 mb-3">
        {inviterName} 的生辰（已填好）
      </div>
      <div className="flex items-center gap-3 py-4">
        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-saffron-500 to-vermilion-500 flex items-center justify-center text-2xl text-cosmic-950 font-semibold">
          {inviterName?.[0] || '?'}
        </div>
        <div>
          <div className="font-serif text-xl text-slate-100">{inviterName}</div>
          <div className="text-xs text-slate-400 mt-0.5">
            {you.date || '—'} · {you.time || '—'} · {you.city || '—'}
          </div>
        </div>
      </div>
      <div className="mt-2 rounded-lg bg-saffron-500/10 border border-saffron-500/20 px-3 py-2 text-xs text-saffron-300 leading-relaxed inline-flex items-center gap-2">
        <Check className="h-3.5 w-3.5 flex-shrink-0" />
        <span>{inviterName} 已把資料加密在連結裡 — 你不需要問 TA 任何問題。</span>
      </div>
    </div>
  )
}

// ════════════════════════════════════════
// 裂變鉤子：生成邀請連結（病毒傳播主引擎）
// ════════════════════════════════════════
function InviteLinkButton({ you, relationship, t }) {
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState('idle')

  const isReady = !!(you.date && you.time && you.city)

  const buildInviteUrl = () => {
    const encoded = encodeBirthPayload(you)
    const params = new URLSearchParams()
    params.set('invite', encoded)
    if (you.name) params.set('from', you.name)
    params.set('rel', relationship || 'romantic')
    return `${window.location.origin}/compatibility?${params.toString()}`
  }

  const inviterName = (you.name || '').trim() || '我'
  const shareText = `${inviterName} 想跟你算合盤\n30 秒填你的生日就能看結果 → `

  const handleShare = async () => {
    if (!isReady) return
    setStatus('loading')
    const url = buildInviteUrl()
    trackEvent('compatibility_invite_generated', { relationship })
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${inviterName} 想跟你算合盤`,
          text: shareText,
          url
        })
        trackEvent('compatibility_invite_shared', { method: 'native' })
        setStatus('idle')
        return
      }
      const ok = await copyToClipboard(shareText + url)
      if (ok) {
        setCopied(true)
        trackEvent('compatibility_invite_shared', { method: 'clipboard' })
        setTimeout(() => setCopied(false), 2500)
      }
      setStatus('idle')
    } catch (err) {
      if (err?.name !== 'AbortError') console.error(err)
      setStatus('idle')
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-saffron-500/30 bg-gradient-to-br from-saffron-500/10 to-vermilion-500/10 p-5">
      <div className="flex items-start gap-3">
        <Mail className="h-6 w-6 text-saffron-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="font-serif text-lg text-saffron-300 leading-tight">
            不知道 TA 的出生時間？
          </div>
          <p className="text-sm text-slate-300 mt-1 leading-relaxed">
            把<strong className="text-saffron-400">你這邊填好</strong>，生成一個<strong className="text-saffron-400">專屬邀請連結</strong>傳給 TA —
            TA 點進去只要填自己的生日，30 秒就能看結果。
          </p>
          <button
            type="button"
            onClick={handleShare}
            disabled={!isReady || status === 'loading'}
            className={`mt-3 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition ${
              isReady
                ? 'bg-gradient-to-r from-saffron-500 to-vermilion-500 text-cosmic-950 hover:shadow-lg hover:shadow-saffron-500/30'
                : 'bg-white/5 text-slate-500 cursor-not-allowed'
            }`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" /> 連結已複製，快傳給 TA
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                {isReady ? '生成給 TA 的邀請連結' : '先填完你這邊才能生成'}
              </>
            )}
          </button>
          {!isReady && (
            <p className="text-[11px] text-slate-500 mt-2">
              需要先填：生日、出生時間、城市
            </p>
          )}
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            提醒：不知道 TA 的出生時間？先用中午 12:00 估算也可以 — 太陽、月亮、稀有度都算得出，只有上升星座會是估算值。
          </p>
        </div>
      </div>
    </div>
  )
}
