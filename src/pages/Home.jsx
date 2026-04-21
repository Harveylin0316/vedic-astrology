import { Link } from 'react-router-dom'
import { Sparkles, Compass, Moon, Orbit, Heart, ArrowRight, Star } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider.jsx'

export default function Home() {
  const { t } = useI18n()

  const features = [
    {
      icon: Heart,
      title: t('home.features.compatibility.title'),
      desc: t('home.features.compatibility.desc'),
      to: '/compatibility',
      highlight: true
    },
    {
      icon: Compass,
      title: t('home.features.birthChart.title'),
      desc: t('home.features.birthChart.desc'),
      to: '/birth-chart'
    },
    {
      icon: Moon,
      title: t('home.features.nakshatras.title'),
      desc: t('home.features.nakshatras.desc'),
      to: '/nakshatras'
    },
    {
      icon: Orbit,
      title: t('home.features.planets.title'),
      desc: t('home.features.planets.desc'),
      to: '/planets'
    }
  ]

  return (
    <div className="relative">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-saffron-500/30 bg-saffron-500/10 px-3 py-1 text-xs font-medium text-saffron-400">
              <Sparkles className="h-3.5 w-3.5" />
              {t('home.hero.tagline')}
            </div>
            <h1 className="text-4xl md:text-6xl font-serif leading-tight text-balance">
              {t('home.hero.title1')}
              <br />
              <span className="gradient-text">{t('home.hero.title2')}</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
              {t('home.hero.description')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/birth-chart" className="btn-primary">
                {t('home.hero.cta.chart')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/nakshatras" className="btn-ghost">
                <Sparkles className="h-4 w-4" />
                {t('home.hero.cta.nakshatra')}
              </Link>
            </div>
          </div>

          {/* Mandala visual */}
          <div className="relative flex justify-center items-center">
            <div className="relative h-80 w-80 md:h-96 md:w-96">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-saffron-500/20 via-vermilion-500/10 to-transparent blur-2xl" />
              <div className="absolute inset-0 animate-spin-slow">
                <svg viewBox="0 0 400 400" className="h-full w-full">
                  <defs>
                    <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffc266" />
                      <stop offset="100%" stopColor="#e68a00" />
                    </radialGradient>
                  </defs>
                  <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(255,194,102,0.3)" strokeWidth="1" />
                  <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,194,102,0.4)" strokeWidth="1" />
                  <circle cx="200" cy="200" r="110" fill="none" stroke="rgba(255,194,102,0.5)" strokeWidth="1" />
                  {Array.from({ length: 12 }, (_, i) => {
                    const a = (i * 30 - 90) * (Math.PI / 180)
                    const x1 = 200 + Math.cos(a) * 110
                    const y1 = 200 + Math.sin(a) * 110
                    const x2 = 200 + Math.cos(a) * 180
                    const y2 = 200 + Math.sin(a) * 180
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,194,102,0.4)" strokeWidth="1" />
                  })}
                  {['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].map((sym, i) => {
                    const a = (i * 30 - 75) * (Math.PI / 180)
                    const x = 200 + Math.cos(a) * 165
                    const y = 200 + Math.sin(a) * 165
                    return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="#ffc266" fontSize="16">{sym}</text>
                  })}
                  <circle cx="200" cy="200" r="55" fill="url(#sunGrad)" opacity="0.9" />
                  <circle cx="200" cy="200" r="42" fill="#140b2e" />
                  <text x="200" y="200" textAnchor="middle" dominantBaseline="middle" fill="#ffc266" fontSize="32" fontFamily="serif">ॐ</text>
                </svg>
              </div>
              {Array.from({ length: 6 }).map((_, i) => (
                <Star
                  key={i}
                  className="absolute h-3 w-3 text-saffron-400 animate-twinkle"
                  style={{
                    top: `${15 + Math.random() * 70}%`,
                    left: `${10 + Math.random() * 80}%`,
                    animationDelay: `${i * 0.5}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="section-title">{t('home.features.title')}</h2>
          <p className="mt-3 text-slate-400 max-w-2xl mx-auto">
            {t('home.features.subtitle')}
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className={`glass-panel group p-6 transition relative ${
                f.highlight
                  ? 'border-saffron-500/50 bg-gradient-to-br from-saffron-500/10 to-vermilion-500/10 hover:border-saffron-500 hover:shadow-lg hover:shadow-saffron-500/20'
                  : 'hover:border-saffron-500/40 hover:bg-white/10'
              }`}
            >
              {f.highlight && (
                <span className="absolute -top-2 right-4 rounded-full bg-gradient-to-r from-saffron-500 to-vermilion-500 px-2.5 py-0.5 text-[10px] font-semibold text-cosmic-950">
                  {t('home.features.new')}
                </span>
              )}
              <f.icon className={`h-8 w-8 group-hover:scale-110 transition-transform ${f.highlight ? 'text-vermilion-500' : 'text-saffron-400'}`} />
              <h3 className="mt-4 text-xl font-serif">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm text-saffron-400 opacity-0 group-hover:opacity-100 transition">
                {t('home.features.enter')} <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Concepts */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="glass-panel p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h2 className="section-title">{t('home.concepts.title')}</h2>
              <p className="mt-4 text-slate-300 leading-relaxed">
                {t('home.concepts.body1')}
              </p>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                {t('home.concepts.body2')}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Jyotish', label: t('home.hero.tagline').split('·')[1]?.trim() || 'Science of Light', desc: t('home.hero.tagline') },
                { name: 'Kundali', label: t('chart.pageTitle'), desc: 'Birth Chart' },
                { name: 'Dasha', label: t('chart.section.dasha'), desc: 'Vimshottari 120y cycle' },
                { name: 'Karma', label: 'Karma', desc: 'Cause & effect' }
              ].map((c) => (
                <div
                  key={c.name}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
                >
                  <div className="font-serif text-lg text-saffron-400">{c.name}</div>
                  <div className="text-xs text-slate-300 font-medium">{c.label}</div>
                  <div className="text-xs text-slate-500 mt-1">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="section-title">{t('home.cta.title')}</h2>
        <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
          {t('home.cta.description')}
          <br />
          <span className="text-slate-500 text-sm">{t('home.cta.privacy')}</span>
        </p>
        <div className="mt-8">
          <Link to="/birth-chart" className="btn-primary">
            {t('home.cta.button')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
