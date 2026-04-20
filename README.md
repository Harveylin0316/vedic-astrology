# 吠陀占星 · Vedic Astrology

一個以古老 Jyotish Shastra 智慧打造的現代占星網站。使用 Vite + React + Tailwind CSS v3，搭配 Netlify Functions 作為 Anthropic API proxy。

## 功能

- **吠陀命盤** — 以 Lahiri ayanamsha 計算 sidereal 恆星黃道的太陽、月亮、Lagna 上升點
- **27 Nakshatra** — 完整月宿系統，含守護神、主管行星、特質
- **九大行星 Navagraha** — Surya 到 Ketu 的完整介紹
- **AI 占星解讀** — Claude 驅動的個人化吠陀占星顧問

## 技術棧

- Vite + React 18（JavaScript）
- Tailwind CSS v3
- Lucide React icons
- React Router v6
- Anthropic SDK · Netlify Functions

## 快速開始

```bash
npm install
cp .env.example .env          # 填入 ANTHROPIC_API_KEY（Netlify CLI 會讀取）
npm run dev                   # Vite 開發伺服器（僅前端）
```

若要在本地同時跑前端 + Netlify Function：

```bash
npm i -g netlify-cli
netlify dev                   # 前端 + /api/chat proxy，一併啟動
```

## 部署到 Netlify（透過 GitHub）

1. 將專案 push 到 GitHub（本 README 下方有步驟）
2. 前往 [Netlify](https://app.netlify.com/) → Add new site → Import from Git
3. 選擇你剛推上去的 repo
4. 建置設定會由 `netlify.toml` 自動偵測（Build command `npm run build`、Publish `dist`、Functions `netlify/functions`）
5. **Site settings → Environment variables** 新增：
   - `ANTHROPIC_API_KEY`（必填）
   - `ANTHROPIC_MODEL`（選填，預設 `claude-sonnet-4-6`）
6. Deploy

前端呼叫 `/api/chat` 會透過 `netlify.toml` 的 redirect 自動導向 `/.netlify/functions/chat`。

## 第一次推上 GitHub

```bash
git init
git add .
git commit -m "Initial commit: Vedic Astrology site"
gh repo create vedic-astrology --public --source=. --remote=origin --push
# 或手動：
#   git remote add origin git@github.com:<you>/vedic-astrology.git
#   git branch -M main
#   git push -u origin main
```

## 專案結構

```
.
├── netlify/
│   └── functions/
│       └── chat.js          # Netlify Function · Anthropic proxy
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Starfield.jsx
│   │   └── ChartWheel.jsx
│   ├── data/
│   │   ├── rashis.js        # 12 星座
│   │   ├── nakshatras.js    # 27 月宿
│   │   └── planets.js       # 9 行星
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── BirthChart.jsx
│   │   ├── Nakshatras.jsx
│   │   ├── Planets.jsx
│   │   ├── AIReading.jsx
│   │   └── NotFound.jsx
│   ├── utils/
│   │   └── vedicCalc.js     # 天文計算（Lahiri ayanamsha 等）
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

`vedicCalc.js` 採用簡化的天文公式，精度約 ±0.5°–1°，適用於教學與自我探索。如需專業級 natal chart，建議整合 Swiss Ephemeris（透過 WASM 或後端 Python binding）。

## 免責聲明

本站內容僅供文化學習與自我探索。占星分析非科學診斷，不可作為醫療、法律或財務決策依據。

## License

MIT
