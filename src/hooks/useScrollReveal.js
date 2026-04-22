import { useEffect, useRef } from 'react'

/**
 * Scroll-triggered reveal — 對 element 加上 .in-view 當它進入視窗
 * 搭配 CSS `.reveal` 與 `.reveal.in-view` 規則使用
 *
 * @param {Object} options
 *   - threshold: IntersectionObserver threshold（0-1，預設 0.15）
 *   - once: true 則只 trigger 一次（預設 true）
 * @returns ref 綁在目標 element 上
 */
export function useScrollReveal({ threshold = 0.15, once = true } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      // 不支援 IO 就直接顯示
      el?.classList.add('in-view')
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            if (once) io.unobserve(entry.target)
          } else if (!once) {
            entry.target.classList.remove('in-view')
          }
        }
      },
      { threshold, rootMargin: '0px 0px -10% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, once])

  return ref
}
