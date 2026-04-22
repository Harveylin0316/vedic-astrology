import { useEffect } from 'react'
import { trackEvent } from '../components/Analytics.jsx'

/**
 * 用 IntersectionObserver 偵測 sub-section 進入視窗，送 GA `section_viewed` 事件。
 * 每個 id 只送一次（seen Set 去重），避免滾來滾去重複送事件。
 *
 * @param {string[]} ids     - 要追的 DOM element id 陣列
 * @param {boolean}  enabled - 何時開啟（通常是 chart 計算完、DOM render 後）
 * @param {number}   threshold - 視為 viewed 的可見比例，預設 0.35
 */
export function useSectionViewTracker(ids, enabled = true, threshold = 0.35) {
  const key = ids.join(',')
  useEffect(() => {
    if (!enabled) return
    if (typeof window === 'undefined') return
    if (typeof IntersectionObserver === 'undefined') return
    if (!ids || ids.length === 0) return

    const seen = new Set()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !seen.has(entry.target.id)) {
            seen.add(entry.target.id)
            trackEvent('section_viewed', { section: entry.target.id })
          }
        })
      },
      { threshold }
    )

    // 給 DOM 一點時間 render（chart 剛算完那一瞬間）
    const timer = setTimeout(() => {
      ids.forEach((id) => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })
    }, 50)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled, threshold])
}

export default useSectionViewTracker
