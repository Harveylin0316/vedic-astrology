======================================================================
Celebrity Validation Results   (N=197, errors=0)
Domain filter: business
Min rating: B
======================================================================
Accuracy: 89.3%
  Full match:    155/197  (78.7%)
  Partial match: 42/197  (21.3%)
  Miss:          0/197  (0.0%)

Per-category accuracy:
  business-tycoon-founder    115F/12P/0M of 127  = 95%
  business-tech-founder      47F/13P/0M of 60  = 89%
  business-industrial        44F/11P/0M of 55  = 90%
  business-finance           28F/10P/0M of 38  = 87%
  business-investor          19F/12P/0M of 31  = 81%
  business-retail            29F/1P/0M of 30  = 98%
  business-tycoon-heir       16F/10P/0M of 26  = 81%
  business-ceo-hired         12F/8P/0M of 20  = 80%
  business-realestate        12F/5P/0M of 17  = 85%
  business-media             14F/2P/0M of 16  = 94%
  politics                   3F/3P/0M of 6  = 75%
  media-personality          3F/0P/0M of 3  = 100%
  arts-performer             3F/0P/0M of 3  = 100%
  arts-visual                2F/1P/0M of 3  = 83%
  arts-creator               2F/0P/0M of 2  = 100%
  government                 1F/0P/0M of 1  = 100%
  medicine                   0F/1P/0M of 1  = 50%

Business sub-category breakdown (Round 3):
  business-tycoon-founder      115F/12P/0M of 127  = 95%
  business-tycoon-heir         16F/10P/0M of 26  = 81%
  business-ceo-hired           12F/8P/0M of 20  = 80%
  business-investor            19F/12P/0M of 31  = 81%
  business-finance             28F/10P/0M of 38  = 87%
  business-retail              29F/1P/0M of 30  = 98%
  business-media               14F/2P/0M of 16  = 94%  ⚠️ 樣本 < 20，誤差大
  business-realestate          12F/5P/0M of 17  = 85%  ⚠️ 樣本 < 20，誤差大
  business-industrial          44F/11P/0M of 55  = 90%
  business-tech-founder        47F/13P/0M of 60  = 89%
  ── 整個 business 領域 ──         155F/42P/0M of 197  = 89.3%

Per-karmeshPlanet accuracy:
  Mercury    31F/12P/0M of 43  = 86%
  Venus      28F/7P/0M of 35  = 90%
  Saturn     23F/7P/0M of 30  = 88%
  Mars       22F/2P/0M of 24  = 96%
  Jupiter    17F/7P/0M of 24  = 85%
  Sun        18F/3P/0M of 21  = 93%
  Moon       16F/4P/0M of 20  = 90%

Miss list (expected but predicted something different):

Partial list:
  Abigail Johnson            true=business-finance|business-tycoon-heir pred=business-retail, arts-visual, business-leader, arts-performer
  Akio Morita                true=business-industrial|business-tech-founder|business-tycoon-founder pred=law, medicine, finance, business-finance
  Anil Ambani                true=business-industrial|business-tycoon-heir pred=business-entrepreneur, business-tycoon-founder, business-retail, sports-athlete
  Barron Hilton              true=business-realestate|business-tycoon-heir pred=exploration, science-academic, religion-leader, spiritual-teacher
  Barry Lam                  true=business-tech-founder|business-industrial|business-tycoon-founder pred=finance, business-finance, exploration, business-media
  Chey Tae-won               true=business-industrial|business-tycoon-heir pred=tech-exec, business-tech-founder, science-academic, religion-leader
  Chung Ju-yung              true=business-industrial|business-tycoon-founder pred=tech-exec, business-tech-founder, business-investor, business-finance
  David Koch                 true=business-industrial|business-tycoon-heir pred=business-investor, finance, business-finance, government
  David Tepper               true=business-investor|business-finance pred=medicine, arts-performer, arts-visual, arts-creator
  Donald Trump               true=politics|business-realestate|business-tycoon-heir pred=tech-creative, arts-visual, exploration, business-tech-founder
  Elizabeth Holmes           true=business-tech-founder          pred=business-ceo-hired, law, science-academic, religion-leader
  Elon Musk                  true=business-tech-founder|business-tycoon-founder pred=law, medicine, arts-performer, arts-visual
  George Soros               true=business-investor|business-finance pred=business-media, arts-creator, politics, government
  Ginni Rometty              true=business-ceo-hired|business-tech-founder pred=finance, business-finance, exploration, business-media
  Herbert Kelleher           true=business-tycoon-founder|business-ceo-hired pred=finance, business-finance, medicine, arts-performer
  Iris Fontbona              true=business-industrial|business-tycoon-heir pred=tech-creative, arts-visual, exploration, science-academic
  John Paulson               true=business-investor|business-finance pred=business-retail, media-personality, sports-athlete, military
  Keiichiro Takahara         true=business-industrial|business-tycoon-founder pred=medicine, arts-performer, arts-visual, arts-creator
  Lee Jae-yong               true=business-industrial|business-tech-founder|business-tycoon-heir pred=business-retail, arts-visual, politics, government
  Lei Jun                    true=business-tech-founder|business-tycoon-founder pred=business-retail, arts-visual, tech-creative, tech-engineer
  Lloyd Blankfein            true=business-finance|business-ceo-hired pred=business-media, spiritual-teacher, arts-performer, arts-visual
  Mallika Srinivasan         true=business-industrial|business-ceo-hired pred=finance, business-finance, exploration, arts-performer
  Marc Andreessen            true=business-investor|business-tech-founder pred=business-retail, arts-visual, sports-athlete, military
  Masayoshi Son              true=business-investor|business-tech-founder|business-tycoon-founder pred=finance, business-finance, exploration, business-media
  Meg Whitman                true=business-ceo-hired             pred=finance, business-finance, exploration, arts-performer
  Mitt Romney                true=business-investor|business-finance|politics pred=business-media, media-personality, sports-athlete, military
  Mukesh Ambani              true=business-industrial|business-tycoon-heir pred=finance, business-finance, law, sports-athlete
  Nelson Peltz               true=business-investor|business-finance pred=tech-exec, business-leader, business-tycoon-founder, business-ceo-hired
  Niklas Zennstrom           true=business-tech-founder|business-investor pred=business-leader, business-industrial, government, arts-performer
  Patrick Soon-Shiong        true=business-tech-founder|business-tycoon-founder|medicine pred=finance, business-finance, exploration, business-media
  Ray Dalio                  true=business-investor|business-finance pred=business-retail, business-realestate, politics, government
  Rick Scott                 true=business-ceo-hired|politics    pred=finance, business-finance, exploration, sports-athlete
  Robert Iger                true=business-ceo-hired|business-media pred=government, sports-athlete, military, medicine
  Rupert Murdoch             true=business-media|business-tycoon-founder pred=finance, business-finance, medicine, arts-performer
  Sam Zell                   true=business-realestate|business-investor pred=business-media, media-personality, media-creator, arts-performer
  Stanley Druckenmiller      true=business-investor|business-finance pred=exploration, arts-performer, business-entrepreneur, business-tycoon-founder
  Stephen Ross               true=business-realestate|business-tycoon-founder pred=business-investor, finance, business-finance, arts-performer
  Sundar Pichai              true=business-ceo-hired|business-tech-founder pred=law, science-academic, religion-leader, spiritual-teacher
  Tom Ford                   true=business-retail|arts-visual    pred=finance, business-finance, exploration, business-leader
  Warren Buffett             true=business-investor|business-finance pred=tech-exec, business-leader, business-ceo-hired, government
  Yang Huiyan                true=business-realestate|business-tycoon-heir pred=tech-exec, business-tech-founder, sports-athlete, military
  Zhang Yiming               true=business-tech-founder|business-tycoon-founder pred=government, business-leader, arts-performer, politics