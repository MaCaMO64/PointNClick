(() => {
  const NOW = () => performance.now() / 1000;

  window.ROOMS.elv = {
    id: 'elv', name: 'The Riverbank', mood: 'river',
    paint: ART.elv,
    walk: { minY: 455, maxY: 592 },
    animateUnder(c, t) { ART.animElvUnder(c, t, Game); },
    animateOver(c, t) { ART.animElvOver(c, t, Game); },
    npcs: [
      { ref: 'grim', x: 1010, y: 480 },
      { ref: 'glumpeek', x: 872, y: 472 },
    ],
    hotspots: [
      { id: 'vestvei', label: 'the road west', x: 0, y: 470, w: 70, h: 130,
        standX: 80, standY: 520,
        verbs: {
          look: 'The path back toward the crossroads and the tavern. Civilization faintly whispers about soup.',
          use() { Game.goto('kryss', 1180, 522); },
        } },
      { id: 'sivrør', label: 'the reeds', x: 394, y: 412, w: 84, h: 72,
        standX: 430, standY: 500,
        verbs: {
          look: 'Reeds. They stand perfectly still. Either they are wise, or they are terrible at dancing.',
          use: 'The reeds sway. Somewhere a fish gives a tiny round of applause.',
        } },
      { id: 'brygge', label: 'the dock', x: 482, y: 370, w: 330, h: 46,
        standX: 640, standY: 468,
        verbs: {
          look: 'Wooden planks in varying states of "safe". Some of them are only theoretically attached.',
          use: 'You test a plank. It passes the test. Barely.',
        } },
      { id: 'vann', label: 'the river', x: 480, y: 268, w: 420, h: 124,
        standX: 660, standY: 458,
        verbs: {
          look: 'The river glitters. Somewhere out there a fish is having a better day than you, and it knows.',
          use: 'You dip a finger in. Cold. The river does not judge you. The river has no time for that.',
        },
        itemActions: {
          'fløyte'() {
            Game.script([
              { say: ['toke', 'A little serenade for the river. What could go wrong?'] },
              { fx: 'magic' },
              { wait: 0.3 },
              { fn: () => { Game.room._fishT = NOW(); } },
              { fx: 'splash' },
              { say: ['narrator', 'THE WATER EXPLODES. A catfish the size of a small kitchen table performs a complete somersault above the surface and lands with a splash heard three districts away.'] },
              { fn: () => {
                if (!Game.flag('fishShow')) {
                  Game.setFlag('fishShow');
                  Game.script([
                    { say: ['grim', '…You. YOU have fish-luck. I have fished here for THIRTY YEARS. And you just– with a WHISTLE?'] },
                    { say: ['toke', 'Talent. And tin.'] },
                  ]);
                }
              } },
            ]);
          },
        } },
      { id: 'botte', label: 'the fish bucket', x: 1038, y: 488, w: 60, h: 42,
        standX: 1058, standY: 540,
        verbs: {
          look: 'Grim\'s bucket. It contains one fish. The fish stares. You CAN lose a staring contest to a fish.',
          use: 'The fish blinked first. You lost.',
        } },
      { id: 'bskilt', label: 'the BOATHOUSE sign', x: 154, y: 398, w: 172, h: 42,
        standX: 240, standY: 530,
        verbs: {
          look: '"BOATHOUSE" – hand-painted with one extra letter\'s worth of confidence. Friendly folk along this river. Creative, at least.',
          use: 'The sign hangs crooked. Like so many other things in life.',
        } },
      { id: 'bdor', label: 'the boathouse door', x: 196, y: 440, w: 88, h: 100,
        standX: 240, standY: 552,
        verbs: {
          look() {
            if (!Game.flag('boatUnlocked')) return 'The boathouse door is locked with a padlock that has seen things. Older things.';
            return 'The door stands open. Inside lies BOAT NUMBER 2 – it is missing its bottom. Otherwise excellent condition.';
          },
          use() {
            if (!Game.flag('boatUnlocked')) Game.say('toke', 'Locked. The padlock clearly graduated from the academy of persistent metalwork.');
            else Game.say('toke', 'I will leave BOAT NUMBER 2 in peace. Some dreams should stay dreams.');
          },
        },
        itemActions: {
          nøkkel() {
            if (Game.flag('boatUnlocked')) { Game.think('Already open. The lock is on vacation.'); return; }
            Game.script([
              { fx: 'door' },
              { flag: ['boatUnlocked'] },
              { say: ['narrator', 'The key fits perfectly. The door opens with a creak that tells you its entire life story.'] },
              { say: ['toke', 'There lies BOAT NUMBER 2. Magnificent. No bottom. A note says "PROJECT".'] },
              { say: ['narrator', 'Out on the dock, the REAL rowboat sits chained to the mooring post.'] },
            ]);
          },
        } },
      { id: 'bat', label: 'the rowboat', x: 692, y: 356, w: 120, h: 58,
        standX: 745, standY: 470,
        verbs: {
          look() {
            if (!Game.flag('chainOff')) return 'A fine rowboat – chained to the mooring post with a padlock of sturdy municipal quality.';
            if (Game.flag('boatOared') || Game.has('åre')) return 'The boat is free AND equipped. The river should start worrying.';
            return 'The boat is free! But its two oar-locks stare back, empty. A wet cupboard without oars.';
          },
          use() { Bat_attempt(); },
        },
        itemActions: {
          'åre'() { Bat_attempt(); },
          nøkkel() {
            if (Game.flag('chainOff')) { Game.think('The chain is already history.'); return; }
            Game.script([
              { fx: 'door' },
              { flag: ['chainOff'] },
              { say: ['narrator', 'The lock clicks open and falls into the water with an offended plop. The rowboat is FREE!'] },
              { say: ['toke', 'Now it just needs oars. Details. TINY details.'] },
            ]);
          },
        } },
    ],
    onEnter() {
      if (!Game.flag('visitedElv')) {
        Game.setFlag('visitedElv');
        Game.sayLines([
          ['narrator', 'The Riverbank. Birds singing, glittering water, and a gnome fishing like the river owes him money.'],
          ['narrator', 'Something small and grey also feels… observed. Probably nothing. Probably.'],
        ]);
      }
    },
  };

  function Bat_attempt() {
    if (!Game.flag('chainOff')) {
      Game.say('toke', 'Chained down. The lock laughs at me. A METALLIC laugh.');
      return;
    }
    if (Game.flag('boatOared')) {
      Game.script([
        { say: ['toke', 'The oar still lives under the seat. It has accepted its new home.'] },
        { fx: 'splash' },
        { wait: 0.3 },
        { goto: { room: 'skog', x: 90, y: 528 } },
      ]);
      return;
    }
    if (!Game.has('åre')) {
      Game.sayLines([
        ['toke', 'Free boat, zero oars. I could paddle with my hands, but the river has already heard that argument.'],
        ['narrator', '(Grim by the shore looks like someone who owns an oar. And opinions about food.)'],
      ]);
      return;
    }
    Game.removeItem('åre');
    Game.setFlag('boatOared');
    Game.script([
      { say: ['toke', 'One oar. One motivated halfling. One opinionated river. LET\'S GO.'] },
      { fx: 'splash' },
      { wait: 0.4 },
      { fn: () => {
        if (Game.flag('joinedRando')) Game.say('narrator', 'You row out into the current. Rando rows backwards, on principle, "to watch for enemies".');
        else Game.say('narrator', 'You row out into the current alone, whistling a brave little tune against the wind.');
      } },
      { goto: { room: 'skog', x: 90, y: 528 } },
      { say: ['narrator', 'Trollwood receives you with moss, darkness, and a suspicious number of eyes.'] },
    ]);
  }

  window.ROOMS.skog = {
    id: 'skog', name: 'Trollwood', mood: 'forest',
    paint: ART.skog,
    pngTint: 'rgba(16,20,56,0.42)',
    walk: { minY: 485, maxY: 592 },
    animateOver(c, t) { ART.animSkogOver(c, t, Game); },
    npcs: [
      { ref: 'bent', x: 985, y: 468 },
      { ref: 'goblin', x: 262, y: 540 },
      { ref: 'goblin', x: 320, y: 548 },
      { ref: 'goblin', x: 378, y: 534 },
    ],
    hotspots: [
      { id: 'vestvei', label: 'the path west', x: 0, y: 490, w: 70, h: 120,
        standX: 80, standY: 525,
        verbs: {
          look: 'The path back toward the riverbank. The reeds wave goodbye. They are good at standing still and bad at farewells.',
          use() { Game.goto('elv', 1180, 505); },
        } },
      { id: 'ugle', label: 'the owl', x: 178, y: 148, w: 46, h: 52,
        verbs: {
          look: 'An owl. She has seen everything. She judges gently. That is somehow worse than harsh judgment.',
          talk: '*hoo* (Translation: young people.)',
        } },
      { id: 'baal', label: 'the goblin campfire', x: 264, y: 486, w: 72, h: 58,
        standX: 300, standY: 552,
        verbs: {
          look: 'A fire built by goblins. Rare hospitality – right up until you wonder what they usually set ON fire.',
          use: 'You poke the fire. Sparks dance. No goblin protests. Yet.',
        } },
      { id: 'leir', label: 'the goblin camp', x: 228, y: 460, w: 184, h: 112,
        standX: 320, standY: 558,
        verbs: {
          look() {
            if (!Game.flag('goblinsAsleep')) return 'Three goblins around the fire. A hand-painted sign reads "NO MUSIC BEYOND THIS POINT – MANAGEMENT". They argue passionately anyway. Probably mustard.';
            return 'Three sleeping goblins. Standing up. With dignity. Roughly.';
          },
          talk() {
            if (!Game.flag('goblinsAsleep')) {
              Game.say('goblin', '*all three turn around* SOFT HOBBIT! GOOD WITH MUSTARD!');
            } else {
              Game.say('narrator', 'The sleeping goblins mumble something about soup and management.');
            }
          },
        },
        itemActions: {
          'fløyte'() { window.NPC_DEFS.goblin.itemActions['fløyte'](); },
        } },
      { id: 'sopp', label: 'glowing mushrooms', x: 326, y: 518, w: 66, h: 52,
        standX: 358, standY: 558,
        verbs: {
          look: 'Mushrooms that glow. Either they are magical, or there is a party going on in the roots. Either answer is fine.',
          take: 'Edible? Unclear. Glowing? Yes. The math argues against dinner.',
        } },
      { id: 'hultre', label: 'the hollow tree', x: 564, y: 388, w: 68, h: 114,
        standX: 600, standY: 540,
        verbs: {
          look() {
            if (Game.has('ring')) return 'The hollow tree. Two wet eyes stare back from the darkness. They seem… invested.';
            return 'A hollow tree. Perfect for hiding in, or living in if you are a very ambitious squirrel.';
          },
          use: 'You knock on the tree. Inside it echoes hollowly. Or almost hollowly. Depending on the evening.',
        } },
      { id: 'lykt', label: 'the decorative lantern', x: 802, y: 382, w: 44, h: 52,
        standX: 820, standY: 545,
        verbs: {
          look: 'A lantern without oil, without flame, without purpose. Pure decoration. Exactly like back home.',
          use: '*click click*. Nothing. The lantern is more ornament than light source. Like Uncle Bongo\'s diploma on the wall.',
        } },
      { id: 'bro', label: 'the bridge', x: 824, y: 418, w: 334, h: 80,
        standX: 900, standY: 545,
        verbs: {
          look: 'An old stone bridge across a ravine. The bridge is solid. The figure on it looks less solid. He looks like a bridge WITH OPINIONS.',
          talk() { window.NPC_DEFS.bent.talk(); },
          use() { window.NPC_DEFS.bent.talk(); },
        } },
      { id: 'ostvei', label: 'the road over the bridge', x: 1186, y: 428, w: 94, h: 172,
        standX: 1160, standY: 520,
        verbs: {
          look() {
            if (!Game.flag('goblinsAsleep')) return 'The road east runs straight past the goblin camp. Three pairs of eyes track you with the patience of predators on a lunch break.';
            if (!Game.flag('trollPassed')) return 'The road onward to Mount Pleasant crosses the bridge. The bridge charges a TOLL. Payable in poetry.';
            return 'The road over the bridge lies open. Bent composes in the background. It actually sounds nice now.';
          },
          use() {
            if (!Game.flag('goblinsAsleep')) {
              Game.script([
                { say: ['goblin', 'HALT! Camp rules! NOBODY passes the camp! Leader\'s orders!'] },
                { say: ['toke', '(Their leader sounds strict. Maybe I should actually READ their precious camp sign.)'] },
              ]);
              return;
            }
            if (!Game.flag('trollPassed')) {
              Game.say('bent', 'My bridge. My rules. Pay me your POEM.');
            } else Game.goto('vulkan', 90, 532);
          },
        } },
    ],
    onRingToggle(on) {
      if (on && !Game.flag('ringGagSkog') && Game.flag('questStarted')) {
        Game.setFlag('ringGagSkog');
        Game.script([
          { say: ['narrator', 'The world turns grey. In the hollow tree, two eyes light up like wet coins.'] },
          { say: ['glum', '*hissing from nowhere* THE TREASURE…'] },
          { ring: false },
          { say: ['toke', '(Noted: the forest HAS an opinion about my luggage.)'] },
        ]);
      }
    },
  };
})();
