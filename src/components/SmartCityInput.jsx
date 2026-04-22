import { useState, useRef, useEffect, useMemo } from 'react'
import { MapPin, Check, X, Search } from 'lucide-react'
import { cities, findCity } from '../data/cities.js'

// 熱門城市（空狀態下顯示的快速 tap 按鈕）
const POPULAR_CITY_NAMES = [
  '台北', '高雄', '台中', '新竹', '香港', '東京', '上海', '北京', '紐約', '洛杉磯'
]

// SmartCityInput：搜尋 + 熱門 chips + 下拉選單
// Props:
//   value        — 目前輸入字串（城市名）
//   onSelectCity — (city 物件) => void，選到城市時呼叫
//   onFreeText   — (text) => void，用戶手動輸入但不匹配城市時呼叫（仍保存原字串）
export default function SmartCityInput({ value, onSelectCity, onFreeText }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(value || '')
  const [highlighted, setHighlighted] = useState(0)
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    setQuery(value || '')
  }, [value])

  // 外點關閉
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [open])

  const matched = findCity(query)

  // 搜尋邏輯：name / display / 英文部分都可以匹配
  const results = useMemo(() => {
    const q = (query || '').trim().toLowerCase()
    if (!q) return []
    return cities
      .filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.display.toLowerCase().includes(q)
      )
      .slice(0, 8)
  }, [query])

  const popularCities = useMemo(
    () => POPULAR_CITY_NAMES.map((name) => cities.find((c) => c.name === name)).filter(Boolean),
    []
  )

  const handleInput = (e) => {
    const val = e.target.value
    setQuery(val)
    setOpen(true)
    setHighlighted(0)
    if (val === '') {
      onFreeText?.('')
      return
    }
    const match = findCity(val)
    if (match) {
      // 精確匹配自動選入
      onSelectCity?.(match)
    } else {
      onFreeText?.(val)
    }
  }

  const handleSelectCity = (city) => {
    setQuery(city.name)
    setOpen(false)
    onSelectCity?.(city)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e) => {
    const list = query.trim() ? results : popularCities
    if (!list.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((h) => (h + 1) % list.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((h) => (h - 1 + list.length) % list.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleSelectCity(list[highlighted])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const showList = open && (query.trim() ? results.length > 0 : true)
  const formatTz = (tz) => `UTC${tz >= 0 ? '+' : ''}${tz}`

  return (
    <div ref={containerRef} className="relative">
      {/* 輸入框 */}
      <div
        className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 transition bg-white/5 ${
          open ? 'border-saffron-500/60 ring-2 ring-saffron-500/20' : 'border-white/15'
        }`}
      >
        <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="搜尋城市：台北、東京、New York…"
          autoComplete="off"
          className="flex-1 bg-transparent border-0 outline-none text-slate-100 placeholder:text-slate-500 text-sm"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              onFreeText?.('')
              inputRef.current?.focus()
              setOpen(true)
            }}
            className="text-slate-500 hover:text-slate-300 transition"
            aria-label="清除"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 下方確認（命中時立即顯示） */}
      {matched && !open && (
        <div className="mt-1.5 text-[11px] text-emerald-400 flex items-center gap-1.5">
          <Check className="h-3 w-3" />
          {matched.display} · {formatTz(matched.tz)} · {matched.lat.toFixed(2)}°N / {matched.lon.toFixed(2)}°E
        </div>
      )}
      {!matched && query && !open && (
        <div className="mt-1.5 text-[11px] text-amber-400">
          ⚠️ 沒匹配到內建城市 — 會用你輸入的文字當地名，但經緯度 / 時區請到「進階設定」確認
        </div>
      )}

      {/* 下拉選單 */}
      {showList && (
        <div className="absolute z-30 left-0 right-0 mt-2 rounded-xl border border-white/15 bg-cosmic-950/98 backdrop-blur-md shadow-2xl max-h-[320px] overflow-y-auto">
          {!query.trim() && (
            <div className="p-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2 px-1">
                熱門城市 · 點一下就填好
              </div>
              <div className="flex flex-wrap gap-1.5">
                {popularCities.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    onMouseEnter={() => setHighlighted(i)}
                    onClick={() => handleSelectCity(c)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${
                      i === highlighted
                        ? 'border-saffron-500 bg-saffron-500/15 text-saffron-300'
                        : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
              <div className="mt-3 text-[11px] text-slate-500 px-1 leading-relaxed">
                找不到？直接輸入城市名開始搜尋 — 內建台灣 + 亞洲 + 全球主要城市。
              </div>
            </div>
          )}

          {query.trim() && results.length > 0 && (
            <div className="py-2">
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1 px-3">
                匹配結果（{results.length}）
              </div>
              {results.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  onMouseEnter={() => setHighlighted(i)}
                  onClick={() => handleSelectCity(c)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-left transition ${
                    i === highlighted ? 'bg-saffron-500/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-saffron-400/80 flex-shrink-0" />
                    <span className="text-sm text-slate-100">{c.display}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 tabular-nums">{formatTz(c.tz)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
