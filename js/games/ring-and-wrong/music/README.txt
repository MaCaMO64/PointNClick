MUSIKK-SLOTS - "music"-mappen
==============================

Spillet spiller automatisk en loop per rom hvis filen finnes.
Er den ikke der, brukes den prosedyriske musikken (syntese).

FILNAVN (ma matche spor-ID):
  music/title.mp3    - hovedmeny (episk-lett)
  music/dal.mp3      - Bloomdale (varm, landlig, morgen)
  music/kryss.mp3    - The Crossroads (skumring, lett uhyggelig)
  music/pub.mp3      - The Wobbly Pony (koselig, livlig, 4/4)
  music/elv.mp3      - The Riverbank (flowende arpeggio, dag)
  music/skog.mp3     - Trollwood (mystisk, mork, sparsom)
  music/vulkan.mp3   - Foot of Mount Pleasant (trussel, lav rumble)
  music/krater.mp3   - The Caldera (intens, mork)
  music/ending.mp3   - slutning (varm avslutning)

FORMAT: mp3 anbefales (oggi/m4a/wav gaar ogsaa).
TIPS: Be om "seamless loop" i generatoren, 60-120 sekunder,
      ingen vokal. Hold filstørrelsen nedover ~2MB per spor.

Suno/Stable Audio prompt-mal:
  "[STEMNING], instrumental video game background music,
   pixel adventure style, seamless loop, no vocals, no drums solo"

ETTER DU LEGGER INN FILER:
  node tools/build-music.js
  deretter Ctrl+F5 i spillet.

Prosedural musikk brukes automatisk for spor som mangler.
