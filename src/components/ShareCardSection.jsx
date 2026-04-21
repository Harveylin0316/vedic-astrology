import { useRef, useState, cloneElement, isValidElement } from 'react'
import { toPng } from 'html-to-image'
import { Download, Share2, Check, Loader2, X, Link2 } from 'lucide-react'
import { trackEvent } from './Analytics.jsx'
import { useI18n } from '../i18n/I18nProvider.jsx'
import { copyToClipboard } from '../utils/permalink.js'

// 通用 ShareCardSection：預覽縮圖 + 下載 PNG
// 用法：<ShareCardSection filename="xxx.png" shareText="..." shareTitle="..."><Card ref={cardRef} /></ShareCardSection>
// children 必須是 forwardRef 元件（會自動接 ref）
export default function ShareCardSection({
  children,
  filename = 'vedic-chart.png',
  title,
  shareTitle,
  shareText
}) {
  const { t } = useI18n()
  const cardRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [previewImage, setPreviewImage] = useState(null) // 手機長按儲存的 modal
  const [linkCopied, setLinkCopied] = useState(false) // 「已複製連結」小 toast 狀態
  const displayTitle = title || t('share.title')

  const isMobile =
    typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  const renderCard = async () => {
    return await toPng(cardRef.current, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: '#0a0618'
    })
  }

  // iOS Safari 不支援 data URL 的 <a download> 直接下載。
  // 解法：手機端先嘗試 navigator.share（檔案），失敗則顯示 modal 讓用戶長按儲存。
  const handleDownload = async () => {
    if (!cardRef.current) return
    setStatus('loading')
    try {
      const dataUrl = await renderCard()

      if (isMobile) {
        // 手機：優先用 native share（含檔案）
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
            // 其他錯誤 → fallback 到 modal
          }
        }
        // Fallback：展示 modal，讓用戶長按儲存（iOS 標準流程）
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

  // 直接複製連結，不觸發 navigator.share（避免系統分享選單打斷節奏）
  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return
    const ok = await copyToClipboard(window.location.href)
    if (ok) {
      trackEvent('share_copy_link', { filename })
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2500)
    }
  }

  // 複製 children 並注入 ref（正確做法）
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

        {/* 隱藏的 1080×1080 卡片（實際截圖來源）+ 縮小預覽 */}
        <div className="relative mx-auto" style={{ maxWidth: '540px' }}>
          <div
            className="overflow-hidden rounded-2xl shadow-2xl border border-white/10"
            style={{
              aspectRatio: '1 / 1',
              position: 'relative'
            }}
          >
            <div
              style={{
                transform: 'scale(0.5)',
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
            className="btn-ghost min-w-[160px]"
          >
            {linkCopied ? (
              <>
                <Check className="h-4 w-4" />
                已複製連結
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4" />
                複製連結給朋友
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={status === 'loading'}
            className="btn-primary"
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
                {isMobile ? '儲存到相簿' : t('share.downloadBtn')}
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-3">
          {isMobile ? '手機端會打開預覽 → 長按圖片選「儲存影像」' : t('share.spec')}
        </p>
      </div>

      {/* 「已複製連結」小 toast（右下角浮現） */}
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

      {/* 手機長按儲存 Modal */}
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
