import { forwardRef } from 'react'

// 1080×1080 單人命盤分享卡 · 社交談資版
// 設計目標：3 個分享驅動力
//   1. 炫耀「稀有度 Top X%」(social flex)
//   2. 發送 4 個「太準了」的談資 bullets
//   3. 記得一個 catchphrase（殼 × 芯）
const BirthChartShareCard = forwardRef(function BirthChartShareCard(
  { chart, persona, stamp, city, rarity, punchlines = [] },
  ref
) {
  const tropAsc = chart.tropical.ascendant.rashi
  const tropSun = chart.tropical.sun.rashi
  const tropMoon = chart.tropical.moon.rashi
  const moonNak = chart.sidereal.moon.nakshatra
  const catchphrase = persona?.primary || ''

  return (
    <div
      ref={ref}
      style={{
        width: '1080px',
        height: '1080px',
        position: 'relative',
        background: '#0a0618',
        backgroundImage:
          'radial-gradient(circle at 20% 15%, rgba(255,194,102,0.22) 0%, transparent 55%),' +
          'radial-gradient(circle at 80% 85%, rgba(227,66,52,0.22) 0%, transparent 55%),' +
          'radial-gradient(ellipse at center, #1a0e36 0%, #0a0618 100%)',
        color: '#e2e8f0',
        fontFamily: 'Inter, system-ui, sans-serif',
        overflow: 'hidden',
        padding: '56px 68px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 角落裝飾曼陀羅 */}
      <svg
        viewBox="0 0 400 400"
        style={{
          position: 'absolute',
          top: '-100px',
          right: '-80px',
          width: '360px',
          height: '360px',
          opacity: 0.12,
          pointerEvents: 'none'
        }}
      >
        <circle cx="200" cy="200" r="180" fill="none" stroke="#ffc266" strokeWidth="1" strokeDasharray="3 8" />
        <circle cx="200" cy="200" r="140" fill="none" stroke="#ffc266" strokeWidth="1" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 - 90) * (Math.PI / 180)
          const x1 = 200 + Math.cos(a) * 140
          const y1 = 200 + Math.sin(a) * 140
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
          left: '-60px',
          width: '260px',
          height: '260px',
          opacity: 0.1,
          pointerEvents: 'none'
        }}
      >
        <polygon points="150,30 270,150 150,270 30,150" fill="none" stroke="#ffc266" strokeWidth="1.5" />
        <polygon points="150,70 230,150 150,230 70,150" fill="none" stroke="#e34234" strokeWidth="1" />
      </svg>

      {/* === 頂部 Brand === */}
      <div style={{ display: 'flex', alignItems: 'center', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffc266, #e34234)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'serif',
              fontSize: '24px',
              color: '#0a0618',
              fontWeight: 700
            }}
          >
            ॐ
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 600,
                background: 'linear-gradient(90deg, #ffc266, #e34234)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                fontFamily: '"Cormorant Garamond", Georgia, serif'
              }}
            >
              Vedic Chart
            </div>
            <div style={{ fontSize: '10px', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>
              Jyotish
            </div>
          </div>
        </div>

        <div style={{ marginLeft: 'auto', textAlign: 'right', fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
          {stamp && <div>{stamp}</div>}
          {city && <div>{city}</div>}
        </div>
      </div>

      {/* === 稀有度 HERO（最搶眼的社交貨幣） === */}
      {rarity && (
        <div style={{ textAlign: 'center', marginTop: '32px', zIndex: 2 }}>
          <div
            style={{
              fontSize: '13px',
              letterSpacing: '0.4em',
              color: '#94a3b8',
              textTransform: 'uppercase',
              marginBottom: '6px'
            }}
          >
            Chart Rarity
          </div>
          <div
            style={{
              fontSize: '140px',
              fontWeight: 800,
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              lineHeight: 1,
              background: 'linear-gradient(135deg, #ffc266 0%, #ffa733 40%, #e34234 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              textShadow: '0 0 80px rgba(255,194,102,0.5)',
              letterSpacing: '-0.02em'
            }}
          >
            TOP {rarity.topPercent}%
          </div>
          <div
            style={{
              marginTop: '14px',
              fontSize: '22px',
              color: '#ffc266',
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              letterSpacing: '0.05em'
            }}
          >
            稀有度 {rarity.score} / 100 · {rarity.title}
          </div>
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '5px' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                style={{
                  fontSize: '22px',
                  color: i < rarity.stars ? '#ffc266' : 'rgba(255,255,255,0.1)'
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      )}

      {/* === Catchphrase（記得的標籤） === */}
      {catchphrase && (
        <div
          style={{
            marginTop: '24px',
            textAlign: 'center',
            zIndex: 2
          }}
        >
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.3em',
              color: '#94a3b8',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}
          >
            Your Soul Signature
          </div>
          <div
            style={{
              fontSize: '60px',
              fontWeight: 600,
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              lineHeight: 1.1,
              background: 'linear-gradient(90deg, #ffd580, #ffa733)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap'
            }}
          >
            {catchphrase}
          </div>
        </div>
      )}

      {/* === 命盤洩密 bullets（社交談資主體） === */}
      {punchlines.length > 0 && (
        <div style={{ marginTop: '28px', zIndex: 2 }}>
          <div
            style={{
              textAlign: 'center',
              fontSize: '15px',
              letterSpacing: '0.25em',
              color: '#ffc266',
              textTransform: 'uppercase',
              marginBottom: '20px',
              fontWeight: 600
            }}
          >
            ── 命盤洩密 ──
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              padding: '0 40px'
            }}
          >
            {punchlines.map((line, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '14px 20px',
                  borderRadius: '14px',
                  background: 'rgba(255,194,102,0.06)',
                  border: '1px solid rgba(255,194,102,0.18)'
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ffc266, #e34234)',
                    color: '#0a0618',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontFamily: '"Cormorant Garamond", Georgia, serif'
                  }}
                >
                  {i + 1}
                </span>
                <span
                  style={{
                    fontSize: '22px',
                    color: '#f1f5f9',
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    lineHeight: 1.35,
                    fontWeight: 500
                  }}
                >
                  {line}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === 底部：三星位 + CTA === */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '28px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 2,
          fontSize: '13px'
        }}
      >
        <div style={{ color: '#cbd5e1', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
          <div style={{ fontSize: '15px' }}>
            {tropAsc.symbol} {tropAsc.chinese}
            <span style={{ color: '#64748b', margin: '0 8px' }}>·</span>
            {tropSun.symbol} {tropSun.chinese}
            <span style={{ color: '#64748b', margin: '0 8px' }}>·</span>
            {tropMoon.symbol} {tropMoon.chinese}
          </div>
          {moonNak && (
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', fontFamily: 'Inter' }}>
              Moon · {moonNak.name} · Pada {moonNak.pada}
            </div>
          )}
        </div>
        <div
          style={{
            textAlign: 'right',
            color: '#ffc266',
            fontWeight: 600,
            letterSpacing: '0.08em'
          }}
        >
          <div style={{ fontSize: '14px' }}>猜你懂嗎？</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', fontWeight: 400 }}>
            去算你的吠陀命盤
          </div>
        </div>
      </div>
    </div>
  )
})

export default BirthChartShareCard
