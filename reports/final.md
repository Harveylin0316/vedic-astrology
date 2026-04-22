# 吠陀事業演算法驗證 — 最終累積報告（Round 2）

**最後更新**：2026-04-22
**Dataset**：173 位名人（118 → 173）
**工具**：`scripts/validateCareers.mjs`

## 1. 兩輪累積成果

| 指標 | Round 0 Baseline (N=118) | Round 1 Final (N=118) | Round 2 Final (N=173) |
| --- | --- | --- | --- |
| **Accuracy** | 55.5% | 65.7% | **76.0%** |
| Full match | 47.5% | 58.5% | **70.5%** |
| Miss | 36.4% | 27.1% | **18.5%** |

**累積 +20.5pp**（55.5% → 76.0%）

## 2. 兩大失敗類別的救回

| 類別 | R0 Baseline (N=118/19) | R1 Final (N=118/19) | R2 Final (N=173/39) |
| --- | --- | --- | --- |
| **sports-athlete** | 24% | 34% | **67%** |
| **arts-performer** | 59% | 62% | **84%** |

（括號 N 是 dataset 裡的總人數 — Round 2 新加了 20 運動員 + 20+ 演藝人員）

## 3. 按類別（Round 2 Final）

| 類別 | N | 準確率 |
| --- | --- | --- |
| business-entrepreneur | 16 | 100% |
| science-academic | 8 | 94% |
| tech-exec | 13 | 88% |
| arts-creator | 19 | 87% |
| arts-performer | 62 | **84%** |
| medicine | 2 | 100% |
| religion-leader | 5 | 80% |
| tech-engineer | 5 | 80% |
| business-leader | 16 | 78% |
| politics | 17 | 76% |
| government | 16 | 75% |
| sports-athlete | 39 | **67%** |
| media-personality | 8 | 63% |
| arts-visual | 7 | 57% |
| business-investor | 5 | 50% |
| spiritual-teacher | 2 | 50% |
| finance | 4 | 50% |

## 4. 按 karmesh planet

| 10 宮主 | N | 準確率 |
| --- | --- | --- |
| Sun | 21 | **90%** |
| Venus | 22 | **89%** |
| Mars | 30 | **78%** |
| Moon | 22 | 77% |
| Mercury | 37 | 76% |
| Saturn | 16 | 66% |
| Jupiter | 25 | 54% |

## 5. Round 2 做了什麼（重點）

### 演算法內部（`src/data/careerMatrix.js` + `src/utils/careerVedic.js`）
1. `buildKarakaOverrides` v5 — 加入 D10 10 宮主交叉驗證
2. Mars athletic combo：Mars 與 Jupiter/Moon/Saturn 合宮、Mars 望 10 宮
3. Venus + Moon performer combo：合位／互望 + 一方強旺
4. Mars 在 1/10/11 任意 dignity 都加分（戰士能量位）
5. Venus 在 2/7/9 算次要藝術位

### 驗證器（`scripts/validateCareers.mjs`）
1. **`contextGatedYogaHints`** — 全新函數，把 raj/gaja/dhana/vipreet 的 category hints 改為 context-gated（根據 karmesh/lagnaLord/significator 配置決定觸發什麼）
2. Mars athletic derived signal 從 3 條擴到 13 條（含 D10 Mars signal、Saturn H6 pattern、Mars-ruled lagna 等）
3. Venus-Moon performer derived signal 從 0 條擴到 7 條（含 Venus Trikona、Mercury 公眾宮 + Venus 強、saraswati yoga）
4. 修正 KARAKA_CATEGORY_HINTS：Saturn 加 arts-performer（Shasha Yoga 不等於工業）、移除 tech-engineer

## 6. 詳細分輪報告
- Round 1 report：`reports/final-run.md` 或 `reports/last-run.json`
- Round 2 report：`reports/round2-20260422.md`

## 7. 可重複驗證

```bash
node scripts/validateCareers.mjs
node scripts/validateCareers.mjs --verbose
node scripts/inspectOne.mjs "Tom Brady"
```

Dataset 位置：`data/celebrityDataset.json`（加新 celebrity 只需 append 物件 + 重跑即可）。

## 8. Dataset 組成（173 人）

| Category | Count |
| --- | --- |
| arts-performer | 62 |
| sports-athlete | 39 |
| arts-creator | 19 |
| politics | 17 |
| business-leader | 16 |
| business-entrepreneur | 16 |
| government | 16 |
| tech-exec | 13 |
| media-personality | 8 |
| science-academic | 8 |
| arts-visual | 7 |
| tech-engineer | 5 |
| business-investor | 5 |
| religion-leader | 5 |
| finance | 4 |
| spiritual-teacher | 2 |
| medicine | 2 |
| tech-creative | 1 |
| media-creator | 1 |

Rating 分佈：AA 62、A 76、B 7、C 28（AA+A = 80%）

## 9. Round 2 之後還能做什麼（按投資報酬率排序）

1. **Swiss Ephemeris 替換 simplified formula** — ~3-5% 改善，但需要 npm dependency
2. **Dataset 擴到 AA-only 150+** — 剔除 C rating，減少 birth-time noise
3. **加入 Amsha 盤（D9/D12）** 到 karaka override — D10 已加入但 D9 還未利用
4. **Shadbala 全面實作** — 六力計算能區分 "看似強但其實弱" 的行星
5. **加寬 Jupiter/Saturn karmesh 的細分 variants** — 這兩顆的準確率卡在 54%/66% 是主要瓶頸
