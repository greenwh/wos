/**
 * @typedef {'LEAD' | 'JOIN' | 'GARR' | 'SOLO'} RoleCode
 * @typedef {'PVP'|'FAC'|'SFC'|'SVS'|'BHT'|'PLT'|'BNT'|'LAB'|'CJO'|'ACH'|'CTY'|'DEF'} ActivityCode
 *
 * @typedef {Object} RatioRow
 * @property {RoleCode} role
 * @property {number} infantry
 * @property {number} lancer
 * @property {number} marksman
 * @property {string} reasoning
 * @property {string} [genNote]
 *
 * @typedef {Object} Activity
 * @property {ActivityCode} code
 * @property {string} name
 * @property {string} [blurb]
 * @property {RatioRow[]} roles
 */

export const TROOP_RATIOS = [
  {
    code: 'PVP',
    name: 'Open-Field PvP / City Burn',
    blurb: 'Attacking enemy cities or burning in open-world SvS.',
    roles: [
      { role: 'LEAD', infantry: 50, lancer: 20, marksman: 30,
        reasoning: "Standard offensive rally. Joiners fill most of the troops anyway; lead keeps a balanced core so the rally doesn't collapse if joiners under-deliver." },
      { role: 'JOIN', infantry: 50, lancer: 20, marksman: 30,
        reasoning: "Hard-to-counter balanced joiner composition. Infantry survives long enough for marksman to deliver damage. Most widely cited ratio across 2025–2026 guides." },
      { role: 'GARR', infantry: 60, lancer: 20, marksman: 20,
        reasoning: "Defensive lean with some damage retained. 60/20/20 beats pure 60/40/0 for opportunistic counter-damage." },
    ],
  },
  {
    code: 'FAC',
    name: 'Facility Battle',
    blurb: 'Foundry, Fortress, Stronghold — any alliance facility fight.',
    roles: [
      { role: 'LEAD', infantry: 50, lancer: 20, marksman: 30,
        reasoning: "Facility rallies use the same PvP balanced lead. Foundry and Fortress guides converge on this." },
      { role: 'JOIN', infantry: 50, lancer: 20, marksman: 30,
        reasoning: "Standard joiner. In chaotic multi-rally Foundry fights the 50% infantry buffer matters — you're taking constant hits." },
      { role: 'GARR', infantry: 60, lancer: 20, marksman: 20,
        reasoning: "Defensive reinforcement. Some alliances go 60/40/0 if expecting sustained rallies with no counter-damage need." },
    ],
  },
  {
    code: 'SFC',
    name: 'Sunfire Castle',
    blurb: 'SvS castle fight. Alliance-coordinated.',
    roles: [
      { role: 'LEAD', infantry: 50, lancer: 20, marksman: 30,
        reasoning: "Confirmed by 2026 SvS formation meta. Alliance-level standard for T9/T10 attack rallies on the castle." },
      { role: 'JOIN', infantry: 50, lancer: 20, marksman: 30,
        reasoning: "Default SFC joiner. Some alliances bump to 60/20/20 for sustained multi-wave fights where hospital overflow is a concern." },
      { role: 'GARR', infantry: 60, lancer: 40, marksman: 0,
        reasoning: "Consensus castle garrison. Turrets target infantry first; infantry-heavy survives longer. Lancers give secondary damage. 70/30/0 is a lighter-damage alternative." },
    ],
  },
  {
    code: 'SVS',
    name: 'SvS Battle Phase (open-world)',
    blurb: 'Flag fights and skirmishes during SvS — not the castle.',
    roles: [
      { role: 'LEAD', infantry: 50, lancer: 20, marksman: 30,
        reasoning: "Open-world SvS flag fights use standard attack." },
      { role: 'JOIN', infantry: 50, lancer: 20, marksman: 30,
        reasoning: "Standard joiner." },
      { role: 'GARR', infantry: 70, lancer: 30, marksman: 0,
        reasoning: "Heavier infantry defense during SvS — your city may be hit while offline. Per widely circulated alliance cheat sheets." },
    ],
  },
  {
    code: 'BHT',
    name: 'Bear Trap',
    blurb: 'Alliance bear hunt. Pure PvE, no counter triangle.',
    roles: [
      { role: 'LEAD', gen: 'early', infantry: 0, lancer: 10, marksman: 90,
        reasoning: "Bear has fixed HP and no counter triangle so maximize lethality. Joiners bring the infantry meat shield.",
        genNote: "Gen 1–7: keep ≥5,000 infantry in the march as a safety floor." },
      { role: 'LEAD', gen: 'gen8+', infantry: 0, lancer: 10, marksman: 90,
        reasoning: "Pure DPS — lancer lethality no longer matches marksman, drop it." },
      { role: 'JOIN', gen: 'early', infantry: 20, lancer: 20, marksman: 60,
        reasoning: "Pre-Gen 8 balance point: infantry to absorb hits and stabilize lancer/marksman skill triggers.",
        genNote: "Pre-Gen 8 the 25–30% lancer is common to stably proc lancer hero buffs." },
      { role: 'JOIN', gen: 'gen8+', infantry: 10, lancer: 15, marksman: 75,
        reasoning: "Gen 8+ lethality shift. Marksman pulls ahead by ~358 points." },
    ],
  },
  {
    code: 'PLT',
    name: 'Polar Terror',
    blurb: 'World-map PvE boss rally. Same logic as Bear Trap.',
    roles: [
      { role: 'LEAD', gen: 'early', infantry: 0, lancer: 10, marksman: 90,
        reasoning: "PvE boss with no counter triangle — maximize marksman for peak damage.",
        genNote: "Pre-Gen 8 keep infantry ≥5,000 as a safety floor." },
      { role: 'LEAD', gen: 'gen8+', infantry: 0, lancer: 10, marksman: 90,
        reasoning: "Same as BHT at Gen 8+: pure DPS, lancer no longer matches marksman lethality." },
      { role: 'JOIN', gen: 'early', infantry: 20, lancer: 20, marksman: 60,
        reasoning: "Balanced joiner; enough infantry to survive across levels without being glass cannons." },
      { role: 'JOIN', gen: 'gen8+', infantry: 10, lancer: 15, marksman: 75,
        reasoning: "Gen 8+ lethality shift — mirrors BHT. Marksman pulls ahead, drop infantry." },
    ],
  },
  {
    code: 'BNT',
    name: 'Intel Bounty Beast',
    blurb: 'Lighthouse Expert+ bounty missions. Solo.',
    roles: [
      { role: 'SOLO', infantry: 20, lancer: 40, marksman: 40,
        reasoning: "Bounty missions recommend unrealistic power levels — the workaround is ratio + hero synergy. 20/40/40 (per 2026 Lighthouse meta) beats recommended power by 20–30M. Earlier 20/20/60 advice is outdated for Expert+." },
    ],
  },
  {
    code: 'LAB',
    name: 'Labyrinth',
    blurb: 'PvE solo using Expedition stats. 5 attempts/day.',
    roles: [
      { role: 'SOLO', infantry: 50, lancer: 20, marksman: 30,
        reasoning: "Game AI defaults to 33/33/33 which is suboptimal — override to 50/20/30 as baseline. Try 60/15/25 for infantry-favored zones (stage 10 runs at ~53/27/20 against you).",
        genNote: "Experiment within 5 daily attempts. Zone expedition buffs change daily; the optimal ratio varies." },
    ],
  },
  {
    code: 'CJO',
    name: 'Crazy Joe',
    blurb: 'Turn-based alliance defense event. Infantry attacks first.',
    roles: [
      { role: 'GARR', infantry: 90, lancer: 10, marksman: 0,
        reasoning: "Infantry attacks first, then lancers, then marksmen. Marksmen rarely get a turn before the wave dies. Especially Wave 10 and 20 HQ defense." },
      { role: 'SOLO', infantry: 90, lancer: 10, marksman: 0,
        reasoning: "Reinforcement marches to allies use the same composition." },
    ],
  },
  {
    code: 'ACH',
    name: 'Alliance Championship',
    blurb: 'Weekly 3-lane alliance vs alliance tournament.',
    roles: [
      { role: 'LEAD', infantry: 50, lancer: 20, marksman: 30,
        reasoning: "Standard AC meta; hard to counter. Works with any hero generation." },
      { role: 'JOIN', infantry: 50, lancer: 20, marksman: 30,
        reasoning: "Standard balanced composition. The in-game default of 33/33/33 is worse — manually set sliders." },
    ],
  },
  {
    code: 'CTY',
    name: 'City Defense',
    blurb: 'Shield-down city garrison. Getting raided or expecting to.',
    roles: [
      { role: 'GARR', infantry: 60, lancer: 20, marksman: 20,
        reasoning: "General-purpose city garrison. Heavier infantry with lancer/marksman retained to counter-damage. If specifically expecting SvS raid pressure, shift to 70/30/0." },
    ],
  },
  {
    code: 'DEF',
    name: 'Default / Unsure',
    blurb: "Fallback when you don't know what you're about to face.",
    roles: [
      { role: 'SOLO', infantry: 50, lancer: 20, marksman: 30,
        reasoning: "Safest fallback. Multiple creators name this the 'can't go wrong' starting point." },
    ],
  },
];

export const ACTIVITY_CODES = TROOP_RATIOS.map(a => a.code);

export function getActivityByCode(code) {
  return TROOP_RATIOS.find(a => a.code === code) || null;
}

export const ROLE_LABELS = {
  LEAD: 'Rally Leader',
  JOIN: 'Rally Joiner',
  GARR: 'Garrison',
  SOLO: 'Solo March',
};

export const ROLE_ORDER = ['LEAD', 'JOIN', 'GARR', 'SOLO'];

if (import.meta.env.DEV) {
  TROOP_RATIOS.forEach(a => a.roles.forEach(r => {
    const sum = r.infantry + r.lancer + r.marksman;
    if (sum !== 100) console.warn(`Ratio mismatch: ${a.code} ${r.role} sums to ${sum}`);
  }));
}
