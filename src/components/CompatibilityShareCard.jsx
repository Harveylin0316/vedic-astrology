import { forwardRef } from 'react'
import { CATEGORY_META } from '../data/compatibilityReadings.js'

// 1080×1080 方形分享卡（IG Post / 朋友圈 / 小紅書通用）
// 用於 html-to-image 截圖下載
const CompatibilityShareCard = forwardRef(function CompatibilityShareCard(
  { result, youName, themName },
  ref
) {
  const { compat, narrative } = result
  const meta = CATEGORY_META[compat.category] || CATEGORY_META['互補型配對']

  return (
    <div
      ref={ref}
      style={{
        width: '1080px',
        height: '1080px',
        position: 'relative',
        background: '#0a0618',
        backgroundImage:
          'radial-gradient(circle at 20% 25%, rgba(255,194,102,0.15) 0%, transparent 45%),' +
          'radial-gradient(circle at 80% 75%, rgba(227,66,52,0.12) 0%, transparent 45%),' +
          'radial-gradient(ellipse at center, #140b2e 0%, #0a0618 100%)',
        color: '#e2e8f0',
        fontFamily: '"Cormorant Garamond", Georgia, serif',
        overflow: 'hidden',
        padding: '60px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 邊角裝飾曼陀羅 */}
      <svg
        viewBox="0 0 400 400"
        style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          opacity: 0.15
        }}
      >
        <circle cx="200" cy="200" r="180" fill="none" stroke="#ffc266" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="200" cy="200" r="140" fill="none" stroke="#ffc266" strokeWidth="1" />
        <circle cx="200" cy="200" r="100" fill="none" stroke="#ffc266" strokeWidth="1" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 - 90) * (Math.PI / 180)
          const x1 = 200 + Math.cos(a) * 100
          const y1 = 200 + Math.sin(a) * 100
          const x2 = 200 + Math.cos(a) * 180
          const y2 = 200 + Math.sin(a) * 180
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffc266" strokeWidth="1" />
        })}
      </svg>

      <svg
        viewBox="0 0 300 300"
        style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-80px',
          width: '300px',
          height: '300px',
          opacity: 0.1
        }}
      >
        <polygon points="150,20 280,150 150,280 20,150" fill="none" stroke="#ffc266" strokeWidth="1.5" />
        <polygon points="150,60 240,150 150,240 60,150" fill="none" stroke="#e34234" strokeWidth="1" />
      </svg>

      {/* 頂部 Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', zIndex: 1 }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ffc266, #e34234)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'serif',
            fontSize: '26px',
            color: '#0a0618',
            fontWeight: 'bold'
          }}
        >
          ॐ
        </div>
        <div style={{ lineHeight: 1.1 }}>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 600,
              background: 'linear-gradient(90deg, #ffc266, #e34234)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent'
            }}
          >
            吠陀占星
          </div>
          <div style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>
            Vedic Compatibility
          </div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#64748b' }}>
          Ashta Kuta · 36 分制
        </div>
      </div>

      {/* 兩人名字 */}
      <div style={{ textAlign: 'center', marginBottom: '30px', zIndex: 1 }}>
        <div style={{ fontSize: '24px', color: '#94a3b8', marginBottom: '10px' }}>
          {youName}
          <span style={{ margin: '0 16px', color: '#ffc266', fontSize: '32px' }}>×</span>
          {themName}
        </div>
        <div style={{ fontSize: '14px', color: '#64748b', letterSpacing: '0.15em' }}>
          你們的業力契合度
        </div>
      </div>

      {/* 超大 icon + category */}
      <div style={{ textAlign: 'center', marginBottom: '20px', zIndex: 1 }}>
        <div style={{ fontSize: '100px', lineHeight: 1, marginBottom: '10px' }}>{meta.icon}</div>
        <div
          style={{
            fontSize: '72px',
            fontWeight: 600,
            background: 'linear-gradient(90deg, #ffc266, #ffa733, #e34234)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
            letterSpacing: '0.05em'
          }}
        >
          {compat.category}
        </div>
      </div>

      {/* 分數 */}
      <div style={{ textAlign: 'center', marginBottom: '40px', zIndex: 1 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: '8px',
            padding: '16px 40px',
            borderRadius: '50px',
            background: 'rgba(255,194,102,0.1)',
            border: '2px solid rgba(255,194,102,0.35)'
          }}
        >
          <span
            style={{
              fontSize: '80px',
              fontWeight: 700,
              color: '#ffc266',
              fontFamily: 'serif',
              lineHeight: 1
            }}
          >
            {compat.totalScore}
          </span>
          <span style={{ fontSize: '32px', color: '#94a3b8' }}>/ 36</span>
          <span style={{ fontSize: '24px', color: '#ffa733', marginLeft: '16px' }}>
            ({compat.percent}%)
          </span>
        </div>
        <div
          style={{
            fontSize: '18px',
            color: '#cbd5e1',
            maxWidth: '720px',
            margin: '20px auto 0',
            lineHeight: 1.6,
            fontFamily: 'Inter, system-ui, sans-serif'
          }}
        >
          {compat.tagline}
        </div>
      </div>

      {/* 三段 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '16px',
          marginBottom: 'auto',
          zIndex: 1,
          fontFamily: 'Inter, system-ui, sans-serif'
        }}
      >
        <NarrativeBlock emoji="💘" label="為什麼吸引" text={narrative.attract} />
        <NarrativeBlock emoji="⚔️" label="會吵什麼" text={narrative.fight} />
        <NarrativeBlock emoji="💕" label="如何長久" text={narrative.last} />
      </div>

      {/* 底部 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '30px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          zIndex: 1,
          fontFamily: 'Inter, system-ui, sans-serif'
        }}
      >
        <div style={{ fontSize: '12px', color: '#64748b' }}>
          Moon Rashi & Nakshatra 計算 · Lahiri Ayanamsha
        </div>
        <div style={{ fontSize: '14px', color: '#ffc266', fontWeight: 500 }}>
          吠陀占星 Jyotish
        </div>
      </div>
    </div>
  )
})

function NarrativeBlock({ emoji, label, text }) {
  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,194,102,0.2)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{emoji}</div>
      <div
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: '#ffc266',
          letterSpacing: '0.1em',
          marginBottom: '8px',
          textTransform: 'uppercase'
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '13px',
          color: '#cbd5e1',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 6,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {text}
      </div>
    </div>
  )
}

export default CompatibilityShareCard
