// 生成 sitemap.xml — 涵蓋主要路徑 + 27 個 Nakshatra 詳細頁
// 使用：node scripts/generateSitemap.mjs

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const BASE_URL = 'https://vedic-astrology.netlify.app'
const NOW = new Date().toISOString().split('T')[0]

// 27 Nakshatras slug（對應 NakshatraDetail.jsx 的 nakshatraSlug）
const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta',
  'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
]

function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '-')
}

const urls = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/birth-chart', changefreq: 'weekly', priority: '0.9' },
  { loc: '/compatibility', changefreq: 'weekly', priority: '0.9' },
  { loc: '/nakshatras', changefreq: 'monthly', priority: '0.8' },
  { loc: '/planets', changefreq: 'monthly', priority: '0.8' },
  ...NAKSHATRA_NAMES.map((name) => ({
    loc: `/nakshatras/${slugify(name)}`,
    changefreq: 'monthly',
    priority: '0.7'
  }))
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${BASE_URL}${u.loc}</loc>
    <lastmod>${NOW}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`

const outputPath = resolve(__dirname, '..', 'public', 'sitemap.xml')
writeFileSync(outputPath, xml, 'utf-8')
console.log(`✓ sitemap.xml written to ${outputPath} (${urls.length} URLs)`)
