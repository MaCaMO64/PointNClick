# Hosting av RING & WRONG

Spillet er 100 % statisk (HTML/CSS/JS – ingen server, ingen build). Alt du trenger å dele er mappen `ring-og-vrang` eller ferdig-zipen `RingsAndWrongs.zip`.

## Rask test lokalt
Dobbeltklikk `ring-og-vrang/index.html` – spillet kjører direkte i nettleseren, også fra fil.

Vil du vise det frem på eget LAN (mobil/nettbrett kan spille med):
```
cd ring-og-vrang
npx -y serve .
```
Åpne den adressen `serve` skriver ut (f.eks. http://192.168.x.x:3000) på andre enheter samme nett.

## Alternativ A – Netlify Drop (raskeste offentlige lenke)
1. Gå til https://app.netlify.com/drop
2. Dra zip-filen **RingsAndWrongs.zip** (eller hele mappen) inn på siden.
3. Får en offentlig URL med én gang (gratis konto kreves etter første side).

## Alternativ B – GitHub Pages
Repoet er allerede initialisert og committet lokalt:
1. Lag et tomt repo på github.com, f.eks. `rings-and-wrongs`.
2. Kjør:
```
cd ring-og-vrang
git remote add origin https://github.com/<BRUKERNAVN>/rings-and-wrongs.git
git branch -M main
git push -u origin main
```
3. På GitHub: Settings → Pages → Source: `main` / `/ (root)` → Save.
4. Lenken blir: `https://<BRUKERNAVN>.github.io/rings-and-wrongs/`

## Alternativ C – itch.io (perfekt for eventyrspill)
1. https://itch.io/game/new → «Upload game»
2. Kind of project: **HTML** → last opp RingsAndWrongs.zip
3. Huk av «This file will be played in the browser».
4. Publiser – spillere får fullskerm og kommentarfelt gratis.
