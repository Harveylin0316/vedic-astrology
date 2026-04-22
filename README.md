# 吠陀占星 · Vedic Astrology

輸入生辰，30 秒看你的命盤 — 愛情模式、事業命格、大運時機、稀有度指數。純本地計算、不收個資、0 API key、0 後端。

## 能做什麼

- **命盤分析** — Tropical 回歸黃道 + Sidereal 恆星黃道雙系統（Lahiri ayanamsha），含 Lagna 上升、太陽、月亮、九大行星
- **愛情 / 事業 / 健康 / 運勢四章深度解讀** — 針對每塊人生主題生成長篇敘事段落
- **占星師筆記** — 以軸心洞察為骨幹，加上 9 個主題段落，模擬一對一 consultation 口吻
- **事業 sub-category 偵測** — 25 個身份判讀：business 10 個 + politics 7 個 + arts 8 個，比「你適合當老師」更具體
- **命盤稀有度指數** — Top X% 排名，並以古典 23 種 Yoga 組合（Raja Yoga、Dhana Yoga、Gaja Kesari 等）判定 tier
- **分享卡** — 1080×1080 IG postcard 風格，含 QR code + CTA，一鍵下載或複製連結
- **雙人合盤** — 吠陀 Ashta Kuta 8 因子 36 分制，配合邀請連結讓 TA 填完自動合算
- **中英雙語** — UI 完整翻譯，解讀文字逐步擴充

## 驗證準確率

事業演算法在 388 名人 dataset 上做過多輪回測，目前 sub-category 分數：

| 類別 | 樣本 | 準確率 |
| --- | --- | --- |
| Business | 10 項身份 | 91.9% |
| Politics | 7 項身份 | 95.1% |
| Arts | 8 項身份 | 93.5% |
| Full dataset | 388 人 | 92.8% |

驗證 pipeline 可重複跑：

```bash
node scripts/validateCareers.mjs
```

每輪結果會寫到 `reports/` 供 diff 比較。

## 技術棧

- **Vite + React 18** — JavaScript，無 TypeScript 負擔
- **Tailwind CSS v3** — utility-first，搭配 saffron / vermilion / cosmic 自訂色票
- **React Router v6** — 多頁路由
- **純本地計算** — simplified Kepler solver，精度 ±1-2°（教學級）
- **0 API key、0 後端、0 資料庫** — 全部算在瀏覽器，隱私零外洩
- **Netlify 部署** — `netlify.toml` 內已設好，push 即部署

## 本地跑

```bash
npm install
npm run dev      # Vite dev server
npm run build    # 產 dist/
```

## 專案結構

```
.
├── src/
│   ├── pages/           # Home / BirthChart / Compatibility / Nakshatras / Planets / NotFound
│   ├── components/      # Navbar, Footer, ChartWheel, Starfield, ShareCard 系列 等
│   ├── data/            # rashis, nakshatras, planets, careerMatrix, lagnaMoonCombos, astrologerNote 等靜態字典
│   ├── utils/           # vedicCalc, careerVedic, compatibilityEngine, rarityIndex, yogaDetector 等計算核心
│   └── i18n/            # 雙語字典
├── scripts/             # validateCareers.mjs, inspectOne.mjs, auditMars.mjs
├── data/                # celebrityDataset.json（驗證用）
├── reports/             # 歷次驗證報告
├── public/              # favicon.svg（og-image.png 待製作）
├── index.html
├── netlify.toml
└── package.json
```

## 產生 og-image.png

`public/og-preview.html` 是一個已經排好版的 1200×630 HTML template（saffron / vermilion gradient + ॐ 符號 + "你命盤跟你說的事"），瀏覽器開起來就能 screenshot 成 PNG：

1. 本地跑 `npm run dev`，打開 http://localhost:5173/og-preview.html
2. 把瀏覽器視窗拉到 1200×630（或 zoom 100% 後 screenshot `.og` 元素）
3. 儲存為 `public/og-image.png`
4. `npm run build` 並部署

或用 puppeteer 自動化：

```bash
npx puppeteer screenshot \
  --url http://localhost:5173/og-preview.html \
  --selector ".og" \
  --output public/og-image.png
```

## 計算精度說明

`vedicCalc.js` 採用簡化的 Kepler 公式，精度約 ±1-2°，適用於教學與自我探索。Nakshatra 判定、Dasha 時間軸、稀有度排名皆基於這個精度等級，與專業 Swiss Ephemeris 有極小差異但日常使用足夠。

## 免責聲明

本站內容僅供文化學習與自我探索。占星分析非科學診斷，不可作為醫療、法律或財務決策依據。

## License

MIT
