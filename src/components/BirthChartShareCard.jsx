import { forwardRef } from 'react'
import QRCode from 'qrcode'

// 1080×1080 命盤分享卡 · Postcard / 引述卡風格
// 目標：擺脫報告感、保留病毒傳播核心元素
//   · 軸心洞察（HUGE quote）→ 最可分享的「被看穿」時刻
//   · 殼×芯 catchphrase → 身份標籤（attribution）
//   · 3 條 punchlines → 朋友看了會問的戳點
//   · Top X% → 社交貨幣
//   · QR / URL / CTA → 朋友轉化入口
const BirthChartShareCard = forwardRef(function BirthChartShareCard(
  {
    chart,
    persona,
    stamp,
    city,
    rarity,
    punchlines = [],
    axisInsight,
    shareUrl
  },
  ref
) {
  const effectiveShareUrl =
    shareUrl ||
    (typeof window !== 'undefined' ? window.location.href : 'https://vedic-astrology.netlify.app/')
  const displayUrl = effectiveShareUrl
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
    .split('?')[0]

  const tropAsc = chart.tropical.ascendant.rashi
  const tropSun = chart.tropical.sun.rashi
  const tropMoon = chart.tropical.moon.rashi
  const moonNak = chart.sidereal.moon.nakshatra
  const catchphrase = persona?.primary || ''

  // 最多顯示 3 條 punchlines（當 quote 用，不標號）
  const quotedLines = punchlines.slice(0, 3)

  // 找一句「主 hero quote」：優先用 axis insight，否則退回 catchphrase
  const heroQuote = axisInsight || catchphrase

  // QR 旁的 CTA 依稀有度動態變化（挑釁勝於通用）
  const qrCta = (() => {
    const top = rarity?.topPercent
    if (!top) return '30 秒算你的'
    if (top < 2) return '看你是不是也這種人'
    if (top < 10) return '換你試，30 秒'
    return '不服？換你來算'
  })()

  return (
    <div
      ref={ref}
      style={{
        width: '1080px',
        height: '1080px',
        position: 'relative',
        background: '#0a0618',
        backgroundImage:
          'radial-gradient(ellipse at 15% 8%, rgba(255,194,102,0.14) 0%, transparent 55%),' +
          'radial-gradient(ellipse at 85% 92%, rgba(227,66,52,0.12) 0%, transparent 60%),' +
          'linear-gradient(180deg, #1a0e36 0%, #0a0618 80%)',
        color: '#e2e8f0',
        fontFamily: '"PingFang TC", "Noto Sans TC", "Microsoft JhengHei", Inter, system-ui, sans-serif',
        overflow: 'hidden',
        padding: '68px 80px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* ═══ 頂部：極小品牌標 + 日期 ═══ */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffc266, #e34234)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'serif',
              fontSize: '16px',
              color: '#0a0618',
              fontWeight: 700
            }}
          >
            ॐ
          </div>
          <div style={{ fontSize: '13px', color: '#94a3b8', letterSpacing: '0.05em' }}>
            吠陀命盤 · Vedic
          </div>
        </div>
        <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'right', lineHeight: 1.5 }}>
          {stamp && <div>{stamp}</div>}
          {city && <div>{city}</div>}
        </div>
      </div>

      {/* ═══ 中央：軸心 quote（hero） + 殼×芯 attribution ═══ */}
      <div
        style={{
          marginTop: '78px',
          zIndex: 2
        }}
      >
        {/* 左側裝飾引號 */}
        <div
          style={{
            fontSize: '120px',
            fontFamily: 'Georgia, serif',
            lineHeight: 0.8,
            color: 'rgba(255,194,102,0.25)',
            marginBottom: '-40px'
          }}
        >
          “
        </div>

        <p
          style={{
            fontSize: '62px',
            fontFamily: '"Cormorant Garamond", "Source Han Serif TC", Georgia, serif',
            fontWeight: 500,
            lineHeight: 1.25,
            letterSpacing: '0.01em',
            color: '#f1f5f9',
            margin: 0,
            maxWidth: '100%',
            wordBreak: 'break-word'
          }}
        >
          {heroQuote}
        </p>

        {/* 殼×芯 catchphrase 當 attribution（小一級） */}
        {catchphrase && heroQuote !== catchphrase && (
          <div
            style={{
              marginTop: '28px',
              fontSize: '26px',
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              background: 'linear-gradient(90deg, #ffd580, #ffa733)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '0.03em'
            }}
          >
            — {catchphrase}
          </div>
        )}
      </div>

      {/* ═══ 3 條 punchlines 當 quote list（無標號、無卡片） ═══ */}
      {quotedLines.length > 0 && (
        <div
          style={{
            marginTop: '60px',
            paddingLeft: '8px',
            borderLeft: '2px solid rgba(255,194,102,0.35)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            zIndex: 2
          }}
        >
          {quotedLines.map((line, i) => (
            <p
              key={i}
              style={{
                margin: 0,
                paddingLeft: '22px',
                fontSize: '22px',
                lineHeight: 1.45,
                color: '#e2e8f0',
                fontFamily: '"Source Han Serif TC", "PingFang TC", serif'
              }}
            >
              {line}
            </p>
          ))}
        </div>
      )}

      {/* ═══ 底部：placements + rarity + QR（一體化） ═══ */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '28px',
          zIndex: 2
        }}
      >
        {/* Placements 一行 */}
        <div
          style={{
            fontSize: '16px',
            color: '#cbd5e1',
            letterSpacing: '0.02em',
            paddingBottom: '18px',
            borderBottom: '1px solid rgba(255,194,102,0.18)'
          }}
        >
          <span style={{ color: '#94a3b8' }}>上升</span>{' '}
          <span style={{ color: '#ffc266', marginRight: '18px' }}>{tropAsc.chinese}</span>
          <span style={{ color: '#94a3b8' }}>太陽</span>{' '}
          <span style={{ color: '#ffc266', marginRight: '18px' }}>{tropSun.chinese}</span>
          <span style={{ color: '#94a3b8' }}>月亮</span>{' '}
          <span style={{ color: '#ffc266' }}>
            {tropMoon.chinese}
            {moonNak?.name && (
              <span style={{ color: '#94a3b8', fontSize: '13px', marginLeft: '8px' }}>
                · {moonNak.name} Pada {moonNak.pada}
              </span>
            )}
          </span>
        </div>

        {/* Rarity + QR 一排 */}
        <div
          style={{
            marginTop: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
          }}
        >
          {/* 左：Rarity */}
          {rarity && (
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: '58px',
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontWeight: 700,
                  lineHeight: 1,
                  background: 'linear-gradient(135deg, #ffd580 0%, #ffa733 40%, #e34234 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent',
                  letterSpacing: '-0.01em'
                }}
              >
                Top {rarity.topPercent}%
              </div>
              <div
                style={{
                  marginTop: '6px',
                  fontSize: '15px',
                  color: '#cbd5e1',
                  letterSpacing: '0.02em'
                }}
              >
                {rarity.title}
                <span style={{ color: '#64748b' }}> · </span>
                <span style={{ color: '#94a3b8' }}>{rarity.note}</span>
              </div>
            </div>
          )}

          {/* 右：QR + URL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontSize: '18px',
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  color: '#ffc266',
                  fontWeight: 600,
                  lineHeight: 1.2
                }}
              >
                {qrCta}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: '#94a3b8',
                  marginTop: '4px',
                  letterSpacing: '0.01em',
                  fontFamily: 'Inter, system-ui, sans-serif'
                }}
              >
                {displayUrl}
              </div>
            </div>
            <div
              style={{
                padding: '6px',
                background: '#ffd580',
                borderRadius: '6px',
                display: 'flex'
              }}
            >
              <QrSvg value={effectiveShareUrl} size={84} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

// ═══════════════════════ QR SVG（同步渲染，html-to-image 友好） ═══════════════════════
function QrSvg({ value, size = 84 }) {
  if (!value) return null
  let qr
  try {
    qr = QRCode.create(value, { errorCorrectionLevel: 'M' })
  } catch {
    return null
  }
  const count = qr.modules.size
  const cellSize = size / count
  const rects = []
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (qr.modules.get(r, c)) {
        rects.push(
          <rect
            key={`${r}-${c}`}
            x={c * cellSize}
            y={r * cellSize}
            width={cellSize + 0.5}
            height={cellSize + 0.5}
            fill="#0a0618"
          />
        )
      }
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <rect width={size} height={size} fill="#ffd580" />
      {rects}
    </svg>
  )
}

export default BirthChartShareCard
