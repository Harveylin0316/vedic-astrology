# 吠陀占星 · Vedic Astrology

一個以古老 Jyotish Shastra 智慧打造的現代占星網站。純靜態、無需任何 API key — 輸入出生資料後在瀏覽器本地計算命盤並顯示完整解讀文字。

## 功能

- **吠陀命盤** — 以 Lahiri ayanamsha 計算 sidereal 恆星黃道的太陽、月亮、Lagna 上升點
- **完整解讀** — 根據 Lagna / 太陽 / 月亮所在 Rashi 與 Nakshatra，顯示預先撰寫的性格與能量分析
- **元素平衡** — 分析火 / 土 / 風 / 水的比例，給出建議
- **能量建議** — 提供寶石、金屬、曼陀羅、主管日等傳統遺方
- **27 Nakshatra** — 完整月宿系統，含守護神、主管行星、特質
- **九大行星 Navagraha** — Surya 到 Ketu 的完整介紹

## 技術棧

- Vite + React 18（JavaScript）
- Tailwind CSS v3
- Lucide React icons
- React Router v6
- **無後端、無 API key**，部署即用

## 快速開始

```bash
npm install
npm run dev                   # Vite 開發伺服器
```

## 部署到 Netlify（透過 GitHub）

1. 到 [Netlify](https://app.netlify.com/) → Add new site → Import from Git
2. 選擇你的 GitHub repo
3. Build 設定由 `netlify.toml` 自動偵測（`npm run build`、publish `dist`）
4. 點 **Deploy**，完成

無須設定任何環境變數。

## 專案結構

```
.
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Starfield.jsx
│   │   └── ChartWheel.jsx
│   ├── data/
│   │   ├── rashis.js            # 12 星座
│   │   ├── nakshatras.js        # 27 月宿
│   │   ├── planets.js           # 9 行星
│   │   └── interpretations.js   # 規則式解讀資料
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── BirthChart.jsx       # 命盤 + 解讀
│   │   ├── Nakshatras.jsx
│   │   ├── Planets.jsx
│   │   └── NotFound.jsx
│   ├── utils/
│   │   └── vedicCalc.js         # 天文計算（Lahiri ayanamsha 等）
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── netlify.toml
└── package.json
```

## 計算精度說明

`vedicCalc.js` 採用簡化的天文公式，精度約 ±0.5°–1°，適用於教學與自我探索。如需專業級 natal chart，建議整合 Swiss Ephemeris。

## 免責聲明

本站內容僅供文化學習與自我探索。占星分析非科學診斷，不可作為醫療、法律或財務決策依據。

## License

MIT
