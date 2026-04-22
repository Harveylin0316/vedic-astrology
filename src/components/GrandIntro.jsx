import { useEffect, useState } from 'react'

const KEY = 'vedic:intro-seen:v1'
const DURATION = 2400

/**
 * 首次進站的開場序列：
 *   0 - 400ms   : 黑底淡入
 *   400 - 1400  : 曼陀羅浮現 + 慢轉
 *   1000 - 1600 : "VEDIC ASTROLOGY" Cinzel 大寫逐字現
 *   1600 - 2000 : 拉丁 tagline 浮現
 *   2000 - 2400 : curtain 往上拉開（simultaneously），揭開主站
 */
export default function GrandIntro() {
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase] = useState(0) // 0=hidden, 1=mandala, 2=title, 3=tagline, 4=exit, 5=done

  useEffect(() => {
    if (typeof window === 'undefined') return
    // 已看過 → skip
    if (sessionStorage.getItem(KEY) === '1') {
      setPhase(5)
      return
    }
    setMounted(true)
    const t1 = setTimeout(() => setPhase(1), 100)
    const t2 = setTimeout(() => setPhase(2), 900)
    const t3 = setTimeout(() => setPhase(3), 1500)
    const t4 = setTimeout(() => setPhase(4), 1900)
    const t5 = setTimeout(() => {
      setPhase(5)
      sessionStorage.setItem(KEY, '1')
    }, DURATION)
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout)
  }, [])

  const skip = () => {
    setPhase(5)
    sessionStorage.setItem(KEY, '1')
  }

  if (phase >= 5) return null
  if (!mounted) return null

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden transition-transform duration-[600ms] ease-[cubic-bezier(.76,0,.24,1)] ${
        phase === 4 ? '-translate-y-full' : 'translate-y-0'
      }`}
      style={{
        background:
          'radial-gradient(ellipse at center, #1a1410 0%, #0a0806 70%)'
      }}
      onClick={skip}
    >
      {/* 曼陀羅 SVG */}
      <div
        className={`transition-all duration-[1400ms] ease-out ${
          phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        <svg
          viewBox="0 0 400 400"
          width="320"
          height="320"
          style={{
            animation: phase >= 1 ? 'mandalaSpin 18s linear infinite' : 'none'
          }}
        >
          <defs>
            <radialGradient id="introGold" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#e8d9b0" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#c9a961" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#8b6a35" stopOpacity="0.1" />
            </radialGradient>
          </defs>
          {/* 三層圓 */}
          <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(201,169,97,0.5)" strokeWidth="0.6" />
          <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(201,169,97,0.35)" strokeWidth="0.5" strokeDasharray="2 4" />
          <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(201,169,97,0.6)" strokeWidth="0.7" />
          <circle cx="200" cy="200" r="60" fill="none" stroke="rgba(201,169,97,0.8)" strokeWidth="1" />

          {/* 12 花瓣 */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = i * 30
            return (
              <path
                key={i}
                d="M 200 100 Q 215 140 200 180 Q 185 140 200 100 Z"
                fill="none"
                stroke="rgba(201,169,97,0.45)"
                strokeWidth="0.8"
                transform={`rotate(${angle} 200 200)`}
              />
            )
          })}

          {/* 外層尖角三角（Sri Yantra 風） */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = i * 45
            return (
              <polygon
                key={i}
                points="200,40 215,75 185,75"
                fill="none"
                stroke="rgba(201,169,97,0.3)"
                strokeWidth="0.5"
                transform={`rotate(${angle} 200 200)`}
              />
            )
          })}

          {/* 中心發光 */}
          <circle cx="200" cy="200" r="40" fill="url(#introGold)" />
          <text
            x="200"
            y="215"
            textAnchor="middle"
            fill="#c9a961"
            fontSize="40"
            fontFamily="'Noto Serif Devanagari', serif"
            style={{ fontVariantEmoji: 'text' }}
          >
            ॐ
          </text>
        </svg>
      </div>

      {/* 品牌名逐字現 */}
      <div
        className={`mt-12 font-caps text-gold-200 transition-opacity duration-700 ${
          phase >= 2 ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          fontSize: 'clamp(18px, 2.5vw, 28px)',
          letterSpacing: '0.5em'
        }}
      >
        VEDIC&nbsp;ASTROLOGY
      </div>

      {/* 拉丁 tagline */}
      <div
        className={`mt-4 font-serif italic text-gold-400/70 transition-opacity duration-700 ${
          phase >= 3 ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ fontSize: 'clamp(12px, 1.2vw, 15px)' }}
      >
        Speculum Naturae · 3000 Anni
      </div>

      {/* 底部 skip */}
      <button
        onClick={(e) => { e.stopPropagation(); skip() }}
        className="absolute bottom-10 right-10 font-caps text-[10px] uppercase tracking-[0.4em] text-gold-500/60 hover:text-gold-300 transition"
      >
        Skip →
      </button>
    </div>
  )
}
