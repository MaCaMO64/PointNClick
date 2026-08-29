const GAME_ICONS = window.GAME_ICONS || {};
window.GAME_ICONS = GAME_ICONS;

window.ITEMS = {
  stokk:   { name: 'Stick',             icon: GAME_ICONS.stokk },
  eple:    { name: 'Apple',             icon: GAME_ICONS.eple },
  ring:    { name: 'The Great Ring',    icon: GAME_ICONS.ring },
  mynter:  { name: 'Pouch of coins',    icon: GAME_ICONS.mynter },
  'fløyte':{ name: 'Tin whistle',       icon: GAME_ICONS['fløyte'] },
  'pølse': { name: 'Salted sausage',    icon: GAME_ICONS['pølse'] },
  'øl':    { name: 'Mug of ale',        icon: GAME_ICONS['øl'] },
  skje:    { name: 'Lucky spoon',       icon: GAME_ICONS.skje },
  nøkkel:  { name: 'Boathouse key',     icon: GAME_ICONS.nøkkel },
  'åre':   { name: 'Oar',               icon: GAME_ICONS['åre'] },
  avis:    { name: '"Mordor Times"',    icon: GAME_ICONS.avis },
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
