import { useRef, useEffect, useState } from 'react'

// 自訂日期輸入：YYYY / MM / DD 三格自動跳焦
// 值格式：'YYYY-MM-DD'（跟 <input type="date"> 相容）
export default function SmartDateInput({ value, onChange, required }) {
  const [y, setY] = useState('')
  const [m, setM] = useState('')
  const [d, setD] = useState('')
  const mRef = useRef(null)
  const dRef = useRef(null)
  const yRef = useRef(null)

  // 外部 value 變動時同步
  useEffect(() => {
    if (!value) {
      setY('')
      setM('')
      setD('')
      return
    }
    const parts = value.split('-')
    setY(parts[0] || '')
    setM(parts[1] || '')
    setD(parts[2] || '')
  }, [value])

  const emit = (ny, nm, nd) => {
    // 都有值才送 onChange，確保格式正確
    if (ny.length === 4 && nm.length > 0 && nd.length > 0) {
      const formatted = `${ny}-${nm.padStart(2, '0')}-${nd.padStart(2, '0')}`
      onChange(formatted)
    } else if (!ny && !nm && !nd) {
      onChange('')
    }
  }

  const handleY = (e) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 4)
    setY(v)
    if (v.length === 4) {
      // 自動跳到月份
      mRef.current?.focus()
    }
    emit(v, m, d)
  }

  const handleM = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 2)
    // 避免輸入 > 12
    if (v.length === 2 && parseInt(v, 10) > 12) v = '12'
    if (v.length === 1 && parseInt(v, 10) > 1) {
      // 例如輸入 3 直接補 0 變 03，但要先讓用戶有機會輸入第二位
      // 這裡先等他輸入第二位
    }
    setM(v)
    // 輸入 2 位 OR 輸入 1 位但 > 1（1x 不可能，只能是 10/11/12）自動跳日
    if (v.length === 2 || (v.length === 1 && parseInt(v, 10) > 1)) {
      dRef.current?.focus()
    }
    emit(y, v, d)
  }

  const handleD = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 2)
    if (v.length === 2 && parseInt(v, 10) > 31) v = '31'
    setD(v)
    emit(y, m, v)
  }

  // Backspace 在空欄位時跳回上一個
  const handleMKeyDown = (e) => {
    if (e.key === 'Backspace' && m === '') yRef.current?.focus()
  }
  const handleDKeyDown = (e) => {
    if (e.key === 'Backspace' && d === '') mRef.current?.focus()
  }

  const baseInputStyle =
    'bg-transparent border-0 outline-none text-center text-slate-100 placeholder:text-slate-500 tabular-nums'

  return (
    <div className="flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 focus-within:border-saffron-500/60 focus-within:ring-2 focus-within:ring-saffron-500/20 transition">
      <input
        ref={yRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={4}
        value={y}
        onChange={handleY}
        placeholder="YYYY"
        required={required}
        className={`${baseInputStyle} w-[5ch]`}
      />
      <span className="text-slate-500">/</span>
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
      <span className="text-slate-500">/</span>
      <input
        ref={dRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={2}
        value={d}
        onChange={handleD}
        onKeyDown={handleDKeyDown}
        placeholder="DD"
        required={required}
        className={`${baseInputStyle} w-[3ch]`}
      />
    </div>
  )
}
