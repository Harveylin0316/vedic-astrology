import { useI18n } from '../i18n/I18nProvider.jsx'

export default function Footer() {
  const { t } = useI18n()
  return (
    <footer className="relative z-10 border-t border-gold-500/20 bg-ink-950/60 mt-20">
      {/* 裝飾線 ── ✦ ── */}
      <div className="ornament-rule max-w-7xl mx-auto px-6 pt-10 pb-0 my-0">
        <span className="font-serif text-gold-400/70 text-sm">✦</span>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-10 pb-12 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center border border-gold-400 text-gold-300 font-serif text-lg">
              ॐ
            </span>
            <div className="font-display uppercase tracking-[0.3em] text-gold-200 text-sm">
              {t('nav.brandTitle')}
            </div>
          </div>
          <p className="mt-5 font-body text-[15px] leading-[1.9] text-parchment-200/70 max-w-sm">
            {t('footer.tagline')}
          </p>
        </div>

        <div className="font-body text-[14px] text-parchment-200/70 space-y-2">
          <div className="chapter-eyebrow mb-3">{t('footer.keyConcepts')}</div>
          <div>{t('footer.concept1')}</div>
          <div>{t('footer.concept2')}</div>
          <div>{t('footer.concept3')}</div>
          <div>{t('footer.concept4')}</div>
        </div>

        <div className="font-body text-[14px] text-parchment-200/70">
          <div className="chapter-eyebrow mb-3">{t('footer.disclaimer.title')}</div>
          <p className="leading-[1.8]">
            {t('footer.disclaimer.body')}
          </p>
        </div>
      </div>

      <div className="border-t border-gold-500/10 py-5 text-center">
        <span className="font-display text-[10px] uppercase tracking-[0.4em] text-gold-500/70">
          {t('footer.builtWith')} · Jyotish Shastra · MMXXVI
        </span>
      </div>
    </footer>
  )
}
