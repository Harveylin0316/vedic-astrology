import { createContext, useContext, useEffect, useState } from 'react'
import { translations } from './translations.js'

const I18nContext = createContext({
  lang: 'zh-TW',
  setLang: () => {},
  t: (k) => k
})

const STORAGE_KEY = 'vedic-lang'

function detectInitialLang() {
  if (typeof window === 'undefined') return 'zh-TW'
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'zh-TW') return saved
  } catch {
    // ignore
  }
  const browserLang = (navigator.language || 'zh-TW').toLowerCase()
  if (browserLang.startsWith('zh')) return 'zh-TW'
  return 'en'
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(detectInitialLang)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // ignore
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang
    }
  }, [lang])

  const setLang = (newLang) => {
    if (newLang === 'en' || newLang === 'zh-TW') setLangState(newLang)
  }

  const t = (key, fallback) => {
    const dict = translations[lang]
    if (dict && dict[key]) return dict[key]
    // 回退到中文，再回退到原 key
    return translations['zh-TW']?.[key] || fallback || key
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
