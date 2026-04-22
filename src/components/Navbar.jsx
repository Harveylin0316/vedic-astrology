import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
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
    <header className="relative z-20 border-b border-gold-500/20 bg-ink-950/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        {/* LOGO：ॐ 金色印章 + 古羅馬字 brand */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <span
            className="relative flex h-11 w-11 items-center justify-center border border-gold-300
                       bg-ink-950 text-gold-300 text-xl font-serif transition
                       group-hover:bg-gold-300 group-hover:text-ink-950"
            aria-hidden="true"
          >
            ॐ
          </span>
          <div className="leading-tight">
            <div className="font-display text-[15px] uppercase tracking-[0.3em] text-gold-200">
              {t('nav.brandTitle')}
            </div>
            <div className="font-display text-[9px] uppercase tracking-[0.45em] text-gold-500 mt-0.5">
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
                `px-4 py-2 font-display text-[11px] uppercase tracking-[0.3em] transition ${
                  isActive
                    ? 'text-gold-300 border-b border-gold-300'
                    : 'text-parchment-200/75 hover:text-gold-200 border-b border-transparent'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}

          <button
            type="button"
            onClick={toggleLang}
            className="ml-3 border border-gold-500/30 px-2.5 py-1.5 font-display text-[10px]
                       uppercase tracking-[0.3em] text-gold-400 hover:text-gold-200
                       hover:border-gold-400 transition"
            aria-label="Switch language"
          >
            {lang === 'zh-TW' ? 'EN' : '中'}
          </button>

          <Link to="/birth-chart" className="btn-primary ml-3 py-2 px-4 text-[11px]">
            {t('nav.startReading')}
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-gold-300 hover:text-gold-200"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-gold-500/20 bg-ink-950/95">
          <div className="flex flex-col p-4 gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 font-display text-xs uppercase tracking-[0.3em] ${
                    isActive
                      ? 'text-gold-300 border-l-2 border-gold-300 bg-gold-500/5'
                      : 'text-parchment-200/80'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => { toggleLang(); setOpen(false) }}
              className="mt-2 border border-gold-500/30 px-4 py-2.5 font-display text-xs
                         uppercase tracking-[0.3em] text-gold-300"
            >
              {lang === 'zh-TW' ? 'English' : '中文'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
