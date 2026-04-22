======================================================================
Celebrity Validation Results   (N=345, errors=0)
Min rating: B
======================================================================
Accuracy: 90.1%
  Full match:    288/345  (83.5%)
  Partial match: 46/345  (13.3%)
  Miss:          11/345  (3.2%)

Per-category accuracy:
  business-tycoon-founder    118F/9P/0M of 127  = 96%
  politics                   70F/8P/0M of 78  = 95%
  business-tech-founder      55F/5P/0M of 60  = 96%
  arts-performer             43F/6P/7M of 56  = 82%
  business-industrial        43F/12P/0M of 55  = 89%
  government                 49F/5P/0M of 54  = 95%
  politics-head-state        36F/3P/0M of 39  = 96%
  business-finance           32F/6P/0M of 38  = 92%
  business-investor          24F/7P/0M of 31  = 89%
  business-retail            28F/2P/0M of 30  = 97%
  business-tycoon-heir       16F/10P/0M of 26  = 81%
  politics-head-gov          23F/3P/0M of 26  = 94%
  business-ceo-hired         14F/6P/0M of 20  = 85%
  arts-creator               15F/1P/1M of 17  = 91%
  business-realestate        11F/6P/0M of 17  = 82%
  business-media             15F/1P/0M of 16  = 97%
  politics-revolutionary     13F/1P/0M of 14  = 96%
  media-personality          5F/1P/2M of 8  = 69%
  politics-military          8F/0P/0M of 8  = 100%
  arts-visual                3F/2P/2M of 7  = 57%
  politics-authoritarian     7F/0P/0M of 7  = 100%
  science-academic           5F/1P/0M of 6  = 92%
  religion-leader            5F/0P/0M of 5  = 100%
  medicine                   3F/0P/0M of 3  = 100%
  politics-diplomat          3F/0P/0M of 3  = 100%
  media-creator              1F/0P/0M of 1  = 100%
  spiritual-teacher          1F/0P/0M of 1  = 100%
  government-judicial        1F/0P/0M of 1  = 100%
  law                        1F/0P/0M of 1  = 100%

Per-karmeshPlanet accuracy:
  Mercury    58F/17P/0M of 75  = 89%
  Venus      49F/3P/0M of 52  = 97%
  Mars       40F/5P/5M of 50  = 85%
  Saturn     37F/8P/1M of 46  = 89%
  Jupiter    33F/6P/4M of 43  = 84%
  Moon       40F/3P/0M of 43  = 97%
  Sun        31F/4P/1M of 36  = 92%

Miss list (expected but predicted something different):
  Adele                      true=arts-performer                 pred=business-investor, finance, business-finance, government
  Amitabh Bachchan           true=arts-performer                 pred=sports-athlete, medicine, science-academic, religion-leader
  Andy Warhol                true=arts-visual                    pred=business-investor, politics, government, sports-athlete
  Angelina Jolie             true=arts-performer                 pred=politics-military, spiritual-teacher, law, military
  David Letterman            true=media-personality              pred=business-realestate, business-industrial, politics, government
  Denzel Washington          true=arts-performer                 pred=business-tycoon-heir, government, science-academic, religion-leader
  Humphrey Bogart            true=arts-performer                 pred=law, medicine, media-personality, business-realestate
  Jay Leno                   true=media-personality              pred=sports-athlete, law, arts-performer, arts-visual
  John Lennon                true=arts-performer|arts-creator    pred=finance, banking, business-tycoon-heir, business-finance
  Salvador Dali              true=arts-visual                    pred=business-ceo-hired, politics-head-state, law, science-academic
  Whitney Houston            true=arts-performer                 pred=sports-athlete, medicine, science-academic, religion-leader

Partial list:
  Abigail Johnson            true=business-finance|business-tycoon-heir pred=business-retail, arts-visual, business-leader, arts-performer
  Anil Ambani                true=business-industrial|business-tycoon-heir pred=business-entrepreneur, business-tycoon-founder, sports-athlete, politics-military
  Anthony Hopkins            true=arts-performer                 pred=media-personality, sports-athlete, military, medicine
  Barron Hilton              true=business-realestate|business-tycoon-heir pred=exploration, science-academic, religion-leader, spiritual-teacher
  Barry Lam                  true=business-tech-founder|business-industrial|business-tycoon-founder pred=finance, business-finance, exploration, business-media
  Bruno Mars                 true=arts-performer                 pred=finance, business-tycoon-heir, business-finance, business-investor
  Carl Sagan                 true=science-academic|media-personality pred=religion-leader, law, business-leader, arts-performer
  Chey Tae-won               true=business-industrial|business-tycoon-heir pred=tech-exec, business-tech-founder, science-academic, religion-leader
  Chung Ju-yung              true=business-industrial|business-tycoon-founder pred=tech-exec, business-tech-founder, business-investor, business-finance
  David Cameron              true=politics|government|politics-head-gov pred=finance, business-tycoon-heir, business-finance, science-academic
  David Koch                 true=business-industrial|business-tycoon-heir pred=business-investor, finance, business-finance, government
  Donald Trump               true=politics|business-realestate|business-tycoon-heir|politics-head-state pred=tech-creative, arts-visual, exploration, business-investor
  Eike Batista               true=business-industrial|business-tycoon-founder pred=tech-exec, business-tech-founder, sports-athlete, military
  Elizabeth Holmes           true=business-tech-founder          pred=business-ceo-hired, politics-head-state, law, science-academic
  George Soros               true=business-investor|business-finance pred=business-media, arts-creator, politics, government
  Iris Fontbona              true=business-industrial|business-tycoon-heir pred=tech-creative, arts-visual, exploration, science-academic
  Jack Dorsey                true=business-tech-founder|business-tycoon-founder pred=finance, business-finance, exploration, sports-athlete
  John Howard                true=politics|government|politics-head-gov pred=business-realestate, business-industrial, exploration, science-academic
  John Paulson               true=business-investor|business-finance pred=media-personality, sports-athlete, military, medicine
  Kamala Harris              true=politics|government|politics-head-gov pred=religion-leader, exploration, business-leader, arts-performer
  Kate Winslet               true=arts-performer                 pred=media-personality, science-academic, religion-leader, spiritual-teacher
  Keiichiro Takahara         true=business-industrial|business-tycoon-founder pred=medicine, arts-performer, arts-visual, arts-creator
  Kumar Mangalam Birla       true=business-industrial|business-tycoon-heir pred=tech-engineer, business-entrepreneur, business-tycoon-founder, arts-creator
  Lady Gaga                  true=arts-performer                 pred=finance, business-finance, law, politics
  Lee Iacocca                true=business-ceo-hired|business-industrial pred=politics, government, sports-athlete, arts-performer
  Li Ka-shing                true=business-realestate|business-tycoon-founder|business-investor pred=business-media, media-personality, media-creator, sports-athlete
  Liliane Bettencourt        true=business-retail|business-tycoon-heir pred=exploration, sports-athlete, military, medicine
  Lloyd Blankfein            true=business-finance|business-ceo-hired pred=business-media, spiritual-teacher, arts-performer, arts-visual
  Mallika Srinivasan         true=business-industrial|business-ceo-hired pred=finance, business-finance, exploration, arts-performer
  Meg Whitman                true=business-ceo-hired             pred=finance, business-finance, exploration, arts-performer
  Michael Jackson            true=arts-performer                 pred=tech-engineer, business-entrepreneur, business-tycoon-founder, arts-creator
  Mitt Romney                true=business-investor|business-finance|politics pred=business-media, media-personality, sports-athlete, military
  Nelson Mandela             true=politics|government|politics-revolutionary|politics-head-state pred=business-investor, business-finance, science-academic, arts-performer
  Nicole Kidman              true=arts-performer                 pred=sports-athlete, military, medicine, business-leader
  Niklas Zennstrom           true=business-tech-founder|business-investor pred=business-leader, business-industrial, government, arts-performer
  Pablo Picasso              true=arts-visual                    pred=exploration, politics, government, business-entrepreneur
  Rick Scott                 true=business-ceo-hired|politics    pred=finance, business-finance, exploration, sports-athlete
  Robert Iger                true=business-ceo-hired|business-media pred=government, sports-athlete, military, medicine
  Sam Zell                   true=business-realestate|business-investor pred=business-media, media-personality, media-creator, arts-performer
  Stephen King               true=arts-creator                   pred=business-entrepreneur, business-tycoon-founder, sports-athlete, politics-military
  Stephen Ross               true=business-realestate|business-tycoon-founder pred=business-investor, finance, business-finance, arts-performer
  Stephen Schwarzman         true=business-investor|business-finance|business-tycoon-founder pred=business-media, media-personality, sports-athlete, military
  Takemitsu Takizaki         true=business-industrial|business-tech-founder|business-tycoon-founder pred=finance, business-tycoon-heir, business-finance, business-realestate
  Theodore Roosevelt         true=politics|government|politics-head-state pred=religion-leader, exploration, business-tech-founder, business-tycoon-founder
  Tom Ford                   true=business-retail|arts-visual    pred=finance, business-finance, exploration, business-leader
  Yang Huiyan                true=business-realestate|business-tycoon-heir pred=tech-exec, business-tech-founder, sports-athlete, military