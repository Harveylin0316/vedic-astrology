// 永久連結編碼 — 把生辰資料編進 URL 參數
// 使用 URL-safe base64 + JSON，可把 2 人合盤壓縮在 ~200 chars URL 內
//
// 用法：
//   encode:  const url = `${location.origin}/compatibility?d=${encodeCompatPayload({you, them, relationship})}`
//   decode:  const payload = decodeCompatPayload(searchParams.get('d'))

function urlSafeBase64Encode(str) {
  const base64 = btoa(unescape(encodeURIComponent(str)))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function urlSafeBase64Decode(str) {
  let b = str.replace(/-/g, '+').replace(/_/g, '/')
  while (b.length % 4) b += '='
  return decodeURIComponent(escape(atob(b)))
}

function encodeJson(obj) {
  try {
    return urlSafeBase64Encode(JSON.stringify(obj))
  } catch {
    return ''
  }
}

function decodeJson(encoded) {
  if (!encoded) return null
  try {
    return JSON.parse(urlSafeBase64Decode(encoded))
  } catch {
    return null
  }
}

// ═════ 單人命盤 ═════

// 挑出要編碼的欄位（去除不必要的）
function pickPersonFields(p) {
  return {
    n: p.name || '',
    g: p.gender || '',
    d: p.date || '',
    t: p.time || '',
    c: p.city || '',
    lat: p.lat || '',
    lon: p.lon || '',
    tz: p.tz || ''
  }
}

// 還原成 form 格式
function restorePerson(p) {
  if (!p) return null
  return {
    name: p.n || '',
    gender: p.g || '',
    date: p.d || '',
    time: p.t || '',
    city: p.c || '',
    lat: p.lat || '',
    lon: p.lon || '',
    tz: p.tz || '8'
  }
}

// BirthChart form → URL payload
export function encodeBirthPayload(form) {
  return encodeJson(pickPersonFields(form))
}

export function decodeBirthPayload(encoded) {
  const data = decodeJson(encoded)
  if (!data) return null
  return restorePerson(data)
}

// ═════ 雙人合盤 ═════

export function encodeCompatPayload({ you, them, relationship }) {
  return encodeJson({
    y: pickPersonFields(you),
    t: pickPersonFields(them),
    r: relationship || 'romantic'
  })
}

export function decodeCompatPayload(encoded) {
  const data = decodeJson(encoded)
  if (!data) return null
  return {
    you: restorePerson(data.y),
    them: restorePerson(data.t),
    relationship: data.r || 'romantic'
  }
}

// ═════ Helper：把參數寫到 URL（不重載）═════
export function replaceUrlParam(key, value) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (value) {
    url.searchParams.set(key, value)
  } else {
    url.searchParams.delete(key)
  }
  window.history.replaceState({}, '', url.toString())
}

// ═════ Helper：複製文字到剪貼簿 ═════
export async function copyToClipboard(text) {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    // fallback：textarea
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      return true
    } catch {
      return false
    }
  }
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
