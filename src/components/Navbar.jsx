import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Sun, Menu, X, Sparkles, Globe } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider.jsx'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { lang, setLang, t } = useI18n()

  const links = [
    { to: '/birth-chart', label: t('nav.birthChart') },
    { to: '/compatibility', label: t('nav.compatibility') },
    { to: '/nakshatras', label: t('nav.nakshatras') },
    { to: '/planets', label: t('nav.planets') }
  ]

  const toggleLang = () => setLang(lang === 'zh-TW' ? 'en' : 'zh-TW')

  return (
    <header className="relative z-20 border-b border-white/10 bg-cosmic-950/60 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-saffron-400 to-vermilion-500 shadow-lg shadow-saffron-500/30 group-hover:shadow-saffron-500/50 transition">
            <Sun className="h-5 w-5 text-cosmic-950" strokeWidth={2.5} />
          </span>
          <div className="leading-tight">
            <div className="font-serif text-xl font-semibold gradient-text">{t('nav.brandTitle')}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
              {t('nav.brandSubtitle')}
            </div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-white/10 text-saffron-400'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}

          {/* 語言切換 */}
          <button
            type="button"
            onClick={toggleLang}
            className="ml-2 flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/5 transition"
            aria-label="Switch language"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === 'zh-TW' ? 'EN' : '中文'}
          </button>

          <Link to="/birth-chart" className="btn-primary ml-2 py-2 px-4 text-sm">
            <Sparkles className="h-4 w-4" />
            {t('nav.startReading')}
          </Link>
        </div>

        <button
          className="md:hidden rounded-lg p-2 text-slate-300 hover:bg-white/5"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-cosmic-950/80">
          <div className="flex flex-col p-4 gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2.5 text-sm font-medium ${
                    isActive
                      ? 'bg-white/10 text-saffron-400'
                      : 'text-slate-300 hover:bg-white/5'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => { toggleLang(); setOpen(false) }}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300"
            >
              <Globe className="h-4 w-4" />
              {lang === 'zh-TW' ? 'English' : '中文'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
