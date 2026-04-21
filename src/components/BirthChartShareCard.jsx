import { forwardRef } from 'react'

// 1080×1080 命盤分享卡 · 專業報告風格
// 參考：付費 Human Design 報告、專業占星師報告卡
// 6 個清楚的 Section，金線分隔、typography hierarchy 明確
const BirthChartShareCard = forwardRef(function BirthChartShareCard(
  { chart, persona, stamp, city, rarity, punchlines = [] },
  ref
) {
  const tropAsc = chart.tropical.ascendant.rashi
  const tropSun = chart.tropical.sun.rashi
  const tropMoon = chart.tropical.moon.rashi
  const moonNak = chart.sidereal.moon.nakshatra
  const catchphrase = persona?.primary || ''

  // 挑 Top 2 最稀有的關鍵配置（含完整 meaning 敘述）
  const topFeatures = (rarity?.features || []).slice(0, 2)

  return (
    <div
      ref={ref}
      style={{
        width: '1080px',
        height: '1080px',
        position: 'relative',
        background: '#0a0618',
        backgroundImage:
          'radial-gradient(circle at 20% 10%, rgba(255,194,102,0.15) 0%, transparent 50%),' +
          'radial-gradient(circle at 80% 90%, rgba(227,66,52,0.12) 0%, transparent 50%),' +
          'linear-gradient(180deg, #1a0e36 0%, #0a0618 100%)',
        color: '#e2e8f0',
        fontFamily: 'Inter, system-ui, sans-serif',
        overflow: 'hidden',
        padding: '48px 64px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 精緻外框 */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          right: '24px',
          bottom: '24px',
          border: '1px solid rgba(255,194,102,0.15)',
          borderRadius: '4px',
          pointerEvents: 'none'
        }}
      />

      {/* 角落裝飾曼陀羅（極淡） */}
      <CornerMandala position="top-right" />
      <CornerMandala position="bottom-left" />

      {/* ═══ Section 1: Header ═══ */}
      <div style={{ display: 'flex', alignItems: 'center', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
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
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: '#94a3b8',
                textTransform: 'uppercase',
                fontWeight: 500
              }}
            >
              Vedic Chart Analysis
            </div>
            <div
              style={{
                fontSize: '22px',
                fontWeight: 600,
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                background: 'linear-gradient(90deg, #ffc266, #e34234)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                marginTop: '2px',
                letterSpacing: '0.04em'
              }}
            >
              Jyotish Report
            </div>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right', fontSize: '11px', color: '#64748b', lineHeight: 1.5, letterSpacing: '0.08em' }}>
          {stamp && <div style={{ color: '#94a3b8', fontWeight: 500 }}>{stamp}</div>}
          {city && <div>{city}</div>}
        </div>
      </div>

      <GoldDivider />

      {/* ═══ Section 2: Chart Rarity（Hero · 社交貨幣） ═══ */}
      {rarity && (
        <>
          <div style={{ textAlign: 'center', marginTop: '12px', zIndex: 2 }}>
            <div
              style={{
                fontSize: '10px',
                letterSpacing: '0.45em',
                color: '#94a3b8',
                textTransform: 'uppercase',
                marginBottom: '8px'
              }}
            >
              Chart Rarity Index
            </div>
            <div
              style={{
                fontSize: '108px',
                fontWeight: 700,
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                lineHeight: 1,
                background: 'linear-gradient(135deg, #ffd580 0%, #ffa733 40%, #e34234 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '-0.02em',
                filter: 'drop-shadow(0 0 40px rgba(255,194,102,0.35))'
              }}
            >
              TOP {rarity.topPercent}%
            </div>
            <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', fontSize: '14px' }}>
              <span style={{ color: '#94a3b8', letterSpacing: '0.05em' }}>
                稀有度 <span style={{ color: '#ffc266', fontWeight: 600, fontSize: '18px' }}>{rarity.score}</span> / 100
              </span>
              <span style={{ color: '#64748b' }}>·</span>
              <span style={{ color: '#ffa733', fontWeight: 600 }}>{rarity.title}</span>
            </div>
            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'center', gap: '4px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '16px',
                    color: i < rarity.stars ? '#ffc266' : 'rgba(255,255,255,0.1)'
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <GoldDivider />
        </>
      )}

      {/* ═══ Section 3: Soul Signature ═══ */}
      {catchphrase && (
        <>
          <div style={{ textAlign: 'center', marginTop: '4px', zIndex: 2 }}>
            <div
              style={{
                fontSize: '10px',
                letterSpacing: '0.45em',
                color: '#94a3b8',
                textTransform: 'uppercase',
                marginBottom: '10px'
              }}
            >
              Soul Signature
            </div>
            <div
              style={{
                fontSize: '52px',
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

          <GoldDivider />
        </>
      )}

      {/* ═══ Section 4: Placements（3 rashi + nakshatra） ═══ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px',
          marginTop: '8px',
          zIndex: 2
        }}
      >
        <PlacementCell label="Rising" symbol={tropAsc.symbol} rashi={tropAsc.chinese} english={tropAsc.name} />
        <PlacementCell label="Sun" symbol={tropSun.symbol} rashi={tropSun.chinese} english={tropSun.name} />
        <PlacementCell label="Moon" symbol={tropMoon.symbol} rashi={tropMoon.chinese} english={tropMoon.name} extra={moonNak?.name && `${moonNak.name} · Pada ${moonNak.pada}`} />
      </div>

      <GoldDivider />

      {/* ═══ Section 5: Signature Traits（命盤洩密） ═══ */}
      {punchlines.length > 0 && (
        <>
          <div style={{ zIndex: 2 }}>
            <SectionHeader label="Signature Traits" subtitle="命盤洩密的 4 件事" />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                marginTop: '12px'
              }}
            >
              {punchlines.slice(0, 4).map((line, i) => (
                <TraitRow key={i} num={i + 1} text={line} />
              ))}
            </div>
          </div>

          {topFeatures.length > 0 && <GoldDivider />}
        </>
      )}

      {/* ═══ Section 6: Key Configurations（關鍵配置） ═══ */}
      {topFeatures.length > 0 && (
        <div style={{ zIndex: 2 }}>
          <SectionHeader label="Key Configurations" subtitle="讓你與眾不同的關鍵配置" />
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {topFeatures.map((f, i) => (
              <FeatureRow key={i} feature={f} />
            ))}
          </div>
        </div>
      )}

      {/* ═══ Section 7: Footer ═══ */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          zIndex: 2
        }}
      >
        <div>
          <div
            style={{
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: '#64748b',
              textTransform: 'uppercase'
            }}
          >
            Methodology
          </div>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '3px', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
            Sidereal · Lahiri Ayanamsha
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: '#64748b',
              textTransform: 'uppercase'
            }}
          >
            Get Yours
          </div>
          <div
            style={{
              fontSize: '15px',
              color: '#ffc266',
              marginTop: '3px',
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontWeight: 600,
              letterSpacing: '0.03em'
            }}
          >
            猜你懂嗎？來算你的命盤
          </div>
        </div>
      </div>
    </div>
  )
})

// ═══════════════════════ 子元件 ═══════════════════════

function GoldDivider() {
  return (
    <div
      style={{
        margin: '14px 0',
        height: '1px',
        background:
          'linear-gradient(90deg, transparent 0%, rgba(255,194,102,0.35) 20%, rgba(255,194,102,0.5) 50%, rgba(255,194,102,0.35) 80%, transparent 100%)',
        zIndex: 2,
        position: 'relative'
      }}
    />
  )
}

function SectionHeader({ label, subtitle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
      <div
        style={{
          fontSize: '11px',
          letterSpacing: '0.35em',
          color: '#ffc266',
          textTransform: 'uppercase',
          fontWeight: 600
        }}
      >
        {label}
      </div>
      {subtitle && (
        <div style={{ fontSize: '12px', color: '#64748b', fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
          {subtitle}
        </div>
      )}
    </div>
  )
}

function PlacementCell({ label, symbol, rashi, english, extra }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '14px 10px',
        borderRadius: '6px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,194,102,0.15)'
      }}
    >
      <div
        style={{
          fontSize: '9px',
          letterSpacing: '0.3em',
          color: '#94a3b8',
          textTransform: 'uppercase',
          marginBottom: '6px',
          fontWeight: 500
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '36px',
          lineHeight: 1,
          background: 'linear-gradient(135deg, #ffc266, #ffa733)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          marginBottom: '4px'
        }}
      >
        {symbol}
      </div>
      <div style={{ fontSize: '16px', color: '#e2e8f0', fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 500 }}>
        {rashi}
      </div>
      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px', letterSpacing: '0.05em' }}>
        {english}
      </div>
      {extra && (
        <div
          style={{
            fontSize: '10px',
            color: '#ffc266',
            marginTop: '6px',
            paddingTop: '6px',
            borderTop: '1px solid rgba(255,194,102,0.15)',
            letterSpacing: '0.02em'
          }}
        >
          {extra}
        </div>
      )}
    </div>
  )
}

function TraitRow({ num, text }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 14px',
        borderRadius: '8px',
        background: 'rgba(255,194,102,0.05)',
        borderLeft: '2px solid #ffc266'
      }}
    >
      <span
        style={{
          flexShrink: 0,
          fontSize: '20px',
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          background: 'linear-gradient(135deg, #ffc266, #e34234)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          fontWeight: 700,
          lineHeight: 1
        }}
      >
        {String(num).padStart(2, '0')}
      </span>
      <span
        style={{
          fontSize: '16px',
          color: '#f1f5f9',
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontWeight: 500,
          lineHeight: 1.3
        }}
      >
        {text}
      </span>
    </div>
  )
}

function FeatureRow({ feature }) {
  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      {/* 標題列：◆ + 白話標題 + 人口佔比 pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ flexShrink: 0, fontSize: '14px', color: '#ffc266' }}>◆</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '17px',
              color: '#f1f5f9',
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontWeight: 500,
              lineHeight: 1.2
            }}
          >
            {feature.plain || feature.name}
          </div>
          <div
            style={{
              fontSize: '10px',
              color: '#64748b',
              marginTop: '2px',
              letterSpacing: '0.02em'
            }}
          >
            {feature.technical || feature.signature}
          </div>
        </div>
        <span
          style={{
            flexShrink: 0,
            fontSize: '10px',
            color: '#ffa733',
            fontWeight: 600,
            fontFamily: 'Inter',
            padding: '3px 10px',
            borderRadius: '999px',
            background: 'rgba(255,194,102,0.1)',
            border: '1px solid rgba(255,194,102,0.3)',
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap'
          }}
        >
          人口 {feature.freq}
        </span>
      </div>
      {/* 白話解讀 — 告訴你這代表什麼 */}
      {feature.meaning && (
        <div
          style={{
            marginTop: '7px',
            paddingLeft: '26px',
            fontSize: '12px',
            color: '#cbd5e1',
            lineHeight: 1.5,
            letterSpacing: '0.01em'
          }}
        >
          {feature.meaning}
        </div>
      )}
    </div>
  )
}

function CornerMandala({ position }) {
  const styles =
    position === 'top-right'
      ? { top: '-120px', right: '-120px', width: '320px', height: '320px' }
      : { bottom: '-120px', left: '-120px', width: '280px', height: '280px' }
  return (
    <svg
      viewBox="0 0 400 400"
      style={{
        position: 'absolute',
        ...styles,
        opacity: 0.08,
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      <circle cx="200" cy="200" r="190" fill="none" stroke="#ffc266" strokeWidth="1" strokeDasharray="2 10" />
      <circle cx="200" cy="200" r="160" fill="none" stroke="#ffc266" strokeWidth="1" />
      <circle cx="200" cy="200" r="120" fill="none" stroke="#ffc266" strokeWidth="1" />
      <circle cx="200" cy="200" r="80" fill="none" stroke="#ffc266" strokeWidth="1" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 - 90) * (Math.PI / 180)
        const x1 = 200 + Math.cos(a) * 80
        const y1 = 200 + Math.sin(a) * 80
        const x2 = 200 + Math.cos(a) * 190
        const y2 = 200 + Math.sin(a) * 190
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffc266" strokeWidth="1" />
      })}
    </svg>
  )
}

export default BirthChartShareCard
