// Wally Buff Strategy seed — light spender account
const WALLY_BUFF_ITEMS = [
  // === TIER 1: DO NOW ===
  {
    id: "wb-001", category: "research", label: "Battle tree: balance type stats",
    notes: "Infantry Defense first, then spread evenly across types. Permanent % increase.",
    priorityTier: 1, status: "todo", blockReason: "", sortOrder: 1,
    spendFlag: false, furnaceGate: null
  },
  {
    id: "wb-002", category: "research", label: "Regimental Expansion: max current level",
    notes: "More troops per march. Always push this when Research Center levels up.",
    priorityTier: 1, status: "todo", blockReason: "", sortOrder: 2,
    spendFlag: false, furnaceGate: null
  },
  {
    id: "wb-003", category: "vip", label: "VIP status: keep active",
    notes: "10k gems/month. Use event gems first. Never let it lapse.",
    priorityTier: 1, status: "active", blockReason: "", sortOrder: 3,
    spendFlag: false, furnaceGate: null
  },
  {
    id: "wb-004", category: "vip", label: "Push toward VIP 8",
    notes: "Daily Alliance Shop VIP XP purchase — never skip. VIP 8 = daily Mythic shards.",
    priorityTier: 1, status: "active", blockReason: "", sortOrder: 4,
    spendFlag: false, furnaceGate: null
  },
  {
    id: "wb-005", category: "troops", label: "Promote all troops to highest available tier",
    notes: "Lower-tier troops waste Infirmary space. Promote or dismiss.",
    priorityTier: 1, status: "todo", blockReason: "", sortOrder: 5,
    spendFlag: false, furnaceGate: null
  },

  // === TIER 2: NEXT ===
  {
    id: "wb-006", category: "chief-gear", label: "Craft all 6 Chief Gear pieces",
    notes: "Unlocks at Furnace 22. Even low quality — get the set bonuses going.",
    priorityTier: 2, status: "blocked", blockReason: "Need Furnace 22 (currently F20)",
    sortOrder: 1, spendFlag: false, furnaceGate: 22
  },
  {
    id: "wb-007", category: "chief-gear", label: "Enhance: Infantry Coat/Pants first",
    notes: "Frontline survivability. Then Marksman Ring/Cane, then Lancer.",
    priorityTier: 2, status: "blocked", blockReason: "Need chief gear crafted first",
    sortOrder: 2, spendFlag: false, furnaceGate: 22
  },
  {
    id: "wb-008", category: "chief-gear", label: "3-piece set bonus active (Defense)",
    notes: "Craft 3 pieces of same quality tier. All-troop Defense bonus.",
    priorityTier: 2, status: "blocked", blockReason: "Need chief gear crafted first",
    sortOrder: 3, spendFlag: false, furnaceGate: 22
  },
  {
    id: "wb-009", category: "chief-gear", label: "6-piece set bonus active (Attack)",
    notes: "All 6 pieces at same quality. All-troop Attack bonus. Keep pieces within 1-2 quality levels.",
    priorityTier: 2, status: "blocked", blockReason: "Need all 6 pieces crafted",
    sortOrder: 4, spendFlag: false, furnaceGate: 22
  },
  {
    id: "wb-010", category: "pets", label: "Combat pets: level Cave Lion priority",
    notes: "+10% All Troop Attack at max skill. S-tier. Leveling also gives passive Attack/Defense.",
    priorityTier: 2, status: "active", blockReason: "", sortOrder: 5,
    spendFlag: false, furnaceGate: 18
  },
  {
    id: "wb-011", category: "pets", label: "Combat pets: level Saber-Tooth Tiger",
    notes: "+10% Troop Lethality at max skill. S-tier alongside Cave Lion.",
    priorityTier: 2, status: "active", blockReason: "", sortOrder: 6,
    spendFlag: false, furnaceGate: null
  },
  {
    id: "wb-012", category: "pets", label: "Pet refinement: Cave Lion \u2192 purple stats",
    notes: "Refinement gives Lethality + Health passives. Use Common Wild Marks to purple tier, then Advanced.",
    priorityTier: 2, status: "todo", blockReason: "", sortOrder: 7,
    spendFlag: false, furnaceGate: null
  },
  {
    id: "wb-013", category: "pets", label: "Pre-event routine: activate combat pet skills",
    notes: "Cave Lion + Saber-Tooth before Foundry/AC/SvS. 2hr duration, ~20hr cooldown. Time for event window.",
    priorityTier: 2, status: "todo", blockReason: "", sortOrder: 8,
    spendFlag: false, furnaceGate: null
  },
  {
    id: "wb-014", category: "skins", label: "Collect all free city skins",
    notes: "+2% Troop Attack each, stacking. Check events, milestones, SvS rewards.",
    priorityTier: 2, status: "active", blockReason: "", sortOrder: 9,
    spendFlag: false, furnaceGate: null
  },
  {
    id: "wb-015", category: "skins", label: "Collect all free teleport skins",
    notes: "+2% Troop Lethality each, stacking. Same sources as city skins.",
    priorityTier: 2, status: "active", blockReason: "", sortOrder: 10,
    spendFlag: false, furnaceGate: null
  },
  {
    id: "wb-016", category: "gem-buffs", label: "Stockpile buff items from events/shops",
    notes: "Don't buy with gems unless event-day. Hoard Attack Up, Lethality Up, etc. from event rewards.",
    priorityTier: 2, status: "active", blockReason: "", sortOrder: 11,
    spendFlag: false, furnaceGate: null
  },
  {
    id: "wb-017", category: "alliance", label: "Daily alliance tech contribution",
    notes: "Resources or gems for tokens. Prioritize Battle tree when setting Recommended tag as officer.",
    priorityTier: 2, status: "active", blockReason: "", sortOrder: 12,
    spendFlag: false, furnaceGate: null
  },
  {
    id: "wb-018", category: "alliance", label: "Alliance Battle tech: recommend Attack/Lethality",
    notes: "Use Recommended tag for +20% contribution bonus. Coordinate with other officers.",
    priorityTier: 2, status: "active", blockReason: "", sortOrder: 13,
    spendFlag: false, furnaceGate: null
  },
  {
    id: "wb-019", category: "island", label: "Tree of Life \u2192 Level 5 (Attack buff)",
    notes: "Requires Prosperity from decorations. Focus on upgradeable buff decorations over cosmetics.",
    priorityTier: 2, status: "todo", blockReason: "", sortOrder: 14,
    spendFlag: false, furnaceGate: 19
  },
  {
    id: "wb-020", category: "island", label: "Luminary Citadel: collect + upgrade copies",
    notes: "+10% Troops Attack at max (level 10). Copies from Labyrinth rewards. 58 copies to max.",
    priorityTier: 2, status: "active", blockReason: "", sortOrder: 15,
    spendFlag: false, furnaceGate: 19
  },
  {
    id: "wb-021", category: "island", label: "Hero's Sanctum: collect + upgrade copies",
    notes: "+2.5% Troops Defense at max (level 5). Copies from Labyrinth milestone rewards. 15 copies to max.",
    priorityTier: 2, status: "active", blockReason: "", sortOrder: 16,
    spendFlag: false, furnaceGate: 19
  },
  {
    id: "wb-022", category: "island", label: "Basic Dock: upgrade for deployment capacity",
    notes: "+1,000 deployment at max. Costly in Life Essence — defer until T9+ troops and other island buffs done.",
    priorityTier: 2, status: "todo", blockReason: "", sortOrder: 17,
    spendFlag: false, furnaceGate: 19
  },

  // === TIER 3: LONG-TERM ===
  {
    id: "wb-023", category: "chief-charms", label: "Unlock charms at Furnace 25-26",
    notes: "Chief Charms boost Troop Lethality + Health. 18 charm slots across 6 gear pieces.",
    priorityTier: 3, status: "blocked", blockReason: "Need Furnace 25+",
    sortOrder: 1, spendFlag: false, furnaceGate: 25
  },
  {
    id: "wb-024", category: "chief-charms", label: "Level charms evenly (uniformity bonus)",
    notes: "Uniformity bonus grants extra Attack + Defense. Don't over-level one charm at expense of others.",
    priorityTier: 3, status: "blocked", blockReason: "Need charms unlocked",
    sortOrder: 2, spendFlag: false, furnaceGate: 25
  },
  {
    id: "wb-025", category: "war-academy", label: "Build War Academy at Furnace 30",
    notes: "Unlocks T11 troops and Fire Crystal tech tree. Major long-term power spike.",
    priorityTier: 3, status: "blocked", blockReason: "Need Furnace 30",
    sortOrder: 3, spendFlag: false, furnaceGate: 30
  },
  {
    id: "wb-026", category: "island", label: "Tree of Life \u2192 Level 10 (Lethality buff)",
    notes: "Requires massive Prosperity. Level 5 Attack buff first, then push toward 10.",
    priorityTier: 3, status: "blocked", blockReason: "Need Tree of Life Lv5 first",
    sortOrder: 4, spendFlag: false, furnaceGate: 19
  },
  {
    id: "wb-027", category: "vip", label: "Push toward VIP 9+ (combat stat bonuses)",
    notes: "VIP 9-12 provide Troop Attack, Defense, Lethality, Health bonuses. Up to +16% at VIP 12. Long grind.",
    priorityTier: 3, status: "active", blockReason: "", sortOrder: 5,
    spendFlag: true, furnaceGate: null
  },
  {
    id: "wb-028", category: "troops", label: "Fire Crystal troop research",
    notes: "Post-Furnace 30. Fire Crystal troops have passive combat skills at certain FC levels.",
    priorityTier: 3, status: "blocked", blockReason: "Need Furnace 30 + War Academy",
    sortOrder: 6, spendFlag: false, furnaceGate: 30
  },
];

const WALLY_PRE_EVENT = [
  // PERMANENT
  { id: "wpe-01", label: "Hero gear equipped on correct heroes", category: "permanent", checked: false, notes: "" },
  { id: "wpe-02", label: "Chief gear equipped and enhanced", category: "permanent", checked: false, notes: "Once crafted at F22" },
  { id: "wpe-03", label: "Skins equipped (city + teleport)", category: "permanent", checked: false, notes: "Verify after acquiring new skins" },
  { id: "wpe-04", label: "VIP status active", category: "permanent", checked: false, notes: "" },
  { id: "wpe-05", label: "Combat heroes assigned (not gathering)", category: "permanent", checked: false, notes: "" },
  // TIMED
  { id: "wpe-06", label: "Cave Lion skill (Feral Anthem) \u2014 +10% Attack", category: "timed", checked: false, notes: "2hr duration" },
  { id: "wpe-07", label: "Saber-Tooth skill (Apex Assault) \u2014 +10% Lethality", category: "timed", checked: false, notes: "2hr duration" },
  { id: "wpe-08", label: "Frost Gorilla skill \u2014 +10% Health", category: "timed", checked: false, notes: "If available. 2hr duration" },
  { id: "wpe-09", label: "Snow Ape skill \u2014 +15k Squad Capacity", category: "timed", checked: false, notes: "For rally events" },
  { id: "wpe-10", label: "Gem buff: Troops Attack Up", category: "timed", checked: false, notes: "+20% for 12hr or +10% for 2hr" },
  { id: "wpe-11", label: "Gem buff: Troops Lethality Up", category: "timed", checked: false, notes: "+20% for 12hr or +10% for 2hr" },
  { id: "wpe-12", label: "Gem buff: Troops Defense Up", category: "timed", checked: false, notes: "+20% for 12hr or +10% for 2hr" },
  { id: "wpe-13", label: "Gem buff: Troops Health Up", category: "timed", checked: false, notes: "+20% for 12hr or +10% for 2hr" },
  { id: "wpe-14", label: "Gem buff: Deployment Capacity Up", category: "timed", checked: false, notes: "+20% for 12hr or +10% for 2hr" },
  { id: "wpe-15", label: "Troop ratio set to 50/20/30 (not default 33/33/33)", category: "timed", checked: false, notes: "Must manually adjust every time" },
  // EVENT-SPECIFIC
  { id: "wpe-16", label: "AC: register team while all buffs active", category: "event-specific", checked: false, notes: "Buffs snapshot on registration" },
  { id: "wpe-17", label: "Foundry: Advanced Teleporters stocked (10-15)", category: "event-specific", checked: false, notes: "" },
  { id: "wpe-18", label: "Bear Hunt: healing speedups ready (2-3hr worth)", category: "event-specific", checked: false, notes: "" },
  { id: "wpe-19", label: "SvS: full 12-hour gem buffs for Castle Battle window", category: "event-specific", checked: false, notes: "Time activation for 10:00 UTC Saturday" },
];

// Beav Buff Strategy seed — pure F2P account, no spend-flagged items
const BEAV_BUFF_ITEMS = [
  // === TIER 1: DO NOW ===
  {
    id: "bb-001", category: "research", label: "Battle tree: balance type stats",
    notes: "Infantry Defense first, then spread evenly. Permanent % increase — zero-cost priority.",
    priorityTier: 1, status: "todo", blockReason: "", sortOrder: 1,
    spendFlag: false, furnaceGate: null
  },
  {
    id: "bb-002", category: "research", label: "Regimental Expansion: max current level",
    notes: "More troops per march. Always push when Research Center levels up.",
    priorityTier: 1, status: "todo", blockReason: "", sortOrder: 2,
    spendFlag: false, furnaceGate: null
  },
  {
    id: "bb-003", category: "vip", label: "VIP status: keep active",
    notes: "10k gems/month — gems are scarce, prioritize Alliance Shop VIP XP daily. Never let it lapse.",
    priorityTier: 1, status: "active", blockReason: "", sortOrder: 3,
    spendFlag: false, furnaceGate: null
  },
  {
    id: "bb-004", category: "vip", label: "Push toward VIP 8",
    notes: "Daily Alliance Shop VIP XP purchase — never skip. VIP 8 = daily Mythic shards. F2P gem budget is tight.",
    priorityTier: 1, status: "active", blockReason: "", sortOrder: 4,
    spendFlag: false, furnaceGate: null
  },
  {
    id: "bb-005", category: "troops", label: "Promote all troops to highest available tier",
    notes: "Lower-tier troops waste Infirmary space. Promote or dismiss.",
    priorityTier: 1, status: "todo", blockReason: "", sortOrder: 5,
    spendFlag: false, furnaceGate: null
  },

  // === TIER 2: NEXT ===
  {
    id: "bb-006", category: "chief-gear", label: "Craft all 6 Chief Gear pieces",
    notes: "Unlocks at Furnace 22. Even low quality — get the set bonuses going. F2P materials from Polar Terror + Beast Hunting.",
    priorityTier: 2, status: "blocked", blockReason: "Need Furnace 22",
    sortOrder: 1, spendFlag: false, furnaceGate: 22
  },
  {
    id: "bb-007", category: "chief-gear", label: "Enhance: Infantry Coat/Pants first",
    notes: "Frontline survivability. Then Marksman Ring/Cane, then Lancer. Materials from rallies and events.",
    priorityTier: 2, status: "blocked", blockReason: "Need chief gear crafted first",
    sortOrder: 2, spendFlag: false, furnaceGate: 22
  },
  {
    id: "bb-008", category: "chief-gear", label: "3-piece set bonus active (Defense)",
    notes: "Craft 3 pieces of same quality tier. All-troop Defense bonus.",
    priorityTier: 2, status: "blocked", blockReason: "Need chief gear crafted first",
    sortOrder: 3, spendFlag: false, furnaceGate: 22
  },
  {
    id: "bb-009", category: "chief-gear", label: "6-piece set bonus active (Attack)",
    notes: "All 6 pieces at same quality. All-troop Attack bonus. Keep pieces within 1-2 quality levels.",
    priorityTier: 2, status: "blocked", blockReason: "Need all 6 pieces crafted",
    sortOrder: 4, spendFlag: false, furnaceGate: 22
  },
  {
    id: "bb-010", category: "pets", label: "Combat pets: level Cave Lion priority",
    notes: "+10% All Troop Attack at max skill. S-tier. Leveling gives passive Attack/Defense.",
    priorityTier: 2, status: "active", blockReason: "", sortOrder: 5,
    spendFlag: false, furnaceGate: 18
  },
  {
    id: "bb-011", category: "pets", label: "Combat pets: level Saber-Tooth Tiger",
    notes: "+10% Troop Lethality at max skill. S-tier alongside Cave Lion.",
    priorityTier: 2, status: "active", blockReason: "", sortOrder: 6,
    spendFlag: false, furnaceGate: null
  },
  {
    id: "bb-012", category: "pets", label: "Pet refinement: Cave Lion \u2192 purple stats",
    notes: "Refinement gives Lethality + Health passives. Use Common Wild Marks to purple tier, then Advanced.",
    priorityTier: 2, status: "todo", blockReason: "", sortOrder: 7,
    spendFlag: false, furnaceGate: null
  },
  {
    id: "bb-013", category: "pets", label: "Pre-event routine: activate combat pet skills",
    notes: "Cave Lion + Saber-Tooth before Foundry/AC/SvS. 2hr duration, ~20hr cooldown.",
    priorityTier: 2, status: "todo", blockReason: "", sortOrder: 8,
    spendFlag: false, furnaceGate: null
  },
  {
    id: "bb-014", category: "skins", label: "Collect all free city skins",
    notes: "+2% Troop Attack each, stacking. Events, milestones, SvS rewards — all F2P sources.",
    priorityTier: 2, status: "active", blockReason: "", sortOrder: 9,
    spendFlag: false, furnaceGate: null
  },
  {
    id: "bb-015", category: "skins", label: "Collect all free teleport skins",
    notes: "+2% Troop Lethality each, stacking. Same F2P sources as city skins.",
    priorityTier: 2, status: "active", blockReason: "", sortOrder: 10,
    spendFlag: false, furnaceGate: null
  },
  {
    id: "bb-016", category: "gem-buffs", label: "Stockpile buff items from events/shops",
    notes: "Never buy with gems — F2P gem budget too tight. Hoard from event rewards only.",
    priorityTier: 2, status: "active", blockReason: "", sortOrder: 11,
    spendFlag: false, furnaceGate: null
  },
  {
    id: "bb-017", category: "alliance", label: "Daily alliance tech contribution",
    notes: "Resources for tokens (save gems). Prioritize Battle tree with Recommended tag.",
    priorityTier: 2, status: "active", blockReason: "", sortOrder: 12,
    spendFlag: false, furnaceGate: null
  },
  {
    id: "bb-018", category: "alliance", label: "Alliance Battle tech: recommend Attack/Lethality",
    notes: "Use Recommended tag for +20% contribution bonus. Coordinate with officers.",
    priorityTier: 2, status: "active", blockReason: "", sortOrder: 13,
    spendFlag: false, furnaceGate: null
  },
  {
    id: "bb-019", category: "island", label: "Tree of Life \u2192 Level 5 (Attack buff)",
    notes: "Requires Prosperity from decorations. Focus buff decorations over cosmetics.",
    priorityTier: 2, status: "todo", blockReason: "", sortOrder: 14,
    spendFlag: false, furnaceGate: 19
  },
  {
    id: "bb-020", category: "island", label: "Luminary Citadel: collect + upgrade copies",
    notes: "+10% Troops Attack at max (level 10). Copies from Labyrinth rewards. 58 copies to max.",
    priorityTier: 2, status: "active", blockReason: "", sortOrder: 15,
    spendFlag: false, furnaceGate: 19
  },
  {
    id: "bb-021", category: "island", label: "Hero's Sanctum: collect + upgrade copies",
    notes: "+2.5% Troops Defense at max (level 5). Copies from Labyrinth milestone rewards. 15 copies to max.",
    priorityTier: 2, status: "active", blockReason: "", sortOrder: 16,
    spendFlag: false, furnaceGate: 19
  },
  {
    id: "bb-022", category: "island", label: "Basic Dock: upgrade for deployment capacity",
    notes: "+1,000 deployment at max. Costly in Life Essence — defer until other island buffs done.",
    priorityTier: 2, status: "todo", blockReason: "", sortOrder: 17,
    spendFlag: false, furnaceGate: 19
  },

  // === TIER 3: LONG-TERM ===
  {
    id: "bb-023", category: "chief-charms", label: "Unlock charms at Furnace 25-26",
    notes: "Chief Charms boost Troop Lethality + Health. 18 charm slots across 6 gear pieces.",
    priorityTier: 3, status: "blocked", blockReason: "Need Furnace 25+",
    sortOrder: 1, spendFlag: false, furnaceGate: 25
  },
  {
    id: "bb-024", category: "chief-charms", label: "Level charms evenly (uniformity bonus)",
    notes: "Uniformity bonus grants extra Attack + Defense. Don't over-level one charm at expense of others.",
    priorityTier: 3, status: "blocked", blockReason: "Need charms unlocked",
    sortOrder: 2, spendFlag: false, furnaceGate: 25
  },
  {
    id: "bb-025", category: "war-academy", label: "Build War Academy at Furnace 30",
    notes: "Unlocks T11 troops and Fire Crystal tech tree. Very long F2P road.",
    priorityTier: 3, status: "blocked", blockReason: "Need Furnace 30",
    sortOrder: 3, spendFlag: false, furnaceGate: 30
  },
  {
    id: "bb-026", category: "island", label: "Tree of Life \u2192 Level 10 (Lethality buff)",
    notes: "Requires massive Prosperity. Level 5 Attack buff first, then push toward 10.",
    priorityTier: 3, status: "blocked", blockReason: "Need Tree of Life Lv5 first",
    sortOrder: 4, spendFlag: false, furnaceGate: 19
  },
  {
    id: "bb-027", category: "vip", label: "Push toward VIP 9+ (combat stat bonuses)",
    notes: "VIP 9-12 provide stat bonuses up to +16%. Extremely long F2P grind — years of daily VIP XP.",
    priorityTier: 3, status: "todo", blockReason: "", sortOrder: 5,
    spendFlag: false, furnaceGate: null
  },
  {
    id: "bb-028", category: "troops", label: "Fire Crystal troop research",
    notes: "Post-Furnace 30. Fire Crystal troops have passive combat skills at certain FC levels.",
    priorityTier: 3, status: "blocked", blockReason: "Need Furnace 30 + War Academy",
    sortOrder: 6, spendFlag: false, furnaceGate: 30
  },
];

const BEAV_PRE_EVENT = [
  // PERMANENT
  { id: "bpe-01", label: "Hero gear equipped on correct heroes", category: "permanent", checked: false, notes: "" },
  { id: "bpe-02", label: "Chief gear equipped and enhanced", category: "permanent", checked: false, notes: "Once crafted at F22" },
  { id: "bpe-03", label: "Skins equipped (city + teleport)", category: "permanent", checked: false, notes: "Verify after acquiring new skins" },
  { id: "bpe-04", label: "VIP status active", category: "permanent", checked: false, notes: "" },
  { id: "bpe-05", label: "Combat heroes assigned (not gathering)", category: "permanent", checked: false, notes: "" },
  // TIMED
  { id: "bpe-06", label: "Cave Lion skill (Feral Anthem) \u2014 +10% Attack", category: "timed", checked: false, notes: "2hr duration" },
  { id: "bpe-07", label: "Saber-Tooth skill (Apex Assault) \u2014 +10% Lethality", category: "timed", checked: false, notes: "2hr duration" },
  { id: "bpe-08", label: "Frost Gorilla skill \u2014 +10% Health", category: "timed", checked: false, notes: "If available. 2hr duration" },
  { id: "bpe-09", label: "Snow Ape skill \u2014 +15k Squad Capacity", category: "timed", checked: false, notes: "For rally events" },
  { id: "bpe-10", label: "Gem buff: Troops Attack Up", category: "timed", checked: false, notes: "Use stockpiled items only — don't buy with gems" },
  { id: "bpe-11", label: "Gem buff: Troops Lethality Up", category: "timed", checked: false, notes: "Use stockpiled items only" },
  { id: "bpe-12", label: "Gem buff: Troops Defense Up", category: "timed", checked: false, notes: "Use stockpiled items only" },
  { id: "bpe-13", label: "Gem buff: Troops Health Up", category: "timed", checked: false, notes: "Use stockpiled items only" },
  { id: "bpe-14", label: "Gem buff: Deployment Capacity Up", category: "timed", checked: false, notes: "Use stockpiled items only" },
  { id: "bpe-15", label: "Troop ratio set to 50/20/30 (not default 33/33/33)", category: "timed", checked: false, notes: "Must manually adjust every time" },
  // EVENT-SPECIFIC
  { id: "bpe-16", label: "AC: register team while all buffs active", category: "event-specific", checked: false, notes: "Buffs snapshot on registration" },
  { id: "bpe-17", label: "Foundry: Advanced Teleporters stocked (10-15)", category: "event-specific", checked: false, notes: "" },
  { id: "bpe-18", label: "Bear Hunt: healing speedups ready (2-3hr worth)", category: "event-specific", checked: false, notes: "" },
  { id: "bpe-19", label: "SvS: full 12-hour gem buffs for Castle Battle window", category: "event-specific", checked: false, notes: "Use stockpiled items. Time for 10:00 UTC Saturday" },
];

export function seedBuffStrategyIfNeeded(data) {
  for (const [name, seed] of [['Wally', { items: WALLY_BUFF_ITEMS, preEventChecklist: WALLY_PRE_EVENT }],
                                ['Beav', { items: BEAV_BUFF_ITEMS, preEventChecklist: BEAV_PRE_EVENT }]]) {
    const chief = data.chiefs[name];
    if (chief && (!chief.buffStrategy || (!chief.buffStrategy.items?.length && !chief.buffStrategy.preEventChecklist?.length))) {
      chief.buffStrategy = structuredClone(seed);
    }
  }
  return data;
}
