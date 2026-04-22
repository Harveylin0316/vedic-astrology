======================================================================
Celebrity Validation Results   (N=388, errors=0)
Min rating: B
======================================================================
Accuracy: 92.8%
  Full match:    334/388  (86.1%)
  Partial match: 52/388  (13.4%)
  Miss:          2/388  (0.5%)

Per-category accuracy:
  business-tycoon-founder    118F/9P/0M of 127  = 96%
  arts-performer             69F/11P/0M of 80  = 93%
  politics                   70F/8P/0M of 78  = 95%
  business-tech-founder      55F/5P/0M of 60  = 96%
  business-industrial        43F/12P/0M of 55  = 89%
  government                 49F/5P/0M of 54  = 95%
  arts-performer-film-actor  36F/5P/0M of 41  = 94%
  politics-head-state        36F/3P/0M of 39  = 96%
  business-finance           32F/6P/0M of 38  = 92%
  business-investor          24F/7P/0M of 31  = 89%
  arts-creator               30F/1P/0M of 31  = 98%
  business-retail            28F/2P/0M of 30  = 97%
  arts-performer-musician-singer 24F/5P/0M of 29  = 91%
  business-tycoon-heir       16F/10P/0M of 26  = 81%
  politics-head-gov          23F/3P/0M of 26  = 94%
  business-ceo-hired         14F/6P/0M of 20  = 85%
  business-realestate        11F/6P/0M of 17  = 82%
  business-media             15F/1P/0M of 16  = 97%
  arts-visual                11F/4P/0M of 15  = 87%
  politics-revolutionary     13F/1P/0M of 14  = 96%
  arts-creator-director      13F/0P/0M of 13  = 100%
  arts-visual-painter        6F/3P/0M of 9  = 83%
  media-personality          5F/1P/2M of 8  = 69%
  politics-military          8F/0P/0M of 8  = 100%
  arts-performer-comedian    7F/1P/0M of 8  = 94%
  arts-creator-writer        7F/0P/0M of 7  = 100%
  politics-authoritarian     7F/0P/0M of 7  = 100%
  science-academic           5F/1P/0M of 6  = 92%
  arts-performer-musician-instrument 4F/2P/0M of 6  = 83%
  religion-leader            5F/0P/0M of 5  = 100%
  arts-performer-dancer      5F/0P/0M of 5  = 100%
  medicine                   3F/0P/0M of 3  = 100%
  politics-diplomat          3F/0P/0M of 3  = 100%
  arts-visual-photographer   3F/0P/0M of 3  = 100%
  arts-creator-producer      2F/0P/0M of 2  = 100%
  media-creator              1F/0P/0M of 1  = 100%
  spiritual-teacher          1F/0P/0M of 1  = 100%
  government-judicial        1F/0P/0M of 1  = 100%
  law                        1F/0P/0M of 1  = 100%

Per-karmeshPlanet accuracy:
  Mercury    70F/14P/0M of 84  = 92%
  Venus      62F/3P/0M of 65  = 98%
  Mars       47F/7P/1M of 55  = 92%
  Jupiter    37F/12P/0M of 49  = 88%
  Moon       46F/3P/0M of 49  = 97%
  Saturn     39F/8P/1M of 48  = 90%
  Sun        33F/5P/0M of 38  = 93%

Miss list (expected but predicted something different):
  David Letterman            true=media-personality              pred=business-realestate, business-industrial, politics, government
  Jay Leno                   true=media-personality              pred=sports-athlete, law, arts-performer, arts-visual

Partial list:
  Abigail Johnson            true=business-finance|business-tycoon-heir pred=business-retail, arts-visual, business-leader, arts-performer
  Andy Warhol                true=arts-visual|arts-visual-painter pred=business-investor, politics, government, sports-athlete
  Angelina Jolie             true=arts-performer|arts-performer-film-actor pred=politics-military, spiritual-teacher, law, military
  Anil Ambani                true=business-industrial|business-tycoon-heir pred=business-entrepreneur, business-tycoon-founder, sports-athlete, politics-military
  Arnold Schwarzenegger      true=arts-performer|arts-performer-film-actor pred=science-academic, business-leader, business-entrepreneur, arts-creator
  Barbra Streisand           true=arts-performer|arts-performer-musician-singer pred=business-media, arts-creator, religion-leader, government
  Barron Hilton              true=business-realestate|business-tycoon-heir pred=exploration, science-academic, religion-leader, spiritual-teacher
  Barry Lam                  true=business-tech-founder|business-industrial|business-tycoon-founder pred=finance, business-finance, exploration, business-media
  Beethoven                  true=arts-creator|arts-performer|arts-performer-musician-instrument pred=business-ceo-hired, politics-head-state, law, science-academic
  Carl Sagan                 true=science-academic|media-personality pred=religion-leader, law, business-leader, arts-performer
  Chey Tae-won               true=business-industrial|business-tycoon-heir pred=tech-exec, business-tech-founder, science-academic, religion-leader
  Chung Ju-yung              true=business-industrial|business-tycoon-founder pred=tech-exec, business-tech-founder, business-investor, business-finance
  David Cameron              true=politics|government|politics-head-gov pred=finance, business-tycoon-heir, business-finance, science-academic
  David Koch                 true=business-industrial|business-tycoon-heir pred=business-investor, finance, business-finance, government
  Denzel Washington          true=arts-performer|arts-performer-film-actor pred=business-tycoon-heir, government, science-academic, religion-leader
  Donald Trump               true=politics|business-realestate|business-tycoon-heir|politics-head-state pred=tech-creative, arts-visual, exploration, business-investor
  Eike Batista               true=business-industrial|business-tycoon-founder pred=tech-exec, business-tech-founder, sports-athlete, military
  Elizabeth Holmes           true=business-tech-founder          pred=business-ceo-hired, politics-head-state, law, science-academic
  George Soros               true=business-investor|business-finance pred=business-media, arts-creator, politics, government
  Humphrey Bogart            true=arts-performer|arts-performer-film-actor pred=law, medicine, media-personality, business-realestate
  Iris Fontbona              true=business-industrial|business-tycoon-heir pred=tech-creative, arts-visual, exploration, science-academic
  Jack Dorsey                true=business-tech-founder|business-tycoon-founder pred=finance, business-finance, exploration, sports-athlete
  Jimi Hendrix               true=arts-performer|arts-performer-musician-instrument|arts-performer-musician-singer pred=finance, business-finance, exploration, science-academic
  John Howard                true=politics|government|politics-head-gov pred=business-realestate, business-industrial, exploration, science-academic
  John Paulson               true=business-investor|business-finance pred=media-personality, sports-athlete, military, medicine
  Kamala Harris              true=politics|government|politics-head-gov pred=religion-leader, exploration, business-leader, arts-performer
  Keiichiro Takahara         true=business-industrial|business-tycoon-founder pred=medicine, arts-performer, arts-visual, arts-creator
  Kumar Mangalam Birla       true=business-industrial|business-tycoon-heir pred=tech-engineer, business-entrepreneur, business-tycoon-founder, arts-creator
  Lady Gaga                  true=arts-performer|arts-performer-musician-singer pred=finance, business-finance, law, politics
  Lee Iacocca                true=business-ceo-hired|business-industrial pred=politics, government, sports-athlete, arts-performer
  Li Ka-shing                true=business-realestate|business-tycoon-founder|business-investor pred=business-media, media-personality, media-creator, sports-athlete
  Liliane Bettencourt        true=business-retail|business-tycoon-heir pred=exploration, sports-athlete, military, medicine
  Lloyd Blankfein            true=business-finance|business-ceo-hired pred=business-media, spiritual-teacher, arts-performer, arts-visual
  Mallika Srinivasan         true=business-industrial|business-ceo-hired pred=finance, business-finance, exploration, arts-performer
  Mariah Carey               true=arts-performer|arts-performer-musician-singer pred=medicine, sports-athlete, military, media-personality
  Meg Whitman                true=business-ceo-hired             pred=finance, business-finance, exploration, arts-performer
  Michael Jackson            true=arts-performer|arts-performer-musician-singer pred=tech-engineer, business-entrepreneur, business-tycoon-founder, arts-creator
  Mitt Romney                true=business-investor|business-finance|politics pred=business-media, media-personality, sports-athlete, military
  Nelson Mandela             true=politics|government|politics-revolutionary|politics-head-state pred=business-investor, business-finance, science-academic, arts-performer
  Niklas Zennstrom           true=business-tech-founder|business-investor pred=business-leader, business-industrial, government, arts-performer
  Pablo Picasso              true=arts-visual|arts-visual-painter pred=exploration, politics, government, business-entrepreneur
  Rick Scott                 true=business-ceo-hired|politics    pred=finance, business-finance, exploration, sports-athlete
  Robert Iger                true=business-ceo-hired|business-media pred=government, sports-athlete, military, medicine
  Salvador Dali              true=arts-visual|arts-visual-painter pred=business-ceo-hired, politics-head-state, law, science-academic
  Sam Zell                   true=business-realestate|business-investor pred=business-media, media-personality, media-creator, arts-performer
  Stephen Ross               true=business-realestate|business-tycoon-founder pred=business-investor, finance, business-finance, arts-performer
  Stephen Schwarzman         true=business-investor|business-finance|business-tycoon-founder pred=business-media, media-personality, sports-athlete, military
  Steve Martin               true=arts-performer|arts-performer-comedian|arts-performer-film-actor pred=business-investor, government, politics, media-personality
  Takemitsu Takizaki         true=business-industrial|business-tech-founder|business-tycoon-founder pred=finance, business-tycoon-heir, business-finance, business-realestate
  Theodore Roosevelt         true=politics|government|politics-head-state pred=religion-leader, exploration, business-tech-founder, business-tycoon-founder
  Tom Ford                   true=business-retail|arts-visual    pred=finance, business-finance, exploration, business-leader
  Yang Huiyan                true=business-realestate|business-tycoon-heir pred=tech-exec, business-tech-founder, sports-athlete, military