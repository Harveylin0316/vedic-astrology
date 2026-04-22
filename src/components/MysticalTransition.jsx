import { useEffect, useState, useMemo } from 'react'

const PHASES = [
  '星辰正在對齊你的命盤…',
  '翻閱你的業力卷軸…',
  '解讀即將揭曉…'
]

export default function MysticalTransition({ onComplete, duration = 1500 }) {
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  // 產生漂浮粒子（只算一次）
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        angle: (i / 40) * 360,
        delay: Math.random() * 0.3,
        distance: 100 + Math.random() * 180,
        size: 1 + Math.random() * 3
      })),
    []
  )

  useEffect(() => {
    const phase1 = setTimeout(() => setPhaseIdx(1), duration * 0.33)
    const phase2 = setTimeout(() => setPhaseIdx(2), duration * 0.66)
    const fadeOut = setTimeout(() => setVisible(false), duration - 100)
    const done = setTimeout(() => onComplete?.(), duration)
    return () => {
      clearTimeout(phase1)
      clearTimeout(phase2)
      clearTimeout(fadeOut)
      clearTimeout(done)
    }
  }, [duration, onComplete])

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(20,18,16,0.95) 0%, rgba(10,8,6,0.98) 70%)',
        backdropFilter: 'blur(20px)'
      }}
    >
      {/* 背景光暈 */}
      <div
        className="absolute inset-0 pointer-events-none animate-pulse"
        style={{
          background:
            'radial-gradient(circle at center, rgba(201,169,97,0.15) 0%, transparent 50%)'
        }}
      />

      {/* 漂浮粒子（從中心向外飛） */}
      <div className="relative w-0 h-0">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full bg-saffron-400"
            style={{
              top: 0,
              left: 0,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animation: `mysticalFly ${duration / 1000}s ease-out forwards`,
              animationDelay: `${p.delay}s`,
              '--angle': `${p.angle}deg`,
              '--distance': `${p.distance}px`,
              boxShadow: '0 0 8px rgba(201,169,97,0.8)'
            }}
          />
        ))}
      </div>

      {/* 中央曼陀羅 */}
      <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
        {/* 外圈旋轉（順時針） */}
        <svg
          viewBox="0 0 400 400"
          className="absolute inset-0 w-full h-full"
          style={{ animation: 'mandalaSpin 3s linear infinite' }}
        >
          <defs>
            <radialGradient id="mandalaGlow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#c9a961" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#e34234" stopOpacity="0.3" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(201,169,97,0.4)" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(201,169,97,0.3)" strokeWidth="1" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * 30 - 90) * (Math.PI / 180)
            const x1 = 200 + Math.cos(a) * 120
            const y1 = 200 + Math.sin(a) * 120
            const x2 = 200 + Math.cos(a) * 180
            const y2 = 200 + Math.sin(a) * 180
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(201,169,97,0.5)"
                strokeWidth="1.5"
              />
            )
          })}
          {['\u2648','\u2649','\u264A','\u264B','\u264C','\u264D','\u264E','\u264F','\u2650','\u2651','\u2652','\u2653'].map((sym, i) => {
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
                fill="#c9a961"
                fontSize="14"
                fontFamily="'EB Garamond', serif"
                style={{ fontVariantEmoji: 'text' }}
              >
                {sym}{'\uFE0E'}
              </text>
            )
          })}
        </svg>

        {/* 內圈逆時針旋轉 */}
        <svg
          viewBox="0 0 400 400"
          className="absolute inset-0 w-full h-full"
          style={{ animation: 'mandalaSpinReverse 4s linear infinite' }}
        >
          <polygon
            points="200,80 320,200 200,320 80,200"
            fill="none"
            stroke="rgba(201,169,97,0.6)"
            strokeWidth="1.5"
          />
          <polygon
            points="200,120 280,200 200,280 120,200"
            fill="none"
            stroke="rgba(227,66,52,0.5)"
            strokeWidth="1"
          />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = ((i * 45) - 90) * (Math.PI / 180)
            const x = 200 + Math.cos(a) * 100
            const y = 200 + Math.sin(a) * 100
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill="#c9a961"
                opacity="0.8"
              />
            )
          })}
        </svg>

        {/* 中心發光 OM 符號 */}
        <div
          className="relative flex items-center justify-center w-32 h-32 rounded-full"
          style={{
            background: 'url(#mandalaGlow)',
            animation: 'pulseGlow 1.5s ease-in-out infinite'
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(201,169,97,0.35) 0%, transparent 70%)',
              filter: 'blur(10px)'
            }}
          />
          <span
            className="relative font-serif text-6xl gradient-text"
            style={{
              filter: 'drop-shadow(0 0 12px rgba(201,169,97,0.6))',
              animation: 'omBreath 2s ease-in-out infinite'
            }}
          >
            ॐ
          </span>
        </div>
      </div>

      {/* 底部階段文字 */}
      <div className="absolute bottom-[20vh] left-0 right-0 text-center px-6">
        <div className="relative h-10 flex items-center justify-center">
          {PHASES.map((phrase, i) => (
            <p
              key={i}
              className={`absolute font-serif text-lg md:text-2xl transition-all duration-500 ${
                i === phaseIdx
                  ? 'opacity-100 translate-y-0 gradient-text'
                  : 'opacity-0 translate-y-2 text-saffron-400/0'
              }`}
            >
              {phrase}
            </p>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center gap-2">
          {PHASES.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i <= phaseIdx
                  ? 'bg-saffron-400 w-8'
                  : 'bg-white/20 w-4'
              }`}
            />
          ))}
        </div>
      </div>

      {/* CSS 動畫 keyframes */}
      <style>{`
        @keyframes mandalaSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes mandalaSpinReverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.05); filter: brightness(1.3); }
        }
        @keyframes omBreath {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }
        @keyframes mysticalFly {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform:
              translate(
                calc(cos(var(--angle)) * var(--distance)),
                calc(sin(var(--angle)) * var(--distance))
              )
              scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
