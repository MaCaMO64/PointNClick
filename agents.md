# agents.md — bevart lærdom for agentbytte

> Les denne filen først ved ny økt. Den oppsummerer arkitektur, konvensjoner og kjente fallgruver som ellers går tapt.

## 1. Prosjektmål
SCUMMVM-lignende motor for point-and-click (LucasArts-inspirert). Én generisk motor + utskiftbare spillpakker. Nåværende spill: `js/games/ring-and-wrong/` — prototype, men grunnmuren er SCUMM-lite.

## 2. Arkitektur (motor vs. innhold)

```
index.html              ← velger pakke ved hvilke <script src="js/games/<spill>/…"> som inkluderes (?v= cache-bust)
js/
  engine.js             ← MOTOREN: verber, dialog, cutscenes (G.script), lagring, settings, render-loop, viewport
  audio.js              ← WebAudio: MOODS prog + reverb/delay + ambience + MUSIC_DATA slots
  art.js                ← kun primitiver: rr/ell/circle/poly/vgrad/glow (+ fallback vektor-person) — ingen historie
  main.js               ← boot
  games/<spill>/
    game.js             ← MANIFEST: window.GAME = { meta, ui, speakers, intro, endings, difficulty, paint, start, assets, audio }
    rooms1-3.js         ← window.ROOMS — hvert rom: { id,name,mood|track,paint,walk,hotspots,npcs,onEnter,onRingToggle,animateOver,pngTint,bgHeal }
    npcs1-2.js          ← window.NPC_DEFS — { id,name,draw,look/talk/itemActions,hidden }
    data.js             ← window.ITEMS + window.COMBOS
    sprites.js          ← SPRITE_CORE (UPPER/LEG_*/STYLES/GOAT/GLUM/TROLL/RIDER)
    sprites-render.js   ← overskriver ART.person/rider → piksel-sprites (CELL=2, cache-fritt, heltalls-snap)
    scenes.js           ← fallback-malerier (ART.<romId>) — brukes hvis art/<id>.png mangler
    painters1-3.js      ← rike prosedyre-malerier (overskriver ART.<romId>)
    art/  music/        ← kildefiler for build-verktøyene
    art-data.js / music-data.js ← GENERERT av tools/build-*.js (base64) — gjør file:// spillbart
test/
  validate.js           ← parser src="js/[^"] fra index.html → vm-sandbox, sjekker ROOMS/ITEMS/npcs/verb-whitelist/goto-graf/flagg
  smoke.js              ← Proxy-canvas som kaster ved NaN/negativ radius, Image-stub, raf-kø, wall-clock-vakt, pump(frames)
tools/
  build-art.js          ← ids=['dal','kryss','pub','elv','skog','vulkan','krater'] → js/games/<spill>/art-data.js (base64)
  build-music.js        ← ids=['title','dal',...,'ending'] → music-data.js
README.md / HOSTING.md  ← forfatter-docs (koordinater, prompts, oppskrift nytt spill)
```

**Kontrakt motoren kaller (via `GAME`):**
`GAME.meta{title,version,storageKey,subtitle,tagline,about}` ·
`GAME.ui{hintRightClick,hintEsc,leave}` ·
`GAME.speakers{colors,names}` ·
`GAME.intro: string[][]` · `GAME.endings{good,bad}` ·
`GAME.difficulty{levels,labels,rules:{riddleRounds,hintLevel}}` ·
`GAME.paint{title,introBg,ending,person,canary}` ·
`GAME.start{room,x,y,script:[{say:[who,text]}]}` ·
`GAME.assets{artPath}` · `GAME.audio{tracks:{mood:fileId}}`

Motoren skal ikke inneholde historie — se §5 for kjente lekkasjer som er igjen å tette.

## 3. Konvensjoner

* **Koordinater:** 1280×720 logisk. Walk-bånd `walk:{minY:488,maxY:592}` (føtter). `standX/standY` = hvor spilleren stopper for å interagere. Hotspot `x/y/w/h` i samme rom. `W/H/LOW_W/LOW_H/UI_TOP=624/KX/KY` hardkodet i `engine.js:1-3` (TODO: gjøre data-drevet).
* **Verber:** `VERBS=[walk,look,take,use,talk]` (`engine.js:36-42`), dispatch `executeVerb:311-350` sjekker `selectedItem ? itemActions : verbs[activeVerb]`.
* **Cutscenes:** `G.script([{say,sayLines,wait,move,fn,music,fx,flag,ring,goto,dialog}])` — `updateScript:412-455` blokkerer på `speech/waiting/player.moving/npc.scriptMoving`.
* **Lagring:** `saveData(){room,x,y,inv,flags,ringWorn}` → `localStorage[storageKey+'_save'|'ringandwrong' hardkodet i dag — bør bruke storageKey]`.
* **Versjon/cache:** `?v=` i `index.html:14-37`. Bump ved hver JS-endring. Husk å bump `GAME.meta.version`.
* **Viewport:** `LOW_W=320,LOW_H=156, UI_TOP=624` (96px panel). `G._low` tegnes med `setTransform(KX,KY)` → `imageSmoothingEnabled=false` → blit til `W×UI_TOP`. Bakgrunner bunnjustert med 10% overscan (`buildBg:186-233`) — himmel beskjæres, sti synlig. Karakterer: `CELL=2`, heltalls-snap (ingen AA).

## 4. Kjente fallgruver (ikke gjenta)

1. **OneDrive + LF vs CRLF:** `Read`/`Write`-verktøyet skriver LF, PowerShell `Set-Content` uten `-Encoding UTF8` skriver ANSI → `å/ø/æ` blir `Ã¸`. ALLTID bruk `-Encoding UTF8` eller `edit`-verktøyet for flerlinje-endringer. Multi-linje `.Replace("\r\n",…)` feiler på LF-filer — bruk `"\n"` eller `edit`.
2. **Bash spiser backticks:** PowerShell-kommandoer kjørt via `bash`-verktøyet mister `` ` `` (command substitution). Unngå `` `r`n `` i slike kommandoer — bruk `[Environment]::NewLine` (+ regex `\\r\\n` literal-replace ved reparasjon).
3. **file:// CORS/taint:** `art/<id>.png` kan ikke lastes som bilde fra `file://` uten taint. Løsning: `tools/build-*.js` baker til base64 i `art-data.js`/`music-data.js`. Husk `node tools/build-art.js` etter nye bilder og bump `?v=`.
4. **Cache-blende spriter:** hver pikselcelle må være heltall i lavoppløsning; `imageSmoothingEnabled=false` + `Math.round` ellers blir spriter halvgjennomsiktige. Cache-laget er fjernet — direkte tegning er riktig.
5. **Art vs. spill:** `js/art.js` skal kun inneholde primitiver + fallback. `painters*/sprites` hører til pakken (`js/games/<spill>/`). `scenes.js` er fallback-maler — overskrives av `painters`.
6. **Test-harness:** `smoke.js` bruker Proxy-canvas som kaster ved `NaN/negativ radius`, `Image`-stub og `setInterval`-vakt. Musikken holder Node i live → husk `process.exit(0)` i slutten. `validate.js` leser `index.html` for fil-liste — robust mot flyttinger.
7. **N-debug:** `N`-tasten viser grønne etiketter + magenta blit-rammer per karakter + kanari (`ART._canary`). Bruk ved «usynlig»/«på taket»-rapport.
8. **Script-format:** `GAME.start.script` må være `[{say:[who,text]}]` — rå `[[who,text]]` henger (queue tømmes aldri). Duplikat `GAME.*`-blokker i `game.js` overskriver korrekt (sjekk at kun én `GAME.start = {` finnes).

## 5. Historie-lekkasje i motor — TETTET (v0.11.0)
Alle lekkasjer under er nå flyttet til spillpakken:
* `ringWorn/whispers/wearRing/toggleRing` → `GAME.wearable {itemId,whispers,overlay,fxOn,fxOff,toastOn,toastOff}` + `G.wear(id)`/`G.toggleWear()` + rom-hook `onWearToggle(id)` + script-steg `{wear:null}`
* `joinedRando`-follower → `GAME.followers[] = [{style,flag,offsetX,excludeRooms}]`
* `rv_auto/_prev/_save` → `${GAME.meta.storageKey}_auto/_auto_prev/_save` (helper `storageKey(suffix)` i engine)
* `room.mood || 'shire'` → `GAME.defaultMood`; `showEnding` → `GAME.endings[type].music`
* `audio.js MOODS/MOOD_TRACK` → `GAME.audio.moods` (lazy getter `MOODS()` i audio — game.js laster ETTER audio)
* `art.js STYLE_CFG/person/goat/glum/troll/rider/ICONS` → pakken: `vector-person.js` (vektor-fallback, setter ART.person/rider/_vectorPerson) + `game-icons.js` (`window.GAME_ICONS`) — `data.js` leser `const GAME_ICONS = window.GAME_ICONS || {}`
* `art.js title` leser `window.GAME.meta` (title/subtitle/tagline/version) — art.js har nå KUN primitiver + generiske skjermer

**FALLGRUVE ved vm-loading (validate/smoke):** `window.X = …` i vm blir IKKE automatisk global `X` — filer som leser `GAME_ICONS`/andre uten window-prefix må sette `const X = window.X || {}` lokalt. Dette ga falske 'reading fløyte'-feil.

## 6. Veikart

* Steg 1: tett lekkasjene over, gjør `W/H` og `ids` i `tools/*` data-drevet
* Steg 2: JSON-schema for rom/NPC + visuell hotspot-editor (gjenbruk N-debug)
* Steg 3: ES-moduler/importmap + dynamisk `import()`-loader (fjern rekkefølge-fragilitet i `index.html`)

## 7. Nyttige kommandoer

```
npx -y serve .                         # live-preview
node tools/build-art.js                # etter nye bilder i art/
node tools/build-music.js              # etter nye spor i music/
node test/validate.js && node test/smoke.js
```
