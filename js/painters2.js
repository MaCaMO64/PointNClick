(() => {
  const A = ART;
  const { rr, ell, circle, poly, vgrad, glow, cloud, mountainLayer, vignette } = A;
  const PX = window._PX;
  const { grain, dither, planks, stones, foliage, grassPatch, shadowBlob } = PX;

  window.PAINTERS.kryss = (c, W, H) => {
    const sky = c.createLinearGradient(0, 0, 0, 460);
    sky.addColorStop(0, '#241a44');
    sky.addColorStop(0.3, '#543361');
    sky.addColorStop(0.55, '#8a4560');
    sky.addColorStop(0.78, '#c65f43');
    sky.addColorStop(1, '#ffab54');
    c.fillStyle = sky;
    c.fillRect(0, 0, W, 460);
    for (let i = 0; i < 26; i++) {
      const sy = 20 + i * 13;
      c.fillStyle = 'rgba(255,190,120,' + (0.05 + (i % 3) * 0.03).toFixed(2) + ')';
      c.fillRect(0, sy, W, 2);
    }
    glow(c, 210, 330, 150, 'rgba(255,170,90,0.55)');
    circle(c, 210, 330, 44, '#ffe0a0');
    circle(c, 210, 330, 34, '#fff0c8');
    let sd = 5;
    for (let i = 0; i < 26; i++) {
      sd = (sd * 16807) % 2147483647;
      circle(c, sd % W, (sd >> 4) % 220, 1.4, 'rgba(255,235,200,' + (0.25 + (sd % 40) / 100).toFixed(2) + ')');
    }
    mountainLayer(c, 392, 120, 300, '#332347');
    mountainLayer(c, 430, 88, 900, '#3e2b52');
    grain(c, 0, 340, W, 110, ['#462f52', '#503758'], 260, 201);

    poly(c, [[1120, 452], [1120, 416], [1152, 416], [1152, 452]], '#2e2138');
    poly(c, [[1112, 416], [1160, 416], [1136, 398]], '#2e2138');
    grain(c, 1112, 398, 48, 54, ['#3a2a48', '#281d32'], 30, 201);

    c.fillStyle = vgrad(c, 0, 424, 0, H, [[0, '#5a7050'], [0.5, '#486044'], [1, '#33483a']]);
    c.fillRect(0, 424, W, H - 424);
    grain(c, 0, 424, W, H - 424, ['#4e684a', '#3f5741', '#587252', '#36503a'], 700, 202);
    grassPatch(c, 0, 430, W, 70, 160, ['#2e4632', '#3a563e', '#26402c'], 203);

    poly(c, [[600, 492], [694, 492], [650, 292], [612, 292]], '#a98a5e');
    poly(c, [[612, 292], [650, 292], [662, 380], [602, 380]], 'rgba(255,180,120,0.18)');
    grain(c, 600, 380, 94, 110, ['#93764e', '#b09268'], 130, 204);
    grassPatch(c, 560, 470, 170, 30, 40, ['#2e4632', '#3a563e'], 205);

    poly(c, [[0, 486], [W, 480], [W, 578], [0, 584]], '#9c7c52');
    stones(c, 0, 486, W, 96, 120, ['#8f7148', '#a8885c', '#7d6240', '#b3946a'], 206);
    c.strokeStyle = 'rgba(74,52,30,0.85)';
    c.lineWidth = 7;
    c.beginPath(); c.moveTo(0, 512); c.quadraticCurveTo(420, 500, 1280, 514); c.stroke();
    c.beginPath(); c.moveTo(0, 548); c.quadraticCurveTo(520, 562, 1280, 546); c.stroke();
    grain(c, 0, 486, W, 96, ['rgba(120,90,52,0.5)', 'rgba(210,180,130,0.25)'], 320, 207);

    c.fillStyle = '#241a2c';
    c.beginPath(); c.moveTo(84, 474); c.quadraticCurveTo(72, 372, 94, 310); c.lineTo(106, 310);
    c.quadraticCurveTo(92, 372, 102, 474); c.closePath(); c.fill();
    c.strokeStyle = '#241a2c'; c.lineWidth = 7; c.lineCap = 'round';
    c.beginPath(); c.moveTo(90, 380); c.lineTo(52, 336); c.moveTo(91, 348); c.lineTo(128, 312);
    c.moveTo(93, 400); c.lineTo(132, 378); c.moveTo(88, 430); c.lineTo(58, 410); c.stroke();
    grain(c, 76, 320, 26, 150, ['rgba(70,50,70,0.4)', 'rgba(10,6,12,0.5)'], 60, 208);

    shadowBlob(c, 432, 522, 40, 9);
    c.fillStyle = '#5d4028'; c.fillRect(414, 360, 11, 164);
    grain(c, 414, 360, 11, 164, ['#4a301c', '#6f4e30'], 90, 209);
    c.strokeStyle = 'rgba(30,18,8,0.6)'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(419, 366); c.lineTo(419, 518); c.stroke();

    function board(x, y, w, h, tipRight) {
      c.fillStyle = '#c9a06a';
      if (tipRight) { poly(c, [[x, y], [x + w - 16, y], [x + w, y + h / 2], [x + w - 16, y + h], [x, y + h]], null); }
      else { poly(c, [[x + 16, y], [x + w, y], [x + w, y + h], [x + 16, y + h], [x, y + h / 2]], null); }
      c.save();
      c.beginPath();
      if (tipRight) { poly(c, [[x, y], [x + w - 16, y], [x + w, y + h / 2], [x + w - 16, y + h], [x, y + h]], null); }
      else { poly(c, [[x + 16, y], [x + w, y], [x + w, y + h], [x + 16, y + h], [x, y + h / 2]], null); }
      c.clip();
      grain(c, x, y, w, h, ['#b8905c', '#d8b078'], 70, x + y);
      c.strokeStyle = 'rgba(70,45,20,0.5)'; c.lineWidth = 1.6;
      for (let g = 0; g < 3; g++) {
        c.beginPath(); c.moveTo(x + 8, y + 6 + g * 8); c.lineTo(x + w - 8, y + 5 + g * 8); c.stroke();
      }
      c.restore();
      c.strokeStyle = '#4a3016'; c.lineWidth = 2.4;
      c.beginPath();
      if (tipRight) { poly(c, [[x, y], [x + w - 16, y], [x + w, y + h / 2], [x + w - 16, y + h], [x, y + h]], null); }
      else { poly(c, [[x + 16, y], [x + w, y], [x + w, y + h], [x + 16, y + h], [x, y + h / 2]], null); }
      c.stroke();
    }
    board(298, 370, 108, 27, true);
    board(438, 402, 112, 27, false);
    c.font = 'bold 12px Verdana'; c.textAlign = 'center';
    c.fillStyle = '#4a3018';
    c.fillText('BLOOMDALE', 350, 388);
    c.fillText('GRUMBLINGDALE', 494, 420);

    function crow(x, y, flip) {
      shadowBlob(c, x, y + 7, 12, 3);
      ell(c, x, y, 11, 7, '#14121c');
      circle(c, x + 9 * flip, y - 6, 5, '#14121c');
      poly(c, [[x + 13 * flip, y - 6], [x + 19 * flip, y - 4.5], [x + 13 * flip, y - 3]], '#e8963a');
      poly(c, [[x - 9 * flip, y - 2], [x - 17 * flip, y - 8], [x - 7 * flip, y - 5]], '#14121c');
      circle(c, x + 10 * flip, y - 7, 1.4, '#fff');
      c.strokeStyle = '#14121c'; c.lineWidth = 2;
      c.beginPath(); c.moveTo(x - 3, y + 6); c.lineTo(x - 3, y + 10);
      c.moveTo(x + 3, y + 6); c.lineTo(x + 3, y + 10); c.stroke();
    }
    crow(352, 362, 1);
    crow(472, 394, -1);

    c.fillStyle = '#5d4028'; c.fillRect(174, 464, 9, 62);
    grain(c, 174, 464, 9, 62, ['#4a301c', '#6f4e30'], 40, 210);
    shadowBlob(c, 179, 528, 18, 5);
    rr(c, 144, 434, 68, 38, 9); c.fillStyle = '#a83226'; c.fill();
    c.strokeStyle = '#5e150c'; c.lineWidth = 3; c.stroke();
    c.fillStyle = 'rgba(255,140,110,0.35)';
    rr(c, 148, 438, 60, 10, 6); c.fill();
    c.fillStyle = '#3d0d06'; c.fillRect(152, 450, 34, 6);
    c.fillStyle = 'rgba(255,230,200,0.5)'; c.fillRect(154, 451, 30, 2);
    poly(c, [[206, 434], [216, 434], [216, 414], [211, 414], [211, 434]], '#e8c84a');
    circle(c, 211, 412, 2.6, '#8a6a20');

    shadowBlob(c, 776, 560, 86, 10);
    rr(c, 698, 510, 156, 48, 22); c.fillStyle = '#4e3c28'; c.fill();
    c.strokeStyle = '#2c2014'; c.lineWidth = 3.4; c.stroke();
    c.strokeStyle = 'rgba(24,16,8,0.65)'; c.lineWidth = 2.2;
    c.beginPath();
    c.moveTo(742, 514); c.quadraticCurveTo(738, 534, 744, 554);
    c.moveTo(792, 512); c.quadraticCurveTo(796, 534, 790, 556);
    c.moveTo(832, 518); c.quadraticCurveTo(828, 536, 832, 552);
    c.stroke();
    grain(c, 702, 514, 148, 40, ['rgba(30,20,10,0.4)', 'rgba(120,90,50,0.25)'], 90, 211);
    ell(c, 706, 534, 17, 20, '#17110a');
    ell(c, 706, 534, 12, 15, '#0a0704');
    c.strokeStyle = '#2e2418'; c.lineWidth = 4;
    c.beginPath(); c.ellipse(706, 534, 15, 17.5, 0, 0, Math.PI * 2); c.stroke();
    foliage(c, 726, 512, 14, ['#4c6b3c', '#3d5930'], 14, 212);
    grassPatch(c, 660, 548, 240, 22, 40, ['#2e4632', '#3a563e'], 213);

    c.fillStyle = 'rgba(255,170,110,0.10)';
    c.fillRect(0, 372, W, 118);
    vignette(c, W, H, 0.36);
  };

  window.PAINTERS.pub = (c, W, H) => {
    planks(c, 0, 0, W, 434, 82, true, ['#6b4a2f', '#5f4028', '#755234'], 301);
    c.fillStyle = 'rgba(30,16,6,0.35)';
    for (let x = 82; x < W; x += 82) c.fillRect(x - 1, 0, 2, 434);
    rr(c, 0, 200, W, 16, 0); c.fillStyle = '#3f2a14'; c.fill();
    c.fillStyle = 'rgba(255,220,170,0.12)'; c.fillRect(0, 200, W, 3);
    rr(c, 0, 322, W, 16, 0); c.fillStyle = '#3f2a14'; c.fill();
    c.fillStyle = 'rgba(255,220,170,0.12)'; c.fillRect(0, 322, W, 3);

    rr(c, 0, 428, W, 76, 0); c.fillStyle = '#4a3018'; c.fill();
    c.fillStyle = '#6b4a2f'; c.fillRect(0, 428, W, 5);
    c.fillStyle = 'rgba(255,220,170,0.15)'; c.fillRect(0, 428, W, 2);
    grain(c, 0, 434, W, 70, ['#3f2a14', '#55381e'], 240, 301);

    c.fillStyle = vgrad(c, 0, 500, 0, H, [[0, '#8a5f3c'], [1, '#5e3c20']]);
    c.fillRect(0, 500, W, H - 500);
    grain(c, 0, 500, W, H - 500, ['#75502f', '#9a6c44', '#67431f'], 500, 302);
    c.strokeStyle = 'rgba(35,20,8,0.5)'; c.lineWidth = 2.5;
    for (let x = 0; x <= W; x += 128) {
      c.beginPath(); c.moveTo(640 + (x - 640) * 0.55, 500); c.lineTo(x, H); c.stroke();
    }
    c.beginPath(); c.moveTo(0, 548); c.lineTo(W, 548); c.moveTo(0, 604); c.lineTo(W, 604); c.stroke();
    grain(c, 0, 548, W, 60, ['rgba(255,220,170,0.06)', 'rgba(0,0,0,0.15)'], 200, 303);

    ell(c, 560, 550, 188, 38, '#7a3a3a');
    c.strokeStyle = '#9a5a4a'; c.lineWidth = 4;
    c.beginPath(); c.ellipse(560, 550, 166, 30, 0, 0, Math.PI * 2); c.stroke();
    c.save();
    c.beginPath(); c.ellipse(560, 550, 150, 25, 0, 0, Math.PI * 2); c.clip();
    c.strokeStyle = 'rgba(200,140,120,0.5)'; c.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      c.beginPath(); c.moveTo(560 - 150 + i * 75, 525);
      c.quadraticCurveTo(560 - 75 + i * 75, 575, 560 + i * 75, 525); c.stroke();
    }
    c.restore();
    grain(c, 420, 528, 280, 44, ['rgba(0,0,0,0.12)', 'rgba(255,180,140,0.08)'], 120, 304);

    bricks(c, 92, 336, 182, 176, 30, 22, ['#7d7468', '#8a8072', '#726a5e', '#93897a'], 305);
    c.strokeStyle = 'rgba(30,26,20,0.55)'; c.lineWidth = 2;
    for (let yy = 336; yy < 512; yy += 22) { c.beginPath(); c.moveTo(92, yy); c.lineTo(274, yy); c.stroke(); }
    c.beginPath();
    c.moveTo(122, 512); c.lineTo(122, 414);
    c.arc(182, 414, 60, Math.PI, 0);
    c.lineTo(242, 512);
    c.closePath();
    c.fillStyle = '#100a06'; c.fill();
    glow(c, 182, 492, 90, 'rgba(255,140,50,0.35)');
    c.save();
    c.translate(182, 498);
    c.rotate(-0.42); rr(c, -42, -9, 84, 16, 7); c.fillStyle = '#4a3018'; c.fill();
    grain(c, -42, -9, 84, 16, ['rgba(20,10,4,0.4)', 'rgba(150,100,50,0.3)'], 30, 306);
    c.rotate(0.84); rr(c, -42, -9, 84, 16, 7); c.fillStyle = '#5d442e'; c.fill();
    c.restore();
    [[158, 506], [182, 500], [206, 508]].forEach(p => {
      circle(c, p[0], p[1], 4, '#ff8a2a');
      circle(c, p[0], p[1], 2, '#ffd24a');
    });
    grain(c, 130, 480, 104, 30, ['rgba(255,120,40,0.25)'], 60, 307);
    rr(c, 84, 326, 192, 18, 3); c.fillStyle = '#5d442e'; c.fill();
    c.strokeStyle = '#33220f'; c.lineWidth = 2.5; c.stroke();
    c.fillStyle = 'rgba(255,230,180,0.15)'; c.fillRect(86, 328, 188, 3);
    c.fillStyle = '#efe6d2'; c.fillRect(142, 302, 8, 26);
    poly(c, [[146, 294], [153, 304], [139, 304]], '#ffce54');
    glow(c, 146, 300, 22, 'rgba(255,200,90,0.5)');
    rr(c, 210, 296, 16, 32, 3); c.fillStyle = '#c97a2a'; c.fill();
    c.strokeStyle = '#7a4a16'; c.lineWidth = 2; c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.25)'; c.fillRect(213, 300, 3, 24);

    planks(c, 866, 436, 408, 118, 44, false, ['#5d3c22', '#6b4527', '#523318'], 308);
    rr(c, 858, 412, 424, 24, 5); c.fillStyle = '#caa06a'; c.fill();
    c.strokeStyle = '#6e4526'; c.lineWidth = 3; c.stroke();
    grain(c, 860, 414, 420, 20, ['#b8905c', '#d8b078'], 160, 309);
    c.fillStyle = 'rgba(255,240,200,0.25)'; c.fillRect(858, 412, 424, 3);
    c.fillStyle = 'rgba(40,20,8,0.4)'; c.fillRect(858, 432, 424, 3);
    c.strokeStyle = 'rgba(30,18,8,0.5)'; c.lineWidth = 2;
    for (let x = 906; x < 1268; x += 44) { c.beginPath(); c.moveTo(x, 438); c.lineTo(x, 552); c.stroke(); }
    rr(c, 866, 552, 408, 9, 4); c.fillStyle = '#d4af37'; c.fill();
    c.fillStyle = 'rgba(255,250,220,0.5)'; c.fillRect(866, 552, 408, 3);
    c.fillStyle = 'rgba(120,80,10,0.5)'; c.fillRect(866, 558, 408, 3);

    rr(c, 880, 228, 388, 158, 4); c.fillStyle = '#232c3a'; c.fill();
    c.strokeStyle = '#3a2a14'; c.lineWidth = 5; c.stroke();
    grain(c, 882, 230, 384, 154, ['rgba(90,110,140,0.2)', 'rgba(10,16,24,0.3)'], 200, 310);
    const bcol = ['#7aa04a', '#c97a2a', '#8a4ac9', '#c9c94a', '#4ac9b0', '#c94a6a', '#7a8ac9', '#c98a3a'];
    for (let i = 0; i < 8; i++) bottle2(c, 900 + i * 45, 222, bcol[i]);
    for (let i = 0; i < 7; i++) bottle2(c, 916 + i * 47, 284, bcol[(i + 3) % 8]);
    rr(c, 888, 346, 372, 13, 3); c.fillStyle = '#4a3018'; c.fill();
    c.fillStyle = 'rgba(255,230,180,0.15)'; c.fillRect(888, 346, 372, 2);
    for (let i = 0; i < 6; i++) {
      const gx = 906 + i * 58;
      rr(c, gx, 358, 17, 21, 3); c.fillStyle = 'rgba(210,225,240,0.25)'; c.fill();
      c.strokeStyle = '#c9d2dc'; c.lineWidth = 2.4; c.stroke();
      c.fillStyle = 'rgba(255,255,255,0.35)'; c.fillRect(gx + 3, 361, 3, 14);
    }

    [[918], [986]].forEach(bx => {
      const bxv = bx[0];
      ell(c, bxv, 504, 30, 7, 'rgba(0,0,0,0.3)');
      circle(c, bxv, 478, 28, '#7a5230', '#3f2812', 3);
      c.strokeStyle = 'rgba(30,18,8,0.55)'; c.lineWidth = 2.2;
      for (let a = -2; a <= 2; a++) {
        const ang = a * 0.5;
        c.beginPath(); c.moveTo(bxv + Math.sin(ang) * -26, 478 - Math.cos(ang) * 26);
        c.lineTo(bxv + Math.sin(ang) * 26, 478 + Math.cos(ang) * 26); c.stroke();
      }
      circle(c, bxv, 478, 9, '#5d3c22', '#33200e', 2.4);
      c.strokeStyle = '#3f2a12'; c.lineWidth = 3;
      c.beginPath(); c.arc(bxv, 478, 22, -0.5, 0.5); c.stroke();
      c.beginPath(); c.arc(bxv, 478, 22, Math.PI - 0.5, Math.PI + 0.5); c.stroke();
      c.strokeStyle = 'rgba(220,180,120,0.35)'; c.lineWidth = 2;
      c.beginPath(); c.arc(bxv - 8, 470, 14, Math.PI * 1.1, Math.PI * 1.6); c.stroke();
    });

    [[470], [750]].forEach(lxx => {
      const lx = lxx[0];
      c.strokeStyle = '#1c1208'; c.lineWidth = 3.4;
      c.beginPath(); c.moveTo(lx, 0); c.lineTo(lx, 126); c.stroke();
      poly(c, [[lx - 28, 154], [lx + 28, 154], [lx + 17, 126], [lx - 17, 126]], '#d9a05b', '#8a5f2c', 2.4);
      c.fillStyle = 'rgba(255,240,200,0.14)';
      poly(c, [[lx - 60, 420], [lx + 60, 420], [lx + 26, 154], [lx - 26, 154]], null);
      c.beginPath();
      c.moveTo(lx - 60, 434); c.lineTo(lx + 60, 434); c.lineTo(lx + 26, 154); c.lineTo(lx - 26, 154);
      c.closePath(); c.fill();
      glow(c, lx, 162, 74, 'rgba(255,214,120,0.55)');
      circle(c, lx, 157, 7, '#fff2c8');
      circle(c, lx, 157, 3.4, '#ffffff');
    });

    rr(c, 296, 296, 132, 94, 6); c.fillStyle = '#26221c'; c.fill();
    c.strokeStyle = '#8a6a3c'; c.lineWidth = 6; c.stroke();
    grain(c, 300, 300, 124, 86, ['rgba(255,255,255,0.04)', 'rgba(0,0,0,0.25)'], 80, 311);
    c.font = 'bold 14px Verdana'; c.textAlign = 'center'; c.fillStyle = '#efe6cf';
    c.fillText('TODAY:', 362, 322); c.fillText('SOUP.', 362, 340);
    c.fillText('TOMORROW:', 362, 362); c.fillText('ALSO SOUP.', 362, 380);

    c.save();
    c.beginPath();
    c.moveTo(734, 424); c.lineTo(734, 350);
    c.arc(771, 350, 37, Math.PI, 0);
    c.lineTo(808, 424);
    c.closePath();
    c.fillStyle = vgrad(c, 0, 326, 0, 424, [[0, '#3a2c52'], [0.6, '#7a4458'], [1, '#c97a4e']]); c.fill();
    c.strokeStyle = '#33220f'; c.lineWidth = 6; c.stroke();
    c.restore();
    poly(c, [[744, 418], [760, 394], [780, 418]], '#241a2c');
    circle(c, 792, 344, 2, '#ffe9a8');

    circle(c, 830, 294, 23, '#3a2a1a', '#caa06a', 4);
    circle(c, 830, 294, 14, null, '#c94a3a', 4);
    circle(c, 830, 294, 6, '#caa06a');
    c.strokeStyle = '#caa06a'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(830, 288); c.lineTo(830, 300); c.moveTo(824, 294); c.lineTo(836, 294); c.stroke();

    c.fillStyle = '#4a3018'; c.fillRect(464, 538, 13, 30);
    ell(c, 470, 536, 52, 15, '#8a5f3c', '#4e3218', 3);
    grain(c, 424, 528, 94, 14, ['#9a6c44', '#7a5230'], 60, 312);
    mug3(c, 448, 518, 1); mug3(c, 490, 514, 1);
    ell(c, 556, 562, 21, 8, '#5d3c22', '#33200e', 2.4);
    c.strokeStyle = '#3f2a14'; c.lineWidth = 4.4;
    c.beginPath(); c.moveTo(548, 562); c.lineTo(543, 580); c.moveTo(565, 562); c.lineTo(570, 580); c.stroke();

    ell(c, 70, 524, 32, 30, '#6e4a28', '#3a2412', 3);
    c.strokeStyle = 'rgba(25,14,6,0.6)'; c.lineWidth = 2.4;
    c.beginPath(); c.moveTo(38, 524); c.lineTo(102, 524); c.stroke();
    circle(c, 70, 524, 10, '#54371c', '#2c1a0c', 2);
    ell(c, 76, 488, 24, 11, '#16141c');
    circle(c, 96, 483, 8, '#16141c');
    poly(c, [[102, 481], [109, 483.5], [102, 486]], '#c9988a');
    poly(c, [[89, 476], [93.5, 468], [98, 476]], '#16141c');
    circle(c, 98.6, 482, 1.4, '#e8c84a');

    rr(c, 754, 548, 128, 22, 4); c.fillStyle = '#5d3c22'; c.fill();
    c.strokeStyle = '#2c1a0c'; c.lineWidth = 2.4; c.stroke();
    c.font = 'bold 12px Verdana'; c.fillStyle = '#caa06a'; c.textAlign = 'center';
    c.fillText('E X I T', 818, 563);
    glow(c, 640, 300, 300, 'rgba(255,190,110,0.10)');
    vignette(c, W, H, 0.4);
  };

  function bottle2(c, x, y, col) {
    rr(c, x, y, 12, 28, 3); c.fillStyle = col; c.fill();
    rr(c, x + 3.5, y - 9, 5, 11, 2); c.fillStyle = col; c.fill();
    c.fillStyle = 'rgba(255,255,255,0.4)'; c.fillRect(x + 2, y + 3, 3, 16);
    c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(x + 9, y + 2, 2.4, 22);
    circle(c, x + 6, y - 9, 2.4, col);
  }

  function mug3(c, x, y, s) {
    rr(c, x, y, 13 * s, 16 * s, 2 * s);
    c.fillStyle = '#e8a83a'; c.fill();
    c.strokeStyle = '#7a4a16'; c.lineWidth = 2 * s; c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.3)'; c.fillRect(x + 2 * s, y + 3 * s, 2.4 * s, 10 * s);
    c.strokeStyle = '#7a4a16';
    c.beginPath(); c.arc(x + 14 * s, y + 8 * s, 4.4 * s, -Math.PI / 2, Math.PI / 2); c.stroke();
    ell(c, x + 6.4 * s, y - 1, 6.6 * s, 3.2 * s, '#fdf6e8');
    circle(c, x + 3 * s, y - 3 * s, 3.4 * s, '#fdf6e8');
    circle(c, x + 9 * s, y - 4 * s, 2.8 * s, '#fdf6e8');
  }
})();
