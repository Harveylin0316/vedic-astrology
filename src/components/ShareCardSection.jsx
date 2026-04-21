import { useRef, useState, cloneElement, isValidElement } from 'react'
import { toPng } from 'html-to-image'
import { Download, Share2, Check, Loader2 } from 'lucide-react'

// 通用 ShareCardSection：預覽縮圖 + 下載 PNG
// 用法：<ShareCardSection filename="xxx.png"><Card ref={cardRef} /></ShareCardSection>
// children 必須是 forwardRef 元件（會自動接 ref）
export default function ShareCardSection({ children, filename = 'vedic-chart.png', title = '分享你的結果' }) {
  const cardRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const handleDownload = async () => {
    if (!cardRef.current) return
    setStatus('loading')
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#0a0618'
      })
      const link = document.createElement('a')
      link.download = filename
      link.href = dataUrl
      link.click()
      setStatus('success')
      setTimeout(() => setStatus('idle'), 2000)
    } catch (err) {
      console.error('Download failed:', err)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2500)
    }
  }

  const handleNativeShare = async () => {
    if (!navigator.share || !cardRef.current) return
    setStatus('loading')
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#0a0618'
      })
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], filename, { type: 'image/png' })
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: '我的吠陀命盤',
          text: '我剛算了自己的吠陀命盤'
        })
      } else {
        // fallback：下載
        await handleDownload()
      }
      setStatus('idle')
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err)
      setStatus('idle')
    }
  }

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share

  // 複製 children 並注入 ref（正確做法）
  const childWithRef = isValidElement(children) ? cloneElement(children, { ref: cardRef }) : children

  return (
    <div className="glass-panel p-6 text-center">
      <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-saffron-400 mb-2">
        <Share2 className="h-4 w-4" />
        分享你的結果
      </div>
      <h3 className="font-serif text-2xl gradient-text mb-4">{title}</h3>
      <p className="text-sm text-slate-400 mb-5 max-w-md mx-auto leading-relaxed">
        下載這張 1080×1080 方形圖，直接發 IG、小紅書、朋友圈、LINE 群 — 讓你的朋友也想來算一次。
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
        {hasNativeShare && (
          <button
            type="button"
            onClick={handleNativeShare}
            disabled={status === 'loading'}
            className="btn-ghost"
          >
            <Share2 className="h-4 w-4" />
            分享給朋友
          </button>
        )}
        <button
          type="button"
          onClick={handleDownload}
          disabled={status === 'loading'}
          className="btn-primary"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              產圖中...
            </>
          ) : status === 'success' ? (
            <>
              <Check className="h-4 w-4" />
              已下載
            </>
          ) : status === 'error' ? (
            <>下載失敗</>
          ) : (
            <>
              <Download className="h-4 w-4" />
              下載分享圖
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-slate-500 mt-3">
        圖片格式：PNG · 尺寸 1080×1080（IG 標準）
      </p>
    </div>
  )
}
