(() => {
  const vecPerson = ART.person;
  const vecRider = ART.rider;

  const UPPER = [
    '....HHHHHHH.....',
    '...HHHHHHHHH....',
    '...HHSSSSSHH....',
    '...HSSESSESH....',
    '...HSSSSSSSH....',
    '....SSSSSSS.....',
    '....SSSMSS......',
    '.....SSSSS......',
    '...AATTTTTAA....',
    '..SATTTTTTTAS...',
    '..SATTTTTTTAS...',
    '..SAUUUUUUUAS...',
    '...PTTTTTTP.....',
    '...PPPPPPPP.....',
    '...PPPPPPPP.....',
  ];
  const LEG_STAND = [
    '...PPP..PPP.....',
    '...PPP..PPP.....',
    '...PP....PP.....',
    '...PP....PP.....',
    '...FF....FF.....',
  ];
  const LEG_A = [
    '..PPPP..PPPP....',
    '..PPP....PPP....',
    '.PPP......PPP...',
    '.FF........FF...',
    '................',
  ];
  const LEG_B = [
    '...PPPP.PPP.....',
    '....PPP.PP......',
    '....PP...PP.....',
    '...FF....FF.....',
    '................',
  ];
  const ROBE_A = [
    '...PTTTTTTP.....',
    '..PTTTTTTTTP....',
    '..PTTTTTTTTP....',
    '..PTTTTTTTTP....',
    '.PTTTTTTTTTP....',
    '.PTTTTTTTTTP....',
    '.AAAAAAAAAAAP...',
    '.FF........FF...',
  ];
  const ROBE_B = [
    '...PTTTTTTP.....',
    '..PTTTTTTTTP....',
    '..PTTTTTTTTP....',
    '.PTTTTTTTTTP....',
    '.PTTTTTTTTTP....',
    '..PTTTTTTTTP....',
    '.AAAAAAAAAAAP...',
    '..FF......FF....',
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
        c.fillStyle = '#d9b25f';
        c.fillRect(x + 5 * s, y + 3 * s, 2 * s, 2 * s);
        c.fillRect(x + 9 * s, y + 3 * s, 2 * s, 2 * s);
        c.fillRect(x + 7 * s, y + 3.6 * s, 2 * s, 0.8 * s);
      } },
    rando:  { pal: { H: '#3a2a1a', S: '#e0b48c', E: '#101418', M: '#8a4a3a', T: '#2f4432', U: '#243428', A: '#3e5c40', P: '#232d26', F: '#2c2c24' },
      acc(c, x, y, s, o) {
        c.fillStyle = '#2f4432';
        c.fillRect(x + 3 * s, y, 10 * s, 3 * s);
        c.fillRect(x + 3 * s, y + 3 * s, 2 * s, 4 * s);
        c.fillRect(x + 11 * s, y + 3 * s, 2 * s, 4 * s);
        c.fillStyle = 'rgba(10,14,20,0.45)';
        c.fillRect(x + 5 * s, y + 3 * s, 6 * s, 4 * s);
        if (!o || !o.talking) {
          c.fillStyle = '#e0b48c';
          c.fillRect(x + 6 * s, y + 4.4 * s, 1.1 * s, 0.9 * s);
          c.fillRect(x + 9 * s, y + 4.4 * s, 1.1 * s, 0.9 * s);
        }
        c.strokeStyle = '#9aa2ac'; c.lineWidth = Math.max(1, s * 0.5);
        c.beginPath(); c.arc(x + 13.4 * s, y + 8.6 * s, 1.4 * s, 0, Math.PI * 2); c.stroke();
      } },
    dora:   { pal: { H: '#5b3a1e', S: '#f0c39c', E: '#20263a', M: '#a05a48', T: '#a8524a', U: '#7e3a38', A: '#efe6d2', P: '#5a3040', F: '#4a2f28' },
      acc(c, x, y, s) {
        c.fillStyle = '#5b3a1e';
        c.fillRect(x + 6 * s, y - 1.4 * s, 4 * s, 2.4 * s);
        c.fillStyle = '#efe6d2';
        c.fillRect(x + 6 * s, y + 9 * s, 4 * s, 5.4 * s);
        c.fillRect(x + 6 * s, y + 8 * s, 1 * s, 1.6 * s);
        c.fillRect(x + 9 * s, y + 8 * s, 1 * s, 1.6 * s);
        c.fillRect(x + 11.6 * s, y + 9 * s, 1.4 * s, 2.6 * s);
      } },
    halvor: { pal: { H: '#2a1f14', S: '#eab88f', E: '#20263a', M: '#a05a48', T: '#556079', U: '#3e4557', A: '#8a94ad', P: '#33384a', F: '#2c2c30' },
      acc(c, x, y, s) {
        c.fillStyle = 'rgba(120,70,60,0.55)';
        c.fillRect(x + 5 * s, y + 3 * s, 2 * s, 0.9 * s);
        c.fillRect(x + 9 * s, y + 3 * s, 2 * s, 0.9 * s);
        c.fillStyle = '#e05555';
        c.beginPath(); c.arc(x + 7.6 * s, y + 5 * s, 1.1 * s, 0, Math.PI * 2); c.fill();
      } },
    grim:   { pal: { H: '#ececec', S: '#e8b58c', E: '#20263a', M: '#a05a48', T: '#d7c25a', U: '#b09a42', A: '#f0e0a0', P: '#4a5568', F: '#3a3f4c' },
      acc(c, x, y, s) {
        c.fillStyle = '#ececec';
        c.fillRect(x + 4.4 * s, y + 5 * s, 7.2 * s, 1.4 * s);
        c.fillRect(x + 5 * s, y + 6.4 * s, 6 * s, 1.4 * s);
        c.fillRect(x + 5.6 * s, y + 7.8 * s, 4.8 * s, 1.2 * s);
        c.fillRect(x + 6.4 * s, y + 9 * s, 3.2 * s, 1 * s);
        c.fillStyle = '#3d5a99';
        for (let i = 0; i < 6; i++) {
          const wdt = (2 + i * 1.6) * s;
          c.fillRect(x + 8 * s - wdt / 2, y - (6 - i) * s, wdt, s + 0.2);
        }
        c.fillStyle = '#ffd24a';
        c.beginPath(); c.arc(x + 8 * s, y - 5.6 * s, 0.8 * s, 0, Math.PI * 2); c.fill();
      } },
    goblin: { pal: { H: '#4a6a34', S: '#7fb35a', E: '#16220f', M: '#33502a', T: '#4a4436', U: '#38332a', A: '#5a5446', P: '#3a352a', F: '#2c2820' }, scaleMul: 0.74,
      acc(c, x, y, s, o) {
        c.fillStyle = '#7fb35a';
        c.fillRect(x + 1.4 * s, y + 2.6 * s, 1.8 * s, 1 * s);
        c.fillRect(x + 12.8 * s, y + 2.6 * s, 1.8 * s, 1 * s);
        if (o && o.sleeping) {
          c.fillStyle = '#5d8442';
          c.fillRect(x + 5 * s, y + 3.2 * s, 2 * s, 0.9 * s);
          c.fillRect(x + 9 * s, y + 3.2 * s, 2 * s, 0.9 * s);
        }
      } },
    bjarne: { pal: { H: '#33331f', S: '#8fa06a', E: '#14180f', M: '#5a3a30', T: '#5c5044', U: '#463c32', A: '#6e6154', P: '#3f3a30', F: '#2e2a24' },
      acc(c, x, y, s) {
        c.fillStyle = '#ff7a1a';
        c.fillRect(x + 4 * s, y + 8 * s, 3 * s, 6 * s);
        c.fillRect(x + 9 * s, y + 8 * s, 3 * s, 6 * s);
        c.fillStyle = '#e8e8e8';
        c.fillRect(x + 4.6 * s, y + 10.4 * s, 1.8 * s, 1.2 * s);
        c.fillRect(x + 9.6 * s, y + 10.4 * s, 1.8 * s, 1.2 * s);
        c.fillStyle = '#fff';
        c.fillRect(x + 5 * s, y + 6.2 * s, 0.9 * s, 1.1 * s);
        c.fillRect(x + 10.1 * s, y + 6.2 * s, 0.9 * s, 1.1 * s);
        c.fillStyle = '#2a241c';
        c.fillRect(x + 4.6 * s, y + 2.6 * s, 2.4 * s, 0.8 * s);
        c.fillRect(x + 9 * s, y + 2.6 * s, 2.4 * s, 0.8 * s);
      } },
  };

  function drawGrid(c, rows, pal, x, yTop, cs, facing, yRowsFrom, yRowsTo) {
    const from = yRowsFrom || 0;
    const to = yRowsTo === undefined ? rows.length : yRowsTo;
    for (let r = from; r < to; r++) {
      const row = rows[r];
      for (let q = 0; q < row.length; q++) {
        const ch = row[facing < 0 ? row.length - 1 - q : q];
        if (ch === '.') continue;
        const col = pal[ch];
        if (!col) continue;
        c.fillStyle = col;
        c.fillRect(x + q * cs, yTop + (r - from) * cs, cs + 0.35, cs + 0.35);
      }
    }
  }

  function drawHumanoid(c, o) {
    const st = STYLES[o.style] || STYLES.toke;
    const cs = 4 * (o.scale || 1) * (st.scaleMul || 1);
    const x = o.x - 8 * cs;
    const yBase = o.y;
    const now = performance.now() / 1000;

    c.fillStyle = 'rgba(10,12,20,0.28)';
    c.beginPath();
    c.ellipse(o.x, yBase + 2, 8.4 * cs, 2.4 * cs, 0, 0, Math.PI * 2);
    c.fill();

    let frame = 0;
    if (o.walking) frame = Math.floor(o.phase) % 4;
    const seq = [LEG_A, LEG_STAND, LEG_B, LEG_STAND];
    const legs = st.robe ? (o.walking && frame % 2 === 0 ? ROBE_A : ROBE_B) : seq[frame];
    const bob = o.walking && frame % 2 === 1 ? -0.4 * cs : 0;
    const yTop = yBase - (UPPER.length + legs.length) * cs + bob;

    drawGrid(c, UPPER, st.pal, x, yTop, cs, o.facing);
    drawGrid(c, legs, st.pal, x, yTop + UPPER.length * cs, cs, o.facing);

    if (st.acc) st.acc(c, x, yTop, cs, o);

    if (o.sleeping) {
      c.fillStyle = st.pal.S;
      c.fillRect(x + 5 * cs, yTop + 3 * cs, 2 * cs, cs);
      c.fillRect(x + 9 * cs, yTop + 3 * cs, 2 * cs, cs);
    } else if (o.style !== 'rando') {
      const blink = ((now + (o.blinkSeed || 0)) % 3.4) < 0.12;
      if (blink) {
        c.fillStyle = st.pal.S;
        c.fillRect(x + 5 * cs, yTop + 3 * cs, 2 * cs, cs);
        c.fillRect(x + 9 * cs, yTop + 3 * cs, 2 * cs, cs);
      }
    }

    if (o.talking) {
      const open = Math.floor(now * 9) % 2 === 0;
      c.fillStyle = st.pal.M;
      c.fillRect(x + 7 * cs, yTop + (open ? 5.6 : 6) * cs, 2 * cs, open ? 1.4 * cs : 0.7 * cs);
    }
  }

  function drawSpecial(c, o, rows, pal, opt) {
    const mul = (opt && opt.scaleMul) || 1;
    const cs = 4 * (o.scale || 1) * mul;
    const w = rows[0].length;
    const x = o.x - (w / 2) * cs;
    const yTop = o.y - rows.length * cs;
    c.fillStyle = 'rgba(10,12,20,0.28)';
    c.beginPath();
    c.ellipse(o.x, o.y + 2, (w / 2) * 0.8 * cs, 2.2 * cs, 0, 0, Math.PI * 2);
    c.fill();
    drawGrid(c, rows, pal, x, yTop, cs, o.facing);
    return { x, yTop, cs };
  }

  const newPerson = (c, o) => {
    switch (o.style) {
      case 'goat': {
        const p = { B: '#efeadb', D: '#ded5c0', H: '#8a7a5a', K: '#222222', S: '#d8aab2' };
        const g = drawSpecial(c, o, GOAT, p);
        if (o.talking || true) {
          const chew = Math.floor(performance.now() / 260) % 2 === 0;
          c.fillStyle = '#c9988a';
          c.fillRect(g.x + (o.facing < 0 ? 12.4 : 13.4) * g.cs, g.yTop + 3.6 * g.cs + (chew ? 0.5 * g.cs : 0), 1.2 * g.cs, 0.8 * g.cs);
        }
        return;
      }
      case 'glum': {
        const p = { P: '#cdd6da', L: '#5a4632', W: '#eef7ff', K: '#2a6ea8', M: '#4a3038', F: '#cdd6da' };
        const g = drawSpecial(c, o, GLUM, p, { scaleMul: 1.05 });
        const blink = ((performance.now() / 1000 + 1.3) % 4.1) < 0.15;
        if (blink) {
          c.fillStyle = p.P;
          c.fillRect(g.x + 2.6 * g.cs, g.yTop + 2 * g.cs, 7 * g.cs, g.cs);
        }
        if (o.talking) {
          const open = Math.floor(performance.now() / 140) % 2 === 0;
          c.fillStyle = '#4a3038';
          c.fillRect(g.x + (o.facing < 0 ? 4.6 : 5.6) * g.cs, g.yTop + (open ? 3.9 : 4.2) * g.cs, 1.6 * g.cs, open ? 1.2 * g.cs : 0.6 * g.cs);
        }
        return;
      }
      case 'troll': {
        const breathe = Math.sin(performance.now() / 700) * 0.4;
        o = Object.assign({}, o, { scale: (o.scale || 1) + breathe * 0.01 });
        const p = { B: '#8d94a4', D: '#69707f', L: '#9aa1b1', T: '#5f6674', W: '#e8ecf4', K: '#20263a', M: '#4a3038', S: '#8d94a4' };
        drawSpecial(c, o, TROLL, p, { scaleMul: 1.15 });
        return;
      }
      case 'perr': {
        const g = drawSpecial(c, o, RIDER, HORSE_PAL, { scaleMul: 1.15 });
        const pulse = 0.6 + 0.4 * Math.sin(performance.now() / 380);
        c.save();
        c.globalAlpha = 0.35 + 0.4 * pulse;
        c.fillStyle = '#ff3020';
        c.fillRect(g.x + (o.facing < 0 ? 14.4 : 16.2) * g.cs, g.yTop + 2.1 * g.cs, 1.8 * g.cs, 0.9 * g.cs);
        c.restore();
        if (o.reading) {
          c.fillStyle = '#e8e2d2';
          c.fillRect(g.x + (o.facing < 0 ? 9 : 11) * g.cs, g.yTop + 5 * g.cs, 4.4 * g.cs, 5 * g.cs);
          c.strokeStyle = '#8a8574'; c.lineWidth = Math.max(1, g.cs * 0.2);
          c.strokeRect(g.x + (o.facing < 0 ? 9 : 11) * g.cs, g.yTop + 5 * g.cs, 4.4 * g.cs, 5 * g.cs);
        }
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
