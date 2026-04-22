======================================================================
Celebrity Validation Results   (N=115, errors=0)
Domain filter: arts
Min rating: B
======================================================================
Accuracy: 84.3%
  Full match:    91/115  (79.1%)
  Partial match: 12/115  (10.4%)
  Miss:          12/115  (10.4%)

Per-category accuracy:
  arts-performer             61F/9P/10M of 80  = 82%
  arts-performer-film-actor  32F/4P/5M of 41  = 83%
  arts-creator               28F/1P/2M of 31  = 92%
  arts-performer-musician-singer 20F/5P/4M of 29  = 78%
  arts-visual                11F/2P/2M of 15  = 80%
  arts-creator-director      13F/0P/0M of 13  = 100%
  arts-visual-painter        6F/1P/2M of 9  = 72%
  arts-performer-comedian    7F/0P/1M of 8  = 88%
  business-tycoon-founder    7F/0P/0M of 7  = 100%
  arts-creator-writer        6F/1P/0M of 7  = 93%
  arts-performer-musician-instrument 4F/1P/1M of 6  = 75%
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
  arts-performer-film-actor                32F/4P/5M of 41  = 83%
  arts-performer-musician-singer           20F/5P/4M of 29  = 78%
  arts-performer-musician-instrument       4F/1P/1M of 6  = 75%  ⚠️ 樣本 < 10，誤差大
  arts-performer-dancer                    5F/0P/0M of 5  = 100%  ⚠️ 樣本 < 10，誤差大
  arts-performer-comedian                  7F/0P/1M of 8  = 88%  ⚠️ 樣本 < 10，誤差大
  arts-creator-writer                      6F/1P/0M of 7  = 93%  ⚠️ 樣本 < 10，誤差大
  arts-creator-director                    13F/0P/0M of 13  = 100%
  arts-creator-producer                    2F/0P/0M of 2  = 100%  ⚠️ 樣本 < 5，UI_SUPPRESSED 不計入均值
  arts-visual-painter                      6F/1P/2M of 9  = 72%  ⚠️ 樣本 < 10，誤差大
  arts-visual-photographer                 3F/0P/0M of 3  = 100%  ⚠️ 樣本 < 5，UI_SUPPRESSED 不計入均值
  ── 整個 arts 領域 ──                         91F/12P/12M of 115  = 84.3%
  ── 有效 sub-cat 均值（n>=5）──                 = 86.0%

Per-karmeshPlanet accuracy:
  Mercury    20F/6P/0M of 26  = 88%
  Mars       14F/3P/5M of 22  = 70%
  Venus      19F/0P/0M of 19  = 100%
  Jupiter    8F/2P/6M of 16  = 56%
  Moon       14F/0P/0M of 14  = 100%
  Sun        11F/0P/1M of 12  = 92%
  Saturn     5F/1P/0M of 6  = 92%

Miss list (expected but predicted something different):
  Adele                      true=arts-performer|arts-performer-musician-singer pred=business-investor, finance, business-finance, government
  Amitabh Bachchan           true=arts-performer|arts-performer-film-actor pred=sports-athlete, medicine, science-academic, religion-leader
  Andy Warhol                true=arts-visual|arts-visual-painter pred=business-investor, politics, government, sports-athlete
  Angelina Jolie             true=arts-performer|arts-performer-film-actor pred=politics-military, spiritual-teacher, law, military
  Beethoven                  true=arts-creator|arts-performer|arts-performer-musician-instrument pred=business-ceo-hired, politics-head-state, law, science-academic
  Denzel Washington          true=arts-performer|arts-performer-film-actor pred=business-tycoon-heir, government, science-academic, religion-leader
  Humphrey Bogart            true=arts-performer|arts-performer-film-actor pred=law, medicine, media-personality, business-realestate
  John Lennon                true=arts-performer|arts-creator|arts-performer-musician-singer pred=finance, banking, business-tycoon-heir, business-finance
  Mariah Carey               true=arts-performer|arts-performer-musician-singer pred=medicine, sports-athlete, military, media-personality
  Salvador Dali              true=arts-visual|arts-visual-painter pred=business-ceo-hired, politics-head-state, law, science-academic
  Steve Martin               true=arts-performer|arts-performer-comedian|arts-performer-film-actor pred=business-investor, government, politics, media-personality
  Whitney Houston            true=arts-performer|arts-performer-musician-singer pred=sports-athlete, medicine, science-academic, religion-leader

Partial list:
  Anthony Hopkins            true=arts-performer|arts-performer-film-actor pred=media-personality, sports-athlete, military, medicine
  Arnold Schwarzenegger      true=arts-performer|arts-performer-film-actor pred=science-academic, business-leader, business-entrepreneur, arts-creator
  Barbra Streisand           true=arts-performer|arts-performer-musician-singer pred=business-media, arts-creator, religion-leader, government
  Bruno Mars                 true=arts-performer|arts-performer-musician-singer pred=finance, business-tycoon-heir, business-finance, business-investor
  Jimi Hendrix               true=arts-performer|arts-performer-musician-instrument|arts-performer-musician-singer pred=finance, business-finance, exploration, science-academic
  Kate Winslet               true=arts-performer|arts-performer-film-actor pred=media-personality, science-academic, religion-leader, spiritual-teacher
  Lady Gaga                  true=arts-performer|arts-performer-musician-singer pred=finance, business-finance, law, politics
  Michael Jackson            true=arts-performer|arts-performer-musician-singer pred=tech-engineer, business-entrepreneur, business-tycoon-founder, arts-creator
  Nicole Kidman              true=arts-performer|arts-performer-film-actor pred=sports-athlete, military, medicine, business-leader
  Pablo Picasso              true=arts-visual|arts-visual-painter pred=exploration, politics, government, business-entrepreneur
  Stephen King               true=arts-creator|arts-creator-writer pred=business-entrepreneur, business-tycoon-founder, sports-athlete, politics-military
  Tom Ford                   true=business-retail|arts-visual    pred=finance, business-finance, exploration, business-leader