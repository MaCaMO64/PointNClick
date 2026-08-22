window.ITEMS = {
  stokk:   { name: 'Stick',             icon: ART.ICONS.stokk },
  eple:    { name: 'Apple',             icon: ART.ICONS.eple },
  ring:    { name: 'The Great Ring',    icon: ART.ICONS.ring },
  mynter:  { name: 'Pouch of coins',    icon: ART.ICONS.mynter },
  'fløyte':{ name: 'Tin whistle',       icon: ART.ICONS['fløyte'] },
  'pølse': { name: 'Salted sausage',    icon: ART.ICONS['pølse'] },
  'øl':    { name: 'Mug of ale',        icon: ART.ICONS['øl'] },
  skje:    { name: 'Lucky spoon',       icon: ART.ICONS.skje },
  nøkkel:  { name: 'Boathouse key',     icon: ART.ICONS.nøkkel },
  'åre':   { name: 'Oar',               icon: ART.ICONS['åre'] },
  avis:    { name: '"Mordor Times"',    icon: ART.ICONS.avis },
};

window.COMBOS = {
  'stokk+eple': () => {
    Game.think('I could craft some kind of fruit-on-a-stick situation. But that sounds like effort.');
    AudioSys.fx('error');
  },
  'fløyte+ring': () => {
    Game.say('ring', '(Do NOT mix me with musical instruments. I am a serious accessory ring.)');
  },
  'øl+skje': () => {
    Game.think('Spoon in the ale? Halvor would consider that fine dining.');
  },
};

window.NPC_HELPERS = {};
NPC_HELPERS.person = (style, extra) => (c, o) => ART.person(c, Object.assign({}, o, { style }, typeof extra === 'function' ? extra(o) : extra));
NPC_HELPERS.rider = (c, o) => ART.rider(c, Object.assign({}, o, { reading: Game.flag('perrPaid') }));
