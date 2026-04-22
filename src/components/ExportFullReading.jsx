import { useState } from 'react'
import { toPng } from 'html-to-image'
import { Download, Loader2, Check } from 'lucide-react'
import { trackEvent } from './Analytics.jsx'

/**
 * 整份解讀匯出為 PNG
 *
 * @param {Object} props
 *   - targetRef: React ref 指向要截圖的 element（整個結果區容器）
 *   - filename: 下載檔名（預設 vedic-reading-YYYY-MM-DD.png）
 *   - label: 按鈕文字
 *   - className: 按鈕自訂 class（預設 btn-primary）
 */
export default function ExportFullReading({
  targetRef,
  filename,
  label = '把整份解讀存成照片',
  className = 'btn-primary'
}) {
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const handleExport = async () => {
    const el = targetRef?.current
    if (!el || status === 'loading') return

    setStatus('loading')

    // 截圖前臨時調整：
    //   1) sticky 元素暫時改成 static（避免重複疊加到截圖頂部）
    //   2) scroll-reveal 內容強制可見（避免 opacity:0 被截進去）
    //   3) 等字體載完
    const undoList = []
    const stickyEls = el.querySelectorAll('.sticky')
    stickyEls.forEach((s) => {
      const prev = s.style.position
      s.style.position = 'static'
      undoList.push(() => { s.style.position = prev })
    })

    const reveals = el.querySelectorAll('.reveal:not(.in-view)')
    reveals.forEach((r) => {
      r.classList.add('in-view')
      undoList.push(() => r.classList.remove('in-view'))
    })

    // 確保字體載完再截圖
    try {
      await document.fonts?.ready
    } catch (_) {}

    // 給瀏覽器兩個 frame 重排
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))

    // 手機 canvas 上限較低（iOS Safari ~4K），降 pixelRatio 避免失敗
    const isMobile =
      typeof navigator !== 'undefined' &&
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const pixelRatio = isMobile ? 1.25 : 2

    try {
      const dataUrl = await toPng(el, {
        pixelRatio,
        backgroundColor: '#0a0806',
        cacheBust: true,
        // 過濾掉自己（按鈕不進截圖）
        filter: (node) => {
          if (node instanceof Element) {
            return !node.hasAttribute('data-export-skip')
          }
          return true
        }
      })

      const today = new Date().toISOString().slice(0, 10)
      const name = filename || `vedic-reading-${today}.png`

      // 手機優先 navigator.share（iOS/Android 可直接「儲存到相簿」）
      let sharedViaNative = false
      if (isMobile && navigator.share && navigator.canShare) {
        try {
          const blob = await (await fetch(dataUrl)).blob()
          const file = new File([blob], name, { type: 'image/png' })
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: '我的吠陀命盤解讀',
              text: '把整份解讀存成照片'
            })
            sharedViaNative = true
          }
        } catch (shareErr) {
          // 用戶取消或不支援 → 退回下載
          if (shareErr?.name !== 'AbortError') {
            console.warn('navigator.share failed, falling back to download:', shareErr)
          }
        }
      }

      // 桌面 / 手機不支援 navigator.share → 直接下載
      if (!sharedViaNative) {
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }

      trackEvent('export_full_reading_png', {
        byteLen: dataUrl.length,
        method: sharedViaNative ? 'native_share' : 'download'
      })
      setStatus('success')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (err) {
      console.error('Export full reading failed:', err)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    } finally {
      undoList.forEach((fn) => fn())
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className={className}
      disabled={status === 'loading'}
      data-export-skip
    >
      {status === 'loading' && (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          生成中…此解讀較長，請稍候
        </>
      )}
      {status === 'success' && (
        <>
          <Check className="h-4 w-4" />
          已保存完成
        </>
      )}
      {status === 'error' && '生成失敗 · 點一下重試'}
      {status === 'idle' && (
        <>
          <Download className="h-4 w-4" />
          {label}
        </>
      )}
    </button>
  )
}
