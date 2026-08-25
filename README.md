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

## Motor vs. innhold
- **Motor**: `engine.js` (rendering, verber, dialog, cutscenes, lagring, innstillinger) + `audio.js` + `sprites-render.js` — ingen historie-referanser
- **Innhold**: `game.js` (manifest: meta/tekster/talere/intro/slutninger/vanskelighet) + `rooms1-3.js` + `npcs1-2.js` + `data.js` (items/combos) + `scenes/painters` (prosedural fallback-grafikk) + `sprites.js` (sprite-grids)
- Nytt spill = nytt manifest + egne innholdsfiler mot samme motor-API (`Game.*`)

## Hosting
Se `HOSTING.md` (Netlify Drop / GitHub Pages / itch.io / lokal server).
