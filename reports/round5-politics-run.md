======================================================================
Celebrity Validation Results   (N=81, errors=0)
Domain filter: politics
Min rating: B
======================================================================
Accuracy: 95.1%
  Full match:    73/81  (90.1%)
  Partial match: 8/81  (9.9%)
  Miss:          0/81  (0.0%)

Per-category accuracy:
  politics                   70F/8P/0M of 78  = 95%
  government                 49F/5P/0M of 54  = 95%
  politics-head-state        36F/3P/0M of 39  = 96%
  politics-head-gov          23F/3P/0M of 26  = 94%
  politics-revolutionary     13F/1P/0M of 14  = 96%
  politics-military          8F/0P/0M of 8  = 100%
  politics-authoritarian     7F/0P/0M of 7  = 100%
  religion-leader            3F/0P/0M of 3  = 100%
  politics-diplomat          3F/0P/0M of 3  = 100%
  business-tycoon-heir       1F/1P/0M of 2  = 75%
  business-finance           1F/1P/0M of 2  = 75%
  business-tycoon-founder    2F/0P/0M of 2  = 100%
  business-realestate        0F/1P/0M of 1  = 50%
  media-personality          1F/0P/0M of 1  = 100%
  arts-performer             1F/0P/0M of 1  = 100%
  arts-performer-film-actor  1F/0P/0M of 1  = 100%
  business-media             1F/0P/0M of 1  = 100%
  business-ceo-hired         0F/1P/0M of 1  = 50%
  business-investor          0F/1P/0M of 1  = 50%
  business-tech-founder      1F/0P/0M of 1  = 100%
  government-judicial        1F/0P/0M of 1  = 100%
  law                        1F/0P/0M of 1  = 100%

Per-karmeshPlanet accuracy:
  Mercury    16F/3P/0M of 19  = 92%
  Moon       13F/0P/0M of 13  = 100%
  Venus      11F/1P/0M of 12  = 96%
  Saturn     10F/2P/0M of 12  = 92%
  Jupiter    8F/2P/0M of 10  = 90%
  Mars       9F/0P/0M of 9  = 100%
  Sun        6F/0P/0M of 6  = 100%

Miss list (expected but predicted something different):

Partial list:
  David Cameron              true=politics|government|politics-head-gov pred=finance, business-tycoon-heir, business-finance, science-academic
  Donald Trump               true=politics|business-realestate|business-tycoon-heir|politics-head-state pred=tech-creative, arts-visual, exploration, business-investor
  John Howard                true=politics|government|politics-head-gov pred=business-realestate, business-industrial, exploration, science-academic
  Kamala Harris              true=politics|government|politics-head-gov pred=religion-leader, exploration, business-leader, arts-performer
  Mitt Romney                true=business-investor|business-finance|politics pred=business-media, media-personality, sports-athlete, military
  Nelson Mandela             true=politics|government|politics-revolutionary|politics-head-state pred=business-investor, business-finance, science-academic, arts-performer
  Rick Scott                 true=business-ceo-hired|politics    pred=finance, business-finance, exploration, sports-athlete
  Theodore Roosevelt         true=politics|government|politics-head-state pred=religion-leader, exploration, business-tech-founder, business-tycoon-founder