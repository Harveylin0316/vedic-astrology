import { useRef, useState, useEffect, cloneElement, isValidElement } from 'react'
import { toPng } from 'html-to-image'
import { Download, Share2, Check, Loader2, X, Link2 } from 'lucide-react'
import { trackEvent } from './Analytics.jsx'
import { useI18n } from '../i18n/I18nProvider.jsx'
import { copyToClipboard } from '../utils/permalink.js'

// 通用 ShareCardSection：預覽縮圖 + 下載 PNG + 複製連結
export default function ShareCardSection({
  children,
  filename = 'vedic-chart.png',
  title,
  shareTitle,
  shareText
}) {
  const { t } = useI18n()
  const cardRef = useRef(null)
  const previewWrapperRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [previewImage, setPreviewImage] = useState(null) // fallback modal
  const [linkCopied, setLinkCopied] = useState(false)
  const [scale, setScale] = useState(0.5)
  const displayTitle = title || t('share.title')

  const isMobile =
    typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  // 🔧 Responsive scale — 依預覽容器寬度動態計算（修正手機跑版）
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined' || !previewWrapperRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width
        if (w > 0) setScale(w / 1080)
      }
    })
    observer.observe(previewWrapperRef.current)
    return () => observer.disconnect()
  }, [])

  const renderCard = async () => {
    return await toPng(cardRef.current, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: '#0a0618'
    })
  }

  const handleDownload = async () => {
    if (!cardRef.current) return
    setStatus('loading')
    try {
      const dataUrl = await renderCard()

      if (isMobile) {
        // 手機：用 navigator.share 觸發系統分享單 → 用戶選「儲存到相簿」一步完成
        if (navigator.share && navigator.canShare) {
          try {
            const blob = await (await fetch(dataUrl)).blob()
            const file = new File([blob], filename, { type: 'image/png' })
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                title: shareTitle || '我的吠陀命盤',
                text: shareText || '我剛算了自己的吠陀命盤'
              })
              trackEvent('native_share', { filename, origin: 'download_btn' })
              setStatus('idle')
              return
            }
          } catch (shareErr) {
            if (shareErr.name === 'AbortError') {
              setStatus('idle')
              return
            }
          }
        }
        // 不支援 navigator.share 的舊手機 → modal fallback
        setPreviewImage(dataUrl)
        setStatus('idle')
        trackEvent('mobile_longpress_modal', { filename })
        return
      }

      // 桌面：直接下載
      const link = document.createElement('a')
      link.download = filename
      link.href = dataUrl
      link.click()
      trackEvent('download_share_card', { filename })
      setStatus('success')
      setTimeout(() => setStatus('idle'), 2000)
    } catch (err) {
      console.error('Download failed:', err)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2500)
    }
  }

  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return
    const ok = await copyToClipboard(window.location.href)
    if (ok) {
      trackEvent('share_copy_link', { filename })
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2500)
    }
  }

  const childWithRef = isValidElement(children) ? cloneElement(children, { ref: cardRef }) : children

  return (
    <>
      <div className="glass-panel p-6 text-center">
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-saffron-400 mb-2">
          <Share2 className="h-4 w-4" />
          {t('share.title')}
        </div>
        <h3 className="font-serif text-2xl gradient-text mb-4">{displayTitle}</h3>
        <p className="text-sm text-slate-400 mb-5 max-w-md mx-auto leading-relaxed">
          {t('share.description')}
        </p>

        {/* 預覽縮圖 — 使用 ResizeObserver 動態 scale 修正手機跑版 */}
        <div
          ref={previewWrapperRef}
          className="relative mx-auto w-full"
          style={{ maxWidth: '540px' }}
        >
          <div
            className="overflow-hidden rounded-2xl shadow-2xl border border-white/10 relative"
            style={{ aspectRatio: '1 / 1' }}
          >
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                width: '1080px',
                height: '1080px',
                position: 'absolute',
                top: 0,
                left: 0
              }}
            >
              {childWithRef}
            </div>
          </div>
        </div>

        {/* 行動按鈕 */}
        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleCopyLink}
            disabled={linkCopied}
            className="btn-ghost min-w-[140px]"
          >
            {linkCopied ? (
              <>
                <Check className="h-4 w-4" />
                已複製連結
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4" />
                複製連結
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={status === 'loading'}
            className="btn-primary min-w-[120px]"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('share.downloadingBtn')}
              </>
            ) : status === 'success' ? (
              <>
                <Check className="h-4 w-4" />
                {t('share.downloadedBtn')}
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                下載
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-3">
          {isMobile ? '手機端會跳系統分享 → 選「儲存影像」即可存到相簿' : t('share.spec')}
        </p>
      </div>

      {/* 「已複製連結」小 toast */}
      {linkCopied && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-emerald-500/95 text-white px-5 py-2.5 text-sm font-medium shadow-xl flex items-center gap-2 animate-[fadeIn_0.2s_ease-out]"
          role="status"
          aria-live="polite"
        >
          <Check className="h-4 w-4" />
          已複製連結
        </div>
      )}

      {/* fallback：不支援 navigator.share 的舊手機才會打到這裡 */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 overflow-auto"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
            aria-label="關閉"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="w-full max-w-md flex flex-col items-center">
            <div className="rounded-xl border border-saffron-500/40 bg-saffron-500/10 px-4 py-3 mb-5 text-center">
              <p className="text-sm text-saffron-300 font-medium leading-relaxed">
                📱 長按下方圖片
              </p>
              <p className="text-xs text-slate-300 mt-1">
                選「儲存影像」即可存到相簿
              </p>
            </div>

            <img
              src={previewImage}
              alt="命盤分享卡"
              className="w-full rounded-2xl shadow-2xl border border-white/10"
              style={{ touchAction: 'manipulation' }}
            />

            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="mt-5 btn-ghost"
            >
              完成了、關閉
            </button>
          </div>
        </div>
      )}
    </>
  )
}
