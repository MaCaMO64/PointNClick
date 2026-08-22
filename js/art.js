const ART = (() => {
  const OUT = '#20263a';
  const T = () => performance.now() / 1000;

  function rr(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }
  function ell(c, x, y, rx, ry, fill, stroke, lw) {
    c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw || 2; c.stroke(); }
  }
  function circle(c, x, y, r, fill, stroke, lw) {
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2);
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw || 2; c.stroke(); }
  }
  function poly(c, pts, fill, stroke, lw) {
    c.beginPath();
    pts.forEach((p, i) => i === 0 ? c.moveTo(p[0], p[1]) : c.lineTo(p[0], p[1]));
    c.closePath();
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw || 2; c.stroke(); }
  }
  function vgrad(c, x0, y0, x1, y1, stops) {
    const g = c.createLinearGradient(x0, y0, x1, y1);
    stops.forEach(s => g.addColorStop(s[0], s[1]));
    return g;
  }
  function glow(c, x, y, r, colInner, alpha) {
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, colInner);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    c.save();
    c.globalAlpha = alpha === undefined ? 1 : alpha;
    c.fillStyle = g;
    c.fillRect(x - r, y - r, r * 2, r * 2);
    c.restore();
  }

  function cloud(c, x, y, s, col) {
    c.fillStyle = col || 'rgba(255,255,255,0.9)';
    ell(c, x, y, 46 * s, 16 * s, null); ell(c, x - 26 * s, y + 6 * s, 28 * s, 11 * s, col || 'rgba(255,255,255,0.9)');
    ell(c, x + 28 * s, y + 5 * s, 30 * s, 12 * s, col || 'rgba(255,255,255,0.9)');
    ell(c, x - 8 * s, y - 8 * s, 24 * s, 13 * s, col || 'rgba(255,255,255,0.9)');
  }
  function pine(c, x, baseY, h, col) {
    c.fillStyle = '#3a2a20';
    c.fillRect(x - h * 0.04, baseY - h * 0.15, h * 0.08, h * 0.15);
    c.fillStyle = col;
    for (let i = 0; i < 3; i++) {
      const ty = baseY - h * (0.12 + i * 0.27);
      const w = h * (0.34 - i * 0.08);
      poly(c, [[x - w, ty], [x + w, ty], [x, ty - h * 0.34]], col);
    }
  }
  function treeRound(c, x, baseY, s, leafA, leafB, trunkCol) {
    c.strokeStyle = trunkCol || '#5d4230';
    c.lineWidth = 8 * s;
    c.lineCap = 'round';
    c.beginPath(); c.moveTo(x, baseY); c.quadraticCurveTo(x - 4 * s, baseY - 30 * s, x, baseY - 52 * s); c.stroke();
    c.lineWidth = 5 * s;
    c.beginPath(); c.moveTo(x, baseY - 30 * s); c.lineTo(x + 18 * s, baseY - 42 * s); c.stroke();
    ell(c, x, baseY - 72 * s, 40 * s, 34 * s, leafA);
    ell(c, x - 22 * s, baseY - 58 * s, 24 * s, 20 * s, leafA);
    ell(c, x + 22 * s, baseY - 60 * s, 25 * s, 21 * s, leafA);
    ell(c, x - 6 * s, baseY - 80 * s, 22 * s, 17 * s, leafB);
  }
  function bush(c, x, y, s, col) {
    ell(c, x, y, 26 * s, 15 * s, col);
    ell(c, x - 14 * s, y - 4 * s, 15 * s, 11 * s, col);
    ell(c, x + 13 * s, y - 3 * s, 16 * s, 11 * s, col);
  }
  function grassTufts(c, pts, col) {
    c.strokeStyle = col; c.lineWidth = 2; c.lineCap = 'round';
    pts.forEach(([x, y]) => {
      c.beginPath();
      c.moveTo(x, y); c.lineTo(x - 3, y - 8);
      c.moveTo(x + 3, y); c.lineTo(x + 4, y - 9);
      c.moveTo(x, y); c.lineTo(x, y - 10);
      c.stroke();
    });
  }
  function flowerDots(c, arr) {
    arr.forEach(([x, y, col]) => {
      c.strokeStyle = '#4a7a3a'; c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - 7); c.stroke();
      circle(c, x, y - 9, 3, col);
      circle(c, x, y - 9, 1.2, '#fff8');
    });
  }
  function mountainLayer(c, baseY, amp, seed, col) {
    const pts = [];
    for (let x = -50; x <= 1330; x += 100) {
      const n = Math.sin((x + seed) * 0.008) * amp + Math.sin((x + seed) * 0.023) * amp * 0.45;
      pts.push([x, baseY - Math.abs(n)]);
    }
    poly(c, [...pts, [1340, baseY + 200], [-60, baseY + 200]], col);
  }
  function vignette(c, W, H, strength) {
    const g = c.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 0.95);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(10,8,16,' + strength + ')');
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);
  }
  function shadow(c, rx) { ell(c, 0, 3, rx, rx * 0.28, 'rgba(10,12,20,0.25)'); }

  const STYLE_CFG = {
    toke:   { h: 76, skin: '#f2c79a', hair: '#8a5330', shirt: '#c9a23b', shirt2: '#efe0bd', pants: '#6b4a2f', feet: 'big', hairStyle: 'messy' },
    bongo:  { h: 82, skin: '#eec39a', hair: '#d8d8d8', shirt: '#8c5548', pants: '#5d442e', feet: 'big', hairStyle: 'baldSide', glassesUp: true, robe: true },
    rando:  { h: 104, skin: '#e0b48c', hair: '#3a2a1a', shirt: '#2f4432', pants: '#232d26', hood: true, stubble: true, sword: true },
    dora:   { h: 96, skin: '#f0c39c', hair: '#5b3a1e', shirt: '#a8524a', pants: '#6b3040', bun: true, apron: true },
    halvor: { h: 92, skin: '#eab88f', hair: '#2a1f14', shirt: '#556079', pants: '#3a3f52', sway: true, redNose: true, droop: true },
    grim:   { h: 74, skin: '#e8b58c', hair: '#ececec', shirt: '#d7c25a', pants: '#4a5568', hat: 'pointed', beardLong: true, rod: true },
    bjarne: { h: 106, skin: '#8fa06a', hair: '#33331f', shirt: '#5c5044', pants: '#3f3a30', vest: true, tusks: true, clipboard: true },
    goblin: { h: 56, skin: '#7fb35a', hair: '#3a3a1a', shirt: '#4a4436', pants: '#3a352a', earsBig: true },
  };

  function face(c, o, hy, hr, cfg) {
    const t = T();
    const blink = ((t + o.blinkSeed) % 3.6) < 0.13;
    const ex = hr * 0.32;
    if (o.sleeping) {
      c.strokeStyle = OUT; c.lineWidth = 1.6;
      c.beginPath(); c.moveTo(-ex - 2, hy); c.lineTo(-ex + 2, hy);
      c.moveTo(ex - 2, hy); c.lineTo(ex + 2, hy); c.stroke();
    } else if (blink) {
      c.strokeStyle = '#20263a'; c.lineWidth = 1.8;
      c.beginPath();
      c.moveTo(-ex - 3, hy - 1); c.lineTo(-ex + 3, hy - 1);
      c.moveTo(ex - 3, hy - 1); c.lineTo(ex + 3, hy - 1);
      c.stroke();
    } else {
      circle(c, -ex, hy, hr * 0.16, '#fff');
      circle(c, ex, hy, hr * 0.16, '#fff');
      circle(c, -ex + hr * 0.05, hy, hr * 0.08, '#1c2230');
      circle(c, ex + hr * 0.05, hy, hr * 0.08, '#1c2230');
    }
    if (cfg.tusks) {
      poly(c, [[-hr * 0.28, hy + hr * 0.5], [-hr * 0.18, hy + hr * 0.5], [-hr * 0.24, hy + hr * 0.85]], '#fff');
      poly(c, [[hr * 0.28, hy + hr * 0.5], [hr * 0.18, hy + hr * 0.5], [hr * 0.24, hy + hr * 0.85]], '#fff');
    }
    const open = o.talking ? (Math.sin(t * 15) * 0.5 + 0.5) : 0;
    if (!o.sleeping) ell(c, hr * 0.05, hy + hr * 0.48, hr * 0.18, 1 + open * hr * 0.22, '#5a2c28');
    if (cfg.redNose) circle(c, hr * 0.02, hy + hr * 0.22, hr * 0.2, '#e05555');
    else ell(c, hr * 0.05, hy + hr * 0.18, 2, 2.6, 'rgba(0,0,0,0.18)');
    if (cfg.stubble) {
      c.fillStyle = 'rgba(30,25,20,0.35)';
      ell(c, hr * 0.05, hy + hr * 0.55, hr * 0.62, hr * 0.42, 'rgba(30,25,20,0.30)');
    }
    if (cfg.droop) {
      c.strokeStyle = 'rgba(40,30,25,0.6)'; c.lineWidth = 1.5;
      c.beginPath();
      c.moveTo(-ex - 3, hy - hr * 0.22); c.lineTo(-ex + 3, hy - hr * 0.16);
      c.moveTo(ex + 3, hy - hr * 0.22); c.lineTo(ex - 3, hy - hr * 0.16);
      c.stroke();
    }
  }

  function drawHair(c, cfg, hx, hy, hr, o) {
    const hs = cfg.hairStyle;
    if (hs === 'messy') {
      c.fillStyle = cfg.hair;
      c.beginPath();
      c.arc(hx, hy - hr * 0.15, hr * 1.02, Math.PI * 0.95, Math.PI * 2.05);
      c.fill();
      poly(c, [[hx - hr, hy - hr * 0.3], [hx - hr * 1.35, hy - hr * 0.7], [hx - hr * 0.8, hy - hr * 0.85]], cfg.hair);
      poly(c, [[hx + hr, hy - hr * 0.3], [hx + hr * 1.3, hy - hr * 0.75], [hx + hr * 0.75, hy - hr * 0.9]], cfg.hair);
      poly(c, [[hx - hr * 0.2, hy - hr * 0.98], [hx + hr * 0.1, hy - hr * 1.4], [hx + hr * 0.35, hy - hr * 0.95]], cfg.hair);
    } else if (hs === 'baldSide') {
      ell(c, hx - hr * 0.85, hy - hr * 0.1, hr * 0.34, hr * 0.5, cfg.hair);
      ell(c, hx + hr * 0.85, hy - hr * 0.1, hr * 0.34, hr * 0.5, cfg.hair);
      if (cfg.glassesUp) {
        c.strokeStyle = '#3a3f4a'; c.lineWidth = 2;
        circle(c, hx - hr * 0.35, hy - hr * 0.62, hr * 0.3, null, '#3a3f4a', 2);
        circle(c, hx + hr * 0.35, hy - hr * 0.62, hr * 0.3, null, '#3a3f4a', 2);
        c.beginPath(); c.moveTo(hx - hr * 0.05, hy - hr * 0.62); c.lineTo(hr * 0.05 + hx, hy - hr * 0.62); c.stroke();
      }
    } else if (cfg.bun) {
      circle(c, hx, hy - hr * 0.95, hr * 0.42, cfg.hair);
      c.fillStyle = cfg.hair;
      c.beginPath(); c.arc(hx, hy - hr * 0.1, hr * 1.03, Math.PI * 0.93, Math.PI * 2.07); c.fill();
    } else if (cfg.hat === 'pointed') {
      poly(c, [[hx - hr * 1.1, hy - hr * 0.35], [hx + hr * 1.1, hy - hr * 0.35], [hx + hr * 0.25, hy - hr * 3.4]], '#3d5a99');
      ell(c, hx, hy - hr * 0.32, hr * 1.15, hr * 0.28, '#3d5a99');
      circle(c, hx + hr * 0.28, hy - hr * 3.35, hr * 0.16, '#ffd24a');
      if (cfg.beardLong) {
        poly(c, [[hx - hr * 0.85, hy + hr * 0.15], [hx + hr * 0.85, hy + hr * 0.15], [hx, hy + hr * 2.6]], '#ececec');
      }
    } else if (cfg.hood) {
      c.fillStyle = cfg.shirt;
      c.beginPath();
      c.arc(hx, hy + hr * 0.1, hr * 1.28, Math.PI * 0.86, Math.PI * 2.14);
      c.quadraticCurveTo(hx + hr * 0.4, hy + hr * 0.95, hx - hr * 0.4, hy + hr * 0.95);
      c.closePath(); c.fill();
      c.strokeStyle = OUT; c.lineWidth = 2;
      c.stroke();
      ell(c, hx, hy + hr * 0.35, hr * 0.78, hr * 0.62, 'rgba(15,18,28,0.45)');
    }
  }

  function person(c, o) {
    const style = o.style || 'toke';
    if (style === 'goat') return drawGoat(c, o);
    if (style === 'glum') return drawGlum(c, o);
    if (style === 'troll') return drawTroll(c, o);

    const cfg = STYLE_CFG[style] || STYLE_CFG.toke;
    const h = cfg.h;
    const s = (o.scale || 1);
    const t = T();
    const walking = !!o.walking;

    c.save();
    c.translate(o.x, o.y);
    c.scale(s * (o.facing < 0 ? -1 : 1), s);
    shadow(c, h * 0.26);

    if (cfg.sway) c.rotate(Math.sin(t * 1.3) * 0.06);

    const bob = walking ? Math.abs(Math.cos(o.phase)) * h * 0.03 : Math.sin(t * 2 + h) * h * 0.012;
    const legLen = h * 0.40;
    const torsoH = h * 0.34;
    const headR = h * 0.145;
    const hipY = -legLen - bob;
    const sw = walking ? Math.sin(o.phase) : 0;

    if (!cfg.robe) {
      c.strokeStyle = cfg.pants; c.lineWidth = h * 0.09; c.lineCap = 'round';
      c.beginPath(); c.moveTo(-hipY * 0 + -headR * 0.3, hipY); c.lineTo(-sw * h * 0.14, -Math.max(0, sw) * 5); c.stroke();
      c.beginPath(); c.moveTo(headR * 0.3, hipY); c.lineTo(sw * h * 0.14, -Math.max(0, -sw) * 5); c.stroke();
      const footCol = cfg.feet === 'big' ? '#b9854e' : '#3a3129';
      const fr = cfg.feet === 'big' ? h * 0.075 : h * 0.055;
      ell(c, -sw * h * 0.14 - fr * 0.5, -fr * 0.4, fr * 1.4, fr, footCol, OUT, 1.5);
      ell(c, sw * h * 0.14 + fr * 0.5, -fr * 0.4, fr * 1.4, fr, footCol, OUT, 1.5);
      if (cfg.feet === 'big') {
        c.strokeStyle = '#8a5f37'; c.lineWidth = 1.2;
        [-1, 1].forEach(sd => {
          const fx = sd * sw * h * 0.14;
          c.beginPath();
          for (let i = -1; i <= 1; i++) { c.moveTo(fx + i * fr * 0.5, -fr * 0.9); c.lineTo(fx + i * fr * 0.5, -fr * 1.5); }
          c.stroke();
        });
      }
    }

    const shY = hipY - torsoH;
    c.fillStyle = cfg.shirt;
    c.strokeStyle = OUT; c.lineWidth = 2;
    if (cfg.robe) {
      poly(c, [[-h * 0.16, shY], [h * 0.16, shY], [h * 0.24, -2], [-h * 0.24, -2]], cfg.shirt, OUT, 2);
      c.strokeStyle = '#d9b25f'; c.lineWidth = 2;
      c.beginPath(); c.moveTo(-h * 0.19, -h * 0.1); c.lineTo(h * 0.19, -h * 0.1); c.stroke();
      ell(c, -h * 0.13, -3, h * 0.06, h * 0.035, '#5a4433', OUT, 1.5);
      ell(c, h * 0.13, -3, h * 0.06, h * 0.035, '#5a4433', OUT, 1.5);
    } else {
      rr(c, -h * 0.15, shY, h * 0.30, torsoH + 4, h * 0.10);
      c.fill(); c.stroke();
    }

    const armSw = sw * h * 0.10;
    c.strokeStyle = cfg.shirt2 && !cfg.robe ? cfg.shirt2 : cfg.skin;
    c.lineWidth = h * 0.065; c.lineCap = 'round';
    if (!cfg.robe) {
      c.beginPath(); c.moveTo(-h * 0.13, shY + h * 0.06); c.lineTo(-h * 0.13 - armSw, shY + torsoH * 0.65); c.stroke();
    }
    c.beginPath(); c.moveTo(h * 0.13, shY + h * 0.06); c.lineTo(h * 0.13 + armSw, shY + torsoH * 0.65); c.stroke();

    if (cfg.apron) {
      poly(c, [[-h * 0.10, shY + 4], [h * 0.10, shY + 4], [h * 0.13, hipY + 6], [-h * 0.13, hipY + 6]], '#efe6d2', '#c9b892', 1.5);
      c.strokeStyle = '#efe6d2'; c.lineWidth = h * 0.05;
      c.beginPath(); c.moveTo(h * 0.13 + armSw, shY + torsoH * 0.65); c.lineTo(h * 0.13 + armSw + h * 0.06, shY + torsoH * 0.45); c.stroke();
    }
    if (cfg.vest) {
      poly(c, [[-h * 0.15, shY], [-h * 0.04, shY], [-h * 0.05, shY + torsoH], [-h * 0.15, shY + torsoH]], '#ff7a1a', '#c95a10', 1.5);
      poly(c, [[h * 0.15, shY], [h * 0.04, shY], [h * 0.05, shY + torsoH], [h * 0.15, shY + torsoH]], '#ff7a1a', '#c95a10', 1.5);
      c.strokeStyle = '#e8e8e8'; c.lineWidth = 3;
      c.beginPath(); c.moveTo(-h * 0.10, shY + torsoH * 0.5); c.lineTo(-h * 0.045, shY + torsoH * 0.5);
      c.moveTo(h * 0.045, shY + torsoH * 0.5); c.lineTo(h * 0.10, shY + torsoH * 0.5); c.stroke();
    }
    if (cfg.sword) {
      c.strokeStyle = '#8a8f98'; c.lineWidth = 3;
      c.beginPath(); c.arc(h * 0.16, shY - 2, 4.5, 0, Math.PI * 2); c.stroke();
      c.beginPath(); c.moveTo(h * 0.16 - 6, shY - 2); c.lineTo(h * 0.16 + 6, shY - 2); c.stroke();
    }
    if (cfg.clipboard) {
      c.save();
      c.translate(h * 0.13 + armSw, shY + torsoH * 0.6);
      c.rotate(-0.3);
      rr(c, -8, -11, 16, 22, 2); c.fillStyle = '#caa06a'; c.fill(); c.strokeStyle = OUT; c.lineWidth = 1.5; c.stroke();
      rr(c, -6, -9, 12, 17, 1); c.fillStyle = '#f4efe2'; c.fill();
      c.strokeStyle = '#9aa'; c.lineWidth = 1;
      c.beginPath(); c.moveTo(-4, -5); c.lineTo(4, -5); c.moveTo(-4, -1); c.lineTo(4, -1); c.moveTo(-4, 3); c.lineTo(2, 3); c.stroke();
      c.restore();
    }
    if (cfg.rod) {
      c.strokeStyle = '#6b4a2f'; c.lineWidth = 3; c.lineCap = 'round';
      c.beginPath(); c.moveTo(h * 0.13 + armSw, shY + torsoH * 0.6);
      c.lineTo(h * 0.13 + armSw + h * 0.42, shY - h * 0.28); c.stroke();
      c.strokeStyle = 'rgba(230,230,230,0.75)'; c.lineWidth = 1;
      c.beginPath(); c.moveTo(h * 0.13 + armSw + h * 0.42, shY - h * 0.28); c.lineTo(h * 0.13 + armSw + h * 0.46, shY + h * 0.5); c.stroke();
      circle(c, h * 0.13 + armSw + h * 0.46, shY + h * 0.5, 3.4, '#e04444');
    }

    const hx = 0, hy = shY - headR * 0.9;
    circle(c, hx, hy, headR, cfg.skin, OUT, 2);
    face(c, o, hy + headR * 0.05, headR, cfg);
    drawHair(c, cfg, hx, hy, headR, o);
    c.restore();
  }

  function drawGoat(c, o) {
    const t = T(), s = (o.scale || 1);
    c.save();
    c.translate(o.x, o.y);
    c.scale(s * (o.facing < 0 ? -1 : 1), s);
    shadow(c, 30);
    c.strokeStyle = '#d8d3c8'; c.lineWidth = 5; c.lineCap = 'round';
    [[-16, -14, -18, 0], [-8, -14, -7, 0], [8, -14, 7, 0], [16, -14, 18, 0]].forEach(l => {
      c.beginPath(); c.moveTo(l[0], l[1]); c.lineTo(l[2], l[3]); c.stroke();
    });
    ell(c, 0, -26, 26, 16, '#efeadb', OUT, 2);
    c.save();
    c.translate(22, -40);
    c.rotate(Math.sin(t * 2.2) * 0.05);
    ell(c, 0, 0, 12, 9.5, '#efeadb', OUT, 2);
    ell(c, -9, -6, 5, 3.4, '#ded5c0', OUT, 1.4);
    c.strokeStyle = '#8a7a5a'; c.lineWidth = 2.4;
    c.beginPath(); c.arc(-3, -9, 6, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
    c.beginPath(); c.arc(3, -9, 6, Math.PI * 1.15, Math.PI * 1.95); c.stroke();
    circle(c, 6, -2, 1.7, '#222');
    ell(c, 10.5, 2, 2.6, 1.8, '#c9988a');
    poly(c, [[-11, 6], [-8, 6], [-10, 12]], '#ded5c0', OUT, 1.2);
    c.restore();
    poly(c, [[-25, -34], [-29, -42], [-22, -37]], '#ded5c0', OUT, 1.2);
    c.restore();
  }

  function drawGlum(c, o) {
    const t = T(), s = (o.scale || 1);
    c.save();
    c.translate(o.x, o.y);
    c.scale(s * (o.facing < 0 ? -1 : 1), s);
    shadow(c, 26);
    const breathe = Math.sin(t * 3) * 1.5;
    ell(c, -2, -20 + breathe * 0.3, 18, 24, '#cdd6da', OUT, 2);
    poly(c, [[-12, -8], [10, -8], [6, -1], [-8, -1]], '#5a4632', OUT, 1.5);
    c.strokeStyle = '#cdd6da'; c.lineWidth = 3; c.lineCap = 'round';
    c.beginPath(); c.moveTo(10, -18); c.quadraticCurveTo(22, -10, 24, -1); c.stroke();
    for (let i = 0; i < 3; i++) {
      c.beginPath(); c.moveTo(24, -2); c.lineTo(27 + i * 2.4, 2); c.stroke();
    }
    const hy = -44 + breathe;
    circle(c, 4, hy, 14, '#cdd6da', OUT, 2);
    const blink = ((t + 1.3) % 4.1) > 0.15;
    if (blink) {
      ell(c, 0, hy - 2, 5.5, 6.5, '#eef7ff', OUT, 1.4);
      ell(c, 11, hy - 2, 5.5, 6.5, '#eef7ff', OUT, 1.4);
      circle(c, 1.5, hy - 2, 2.2, '#2a6ea8');
      circle(c, 12.5, hy - 2, 2.2, '#2a6ea8');
    } else {
      c.strokeStyle = '#20263a'; c.lineWidth = 1.6;
      c.beginPath(); c.moveTo(-4, hy - 2); c.lineTo(4, hy - 2); c.moveTo(7, hy - 2); c.lineTo(15, hy - 2); c.stroke();
    }
    const open = o.talking ? (Math.sin(t * 15) * 0.5 + 0.5) : 0;
    ell(c, 8, hy + 7, 3.4, 1 + open * 3, '#4a3038');
    c.strokeStyle = '#aab4ba'; c.lineWidth = 1.4;
    [[-4, -12], [1, -14], [7, -13], [12, -10]].forEach(p => {
      c.beginPath(); c.moveTo(p[0], hy - 10); c.quadraticCurveTo(p[0] + p[1] * 0.2, hy + p[1], p[0] + p[1] * 0.35, hy + p[1] * 1.4); c.stroke();
    });
    c.restore();
  }

  function drawTroll(c, o) {
    const t = T(), s = (o.scale || 1);
    c.save();
    c.translate(o.x, o.y);
    c.scale(s * (o.facing < 0 ? -1 : 1), s);
    shadow(c, 52);
    const br = Math.sin(t * 1.4) * 2;
    c.strokeStyle = '#7d8494'; c.lineWidth = 20; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-26, -30); c.lineTo(-38, -4); c.stroke();
    c.beginPath(); c.moveTo(26, -30); c.lineTo(38, -4); c.stroke();
    ell(c, -38, -2, 13, 7, '#69707f', OUT, 2);
    ell(c, 38, -2, 13, 7, '#69707f', OUT, 2);
    ell(c, 0, -66 + br * 0.4, 50, 56, '#8d94a4', OUT, 2.5);
    ell(c, 0, -50 + br * 0.4, 32, 32, '#9aa1b1');
    c.strokeStyle = '#69707f'; c.lineWidth = 16;
    c.beginPath(); c.moveTo(-30, -84 + br); c.lineTo(-40, -46); c.stroke();
    c.beginPath(); c.moveTo(30, -84 + br); c.lineTo(40, -46); c.stroke();
    ell(c, -43, -42, 11, 7, '#7d8494', OUT, 2);
    ell(c, 43, -42, 11, 7, '#7d8494', OUT, 2);
    const hy = -124 + br;
    circle(c, 0, hy, 26, '#8d94a4', OUT, 2.5);
    const blink = ((t + 2) % 4.4) > 0.4;
    if (blink) {
      ell(c, -10, hy - 3, 4.5, 3, '#e8ecf4', OUT, 1.4);
      ell(c, 10, hy - 3, 4.5, 3, '#e8ecf4', OUT, 1.4);
      circle(c, -9, hy - 3, 1.8, '#1c2230');
      circle(c, 11, hy - 3, 1.8, '#1c2230');
    } else {
      c.strokeStyle = '#20263a'; c.lineWidth = 2;
      c.beginPath(); c.moveTo(-15, hy - 4); c.lineTo(-5, hy - 3); c.moveTo(15, hy - 4); c.lineTo(5, hy - 3); c.stroke();
    }
    const open = o.talking ? (Math.sin(t * 13) * 0.5 + 0.5) : 0;
    ell(c, 2, hy + 12, 7, 2 + open * 5, '#4a3038');
    poly(c, [[-14, hy - 22], [-8, hy - 34], [-2, hy - 21]], '#5f6674', OUT, 1.5);
    poly(c, [[2, hy - 21], [9, hy - 33], [15, hy - 21]], '#5f6674', OUT, 1.5);
    c.restore();
  }

  function rider(c, o) {
    const t = T(), s = (o.scale || 1);
    const reading = o.reading;
    c.save();
    c.translate(o.x, o.y);
    c.scale(s * (o.facing < 0 ? -1 : 1), s);
    ell(c, 0, 2, 64, 10, 'rgba(10,10,18,0.3)');
    c.strokeStyle = '#14161f'; c.lineWidth = 9; c.lineCap = 'round';
    [[-38, 0, -46, -26], [-26, 0, -20, -28], [24, 0, 18, -28], [38, 0, 46, -26]].forEach(l => {
      c.beginPath(); c.moveTo(l[0], l[1]); c.lineTo(l[2], l[3]); c.stroke();
    });
    ell(c, -48, -1, 9, 5, '#14161f');
    ell(c, 48, -1, 9, 5, '#14161f');
    const gallop = Math.sin(t * 6) * 2;
    ell(c, 0, -44 + gallop * 0.3, 52, 22, '#181b26', '#0c0e16', 2);
    c.strokeStyle = '#181b26'; c.lineWidth = 13;
    c.beginPath(); c.moveTo(38, -50); c.quadraticCurveTo(56, -66, 54, -84); c.stroke();
    ell(c, 58, -88, 15, 9, '#181b26', '#0c0e16', 2);
    ell(c, 68, -91, 4.5, 3, '#2a2f3f');
    c.strokeStyle = '#101220'; c.lineWidth = 4;
    c.beginPath(); c.moveTo(48, -96); c.lineTo(56, -78); c.stroke();
    c.beginPath(); c.moveTo(42, -94); c.lineTo(48, -76); c.stroke();
    c.strokeStyle = '#14161f'; c.lineWidth = 5;
    c.beginPath(); c.moveTo(-50, -50); c.quadraticCurveTo(-66, -44, -60, -30); c.stroke();
    const ry = -78;
    poly(c, [[-6, ry + 34], [26, ry + 30], [10, ry - 16], [-8, ry - 10]], '#101320', '#060810', 2);
    circle(c, 8, ry - 20, 15, '#0c0e18', '#04060c', 2);
    c.fillStyle = '#04060a';
    c.beginPath();
    c.arc(8, ry - 20, 15, Math.PI * 1.05, Math.PI * 1.95);
    c.quadraticCurveTo(14, ry - 6, 2, ry - 6);
    c.closePath(); c.fill();
    const pulse = 0.55 + 0.45 * Math.sin(t * 2.6);
    c.save();
    c.globalAlpha = pulse;
    glow(c, 13, ry - 22, 14, 'rgba(255,40,30,0.9)');
    c.restore();
    c.fillStyle = 'rgba(255,60,40,' + (0.7 + 0.3 * pulse) + ')';
    rr(c, 9, ry - 23.5, 9, 3, 1.5);
    c.fill();
    if (reading) {
      c.save();
      c.translate(24, ry + 6);
      c.rotate(-0.15);
      rr(c, -9, -12, 18, 24, 2);
      c.fillStyle = '#e8e2d2'; c.fill(); c.strokeStyle = '#8a8574'; c.lineWidth = 1.4; c.stroke();
      c.strokeStyle = '#9aa'; c.lineWidth = 1;
      c.beginPath(); c.moveTo(-6, -7); c.lineTo(6, -7); c.moveTo(-6, -3); c.lineTo(6, -3);
      c.moveTo(-6, 1); c.lineTo(3, 1); c.moveTo(-6, 5); c.lineTo(6, 5); c.stroke();
      c.restore();
    } else {
      c.strokeStyle = '#0c0e18'; c.lineWidth = 4;
      c.beginPath(); c.moveTo(20, ry + 8); c.quadraticCurveTo(34, ry, 44, ry + 4); c.stroke();
    }
    c.restore();
  }

  const ICONS = {
    stokk: (c) => {
      c.rotate(-0.6);
      c.strokeStyle = '#8a5a33'; c.lineWidth = 7; c.lineCap = 'round';
      c.beginPath(); c.moveTo(-18, 0); c.lineTo(18, 0); c.stroke();
      c.strokeStyle = '#6b4426'; c.lineWidth = 2;
      c.beginPath(); c.moveTo(-8, -2); c.lineTo(-2, 2); c.stroke();
    },
    eple: (c) => {
      circle(c, 0, 2, 12, '#d9403a', '#8a2018', 2);
      circle(c, -4, -2, 3, 'rgba(255,255,255,0.5)');
      c.strokeStyle = '#5d4230'; c.lineWidth = 2.5;
      c.beginPath(); c.moveTo(0, -9); c.quadraticCurveTo(2, -15, 5, -17); c.stroke();
      ell(c, 8, -15, 6, 3, '#5aa04e');
    },
    ring: (c) => {
      circle(c, 0, 0, 11, null, '#f4c84a', 6);
      circle(c, 0, 0, 11, null, '#c9992e', 2);
      c.strokeStyle = 'rgba(255,255,240,0.95)'; c.lineWidth = 2;
      c.beginPath(); c.arc(0, 0, 11, -1.2, -0.5); c.stroke();
      c.strokeStyle = '#fff'; c.lineWidth = 2;
      c.beginPath(); c.moveTo(13, -13); c.lineTo(17, -17); c.moveTo(15, -15); c.lineTo(15, -15); c.stroke();
    },
    mynter: (c) => {
      circle(c, -6, 4, 9, '#f4c84a', '#c9992e', 2);
      circle(c, 7, 5, 9, '#f4c84a', '#c9992e', 2);
      circle(c, 0, -4, 9, '#ffd76e', '#c9992e', 2);
      c.strokeStyle = '#fff2c8'; c.lineWidth = 2;
      c.beginPath(); c.arc(0, -4, 5, -1.4, -0.4); c.stroke();
    },
    'fløyte': (c) => {
      c.rotate(-0.35);
      rr(c, -18, -4, 34, 8, 4); c.fillStyle = '#b9c2cc'; c.fill(); c.strokeStyle = '#5d666e'; c.lineWidth = 1.6; c.stroke();
      rr(c, -22, -5, 8, 10, 2); c.fillStyle = '#8a939c'; c.fill();
      circle(c, -6, 0, 1.8, '#4a525a'); circle(c, 2, 0, 1.8, '#4a525a'); circle(c, 10, 0, 1.8, '#4a525a');
    },
    'pølse': (c) => {
      c.strokeStyle = '#c96a5a'; c.lineWidth = 9; c.lineCap = 'round';
      c.beginPath(); c.moveTo(-15, -2); c.quadraticCurveTo(0, 10, 15, -2); c.stroke();
      c.strokeStyle = '#a84e40'; c.lineWidth = 2;
      c.beginPath(); c.moveTo(-15, -6); c.lineTo(-15, 2); c.moveTo(15, -6); c.lineTo(15, 2); c.stroke();
    },
    'øl': (c) => {
      rr(c, -10, -8, 18, 24, 3); c.fillStyle = '#e8a83a'; c.fill(); c.strokeStyle = '#8a5a20'; c.lineWidth = 2; c.stroke();
      c.strokeStyle = '#8a5a20'; c.lineWidth = 3;
      c.beginPath(); c.arc(11, 3, 5, -Math.PI / 2, Math.PI / 2); c.stroke();
      circle(c, -6, -10, 4.5, '#fdf6e8'); circle(c, 1, -12, 5.5, '#fdf6e8'); circle(c, 7, -9, 4, '#fdf6e8');
      c.strokeStyle = '#fff'; c.lineWidth = 2;
      c.beginPath(); c.moveTo(-6, -3); c.lineTo(-6, 9); c.stroke();
    },
    skje: (c) => {
      c.rotate(0.5);
      c.strokeStyle = '#c9d2dc'; c.lineWidth = 4; c.lineCap = 'round';
      c.beginPath(); c.moveTo(0, 16); c.lineTo(0, -4); c.stroke();
      ell(c, 0, -11, 7, 9, '#dde5ee', '#8a939c', 1.6);
      c.strokeStyle = '#fff'; c.lineWidth = 1.6;
      c.beginPath(); c.arc(-2, -12, 4, 2.4, 4.2); c.stroke();
    },
    nøkkel: (c) => {
      c.rotate(-0.5);
      circle(c, -10, 0, 7, null, '#d4af37', 4);
      c.strokeStyle = '#d4af37'; c.lineWidth = 5; c.lineCap = 'round';
      c.beginPath(); c.moveTo(-3, 0); c.lineTo(15, 0); c.stroke();
      c.beginPath(); c.moveTo(10, 0); c.lineTo(10, 7); c.moveTo(15, 0); c.lineTo(15, 8); c.stroke();
    },
    'åre': (c) => {
      c.rotate(-0.7);
      c.strokeStyle = '#a8794a'; c.lineWidth = 5; c.lineCap = 'round';
      c.beginPath(); c.moveTo(-20, 0); c.lineTo(14, 0); c.stroke();
      ell(c, 19, 0, 8, 4.5, '#c9a06a', '#7a5a34', 1.6);
      c.strokeStyle = '#8a6238'; c.lineWidth = 2.4;
      c.beginPath(); c.arc(-20, 0, 4, 0, Math.PI * 2); c.stroke();
    },
    avis: (c) => {
      rr(c, -13, -16, 26, 32, 2); c.fillStyle = '#efe9d8'; c.fill(); c.strokeStyle = '#8a8574'; c.lineWidth = 1.6; c.stroke();
      c.fillStyle = '#4a4638'; c.fillRect(-10, -13, 20, 6);
      c.strokeStyle = '#9a958a'; c.lineWidth = 1.2;
      c.beginPath();
      c.moveTo(-10, -3); c.lineTo(10, -3); c.moveTo(-10, 1); c.lineTo(10, 1);
      c.moveTo(-10, 5); c.lineTo(4, 5); c.moveTo(-10, 9); c.lineTo(10, 9); c.moveTo(-10, 13); c.lineTo(2, 13);
      c.stroke();
    },
  };

  function title(c, W, H, t) {
    c.fillStyle = vgrad(c, 0, 0, 0, H, [[0, '#0d1030'], [0.5, '#1c2a50'], [1, '#2c3a60']]);
    c.fillRect(0, 0, W, H);
    let seedS = 7;
    for (let i = 0; i < 90; i++) {
      seedS = (seedS * 16807) % 2147483647;
      const sx = seedS % W, sy = (seedS >> 3) % (H * 0.6);
      const a = 0.35 + 0.55 * Math.abs(Math.sin(t * 1.4 + i));
      circle(c, sx, sy, i % 9 === 0 ? 1.8 : 1, 'rgba(255,255,240,' + a.toFixed(2) + ')');
    }
    circle(c, 1090, 110, 34, '#e8ecf4', 'rgba(200,210,230,0.6)', 3);
    ell(c, 1078, 102, 8, 8, 'rgba(180,190,210,0.5)');
    ell(c, 1102, 122, 6, 6, 'rgba(180,190,210,0.5)');
    mountainLayer(c, 500, 130, 300, '#161e3a');
    mountainLayer(c, 560, 100, 900, '#111731');
    const rg = glow(c, 640, 250, 170, 'rgba(255,214,90,0.35)');
    circle(c, 640, 250, 74, null, '#f4c84a', 22);
    circle(c, 640, 250, 74, null, 'rgba(120,80,10,0.55)', 4);
    c.save();
    c.strokeStyle = 'rgba(255,255,235,0.9)';
    c.lineWidth = 5;
    c.beginPath(); c.arc(640, 250, 74, t * 0.7 - 0.5, t * 0.7 + 0.35); c.stroke();
    c.restore();
    for (let x = -40; x < W + 60; x += 90) {
      pine(c, x + (x % 180 === 50 ? 30 : 0), 720, 150 + ((x * 7) % 90), '#0a0f20');
    }
    c.textAlign = 'center';
    c.font = 'bold 88px Georgia, serif';
    c.lineWidth = 8;
    c.strokeStyle = '#1a1408';
    c.strokeText('RING & WRONG', W / 2, 128);
    const lg = vgrad(c, 0, 60, 0, 150, [[0, '#ffe9a0'], [1, '#c9861f']]);
    c.fillStyle = lg;
    c.fillText('RING & WRONG', W / 2, 128);
    c.font = 'italic 22px Georgia, serif';
    c.fillStyle = '#cfd6f0';
    c.fillText('A thoroughly unnecessary hero\'s tale', W / 2, 172);
    c.font = '15px Verdana, sans-serif';
    c.fillStyle = 'rgba(210,215,235,0.55)';
    c.fillText('A point-and-click adventure in the spirit of LucasArts', W / 2, 396);
  }

  function introBg(c, W, H, t) {
    c.fillStyle = '#15101c';
    c.fillRect(0, 0, W, H);
    c.save();
    c.globalAlpha = 0.07;
    circle(c, W / 2, H / 2, 150, null, '#f4c84a', 26);
    c.restore();
    for (let i = 0; i < 26; i++) {
      const px = (i * 173 + t * 12 * (1 + (i % 3))) % W;
      const py = (i * 97 + t * 7) % H;
      circle(c, px, py, 1.4, 'rgba(220,205,160,0.25)');
    }
    c.strokeStyle = 'rgba(212,175,55,0.3)';
    c.lineWidth = 2;
    c.strokeRect(34, 34, W - 68, H - 68);
    c.strokeRect(42, 42, W - 84, H - 84);
    [[34, 34], [W - 34, 34], [34, H - 34], [W - 34, H - 34]].forEach(p => {
      c.save();
      c.translate(p[0], p[1]);
      c.rotate(Math.PI / 4);
      c.strokeRect(-7, -7, 14, 14);
      c.restore();
    });
    vignette(c, W, H, 0.55);
  }

  function endingBg(c, W, H, t, type) {
    if (type === 'good') {
      c.fillStyle = vgrad(c, 0, 0, 0, H, [[0, '#ffd9a0'], [0.45, '#ffb36b'], [1, '#ffe8c0']]);
      c.fillRect(0, 0, W, H);
      glow(c, 340, 260, 260, 'rgba(255,240,190,0.9)');
      circle(c, 340, 260, 52, '#fff3cf');
      mountainLayer(c, 420, 90, 500, '#c9a86a');
      c.fillStyle = vgrad(c, 0, 460, 0, H, [[0, '#8fc46a'], [1, '#5a9a48']]);
      c.fillRect(0, 460, W, H - 460);
      mountainLayer(c, 520, 60, 1200, '#6fae54');
      const ex = ((t * 70) % (W + 400)) - 200;
      const ey = 150 + Math.sin(t * 0.7) * 30;
      c.strokeStyle = '#3a3020'; c.lineWidth = 4; c.lineCap = 'round';
      const flap = Math.sin(t * 5) * 10;
      c.beginPath();
      c.moveTo(ex - 26, ey - flap); c.quadraticCurveTo(ex - 8, ey + 6, ex, ey);
      c.quadraticCurveTo(ex + 8, ey + 6, ex + 26, ey - flap);
      c.stroke();
      for (let i = 0; i < 24; i++) {
        const cx = (i * 211 + t * 40) % W;
        const cy = (i * 137 + t * 55) % H;
        c.save();
        c.translate(cx, cy);
        c.rotate(t * 2 + i);
        c.fillStyle = ['#e05a5a', '#e0c84a', '#5aa0e0', '#5ac87a'][i % 4];
        c.globalAlpha = 0.75;
        c.fillRect(-3, -2, 6, 4);
        c.restore();
      }
    } else {
      c.fillStyle = '#171018';
      c.fillRect(0, 0, W, H);
      const wg = vgrad(c, 380, 60, 380, 480, [[0, '#4a1420'], [1, '#7a2a24']]);
      c.fillStyle = wg;
      c.fillRect(360, 60, 560, 420);
      poly(c, [[640, 140], [740, 380], [540, 380]], '#2a0e14');
      glow(c, 640, 148, 60, 'rgba(255,110,40,0.9)');
      c.fillStyle = '#120a10';
      for (let y = 60; y < 480; y += 46) c.fillRect(350, y, 580, 22);
      c.fillStyle = '#241820';
      c.fillRect(280, 480, 720, 240);
      c.fillStyle = '#3a2832';
      c.fillRect(320, 460, 640, 26);
      for (let i = 0; i < 5; i++) {
        c.fillStyle = '#e8e0cc';
        c.save();
        c.translate(420 + i * 40, 448 - (i % 3) * 6);
        c.rotate(-0.06 * i);
        c.fillRect(0, 0, 34, 8);
        c.restore();
      }
      for (let i = 0; i < 14; i++) {
        const px = 380 + ((i * 163 + t * 30) % 520);
        const py = 80 + ((i * 211 + t * 60) % 400);
        c.save();
        c.translate(px, py);
        c.rotate(t * 3 + i);
        c.fillStyle = 'rgba(235,228,208,0.8)';
        c.fillRect(-5, -7, 10, 14);
        c.restore();
      }
      glow(c, 640, 300, 420, 'rgba(200,30,20,0.12)', 0.8);
    }
    vignette(c, W, H, 0.4);
  }

  return {
    person, rider, ICONS, title, introBg, endingBg,
    rr, ell, circle, poly, vgrad, glow, cloud, pine, treeRound, bush,
    grassTufts, flowerDots, mountainLayer, vignette,
  };
})();
window.ART = ART;
function drawPerson(c, o) { return ART.person(c, o); }
