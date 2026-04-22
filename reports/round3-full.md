======================================================================
Celebrity Validation Results   (N=284, errors=0)
Min rating: B
======================================================================
Accuracy: 87.9%
  Full match:    229/284  (80.6%)
  Partial match: 41/284  (14.4%)
  Miss:          14/284  (4.9%)

Per-category accuracy:
  business-tycoon-founder    118F/9P/0M of 127  = 96%
  business-tech-founder      55F/5P/0M of 60  = 96%
  arts-performer             43F/6P/7M of 56  = 82%
  business-industrial        43F/12P/0M of 55  = 89%
  business-finance           32F/6P/0M of 38  = 92%
  business-investor          24F/7P/0M of 31  = 89%
  business-retail            28F/2P/0M of 30  = 97%
  business-tycoon-heir       16F/10P/0M of 26  = 81%
  business-ceo-hired         14F/6P/0M of 20  = 85%
  politics                   12F/3P/3M of 18  = 75%
  arts-creator               15F/1P/1M of 17  = 91%
  business-realestate        11F/6P/0M of 17  = 82%
  business-media             15F/1P/0M of 16  = 97%
  government                 11F/0P/3M of 14  = 79%
  media-personality          5F/1P/2M of 8  = 69%
  arts-visual                3F/2P/2M of 7  = 57%
  science-academic           5F/1P/0M of 6  = 92%
  religion-leader            3F/0P/0M of 3  = 100%
  medicine                   3F/0P/0M of 3  = 100%
  media-creator              1F/0P/0M of 1  = 100%
  spiritual-teacher          1F/0P/0M of 1  = 100%

Per-karmeshPlanet accuracy:
  Mercury    47F/15P/2M of 64  = 85%
  Mars       33F/5P/6M of 44  = 81%
  Venus      40F/3P/0M of 43  = 97%
  Saturn     28F/7P/1M of 36  = 88%
  Jupiter    26F/4P/4M of 34  = 82%
  Moon       29F/3P/0M of 32  = 95%
  Sun        26F/4P/1M of 31  = 90%

Miss list (expected but predicted something different):
  Adele                      true=arts-performer                 pred=business-investor, finance, business-finance, government
  Amitabh Bachchan           true=arts-performer                 pred=sports-athlete, medicine, science-academic, religion-leader
  Andy Warhol                true=arts-visual                    pred=business-investor, sports-athlete, media-personality, business-tech-founder
  Angelina Jolie             true=arts-performer                 pred=spiritual-teacher, law, military, exploration
  Bill Clinton               true=politics|government            pred=tech-exec, business-tech-founder, business-investor, business-finance
  David Letterman            true=media-personality              pred=business-realestate, business-industrial, sports-athlete, arts-performer
  Denzel Washington          true=arts-performer                 pred=business-tycoon-heir, government, science-academic, religion-leader
  George W. Bush             true=politics|government            pred=business-tycoon-heir, business-industrial, sports-athlete, arts-performer
  Humphrey Bogart            true=arts-performer                 pred=law, medicine, media-personality, business-realestate
  Jay Leno                   true=media-personality              pred=sports-athlete, law, arts-performer, arts-visual
  John Lennon                true=arts-performer|arts-creator    pred=finance, banking, business-tycoon-heir, business-finance
  Nelson Mandela             true=politics|government            pred=business-investor, business-finance, science-academic, arts-performer
  Salvador Dali              true=arts-visual                    pred=business-ceo-hired, law, science-academic, religion-leader
  Whitney Houston            true=arts-performer                 pred=sports-athlete, medicine, science-academic, religion-leader

Partial list:
  Abigail Johnson            true=business-finance|business-tycoon-heir pred=business-retail, arts-visual, business-leader, arts-performer
  Anil Ambani                true=business-industrial|business-tycoon-heir pred=business-entrepreneur, business-tycoon-founder, sports-athlete, military
  Anthony Hopkins            true=arts-performer                 pred=media-personality, sports-athlete, military, medicine
  Barron Hilton              true=business-realestate|business-tycoon-heir pred=exploration, science-academic, religion-leader, spiritual-teacher
  Barry Lam                  true=business-tech-founder|business-industrial|business-tycoon-founder pred=finance, business-finance, exploration, business-media
  Bruno Mars                 true=arts-performer                 pred=finance, business-tycoon-heir, business-finance, business-investor
  Carl Sagan                 true=science-academic|media-personality pred=religion-leader, law, business-leader, arts-performer
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
  Kate Winslet               true=arts-performer                 pred=media-personality, science-academic, religion-leader, spiritual-teacher
  Keiichiro Takahara         true=business-industrial|business-tycoon-founder pred=medicine, arts-performer, arts-visual, arts-creator
  Kumar Mangalam Birla       true=business-industrial|business-tycoon-heir pred=tech-engineer, business-entrepreneur, business-tycoon-founder, arts-creator
  Lady Gaga                  true=arts-performer                 pred=finance, business-finance, law, politics
  Lee Iacocca                true=business-ceo-hired|business-industrial pred=politics, sports-athlete, arts-performer, business-investor
  Li Ka-shing                true=business-realestate|business-tycoon-founder|business-investor pred=business-media, media-personality, media-creator, sports-athlete
  Liliane Bettencourt        true=business-retail|business-tycoon-heir pred=exploration, sports-athlete, military, medicine
  Lloyd Blankfein            true=business-finance|business-ceo-hired pred=business-media, spiritual-teacher, arts-performer, arts-visual
  Mallika Srinivasan         true=business-industrial|business-ceo-hired pred=finance, business-finance, exploration, arts-performer
  Meg Whitman                true=business-ceo-hired             pred=finance, business-finance, exploration, arts-performer
  Michael Jackson            true=arts-performer                 pred=tech-engineer, business-entrepreneur, business-tycoon-founder, arts-creator
  Mitt Romney                true=business-investor|business-finance|politics pred=business-media, media-personality, sports-athlete, military
  Nicole Kidman              true=arts-performer                 pred=sports-athlete, military, medicine, business-leader
  Niklas Zennstrom           true=business-tech-founder|business-investor pred=business-leader, business-industrial, government, arts-performer
  Pablo Picasso              true=arts-visual                    pred=exploration, business-entrepreneur, business-tycoon-founder, business-tech-founder
  Rick Scott                 true=business-ceo-hired|politics    pred=finance, business-finance, exploration, sports-athlete
  Robert Iger                true=business-ceo-hired|business-media pred=government, sports-athlete, military, medicine
  Sam Zell                   true=business-realestate|business-investor pred=business-media, media-personality, media-creator, arts-performer
  Stephen King               true=arts-creator                   pred=business-entrepreneur, business-tycoon-founder, sports-athlete, military
  Stephen Ross               true=business-realestate|business-tycoon-founder pred=business-investor, finance, business-finance, arts-performer
  Stephen Schwarzman         true=business-investor|business-finance|business-tycoon-founder pred=business-media, media-personality, sports-athlete, military
  Takemitsu Takizaki         true=business-industrial|business-tech-founder|business-tycoon-founder pred=finance, business-tycoon-heir, business-finance, business-realestate
  Tom Ford                   true=business-retail|arts-visual    pred=finance, business-finance, exploration, business-leader
  Yang Huiyan                true=business-realestate|business-tycoon-heir pred=tech-exec, business-tech-founder, sports-athlete, military