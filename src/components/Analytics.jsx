import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// GA4 SPA 路由追蹤：每次路由變化都送一次 page_view
const GA_MEASUREMENT_ID = 'G-YXR59SWR35'

export default function Analytics() {
  const location = useLocation()

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
    const pagePath = location.pathname + location.search
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
      send_to: GA_MEASUREMENT_ID
    })
  }, [location])

  return null
}

// 手動送自訂事件（用於關鍵動作追蹤）
// 用法：trackEvent('compute_chart', { gender: 'male' })
export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}
