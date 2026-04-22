======================================================================
Celebrity Validation Results   (N=115, errors=0)
Domain filter: arts
Min rating: B
======================================================================
Accuracy: 93.5%
  Full match:    100/115  (87.0%)
  Partial match: 15/115  (13.0%)
  Miss:          0/115  (0.0%)

Per-category accuracy:
  arts-performer             69F/11P/0M of 80  = 93%
  arts-performer-film-actor  36F/5P/0M of 41  = 94%
  arts-creator               30F/1P/0M of 31  = 98%
  arts-performer-musician-singer 24F/5P/0M of 29  = 91%
  arts-visual                11F/4P/0M of 15  = 87%
  arts-creator-director      13F/0P/0M of 13  = 100%
  arts-visual-painter        6F/3P/0M of 9  = 83%
  arts-performer-comedian    7F/1P/0M of 8  = 94%
  business-tycoon-founder    7F/0P/0M of 7  = 100%
  arts-creator-writer        7F/0P/0M of 7  = 100%
  arts-performer-musician-instrument 4F/2P/0M of 6  = 83%
  arts-performer-dancer      5F/0P/0M of 5  = 100%
  business-retail            3F/1P/0M of 4  = 88%
  arts-visual-photographer   3F/0P/0M of 3  = 100%
  business-media             2F/0P/0M of 2  = 100%
  arts-creator-producer      2F/0P/0M of 2  = 100%
  media-creator              1F/0P/0M of 1  = 100%
  media-personality          1F/0P/0M of 1  = 100%
  politics                   1F/0P/0M of 1  = 100%
  government                 1F/0P/0M of 1  = 100%
  politics-head-state        1F/0P/0M of 1  = 100%

Arts sub-category breakdown (Round 5):
  arts-performer-film-actor                36F/5P/0M of 41  = 94%
  arts-performer-musician-singer           24F/5P/0M of 29  = 91%
  arts-performer-musician-instrument       4F/2P/0M of 6  = 83%  ⚠️ 樣本 < 10，誤差大
  arts-performer-dancer                    5F/0P/0M of 5  = 100%  ⚠️ 樣本 < 10，誤差大
  arts-performer-comedian                  7F/1P/0M of 8  = 94%  ⚠️ 樣本 < 10，誤差大
  arts-creator-writer                      7F/0P/0M of 7  = 100%  ⚠️ 樣本 < 10，誤差大
  arts-creator-director                    13F/0P/0M of 13  = 100%
  arts-creator-producer                    2F/0P/0M of 2  = 100%  ⚠️ 樣本 < 5，UI_SUPPRESSED 不計入均值
  arts-visual-painter                      6F/3P/0M of 9  = 83%  ⚠️ 樣本 < 10，誤差大
  arts-visual-photographer                 3F/0P/0M of 3  = 100%  ⚠️ 樣本 < 5，UI_SUPPRESSED 不計入均值
  ── 整個 arts 領域 ──                         100F/15P/0M of 115  = 93.5%
  ── 有效 sub-cat 均值（n>=5）──                 = 93.2%

Per-karmeshPlanet accuracy:
  Mercury    24F/2P/0M of 26  = 96%
  Mars       17F/5P/0M of 22  = 89%
  Venus      19F/0P/0M of 19  = 100%
  Jupiter    10F/6P/0M of 16  = 81%
  Moon       14F/0P/0M of 14  = 100%
  Sun        11F/1P/0M of 12  = 96%
  Saturn     5F/1P/0M of 6  = 92%

Miss list (expected but predicted something different):

Partial list:
  Andy Warhol                true=arts-visual|arts-visual-painter pred=business-investor, politics, government, sports-athlete
  Angelina Jolie             true=arts-performer|arts-performer-film-actor pred=politics-military, spiritual-teacher, law, military
  Arnold Schwarzenegger      true=arts-performer|arts-performer-film-actor pred=science-academic, business-leader, business-entrepreneur, arts-creator
  Barbra Streisand           true=arts-performer|arts-performer-musician-singer pred=business-media, arts-creator, religion-leader, government
  Beethoven                  true=arts-creator|arts-performer|arts-performer-musician-instrument pred=business-ceo-hired, politics-head-state, law, science-academic
  Denzel Washington          true=arts-performer|arts-performer-film-actor pred=business-tycoon-heir, government, science-academic, religion-leader
  Humphrey Bogart            true=arts-performer|arts-performer-film-actor pred=law, medicine, media-personality, business-realestate
  Jimi Hendrix               true=arts-performer|arts-performer-musician-instrument|arts-performer-musician-singer pred=finance, business-finance, exploration, science-academic
  Lady Gaga                  true=arts-performer|arts-performer-musician-singer pred=finance, business-finance, law, politics
  Mariah Carey               true=arts-performer|arts-performer-musician-singer pred=medicine, sports-athlete, military, media-personality
  Michael Jackson            true=arts-performer|arts-performer-musician-singer pred=tech-engineer, business-entrepreneur, business-tycoon-founder, arts-creator
  Pablo Picasso              true=arts-visual|arts-visual-painter pred=exploration, politics, government, business-entrepreneur
  Salvador Dali              true=arts-visual|arts-visual-painter pred=business-ceo-hired, politics-head-state, law, science-academic
  Steve Martin               true=arts-performer|arts-performer-comedian|arts-performer-film-actor pred=business-investor, government, politics, media-personality
  Tom Ford                   true=business-retail|arts-visual    pred=finance, business-finance, exploration, business-leader