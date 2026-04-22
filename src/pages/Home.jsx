import { Link } from 'react-router-dom'
import { Compass, Heart, ArrowRight, Star } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider.jsx'

export default function Home() {
  const { t } = useI18n()

  return (
    <div className="relative">
      {/* Hero — 雙主 CTA */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-saffron-500/30 bg-saffron-500/10 px-3 py-1 text-xs font-medium text-saffron-400">
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

            {/* 兩顆並列主 CTA — equal weight */}
            <div className="grid gap-3 sm:grid-cols-2 max-w-xl">
              <Link
                to="/birth-chart"
                className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-saffron-500 to-saffron-400 text-cosmic-950 px-5 py-4 font-semibold shadow-lg shadow-saffron-500/20 hover:shadow-saffron-500/40 hover:scale-[1.02] transition-all"
              >
                <Compass className="h-5 w-5" />
                <span className="whitespace-nowrap">{t('home.hero.cta.chart')}</span>
                <ArrowRight className="h-4 w-4 opacity-60 group-hover:translate-x-0.5 transition" />
              </Link>
              <Link
                to="/compatibility"
                className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-vermilion-500 to-vermilion-400 text-cosmic-950 px-5 py-4 font-semibold shadow-lg shadow-vermilion-500/20 hover:shadow-vermilion-500/40 hover:scale-[1.02] transition-all"
              >
                <Heart className="h-5 w-5" />
                <span className="whitespace-nowrap">{t('home.hero.cta.compat')}</span>
                <ArrowRight className="h-4 w-4 opacity-60 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>

            <p className="text-xs text-slate-500">{t('home.hero.note')}</p>
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

      {/* 吠陀簡介 — concepts prose only，無 feature grid */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="glass-panel p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h2 className="section-title">{t('home.concepts.title')}</h2>
              <p className="mt-4 text-slate-300 leading-relaxed">
                {t('home.concepts.body1')}
              </p>
            </div>
            <div className="text-slate-300 leading-relaxed space-y-4 text-base md:text-lg">
              <p>{t('home.concepts.prose1')}</p>
              <p>{t('home.concepts.prose2')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 次要連結 — navigation-ish footer */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-400">
          <span className="text-xs uppercase tracking-[0.25em] text-slate-500">
            {t('home.more.label')}
          </span>
          <Link to="/nakshatras" className="hover:text-saffron-400 transition">
            {t('home.more.nakshatras')}
          </Link>
          <Link to="/planets" className="hover:text-saffron-400 transition">
            {t('home.more.planets')}
          </Link>
        </div>
      </section>
    </div>
  )
}
