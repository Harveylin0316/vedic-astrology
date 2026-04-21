import { forwardRef } from 'react'

// 1080×1080 單人命盤分享卡
const BirthChartShareCard = forwardRef(function BirthChartShareCard(
  { chart, name, keywords, stamp, city },
  ref
) {
  const tropAsc = chart.tropical.ascendant.rashi
  const tropSun = chart.tropical.sun.rashi
  const tropMoon = chart.tropical.moon.rashi
  const sidAsc = chart.sidereal.ascendant.rashi
  const sidMoonNakshatra = chart.sidereal.moon.nakshatra

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
        fontFamily: 'Inter, system-ui, sans-serif',
        overflow: 'hidden',
        padding: '60px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 中央背景曼陀羅 */}
      <svg
        viewBox="0 0 800 800"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '800px',
          opacity: 0.08,
          pointerEvents: 'none'
        }}
      >
        <circle cx="400" cy="400" r="380" fill="none" stroke="#ffc266" strokeWidth="1" strokeDasharray="4 8" />
        <circle cx="400" cy="400" r="320" fill="none" stroke="#ffc266" strokeWidth="1" />
        <circle cx="400" cy="400" r="260" fill="none" stroke="#ffc266" strokeWidth="1" />
        <circle cx="400" cy="400" r="200" fill="none" stroke="#ffc266" strokeWidth="1" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 - 90) * (Math.PI / 180)
          const x1 = 400 + Math.cos(a) * 200
          const y1 = 400 + Math.sin(a) * 200
          const x2 = 400 + Math.cos(a) * 380
          const y2 = 400 + Math.sin(a) * 380
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffc266" strokeWidth="1" />
        })}
        {['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].map((sym, i) => {
          const a = (i * 30 - 75) * (Math.PI / 180)
          const x = 400 + Math.cos(a) * 345
          const y = 400 + Math.sin(a) * 345
          return (
            <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="#ffc266" fontSize="28">
              {sym}
            </text>
          )
        })}
      </svg>

      {/* 頂部 Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1 }}>
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
              color: 'transparent',
              fontFamily: '"Cormorant Garamond", Georgia, serif'
            }}
          >
            吠陀占星
          </div>
          <div style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>
            My Jyotish Chart
          </div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#64748b', textAlign: 'right' }}>
          {stamp && <div>{stamp}</div>}
          {city && <div style={{ marginTop: '4px' }}>{city}</div>}
        </div>
      </div>

      {/* 大標題 */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '60px',
          zIndex: 1,
          fontFamily: '"Cormorant Garamond", Georgia, serif'
        }}
      >
        <div style={{ fontSize: '16px', color: '#94a3b8', letterSpacing: '0.2em', marginBottom: '10px' }}>
          {name ? name.toUpperCase() : 'YOUR CHART'}
        </div>
        <div
          style={{
            fontSize: '68px',
            fontWeight: 600,
            background: 'linear-gradient(90deg, #ffc266, #ffa733, #e34234)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
            lineHeight: 1.1,
            letterSpacing: '0.03em'
          }}
        >
          我的吠陀命盤
        </div>
      </div>

      {/* 三大星位 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '20px',
          marginTop: '50px',
          zIndex: 1
        }}
      >
        <StarBlock label="上升 Rising" rashi={tropAsc} sid={sidAsc.chinese} />
        <StarBlock label="太陽 Sun" rashi={tropSun} />
        <StarBlock label="月亮 Moon" rashi={tropMoon} extra={sidMoonNakshatra?.name} />
      </div>

      {/* 關鍵字 */}
      {keywords && keywords.length > 0 && (
        <div style={{ marginTop: '40px', zIndex: 1 }}>
          <div
            style={{
              fontSize: '13px',
              color: '#94a3b8',
              letterSpacing: '0.2em',
              marginBottom: '16px',
              textAlign: 'center',
              textTransform: 'uppercase'
            }}
          >
            我的 5 大關鍵字
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            {keywords.slice(0, 5).map((kw, i) => (
              <span
                key={i}
                style={{
                  padding: '10px 20px',
                  borderRadius: '999px',
                  background: 'rgba(255,194,102,0.12)',
                  border: '1.5px solid rgba(255,194,102,0.4)',
                  color: '#ffc266',
                  fontSize: '16px',
                  fontWeight: 500
                }}
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Nakshatra highlight */}
      {sidMoonNakshatra && (
        <div
          style={{
            marginTop: 'auto',
            marginBottom: '40px',
            padding: '24px 32px',
            borderRadius: '20px',
            background: 'rgba(255,194,102,0.08)',
            border: '1.5px solid rgba(255,194,102,0.3)',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <div style={{ fontSize: '48px' }}>🌙</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Moon Nakshatra · 月宿
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 600,
                color: '#ffc266',
                marginTop: '4px',
                fontFamily: '"Cormorant Garamond", Georgia, serif'
              }}
            >
              {sidMoonNakshatra.name} · Pada {sidMoonNakshatra.pada}
            </div>
          </div>
        </div>
      )}

      {/* 底部 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          zIndex: 1
        }}
      >
        <div style={{ fontSize: '12px', color: '#64748b' }}>
          Sidereal · Lahiri Ayanamsha
        </div>
        <div style={{ fontSize: '14px', color: '#ffc266', fontWeight: 500 }}>
          吠陀占星 Jyotish
        </div>
      </div>
    </div>
  )
})

function StarBlock({ label, rashi, sid, extra }) {
  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '20px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,194,102,0.2)',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          fontSize: '11px',
          color: '#94a3b8',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: '12px'
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: '56px', lineHeight: 1 }}>{rashi.symbol}</div>
      <div
        style={{
          fontSize: '22px',
          fontWeight: 600,
          color: '#e2e8f0',
          marginTop: '8px',
          fontFamily: '"Cormorant Garamond", Georgia, serif'
        }}
      >
        {rashi.chinese}
      </div>
      <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
        {rashi.name}
      </div>
      {sid && (
        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '8px' }}>
          吠陀：{sid}
        </div>
      )}
      {extra && (
        <div style={{ fontSize: '12px', color: '#ffc266', marginTop: '8px' }}>
          {extra}
        </div>
      )}
    </div>
  )
}

export default BirthChartShareCard
