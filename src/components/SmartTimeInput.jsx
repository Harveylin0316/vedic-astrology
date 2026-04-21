import { useRef, useEffect, useState } from 'react'

// 自訂時間輸入：HH / MM 兩格自動跳焦
// 值格式：'HH:MM'（跟 <input type="time"> 相容）
export default function SmartTimeInput({ value, onChange, required }) {
  const [h, setH] = useState('')
  const [m, setM] = useState('')
  const hRef = useRef(null)
  const mRef = useRef(null)

  useEffect(() => {
    if (!value) {
      setH('')
      setM('')
      return
    }
    const parts = value.split(':')
    setH(parts[0] || '')
    setM(parts[1] || '')
  }, [value])

  const emit = (nh, nm) => {
    if (nh.length > 0 && nm.length > 0) {
      const formatted = `${nh.padStart(2, '0')}:${nm.padStart(2, '0')}`
      onChange(formatted)
    } else if (!nh && !nm) {
      onChange('')
    }
  }

  const handleH = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 2)
    if (v.length === 2 && parseInt(v, 10) > 23) v = '23'
    setH(v)
    if (v.length === 2 || (v.length === 1 && parseInt(v, 10) > 2)) {
      mRef.current?.focus()
    }
    emit(v, m)
  }

  const handleM = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 2)
    if (v.length === 2 && parseInt(v, 10) > 59) v = '59'
    setM(v)
    emit(h, v)
  }

  const handleMKeyDown = (e) => {
    if (e.key === 'Backspace' && m === '') hRef.current?.focus()
  }

  const baseInputStyle =
    'bg-transparent border-0 outline-none text-center text-slate-100 placeholder:text-slate-500 tabular-nums'

  return (
    <div className="flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 focus-within:border-saffron-500/60 focus-within:ring-2 focus-within:ring-saffron-500/20 transition">
      <input
        ref={hRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={2}
        value={h}
        onChange={handleH}
        placeholder="HH"
        required={required}
        className={`${baseInputStyle} w-[3ch]`}
      />
      <span className="text-slate-500">:</span>
      <input
        ref={mRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={2}
        value={m}
        onChange={handleM}
        onKeyDown={handleMKeyDown}
        placeholder="MM"
        required={required}
        className={`${baseInputStyle} w-[3ch]`}
      />
    </div>
  )
}
