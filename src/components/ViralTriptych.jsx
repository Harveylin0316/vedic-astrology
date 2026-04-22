import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { Download, Loader2, Check } from 'lucide-react'
import QRCode from 'qrcode'
import { trackEvent } from './Analytics.jsx'
import {
  lagnaPunchlines,
  sunPunchlines,
  moonPunchlines,
  nakshatraPunchlines
} from '../data/cardPunchlines.js'

/**
 * 病毒三聯卡 · IG / 小紅書 ready
 *
 * 三張 1080×1080 方形卡片，各一個 hook：
 *   1. Love — 愛情 · 月亮主題 hook
 *   2. Career — 事業 · Karmesh + Pyramid primary
 *   3. Rarity — 稀有度 · Top X% 社交貨幣
 *
 * 一鍵下載全部（依序 toPng，觸發 3 次 download）
 */
export default function ViralTriptych({ chart, persona, rarity, vedicCareer, astrologerNote, shareUrl }) {
  const loveRef = useRef(null)
  const careerRef = useRef(null)
  const rarityRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  if (!chart) return null

  const effectiveUrl = shareUrl ||
    (typeof window !== 'undefined' ? window.location.href : 'https://vedic-astrology.netlify.app/')

  // 資料提取
  const moonRashi = chart.tropical?.moon?.rashi?.name
  const sunRashi = chart.tropical?.sun?.rashi?.name
  const lagnaRashi = chart.tropical?.ascendant?.rashi?.name
  const moonNak = chart.sidereal?.moon?.nakshatra

  // Hook 文案
  const loveHook = moonPunchlines[moonRashi] || '你的愛情模式，跟別人真的不一樣'
  const loveSubhook = moonNak?.name
    ? (nakshatraPunchlines[moonNak.name] || '')
    : (lagnaPunchlines[lagnaRashi] || '')

  const careerMainStatement = vedicCareer?.narrative?.mainStatement
  const careerHook = careerMainStatement || sunPunchlines[sunRashi] || '你在什麼位置時最發光'
  const careerSubhook = (() => {
    const k = vedicCareer?.karmesh
    if (!k?.planet || !k?.house) return ''
    return `10 宮主 ${ZH_PLANET[k.planet] || k.planet} 落第 ${k.house} 宮`
  })()

  const rarityHook = rarity?.title
    ? `我是 ${rarity.title}`
    : '你這種命盤組合比你想的稀有'
  const rarityFeatures = (rarity?.features || [])
    .slice(0, 3)
    .map((f) => f.plain || f.name)
    .filter(Boolean)

  const handleDownloadAll = async () => {
    if (status === 'loading') return
    setStatus('loading')

    const isMobile =
      typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const pixelRatio = isMobile ? 1.5 : 2

    const specs = [
      { ref: loveRef, name: 'vedic-love' },
      { ref: careerRef, name: 'vedic-career' },
      { ref: rarityRef, name: 'vedic-rarity' }
    ]

    try {
      // 等字體載完
      try { await document.fonts?.ready } catch (_) {}
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))

      const today = new Date().toISOString().slice(0, 10)
      for (let i = 0; i < specs.length; i++) {
        const { ref, name } = specs[i]
        if (!ref.current) continue
        const dataUrl = await toPng(ref.current, {
          pixelRatio,
          backgroundColor: '#0a0806',
          cacheBust: true
        })
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = `${name}-${today}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        // 讓瀏覽器喘口氣，避免 block
        await new Promise((r) => setTimeout(r, 250))
      }

      trackEvent('viral_triptych_download_all', { rarity: rarity?.topPercent })
      setStatus('success')
      setTimeout(() => setStatus('idle'), 3500)
    } catch (err) {
      console.error('Triptych export failed:', err)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  // 預覽縮放：1080 → 320 寬（桌面可並排 3 張）
  const PREVIEW_SCALE = 0.3

  return (
    <section className="relative py-16 md:py-20 px-6 md:px-10 border-y border-gold-500/15 bg-ink-900/30">
      {/* 章節 header */}
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="chapter-eyebrow mb-3">Triptychon</div>
          <h3
            className="font-serif text-gold-200 tracking-tight leading-[0.95]"
            style={{
              fontSize: 'clamp(28px, 4.5vw, 60px)',
              fontWeight: 500,
              fontVariationSettings: '"opsz" 144, "wght" 500'
            }}
          >
            三聯肖像
          </h3>
          <div className="flex items-center justify-center gap-4 mt-6 text-gold-400/50">
            <span className="h-px w-20 bg-gold-500/30" />
            <span className="font-serif text-sm">✦</span>
            <span className="h-px w-20 bg-gold-500/30" />
          </div>
          <p className="epigraph max-w-xl mx-auto mt-4">
            你命盤的三個切面 — 月亮、太陽、與你自己。
          </p>
        </div>

        {/* 預覽區：3 張卡並排（桌面）/ 垂直（手機） */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-4 justify-center items-center mb-10">
          <CardPreviewWrapper scale={PREVIEW_SCALE}>
            <TriptychCard
              ref={loveRef}
              variant="love"
              hook={loveHook}
              subhook={loveSubhook}
              chart={chart}
              shareUrl={effectiveUrl}
            />
          </CardPreviewWrapper>
          <CardPreviewWrapper scale={PREVIEW_SCALE}>
            <TriptychCard
              ref={careerRef}
              variant="career"
              hook={careerHook}
              subhook={careerSubhook}
              chart={chart}
              shareUrl={effectiveUrl}
            />
          </CardPreviewWrapper>
          <CardPreviewWrapper scale={PREVIEW_SCALE}>
            <TriptychCard
              ref={rarityRef}
              variant="rarity"
              hook={rarityHook}
              subhook={rarityFeatures.join(' · ')}
              chart={chart}
              rarity={rarity}
              shareUrl={effectiveUrl}
            />
          </CardPreviewWrapper>
        </div>

        {/* 下載按鈕 */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleDownloadAll}
            className="btn-primary min-w-[280px]"
            disabled={status === 'loading'}
          >
            {status === 'loading' && (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                生成中…
              </>
            )}
            {status === 'success' && (
              <>
                <Check className="h-4 w-4" />
                已下載三張
              </>
            )}
            {status === 'error' && '失敗 · 點一下重試'}
            {status === 'idle' && (
              <>
                <Download className="h-4 w-4" />
                保存三聯肖像
              </>
            )}
          </button>
          <p className="mt-3 font-caps text-[10px] uppercase tracking-[0.4em] text-gold-500/60">
            1080 × 1080 · PNG × 3
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── 預覽縮放容器 ───────────────────────────
function CardPreviewWrapper({ scale, children }) {
  return (
    <div
      className="relative overflow-hidden rounded-sm shadow-2xl shadow-black/50 border border-gold-500/15"
      style={{
        width: `${1080 * scale}px`,
        height: `${1080 * scale}px`
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: '1080px',
          height: '1080px'
        }}
      >
        {children}
      </div>
    </div>
  )
}

// ─── 單張卡片（導出級 1080×1080） ───────────
import { forwardRef } from 'react'

const ZH_PLANET = {
  Sun: '太陽', Moon: '月亮', Mars: '火星', Mercury: '水星',
  Jupiter: '木星', Venus: '金星', Saturn: '土星', Rahu: '北交', Ketu: '南交'
}

const VARIANT_META = {
  love: {
    eyebrow: 'CH. IV · PREMA',
    title: '愛情 · Amor',
    sanskrit: 'प्रेम',
    accent: '#b12d20',
    accentSoft: 'rgba(177,45,32,0.15)'
  },
  career: {
    eyebrow: 'CH. V · KARMA',
    title: '事業 · Opus',
    sanskrit: 'कर्म',
    accent: '#c9a961',
    accentSoft: 'rgba(201,169,97,0.15)'
  },
  rarity: {
    eyebrow: 'RARITAS',
    title: '稀有度 · Raritas',
    sanskrit: 'दुर्लभ',
    accent: '#e8d9b0',
    accentSoft: 'rgba(232,217,176,0.18)'
  }
}

const TriptychCard = forwardRef(function TriptychCard(
  { variant = 'love', hook, subhook, chart, rarity, shareUrl },
  ref
) {
  const meta = VARIANT_META[variant] || VARIANT_META.love

  const moonRashi = chart?.tropical?.moon?.rashi?.chinese
  const sunRashi = chart?.tropical?.sun?.rashi?.chinese
  const lagnaRashi = chart?.tropical?.ascendant?.rashi?.chinese

  const displayUrl = shareUrl.replace(/^https?:\/\//, '').replace(/\/$/, '').split('?')[0]

  return (
    <div
      ref={ref}
      style={{
        width: '1080px',
        height: '1080px',
        position: 'relative',
        background: '#0a0806',
        backgroundImage:
          'radial-gradient(ellipse at 20% 10%, rgba(201,169,97,0.10) 0%, transparent 55%),' +
          'radial-gradient(ellipse at 80% 90%, ' + meta.accentSoft + ' 0%, transparent 55%),' +
          'linear-gradient(180deg, #141210 0%, #0a0806 100%)',
        color: '#f5ecd9',
        fontFamily: '"Fraunces", "EB Garamond", "Noto Serif TC", Georgia, serif',
        overflow: 'hidden',
        padding: '80px 80px 72px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        letterSpacing: '-0.01em'
      }}
    >
      {/* 大型 Devanagari 裝飾（對角） */}
      <div
        style={{
          position: 'absolute',
          right: '-40px',
          bottom: '-80px',
          fontSize: '340px',
          fontFamily: '"Noto Serif Devanagari", serif',
          color: 'rgba(201, 169, 97, 0.06)',
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      >
        {meta.sanskrit}
      </div>

      {/* 頂部：品牌 + Volume */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              border: '1px solid #c9a961',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: '"Noto Serif Devanagari", serif',
              fontSize: '18px',
              color: '#c9a961'
            }}
          >
            ॐ
          </div>
          <div
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '12px',
              letterSpacing: '0.4em',
              color: '#c9a961',
              textTransform: 'uppercase'
            }}
          >
            Vedic&nbsp;Astrology
          </div>
        </div>
        <div
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '11px',
            letterSpacing: '0.4em',
            color: 'rgba(201,169,97,0.65)',
            textTransform: 'uppercase'
          }}
        >
          {meta.eyebrow}
        </div>
      </div>

      {/* Ornament line */}
      <div
        style={{
          marginTop: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          color: 'rgba(201,169,97,0.5)',
          zIndex: 2
        }}
      >
        <span style={{ height: '1px', flex: 1, background: 'rgba(201,169,97,0.3)' }} />
        <span style={{ fontSize: '16px' }}>✦</span>
        <span style={{ height: '1px', flex: 1, background: 'rgba(201,169,97,0.3)' }} />
      </div>

      {/* Variant title */}
      <div
        style={{
          marginTop: '32px',
          fontFamily: 'Cinzel, serif',
          fontSize: '16px',
          letterSpacing: '0.35em',
          color: meta.accent,
          textTransform: 'uppercase',
          zIndex: 2
        }}
      >
        {meta.title}
      </div>

      {/* HERO HOOK — 大字 */}
      <div
        style={{
          marginTop: '44px',
          zIndex: 2,
          flex: 1
        }}
      >
        {/* 裝飾引號 */}
        <div
          style={{
            fontSize: '140px',
            fontFamily: 'Fraunces, Georgia, serif',
            lineHeight: 0.7,
            color: 'rgba(201,169,97,0.22)',
            marginBottom: '-20px'
          }}
        >
          “
        </div>

        <p
          style={{
            fontSize: variant === 'rarity' ? '96px' : '76px',
            fontFamily: 'Fraunces, "EB Garamond", "Noto Serif TC", serif',
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
            color: '#f5ecd9',
            margin: 0,
            maxWidth: '100%',
            wordBreak: 'break-word'
          }}
        >
          {hook}
        </p>

        {subhook && (
          <p
            style={{
              marginTop: '36px',
              fontSize: '28px',
              fontFamily: '"EB Garamond", "Noto Serif TC", Georgia, serif',
              fontStyle: 'italic',
              color: 'rgba(245,236,217,0.72)',
              lineHeight: 1.5,
              letterSpacing: '0.01em'
            }}
          >
            — {subhook}
          </p>
        )}
      </div>

      {/* 底部：placement + URL */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '28px',
          borderTop: '1px solid rgba(201,169,97,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          zIndex: 2
        }}
      >
        {/* Placements */}
        <div
          style={{
            fontSize: '15px',
            color: 'rgba(245,236,217,0.7)',
            letterSpacing: '0.02em',
            lineHeight: 1.6
          }}
        >
          <div style={{ color: 'rgba(201,169,97,0.55)', fontFamily: 'Cinzel, serif', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '6px' }}>
            Placements
          </div>
          <span style={{ color: 'rgba(201,169,97,0.55)' }}>上升</span>{' '}
          <span style={{ color: '#c9a961' }}>{lagnaRashi}</span>
          <span style={{ color: 'rgba(201,169,97,0.4)', margin: '0 10px' }}>·</span>
          <span style={{ color: 'rgba(201,169,97,0.55)' }}>日</span>{' '}
          <span style={{ color: '#c9a961' }}>{sunRashi}</span>
          <span style={{ color: 'rgba(201,169,97,0.4)', margin: '0 10px' }}>·</span>
          <span style={{ color: 'rgba(201,169,97,0.55)' }}>月</span>{' '}
          <span style={{ color: '#c9a961' }}>{moonRashi}</span>
        </div>

        {/* QR */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flexShrink: 0
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontFamily: '"EB Garamond", serif',
                fontStyle: 'italic',
                fontSize: '20px',
                color: '#c9a961',
                lineHeight: 1.1
              }}
            >
              30 秒算你的
            </div>
            <div
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '10px',
                letterSpacing: '0.3em',
                color: 'rgba(245,236,217,0.5)',
                marginTop: '6px',
                textTransform: 'uppercase'
              }}
            >
              {displayUrl}
            </div>
          </div>
          <div style={{ padding: '6px', background: '#e8d9b0' }}>
            <QrSvg value={shareUrl} size={80} />
          </div>
        </div>
      </div>
    </div>
  )
})

// QR SVG
function QrSvg({ value, size = 80 }) {
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
            fill="#0a0806"
          />
        )
      }
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <rect width={size} height={size} fill="#e8d9b0" />
      {rects}
    </svg>
  )
}
