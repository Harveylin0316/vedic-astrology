import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider.jsx'
import { useScrollReveal } from '../hooks/useScrollReveal.js'

export default function Home() {
  const { t } = useI18n()

  const conceptsRef = useScrollReveal()
  const moreRef = useScrollReveal()

  return (
    <div className="relative overflow-hidden">
      {/* ══════════════════════════════════════════════════════════════
          HERO · Vol. I — 雜誌封面級
          佔 100vh、單欄極大字、左貼邊巨型羅馬數字、底部 wax seal
          ══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] md:min-h-screen flex flex-col justify-between px-6 md:px-12 lg:px-20 pt-8 md:pt-12 pb-16 bg-paisley">
        {/* 左貼邊巨型羅馬數字「I」— 佔一半螢幕高 */}
        <div
          className="giant-numeral absolute left-[-30px] md:left-[-50px] top-[8%] z-0"
          aria-hidden="true"
        >
          I
        </div>

        {/* Devanagari 浮動裝飾字 — 右側 */}
        <div
          className="sanskrit-decoration absolute right-[-30px] md:right-[-60px] bottom-[12%] z-0"
          aria-hidden="true"
          style={{ transform: 'rotate(90deg)', transformOrigin: 'bottom right' }}
        >
          ज्योतिष
        </div>

        {/* 頁眉 */}
        <div className="relative z-10 flex items-start justify-between pb-16 md:pb-24">
          <div className="flex flex-col gap-1.5">
            <span className="font-caps text-[10px] uppercase tracking-[0.5em] text-gold-500">
              Vol.&nbsp;I
            </span>
            <span className="font-serif italic text-xs md:text-sm text-gold-400/70">
              Horoscopus&nbsp;Vedicus
            </span>
          </div>
          <div className="font-caps text-[10px] uppercase tracking-[0.5em] text-gold-500 text-right">
            MMXXVI<br />
            <span className="text-gold-500/50">No.&nbsp;01</span>
          </div>
        </div>

        {/* 中央內容：極大字單欄 */}
        <div className="relative z-10 max-w-6xl mx-auto w-full text-center">
          <div className="font-caps text-[10px] md:text-xs uppercase tracking-[0.5em] text-gold-500/80 mb-10 md:mb-16">
            {t('home.hero.tagline')}
          </div>

          <h1 className="magazine-hero-title mb-8 md:mb-12 text-balance px-2">
            {t('home.hero.title1')}
            <br />
            <em>{t('home.hero.title2')}</em>
          </h1>

          {/* Ornament */}
          <div className="flex items-center justify-center gap-4 my-8 md:my-12 text-gold-400/50">
            <span className="h-px w-20 md:w-32 bg-gold-500/40" />
            <span className="font-serif text-xl">✦</span>
            <span className="h-px w-20 md:w-32 bg-gold-500/40" />
          </div>

          {/* 說明 */}
          <p className="epigraph max-w-xl mx-auto mb-12">
            {t('home.hero.description')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <Link to="/birth-chart" className="btn-primary flex-1">
              {t('home.hero.cta.chart')}
            </Link>
            <Link to="/compatibility" className="btn-sindoor flex-1">
              {t('home.hero.cta.compat')}
            </Link>
          </div>
        </div>

        {/* 底部：蠟封 + 註腳 */}
        <div className="relative z-10 flex items-end justify-between gap-6">
          <p className="font-caps text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-gold-500/60 max-w-xs">
            {t('home.hero.note')}
          </p>
          <div className="wax-seal shadow-2xl">
            <span style={{ fontSize: '36px' }}>ॐ</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CHAPTER I · Introductio — 羊皮紙翻白，drop cap
          ══════════════════════════════════════════════════════════════ */}
      <section
        ref={conceptsRef}
        className="relative reveal section-page bg-parchment-100 text-ink-950 py-20 md:py-32 overflow-hidden"
      >
        {/* 左貼邊巨型 II */}
        <div
          className="giant-numeral absolute left-[-40px] md:left-[-60px] top-[6%] z-0"
          style={{ color: 'rgba(10, 8, 6, 0.08)' }}
          aria-hidden="true"
        >
          II
        </div>

        <div className="relative z-10 max-w-5xl mx-auto w-full">
          {/* Chapter label */}
          <div className="font-caps text-[10px] md:text-xs uppercase tracking-[0.5em] text-ink-700 mb-6">
            Chapter II · Introductio
          </div>

          {/* Devanagari 小標 */}
          <div className="font-devanagari text-3xl md:text-5xl text-sindoor-600 mb-6 opacity-80">
            ज्ञान
          </div>

          {/* 大標 */}
          <h2
            className="font-serif leading-[0.95] text-ink-950 mb-10 md:mb-14 tracking-tight"
            style={{ fontSize: 'clamp(48px, 8vw, 120px)', fontWeight: 600, fontVariationSettings: '"opsz" 144, "wght" 600' }}
          >
            {t('home.concepts.title')}
          </h2>

          {/* 分隔線 */}
          <div className="flex items-center gap-5 mb-12 md:mb-16 text-ink-700/60">
            <span className="h-px w-24 bg-ink-700/30" />
            <span className="font-serif text-lg">✦</span>
            <span className="h-px flex-1 bg-ink-700/15" />
          </div>

          <div className="grid gap-12 md:gap-20 md:grid-cols-12 items-start">
            {/* 左欄 7 — drop cap */}
            <p
              className="md:col-span-7 font-body leading-[2] text-ink-900 drop-cap text-balance"
              style={{ fontSize: 'clamp(17px, 1.35vw, 21px)' }}
            >
              {t('home.concepts.body1')}
            </p>

            {/* 右欄 5 — 小字註記 */}
            <aside className="md:col-span-5 md:pt-4 space-y-6 font-body text-ink-800 text-[15px] md:text-[16px] leading-[1.9]">
              <div className="border-l-2 border-sindoor-500/40 pl-5">
                <p className="italic">{t('home.concepts.prose1')}</p>
              </div>
              <div className="border-l-2 border-gold-500/40 pl-5">
                <p>{t('home.concepts.prose2')}</p>
              </div>
              <div className="pt-4 font-caps text-[9px] uppercase tracking-[0.4em] text-ink-700/60">
                Bṛhat Parāśara Horā Śāstra
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          結尾：Index & Colophon
          ══════════════════════════════════════════════════════════════ */}
      <section
        ref={moreRef}
        className="relative reveal py-24 md:py-32 px-6 bg-paisley"
      >
        <div className="max-w-5xl mx-auto text-center">
          <div className="font-caps text-[10px] md:text-xs uppercase tracking-[0.5em] text-gold-500/80 mb-8">
            {t('home.more.label')}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 mb-12">
            <Link
              to="/nakshatras"
              className="group font-serif text-3xl md:text-5xl text-gold-200 italic
                         border-b border-transparent hover:border-gold-300 transition pb-2
                         tracking-tight"
              style={{ fontVariationSettings: '"opsz" 48, "wght" 400' }}
            >
              {t('home.more.nakshatras')}
            </Link>
            <span className="font-serif text-gold-500/40 text-xl">✦</span>
            <Link
              to="/planets"
              className="group font-serif text-3xl md:text-5xl text-gold-200 italic
                         border-b border-transparent hover:border-gold-300 transition pb-2
                         tracking-tight"
              style={{ fontVariationSettings: '"opsz" 48, "wght" 400' }}
            >
              {t('home.more.planets')}
            </Link>
          </div>

          <div className="flex items-center justify-center gap-4 text-gold-500/40">
            <span className="h-px w-16 bg-gold-500/30" />
            <span className="font-serif text-sm">✦</span>
            <span className="h-px w-16 bg-gold-500/30" />
          </div>

          <div className="mt-8 font-caps text-[9px] uppercase tracking-[0.5em] text-gold-600/60">
            Finis · End of Volume
          </div>
        </div>
      </section>
    </div>
  )
}
