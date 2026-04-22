======================================================================
Celebrity Validation Results   (N=197, errors=0)
Domain filter: business
Min rating: B
======================================================================
Accuracy: 91.9%
  Full match:    165/197  (83.8%)
  Partial match: 32/197  (16.2%)
  Miss:          0/197  (0.0%)

Per-category accuracy:
  business-tycoon-founder    118F/9P/0M of 127  = 96%
  business-tech-founder      55F/5P/0M of 60  = 96%
  business-industrial        43F/12P/0M of 55  = 89%
  business-finance           32F/6P/0M of 38  = 92%
  business-investor          24F/7P/0M of 31  = 89%
  business-retail            28F/2P/0M of 30  = 97%
  business-tycoon-heir       16F/10P/0M of 26  = 81%
  business-ceo-hired         14F/6P/0M of 20  = 85%
  business-realestate        11F/6P/0M of 17  = 82%
  business-media             15F/1P/0M of 16  = 97%
  politics                   3F/3P/0M of 6  = 75%
  media-personality          3F/0P/0M of 3  = 100%
  arts-performer             3F/0P/0M of 3  = 100%
  arts-visual                2F/1P/0M of 3  = 83%
  arts-creator               2F/0P/0M of 2  = 100%
  government                 1F/0P/0M of 1  = 100%
  medicine                   1F/0P/0M of 1  = 100%

Business sub-category breakdown (Round 3):
  business-tycoon-founder      118F/9P/0M of 127  = 96%
  business-tycoon-heir         16F/10P/0M of 26  = 81%
  business-ceo-hired           14F/6P/0M of 20  = 85%
  business-investor            24F/7P/0M of 31  = 89%
  business-finance             32F/6P/0M of 38  = 92%
  business-retail              28F/2P/0M of 30  = 97%
  business-media               15F/1P/0M of 16  = 97%  ⚠️ 樣本 < 20，誤差大
  business-realestate          11F/6P/0M of 17  = 82%  ⚠️ 樣本 < 20，誤差大
  business-industrial          43F/12P/0M of 55  = 89%
  business-tech-founder        55F/5P/0M of 60  = 96%
  ── 整個 business 領域 ──         165F/32P/0M of 197  = 91.9%

Per-karmeshPlanet accuracy:
  Mercury    32F/11P/0M of 43  = 87%
  Venus      32F/3P/0M of 35  = 96%
  Saturn     25F/5P/0M of 30  = 92%
  Mars       22F/2P/0M of 24  = 96%
  Jupiter    20F/4P/0M of 24  = 92%
  Sun        17F/4P/0M of 21  = 90%
  Moon       17F/3P/0M of 20  = 93%

Miss list (expected but predicted something different):

Partial list:
  Abigail Johnson            true=business-finance|business-tycoon-heir pred=business-retail, arts-visual, business-leader, arts-performer
  Anil Ambani                true=business-industrial|business-tycoon-heir pred=business-entrepreneur, business-tycoon-founder, sports-athlete, military
  Barron Hilton              true=business-realestate|business-tycoon-heir pred=exploration, science-academic, religion-leader, spiritual-teacher
  Barry Lam                  true=business-tech-founder|business-industrial|business-tycoon-founder pred=finance, business-finance, exploration, business-media
  Chey Tae-won               true=business-industrial|business-tycoon-heir pred=tech-exec, business-tech-founder, science-academic, religion-leader
  Chung Ju-yung              true=business-industrial|business-tycoon-founder pred=tech-exec, business-tech-founder, business-investor, business-finance
  David Koch                 true=business-industrial|business-tycoon-heir pred=business-investor, finance, business-finance, government
  Donald Trump               true=politics|business-realestate|business-tycoon-heir pred=tech-creative, arts-visual, exploration, business-investor
  Eike Batista               true=business-industrial|business-tycoon-founder pred=tech-exec, business-tech-founder, sports-athlete, military
  Elizabeth Holmes           true=business-tech-founder          pred=business-ceo-hired, law, science-academic, religion-leader
  George Soros               true=business-investor|business-finance pred=business-media, arts-creator, politics, government
  Iris Fontbona              true=business-industrial|business-tycoon-heir pred=tech-creative, arts-visual, exploration, science-academic
  Jack Dorsey                true=business-tech-founder|business-tycoon-founder pred=finance, business-finance, exploration, sports-athlete
  John Paulson               true=business-investor|business-finance pred=media-personality, sports-athlete, military, medicine
  Keiichiro Takahara         true=business-industrial|business-tycoon-founder pred=medicine, arts-performer, arts-visual, arts-creator
  Kumar Mangalam Birla       true=business-industrial|business-tycoon-heir pred=tech-engineer, business-entrepreneur, business-tycoon-founder, arts-creator
  Lee Iacocca                true=business-ceo-hired|business-industrial pred=politics, sports-athlete, arts-performer, business-investor
  Li Ka-shing                true=business-realestate|business-tycoon-founder|business-investor pred=business-media, media-personality, media-creator, sports-athlete
  Liliane Bettencourt        true=business-retail|business-tycoon-heir pred=exploration, sports-athlete, military, medicine
  Lloyd Blankfein            true=business-finance|business-ceo-hired pred=business-media, spiritual-teacher, arts-performer, arts-visual
  Mallika Srinivasan         true=business-industrial|business-ceo-hired pred=finance, business-finance, exploration, arts-performer
  Meg Whitman                true=business-ceo-hired             pred=finance, business-finance, exploration, arts-performer
  Mitt Romney                true=business-investor|business-finance|politics pred=business-media, media-personality, sports-athlete, military
  Niklas Zennstrom           true=business-tech-founder|business-investor pred=business-leader, business-industrial, government, arts-performer
  Rick Scott                 true=business-ceo-hired|politics    pred=finance, business-finance, exploration, sports-athlete
  Robert Iger                true=business-ceo-hired|business-media pred=government, sports-athlete, military, medicine
  Sam Zell                   true=business-realestate|business-investor pred=business-media, media-personality, media-creator, arts-performer
  Stephen Ross               true=business-realestate|business-tycoon-founder pred=business-investor, finance, business-finance, arts-performer
  Stephen Schwarzman         true=business-investor|business-finance|business-tycoon-founder pred=business-media, media-personality, sports-athlete, military
  Takemitsu Takizaki         true=business-industrial|business-tech-founder|business-tycoon-founder pred=finance, business-tycoon-heir, business-finance, business-realestate
  Tom Ford                   true=business-retail|arts-visual    pred=finance, business-finance, exploration, business-leader
  Yang Huiyan                true=business-realestate|business-tycoon-heir pred=tech-exec, business-tech-founder, sports-athlete, military