(() => {
const { rr, ell, circle, poly, glow } = ART;
  const OUT = '#20263a';
  const T = () => performance.now() / 1000;
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
ART.person = person;
ART.rider = rider;
ART._vectorPerson = person;
function drawPerson(c, o) { return ART.person(c, o); }
})();