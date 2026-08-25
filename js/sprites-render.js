(() => {
  const C = window.SPRITE_CORE;
  const CELL = 2;
  const LETTER_FALLBACK = { K: '#20263a', C: '#e8a090', W: '#ffffff', N: '#d8aab2' };
  const vecPerson = C.vecPerson;

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
      stroke() { c.stroke(); },
      fill() { c.fill(); },
    };
  }

  function drawGrid(c, rows, pal, cell) {
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      for (let q = 0; q < row.length; q++) {
        const ch = row[q];
        if (ch === '.') continue;
        const col = pal[ch] || LETTER_FALLBACK[ch];
        if (!col) continue;
        c.fillStyle = col;
        c.fillRect(q * cell, r * cell, cell, cell);
      }
    }
  }

  function spriteSpace(c, o, w, h) {
    const KX = 320 / 1280, KY = 156 / 720;
    c.save();
    c.setTransform(KX, 0, 0, KY, 0, 0);
    c.imageSmoothingEnabled = false;
    const ox = Math.round(o.x * KX - w / 2);
    const oy = Math.round(o.y * KY) - h + 1;
    c.translate(ox, oy);
    if ((o.facing || 1) < 0) { c.translate(w, 0); c.scale(-1, 1); }
    return { ox, oy, w, h };
  }

  function drawHumanoid(c, o) {
    const st = C.STYLES[o.style] || C.STYLES.toke;
    const now = performance.now() / 1000;

    c.fillStyle = 'rgba(10,12,20,0.28)';
    c.beginPath();
    c.ellipse(o.x, o.y + 2, 17 * (o.scale || 1), 5 * (o.scale || 1), 0, 0, Math.PI * 2);
    c.fill();

    let frame = 0;
    if (o.walking) frame = Math.floor(o.phase) % 4;
    const seq = [C.LEG_A, C.LEG_STAND, C.LEG_B, C.LEG_STAND];
    const legs = st.robe ? (o.walking && frame % 2 === 0 ? C.ROBE_A : C.ROBE_B) : seq[frame];
    const bob = o.walking && frame % 2 === 1 ? -CELL : 0;
    const h = (C.UPPER.length + legs.length) * CELL;
    const sp = spriteSpace(c, o, 16 * CELL, h);
    c.translate(0, bob);

    drawGrid(c, C.UPPER, st.pal, CELL);
    drawGrid(c, legs, st.pal, CELL);
    if (st.acc) st.acc(SnapCtx(c), 0, 0, CELL, null);

    if (o.sleeping) {
      c.fillStyle = st.pal.S;
      c.fillRect(3 * CELL, 5 * CELL, 2 * CELL, 2 * CELL);
      c.fillRect(10 * CELL, 5 * CELL, 2 * CELL, 2 * CELL);
    } else if (o.style !== 'rando') {
      const blink = ((now + (o.blinkSeed || 0)) % 3.4) < 0.12;
      if (blink) {
        c.fillStyle = st.pal.S;
        c.fillRect(3 * CELL, 5 * CELL, 2 * CELL, 2 * CELL);
        c.fillRect(10 * CELL, 5 * CELL, 2 * CELL, 2 * CELL);
      }
    }
    if (o.talking) {
      const open = Math.floor(now * 9) % 2 === 0;
      c.fillStyle = st.pal.M;
      c.fillRect(6.5 * CELL, 8 * CELL, 2 * CELL, open ? 1.4 * CELL : 0.7 * CELL);
    }
    c.restore();
    o._blit = { lx: sp.ox, ly: sp.oy, wPx: sp.w, hPx: sp.h };
  }

  function drawSpecial(c, o, rows, pal, key, opt, overlay) {
    const mul = (opt && opt.scaleMul) || 1;
    const cell = Math.max(1, Math.round(CELL * mul));
    const w = rows[0].length * cell, h = rows.length * cell;

    c.fillStyle = 'rgba(10,12,20,0.28)';
    c.beginPath();
    c.ellipse(o.x, o.y + 2, (rows[0].length / 2) * 0.8 * cell, 2.2 * cell, 0, 0, Math.PI * 2);
    c.fill();

    const sp = spriteSpace(c, o, w, h);
    if (opt && opt.overlayFirst && overlay) overlay(SnapCtx(c), cell, performance.now() / 1000);
    drawGrid(c, rows, pal, cell);
    if (overlay && !(opt && opt.overlayFirst)) overlay(SnapCtx(c), cell, performance.now() / 1000);
    c.restore();
    o._blit = { lx: sp.ox, ly: sp.oy, wPx: w, hPx: h };
  }

  const newPerson = (c, o) => {
    switch (o.style) {
      case 'goat':
        drawSpecial(c, o, C.GOAT, { B: '#f2ede0', D: '#d8d0bc', H: '#6d5c3a', K: '#1c1c1c', S: '#c98f9d' }, 'goat', { scaleMul: 1.5, overlayFirst: true }, (sc, cell) => {
          sc.strokeStyle = '#4a4438';
          sc.lineWidth = Math.max(1, cell * 0.3);
          sc.beginPath();
          for (let r = 0; r < C.GOAT.length; r++) {
            const row = C.GOAT[r];
            for (let q = 0; q < row.length; q++) {
              if (row[q] === '.') continue;
              sc.strokeRect(q * cell, r * cell, cell, cell);
            }
          }
          sc.stroke();
        });
        return;
      case 'glum':
        drawSpecial(c, o, C.GLUM, { P: '#cdd6da', L: '#5a4632', W: '#eef7ff', K: '#2a6ea8', M: '#4a3038', F: '#cdd6da' }, 'glum', null, (sc, cell, t) => {
          const blink = ((t + 1.3) % 4.1) < 0.15;
          if (blink) { sc.fillStyle = '#cdd6da'; sc.fillRect(3 * cell, 2 * cell, 6 * cell, 2 * cell); }
          if (o.talking) {
            const open = Math.floor(t * 9) % 2 === 0;
            sc.fillStyle = '#4a3038';
            sc.fillRect(7 * cell, (open ? 3.6 : 4) * cell, cell, open ? 1.2 * cell : 0.6 * cell);
          }
        });
        return;
      case 'troll':
        drawSpecial(c, o, C.TROLL, { B: '#8d94a4', D: '#69707f', L: '#9aa1b1', T: '#5f6674', W: '#e8ecf4', K: '#20263a', M: '#4a3038', S: '#8d94a4' }, 'troll', { scaleMul: 1.5 });
        return;
      case 'perr':
        drawSpecial(c, o, C.RIDER, C.HORSE_PAL, 'perr', { scaleMul: 1.5 }, (sc, cell, t) => {
          const pulse = 0.6 + 0.4 * Math.sin(t * 2.6);
          sc.fillStyle = 'rgba(255,48,32,' + (0.35 + 0.4 * pulse).toFixed(2) + ')';
          sc.fillRect(18 * cell, 2 * cell, 2 * cell, cell);
          if (o.reading) { sc.fillStyle = '#e8e2d2'; sc.fillRect(11 * cell, 5 * cell, 5 * cell, 5 * cell); }
        });
        return;
      default:
        if (C.STYLES[o.style]) { drawHumanoid(c, o); return; }
        vecPerson(c, o);
    }
  };

  ART.person = newPerson;
  ART.rider = (c, o) => newPerson(c, Object.assign({}, o, { style: 'perr' }));

  ART._canary = (c) => {
    c.save();
    drawGrid(c, C.UPPER, C.STYLES.toke.pal, CELL);
    drawGrid(c, C.LEG_STAND, C.STYLES.toke.pal, CELL);
    c.restore();
  };
})();
