======================================================================
Celebrity Validation Results   (N=118, errors=0)
======================================================================
Accuracy: 65.7%
  Full match:    69/118  (58.5%)
  Partial match: 17/118  (14.4%)
  Miss:          32/118  (27.1%)

Per-category accuracy:
  arts-performer             21F/9P/11M of 41  = 62%
  sports-athlete             6F/1P/12M of 19  = 34%
  arts-creator               12F/1P/3M of 16  = 78%
  politics                   10F/0P/5M of 15  = 67%
  government                 10F/0P/4M of 14  = 71%
  business-entrepreneur      11F/0P/0M of 11  = 100%
  business-leader            9F/1P/0M of 10  = 95%
  tech-exec                  8F/0P/0M of 8  = 100%
  media-personality          4F/1P/2M of 7  = 64%
  science-academic           6F/1P/0M of 7  = 93%
  arts-visual                2F/2P/1M of 5  = 60%
  religion-leader            4F/0P/1M of 5  = 80%
  tech-engineer              3F/0P/1M of 4  = 75%
  business-investor          0F/4P/0M of 4  = 50%
  finance                    0F/3P/0M of 3  = 50%
  spiritual-teacher          1F/0P/1M of 2  = 50%
  medicine                   2F/0P/0M of 2  = 100%
  tech-creative              1F/0P/0M of 1  = 100%
  media-creator              1F/0P/0M of 1  = 100%

Per-karmeshPlanet accuracy:
  Mars       12F/3P/8M of 23  = 59%
  Mercury    15F/2P/5M of 22  = 73%
  Jupiter    7F/2P/9M of 18  = 44%
  Moon       14F/2P/2M of 18  = 83%
  Venus      10F/3P/1M of 14  = 82%
  Sun        7F/2P/4M of 13  = 62%
  Saturn     4F/3P/3M of 10  = 55%

Miss list (expected but predicted something different):
  Amitabh Bachchan           true=arts-performer                 pred=sports-athlete, medicine, science-academic, religion-leader
  Andy Warhol                true=arts-visual                    pred=business-investor, media-personality, business-entrepreneur, science-academic
  Angelina Jolie             true=arts-performer                 pred=spiritual-teacher, law, military, exploration
  Ariana Grande              true=arts-performer                 pred=sports-athlete, law, business-leader, tech-engineer
  Arnold Schwarzenegger      true=sports-athlete|arts-performer|politics pred=business-investor, business-leader, finance, media-personality
  Beethoven                  true=arts-creator                   pred=law, science-academic, religion-leader, spiritual-teacher
  Brad Pitt                  true=arts-performer                 pred=government, business-leader, tech-engineer, science-academic
  Dalai Lama XIV             true=religion-leader|spiritual-teacher pred=science-academic, business-leader, tech-engineer, business-entrepreneur
  David Letterman            true=media-personality              pred=politics, government, business-leader, tech-engineer
  Elvis Presley              true=arts-performer                 pred=government, business-leader, tech-engineer, politics
  Franklin D. Roosevelt      true=politics|government            pred=finance, medicine, arts-creator, media-personality
  Jay Leno                   true=media-personality              pred=sports-athlete, law, science-academic, politics
  John Lennon                true=arts-performer|arts-creator    pred=finance, banking, science-academic, politics
  Justin Bieber              true=arts-performer                 pred=government, business-leader, tech-engineer, politics
  Kobe Bryant                true=sports-athlete                 pred=government, politics, media-personality, science-academic
  LeBron James               true=sports-athlete                 pred=medicine, science-academic, politics, business-leader
  Lionel Messi               true=sports-athlete                 pred=finance, law, arts-performer, arts-visual
  Marilyn Monroe             true=arts-performer                 pred=sports-athlete, medicine, business-leader, tech-engineer
  Michael Jordan             true=sports-athlete                 pred=politics, religion-leader, science-academic, law
  Michael Phelps             true=sports-athlete                 pred=religion-leader, science-academic, arts-performer, arts-visual
  Nelson Mandela             true=politics|government            pred=business-investor, science-academic, arts-performer, arts-visual
  Pelé                       true=sports-athlete                 pred=finance, banking, science-academic, politics
  Roger Federer              true=sports-athlete                 pred=business-entrepreneur, arts-visual, business-leader, finance
  Serena Williams            true=sports-athlete                 pred=medicine, arts-performer, arts-visual, arts-creator
  Steve Wozniak              true=tech-engineer                  pred=religion-leader, exploration, finance, science-academic
  Taylor Swift               true=arts-performer|arts-creator    pred=business-entrepreneur, media-personality, sports-athlete, military
  Tiger Woods                true=sports-athlete                 pred=tech-creative, business-investor, arts-creator, science-academic
  Usain Bolt                 true=sports-athlete                 pred=politics, religion-leader, science-academic, law
  Virat Kohli                true=sports-athlete                 pred=finance, science-academic, politics, business-leader
  Vladimir Putin             true=politics|government            pred=medicine, arts-performer, arts-visual, arts-creator
  Whitney Houston            true=arts-performer                 pred=sports-athlete, medicine, science-academic, religion-leader
  Winston Churchill          true=politics|government            pred=finance, business-leader, tech-engineer, arts-creator

Partial list:
  Amy Winehouse              true=arts-performer                 pred=government, business-leader, tech-engineer, politics
  Beyoncé                    true=arts-performer                 pred=medicine, business-leader, business-entrepreneur, arts-creator
  Carl Sagan                 true=science-academic|media-personality pred=religion-leader, law, business-leader, tech-engineer
  Dwayne Johnson             true=arts-performer|sports-athlete  pred=arts-visual, government, politics, media-personality
  George Soros               true=finance|business-investor      pred=arts-creator, politics, government, religion-leader
  Jim Carrey                 true=arts-performer                 pred=business-entrepreneur, arts-visual, business-leader, tech-engineer
  Karl Lagerfeld             true=arts-visual                    pred=religion-leader, spiritual-teacher, science-academic, exploration
  Lady Gaga                  true=arts-performer                 pred=finance, law, business-leader, business-investor
  Li Ka-shing                true=business-leader|business-investor pred=media-personality, media-creator, sports-athlete, military
  Madonna                    true=arts-performer                 pred=tech-creative, arts-visual, exploration, sports-athlete
  Michael Jackson            true=arts-performer                 pred=tech-engineer, business-entrepreneur, arts-creator, sports-athlete
  Pablo Picasso              true=arts-visual                    pred=exploration, science-academic, politics, business-leader
  Ray Dalio                  true=finance|business-investor      pred=science-academic, politics, business-leader, government
  Robert De Niro             true=arts-performer                 pred=finance, banking, science-academic, religion-leader
  Stephen King               true=arts-creator                   pred=business-entrepreneur, sports-athlete, military, science-academic
  Tom Hanks                  true=arts-performer                 pred=tech-creative, tech-exec, business-leader, business-entrepreneur
  Warren Buffett             true=business-investor|finance      pred=tech-exec, business-leader, government, media-personality