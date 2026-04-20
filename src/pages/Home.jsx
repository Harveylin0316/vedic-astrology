import { Link } from 'react-router-dom'
import { Sparkles, Compass, Moon, Orbit, Gem, ArrowRight, Star } from 'lucide-react'

const features = [
  {
    icon: Compass,
    title: '排吠陀命盤',
    desc: '以 Lahiri ayanamsha 計算 sidereal 上升星座、太陽與月亮位置。',
    to: '/birth-chart'
  },
  {
    icon: Gem,
    title: '個人解讀',
    desc: '根據你的 Lagna、太陽、月亮與 Nakshatra，給出詳細的性格與能量解讀。',
    to: '/birth-chart'
  },
  {
    icon: Moon,
    title: '27 Nakshatra',
    desc: '深入月宿系統，查詢你的出生星宿、守護神與 Pada 四分位。',
    to: '/nakshatras'
  },
  {
    icon: Orbit,
    title: '九大行星 Navagraha',
    desc: '從 Surya 到 Ketu，理解 9 個 Graha 的本質、吉凶與象徵意義。',
    to: '/planets'
  }
]

const concepts = [
  { name: 'Jyotish', label: '光的科學', desc: '吠陀占星的原文「光明之學」' },
  { name: 'Kundali', label: '命盤', desc: '以出生時空為座標的星象圖' },
  { name: 'Dasha', label: '行運週期', desc: 'Vimshottari 120 年業力節奏' },
  { name: 'Karma', label: '業力', desc: '行動與因果的循環法則' }
]

export default function Home() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-saffron-500/30 bg-saffron-500/10 px-3 py-1 text-xs font-medium text-saffron-400">
              <Sparkles className="h-3.5 w-3.5" />
              Jyotish · 光明之學
            </div>
            <h1 className="text-4xl md:text-6xl font-serif leading-tight text-balance">
              聆聽星辰的低語，
              <br />
              <span className="gradient-text">解讀你靈魂的藍圖</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
              吠陀占星（Jyotish Shastra）是印度古老的星象系統，以 sidereal
              zodiac、27 Nakshatra 與九大 Graha 揭示靈魂的因果軌跡。
              透過這套工具，在數千年智慧中尋回你自己的星光。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/birth-chart" className="btn-primary">
                開始排命盤
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/nakshatras" className="btn-ghost">
                <Sparkles className="h-4 w-4" />
                探索 Nakshatra
              </Link>
            </div>
          </div>

          {/* Mandala visual */}
          <div className="relative flex justify-center items-center">
            <div className="relative h-80 w-80 md:h-96 md:w-96">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-saffron-500/20 via-vermilion-500/10 to-transparent blur-2xl" />
              <div className="absolute inset-0 animate-spin-slow">
                <svg viewBox="0 0 400 400" className="h-full w-full">
                  <defs>
                    <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffc266" />
                      <stop offset="100%" stopColor="#e68a00" />
                    </radialGradient>
                  </defs>
                  {/* Outer zodiac ring */}
                  <circle
                    cx="200"
                    cy="200"
                    r="180"
                    fill="none"
                    stroke="rgba(255,194,102,0.3)"
                    strokeWidth="1"
                  />
                  <circle
                    cx="200"
                    cy="200"
                    r="150"
                    fill="none"
                    stroke="rgba(255,194,102,0.4)"
                    strokeWidth="1"
                  />
                  <circle
                    cx="200"
                    cy="200"
                    r="110"
                    fill="none"
                    stroke="rgba(255,194,102,0.5)"
                    strokeWidth="1"
                  />
                  {/* 12 divisions */}
                  {Array.from({ length: 12 }, (_, i) => {
                    const a = (i * 30 - 90) * (Math.PI / 180)
                    const x1 = 200 + Math.cos(a) * 110
                    const y1 = 200 + Math.sin(a) * 110
                    const x2 = 200 + Math.cos(a) * 180
                    const y2 = 200 + Math.sin(a) * 180
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="rgba(255,194,102,0.4)"
                        strokeWidth="1"
                      />
                    )
                  })}
                  {/* Zodiac symbols */}
                  {['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].map((sym, i) => {
                    const a = (i * 30 - 75) * (Math.PI / 180)
                    const x = 200 + Math.cos(a) * 165
                    const y = 200 + Math.sin(a) * 165
                    return (
                      <text
                        key={i}
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#ffc266"
                        fontSize="16"
                      >
                        {sym}
                      </text>
                    )
                  })}
                  {/* Inner mandala */}
                  <circle cx="200" cy="200" r="55" fill="url(#sunGrad)" opacity="0.9" />
                  <circle cx="200" cy="200" r="42" fill="#140b2e" />
                  <text
                    x="200"
                    y="200"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#ffc266"
                    fontSize="32"
                    fontFamily="serif"
                  >
                    ॐ
                  </text>
                </svg>
              </div>
              {/* Floating stars */}
              {Array.from({ length: 6 }).map((_, i) => (
                <Star
                  key={i}
                  className="absolute h-3 w-3 text-saffron-400 animate-twinkle"
                  style={{
                    top: `${15 + Math.random() * 70}%`,
                    left: `${10 + Math.random() * 80}%`,
                    animationDelay: `${i * 0.5}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="section-title">開啟你的星象之旅</h2>
          <p className="mt-3 text-slate-400 max-w-2xl mx-auto">
            四個核心功能，由古老吠陀智慧編織而成。
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className="glass-panel group p-6 hover:border-saffron-500/40 hover:bg-white/10 transition"
            >
              <f.icon className="h-8 w-8 text-saffron-400 group-hover:scale-110 transition-transform" />
              <h3 className="mt-4 text-xl font-serif">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm text-saffron-400 opacity-0 group-hover:opacity-100 transition">
                進入 <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Concepts */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="glass-panel p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h2 className="section-title">什麼是吠陀占星？</h2>
              <p className="mt-4 text-slate-300 leading-relaxed">
                源於印度吠陀經典的 <strong className="text-saffron-400">Jyotish</strong>，
                字面意為「光明之學」。它使用 <strong>sidereal 恆星黃道</strong>（而非西方的
                tropical 回歸黃道），並以月亮為中心來理解心智與情感。
              </p>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                吠陀占星關注靈魂的業力軌跡、Dasha
                行運週期、以及 27 Nakshatra 月宿的細膩性格描繪，是世上最精密、最靈性的占星系統之一。
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {concepts.map((c) => (
                <div
                  key={c.name}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
                >
                  <div className="font-serif text-lg text-saffron-400">{c.name}</div>
                  <div className="text-xs text-slate-300 font-medium">{c.label}</div>
                  <div className="text-xs text-slate-500 mt-1">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="section-title">讓星辰為你指路</h2>
        <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
          只需填入出生日期、時間與地點，立刻獲得你的吠陀命盤與完整解讀。
        </p>
        <div className="mt-8">
          <Link to="/birth-chart" className="btn-primary">
            免費排命盤
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
