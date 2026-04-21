import { forwardRef } from 'react'

// 1080×1080 單人命盤分享卡 · 內容導向重新設計
// 核心理念：朋友看到卡片 → 感覺「這也太準」→ 想來算自己的
const BirthChartShareCard = forwardRef(function BirthChartShareCard(
  { chart, stamp, city, rarity, signatures = [] },
  ref
) {
  const tropAsc = chart.tropical.ascendant.rashi
  const tropSun = chart.tropical.sun.rashi
  const tropMoon = chart.tropical.moon.rashi
  const sidMoonNakshatra = chart.sidereal.moon.nakshatra

  // 取 3 個最有張力的金句（「表象 vs 真相」「循環慣性」「童年傷痕」最刺）
  const topSignatures = pickTopSignatures(signatures)

  return (
    <div
      ref={ref}
      style={{
        width: '1080px',
        height: '1080px',
        position: 'relative',
        background: '#0a0618',
        backgroundImage:
          'radial-gradient(circle at 15% 20%, rgba(255,194,102,0.18) 0%, transparent 50%),' +
          'radial-gradient(circle at 85% 80%, rgba(227,66,52,0.15) 0%, transparent 50%),' +
          'radial-gradient(ellipse at center, #140b2e 0%, #0a0618 100%)',
        color: '#e2e8f0',
        fontFamily: 'Inter, system-ui, sans-serif',
        overflow: 'hidden',
        padding: '56px 60px 48px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 背景曼陀羅 */}
      <svg
        viewBox="0 0 800 800"
        style={{
          position: 'absolute',
          top: '50%',
          right: '-200px',
          transform: 'translateY(-50%)',
          width: '700px',
          height: '700px',
          opacity: 0.06,
          pointerEvents: 'none'
        }}
      >
        <circle cx="400" cy="400" r="380" fill="none" stroke="#ffc266" strokeWidth="1" strokeDasharray="3 10" />
        <circle cx="400" cy="400" r="300" fill="none" stroke="#ffc266" strokeWidth="1" />
        <circle cx="400" cy="400" r="220" fill="none" stroke="#ffc266" strokeWidth="1" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 - 90) * (Math.PI / 180)
          const x1 = 400 + Math.cos(a) * 220
          const y1 = 400 + Math.sin(a) * 220
          const x2 = 400 + Math.cos(a) * 380
          const y2 = 400 + Math.sin(a) * 380
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffc266" strokeWidth="1" />
        })}
      </svg>

      {/* 頂部 Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 1 }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ffc266, #e34234)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'serif',
            fontSize: '28px',
            color: '#0a0618',
            fontWeight: 'bold'
          }}
        >
          ॐ
        </div>
        <div style={{ lineHeight: 1.1 }}>
          <div
            style={{
              fontSize: '26px',
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
          <div style={{ fontSize: '11px', letterSpacing: '0.22em', color: '#94a3b8', textTransform: 'uppercase' }}>
            My Vedic Chart
          </div>
        </div>

        {rarity && (
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 16px',
              borderRadius: '999px',
              background: 'rgba(255,194,102,0.12)',
              border: '1.5px solid rgba(255,194,102,0.4)',
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{ fontSize: '13px', color: '#ffa733', fontWeight: 500 }}>
              Top {rarity.topPercent}%
            </span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>·</span>
            <span style={{ fontSize: '13px', color: '#ffc266', fontWeight: 600 }}>
              稀有度 {rarity.score}
            </span>
          </div>
        )}
      </div>

      {/* 三大星位（小） */}
      <div
        style={{
          marginTop: '32px',
          display: 'flex',
          gap: '28px',
          justifyContent: 'center',
          zIndex: 1
        }}
      >
        <StarInline label="上升" symbol={tropAsc.symbol} chinese={tropAsc.chinese} />
        <StarInline label="太陽" symbol={tropSun.symbol} chinese={tropSun.chinese} />
        <StarInline label="月亮" symbol={tropMoon.symbol} chinese={tropMoon.chinese} extra={sidMoonNakshatra?.name} />
      </div>

      {/* 核心：金句主角 */}
      <div
        style={{
          marginTop: '40px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          zIndex: 1
        }}
      >
        <div
          style={{
            textAlign: 'center',
            fontSize: '15px',
            color: '#94a3b8',
            letterSpacing: '0.2em',
            marginBottom: '28px',
            textTransform: 'uppercase'
          }}
        >
          關於你的 {topSignatures.length} 件事
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {topSignatures.map((s, i) => (
            <SignatureBlock key={i} type={s.type} text={s.text} emoji={['🪞', '🔁', '🩹', '🎭', '⏳'][i] || '✦'} />
          ))}
        </div>
      </div>

      {/* 底部 */}
      <div
        style={{
          marginTop: '32px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 1
        }}
      >
        <div style={{ fontSize: '12px', color: '#64748b' }}>
          {stamp && <span>{stamp}</span>}
          {city && <span style={{ marginLeft: '12px' }}>· {city}</span>}
        </div>
        <div
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#ffc266',
            textAlign: 'right'
          }}
        >
          <div>你呢？來算自己的命盤</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', fontWeight: 400 }}>
            Sidereal · Lahiri Ayanamsha
          </div>
        </div>
      </div>
    </div>
  )
})

// 金句區塊 — 卡片的主角
function SignatureBlock({ type, text, emoji }) {
  return (
    <div
      style={{
        padding: '20px 24px',
        borderRadius: '18px',
        background: 'rgba(255,194,102,0.06)',
        borderLeft: '3px solid #ffc266',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px'
      }}
    >
      <div style={{ fontSize: '28px', flexShrink: 0, lineHeight: 1 }}>{emoji}</div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: '#ffc266',
            fontWeight: 600,
            textTransform: 'uppercase',
            marginBottom: '6px'
          }}
        >
          {type}
        </div>
        <div
          style={{
            fontSize: '22px',
            lineHeight: 1.45,
            color: '#f1f5f9',
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontWeight: 500
          }}
        >
          {text}
        </div>
      </div>
    </div>
  )
}

// 單個星座標籤（橫向排）
function StarInline({ label, symbol, chinese, extra }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 18px',
        borderRadius: '999px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,194,102,0.25)'
      }}
    >
      <span style={{ fontSize: '22px', lineHeight: 1 }}>{symbol}</span>
      <div style={{ lineHeight: 1.2 }}>
        <div style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '0.1em' }}>{label}</div>
        <div
          style={{
            fontSize: '16px',
            color: '#e2e8f0',
            fontWeight: 500,
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            whiteSpace: 'nowrap'
          }}
        >
          {chinese}
          {extra && <span style={{ fontSize: '10px', color: '#64748b', marginLeft: '6px' }}>· {extra}</span>}
        </div>
      </div>
    </div>
  )
}

// 從 5 個必殺句型中挑 3 個最有張力的，優先順序：
// 表象 vs 真相 > 循環慣性 > 童年傷痕 > 相反吸引 > 延遲反應
function pickTopSignatures(signatures) {
  if (!signatures || signatures.length === 0) return []
  const priority = ['表象 vs 真相', '循環慣性', '童年傷痕', '相反吸引', '延遲反應']
  const sorted = [...signatures].sort(
    (a, b) => priority.indexOf(a.type) - priority.indexOf(b.type)
  )
  return sorted.slice(0, 3)
}

export default BirthChartShareCard
