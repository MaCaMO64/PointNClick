(() => {
  const NOW = () => performance.now() / 1000;
  window.ROOMS = {};

  window.ROOMS.dal = {
    id: 'dal', name: 'Bloomdale', mood: 'shire',
    paint: ART.dal,
    walk: { minY: 470, maxY: 558 },
    animateUnder(c, t) { ART.animDalUnder(c, t, Game); },
    animateOver(c, t) { ART.animDalOver(c, t, Game); },
    npcs: [
      { ref: 'bongo', x: 450, y: 487 },
      { ref: 'tommel', x: 1120, y: 512 },
    ],
    hotspots: [
      { id: 'dor', label: 'the round door', x: 292, y: 400, w: 76, h: 76,
        standX: 330, standY: 505,
        verbs: {
          look: 'A round green door. Uncle Bongo claims green doors are "classic". He said the same about his trousers.',
          use: 'Locked. Uncle Bongo loses keys constantly. Or the keys lose him.',
        },
        itemActions: {} },
      { id: 'vindu1', label: 'the round window', x: 246, y: 439, w: 32, h: 32,
        verbs: { look: 'Someone has drawn a moustache on the inside of the glass. Suspect: Uncle Bongo. Evidence: everything.' } },
      { id: 'vindu2', label: 'the round window', x: 382, y: 439, w: 32, h: 32,
        verbs: { look: 'Another window with a moustache. It is a theme in this family.' } },
      { id: 'bord', label: 'the garden table', x: 488, y: 458, w: 100, h: 52,
        standX: 538, standY: 520,
        verbs: { look: 'A garden table. Casualty number four of the moving chaos.', use: 'The table is actually level. A miracle, by today\'s standards.' } },
      { id: 'floyte', label: 'the tin whistle', x: 512, y: 436, w: 56, h: 38,
        standX: 538, standY: 516,
        hidden: () => Game.has('fløyte'),
        verbs: {
          look: 'A tin whistle. It lies there as if waiting for a musical moment. Or an excuse.',
          take() { Game.addItem('fløyte'); Game.say('toke', 'Whistle secured. The neighbors already regret this.'); },
        } },
      { id: 'vedstabbel', label: 'the woodpile', x: 60, y: 472, w: 156, h: 90,
        standX: 160, standY: 545,
        verbs: {
          look: 'Neatly stacked firewood. Uncle Bongo calls it "pension plan B".',
          use: 'The wood was stacked by a man with strong opinions about angles.',
        } },
      { id: 'stokk', label: 'a loose stick', x: 206, y: 498, w: 58, h: 62,
        standX: 240, standY: 545,
        hidden: () => Game.has('stokk'),
        verbs: {
          look: 'A sturdy stick. It has lain here long enough to form opinions about the neighborhood.',
          take() { Game.addItem('stokk'); Game.say('toke', 'Stick acquired. You never know when you need to poke something. Or knock down fruit.'); },
        } },
      { id: 'epletre', label: 'the apple tree', x: 862, y: 272, w: 200, h: 284,
        standX: 962, standY: 550,
        verbs: {
          look: 'An apple tree full of red apples. They hang high. Arrogantly high.',
          use: 'The tree wobbles a little. The apples laugh at you.',
          take: 'They hang too high. Even for a hobbit on tiptoe.',
        },
        itemActions: {
          stokk() {
            Game.script([
              { say: ['toke', 'Excuse me, apples. This is called "harvest technology".'] },
              { fx: 'whoosh' },
              { fn: () => { Game.setFlag('appleFalling'); Game.room._appleT = NOW(); } },
              { wait: 0.95 },
              { fx: 'door' },
              { flag: ['appleGround'] },
              { say: ['toke', 'And THAT is how we harvest in Bloomdale. With physics.'] },
            ]);
          },
        } },
      { id: 'eple', label: 'an apple', x: 988, y: 530, w: 40, h: 34,
        standX: 1008, standY: 552,
        hidden: () => !Game.flag('appleGround') || Game.has('eple'),
        verbs: {
          look: 'One perfect apple. It fell from a great height with style.',
          take() { Game.addItem('eple'); Game.say('toke', 'Apple picked from the ground. Nature\'s gift, physics\' credit.'); },
        } },
      { id: 'esker', label: 'the moving boxes', x: 594, y: 492, w: 118, h: 64,
        verbs: {
          look: 'Boxes marked "FRAGILE". Uncle Bongo has corrected it to "FRA-GIL-E" in pencil. Twice.',
          use: 'No. Opening other people\'s boxes is how adventures go BAD.',
        } },
      { id: 'skilt', label: 'the signpost', x: 1028, y: 418, w: 88, h: 112,
        verbs: {
          look: '"BLOOMDALE". Written with two hyphens and great confidence.',
          use: 'The sign wobbles. It is not up for more drama today.',
        } },
      { id: 'port', label: 'the east gate', x: 1166, y: 426, w: 104, h: 150,
        standX: 1150, standY: 545,
        verbs: {
          look: 'The gate toward the eastern road. The world outside Bloomdale waits. It smells slightly less like cocoa.',
          use() {
            if (Game.flag('goatGone')) Game.goto('kryss', 90, 525);
            else Game.say('toke', 'The gate is open, but BILLY occupies the passage like a fistful of personality.');
          },
        } },
    ],
    onRingToggle(on) {
      if (on && !Game.flag('ringGagDal') && Game.flag('questStarted')) {
        Game.setFlag('ringGagDal');
        Game.script([
          { say: ['bongo', 'Tomble? TOMBLE?! Where did you…'] },
          { wait: 0.3 },
          { say: ['narrator', 'Uncle Bongo spins around. He looks straight through you. Twice.'] },
          { say: ['bongo', 'Oh. There you are. You went very quiet. TAKE OFF that thing while we talk, please.'] },
        ]);
      }
    },
  };

  window.ROOMS.kryss = {
    id: 'kryss', name: 'The Crossroads', mood: 'road',
    paint: ART.kryss,
    walk: { minY: 485, maxY: 560 },
    animateUnder(c, t) { ART.animKryssUnder(c, t, Game); },
    animateOver(c, t) { ART.animKryssOver(c, t, Game); },
    npcs: [ { ref: 'perr', x: 1010, y: 505 } ],
    hotspots: [
      { id: 'skilt', label: 'the signpost', x: 292, y: 358, w: 250, h: 172,
        standX: 430, standY: 545,
        verbs: {
          look: 'Two arrows. One points west ("Bloomdale"), one points east ("Grumblingdale"). Below, less legible: "and otherwise just around".',
          use: 'The signpost creaks, alarmed.',
        } },
      { id: 'kraaker', label: 'the crows', x: 330, y: 350, w: 160, h: 34,
        verbs: {
          look: 'Two crows. They are judging me. The left one has already written the verdict.',
          talk: 'Caw. CAW. (Translation: still guilty.)',
        } },
      { id: 'postkasse', label: 'the mailbox', x: 138, y: 428, w: 82, h: 106,
        standX: 180, standY: 548,
        verbs: {
          look: 'A red mailbox with its flag raised. The flag means complaint. The postal service knows this road well.',
          use() {
            if (!Game.flag('avisOut')) Game.say('toke', 'The latch is jammed shut. The mail here is packed tight along with the weather.');
            else Game.say('toke', 'Empty. Just the echo of bureaucracy left.');
          },
        },
        itemActions: {
          stokk() {
            if (Game.flag('avisOut')) { Game.think('The stick has done its job. The stick rests now.'); return; }
            Game.script([
              { say: ['toke', 'Jammed shut, you say? Allow me to present: THE STICK METHOD.'] },
              { fx: 'whoosh' },
              { wait: 0.4 },
              { fx: 'coin' },
              { flag: ['avisOut'] },
              { say: ['narrator', 'A jerk. A scrape. And PLOP – something papery falls into the gravel.'] },
            ]);
          },
        } },
      { id: 'avis', label: 'a crumpled newspaper', x: 190, y: 532, w: 48, h: 34,
        standX: 214, standY: 556,
        hidden: () => !Game.flag('avisOut') || Game.has('avis'),
        verbs: {
          look: '"MORDOR TIMES – all the news, one opinion." The headline is set in CAPITALS and zero discussion.',
          take() {
            Game.addItem('avis');
            Game.sayLines([
              ['toke', 'Free reading! Technically theft from the postal service. Technically I am an adventurer.'],
            ]);
          },
        } },
      { id: 'tommerstokk', label: 'the hollow log', x: 692, y: 498, w: 170, h: 64,
        standX: 780, standY: 558,
        verbs: {
          look: 'A hollow log. Classic hiding spot. Even I have read adventure stories.',
          use: 'You peer inside. Something peers back. It is your reflection. PROBABLY.',
          take: 'The log weighs roughly as much as my future regrets. It stays.',
        } },
      { id: 'dtre', label: 'the dead tree', x: 44, y: 300, w: 100, h: 180,
        verbs: {
          look: 'Even the trees have given up out here. Respect for the honesty.',
          use: 'The tree groaned. It was not enthusiastic.',
        } },
      { id: 'nordvei', label: 'the north path', x: 580, y: 300, w: 116, h: 130,
        standX: 640, standY: 520,
        verbs: {
          look: 'A narrow path wanders north between the hills, toward the sound of running water.',
          use() { Game.goto('elv', 90, 512); },
        } },
      { id: 'vestvei', label: 'the road home', x: 0, y: 470, w: 70, h: 130,
        standX: 80, standY: 525,
        verbs: { look: 'The road back toward Bloomdale. The cocoa at home calls faintly.', use() { Game.goto('dal', 1150, 522); } } },
      { id: 'ostvei', label: 'the east road', x: 1210, y: 470, w: 70, h: 130,
        standX: 1200, standY: 525,
        verbs: {
          look() {
            if (!Game.flag('perrPaid')) return 'The road east toward Grumblingdale. Blocked by a Black Rider running a toll booth with feelings.';
            return 'The road east lies open. The Rider reads. There is hope for the world.';
          },
          use() {
            if (!Game.flag('perrPaid')) {
              Game.script([
                { say: ['narrator', 'The Black Rider raises one gauntlet. Tolls are paid BEFORE proceeding. That is how toll booths work. Even evil ones.'] },
                { say: ['perr', '*sniffs in your general direction*'] },
              ]);
            } else Game.goto('pub', 220, 535);
          },
        } },
    ],
    onEnter() {},
    onRingToggle(on) {
      if (on && !Game.flag('ringGagKryss') && Game.flag('questStarted')) {
        Game.setFlag('ringGagKryss');
        Game.script([
          { say: ['narrator', 'The world turns grey. Sounds stretch out. And then… a horse turns its head. SLOWLY.'] },
          { say: ['perr', '*sniff* …*SNIFF*'] },
          { say: ['toke', 'NO NO NO–'] },
          { ring: false },
          { say: ['narrator', 'You tear the Ring off your finger. Colors flood back, and the Rider loses interest with a disappointed horse noise.'] },
          { say: ['toke', '(Noted: invisibility attracts NOSES.)'] },
        ]);
      }
    },
  };

  window.ROOMS.pub = {
    id: 'pub', name: 'The Wobbly Pony', mood: 'pub',
    paint: ART.pub,
    walk: { minY: 500, maxY: 558 },
    animateUnder(c, t) { ART.animPubUnder(c, t, Game); },
    animateOver(c, t) { ART.animPubOver(c, t, Game); },
    npcs: [
      { ref: 'dora', x: 895, y: 480 },
      { ref: 'halvor', x: 560, y: 548 },
      { ref: 'rando', x: 250, y: 545 },
    ],
    hotspots: [
      { id: 'peis', label: 'the fireplace', x: 120, y: 380, w: 124, h: 132,
        standX: 182, standY: 545,
        verbs: {
          look: 'The fire crackles away like Uncle Bongo\'s knees. The warmth is real. The coziness is debatable. The warmth is real.',
          use: 'You warm your hands. Adventure requires warm fingers and cold feet. Or something.',
        } },
      { id: 'bardisk', label: 'the bar counter', x: 866, y: 408, w: 300, h: 150,
        standX: 1010, standY: 552,
        verbs: {
          look: 'The bar top has been polished by a thousand elbows. Human elbows. The other kind charge by the hour.',
          use: () => Game.say('dora', 'The bar is served FROM behind it. Not ON it.'),
        } },
      { id: 'flasker', label: 'the bottle shelf', x: 884, y: 222, w: 382, h: 152,
        standX: 1075, standY: 552,
        verbs: {
          look: 'Bottles from every corner of Middle-earth. Some of them still remember the Roman Empire.',
          use: 'Dora coughed. From across the room. Impressive lung work.',
        } },
      { id: 'tavle', label: 'the chalkboard', x: 296, y: 296, w: 132, h: 98,
        standX: 362, standY: 545,
        verbs: {
          look: '"TODAY: SOUP. TOMORROW: ALSO SOUP." The kitchen has a vision.',
          use: 'The board is written in chalk. The chalk is also soup-related.',
        } },
      { id: 'pvindu', label: 'the window', x: 730, y: 326, w: 84, h: 102,
        standX: 772, standY: 545,
        verbs: {
          look: 'Outside it is evening. Inside there is soup. The balance of the universe holds.',
        } },
      { id: 'dart', label: 'the dartboard', x: 804, y: 270, w: 52, h: 52,
        standX: 830, standY: 545,
        verbs: {
          look: 'A dartboard. The bullseye has the most holes. Local strategy.',
          use() {
            if (!Game.flag('dartThrown')) {
              Game.setFlag('dartThrown');
              Game.script([
                { say: ['toke', 'One dart. What could POSSIBLY go wrong?'] },
                { fx: 'whoosh' },
                { say: ['narrator', 'The dart hits the wall. Then a frame. Then Dora\'s patience.'] },
                { say: ['dora', 'FURNITURE, dear. We do NOT throw things at furniture.'] },
              ]);
            } else Game.think('Dora supervises the dartboard now. With both eyes.');
          },
        } },
      { id: 'bord', label: 'the table with mugs', x: 420, y: 504, w: 104, h: 70,
        standX: 472, standY: 556,
        verbs: {
          look: 'Two empty mugs. Halvor refers to them as "colleagues".',
          use: 'The mugs are empty. Like Halvor\'s promises.',
        } },
      { id: 'katt', label: 'King (the cat)', x: 44, y: 470, w: 64, h: 62,
        standX: 90, standY: 552,
        verbs: {
          look: 'The cat is called King. He accepts no other name. He has approved this document.',
          use: 'King blinks slowly. In cat that means "you may live".',
          take: 'One does not TAKE King. King takes YOU. Legally speaking.',
          talk: 'Meow. (He demanded tribute. I paid nothing. He remembers.)',
        } },
      { id: 'polseplate', label: 'a plate of salted sausage', x: 928, y: 414, w: 56, h: 32,
        standX: 956, standY: 548,
        hidden: () => Game.flag('sausageGone') || Game.has('pølse'),
        verbs: {
          look: 'A salted sausage on a plate. The pride of the house. Dora winks: "Take two." I take one.',
          take() {
            Game.addItem('pølse');
            Game.setFlag('sausageGone');
            Game.say('toke', 'Sausage secured. The journey officially begins.');
          },
        } },
      { id: 'gulvskje', label: 'something shiny', x: 496, y: 540, w: 48, h: 30,
        standX: 520, standY: 556,
        hidden: () => !Game.flag('spoonFloor') || Game.has('skje'),
        verbs: {
          look: 'A silver spoon under the table! Halvor apparently "inherited" it down to the floorboards.',
          take() {
            Game.addItem('skje');
            Game.sayLines([
              ['toke', 'Spoon recovered! Halvor snores appreciatively.'],
              ['halvor', '*mumbles in his sleep* she came home…'],
            ]);
          },
        } },
      { id: 'utgang', label: 'the exit', x: 750, y: 542, w: 136, h: 28,
        standX: 818, standY: 552,
        verbs: {
          look: 'The exit. The door to the crossroads and the rest of the story.',
          use() { Game.goto('kryss', 1190, 522); },
        } },
    ],
    onEnter() {
      if (!Game.flag('visitedPub')) {
        Game.setFlag('visitedPub');
        Game.say('narrator', 'The Wobbly Pony: smell of soup, sound of merriment, and one corner-wanderer already studying you.');
      }
    },
  };
})();
