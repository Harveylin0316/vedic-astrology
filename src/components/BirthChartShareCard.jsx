import { forwardRef } from 'react'

// 1080×1080 單人命盤分享卡 · 全新設計
// 核心：大字靈魂簽名 + 精緻曼陀羅 + 一句命中金句 + 優雅三星位
const BirthChartShareCard = forwardRef(function BirthChartShareCard(
  { chart, persona, stamp, city, rarity, signatures = [] },
  ref
) {
  const tropAsc = chart.tropical.ascendant.rashi
  const tropSun = chart.tropical.sun.rashi
  const tropMoon = chart.tropical.moon.rashi
  const sidMoonNakshatra = chart.sidereal.moon.nakshatra

  // Hero 主標（殼 × 芯）— 來自 persona
  const heroPrimary = persona?.primary || ''
  // 主 quote — 用 persona.detail（最濃縮），無則 fallback 到首個 signature
  const heroQuote = persona?.detail || signatures[0]?.text || ''

  return (
    <div
      ref={ref}
      style={{
        width: '1080px',
        height: '1080px',
        position: 'relative',
        background: '#0a0618',
        backgroundImage:
          'radial-gradient(circle at 15% 18%, rgba(255,194,102,0.18) 0%, transparent 45%),' +
          'radial-gradient(circle at 85% 82%, rgba(227,66,52,0.18) 0%, transparent 45%),' +
          'radial-gradient(ellipse at center, #1a0e36 0%, #0a0618 100%)',
        color: '#e2e8f0',
        fontFamily: 'Inter, system-ui, sans-serif',
        overflow: 'hidden',
        padding: '56px 72px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* === 頂部 Brand + Rarity === */}
      <div style={{ display: 'flex', alignItems: 'center', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffc266, #e34234)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'serif',
              fontSize: '30px',
              color: '#0a0618',
              fontWeight: 700,
              boxShadow: '0 0 30px rgba(255,194,102,0.3)'
            }}
          >
            ॐ
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <div
              style={{
                fontSize: '22px',
                fontWeight: 600,
                background: 'linear-gradient(90deg, #ffc266, #e34234)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                letterSpacing: '0.04em'
              }}
            >
              Vedic Astrology
            </div>
            <div style={{ fontSize: '10px', letterSpacing: '0.3em', color: '#94a3b8', textTransform: 'uppercase', marginTop: '2px' }}>
              Jyotish
            </div>
          </div>
        </div>

        {rarity && (
          <div
            style={{
              marginLeft: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 20px',
              borderRadius: '999px',
              background: 'rgba(255,194,102,0.12)',
              border: '1.5px solid rgba(255,194,102,0.45)',
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#94a3b8', textTransform: 'uppercase' }}>
              稀有度
            </span>
            <span style={{ fontSize: '20px', color: '#ffc266', fontWeight: 700, fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
              {rarity.score}
            </span>
            <span style={{ fontSize: '12px', color: '#ffa733' }}>
              Top {rarity.topPercent}%
            </span>
          </div>
        )}
      </div>

      {/* === 靈魂簽名 === */}
      <div style={{ textAlign: 'center', marginTop: '40px', zIndex: 2 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '14px',
            letterSpacing: '0.3em',
            color: '#94a3b8',
            textTransform: 'uppercase'
          }}
        >
          <span style={{ width: '40px', height: '1px', background: 'rgba(148,163,184,0.4)' }} />
          Your Soul Signature
          <span style={{ width: '40px', height: '1px', background: 'rgba(148,163,184,0.4)' }} />
        </div>

        <div
          style={{
            marginTop: '22px',
            fontSize: '128px',
            fontWeight: 700,
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            letterSpacing: '0.02em',
            lineHeight: 1.05,
            background: 'linear-gradient(135deg, #ffc266 0%, #ffa733 40%, #e34234 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
            textShadow: '0 0 80px rgba(255,194,102,0.4)',
            whiteSpace: 'nowrap'
          }}
        >
          {heroPrimary}
        </div>
      </div>

      {/* === 中心：大型曼陀羅 === */}
      <div
        style={{
          position: 'relative',
          width: '600px',
          height: '380px',
          margin: '24px auto 0',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <MandalaSVG />

        {/* 中心 OM */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,194,102,0.35) 0%, transparent 75%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span
            style={{
              fontSize: '80px',
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              background: 'linear-gradient(135deg, #ffd580, #e34234)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              lineHeight: 1,
              filter: 'drop-shadow(0 0 12px rgba(255,194,102,0.5))'
            }}
          >
            ॐ
          </span>
        </div>
      </div>

      {/* === 金句 === */}
      {heroQuote && (
        <div
          style={{
            textAlign: 'center',
            margin: '20px auto 0',
            maxWidth: '860px',
            fontSize: '22px',
            lineHeight: 1.55,
            color: '#e2e8f0',
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 500,
            zIndex: 2
          }}
        >
          <span style={{ fontSize: '40px', color: '#ffc266', verticalAlign: '-8px' }}>“</span>
          {heroQuote}
          <span style={{ fontSize: '40px', color: '#ffc266', verticalAlign: '-8px' }}>”</span>
        </div>
      )}

      {/* === 三星位 === */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '28px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 2
        }}
      >
        <RashiStamp label="RISING" symbol={tropAsc.symbol} chinese={tropAsc.chinese} />
        <div
          style={{
            width: '1px',
            height: '60px',
            background: 'linear-gradient(to bottom, transparent, rgba(255,194,102,0.4), transparent)'
          }}
        />
        <RashiStamp label="SUN" symbol={tropSun.symbol} chinese={tropSun.chinese} />
        <div
          style={{
            width: '1px',
            height: '60px',
            background: 'linear-gradient(to bottom, transparent, rgba(255,194,102,0.4), transparent)'
          }}
        />
        <RashiStamp label="MOON" symbol={tropMoon.symbol} chinese={tropMoon.chinese} extra={sidMoonNakshatra?.name} />
      </div>

      {/* === 底部：meta + URL === */}
      <div
        style={{
          marginTop: '24px',
          paddingTop: '18px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 2,
          fontSize: '12px'
        }}
      >
        <div style={{ color: '#64748b' }}>
          {stamp && <span>{stamp}</span>}
          {city && <span style={{ marginLeft: '10px' }}>· {city}</span>}
        </div>
        <div
          style={{
            color: '#ffc266',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}
        >
          你呢？來算自己的命盤
        </div>
      </div>
    </div>
  )
})

// ═══════════════════════ 子元件 ═══════════════════════

function MandalaSVG() {
  return (
    <svg viewBox="0 0 600 600" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="bshare-center" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#ffc266" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#e34234" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bshare-ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffc266" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#e34234" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* 外層裝飾虛線圈 */}
      <circle cx="300" cy="300" r="275" fill="none" stroke="#ffc266" strokeWidth="1" strokeDasharray="2 8" opacity="0.35" />

      {/* 第二圈 */}
      <circle cx="300" cy="300" r="235" fill="none" stroke="#ffc266" strokeWidth="1" opacity="0.35" />

      {/* 第三圈（主 ring）*/}
      <circle cx="300" cy="300" r="195" fill="none" stroke="url(#bshare-ring)" strokeWidth="2" opacity="0.9" />

      {/* 12 條徑向線 */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180)
        const x1 = 300 + Math.cos(angle) * 145
        const y1 = 300 + Math.sin(angle) * 145
        const x2 = 300 + Math.cos(angle) * 235
        const y2 = 300 + Math.sin(angle) * 235
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffc266" strokeWidth="1" opacity="0.35" />
        )
      })}

      {/* 12 星座符號 */}
      {['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'].map((sym, i) => {
        const angle = (i * 30 - 75) * (Math.PI / 180)
        const x = 300 + Math.cos(angle) * 215
        const y = 300 + Math.sin(angle) * 215
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#ffc266"
            fontSize="26"
            opacity="0.85"
            style={{ filter: 'drop-shadow(0 0 4px rgba(255,194,102,0.5))' }}
          >
            {sym}
          </text>
        )
      })}

      {/* 內層蓮花（8 瓣） */}
      {Array.from({ length: 8 }).map((_, i) => {
        const rotate = i * 45
        return (
          <path
            key={i}
            d="M 300 300 Q 315 260 300 220 Q 285 260 300 300 Z"
            fill="none"
            stroke="#ffc266"
            strokeWidth="1.2"
            opacity="0.45"
            transform={`rotate(${rotate} 300 300)`}
          />
        )
      })}

      {/* 內圈小 */}
      <circle cx="300" cy="300" r="145" fill="none" stroke="#ffc266" strokeWidth="1" opacity="0.3" />

      {/* 4 主軸菱形 */}
      <polygon
        points="300,160 440,300 300,440 160,300"
        fill="none"
        stroke="#e34234"
        strokeWidth="1.2"
        opacity="0.4"
      />

      {/* 中心光 */}
      <circle cx="300" cy="300" r="90" fill="url(#bshare-center)" />
    </svg>
  )
}

function RashiStamp({ label, symbol, chinese, extra }) {
  return (
    <div style={{ textAlign: 'center', minWidth: '150px' }}>
      <div
        style={{
          fontSize: '10px',
          letterSpacing: '0.3em',
          color: '#94a3b8',
          textTransform: 'uppercase',
          marginBottom: '6px'
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '64px',
          lineHeight: 1,
          background: 'linear-gradient(135deg, #ffc266, #ffa733)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          filter: 'drop-shadow(0 0 10px rgba(255,194,102,0.3))'
        }}
      >
        {symbol}
      </div>
      <div
        style={{
          marginTop: '6px',
          fontSize: '20px',
          color: '#e2e8f0',
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontWeight: 500
        }}
      >
        {chinese}
      </div>
      {extra && (
        <div
          style={{
            marginTop: '4px',
            fontSize: '11px',
            color: '#ffc266',
            letterSpacing: '0.05em'
          }}
        >
          {extra}
        </div>
      )}
    </div>
  )
}

export default BirthChartShareCard
