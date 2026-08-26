BAKGRUNNER (art/) - se README.md for full dokumentasjon
=======================================================

Filnavn: art/<romid>.png|jpeg|jpg
  dal, kryss, pub, elv, skog, vulkan, krater

Pipeline: hoyde-tilpasset med 10% overskann, bunnjustert (sti/forgrunn
synlig over UI-linjen), bredde sentreres-krops. Anbefalt: 2:1 (1920x960).

Etter a legge inn/bytte bilde:
  node tools/build-art.js
  Ctrl+F5

Oppdaterte regenererings-prompts per rom (med ankre) finner du i
hoved-README.md under "Regenererings-prompts per rom".

Innbakte figurer/dyr i bildet? Enten re-roll, eller legg en
heal-patch i rommets bgHeal-liste (se README.md "Heal-patcher").
