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
      <div className="text-center mb-10">
        <h1 className="section-title">27 Nakshatra 月宿</h1>
        <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm">
          月亮行經的 27 個精細星宿，每個橫跨 13°20'，揭示心智與情感的深層特質。
        </p>
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
