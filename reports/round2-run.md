======================================================================
Celebrity Validation Results   (N=173, errors=0)
======================================================================
Accuracy: 76.0%
  Full match:    122/173  (70.5%)
  Partial match: 19/173  (11.0%)
  Miss:          32/173  (18.5%)

Per-category accuracy:
  arts-performer             49F/6P/7M of 62  = 84%
  sports-athlete             26F/0P/13M of 39  = 67%
  arts-creator               16F/1P/2M of 19  = 87%
  politics                   13F/0P/4M of 17  = 76%
  business-leader            9F/7P/0M of 16  = 78%
  business-entrepreneur      16F/0P/0M of 16  = 100%
  government                 12F/0P/4M of 16  = 75%
  tech-exec                  10F/3P/0M of 13  = 88%
  media-personality          4F/2P/2M of 8  = 63%
  science-academic           7F/1P/0M of 8  = 94%
  arts-visual                3F/2P/2M of 7  = 57%
  tech-engineer              4F/0P/1M of 5  = 80%
  business-investor          1F/3P/1M of 5  = 50%
  religion-leader            4F/0P/1M of 5  = 80%
  finance                    1F/2P/1M of 4  = 50%
  spiritual-teacher          1F/0P/1M of 2  = 50%
  medicine                   2F/0P/0M of 2  = 100%
  tech-creative              1F/0P/0M of 1  = 100%
  media-creator              1F/0P/0M of 1  = 100%

Per-karmeshPlanet accuracy:
  Mercury    25F/6P/6M of 37  = 76%
  Mars       21F/3P/6M of 30  = 75%
  Jupiter    15F/0P/10M of 25  = 60%
  Venus      19F/1P/2M of 22  = 89%
  Moon       16F/2P/4M of 22  = 77%
  Sun        18F/2P/1M of 21  = 90%
  Saturn     8F/5P/3M of 16  = 66%

Miss list (expected but predicted something different):
  Adele                      true=arts-performer                 pred=business-investor, finance, government, politics
  Amitabh Bachchan           true=arts-performer                 pred=sports-athlete, medicine, science-academic, religion-leader
  Andy Warhol                true=arts-visual                    pred=business-investor, sports-athlete, media-personality, business-entrepreneur
  Angelina Jolie             true=arts-performer                 pred=spiritual-teacher, law, military, exploration
  Beethoven                  true=arts-creator                   pred=law, science-academic, religion-leader, spiritual-teacher
  Bill Clinton               true=politics|government            pred=tech-exec, arts-creator, media-personality, media-creator
  Dalai Lama XIV             true=religion-leader|spiritual-teacher pred=science-academic, business-leader, arts-performer, business-entrepreneur
  David Letterman            true=media-personality              pred=sports-athlete, arts-performer, tech-engineer, business-entrepreneur
  Denzel Washington          true=arts-performer                 pred=government, science-academic, religion-leader, spiritual-teacher
  George W. Bush             true=politics|government            pred=sports-athlete, arts-performer, business-entrepreneur, science-academic
  Humphrey Bogart            true=arts-performer                 pred=law, medicine, media-personality, finance
  Jack Nicklaus              true=sports-athlete                 pred=finance, science-academic, religion-leader, spiritual-teacher
  Jackie Robinson            true=sports-athlete                 pred=arts-visual, tech-creative, business-entrepreneur, arts-creator
  Jay Leno                   true=media-personality              pred=sports-athlete, law, arts-performer, arts-visual
  John Lennon                true=arts-performer|arts-creator    pred=finance, banking, science-academic, law
  Kobe Bryant                true=sports-athlete                 pred=government, politics, media-personality, tech-creative
  LeBron James               true=sports-athlete                 pred=medicine, arts-performer, tech-creative, arts-creator
  Lionel Messi               true=sports-athlete                 pred=finance, law, arts-performer, arts-visual
  Martina Navratilova        true=sports-athlete                 pred=law, medicine, business-leader, business-entrepreneur
  Nelson Mandela             true=politics|government            pred=business-investor, science-academic, arts-performer, arts-visual
  Novak Djokovic             true=sports-athlete                 pred=finance, medicine, science-academic, religion-leader
  Pelé                       true=sports-athlete                 pred=finance, banking, arts-performer, science-academic
  Ray Dalio                  true=finance|business-investor      pred=politics, government, media-personality, tech-creative
  Salvador Dali              true=arts-visual                    pred=law, science-academic, religion-leader, spiritual-teacher
  Serena Williams            true=sports-athlete                 pred=medicine, arts-performer, arts-visual, arts-creator
  Steve Wozniak              true=tech-engineer                  pred=religion-leader, exploration, finance, science-academic
  Tiger Woods                true=sports-athlete                 pred=tech-creative, business-investor, arts-creator, science-academic
  Tom Brady                  true=sports-athlete                 pred=medicine, arts-performer, media-personality, tech-creative
  Virat Kohli                true=sports-athlete                 pred=finance, arts-performer, arts-creator, media-personality
  Vladimir Putin             true=politics|government            pred=medicine, arts-performer, arts-visual, arts-creator
  Wayne Gretzky              true=sports-athlete                 pred=arts-visual, arts-performer, arts-creator, science-academic
  Whitney Houston            true=arts-performer                 pred=sports-athlete, medicine, science-academic, religion-leader

Partial list:
  Anthony Hopkins            true=arts-performer                 pred=media-personality, sports-athlete, military, medicine
  Bruno Mars                 true=arts-performer                 pred=finance, arts-creator, media-personality, media-creator
  Carl Sagan                 true=science-academic|media-personality pred=religion-leader, law, business-leader, arts-performer
  George Soros               true=finance|business-investor      pred=arts-creator, politics, government, religion-leader
  Karl Lagerfeld             true=arts-visual                    pred=religion-leader, spiritual-teacher, science-academic, exploration
  Kate Winslet               true=arts-performer                 pred=media-personality, science-academic, religion-leader, spiritual-teacher
  Lady Gaga                  true=arts-performer                 pred=finance, law, politics, government
  Larry Ellison              true=tech-exec|business-leader      pred=finance, government, politics, media-personality
  Li Ka-shing                true=business-leader|business-investor pred=media-personality, media-creator, sports-athlete, military
  Michael Jackson            true=arts-performer                 pred=tech-engineer, business-entrepreneur, arts-creator, sports-athlete
  Mukesh Ambani              true=business-leader                pred=finance, law, sports-athlete, military
  Nicole Kidman              true=arts-performer                 pred=sports-athlete, military, medicine, business-leader
  Pablo Picasso              true=arts-visual                    pred=exploration, business-entrepreneur, science-academic, arts-performer
  Ratan Tata                 true=business-leader                pred=media-personality, sports-athlete, military, medicine
  Rupert Murdoch             true=business-leader|media-personality pred=finance, medicine, arts-performer, tech-creative
  Satya Nadella              true=tech-exec|business-leader      pred=business-entrepreneur, arts-visual, government, politics
  Stephen King               true=arts-creator                   pred=business-entrepreneur, sports-athlete, military, science-academic
  Tim Cook                   true=tech-exec|business-leader      pred=medicine, science-academic, religion-leader, spiritual-teacher
  Warren Buffett             true=business-investor|finance      pred=tech-exec, business-leader, government, media-personality