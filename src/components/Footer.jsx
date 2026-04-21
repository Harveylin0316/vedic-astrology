import { Sparkles, Heart } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider.jsx'

export default function Footer() {
  const { t } = useI18n()
  return (
    <footer className="relative z-10 border-t border-white/10 bg-cosmic-950/60 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-10 grid gap-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 gradient-text font-serif text-xl">
            <Sparkles className="h-5 w-5 text-saffron-400" />
            {t('nav.brandTitle')}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-400 max-w-sm">
            {t('footer.tagline')}
          </p>
        </div>
        <div className="text-sm text-slate-400 space-y-1.5">
          <div className="font-semibold text-slate-200 mb-2">{t('footer.keyConcepts')}</div>
          <div>{t('footer.concept1')}</div>
          <div>{t('footer.concept2')}</div>
          <div>{t('footer.concept3')}</div>
          <div>{t('footer.concept4')}</div>
        </div>
        <div className="text-sm text-slate-400 space-y-1.5">
          <div className="font-semibold text-slate-200 mb-2">{t('footer.disclaimer.title')}</div>
          <p className="leading-relaxed">
            {t('footer.disclaimer.body')}
          </p>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          {t('footer.builtWith')} <Heart className="h-3 w-3 text-vermilion-500" /> · Jyotish Shastra · 2026
        </span>
      </div>
    </footer>
  )
}
