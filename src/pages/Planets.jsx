import { useState } from 'react'
import { planets } from '../data/planets.js'

export default function Planets() {
  const [selected, setSelected] = useState(planets[0])

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="relative mb-16 pt-10 pb-10 overflow-hidden">
        <div
          className="giant-numeral absolute left-[-30px] md:left-[-50px] top-[-10%] z-0"
          aria-hidden="true"
        >
          V
        </div>
        <div
          className="sanskrit-decoration absolute right-[-40px] bottom-[-10%] z-0 hidden md:block"
          aria-hidden="true"
        >
          ग्रह
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="font-caps text-[10px] md:text-xs uppercase tracking-[0.5em] text-gold-500 mb-6">
            Vol.&nbsp;V &nbsp;·&nbsp; Navagraha
          </div>
          <h1
            className="font-serif leading-[0.95] text-parchment-50 tracking-tight mb-8"
            style={{
              fontSize: 'clamp(44px, 8vw, 128px)',
              fontWeight: 600,
              fontVariationSettings: '"opsz" 144, "wght" 600, "SOFT" 30'
            }}
          >
            九大行星
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6 text-gold-400/60">
            <span className="h-px w-20 bg-gold-500/40" />
            <span className="font-serif text-lg">✦</span>
            <span className="h-px w-20 bg-gold-500/40" />
          </div>
          <p className="epigraph max-w-xl mx-auto">
            吠陀占星的 9 個天體：七曜加上月亮南北交點 Rahu 與 Ketu，是命盤的主要能量來源。
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Planet selector */}
        <div className="glass-panel p-3 h-fit">
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-1.5">
            {planets.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                  selected.id === p.id
                    ? 'bg-white/10 border border-saffron-500/40'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold"
                  style={{
                    background: `${p.color}22`,
                    color: p.color,
                    border: `1px solid ${p.color}55`
                  }}
                >
                  {p.symbol}
                </span>
                <div className="hidden lg:block">
                  <div className="text-sm font-medium text-slate-200">{p.chinese}</div>
                  <div className="text-xs text-slate-500">{p.name}</div>
                </div>
                <div className="block lg:hidden text-sm">{p.chinese}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Planet detail */}
        <div className="glass-panel p-8">
          <div className="flex items-start gap-5 mb-6">
            <div
              className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl text-4xl font-bold shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${selected.color}55, ${selected.color}22)`,
                color: selected.color,
                boxShadow: `0 10px 30px -5px ${selected.color}40`
              }}
            >
              {selected.symbol}
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-slate-500">
                {selected.english}
              </div>
              <h2 className="font-serif text-4xl gradient-text">{selected.name}</h2>
              <div className="text-lg text-slate-300 mt-1">{selected.chinese}</div>
              <div className="text-sm text-saffron-400 mt-1.5">{selected.meaning}</div>
            </div>
          </div>

          <p className="text-slate-300 leading-relaxed mb-6 border-l-2 border-saffron-500/50 pl-4">
            {selected.description}
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            <Stat label="本性" value={selected.nature} />
            <Stat label="主管日" value={selected.day} />
            <Stat label="對應金屬" value={selected.metal} />
            <Stat label="對應寶石" value={selected.gem} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-slate-200 font-medium">{value}</div>
    </div>
  )
}
