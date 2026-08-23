(() => {
  const vecPerson = ART.person;
  const vecRider = ART.rider;

  const UPPER = [
    '....HHHHHHHH....',
    '..HHHHHHHHHHHH..',
    '.HHHHHHHHHHHHHH.',
    '.HHHHHHHHHHHHHH.',
    '.HSSSSSSSSSSSSH.',
    '.HSEKSSSSEKSSH..',
    '.HSEKSSSSEKSSH..',
    '.HSCSSSSSSCSSH..',
    '..SSSSMMSSSS....',
    '..SSSSSSSSSS....',
    '...AATTTTTTAA...',
    '..SATTTTTTTTAS..',
    '..SATTTTTTTTAS..',
    '..SAUUUUUUUUAS..',
    '...PTTTTTTTTP...',
    '...PPPPPPPPPP...',
  ];
  const LEG_STAND = [
    '...PPP..PPPP....',
    '...PP....PP.....',
    '...PP....PP.....',
    '...FF....FF.....',
  ];
  const LEG_A = [
    '..PPPP.PPPP.....',
    '..PPP...PPP.....',
    '.PPP.....PPP....',
    '.FF.......FF....',
  ];
  const LEG_B = [
    '...PPPP.PPP.....',
    '...PPP..PP......',
    '...PP...PP......',
    '...FF...FF......',
  ];
  const ROBE_A = [
    '...PTTTTTTTTP...',
    '..PTTTTTTTTTTP..',
    '..PTTTTTTTTTTP..',
    '..PTTTTTTTTTTP..',
    '.PTTTTTTTTTTTP..',
    '.PTTTTTTTTTTTP..',
    '.AAAAAAAAAAAAAP.',
    '.FF..........FF.',
  ];
  const ROBE_B = [
    '...PTTTTTTTTP...',
    '..PTTTTTTTTTTP..',
    '.PTTTTTTTTTTTP..',
    '..PTTTTTTTTTTP..',
    '.PTTTTTTTTTTTP..',
    '..PTTTTTTTTTTP..',
    '.AAAAAAAAAAAAAP.',
    '..FF........FF..',
  ];

  const GOAT = [
    '..............H.H.',
    '.............HH.HH',
    '.............BBBB.',
    '.............BKSB.',
    '.B...........BBBB.',
    'BBBBBBBBBBB.BBBB..',
    'BBBBBBBBBBBBBBBBB.',
    'BBBBBBBBBBBBBBBB..',
    '.DD..DD....DD..DD.',
    '.DD..DD....DD..DD.',
    '.KK..KK....KK..KK.',
  ];
  const GLUM = [
    '....PPPP....',
    '...PPPPPP...',
    '..PWWKWWKP..',
    '..PPWWWWWP..',
    '..PPPPPMP...',
    '..PPPPPPP...',
    '...PPPPP....',
    '..PPPPPPP...',
    '.PPPLLLPPP..',
    '.PP.LLL.PP..',
    '.PP.LLL.PP..',
    '....LLL.....',
    '...PP.PP....',
    '...PP.PP....',
    '...PP.PP....',
    '..PPP.PPP...',
    '..PP...PP...',
    '..PF...FP...',
  ];
  const TROLL = [
    '.......TTTTTT.........',
    '......TTTTTTTT........',
    '.....BBBBBBBBBB.......',
    '.....BSWKBBSWKB.......',
    '.....BBBBBBBBBB.......',
    '.....BBBMMMMBBB.......',
    '......BBBBBBBB........',
    '.......BBBBBB.........',
    '....BBBBBBBBBBBB......',
    '..BBBBBLLLLLLBBBBB....',
    '.DBBBBLLLLLLLLBBBBB...',
    '.DBBBLLLLLLLLLLBBBB...',
    '.DBBBLLLLLLLLLLBBBB...',
    '.DBBBBLLLLLLLLBBBB....',
    '..DBBBLLLLLLBBBB......',
    '..DBBBBBBBBBBBB.......',
    '..DBBBBBBBBBBBB.......',
    '..DBBBBB..BBBBB.......',
    '..DBBBB....BBBB.......',
    '..DBBBB....BBBB.......',
    '..DBBB......BBB.......',
    '..DBBB......BBB.......',
    '.DDDDD......DDDD......',
    '.DDDDD......DDDD......',
  ];
  const RIDER = [
    '..................CCCC............',
    '.................CCCCCC...........',
    '................CCRRCCCC..........',
    '...............CCCCCCCC...........',
    '..............CCCCCCCCC...........',
    '.....MM.......CCCCCCCCCCC.........',
    '....MMMM......CCCCCCCCCCC.........',
    '...DDDDDMMMMMDCDDDCCCDD...........',
    '..DDDDDDDDDDDDDDDDDDDDDD..........',
    '.DDDDDDDDDDDDDDDDDDDDDDDD.........',
    '.DDDDDDDDDDDDDDDDDDDDDDDD.........',
    '.DDDDDDDDDDDDDDDDDDDDDDDDD........',
    '..DD..DD......DD..DD..............',
    '..DD..DD......DD..DD..............',
    '..DK..DK......DK..DK..............',
  ];
  const HORSE_PAL = { D: '#181b26', M: '#101220', C: '#101320', R: '#ff4030', K: '#05070c' };

  const STYLES = {
    toke:   { pal: { H: '#8a5330', S: '#f2c79a', E: '#20263a', M: '#a05a48', T: '#c9a23b', U: '#8a6a2c', A: '#efe0bd', P: '#6b4a2f', F: '#b9854e' } },
    bongo:  { pal: { H: '#d8d8d8', S: '#eec39a', E: '#20263a', M: '#a05a48', T: '#8c5548', U: '#6e3e34', A: '#d9b25f', P: '#5d442e', F: '#caa06a' }, robe: true,
      acc(c, x, y, s) {
        c.strokeStyle = '#d9b25f';
        c.lineWidth = 0.7 * s;
        c.strokeRect(x + 2.7 * s, y + 4.7 * s, 3 * s, 2.8 * s);
        c.strokeRect(x + 9.7 * s, y + 4.7 * s, 3 * s, 2.8 * s);
        c.beginPath();
        c.moveTo(x + 5.7 * s, y + 5.6 * s);
        c.lineTo(x + 9.7 * s, y + 5.6 * s);
        c.stroke();
      } },
    rando:  { pal: { H: '#3a2a1a', S: '#e0b48c', E: '#101418', M: '#8a4a3a', T: '#2f4432', U: '#243428', A: '#3e5c40', P: '#232d26', F: '#2c2c24' },
      acc(c, x, y, s, o) {
        c.fillStyle = '#2f4432';
        c.fillRect(x + 2 * s, y - 0.4 * s, 12 * s, 4.6 * s);
        c.fillRect(x + 2 * s, y + 4 * s, 2.4 * s, 6 * s);
        c.fillRect(x + 11.6 * s, y + 4 * s, 2.4 * s, 6 * s);
        c.fillStyle = 'rgba(10,14,20,0.45)';
        c.fillRect(x + 4.4 * s, y + 4 * s, 7.2 * s, 6 * s);
        if (!o || !o.talking) {
          c.fillStyle = '#e0b48c';
          c.fillRect(x + 5.4 * s, y + 5.4 * s, 1.2 * s, 1 * s);
          c.fillRect(x + 9.6 * s, y + 5.4 * s, 1.2 * s, 1 * s);
        }
        c.strokeStyle = '#9aa2ac'; c.lineWidth = Math.max(1, s * 0.5);
        c.beginPath(); c.arc(x + 13.6 * s, y + 11.4 * s, 1.4 * s, 0, Math.PI * 2); c.stroke();
      } },
    dora:   { pal: { H: '#5b3a1e', S: '#f0c39c', E: '#20263a', M: '#a05a48', T: '#a8524a', U: '#7e3a38', A: '#efe6d2', P: '#5a3040', F: '#4a2f28' },
      acc(c, x, y, s) {
        c.fillStyle = '#5b3a1e';
        c.fillRect(x + 6.2 * s, y - 1.6 * s, 3.6 * s, 2.6 * s);
        c.fillStyle = '#efe6d2';
        c.fillRect(x + 6 * s, y + 12 * s, 4 * s, 4.6 * s);
        c.fillRect(x + 6 * s, y + 11 * s, 1 * s, 1.4 * s);
        c.fillRect(x + 9 * s, y + 11 * s, 1 * s, 1.4 * s);
        c.fillRect(x + 11.8 * s, y + 12 * s, 1.4 * s, 2.4 * s);
      } },
    halvor: { pal: { H: '#2a1f14', S: '#eab88f', E: '#20263a', M: '#a05a48', T: '#556079', U: '#3e4557', A: '#8a94ad', P: '#33384a', F: '#2c2c30' },
      acc(c, x, y, s) {
        c.fillStyle = 'rgba(120,70,60,0.55)';
        c.fillRect(x + 2.8 * s, y + 5 * s, 3 * s, 0.9 * s);
        c.fillRect(x + 9.6 * s, y + 5 * s, 3 * s, 0.9 * s);
        c.fillStyle = '#e05555';
        c.beginPath(); c.arc(x + 7.6 * s, y + 7.2 * s, 1.2 * s, 0, Math.PI * 2); c.fill();
      } },
    grim:   { pal: { H: '#ececec', S: '#e8b58c', E: '#20263a', M: '#a05a48', T: '#d7c25a', U: '#b09a42', A: '#f0e0a0', P: '#4a5568', F: '#3a3f4c' },
      acc(c, x, y, s) {
        c.fillStyle = '#ececec';
        c.fillRect(x + 4 * s, y + 8 * s, 8 * s, 1.4 * s);
        c.fillRect(x + 4.6 * s, y + 9.4 * s, 6.8 * s, 1.4 * s);
        c.fillRect(x + 5.2 * s, y + 10.8 * s, 5.6 * s, 1.3 * s);
        c.fillRect(x + 6 * s, y + 12.1 * s, 4 * s, 1.1 * s);
        c.fillStyle = '#3d5a99';
        for (let i = 0; i < 7; i++) {
          const wdt = (2.4 + i * 1.7) * s;
          c.fillRect(x + 8 * s - wdt / 2, y - (7 - i) * s, wdt, s + 0.2);
        }
        c.fillStyle = '#ffd24a';
        c.beginPath(); c.arc(x + 8 * s, y - 6.6 * s, 0.8 * s, 0, Math.PI * 2); c.fill();
      } },
    goblin: { pal: { H: '#4a6a34', S: '#7fb35a', E: '#16220f', M: '#33502a', T: '#4a4436', U: '#38332a', A: '#5a5446', P: '#3a352a', F: '#2c2820' }, scaleMul: 0.74,
      acc(c, x, y, s, o) {
        c.fillStyle = '#7fb35a';
        c.fillRect(x + 0.6 * s, y + 5 * s, 2 * s, 1.2 * s);
        c.fillRect(x + 13.4 * s, y + 5 * s, 2 * s, 1.2 * s);
        if (o && o.sleeping) {
          c.fillStyle = '#5d8442';
          c.fillRect(x + 3 * s, y + 5.2 * s, 2.6 * s, 1 * s);
          c.fillRect(x + 9.8 * s, y + 5.2 * s, 2.6 * s, 1 * s);
        }
      } },
    bjarne: { pal: { H: '#33331f', S: '#8fa06a', E: '#14180f', M: '#5a3a30', T: '#5c5044', U: '#463c32', A: '#6e6154', P: '#3f3a30', F: '#2e2a24' },
      acc(c, x, y, s) {
        c.fillStyle = '#ff7a1a';
        c.fillRect(x + 3.6 * s, y + 11 * s, 3.6 * s, 5 * s);
        c.fillRect(x + 8.8 * s, y + 11 * s, 3.6 * s, 5 * s);
        c.fillStyle = '#e8e8e8';
        c.fillRect(x + 4.2 * s, y + 13.4 * s, 2.2 * s, 1.2 * s);
        c.fillRect(x + 9.6 * s, y + 13.4 * s, 2.2 * s, 1.2 * s);
        c.fillStyle = '#fff';
        c.fillRect(x + 5.2 * s, y + 9.2 * s, 1 * s, 1.1 * s);
        c.fillRect(x + 10 * s, y + 9.2 * s, 1 * s, 1.1 * s);
        c.fillStyle = '#2a241c';
        c.fillRect(x + 2.8 * s, y + 3.8 * s, 2.6 * s, 0.9 * s);
        c.fillRect(x + 10.6 * s, y + 3.8 * s, 2.6 * s, 0.9 * s);
      } },
  };

  const CELL = 2;
  const cache = {};

  function SnapCtx(c) {
    const r = v => Math.round(v);
    return {
      set fillStyle(v) { c.fillStyle = v; },
      set strokeStyle(v) { c.strokeStyle = v; },
      set lineWidth(v) { c.lineWidth = v; },
      fillRect(x, y, w, h) { c.fillRect(r(x), r(y), Math.max(1, r(w)), Math.max(1, r(h))); },
      strokeRect(x, y, w, h) { c.strokeRect(r(x), r(y), Math.max(1, r(w)), Math.max(1, r(h))); },
      beginPath() { c.beginPath(); },
      moveTo(x, y) { c.moveTo(r(x), r(y)); },
      lineTo(x, y) { c.lineTo(r(x), r(y)); },
      arc(x, y, rad) { c.arc(r(x), r(y), Math.max(1, r(rad)), 0, Math.PI * 2); },
      quadraticCurveTo(a, b, x, y) { c.quadraticCurveTo(r(a), r(b), r(x), r(y)); },
      stroke() { c.stroke(); },
      fill() { c.fill(); },
    };
  }

  function drawGridRaw(cc, rows, pal, ox, oy) {
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      for (let q = 0; q < row.length; q++) {
        const ch = row[q];
        if (ch === '.') continue;
        const col = pal[ch];
        if (!col) continue;
        cc.fillStyle = col;
        cc.fillRect(ox + q * CELL, oy + r * CELL, CELL, CELL);
      }
    }
  }

  function humanoidSprite(st, key, legsArr) {
    if (!cache[key]) {
      const cv = document.createElement('canvas');
      cv.width = 16 * CELL;
      cv.height = (UPPER.length + legsArr.length) * CELL;
      const cc = cv.getContext('2d');
      drawGridRaw(cc, UPPER, st.pal, 0, 0);
      drawGridRaw(cc, legsArr, st.pal, 0, UPPER.length * CELL);
      if (st.acc) st.acc(SnapCtx(cc), 0, 0, CELL, null);
      cache[key] = cv;
    }
    return cache[key];
  }

  function specialSprite(rows, pal, key) {
    if (!cache[key]) {
      const cv = document.createElement('canvas');
      cv.width = rows[0].length * CELL;
      cv.height = rows.length * CELL;
      const cc = cv.getContext('2d');
      drawGridRaw(cc, rows, pal, 0, 0);
      cache[key] = cv;
    }
    return cache[key];
  }

  function blitSprite(c, o, cv, wPx, hPx, bob) {
    const l = c;
    l.save();
    l.setTransform(1, 0, 0, 1, 0, 0);
    l.imageSmoothingEnabled = false;
    const lx = Math.round(o.x * 0.25 - wPx / 2);
    const ly = Math.round(o.y * 0.25) - hPx + (bob || 0) + 1;
    o._blit = { lx, ly, wPx, hPx };
    if (o.facing < 0) {
      l.translate(lx + wPx, ly);
      l.scale(-1, 1);
      l.drawImage(cv, 0, 0, wPx, hPx);
    } else {
      l.drawImage(cv, 0, 0, wPx, hPx);
    }
    l.restore();
    return { lx, ly, cell: CELL, wPx, hPx };
  }

  function block(c, g, facing, c0, r0, cols, rws, color, alpha) {
    const x0 = facing < 0 ? g.lx + g.wPx - (c0 + cols) * g.cell : g.lx + c0 * g.cell;
    if (alpha !== undefined) { c.save(); c.globalAlpha = alpha; }
    c.fillStyle = color;
    c.fillRect(x0, g.ly + r0 * g.cell, cols * g.cell, rws * g.cell);
    if (alpha !== undefined) c.restore();
  }

  function drawHumanoid(c, o) {
    const st = STYLES[o.style] || STYLES.toke;
    const facing = o.facing || 1;
    const now = performance.now() / 1000;

    c.fillStyle = 'rgba(10,12,20,0.28)';
    c.beginPath();
    c.ellipse(o.x, o.y + 2, 17 * (o.scale || 1), 5 * (o.scale || 1), 0, 0, Math.PI * 2);
    c.fill();

    let frame = 0;
    if (o.walking) frame = Math.floor(o.phase) % 4;
    const seq = [LEG_A, LEG_STAND, LEG_B, LEG_STAND];
    const legs = st.robe ? (o.walking && frame % 2 === 0 ? ROBE_A : ROBE_B) : seq[frame];
    const key = o.style + ':' + (st.robe ? 'r' + (frame % 2) : frame);
    const cv = humanoidSprite(st, key, legs);
    const bob = o.walking && frame % 2 === 1 ? -CELL : 0;
    const g = blitSprite(c, o, cv, 16 * CELL, (UPPER.length + legs.length) * CELL, bob);

    const eyeL = facing < 0 ? 11 : 3;
    const eyeR = facing < 0 ? 4 : 9;
    if (o.sleeping) {
      block(c, g, facing, eyeL, 5, 2, 2, st.pal.S);
      block(c, g, facing, eyeR, 5, 2, 2, st.pal.S);
    } else if (o.style !== 'rando') {
      const blink = ((now + (o.blinkSeed || 0)) % 3.4) < 0.12;
      if (blink) {
        block(c, g, facing, eyeL, 5, 2, 2, st.pal.S);
        block(c, g, facing, eyeR, 5, 2, 2, st.pal.S);
      }
    }
    if (o.talking) {
      const open = Math.floor(now * 9) % 2 === 0;
      block(c, g, facing, 7, 8, 2, 1, st.pal.M);
      if (open) block(c, g, facing, 7, 9, 2, 1, st.pal.M);
    }
  }

  function drawSpecial(c, o, rows, pal, key, opt) {
    const mul = (opt && opt.scaleMul) || 1;
    const cell = Math.max(1, Math.round(CELL * mul));
    const cv = specialSprite(rows, pal, key);
    const wPx = rows[0].length * cell;
    const hPx = rows.length * cell;
    c.fillStyle = 'rgba(10,12,20,0.28)';
    c.beginPath();
    c.ellipse(o.x, o.y + 2, (rows[0].length / 2) * 0.8 * cell, 2.2 * cell, 0, 0, Math.PI * 2);
    c.fill();
    return blitSprite(c, o, cv, wPx, hPx, 0);
  }

  const newPerson = (c, o) => {
    const facing = o.facing || 1;
    switch (o.style) {
      case 'goat': {
        const p = { B: '#efeadb', D: '#ded5c0', H: '#8a7a5a', K: '#222222', S: '#d8aab2' };
        drawSpecial(c, o, GOAT, p, 'goat');
        return;
      }
      case 'glum': {
        const p = { P: '#cdd6da', L: '#5a4632', W: '#eef7ff', K: '#2a6ea8', M: '#4a3038', F: '#cdd6da' };
        const g = drawSpecial(c, o, GLUM, p, 'glum');
        const blink = ((performance.now() / 1000 + 1.3) % 4.1) < 0.15;
        if (blink) block(c, g, facing, 3, 2, 6, 2, p.P);
        if (o.talking) {
          const open = Math.floor(performance.now() / 140) % 2 === 0;
          block(c, g, facing, 7, 4, 1, 1, p.M);
          if (open) block(c, g, facing, 7, 5, 1, 1, p.M);
        }
        return;
      }
      case 'troll': {
        const p = { B: '#8d94a4', D: '#69707f', L: '#9aa1b1', T: '#5f6674', W: '#e8ecf4', K: '#20263a', M: '#4a3038', S: '#8d94a4' };
        drawSpecial(c, o, TROLL, p, 'troll', { scaleMul: 1.5 });
        return;
      }
      case 'perr': {
        const g = drawSpecial(c, o, RIDER, HORSE_PAL, 'perr', { scaleMul: 1.5 });
        const pulse = 0.6 + 0.4 * Math.sin(performance.now() / 380);
        block(c, g, facing, 18, 2, 2, 1, '#ff3020', 0.35 + 0.4 * pulse);
        if (o.reading) block(c, g, facing, 11, 5, 5, 5, '#e8e2d2');
        return;
      }
      default:
        if (STYLES[o.style]) { drawHumanoid(c, o); return; }
        vecPerson(c, o);
    }
  };

  ART.person = newPerson;
  ART.rider = (c, o) => newPerson(c, Object.assign({}, o, { style: 'perr' }));
  ART._vectorPerson = vecPerson;
})();
