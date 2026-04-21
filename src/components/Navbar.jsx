import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Sun, Menu, X, Sparkles } from 'lucide-react'

const links = [
  { to: '/birth-chart', label: '命盤與解讀' },
  { to: '/compatibility', label: '雙人合盤' },
  { to: '/nakshatras', label: 'Nakshatra' },
  { to: '/planets', label: '九大行星' }
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="relative z-20 border-b border-white/10 bg-cosmic-950/60 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-saffron-400 to-vermilion-500 shadow-lg shadow-saffron-500/30 group-hover:shadow-saffron-500/50 transition">
            <Sun className="h-5 w-5 text-cosmic-950" strokeWidth={2.5} />
          </span>
          <div className="leading-tight">
            <div className="font-serif text-xl font-semibold gradient-text">吠陀占星</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
              Vedic Astrology
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
          <Link to="/birth-chart" className="btn-primary ml-3 py-2 px-4 text-sm">
            <Sparkles className="h-4 w-4" />
            開始解讀
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
          </div>
        </div>
      )}
    </header>
  )
}
