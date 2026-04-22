import { useEffect, useRef, useState } from 'react'

/**
 * 自訂游標：金色 ✦ 跟隨鼠標，hover 在可點元素上變成空心圓環
 * 僅在 pointer: fine 的裝置啟用（桌面，非觸控）
 */
export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    // 只在桌面（滑鼠）啟用
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(pointer: fine)')
    setEnabled(mq.matches)
    const onChange = (e) => setEnabled(e.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  useEffect(() => {
    if (!enabled) return
    let rafId
    let mx = 0, my = 0, dx = 0, dy = 0, rx = 0, ry = 0

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
    }
    const tick = () => {
      // 點：幾乎即時跟上
      dx += (mx - dx) * 0.6
      dy += (my - dy) * 0.6
      // 環：有延遲（彈性）
      rx += (mx - rx) * 0.14
      ry += (my - ry) * 0.14
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dx - 6}px, ${dy - 6}px)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`
      }
      rafId = requestAnimationFrame(tick)
    }
    document.addEventListener('mousemove', onMove)
    rafId = requestAnimationFrame(tick)

    // hover 偵測
    const onOver = (e) => {
      const tag = e.target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]')
      setHovering(!!tag)
    }
    document.addEventListener('mouseover', onOver)

    // 隱藏系統游標
    document.documentElement.classList.add('custom-cursor-on')

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.documentElement.classList.remove('custom-cursor-on')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      {/* 金色小星（中心點） */}
      <span
        ref={dotRef}
        aria-hidden="true"
        className="fixed left-0 top-0 z-[9999] pointer-events-none text-gold-300 font-serif leading-none"
        style={{
          width: 12,
          height: 12,
          fontSize: 12,
          transition: 'opacity 150ms, color 200ms',
          opacity: hovering ? 0.4 : 1
        }}
      >
        ✦
      </span>

      {/* 彈性環（hover 時放大） */}
      <span
        ref={ringRef}
        aria-hidden="true"
        className="fixed left-0 top-0 z-[9998] pointer-events-none rounded-full border border-gold-300/50"
        style={{
          width: 40,
          height: 40,
          transition: 'width 250ms, height 250ms, border-color 250ms, transform-origin 0s',
          ...(hovering
            ? { width: 56, height: 56, borderColor: 'rgba(232,217,176,0.8)' }
            : {})
        }}
      />
    </>
  )
}
