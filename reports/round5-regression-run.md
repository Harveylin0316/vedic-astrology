# Round 5 Regression Run

## Date
2026-04-22

## Floors (from Round 4)
- business: 91.9%
- politics: 95.1%
- 全 dataset: 90.1%

## Post-Round-5 結果

```
=== BUSINESS ===
Celebrity Validation Results   (N=197, errors=0)  Domain filter: business
Accuracy: 91.9%
  Full match:    165/197  (83.8%)
  Partial match: 32/197  (16.2%)
  Miss:          0/197  (0.0%)

=== POLITICS ===
Celebrity Validation Results   (N=81, errors=0)   Domain filter: politics
Accuracy: 95.1%
  Full match:    73/81  (90.1%)
  Partial match: 8/81  (9.9%)
  Miss:          0/81  (0.0%)

=== FULL ===
Celebrity Validation Results   (N=388, errors=0)
Accuracy: 92.8%
  Full match:    334/388  (86.1%)
  Partial match: 52/388  (13.4%)
  Miss:          2/388  (0.5%)

=== ARTS ===
Celebrity Validation Results   (N=115, errors=0)  Domain filter: arts
Accuracy: 93.5%
  Full match:    100/115  (87.0%)
  Partial match: 15/115  (13.0%)
  Miss:          0/115  (0.0%)
```

## 判定

- business: 91.9% == 91.9% floor → **PASS**（±0，沒退步）
- politics: 95.1% == 95.1% floor → **PASS**
- 全 dataset: 92.8% > 90.1% floor → **PASS**（+2.7 pp 提升）
- arts: 93.5% > 85% 目標 → **PASS**

所有守門 floor 通過。arts 目標超標。

## Detector 行為特性

arts detector 透過 `artsFlag` 獨立閘口運作：只有 Venus 非 debilitated（或 Neecha Bhanga 救援）且 karmesh/D10/yoga/Venus 位置等條件滿足時才 fire。非藝術盤（business/politics 樣本）不會誤觸發 arts sub-cat，因此 business/politics 的 regression 數字完全未動。
