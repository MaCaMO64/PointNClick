(() => {
  const NOW = () => performance.now() / 1000;
  window.ROOMS = {};

  window.ROOMS.dal = {
    id: 'dal', name: 'Bloomdale', mood: 'shire',
    paint: ART.dal,
    pngTint: 'rgba(255,240,210,0.05)',
    bgHeal: [
      { dx: 0, dy: 0, w: 185, h: 265, sx: 195, sy: 0, flip: true },
      { dx: 1180, dy: 450, w: 100, h: 120, sx: 1050, sy: 450 },
    ],
    walk: { minY: 488, maxY: 566 },
    animateUnder(c, t) { ART.animDalUnder(c, t, Game); },
    animateOver(c, t) { ART.animDalOver(c, t, Game); },
    npcs: [
      { ref: 'bongo', x: 258, y: 552 },
      { ref: 'tommel', x: 1058, y: 548 },
    ],
    hotspots: [
      { id: 'dor', label: 'the round door', x: 14, y: 396, w: 108, h: 136,
        standX: 180, standY: 552,
        verbs: {
          look: 'A round green door built into the hillside. Uncle Bongo claims green doors are "classic". He said the same about his trousers.',
          use: 'Locked. Uncle Bongo loses keys constantly. Or the keys lose him.',
        },
        itemActions: {} },
      { id: 'vindu1', label: 'the round window', x: 132, y: 348, w: 58, h: 66,
        verbs: { look: 'Someone has drawn a moustache on the inside of the glass. Suspect: Uncle Bongo. Evidence: everything.' } },
      { id: 'vindu2', label: 'the neighbor\'s window', x: 1118, y: 388, w: 76, h: 76,
        verbs: { look: 'The neighbor\'s round window. Warm light inside. Their moustache drawings are less impressive.' } },
      { id: 'floyte', label: 'the tin whistle', x: 122, y: 496, w: 66, h: 38,
        standX: 168, standY: 554,
        hidden: () => Game.has('fløyte'),
        verbs: {
          look: 'A tin whistle resting on the door step. It lies there as if waiting for a musical moment. Or an excuse.',
          take() { Game.addItem('fløyte'); Game.say('toke', 'Whistle secured. The neighbors already regret this.'); },
        } },
      { id: 'vedstabbel', label: 'the woodpile', x: 24, y: 512, w: 136, h: 58,
        standX: 120, standY: 560,
        verbs: {
          look: 'Neatly stacked firewood. Uncle Bongo calls it "pension plan B".',
          use: 'The wood was stacked by a man with strong opinions about angles.',
        } },
      { id: 'stokk', label: 'a loose stick', x: 158, y: 512, w: 58, h: 60,
        standX: 196, standY: 560,
        hidden: () => Game.has('stokk'),
        verbs: {
          look: 'A sturdy stick leaning by the woodpile. It has lain here long enough to form opinions about the neighborhood.',
          take() { Game.addItem('stokk'); Game.say('toke', 'Stick acquired. You never know when you need to poke something. Or knock down fruit.'); },
        } },
      { id: 'epletre', label: 'the apple tree', x: 896, y: 306, w: 158, h: 246,
        standX: 962, standY: 558,
        verbs: {
          look: 'A small apple tree full of red apples. They hang high. Arrogantly high.',
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
      { id: 'eple', label: 'an apple', x: 966, y: 538, w: 44, h: 34,
        standX: 990, standY: 562,
        hidden: () => !Game.flag('appleGround') || Game.has('eple'),
        verbs: {
          look: 'One perfect apple. It fell from a great height with style.',
          take() { Game.addItem('eple'); Game.say('toke', 'Apple picked from the ground. Nature\'s gift, physics\' credit.'); },
        } },
      { id: 'esker', label: 'the moving boxes', x: 292, y: 494, w: 122, h: 68,
        standX: 354, standY: 560,
        verbs: {
          look: 'Boxes marked "FRAGILE". Uncle Bongo has corrected it to "FRA-GIL-E" in pencil. Twice.',
          use: 'No. Opening other people\'s boxes is how adventures go BAD.',
        } },
      { id: 'skilt', label: 'the fence post', x: 1062, y: 440, w: 80, h: 100,
        verbs: {
          look: 'A sturdy fence post. Someone has carved "BLOOMDALE RULES" into it. Both letters and grammar are questionable.',
          use: 'The post stands firm. Respect.',
        } },
      { id: 'port', label: 'the east gate', x: 1176, y: 424, w: 104, h: 152,
        standX: 1152, standY: 556,
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
      { ref: 'dora', x: 270, y: 472 },
      { ref: 'halvor', x: 760, y: 552 },
      { ref: 'rando', x: 960, y: 552 },
    ],
    hotspots: [
      { id: 'peis', label: 'the fireplace', x: 520, y: 348, w: 190, h: 172,
        standX: 615, standY: 548,
        verbs: {
          look: 'The fire crackles away like Uncle Bongo\'s knees. The warmth is real. The coziness is debatable. The warmth is real.',
          use: 'You warm your hands. Adventure requires warm fingers and cold feet. Or something.',
        } },
      { id: 'bardisk', label: 'the bar counter', x: 168, y: 398, w: 214, h: 152,
        standX: 300, standY: 552,
        verbs: {
          look: 'The bar top has been polished by a thousand elbows. Human elbows. The other kind charge by the hour.',
          use: () => Game.say('dora', 'The bar is served FROM behind it. Not ON it.'),
        } },
      { id: 'flasker', label: 'the bottle shelf', x: 178, y: 246, w: 224, h: 146,
        standX: 300, standY: 552,
        verbs: {
          look: 'Bottles from every corner of Middle-earth. Some of them still remember the Roman Empire.',
          use: 'Dora coughed. From across the room. Impressive lung work.',
        } },
      { id: 'tavle', label: 'the picture on the wall', x: 782, y: 250, w: 88, h: 68,
        standX: 826, standY: 545,
        verbs: {
          look: 'A small landscape painting. It hangs slightly crooked. Like everything else in this establishment.',
          use: 'You straighten it. It tilts back within the minute. Some things are meant to be.',
        } },
      { id: 'pvindu', label: 'the window', x: 1130, y: 286, w: 104, h: 124,
        standX: 1150, standY: 545,
        verbs: {
          look: 'Outside it is evening. Inside there is soup. The balance of the universe holds.',
        } },
      { id: 'bord', label: 'Halvor\'s table', x: 700, y: 514, w: 122, h: 62,
        standX: 762, standY: 558,
        verbs: {
          look: 'Two empty mugs. Halvor refers to them as "colleagues".',
          use: 'The mugs are empty. Like Halvor\'s promises.',
        } },
      { id: 'polseplate', label: 'a plate of salted sausage', x: 298, y: 404, w: 58, h: 34,
        standX: 330, standY: 548,
        hidden: () => Game.flag('sausageGone') || Game.has('pølse'),
        verbs: {
          look: 'A salted sausage on a plate. The pride of the house. Dora winks: "Take two." I take one.',
          take() {
            Game.addItem('pølse');
            Game.setFlag('sausageGone');
            Game.say('toke', 'Sausage secured. The journey officially begins.');
          },
        } },
      { id: 'gulvskje', label: 'something shiny', x: 738, y: 536, w: 50, h: 32,
        standX: 764, standY: 558,
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
      { id: 'utgang', label: 'the arched doorway', x: 1056, y: 396, w: 138, h: 178,
        standX: 1110, standY: 548,
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
