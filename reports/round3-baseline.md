======================================================================
Celebrity Validation Results   (N=197, errors=0)
Domain filter: business
Min rating: B
======================================================================
Accuracy: 86.5%
  Full match:    144/197  (73.1%)
  Partial match: 53/197  (26.9%)
  Miss:          0/197  (0.0%)

Per-category accuracy:
  business-tycoon-founder    109F/18P/0M of 127  = 93%
  business-tech-founder      43F/17P/0M of 60  = 86%
  business-industrial        42F/13P/0M of 55  = 88%
  business-finance           24F/14P/0M of 38  = 82%
  business-investor          15F/16P/0M of 31  = 74%
  business-retail            28F/2P/0M of 30  = 97%
  business-tycoon-heir       15F/11P/0M of 26  = 79%
  business-ceo-hired         11F/9P/0M of 20  = 78%
  business-realestate        11F/6P/0M of 17  = 82%
  business-media             14F/2P/0M of 16  = 94%
  politics                   3F/3P/0M of 6  = 75%
  media-personality          3F/0P/0M of 3  = 100%
  arts-performer             3F/0P/0M of 3  = 100%
  arts-visual                2F/1P/0M of 3  = 83%
  arts-creator               2F/0P/0M of 2  = 100%
  government                 1F/0P/0M of 1  = 100%
  medicine                   0F/1P/0M of 1  = 50%

Business sub-category breakdown (Round 3):
  business-tycoon-founder      109F/18P/0M of 127  = 93%
  business-tycoon-heir         15F/11P/0M of 26  = 79%
  business-ceo-hired           11F/9P/0M of 20  = 78%
  business-investor            15F/16P/0M of 31  = 74%
  business-finance             24F/14P/0M of 38  = 82%
  business-retail              28F/2P/0M of 30  = 97%
  business-media               14F/2P/0M of 16  = 94%  ⚠️ 樣本 < 20，誤差大
  business-realestate          11F/6P/0M of 17  = 82%  ⚠️ 樣本 < 20，誤差大
  business-industrial          42F/13P/0M of 55  = 88%
  business-tech-founder        43F/17P/0M of 60  = 86%
  ── 整個 business 領域 ──         144F/53P/0M of 197  = 86.5%

Per-karmeshPlanet accuracy:
  Mercury    29F/14P/0M of 43  = 84%
  Venus      25F/10P/0M of 35  = 86%
  Saturn     20F/10P/0M of 30  = 83%
  Mars       21F/3P/0M of 24  = 94%
  Jupiter    16F/8P/0M of 24  = 83%
  Sun        18F/3P/0M of 21  = 93%
  Moon       15F/5P/0M of 20  = 88%

Miss list (expected but predicted something different):

Partial list:
  Abigail Johnson            true=business-finance|business-tycoon-heir pred=business-retail, arts-visual, business-leader, arts-performer
  Akio Morita                true=business-industrial|business-tech-founder|business-tycoon-founder pred=law, medicine, finance, business-finance
  Anil Ambani                true=business-industrial|business-tycoon-heir pred=business-entrepreneur, business-tycoon-founder, business-retail, sports-athlete
  Azim Premji                true=business-tech-founder|business-industrial|business-tycoon-heir pred=tech-exec, business-leader, business-ceo-hired, business-retail
  Barron Hilton              true=business-realestate|business-tycoon-heir pred=exploration, science-academic, religion-leader, spiritual-teacher
  Barry Lam                  true=business-tech-founder|business-industrial|business-tycoon-founder pred=finance, business-finance, exploration, business-media
  Carl Icahn                 true=business-investor|business-finance pred=business-industrial, business-leader, arts-performer, sports-athlete
  Chey Tae-won               true=business-industrial|business-tycoon-heir pred=tech-exec, business-tech-founder, science-academic, religion-leader
  Chung Ju-yung              true=business-industrial|business-tycoon-founder pred=tech-exec, business-tech-founder, business-media, arts-creator
  Conrad Hilton              true=business-realestate|business-tycoon-founder pred=tech-exec, business-leader, business-ceo-hired, business-retail
  Daniel Ek                  true=business-tech-founder|business-tycoon-founder pred=government, sports-athlete, arts-performer, tech-creative
  David Einhorn              true=business-investor|business-finance pred=tech-exec, business-tech-founder, sports-athlete, military
  David Koch                 true=business-industrial|business-tycoon-heir pred=business-investor, finance, business-finance, government
  David Tepper               true=business-investor|business-finance pred=medicine, arts-performer, arts-visual, arts-creator
  Donald Trump               true=politics|business-realestate|business-tycoon-heir pred=tech-creative, arts-visual, exploration, business-entrepreneur
  Elizabeth Holmes           true=business-tech-founder          pred=business-ceo-hired, law, science-academic, religion-leader
  Elon Musk                  true=business-tech-founder|business-tycoon-founder pred=law, medicine, arts-performer, arts-visual
  George Soros               true=business-investor|business-finance pred=business-media, arts-creator, politics, government
  Ginni Rometty              true=business-ceo-hired|business-tech-founder pred=finance, business-finance, exploration, business-media
  Herbert Kelleher           true=business-tycoon-founder|business-ceo-hired pred=finance, business-finance, medicine, arts-performer
  Iris Fontbona              true=business-industrial|business-tycoon-heir pred=tech-creative, arts-visual, exploration, science-academic
  John Paulson               true=business-investor|business-finance pred=business-retail, media-personality, sports-athlete, military
  Keiichiro Takahara         true=business-industrial|business-tycoon-founder pred=medicine, arts-performer, arts-visual, arts-creator
  Ken Griffin                true=business-investor|business-finance|business-tycoon-founder pred=tech-exec, business-tech-founder, politics, government
  Kim Bum-soo                true=business-tech-founder|business-tycoon-founder pred=business-leader, business-industrial, government, arts-performer
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
  Paul Getty                 true=business-industrial|business-tycoon-founder pred=tech-exec, business-leader, business-ceo-hired, business-retail
  Ray Dalio                  true=business-investor|business-finance pred=business-retail, business-realestate, politics, government
  Rick Scott                 true=business-ceo-hired|politics    pred=finance, business-finance, exploration, sports-athlete
  Robert Iger                true=business-ceo-hired|business-media pred=government, sports-athlete, military, medicine
  Rupert Murdoch             true=business-media|business-tycoon-founder pred=finance, business-finance, medicine, arts-performer
  Sam Zell                   true=business-realestate|business-investor pred=business-media, media-personality, media-creator, arts-performer
  Stanley Druckenmiller      true=business-investor|business-finance pred=exploration, arts-performer, business-entrepreneur, business-tycoon-founder
  Stephen Ross               true=business-realestate|business-tycoon-founder pred=business-investor, finance, business-finance, arts-performer
  Steven Cohen               true=business-investor|business-finance pred=sports-athlete, medicine, business-entrepreneur, business-tycoon-founder
  Sundar Pichai              true=business-ceo-hired|business-tech-founder pred=law, science-academic, religion-leader, spiritual-teacher
  Tadashi Yanai              true=business-retail|business-tycoon-founder pred=business-ceo-hired, law, science-academic, religion-leader
  Tim Cook                   true=business-ceo-hired|business-tech-founder pred=medicine, science-academic, religion-leader, spiritual-teacher
  Tom Ford                   true=business-retail|arts-visual    pred=finance, business-finance, exploration, business-leader
  Warren Buffett             true=business-investor|business-finance pred=tech-exec, business-leader, business-ceo-hired, government
  Yang Huiyan                true=business-realestate|business-tycoon-heir pred=tech-exec, business-tech-founder, sports-athlete, military
  Zhang Yiming               true=business-tech-founder|business-tycoon-founder pred=government, business-leader, arts-performer, politics