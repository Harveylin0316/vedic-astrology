import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider.jsx'

export default function Home() {
  const { t } = useI18n()

  return (
    <div className="relative">
      {/* ─── HERO：命書開卷 ─── */}
      <section className="relative mx-auto max-w-6xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        {/* 左上古籍標章 */}
        <div className="absolute left-6 top-16 hidden md:flex flex-col items-start gap-2">
          <span className="font-display text-[10px] uppercase tracking-[0.5em] text-gold-500">
            Vol.&nbsp;I
          </span>
          <span className="font-serif italic text-xs text-gold-400/70">
            Horoscopus Vedicus
          </span>
        </div>
        {/* 右上頁碼 */}
        <div className="absolute right-6 top-16 hidden md:block font-display text-[10px] uppercase tracking-[0.5em] text-gold-500">
          MMXXVI · No. 01
        </div>

        <div className="grid items-center gap-12 md:grid-cols-12 mt-10 md:mt-16">
          {/* 標題欄 — 佔 7 欄 */}
          <div className="md:col-span-7 space-y-8">
            {/* Eyebrow */}
            <div className="chapter-eyebrow">{t('home.hero.tagline')}</div>

            {/* 巨大標題 */}
            <h1 className="font-serif text-[56px] leading-[1.03] md:text-[104px] md:leading-[0.98] text-parchment-50 tracking-tight">
              {t('home.hero.title1')}
              <br />
              <span className="italic text-gold-300">{t('home.hero.title2')}</span>
            </h1>

            {/* Ornament */}
            <div className="flex items-center gap-3 text-gold-400/60">
              <span className="h-px w-16 bg-gold-500/40" />
              <span className="font-serif text-lg">✦</span>
              <span className="h-px w-16 bg-gold-500/40" />
            </div>

            {/* 說明段 */}
            <p className="font-body text-[17px] md:text-[19px] leading-[1.85] text-parchment-200/85 max-w-xl">
              {t('home.hero.description')}
            </p>

            {/* CTAs：印章按鈕 */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl pt-2">
              <Link to="/birth-chart" className="btn-primary flex-1">
                {t('home.hero.cta.chart')}
              </Link>
              <Link to="/compatibility" className="btn-sindoor flex-1">
                {t('home.hero.cta.compat')}
              </Link>
            </div>

            <p className="font-display text-[10px] uppercase tracking-[0.35em] text-gold-500/70">
              {t('home.hero.note')}
            </p>
          </div>

          {/* Mandala 視覺 — 佔 5 欄 */}
          <div className="md:col-span-5 relative flex justify-center items-center">
            <div className="relative h-80 w-80 md:h-[420px] md:w-[420px]">
              {/* 極淡金色光暈 */}
              <div className="absolute inset-0 rounded-full bg-gradient-radial from-gold-500/10 via-transparent to-transparent blur-2xl" />

              {/* 慢轉黃道 */}
              <div className="absolute inset-0 animate-spin-slow">
                <svg viewBox="0 0 400 400" className="h-full w-full">
                  <defs>
                    <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#e8d9b0" />
                      <stop offset="100%" stopColor="#8b6a35" />
                    </radialGradient>
                  </defs>
                  {/* 外環 */}
                  <circle cx="200" cy="200" r="186" fill="none" stroke="rgba(201,169,97,0.45)" strokeWidth="0.7" />
                  <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(201,169,97,0.22)" strokeWidth="0.5" />
                  <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(201,169,97,0.35)" strokeWidth="0.5" />
                  <circle cx="200" cy="200" r="110" fill="none" stroke="rgba(201,169,97,0.45)" strokeWidth="0.5" />
                  <circle cx="200" cy="200" r="64" fill="none" stroke="rgba(201,169,97,0.55)" strokeWidth="0.7" />

                  {/* 12 宮分隔線 */}
                  {Array.from({ length: 12 }, (_, i) => {
                    const a = (i * 30 - 90) * (Math.PI / 180)
                    const x1 = 200 + Math.cos(a) * 110
                    const y1 = 200 + Math.sin(a) * 110
                    const x2 = 200 + Math.cos(a) * 180
                    const y2 = 200 + Math.sin(a) * 180
                    return (
                      <line
                        key={i}
                        x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke="rgba(201,169,97,0.35)" strokeWidth="0.6"
                      />
                    )
                  })}

                  {/* 黃道 12 符號 */}
                  {['\u2648','\u2649','\u264A','\u264B','\u264C','\u264D','\u264E','\u264F','\u2650','\u2651','\u2652','\u2653'].map((sym, i) => {
                    const a = (i * 30 - 75) * (Math.PI / 180)
                    const x = 200 + Math.cos(a) * 165
                    const y = 200 + Math.sin(a) * 165
                    return (
                      <text
                        key={i}
                        x={x} y={y}
                        textAnchor="middle" dominantBaseline="middle"
                        fill="#c9a961"
                        fontSize="17"
                        fontFamily="'EB Garamond', 'Noto Sans Symbols 2', serif"
                        style={{ fontVariantEmoji: 'text' }}
                      >
                        {sym}{'\uFE0E'}
                      </text>
                    )
                  })}

                  {/* 中央光源 */}
                  <circle cx="200" cy="200" r="55" fill="url(#sunGrad)" opacity="0.85" />
                  <circle cx="200" cy="200" r="42" fill="#0a0806" />
                  <text
                    x="200" y="210"
                    textAnchor="middle"
                    fill="#d9bf85"
                    fontSize="36"
                    fontFamily="EB Garamond, serif"
                  >
                    ॐ
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ornament rule */}
      <div className="ornament-rule max-w-4xl mx-auto">
        <span className="font-serif text-gold-400 text-lg">✦</span>
      </div>

      {/* ─── 吠陀概念章 — 古籍印刷風，翻白處理 ─── */}
      <section className="manuscript-parchment my-20">
        <div className="mx-auto max-w-5xl px-6 md:px-10 py-10">
          <div className="text-center mb-8">
            <div className="font-display text-[10px] uppercase tracking-[0.45em] text-gold-700 mb-3">
              Chapter I · Introductio
            </div>
            <h2 className="font-serif text-4xl md:text-6xl text-ink-950 tracking-tight">
              {t('home.concepts.title')}
            </h2>
          </div>

          <div className="flex items-center justify-center gap-3 text-ink-700 mb-10">
            <span className="h-px w-16 bg-ink-700/40" />
            <span className="font-serif text-lg">✦</span>
            <span className="h-px w-16 bg-ink-700/40" />
          </div>

          <div className="grid gap-10 md:grid-cols-2 items-start">
            <p className="font-body text-[17px] md:text-[18px] leading-[2] text-ink-900 drop-cap">
              {t('home.concepts.body1')}
            </p>
            <div className="font-body text-[16px] md:text-[17px] leading-[2] text-ink-800 space-y-5">
              <p>{t('home.concepts.prose1')}</p>
              <p className="italic">{t('home.concepts.prose2')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 次要連結 — 書末目錄感 ─── */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="text-center">
          <div className="font-display text-[10px] uppercase tracking-[0.4em] text-gold-500/80 mb-5">
            {t('home.more.label')}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            <Link
              to="/nakshatras"
              className="font-serif italic text-[17px] text-parchment-200/80
                         border-b border-transparent hover:border-gold-400 hover:text-gold-200 transition"
            >
              {t('home.more.nakshatras')}
            </Link>
            <span className="text-gold-500/40">·</span>
            <Link
              to="/planets"
              className="font-serif italic text-[17px] text-parchment-200/80
                         border-b border-transparent hover:border-gold-400 hover:text-gold-200 transition"
            >
              {t('home.more.planets')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
