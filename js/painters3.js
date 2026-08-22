(() => {
  const A = ART;
  const { rr, ell, circle, poly, vgrad, glow, pine, vignette } = A;
  const PX = window._PX;
  const { grain, dither, planks, stones, foliage, grassPatch, shadowBlob } = PX;

  function pathStrip(c, pts, w0, w1, fill) {
    const top = [], bot = [];
    pts.forEach(([x, y], i) => {
      const w = w0 + (w1 - w0) * (i / (pts.length - 1));
      top.push([x, y - w / 2]); bot.push([x, y + w / 2]);
    });
    poly(c, [...top, ...bot.reverse()], fill);
  }

  function reeds(c, x, baseY) {
    c.strokeStyle = '#3f6b34'; c.lineWidth = 2.4; c.lineCap = 'round';
    for (let i = 0; i < 7; i++) {
      const rx = x + i * 7 - 20;
      const h = 34 + ((i * 37) % 28);
      c.beginPath(); c.moveTo(rx, baseY);
      c.quadraticCurveTo(rx + 4, baseY - h * 0.6, rx + 8, baseY - h);
      c.stroke();
      if (i % 2 === 0) ell(c, rx + 8, baseY - h - 4, 3.4, 8.5, '#6d5030');
    }
  }

  function shroom(c, mx, my, s) {
    glow(c, mx, my - 6 * s, 18 * s, 'rgba(110,225,255,0.35)');
    c.fillStyle = '#dfe8ee'; c.fillRect(mx - 2 * s, my - 8 * s, 4 * s, 8 * s);
    ell(c, mx, my - 9 * s, 7 * s, 4.5 * s, '#6fe3ff', '#3a9ec0', 1.5);
  }

  window.PAINTERS.elv = (c, W, H) => {
    dither(c, 0, 0, W, 160, '#8fd0ea', '#a9dcf0', 10);
    dither(c, 0, 160, W, 100, '#a9dcf0', '#eafaf1', 10);
    glow(c, 1120, 84, 130, 'rgba(255,250,214,0.85)');
    circle(c, 1120, 84, 34, '#fffbe0');
    cloud(c, 230, 84, 1.05, 'rgba(255,255,255,0.94)');
    cloud(c, 600, 56, 0.85, 'rgba(255,255,255,0.88)');
    cloud(c, 900, 118, 0.7, 'rgba(255,255,255,0.8)');

    c.fillStyle = '#83ba62'; c.fillRect(0, 236, W, 26);
    grain(c, 0, 236, W, 24, ['#74aa55', '#90c472'], 200, 401);
    for (let i = 0; i < 9; i++) pine(c, 60 + i * 145, 258, 26 + (i % 3) * 8, '#5a9a48');

    const riv = c.createLinearGradient(0, 258, 0, 438);
    riv.addColorStop(0, '#66c0d4'); riv.addColorStop(0.5, '#4aa2bd'); riv.addColorStop(1, '#337f9b');
    c.fillStyle = riv; c.fillRect(0, 258, W, 180);
    grain(c, 0, 258, W, 180, ['rgba(255,255,255,0.14)', 'rgba(30,80,110,0.16)', 'rgba(140,220,240,0.12)'], 420, 402);
    c.fillStyle = '#d9c99a'; c.fillRect(0, 252, W, 7);
    c.fillStyle = '#bfa87c'; c.fillRect(0, 252, W, 3);

    [[505], [625], [745]].forEach(px => {
      const x = px[0];
      shadowBlob(c, x, 452, 14, 4);
      planks(c, x - 5, 392, 10, 58, 10, false, ['#6e4c2c', '#7d5733'], 400 + x);
      c.fillStyle = 'rgba(20,60,75,0.3)'; c.fillRect(x - 4, 450, 8, 20);
    });
    poly(c, [[470, 388], [800, 378], [812, 398], [482, 410]], '#96703f');
    grain(c, 480, 380, 330, 28, ['#84613a', '#a37b48'], 260, 403);
    c.fillStyle = '#5e4020'; c.fillRect(482, 408, 330, 8);
    c.fillStyle = 'rgba(255,230,190,0.25)'; c.fillRect(482, 408, 330, 2);
    rr(c, 768, 364, 14, 40, 3); c.fillStyle = '#5d442e'; c.fill();
    c.strokeStyle = '#33220f'; c.lineWidth = 2.6; c.stroke();
    c.strokeStyle = '#cdb184'; c.lineWidth = 3;
    c.beginPath(); c.arc(775, 404, 8, 0, Math.PI * 1.65); c.stroke();

    shadowBlob(c, 240, 544, 108, 12);
    planks(c, 140, 360, 200, 180, 26, true, ['#7d5533', '#6e4a2c', '#8a6038'], 404);
    rr(c, 136, 356, 208, 10, 3); c.fillStyle = '#54371c'; c.fill();
    poly(c, [[114, 368], [366, 368], [240, 290]], '#8a4a3a');
    grain(c, 150, 310, 180, 54, ['#7a4030', '#9c5a48'], 120, 405);
    for (let row = 0; row < 3; row++) {
      c.strokeStyle = 'rgba(50,22,14,0.5)'; c.lineWidth = 2;
      c.beginPath(); c.moveTo(128 + row * 12, 350 - row * 20); c.lineTo(352 - row * 12, 350 - row * 20); c.stroke();
    }
    c.fillStyle = 'rgba(255,210,170,0.15)';
    poly(c, [[240, 290], [362, 368], [300, 368]], null);
    c.beginPath(); c.moveTo(240, 292); c.lineTo(360, 366); c.lineTo(300, 366); c.closePath(); c.fill();
    rr(c, 194, 438, 92, 102, 3); c.fillStyle = '#4e3218'; c.fill();
    c.strokeStyle = '#2c1a0c'; c.lineWidth = 3.4; c.stroke();
    grain(c, 196, 440, 88, 98, ['#5d3c22', '#6e4a2a'], 120, 406);
    circle(c, 240, 494, 9, '#d4af37', '#8a6a20', 2.6);
    circle(c, 240, 494, 3.4, '#8a6a20');
    circle(c, 310, 470, 15, '#7a5230');
    circle(c, 310, 470, 12.5, '#ffd76e');
    c.strokeStyle = '#7a5230'; c.lineWidth = 2.4;
    c.beginPath(); c.moveTo(297, 470); c.lineTo(323, 470); c.moveTo(310, 457); c.lineTo(310, 483); c.stroke();
    rr(c, 154, 398, 172, 40, 4); c.fillStyle = '#caa06a'; c.fill();
    c.strokeStyle = '#5d3c22'; c.lineWidth = 3.4; c.stroke();
    rr(c, 158, 402, 164, 32, 3); c.fillStyle = '#b98f58'; c.fill();
    c.font = 'bold 17px Verdana'; c.textAlign = 'center'; c.fillStyle = '#4a3018';
    c.fillText('BOATHOUSE', 240, 424);

    reeds(c, 430, 476); reeds(c, 905, 470); reeds(c, 1160, 464);
    shadowBlob(c, 522, 484, 24, 6);
    ell(c, 522, 474, 21, 12, '#7d7468', '#46403a', 2.6);
    foliage(c, 514, 464, 11, ['#5a9a48', '#4c8f3e'], 12, 407);
    poly(c, [[1046, 496], [1082, 496], [1074, 524], [1054, 524]], '#5a6a7a', '#333d49', 2.6);
    grain(c, 1046, 496, 36, 28, ['rgba(255,255,255,0.15)', 'rgba(0,0,0,0.25)'], 40, 408);
    c.strokeStyle = '#333d49'; c.lineWidth = 2.6;
    c.beginPath(); c.arc(1064, 496, 14, Math.PI, 0); c.stroke();
    poly(c, [[1068, 494], [1078, 478], [1084, 494]], '#8ab0c0', '#54707e', 1.8);

    pathStrip(c, [[0, 542], [60, 534], [122, 528]], 52, 42, '#c2ab80');
    stones(c, 0, 520, 120, 46, 16, ['#b3946a', '#9c7f57'], 409);
    grassPatch(c, 340, 470, 200, 40, 50, ['#3f6b34', '#4c7a3e', '#365e2c'], 410);
    vignette(c, W, H, 0.2);
  };

  window.PAINTERS.skog = (c, W, H) => {
    dither(c, 0, 0, W, H, '#0d1524', '#182a44', 16);
    let sd = 9;
    for (let i = 0; i < 14; i++) {
      sd = (sd * 16807) % 2147483647;
      circle(c, sd % W, (sd >> 3) % 120, 1.4, 'rgba(255,255,240,' + (0.3 + (sd % 30) / 100).toFixed(2) + ')');
    }
    c.fillStyle = '#070c16';
    for (let x = -40; x < W + 80; x += 105) {
      circle(c, x, 24, 95);
      circle(c, x + 55, 6, 72);
    }
    grain(c, 0, 0, W, 120, ['rgba(20,34,58,0.5)', 'rgba(4,8,14,0.6)'], 300, 411);
    poly(c, [[290, 0], [366, 0], [540, 570], [436, 570]], 'rgba(165,195,255,0.05)');
    poly(c, [[876, 0], [938, 0], [1078, 500], [988, 500]], 'rgba(165,195,255,0.04)');

    [[80, 26], [152, 30], [222, 24], [1046, 28], [1118, 26], [1192, 30]].forEach(tk => {
      c.fillStyle = '#121e32';
      c.beginPath();
      c.moveTo(tk[0] - tk[1] / 2, 0); c.lineTo(tk[0] + tk[1] / 2, 0);
      c.lineTo(tk[0] + tk[1] / 2 + 7, 570); c.lineTo(tk[0] - tk[1] / 2 - 7, 570);
      c.closePath(); c.fill();
      grain(c, tk[0] - tk[1] / 2, 0, tk[1] + 12, 570, ['rgba(30,48,76,0.4)', 'rgba(4,8,16,0.5)'], 40, tk[0]);
    });
    c.fillStyle = '#1a2740';
    c.beginPath(); c.moveTo(24, 0); c.lineTo(106, 0); c.lineTo(128, 570); c.lineTo(0, 570); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(1172, 0); c.lineTo(1254, 0); c.lineTo(1280, 570); c.lineTo(1152, 570); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(8,12,22,0.8)'; c.lineWidth = 3.4;
    c.beginPath(); c.moveTo(58, 60); c.lineTo(70, 560); c.moveTo(1206, 78); c.lineTo(1194, 560); c.stroke();

    c.fillStyle = vgrad(c, 0, 468, 0, H, [[0, '#20304a'], [1, '#131e34']]);
    c.fillRect(0, 468, W, H - 468);
    grain(c, 0, 468, W, H - 468, ['#1a2a42', '#253854', '#16223a'], 500, 412);
    c.strokeStyle = 'rgba(8,12,22,0.85)'; c.lineWidth = 4.4;
    c.beginPath(); c.moveTo(176, 542); c.quadraticCurveTo(258, 528, 332, 544);
    c.moveTo(694, 554); c.quadraticCurveTo(766, 542, 828, 554);
    c.moveTo(430, 560); c.quadraticCurveTo(500, 550, 560, 560); c.stroke();

    poly(c, [[840, 470], [1140, 470], [1140, 570], [840, 570]], '#04060a');
    c.fillStyle = vgrad(c, 0, 470, 0, 570, [[0, '#090d16'], [1, '#020308']]);
    c.beginPath(); c.moveTo(840, 470); c.lineTo(1140, 470); c.lineTo(1140, 570); c.lineTo(840, 570); c.closePath(); c.fill();
    c.strokeStyle = '#3a4a66'; c.lineWidth = 3.4;
    c.beginPath(); c.moveTo(840, 470); c.lineTo(840, 570); c.moveTo(1140, 470); c.lineTo(1140, 570); c.stroke();
    c.fillStyle = '#332a3a'; c.fillRect(874, 470, 24, 100);
    c.fillStyle = '#2a2230'; c.fillRect(1080, 470, 24, 100);
    grain(c, 874, 470, 24, 100, ['rgba(70,56,80,0.4)', 'rgba(10,6,14,0.5)'], 40, 413);

    c.lineCap = 'round';
    c.strokeStyle = '#3c4254'; c.lineWidth = 31;
    c.beginPath(); c.moveTo(824, 470); c.quadraticCurveTo(985, 428, 1152, 470); c.stroke();
    c.strokeStyle = '#697082'; c.lineWidth = 24;
    c.beginPath(); c.moveTo(824, 465); c.quadraticCurveTo(985, 423, 1152, 465); c.stroke();
    c.strokeStyle = '#7d8496'; c.lineWidth = 7;
    c.beginPath(); c.moveTo(824, 450); c.quadraticCurveTo(985, 408, 1152, 450); c.stroke();
    c.strokeStyle = '#4e5468'; c.lineWidth = 2.2;
    for (let i = 0; i <= 8; i++) {
      const bx = 838 + i * 40;
      const by = 465 - Math.sin((i / 8) * Math.PI) * 41;
      c.beginPath(); c.moveTo(bx, by - 12); c.lineTo(bx, by + 12); c.stroke();
    }
    ell(c, 940, 448, 17, 6, 'rgba(86,148,68,0.6)');
    ell(c, 1062, 458, 13, 5, 'rgba(86,148,68,0.5)');

    c.fillStyle = '#332a40'; c.fillRect(792, 396, 8, 88);
    grain(c, 792, 396, 8, 88, ['rgba(70,56,80,0.5)', 'rgba(10,8,14,0.5)'], 30, 414);
    c.fillRect(792, 396, 32, 7);
    rr(c, 810, 400, 24, 27, 3); c.fillStyle = '#232c3c'; c.fill();
    c.strokeStyle = '#12161f'; c.lineWidth = 2.8; c.stroke();
    poly(c, [[808, 400], [836, 400], [832, 393], [812, 393]], '#12161f');

    shadowBlob(c, 300, 534, 30, 7);
    [[284], [300], [316]].forEach((sxx, i) => circle(c, sxx[0] + (i - 1) * 14, 530 + (i % 2) * 3, 7, '#4e5468', '#33384a', 2.2));
    c.save();
    c.translate(300, 518);
    c.rotate(-0.5); rr(c, -27, -6.4, 54, 13, 6.4); c.fillStyle = '#4a3018'; c.fill();
    grain(c, -27, -6.4, 54, 13, ['rgba(20,10,4,0.4)', 'rgba(150,100,50,0.3)'], 24, 415);
    c.rotate(1.0); rr(c, -27, -6.4, 54, 13, 6.4); c.fillStyle = '#3a2814'; c.fill();
    c.restore();
    circle(c, 300, 512, 11, '#170f08');
    grain(c, 286, 502, 28, 20, ['rgba(255,120,40,0.3)', 'rgba(255,200,90,0.2)'], 40, 416);
    glow(c, 300, 514, 84, 'rgba(255,150,50,0.26)');

    shroom(c, 352, 560, 1); shroom(c, 344, 563, 0.7); shroom(c, 1086, 560, 0.9); shroom(c, 770, 565, 0.75);

    c.fillStyle = '#131d30';
    c.beginPath(); c.moveTo(552, 570); c.lineTo(564, 238); c.lineTo(636, 238); c.lineTo(650, 570); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(6,10,20,0.85)'; c.lineWidth = 3.4;
    c.beginPath(); c.moveTo(576, 96); c.lineTo(586, 566); c.moveTo(620, 88); c.lineTo(614, 566); c.stroke();
    ell(c, 598, 432, 18, 25, '#080d18', '#04070e', 3.4);
    grain(c, 566, 250, 70, 300, ['rgba(30,46,74,0.35)', 'rgba(4,8,14,0.5)'], 160, 417);
    c.strokeStyle = '#131d30'; c.lineWidth = 8; c.lineCap = 'round';
    c.beginPath(); c.moveTo(594, 258); c.quadraticCurveTo(540, 218, 496, 192); c.stroke();
    ell(c, 200, 178, 13, 17, '#3a3040', '#221c2a', 2.4);
    poly(c, [[192, 163], [196.5, 154], [201, 163]], '#3a3040');
    poly(c, [[201, 163], [206, 154], [211, 163]], '#3a3040');
    glow(c, 195, 173, 7, 'rgba(255,210,74,0.35)');
    glow(c, 205, 173, 7, 'rgba(255,210,74,0.35)');
    circle(c, 195, 173, 2.8, '#ffd24a');
    circle(c, 205, 173, 2.8, '#ffd24a');
    circle(c, 200, 186, 3, 'rgba(230,200,160,0.35)');
    vignette(c, W, H, 0.46);
  };

  window.PAINTERS.vulkan = (c, W, H) => {
    dither(c, 0, 0, W, 200, '#170810', '#2a0f1a', 12);
    dither(c, 0, 200, W, 160, '#2a0f1a', '#4a181f', 10);
    dither(c, 0, 360, W, 120, '#4a181f', '#7a2f26', 8);

    poly(c, [[70, 486], [330, 172], [434, 298], [566, 486]], '#1f0c14');
    grain(c, 120, 220, 380, 240, ['#2a1420', '#170a10'], 300, 501);
    poly(c, [[296, 202], [364, 202], [331, 250]], '#2a0f1a');
    c.strokeStyle = '#ff7a3a'; c.lineWidth = 5.4; c.lineCap = 'round';
    c.beginPath(); c.moveTo(296, 204); c.quadraticCurveTo(331, 220, 366, 204); c.stroke();
    glow(c, 331, 212, 64, 'rgba(255,120,50,0.5)');
    c.strokeStyle = 'rgba(168,58,26,0.7)'; c.lineWidth = 3.4;
    c.beginPath();
    c.moveTo(330, 228); c.lineTo(308, 330);
    c.moveTo(335, 230); c.lineTo(360, 342);
    c.moveTo(321, 300); c.lineTo(280, 402);
    c.moveTo(344, 320); c.lineTo(372, 408);
    c.stroke();

    poly(c, [[578, 486], [640, 258], [902, 228], [1280, 248], [1280, 486]], '#241420');
    grain(c, 620, 260, 660, 210, ['#2e1a26', '#1c101a', '#38202c'], 400, 502);
    poly(c, [[640, 258], [902, 228], [880, 300], [700, 332]], '#301c2a');
    poly(c, [[902, 228], [1280, 248], [1280, 334], [918, 312]], '#1c101a');
    c.strokeStyle = 'rgba(10,6,12,0.7)'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(700, 332); c.lineTo(720, 486); c.moveTo(918, 312); c.lineTo(930, 486); c.stroke();

    circle(c, 940, 398, 97, '#120c10');
    circle(c, 940, 398, 84, '#333a46', '#3c414c', 12);
    grain(c, 860, 320, 160, 156, ['rgba(70,78,92,0.3)', 'rgba(20,24,30,0.35)'], 200, 503);
    c.strokeStyle = 'rgba(14,18,24,0.75)'; c.lineWidth = 2.6;
    c.beginPath(); c.moveTo(940, 318); c.lineTo(940, 478); c.moveTo(860, 398); c.lineTo(1020, 398); c.stroke();
    for (let i = 0; i < 14; i++) {
      const ang = (i / 14) * Math.PI * 2;
      circle(c, 940 + Math.cos(ang) * 85, 398 + Math.sin(ang) * 85, 3.8, '#5a6270');
      circle(c, 940 + Math.cos(ang) * 85, 397 + Math.sin(ang) * 85, 1.4, 'rgba(255,255,255,0.3)');
    }
    poly(c, [[916, 364], [964, 364], [950, 378], [930, 378]], '#0a0c10');
    circle(c, 940, 371, 2.8, '#b02c1a');
    rr(c, 901, 428, 78, 28, 4); c.fillStyle = '#222831'; c.fill();
    c.strokeStyle = '#454e5c'; c.lineWidth = 2.4; c.stroke();
    c.strokeStyle = '#454e5c'; c.lineWidth = 3.6;
    for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(911 + i * 14.6, 430); c.lineTo(911 + i * 14.6, 454); c.stroke(); }

    c.strokeStyle = '#3a2a1a'; c.lineWidth = 2.6;
    c.beginPath(); c.moveTo(902, 316); c.lineTo(902, 330); c.moveTo(978, 316); c.lineTo(978, 330); c.stroke();
    c.save();
    c.translate(940, 336); c.rotate(-0.03);
    c.strokeStyle = '#3a2a1a'; c.lineWidth = 2.6;
    c.beginPath(); c.moveTo(-38, -22); c.lineTo(-38, -8); c.moveTo(38, -22); c.lineTo(38, -8); c.stroke();
    rr(c, -73, -9, 146, 54, 5); c.fillStyle = '#c9a86a'; c.fill();
    c.strokeStyle = '#5d3c22'; c.lineWidth = 3.4; c.stroke();
    rr(c, -67, -5, 134, 46, 3); c.fillStyle = 'rgba(0,0,0,0.09)'; c.fill();
    grain(c, -66, -4, 132, 44, ['rgba(120,90,50,0.25)', 'rgba(255,235,190,0.2)'], 90, 504);
    c.font = 'bold 15px Verdana'; c.textAlign = 'center'; c.fillStyle = '#4a3018';
    c.fillText('CLOSED FOR', 0, 12); c.fillText('MAINTENANCE', 0, 31);
    c.font = '9px Verdana';
    c.fillText('(reopens next age)', 0, 41);
    c.restore();

    rr(c, 650, 442, 141, 13, 3); c.fillStyle = '#6b4550'; c.fill();
    c.strokeStyle = '#33202a'; c.lineWidth = 2.4; c.stroke();
    planks(c, 662, 456, 116, 56, 20, true, ['#4a3038', '#3e2830'], 505);
    for (let i = 0; i < 3; i++) {
      const pxx = 676 + i * 34;
      for (let j = 0; j < 3; j++) {
        c.fillStyle = '#e8e0cc';
        c.fillRect(pxx + j, 444 - j * 4 - 9, 24 - j * 2, 5);
        c.strokeStyle = '#a89a80'; c.lineWidth = 1.2; c.strokeRect(pxx + j, 444 - j * 4 - 9, 24 - j * 2, 5);
      }
    }
    rr(c, 740, 433, 17, 11, 2); c.fillStyle = '#b03a3a'; c.fill();
    c.strokeStyle = '#3a2a1a'; c.lineWidth = 1.6; c.stroke();

    const posts = [[600, 522], [632, 542], [668, 552]];
    posts.forEach(p => {
      c.strokeStyle = '#33251c'; c.lineWidth = 3.4;
      c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(p[0], p[1] - 27); c.stroke();
      circle(c, p[0], p[1] - 29, 3.2, '#33251c');
    });
    c.strokeStyle = '#b03a3a'; c.lineWidth = 3.2;
    c.beginPath(); c.moveTo(600, 497); c.quadraticCurveTo(616, 524, 632, 516); c.stroke();
    c.beginPath(); c.moveTo(632, 516); c.quadraticCurveTo(650, 544, 668, 526); c.stroke();

    c.fillStyle = '#33251c'; c.fillRect(180, 460, 8, 74);
    grain(c, 180, 460, 8, 74, ['#2c2018', '#443428'], 24, 506);
    rr(c, 150, 412, 68, 48, 4); c.fillStyle = '#d9c99a'; c.fill();
    c.strokeStyle = '#5d4c30'; c.lineWidth = 2.8; c.stroke();
    rr(c, 155, 417, 58, 38, 2); c.fillStyle = 'rgba(0,0,0,0.08)'; c.fill();
    circle(c, 184, 431, 10, '#f4efe2');
    circle(c, 181, 430, 2, '#2a2a2a'); circle(c, 187, 430, 2, '#2a2a2a');
    c.fillStyle = '#2a2a2a'; c.fillRect(179, 437, 11, 4);
    c.strokeStyle = '#5d4c30'; c.lineWidth = 2.8;
    c.beginPath(); c.moveTo(166, 447); c.lineTo(202, 447); c.moveTo(166, 452); c.lineTo(202, 452); c.stroke();

    c.fillStyle = '#33251c'; c.fillRect(420, 450, 8, 74);
    grain(c, 420, 450, 8, 74, ['#2c2018', '#443428'], 24, 507);
    rr(c, 370, 412, 108, 42, 4); c.fillStyle = '#d9c99a'; c.fill();
    c.strokeStyle = '#5d4c30'; c.lineWidth = 2.8; c.stroke();
    rr(c, 375, 417, 98, 32, 2); c.fillStyle = 'rgba(0,0,0,0.08)'; c.fill();
    c.font = 'bold 11px Verdana'; c.textAlign = 'center'; c.fillStyle = '#4a3018';
    c.fillText('NO PARKING', 424, 432); c.fillText('FOR DRAGONS', 424, 446);

    c.fillStyle = vgrad(c, 0, 470, 0, H, [[0, '#38282c'], [1, '#1e1418']]);
    c.fillRect(0, 470, W, H - 470);
    grain(c, 0, 470, W, H - 470, ['#2c2024', '#443238', '#241a1e'], 600, 508);
    c.strokeStyle = '#100a0e'; c.lineWidth = 3.4;
    c.beginPath(); c.moveTo(100, 542); c.lineTo(160, 530); c.lineTo(222, 544);
    c.moveTo(500, 548); c.lineTo(560, 534);
    c.moveTo(1020, 554); c.lineTo(1080, 542); c.stroke();
    c.strokeStyle = '#ff6a2a'; c.lineWidth = 2.6;
    c.beginPath(); c.moveTo(126, 537); c.lineTo(190, 531); c.stroke();
    c.beginPath(); c.moveTo(520, 542); c.lineTo(576, 537); c.stroke();
    c.beginPath(); c.moveTo(1032, 550); c.lineTo(1092, 545); c.stroke();
    pathStrip(c, [[236, 564], [480, 530], [762, 520], [906, 524]], 62, 46, '#4a3438');
    stones(c, 300, 522, 500, 40, 30, ['#553d42', '#63474e'], 509);
    for (let i = 0; i < 12; i++) {
      const ex = 150 + ((i * 271) % 1000);
      const ey = 540 - ((i * 97) % 90);
      circle(c, ex, ey, 1.8, 'rgba(255,150,60,' + (0.25 + (i % 4) * 0.1).toFixed(2) + ')');
    }
    vignette(c, W, H, 0.38);
  };

  window.PAINTERS.krater = (c, W, H) => {
    dither(c, 0, 0, W, 300, '#100510', '#24090f', 12);
    dither(c, 0, 300, W, 160, '#24090f', '#3a0e14', 10);
    for (let i = 0; i < 40; i++) {
      circle(c, (i * 137) % W, (i * 89) % 280, 1.3, 'rgba(255,235,215,0.06)');
    }
    c.fillStyle = '#1c0a10';
    c.beginPath(); c.moveTo(0, 320); c.quadraticCurveTo(640, 248, 1280, 330);
    c.lineTo(1280, 442); c.lineTo(0, 442); c.closePath(); c.fill();
    grain(c, 100, 300, 1080, 130, ['#2a1018', '#160810'], 260, 601);
    c.strokeStyle = 'rgba(255,138,74,0.3)'; c.lineWidth = 3.4;
    c.beginPath(); c.moveTo(0, 322); c.quadraticCurveTo(640, 250, 1280, 332); c.stroke();
    glow(c, 900, 480, 400, 'rgba(255,110,40,0.24)');

    poly(c, [[0, 570], [0, 480], [140, 462], [320, 452], [480, 458], [540, 480], [500, 570]], '#2e2226');
    grain(c, 0, 470, 540, 100, ['#382a2e', '#241a1e', '#2e2226'], 300, 602);
    c.strokeStyle = 'rgba(20,12,10,0.65)'; c.lineWidth = 2.6;
    c.beginPath(); c.moveTo(180, 500); c.lineTo(250, 492); c.moveTo(360, 508); c.lineTo(430, 500); c.stroke();
    c.strokeStyle = 'rgba(255,138,74,0.55)'; c.lineWidth = 3.4;
    c.beginPath(); c.moveTo(140, 462); c.lineTo(320, 452); c.lineTo(480, 458); c.stroke();
    c.strokeStyle = 'rgba(255,138,74,0.4)'; c.lineWidth = 2.4;
    c.beginPath(); c.moveTo(480, 458); c.lineTo(540, 480); c.stroke();

    poly(c, [[940, 570], [960, 470], [1120, 458], [1280, 470], [1280, 570]], '#2e2226');
    grain(c, 950, 470, 330, 100, ['#382a2e', '#241a1e'], 220, 603);
    c.strokeStyle = 'rgba(255,138,74,0.55)'; c.lineWidth = 3.4;
    c.beginPath(); c.moveTo(960, 470); c.lineTo(1120, 458); c.lineTo(1280, 470); c.stroke();

    const lava = c.createLinearGradient(0, 440, 0, 570);
    lava.addColorStop(0, '#ffa04a'); lava.addColorStop(0.5, '#f06a24'); lava.addColorStop(1, '#c93414');
    c.fillStyle = lava;
    poly(c, [[520, 570], [600, 480], [900, 452], [1280, 460], [1280, 570]], null);
    c.beginPath(); c.moveTo(520, 570); c.lineTo(600, 480); c.lineTo(900, 452); c.lineTo(1280, 460); c.lineTo(1280, 570);
    c.closePath(); c.fill();
    grain(c, 520, 452, 760, 116, ['rgba(255,220,120,0.25)', 'rgba(160,30,10,0.3)'], 400, 604);
    [[700, 500], [860, 520], [1020, 496], [1150, 530], [620, 540], [940, 552]].forEach(p => {
      ell(c, p[0], p[1], 34 + (p[0] % 20), 13, 'rgba(138,42,18,0.6)');
    });
    c.strokeStyle = '#ffd24a'; c.lineWidth = 2.2;
    c.beginPath(); c.moveTo(660, 490); c.lineTo(760, 512); c.moveTo(900, 470); c.lineTo(980, 494); c.moveTo(1080, 510); c.lineTo(1180, 522); c.stroke();

    c.save();
    c.translate(1122, 452); c.rotate(0.16);
    c.strokeStyle = '#3a2a20'; c.lineWidth = 5.4; c.lineCap = 'round';
    c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(6, -30, -4, -56); c.stroke();
    rr(c, -47, -85, 94, 36, 4); c.fillStyle = '#c9a86a'; c.fill();
    c.strokeStyle = '#5d3c22'; c.lineWidth = 2.8; c.stroke();
    grain(c, -45, -83, 90, 32, ['rgba(120,90,50,0.25)', 'rgba(255,235,190,0.2)'], 50, 605);
    c.font = 'bold 12px Verdana'; c.textAlign = 'center'; c.fillStyle = '#4a3018';
    c.fillText('DO NOT', 0, -68); c.fillText('THROW THINGS!', 0, -55);
    c.restore();

    glow(c, 880, 500, 460, 'rgba(255,110,40,0.16)');
    vignette(c, W, H, 0.5);
  };

  Object.assign(window.ART, window.PAINTERS);
})();
