// Simplified Vedic astrology calculations using Lahiri ayanamsha.
// Note: For production-grade natal charts, integrate Swiss Ephemeris.
// These formulas give educationally useful approximations (accuracy ~0.5°–1°).

import { rashis, getRashiByIndex } from '../data/rashis.js'
import { getNakshatraByLongitude, NAKSHATRA_SPAN } from '../data/nakshatras.js'

const DEG = Math.PI / 180
const norm360 = (x) => ((x % 360) + 360) % 360

// Julian Day Number from UTC date components
export function julianDay(year, month, day, hour = 0, minute = 0, second = 0) {
  let y = year
  let m = month
  if (m <= 2) {
    y -= 1
    m += 12
  }
  const A = Math.floor(y / 100)
  const B = 2 - A + Math.floor(A / 4)
  const JD =
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    B -
    1524.5 +
    (hour + minute / 60 + second / 3600) / 24
  return JD
}

// Lahiri (Chitrapaksha) ayanamsha — linear approximation
// Reference: J2000 (JD 2451545.0) ayanamsha ≈ 23.85°, annual precession ≈ 50.29"/yr
export function lahiriAyanamsha(jd) {
  const t = (jd - 2451545.0) / 365.25 // years from J2000
  return 23.85 + (50.29 / 3600) * t
}

// Tropical Sun longitude (simplified, accurate to ~0.01°)
export function sunTropicalLongitude(jd) {
  const n = jd - 2451545.0
  const L = norm360(280.46 + 0.9856474 * n) // mean longitude
  const g = norm360(357.528 + 0.9856003 * n) * DEG // mean anomaly
  const lambda = L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)
  return norm360(lambda)
}

// Tropical Moon longitude (simplified — accuracy ~0.3°)
export function moonTropicalLongitude(jd) {
  const T = (jd - 2451545.0) / 36525
  const Lp = norm360(218.3164477 + 481267.88123421 * T) // mean longitude
  const D = norm360(297.8501921 + 445267.1114034 * T) * DEG
  const M = norm360(357.5291092 + 35999.0502909 * T) * DEG
  const Mp = norm360(134.9633964 + 477198.8675055 * T) * DEG
  const F = norm360(93.272095 + 483202.0175233 * T) * DEG

  const lon =
    Lp +
    6.289 * Math.sin(Mp) -
    1.274 * Math.sin(Mp - 2 * D) +
    0.658 * Math.sin(2 * D) -
    0.186 * Math.sin(M) -
    0.059 * Math.sin(2 * Mp - 2 * D) -
    0.057 * Math.sin(Mp - 2 * D + M) +
    0.053 * Math.sin(Mp + 2 * D) +
    0.046 * Math.sin(2 * D - M) +
    0.041 * Math.sin(Mp - M) -
    0.035 * Math.sin(D) -
    0.031 * Math.sin(Mp + M) -
    0.015 * Math.sin(2 * F - 2 * D) +
    0.011 * Math.sin(Mp - 4 * D)

  return norm360(lon)
}

// Greenwich Mean Sidereal Time in degrees
function gmstDegrees(jd) {
  const T = (jd - 2451545.0) / 36525
  const gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000
  return norm360(gmst)
}

// Ascendant (Lagna) — tropical, then apply ayanamsha for sidereal.
// Standard formula: tan(ASC) = cos(RAMC) / -(sin(RAMC)·cos(ε) + tan(φ)·sin(ε))
export function tropicalAscendant(jd, latitudeDeg, longitudeDeg) {
  const gmst = gmstDegrees(jd)
  const lst = norm360(gmst + longitudeDeg) // local sidereal time
  const ramc = lst * DEG
  const eps = 23.4367 * DEG
  const phi = latitudeDeg * DEG

  const y = Math.cos(ramc)
  const x = -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps))
  let asc = Math.atan2(y, x) / DEG
  return norm360(asc)
}

// Compute a complete simplified Vedic chart snapshot.
// Params: year, month, day, hour, minute in LOCAL time. tzOffset in hours from UTC.
// lat/lon in degrees (+N, +E). Returns rich object for UI rendering.
export function computeVedicChart({ year, month, day, hour, minute, tzOffset, lat, lon }) {
  // Convert local to UT
  const utHour = hour - tzOffset + minute / 60
  const jd = julianDay(year, month, day, utHour, 0, 0)

  const ayan = lahiriAyanamsha(jd)

  const sunTrop = sunTropicalLongitude(jd)
  const moonTrop = moonTropicalLongitude(jd)
  const ascTrop = tropicalAscendant(jd, lat, lon)

  const sunSid = norm360(sunTrop - ayan)
  const moonSid = norm360(moonTrop - ayan)
  const ascSid = norm360(ascTrop - ayan)

  const sunRashi = getRashiByIndex(Math.floor(sunSid / 30))
  const moonRashi = getRashiByIndex(Math.floor(moonSid / 30))
  const ascRashi = getRashiByIndex(Math.floor(ascSid / 30))

  const moonNakshatra = getNakshatraByLongitude(moonSid)
  const sunNakshatra = getNakshatraByLongitude(sunSid)

  // 12 house cusps — equal house system from ascendant
  const houses = rashis.map((_, i) => {
    const rashiIdx = (Math.floor(ascSid / 30) + i) % 12
    return {
      house: i + 1,
      rashi: getRashiByIndex(rashiIdx)
    }
  })

  return {
    jd,
    ayanamsha: ayan,
    sun: {
      tropical: sunTrop,
      sidereal: sunSid,
      rashi: sunRashi,
      nakshatra: sunNakshatra,
      degreeInSign: sunSid % 30
    },
    moon: {
      tropical: moonTrop,
      sidereal: moonSid,
      rashi: moonRashi,
      nakshatra: moonNakshatra,
      degreeInSign: moonSid % 30
    },
    ascendant: {
      tropical: ascTrop,
      sidereal: ascSid,
      rashi: ascRashi,
      degreeInSign: ascSid % 30
    },
    houses,
    _input: { year, month, day, hour, minute }
  }
}

export function formatDegrees(deg) {
  const d = Math.floor(deg)
  const mFull = (deg - d) * 60
  const m = Math.floor(mFull)
  const s = Math.round((mFull - m) * 60)
  return `${d}°${String(m).padStart(2, '0')}'${String(s).padStart(2, '0')}"`
}

// ═════════════════════════════════════════════════════════════
// Vimshottari Dasha 大運計算
// Based on Moon's Nakshatra position at birth (sidereal longitude)
// Total cycle = 120 years, 9 planets in fixed order
// ═════════════════════════════════════════════════════════════

const DASHA_YEARS = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17
}

const DASHA_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury']

// Nakshatra index (0–26) → Dasha lord
function nakshatraLord(nakIndex) {
  return DASHA_ORDER[nakIndex % 9]
}

// Build the Vimshottari Mahadasha timeline from birth
export function computeVimshottariDasha({ moonSidereal, birthYear, birthMonth, birthDay, birthHour = 0, birthMinute = 0 }) {
  const NAK_SPAN = 360 / 27
  const nakIndex = Math.floor(moonSidereal / NAK_SPAN)
  const posInNak = (moonSidereal % NAK_SPAN) / NAK_SPAN // 0 - 1 (fraction traversed)

  const startLord = nakshatraLord(nakIndex)
  const startLordTotal = DASHA_YEARS[startLord]
  const balanceYears = startLordTotal * (1 - posInNak) // years remaining in starting dasha at birth

  const birth = new Date(Date.UTC(birthYear, birthMonth - 1, birthDay, birthHour, birthMinute))
  const periods = []

  let t = new Date(birth)
  const firstEnd = addYears(t, balanceYears)
  periods.push({ lord: startLord, start: new Date(t), end: firstEnd, years: balanceYears, isPartial: true })
  t = firstEnd

  let yearsUsed = balanceYears
  let idx = DASHA_ORDER.indexOf(startLord)
  while (yearsUsed < 120) {
    idx = (idx + 1) % 9
    const lord = DASHA_ORDER[idx]
    const years = DASHA_YEARS[lord]
    const end = addYears(t, years)
    periods.push({ lord, start: new Date(t), end, years, isPartial: false })
    t = end
    yearsUsed += years
  }

  return periods
}

function addYears(date, years) {
  const ms = years * 365.25 * 24 * 60 * 60 * 1000
  return new Date(date.getTime() + ms)
}

export function getCurrentDasha(periods, now = new Date()) {
  const idx = periods.findIndex((p) => now >= p.start && now < p.end)
  if (idx === -1) return null
  return {
    ...periods[idx],
    next: periods[idx + 1] || null,
    yearsRemaining: (periods[idx].end - now) / (365.25 * 24 * 60 * 60 * 1000)
  }
}

