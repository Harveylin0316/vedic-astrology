import { useState } from 'react'
import { Search, Moon } from 'lucide-react'
import { nakshatras } from '../data/nakshatras.js'

export default function Nakshatras() {
  const [q, setQ] = useState('')
  const filtered = nakshatras.filter(
    (n) =>
      n.name.toLowerCase().includes(q.toLowerCase()) ||
      n.chinese.includes(q) ||
      n.deity.toLowerCase().includes(q.toLowerCase()) ||
      n.ruler.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="relative mb-16 pt-10 pb-10 overflow-hidden">
        <div
          className="giant-numeral absolute left-[-30px] md:left-[-50px] top-[-10%] z-0"
          aria-hidden="true"
        >
          IV
        </div>
        <div
          className="sanskrit-decoration absolute right-[-40px] bottom-[-10%] z-0 hidden md:block"
          aria-hidden="true"
        >
          नक्षत्र
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="font-caps text-[10px] md:text-xs uppercase tracking-[0.5em] text-gold-500 mb-6">
            Vol.&nbsp;IV &nbsp;·&nbsp; Stellae Lunares
          </div>
          <h1
            className="font-serif leading-[0.95] text-parchment-50 tracking-tight mb-8"
            style={{
              fontSize: 'clamp(44px, 8vw, 128px)',
              fontWeight: 600,
              fontVariationSettings: '"opsz" 144, "wght" 600, "SOFT" 30'
            }}
          >
            27 Nakshatra 月宿
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6 text-gold-400/60">
            <span className="h-px w-20 bg-gold-500/40" />
            <span className="font-serif text-lg">✦</span>
            <span className="h-px w-20 bg-gold-500/40" />
          </div>
          <p className="epigraph max-w-xl mx-auto">
            月亮行經的 27 個精細星宿，每個橫跨 13°20'，揭示心智與情感的深層特質。
          </p>
        </div>
      </div>

      <div className="glass-panel p-4 mb-8 flex items-center gap-3">
        <Search className="h-5 w-5 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="搜尋 Nakshatra（名稱、守護神、行星）..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder:text-slate-500 py-1"
        />
        <div className="text-xs text-slate-500 pr-2">{filtered.length} / 27</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((n) => (
          <div
            key={n.id}
            className="glass-panel p-5 hover:border-saffron-500/40 hover:bg-white/10 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-slate-500">Nakshatra {n.id}</div>
                <h3 className="font-serif text-xl gradient-text">{n.name}</h3>
                <div className="text-sm text-slate-400">{n.chinese}</div>
              </div>
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-saffron-500/20 to-vermilion-500/20 border border-saffron-500/30">
                <Moon className="h-5 w-5 text-saffron-400" />
              </div>
            </div>
            <div className="mt-4 space-y-1.5 text-sm">
              <Row label="守護神" value={n.deity} />
              <Row label="行星" value={n.ruler} />
              <Row label="象徵" value={n.symbol} />
              <Row label="特質" value={n.trait} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-200 text-right">{value}</span>
    </div>
  )
}
