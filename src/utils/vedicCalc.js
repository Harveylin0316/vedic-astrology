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

// ═════════════════════════════════════════════════════════════
// Classical planets (Mars, Mercury, Jupiter, Venus, Saturn)
// Based on Paul Schlyter's simplified Keplerian elements
// http://stjarnhimlen.se/comp/tutorial.html
// Accuracy: ~1-2° (enough for rashi / house determination)
// ═════════════════════════════════════════════════════════════

const PLANET_ELEMENTS = {
  Mercury: {
    N: [48.3313, 3.24587e-5],
    i: [7.0047, 5.0e-8],
    w: [29.1241, 1.01444e-5],
    a: 0.387098,
    e: [0.205635, 5.59e-10],
    M: [168.6562, 4.0923344368]
  },
  Venus: {
    N: [76.6799, 2.4659e-5],
    i: [3.3946, 2.75e-8],
    w: [54.891, 1.38374e-5],
    a: 0.72333,
    e: [0.006773, -1.302e-9],
    M: [48.0052, 1.6021302244]
  },
  Mars: {
    N: [49.5574, 2.11081e-5],
    i: [1.8497, -1.78e-8],
    w: [286.5016, 2.92961e-5],
    a: 1.523688,
    e: [0.093405, 2.516e-9],
    M: [18.6021, 0.5240207766]
  },
  Jupiter: {
    N: [100.4542, 2.76854e-5],
    i: [1.303, -1.557e-7],
    w: [273.8777, 1.64505e-5],
    a: 5.20256,
    e: [0.048498, 4.469e-9],
    M: [19.895, 0.0830853001]
  },
  Saturn: {
    N: [113.6634, 2.3898e-5],
    i: [2.4886, -1.081e-7],
    w: [339.3939, 2.97661e-5],
    a: 9.55475,
    e: [0.055546, -9.499e-9],
    M: [316.967, 0.0334442282]
  }
}

// Days from Schlyter epoch (2000 Jan 0.0 = JD 2451543.5)
function daysFromSchlyter(jd) {
  return jd - 2451543.5
}

// Solve Kepler's equation M = E - e*sin(E) by iteration
function solveKepler(M, e) {
  const m = M * DEG
  let E = m + e * Math.sin(m) * (1 + e * Math.cos(m))
  for (let i = 0; i < 5; i++) {
    const delta = (E - e * Math.sin(E) - m) / (1 - e * Math.cos(E))
    E -= delta
    if (Math.abs(delta) < 1e-7) break
  }
  return E / DEG
}

// Compute heliocentric ecliptic coordinates of a planet
function heliocentricPosition(planet, d) {
  const el = PLANET_ELEMENTS[planet]
  const N = norm360(el.N[0] + el.N[1] * d)
  const i = el.i[0] + el.i[1] * d
  const w = norm360(el.w[0] + el.w[1] * d)
  const a = el.a
  const e = el.e[0] + el.e[1] * d
  const M = norm360(el.M[0] + el.M[1] * d)

  const E = solveKepler(M, e)
  const eRad = E * DEG

  // Position in orbital plane
  const xv = a * (Math.cos(eRad) - e)
  const yv = a * (Math.sqrt(1 - e * e) * Math.sin(eRad))
  const v = norm360(Math.atan2(yv, xv) / DEG)
  const r = Math.sqrt(xv * xv + yv * yv)

  // Ecliptic position
  const vPw = (v + w) * DEG
  const nRad = N * DEG
  const iRad = i * DEG
  const xh = r * (Math.cos(nRad) * Math.cos(vPw) - Math.sin(nRad) * Math.sin(vPw) * Math.cos(iRad))
  const yh = r * (Math.sin(nRad) * Math.cos(vPw) + Math.cos(nRad) * Math.sin(vPw) * Math.cos(iRad))
  const zh = r * (Math.sin(vPw) * Math.sin(iRad))
  return { x: xh, y: yh, z: zh, r }
}

// Earth's heliocentric position = -Sun's geocentric vector at distance 1 AU (approx)
function earthHeliocentric(jd) {
  const n = jd - 2451545.0
  const L = norm360(280.46 + 0.9856474 * n)
  const g = norm360(357.528 + 0.9856003 * n) * DEG
  const sunLon = L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)
  // Earth is opposite the geocentric sun direction
  const earthLon = norm360(sunLon + 180) * DEG
  // Distance: approximate as 1 AU (slightly off due to Earth orbit eccentricity, OK for ~1° precision)
  const r = 1.000001018 * (1 - 0.01671 * Math.cos(g))
  return {
    x: r * Math.cos(earthLon),
    y: r * Math.sin(earthLon),
    z: 0
  }
}

// Geocentric ecliptic tropical longitude of a classical planet
export function planetTropicalLongitude(planet, jd) {
  const d = daysFromSchlyter(jd)
  const helio = heliocentricPosition(planet, d)
  const earth = earthHeliocentric(jd)
  const geo = {
    x: helio.x - earth.x,
    y: helio.y - earth.y,
    z: helio.z - earth.z
  }
  return norm360(Math.atan2(geo.y, geo.x) / DEG)
}

// Rahu (Mean Lunar North Node) — retrograde motion
// Ketu = Rahu + 180°
export function rahuTropicalLongitude(jd) {
  const d = jd - 2451545.0
  return norm360(125.04452 - 0.05295376 * d)
}

export function ketuTropicalLongitude(jd) {
  return norm360(rahuTropicalLongitude(jd) + 180)
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

// Compute a complete Vedic + Tropical chart snapshot.
// Returns BOTH Tropical (西方 user-facing) and Sidereal (吠陀 Raman-compliant)
// zodiac placements for Sun, Moon, Ascendant.
export function computeVedicChart({ year, month, day, hour, minute, tzOffset, lat, lon }) {
  const utHour = hour - tzOffset + minute / 60
  const jd = julianDay(year, month, day, utHour, 0, 0)
  const ayan = lahiriAyanamsha(jd)

  const sunTrop = sunTropicalLongitude(jd)
  const moonTrop = moonTropicalLongitude(jd)
  const ascTrop = tropicalAscendant(jd, lat, lon)
  const marsTrop = planetTropicalLongitude('Mars', jd)
  const mercuryTrop = planetTropicalLongitude('Mercury', jd)
  const jupiterTrop = planetTropicalLongitude('Jupiter', jd)
  const venusTrop = planetTropicalLongitude('Venus', jd)
  const saturnTrop = planetTropicalLongitude('Saturn', jd)
  const rahuTrop = rahuTropicalLongitude(jd)
  const ketuTrop = ketuTropicalLongitude(jd)

  const sunSid = norm360(sunTrop - ayan)
  const moonSid = norm360(moonTrop - ayan)
  const ascSid = norm360(ascTrop - ayan)
  const marsSid = norm360(marsTrop - ayan)
  const mercurySid = norm360(mercuryTrop - ayan)
  const jupiterSid = norm360(jupiterTrop - ayan)
  const venusSid = norm360(venusTrop - ayan)
  const saturnSid = norm360(saturnTrop - ayan)
  const rahuSid = norm360(rahuTrop - ayan)
  const ketuSid = norm360(ketuTrop - ayan)

  const makePos = (longitude) => ({
    longitude,
    rashi: getRashiByIndex(Math.floor(longitude / 30)),
    degreeInSign: longitude % 30
  })

  const ascRashiIdx = Math.floor(ascSid / 30)
  // Compute which house a sidereal longitude falls into (1-12)
  const houseOf = (longitude) => {
    const rashiIdx = Math.floor(longitude / 30)
    return ((rashiIdx - ascRashiIdx + 12) % 12) + 1
  }

  const makeGraha = (longitude, tropLongitude) => ({
    longitude,
    tropical: tropLongitude,
    rashi: getRashiByIndex(Math.floor(longitude / 30)),
    degreeInSign: longitude % 30,
    nakshatra: getNakshatraByLongitude(longitude),
    house: houseOf(longitude)
  })

  const grahas = {
    Sun: makeGraha(sunSid, sunTrop),
    Moon: makeGraha(moonSid, moonTrop),
    Mars: makeGraha(marsSid, marsTrop),
    Mercury: makeGraha(mercurySid, mercuryTrop),
    Jupiter: makeGraha(jupiterSid, jupiterTrop),
    Venus: makeGraha(venusSid, venusTrop),
    Saturn: makeGraha(saturnSid, saturnTrop),
    Rahu: makeGraha(rahuSid, rahuTrop),
    Ketu: makeGraha(ketuSid, ketuTrop)
  }

  const moonNakshatra = grahas.Moon.nakshatra
  const sunNakshatra = grahas.Sun.nakshatra

  // Equal house system from sidereal ascendant (Raman-standard)
  const houses = rashis.map((_, i) => {
    const rashiIdx = (Math.floor(ascSid / 30) + i) % 12
    return { house: i + 1, rashi: getRashiByIndex(rashiIdx) }
  })

  return {
    jd,
    ayanamsha: ayan,

    // Tropical — familiar Western signs (for personality readings)
    tropical: {
      sun: makePos(sunTrop),
      moon: makePos(moonTrop),
      ascendant: makePos(ascTrop)
    },

    // Sidereal — traditional Vedic (for Nakshatra, Dasha, houses)
    sidereal: {
      sun: { ...makePos(sunSid), nakshatra: sunNakshatra },
      moon: { ...makePos(moonSid), nakshatra: moonNakshatra },
      ascendant: makePos(ascSid),
      houses,
      grahas // all 9 planets with rashi/house/nakshatra
    },

    // Legacy keys (backward compat - sidereal-based)
    sun: {
      tropical: sunTrop,
      sidereal: sunSid,
      rashi: getRashiByIndex(Math.floor(sunSid / 30)),
      nakshatra: sunNakshatra,
      degreeInSign: sunSid % 30
    },
    moon: {
      tropical: moonTrop,
      sidereal: moonSid,
      rashi: getRashiByIndex(Math.floor(moonSid / 30)),
      nakshatra: moonNakshatra,
      degreeInSign: moonSid % 30
    },
    ascendant: {
      tropical: ascTrop,
      sidereal: ascSid,
      rashi: getRashiByIndex(Math.floor(ascSid / 30)),
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

// ═════════════════════════════════════════════════════════════
// Antardasha (Bhukti) — sub-periods within a Mahadasha
// Per Raman: antardasha length = (MD_years × AD_years) / 120
// Antardasha order starts with the Mahadasha planet, then follows
// standard Vimshottari order.
// ═════════════════════════════════════════════════════════════
export function computeAntardashas(mahadasha) {
  if (!mahadasha) return []
  const startIdx = DASHA_ORDER.indexOf(mahadasha.lord)
  const totalYears = mahadasha.years
  const periods = []
  let t = new Date(mahadasha.start)
  for (let i = 0; i < 9; i++) {
    const lord = DASHA_ORDER[(startIdx + i) % 9]
    const years = (DASHA_YEARS[lord] * totalYears) / 120
    const end = addYears(t, years)
    periods.push({ lord, start: new Date(t), end, years })
    t = end
  }
  // Clip last antardasha to exact mahadasha end to avoid float drift
  periods[periods.length - 1].end = new Date(mahadasha.end)
  return periods
}

export function getCurrentAntardasha(antardashas, now = new Date()) {
  const idx = antardashas.findIndex((p) => now >= p.start && now < p.end)
  if (idx === -1) return null
  return {
    ...antardashas[idx],
    next: antardashas[idx + 1] || null,
    yearsRemaining: (antardashas[idx].end - now) / (365.25 * 24 * 60 * 60 * 1000)
  }
}

// ═════════════════════════════════════════════════════════════
// D10 (Dasamsa) 事業專盤計算
//
// 古典規則（Parashara）：
// - 每個 30° 星座切 10 等份，每份 3°
// - 奇數星座（Mesha/Mithuna/Simha/Tula/Dhanu/Kumbha）：10 分格從該星座起算
// - 偶數星座（Vrishabha/Karka/Kanya/Vrishchika/Makara/Meena）：10 分格從該星座的第 9 個星座起算
// - divIndex = floor(度數 / 3) ∈ [0, 9]
// - D10 signIndex = (startSign + divIndex) % 12
//
// D10 houses 使用 whole-sign 從 D10 Lagna 算起
// ═════════════════════════════════════════════════════════════
export function computeDasamsaSignIndex(signIndex0, degreesInSign) {
  const divIndex = Math.min(9, Math.floor(degreesInSign / 3))
  const isOdd = signIndex0 % 2 === 0 // 0-based: 0=Mesha=odd, 1=Vrishabha=even
  const startSignIdx0 = isOdd ? signIndex0 : (signIndex0 + 8) % 12
  return (startSignIdx0 + divIndex) % 12
}

export function computeDasamsa(chart) {
  if (!chart?.sidereal?.grahas) return null

  // D10 Lagna (Ascendant's Dasamsa sign)
  const ascRashi = chart.sidereal.ascendant.rashi
  const ascSignIdx0 = ascRashi.id - 1
  const ascDeg = chart.sidereal.ascendant.degreeInSign
  const dasamsaLagnaIdx0 = computeDasamsaSignIndex(ascSignIdx0, ascDeg)
  const dasamsaLagnaRashi = getRashiByIndex(dasamsaLagnaIdx0 + 1)

  // D10 positions for each planet
  const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']
  const grahas = {}
  for (const p of planets) {
    const g = chart.sidereal.grahas[p]
    if (!g) continue
    const signIdx0 = g.rashi.id - 1
    const dasamsaIdx0 = computeDasamsaSignIndex(signIdx0, g.degreeInSign)
    const d10House = ((dasamsaIdx0 - dasamsaLagnaIdx0 + 12) % 12) + 1
    grahas[p] = {
      rashi: getRashiByIndex(dasamsaIdx0 + 1),
      house: d10House
    }
  }

  return {
    lagna: { rashi: dasamsaLagnaRashi, signIndex0: dasamsaLagnaIdx0 },
    grahas
  }
}

