# RING & WRONG

Et punkt-og-klikkeventyr i ærbødig parodiens ånd — LucasArts-møter moderne pikselkunst.
**Nåværende versjon:** se `js/game.js` → `meta.version` (vises også på tittelskjermen, i ESC-menyen og nede i høyre hjørne av UI-et).

## Kjøre
Dobbeltklikk `index.html` — alt er innbakt (bilder som base64), ingen server nødvendig.

Med live-reload under utvikling:
```
cd ring-og-vrang
npx -y serve .
```

## Testing
```
node test/validate.js   # struktur: romgraf, hotspots, items, flagg
node test/smoke.js      # boot → intro → alle rom → dialoger → verber → bevegelse
```
Feiler smoke? Trykk **N** i spillet for debug-merker (navn + koordinater + magenta blit-ramme per karakter), og sjekk konsollen (F12) — tegnefeiler isoleres per karakter og skrives der.

## Bakgrunner (art/)
Spillet laster `art/<romid>.png|jpeg|jpg` automatisk. Mangler filen → prosedyremaler.
Etter å lagt inn/byttet bilde: `node tools/build-art.js` → **Ctrl+F5**.

### Pipeline
- Bildet høyde-tilpasses med **10 % overskann og bunnjustering**: bunnen av bildet (stien/forgrunnen der karakterene går) er fullt synlig over UI-linjen, overskyende himmel beskjæres.
- Bredde sentreres-krops. Anbefalt generering: **2:1 (1920×960)** eller 16:9.
- Karakterene går i et bånd rundt **55–80 % av bildehøyden** — hold det midtre feltet åpent.

### Ankre per rom (hotspot-koordinater i %)
| Rom | Ankre |
|---|---|
| `dal` | rund dør 20–28 %, bord ~42 %, esker ~52 %, epletre 72–80 %, port høyre kant |
| `kryss` | postkasse 12–17 %, skilt 25–40 %, hul logg 55–65 %, nordsti midt, østvei høyre kant |
| `pub` | bardis 15–35 %, peis 42–58 %, buet utgang 82–92 % høyre |
| `elv` | båthus 15–30 %, brygge 40–60 %, robåt ved brygga, fisker ~80 % høyre |
| `skog` | goblinleir 20–32 %, hult tre ~45 %, steinbro 65–90 % høyre |
| `vulkan` | vulkan 5–45 %, vaktdisk 50–62 %, jerndør 66–81 % |
| `krater` | hylle fra venstre, lavasjø nede til høyre, kastepunkt 77–97 % |

### Prompt-mal (lim inn, fyll inn scene)
```
[SCENE], rich detailed pixel art, 16-bit adventure game background,
painterly pixel style, high detail density, warm atmospheric lighting,
absolutely no people, no characters, no animals, no creatures, no text, no UI,
wide panoramic composition, keep the middle horizontal band open and walkable
```

### Regenererings-prompts per rom
**`dal`** — *Bloomdale, morgen*
```
Charming halfling village in soft morning light, rolling green hills. LEFT: cozy hobbit home built into a grassy hill with a ROUND GREEN wooden door at ground level around 20-28% from the left, two small round windows, stone steps below. CENTER: winding cobblestone path leading right, a small wooden garden table around 42%, stacked cardboard moving boxes around 52%. RIGHT: large apple tree full of red apples around 72-80%, wooden fence with open gate at the far right edge. Firewood logs stacked in the bottom left corner. + [mal]
```

**`kryss`** — *Veiskillet, skumring*
```
Rural crossroads at dusk, purple-orange sunset sky. LEFT: red mailbox on a wooden post around 12-17%. CENTER-LEFT: old wooden signpost with two arrow boards around 25-40%. CENTER: dirt paths crossing, a hollow fallen log around 55-65% in the foreground. Narrow path leading north up a hill. RIGHT: open east road. Crows on the signpost, dead tree far left. + [mal]
```

**`pub`** — *The Wobbly Pony, kveld*
```
Cozy medieval tavern interior at night, warm amber candlelight. LEFT: wooden bar counter with shelves of colorful bottles behind it from 15-35%. CENTER: stone fireplace with crackling fire around 42-58%, small picture frame above the mantel. RIGHT: round wooden tables with tankards, arched doorway at the far right edge around 82-92%. Hanging oil lamps, wooden floor planks, small window showing dusk. Keep the center floor open. + [mal]
```

**`elv`** — *Elvekaien, dag*
```
Sunny riverbank on a clear day. LEFT: small wooden boathouse with a locked plank door and red-brown shingled roof, left 15-30%. CENTER: weathered wooden dock with mooring posts extending into calm teal water 40-60%, a small empty wooden rowboat tied at the end of the dock. RIGHT third: grassy shore with reeds and mossy rocks, kept open. Upper half: wide calm river, distant tree-lined shore. + [mal]
```

**`skog`** — *Trollskogen, natt*
```
Dark magical forest at night, deep blue and indigo, moonlight shafts through the dense canopy. LEFT: goblin campfire glowing orange among crooked trees with crude wooden totems, left 20-32%, tiny cyan glowing mushrooms nearby. CENTER: one massive gnarled hollow tree trunk around 45%. RIGHT: an old mossy stone bridge arching over a dark ravine, leading off the right edge, from 65%. Fireflies floating, mysterious fairy-tale atmosphere. + [mal]
```

**`vulkan`** — *Foten av Trivselsfjellet*
```
Dark volcanic mountain foot, ash falling, glowing lava cracks in black rock. LEFT: smoking volcano cone with a glowing lava rim, 5-45%. CENTER-RIGHT: huge round iron gate with rivets built into a cliff face around 66-81%, a hanging closed-sign feel. A guard desk with paperwork stacks left of the gate around 50-62%. Warning signs along the path, embers rising, ominous red sky. + [mal]
```

**`krater`** — *Kalderaen*
```
Inside a volcano caldera, dark red sky, heavy falling ash. Bright orange lava lake filling the lower right with glowing crust plates and rising bubbles. A rocky ledge path enters from the left along the upper edge and leads to a wide platform at the right around 77-97% with a bent broken warning sign. Heat glow, smoke columns, floating embers, dramatic rim lighting on the rocks. + [mal]
```

### Heal-patcher (fjerne innbakte feil)
Generatoren ignorerer av og til «no characters» og maler inn hobitter/sau/fugler. To løsninger:
1. **Re-roll** bildet.
2. **Heal-patch**: legg i rommets `bgHeal`-liste (se `rooms1.js` → dal):
```js
bgHeal: [
  { dx: 0, dy: 0, w: 185, h: 265, sx: 195, sy: 0, flip: true },  // klone nabo-område (speilet) over feilen
  { dx: 1180, dy: 450, w: 100, h: 120, sx: 1050, sy: 450 },       // eller uten flip
],
```
Koordinater i world-enheter (1280×720-rommet). Send screenshot hvis du vil ha hjelp til å finne tallene.

## Musikk (music/)
Samme mønster: `music/<sporid>.mp3` → `node tools/build-music.js` → Ctrl+F5.
Spor: `title`, `dal`, `kryss`, `pub`, `elv`, `skog`, `vulkan`, `krater`, `ending`.
Mangler spor → prosedyremusikk (pad/bass/melodi per rom med reverb + ambientsjikt).
Prompt-mal: *«[STEMNING], instrumental video game background music, pixel adventure style, seamless loop, no vocals»* — se `music/README.txt`.

## Vanskelighetsgrad
`GAME.difficulty.rules` i `js/game.js`:
- `riddleRounds`: antall gåter hos Troll-Bent (Lett: 1, Normal/Vanskelig: 3)
- `hintLevel`: 2 = «PSST… HINT?»-alternativ hos Bent + Dora sier «GOAL: …»; 0 = vage hint
Les `Game.difficulty` der du vil utvide (velges i SETTINGS, gjelder umiddelbart på hint).

## Karakterer (genererte spriter)
Karakterene genereres som **PNG-spriter på magenta bakgrunn**, kroma-nøkles og innbakes. Motoren legger til livet: bob, blunk, munnveksling ved prat, vending og skygge.

### Du trenger
| Karakter | Poser | Prioritet |
|---|---|---|
| `tomble` | 1 stående + 2-3 gang-poser (kan være ett ark) | MÅ |
| `bongo`, `dora`, `bent` | 1 stående (+ valgfritt 1 «snakk» med åpen munn) | Bør |
| `rando`, `halvor`, `grim`, `bjarne`, `glum`, `billy`, `goblin` | 1 stående | Bør |
| `perr` (sort ridder til hest) | 1, hele motiven med hest | Bør |

### Prompt-mal (lim inn, fyll inn karakter)
```
[CHARACTER], detailed pixel art sprite, 16-bit adventure game character,
full body side view facing left, crisp pixels, rich shading and outline,
consistent chibi proportions (large head ~50% of height),
isolated on a solid bright magenta background (#FF00FF), no shadow on ground,
no text, no border, single character centered
```
For Tomble (gang-poser): bytt «full body side view facing left» med:
```
character sprite sheet: the SAME halfling character three times side by side,
evenly spaced, identical scale and style — pose 1: idle standing,
pose 2: walking mid-step left leg forward, pose 3: walking mid-step right leg forward
```

### Karakter-prompts
**`tomble`** — helten:
```
Small halfling adventurer, curly brown hair, big furry feet, mustard yellow
vest over cream shirt, brown shorts, cheerful determined face. + [mal med 3 poser]
```
**`bongo`** — onkelen: `Elderly retired hobbit adventurer, white hair tufts, small round glasses pushed up on forehead, maroon robe with gold trim, fuzzy slippers. + [mal]`
**`rando`** — vandrereren: `Mysterious rugged ranger in a dark green hooded cloak, stubble, sword hilt visible, dramatic stance. + [mal]`
**`dora`** — vertinnen: `Friendly sturdy innkeeper woman, auburn bun hair, rust-red dress with cream apron, holding a foaming tankard. + [mal]`
**`halvor`** — fylliken: `Drunk slouching patron, blue-gray shirt, flushed red round nose, half-closed eyes, messy dark hair. + [mal]`
**`grim`** — fiskeren: `Grumpy old fisher-gnome, long white beard, tall pointed blue hat with a gold star, yellow raincoat, holding a fishing rod. + [mal]`
**`bjarne`** — orkvakten: `Bored orc security guard, green-gray skin, orange hi-vis vest over chainmail, underbite tusks, holding a clipboard. + [mal]`
**`glum`** — *Glum*: `Small pale wretched hunched creature, huge watery blue eyes, sparse strands of hair, ragged brown loincloth, long bony fingers. + [mal]`
**`bent`** — trollet: `Massive stone bridge troll, gray-blue skin, tiny too-small metal helmet, heavy bored expression, broad seated build. + [mal]`
**`billy`** — geita: `Stubborn white goat with curved horns, cheeky expression, standing proudly. + [mal]`
**`perr`** — den sorte riddern: `Ominous black rider on a black horse, flowing tattered dark cloak, hood with a faint glowing red slit, spiked horse armor. + [mal]`
**`goblin`** — goblinen: `Small mischievous green goblin, big pointy ears, crude brown loincloth, crooked dagger. + [mal]`

### Etter generering
1. Lagre som `art/chars/<navn>.png` (ark: `tomble_sheet.png`)
2. Si ifra — jeg bygger `tools/build-chars.js` (kroma-nøkling + slice + normalisering + innbaking) og kobler den genererte rendereren i motoren
3. NPC-varianter kan farges med hue-rotate per karakter uten nye genereringer
Motoren (`js/engine.js`, `js/audio.js`, `js/art.js`, `js/main.js`) inneholder null historie — alt innhold ligger i en **spillpakke** under `js/games/<dittspill>/`. `index.html` velger spill ved hvilken pakke som inkluderes.

## Lag et nytt spill med motoren
Motoren (`js/engine.js`, `js/audio.js`, `js/art.js`, `js/main.js`) inneholder null historie — alt innhold ligger i en **spillpakke** under `js/games/<dittspill>/`. `index.html` velger spill ved hvilken pakke som inkluderes.

### Oppskrift
1. **Kopier pakken** (raskest):
```
xcopy /E /I js\games\ring-and-wrong js\games\mittspill
```
2. **Bytt manifestet** (`mittspill/game.js`) — dette er kontrakten mot motoren:
```js
window.GAME = {
  meta: { title: 'MITT SPILL', version: 'v0.1.0', storageKey: 'mittspill',
          subtitle: '...', tagline: '...', about: ['...'] },
  ui:    { hintRightClick: '...', hintEsc: 'ESC = menu', leave: '( leave )' },
  speakers: { colors: { toke: '#ffd94a', /* ... */ }, names: { toke: 'TOMBLE', /* ... */ } },
  intro: [ ['Panel 1 linje 1', 'linje 2', '...'], ['Panel 2...'] ],
  endings: { good: { title: '...', lines: ['...'] }, bad: { /* ... */ } },
  difficulty: { levels: ['easy', 'normal', 'hard'], labels: { /* ... */ },
                rules: { riddleRounds: { easy: 1, normal: 3, hard: 3 },
                         hintLevel: { easy: 2, normal: 1, hard: 0 } } },

  // HOOKENS motoren kaller:
  paint:  { title(c, W, H, t), introBg(c, W, H, t), ending(c, W, H, t, type),
            person(c, o), canary() },                 // tegning (deleger til ART.*)
  start:  { room: 'forsterom', x: 400, y: 500,
            script: [{ say: ['helt', 'Foerste replikk!'] }] },
  assets: { artPath: 'js/games/mittspill/art/' },
  audio:  { tracks: { title: 'title', /* mood → musikkfil-id */ } },
};
```
3. **Bytt innhold** i paken:
   - `rooms*.js` — `window.ROOMS` (rom, hotspots, walk-bånd, dialoger, cutscenes)
   - `npcs*.js` — `window.NPC_DEFS` (karakterer, dialogtrær, itemActions)
   - `data.js` — `window.ITEMS` (navn + ikon) + `window.COMBOS`
   - `sprites.js` — piksel-grids + paletter (`window.SPRITE_CORE`)
   - `painters*.js` — prosedyral fallback-bakgrunner (`ART.<romid>`)
4. **Bakgrunner og musikk**: legg filer i pakkens `art/` og `music/`, deretter:
```
node tools/build-art.js
node tools/build-music.js
```
5. **Bytt paken i `index.html`**: endre `js/games/ring-and-wrong/` → `js/games/mittspill/` i script-blokken.
6. **Test**:
```
node test/validate.js
node test/smoke.js
```
`validate.js` og `smoke.js` leser script-listen fra `index.html` — de følger automatisk med når du flytter/fornyer filer.

### Minimum per fil (kontrakten)
| Fil | Må inneholde |
|---|---|
| `game.js` | `GAME` med `meta`, `paint`, `start`, `assets`, `audio` (+ `ui`, `speakers`, `intro`, `endings`, `difficulty`) |
| `rooms*.js` | `window.ROOMS` — hvert rom: `id, name, paint, walk {minY, maxY}, hotspots[], npcs[]` |
| `npcs*.js` | `window.NPC_DEFS` — hver: `id, name, draw, look/talk/use/take, itemActions` |
| `data.js` | `window.ITEMS` (name + icon) og `window.COMBOS` |
| `sprites.js` | `window.SPRITE_CORE = { UPPER, LEG_*, STYLES, ... }` (kan gjenbruke malen) |
| `painters*.js` | `ART.<romid>`-fallbacks (kan være tomme hvis alle rom har PNG-bakgrunn) |

Tips: start med å **slette** innhold du ikke trenger (f.eks. `painters*` hvis alle rom har PNG-bakgrunner, `sprites*` hvis du tegner karakterer på annet vis) og fjern tilsvarende script-tagger i `index.html`. Motoren fallbacker trygt: mangler `paint`-hook eller `paint()`-funksjon tegnes et flatt felt.

## Motor vs. innhold (oversikt)
- **Motor**: `engine.js` (rendering, verber, dialog, cutscenes, lagring, innstillinger) + `audio.js` + `art.js` (verktøy) + `main.js` — ingen historie-referanser
- **Innhold**: `js/games/<spill>/` — alt annet
- Motoren kaller bare GAME-hookene (`paint`, `start`, `assets`, `audio`) — null historie igjen i `engine.js`/`audio.js`

## Hosting
Se `HOSTING.md` (Netlify Drop / GitHub Pages / itch.io / lokal server).
