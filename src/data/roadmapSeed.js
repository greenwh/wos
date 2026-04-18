export const WALLY_ROADMAP = [
  // === PHASE 1: Immediate – Deploy Hoard ===
  {
    id: "w-001", phase: 1, phaseLabel: "Immediate – Deploy Hoard",
    heroName: "Flint", goalType: "star_ascension",
    description: "Flint → 4★",
    target: {"targetStars":4},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "All modes – unlocks Lv5 skills", notes: "1 sliver away (3★ 5/6). Top priority: burn saved shards NOW. Unlocks Lv5 skill cap for Flint's S-tier Expedition kit."
  },
  {
    id: "w-002", phase: 1, phaseLabel: "Immediate – Deploy Hoard",
    heroName: "Molly", goalType: "gear_enhancement",
    description: "Molly Belt Mythic → +45",
    target: {"gearSlot":"Belt","targetEnhancement":45},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena + Expedition", notes: "Mythic Belt sitting at +0! Biggest wasted-potential piece on roster. Enhance to match Goggles/Boots tier (~+52-56)."
  },
  {
    id: "w-003", phase: 1, phaseLabel: "Immediate – Deploy Hoard",
    heroName: "Flint", goalType: "gear_acquire",
    description: "Flint Boots → Mythic",
    target: {"gearSlot":"Boots","targetRarity":"Mythic"},
    manualOnly: true, completed: false, completedDate: null,
    modeImpact: "All modes", notes: "Only non-Mythic main-set piece on Flint. Grind Arena tokens / Hall of Chiefs."
  },
  {
    id: "w-004", phase: 1, phaseLabel: "Immediate – Deploy Hoard",
    heroName: "Flint", goalType: "gear_enhancement",
    description: "Flint Goggles Mythic → +30",
    target: {"gearSlot":"Goggles","targetEnhancement":30},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "All modes", notes: "Mythic Goggles currently at +0. Raise to at least +30 as minimum floor, then push in step with set-bonus tier."
  },
  {
    id: "w-005", phase: 1, phaseLabel: "Immediate – Deploy Hoard",
    heroName: "Gina", goalType: "skill_level",
    description: "Gina Quick Paced → Lv3",
    target: {"skillName":"Quick Paced","skillCategory":"expedition","targetLevel":3},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: "Cheap Lv2→3 carry-over from prior roadmap."
  },
  // === PHASE 2: Pet Gen 1 – Development Foundation ===
  {
    id: "w-006", phase: 2, phaseLabel: "Pet Gen 1 – Development Foundation",
    heroName: "Cave Hyena", goalType: "pet_capture",
    description: "Capture Cave Hyena (Beast Cage)",
    target: {"targetRarity":"Rare"},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Construction QoL", notes: "F2P priority #1 pet. Builder's Aid = +15% construction for 5 min. Stacks with Double Time chief skill (total ~35% reduction). Use right before big Furnace/Research upgrades."
  },
  {
    id: "w-007", phase: 2, phaseLabel: "Pet Gen 1 – Development Foundation",
    heroName: "Musk Ox", goalType: "pet_capture",
    description: "Capture Musk Ox (Beast Cage)",
    target: {"targetRarity":"Uncommon"},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Resource farming", notes: "Gates Giant Tapir (Gen 2) at Lv15. Burden Bearer = instant complete one gathering tile (great for steel/coal time saving)."
  },
  {
    id: "w-008", phase: 2, phaseLabel: "Pet Gen 1 – Development Foundation",
    heroName: "Arctic Wolf", goalType: "pet_capture",
    description: "Capture Arctic Wolf (Beast Cage)",
    target: {"targetRarity":"Uncommon"},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Stamina QoL", notes: "Arctic Embrace = restore 60 Chief Stamina. Good for active beast-hunting days."
  },
  {
    id: "w-009", phase: 2, phaseLabel: "Pet Gen 1 – Development Foundation",
    heroName: "Musk Ox", goalType: "pet_level",
    description: "Musk Ox → Lv15 (unlocks Giant Tapir at Pet Gen 2)",
    target: {"targetLevel":15},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Unlocks Gen 2 pet chain", notes: "THIS IS THE GATE. Giant Tapir gives +500 pet food per 23h CD — the permanent pet-food engine. Priority pet-food target."
  },
  {
    id: "w-010", phase: 2, phaseLabel: "Pet Gen 1 – Development Foundation",
    heroName: "Cave Hyena", goalType: "pet_level",
    description: "Cave Hyena → Lv10",
    target: {"targetLevel":10},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Construction QoL", notes: "Lv10 unlocks Talent Skill. Diminishing returns beyond Lv10 until Gen 2+ pet food flows."
  },
  {
    id: "w-011", phase: 2, phaseLabel: "Pet Gen 1 – Development Foundation",
    heroName: "Arctic Wolf", goalType: "pet_level",
    description: "Arctic Wolf → Lv10",
    target: {"targetLevel":10},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Stamina QoL", notes: "Same as Hyena — Lv10 Talent Skill threshold, then park until more food."
  },
  {
    id: "w-012", phase: 2, phaseLabel: "Pet Gen 1 – Development Foundation",
    heroName: "All Gen 1 Pets", goalType: "pet_refine",
    description: "Refine with Common Wild Marks ONLY",
    target: {"targetRarity":"Common"},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Passive stats", notes: "HARD RULE: save Advanced Wild Marks for Snow Leopard / Cave Lion (Gen 3-4). Gen 1 pets give modest passive stat boosts from refinement — don't burn premium mats here. Reset is possible but refinement mats are NOT recoverable."
  },
  // === PHASE 3: Chief Gear – Furnace 22 Path ===
  {
    id: "w-013", phase: 3, phaseLabel: "Chief Gear – Furnace 22 Path",
    heroName: "Chief", goalType: "chief_gear",
    description: "Deploy saved chief gear materials toward Furnace 22 progression",
    target: {},
    manualOnly: true, completed: false, completedDate: null,
    modeImpact: "Furnace gate / power", notes: "Currently at Furnace 20; targeting Furnace 22. Prioritize completing consistent tier across all 6 chief gear pieces (set bonus requires uniform tier). Do not leapfrog individual pieces if it breaks set consistency."
  },
  {
    id: "w-014", phase: 3, phaseLabel: "Chief Gear – Furnace 22 Path",
    heroName: "Chief", goalType: "chief_gear",
    description: "Lock in highest-uniform chief gear tier across all 6 slots",
    target: {},
    manualOnly: true, completed: false, completedDate: null,
    modeImpact: "Furnace gate / power", notes: "Set bonus only triggers at the LOWEST-tier piece's level. A single laggard piece caps your bonus. Use hoard to raise floor, not ceiling."
  },
  // === PHASE 4: Lv5 Pushes – Post-4★ ===
  {
    id: "w-015", phase: 4, phaseLabel: "Lv5 Pushes – Post-4★",
    heroName: "Flint", goalType: "skill_level",
    description: "Flint Burning Resolve → Lv5",
    target: {"skillName":"Burning Resolve","skillCategory":"expedition","targetLevel":5},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally / AC", notes: "#1 Lv5 target on entire roster. 25% rally-leader all-troops attack. Requires 4★ (Phase 1 gate)."
  },
  {
    id: "w-016", phase: 4, phaseLabel: "Lv5 Pushes – Post-4★",
    heroName: "Flint", goalType: "skill_level",
    description: "Flint Immolation → Lv5",
    target: {"skillName":"Immolation","skillCategory":"expedition","targetLevel":5},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: "POST-JAN 2026 REWORK: Immolation now gives flat +25% Lethality (no longer RNG). Co-S-tier with Burning Resolve. Ignore older guides calling it unreliable."
  },
  {
    id: "w-017", phase: 4, phaseLabel: "Lv5 Pushes – Post-4★",
    heroName: "Flint", goalType: "skill_level",
    description: "Flint Fires of Vengeance → Lv5",
    target: {"skillName":"Fires of Vengence","skillCategory":"exploration","targetLevel":5},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena", notes: "Flint's primary Arena damage skill. Lv5 scales attack% and damage-taken debuff to 30%."
  },
  {
    id: "w-018", phase: 4, phaseLabel: "Lv5 Pushes – Post-4★",
    heroName: "Molly", goalType: "skill_level",
    description: "Molly Snow's Grace → Lv5",
    target: {"skillName":"Snow's Grace","skillCategory":"expedition","targetLevel":5},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: "Core Molly Expedition skill. Already 4★ so just needs manuals."
  },
  // === PHASE 5: Skill & Gear Gap Fills ===
  {
    id: "w-019", phase: 5, phaseLabel: "Skill & Gear Gap Fills",
    heroName: "Jessie", goalType: "gear_enhancement",
    description: "Jessie Belt Mythic → +25",
    target: {"gearSlot":"Belt","targetEnhancement":25},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: "Mythic Belt still at +0. Carry-over from v1."
  },
  {
    id: "w-020", phase: 5, phaseLabel: "Skill & Gear Gap Fills",
    heroName: "Bahiti", goalType: "gear_mf",
    description: "Bahiti Goggles MF → MF3",
    target: {"gearSlot":"Goggles","targetMF":3},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena + Expedition", notes: "Currently MF2. Complete the MF3 pair with Boots."
  },
  {
    id: "w-021", phase: 5, phaseLabel: "Skill & Gear Gap Fills",
    heroName: "Jessie", goalType: "skill_level",
    description: "Jessie Defense Upgrade → Lv4",
    target: {"skillName":"Defense Upgrade","skillCategory":"exploration","targetLevel":4},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena", notes: "50% → 62.5% defense buff. Carry-over from v1."
  },
  {
    id: "w-022", phase: 5, phaseLabel: "Skill & Gear Gap Fills",
    heroName: "Jessie", goalType: "skill_level",
    description: "Jessie Burst Fire → Lv4",
    target: {"skillName":"Burst Fire","skillCategory":"exploration","targetLevel":4},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena", notes: ""
  },
  {
    id: "w-023", phase: 5, phaseLabel: "Skill & Gear Gap Fills",
    heroName: "Gina", goalType: "skill_level",
    description: "Gina Endurance Training → Lv4",
    target: {"skillName":"Endurance Training","skillCategory":"expedition","targetLevel":4},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: ""
  },
  {
    id: "w-024", phase: 5, phaseLabel: "Skill & Gear Gap Fills",
    heroName: "Jasser", goalType: "skill_level",
    description: "Jasser Tactical Genius → Lv4",
    target: {"skillName":"Tactical Genius","skillCategory":"expedition","targetLevel":4},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Rally join", notes: "Jasser is prime damage-dealt rally joiner. First Expedition skill is what matters for joining — push it."
  },
  {
    id: "w-025", phase: 5, phaseLabel: "Skill & Gear Gap Fills",
    heroName: "Patrick", goalType: "skill_level",
    description: "Patrick Super Nutrients → Lv4",
    target: {"skillName":"Super Nutients","skillCategory":"expedition","targetLevel":4},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Defensive rally join", notes: "Patrick = defensive rally joiner (25% troop Health at max)."
  },
  // === PHASE 6: Alonzo Transition (Deferred) ===
  {
    id: "w-026", phase: 6, phaseLabel: "Alonzo Transition (Deferred)",
    heroName: "Alonzo", goalType: "star_ascension",
    description: "Alonzo → 3★ (roster-ready)",
    target: {"targetStars":3},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Future Marksman anchor", notes: "Long F2P road. HoH at 10 shards/week using free daily mark only — no gem spending on Alonzo until Flint 4★ reserves secured."
  },
  {
    id: "w-027", phase: 6, phaseLabel: "Alonzo Transition (Deferred)",
    heroName: "Alonzo", goalType: "skill_level",
    description: "Alonzo Trapnet → Lv3",
    target: {"skillName":"Trapnet","skillCategory":"exploration","targetLevel":3},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena (future)", notes: "Signature AoE + immobilize. Don't push beyond Lv3 until 3★ reached."
  },
  {
    id: "w-028", phase: 6, phaseLabel: "Alonzo Transition (Deferred)",
    heroName: "Alonzo", goalType: "skill_level",
    description: "Alonzo Onslaught → Lv3",
    target: {"skillName":"Onslaught","skillCategory":"expedition","targetLevel":3},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally (future)", notes: "Primary troop buff."
  },
  // === PHASE 7: Bench – No Investment ===
  {
    id: "w-029", phase: 7, phaseLabel: "Bench – No Investment",
    heroName: "Natalia", goalType: "star_ascension",
    description: "Natalia → passive shard gather (no gem spend)",
    target: {},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Future consideration", notes: "Already Mythic + Gale Force +1. Keep on bench. No skill manuals, no gear, no gems. Reassess if/when Mia arrives and alliance roles shift."
  },
  {
    id: "w-030", phase: 7, phaseLabel: "Bench – No Investment",
    heroName: "Zinman", goalType: "star_ascension",
    description: "Zinman → passive shard gather (no gem spend)",
    target: {},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Future consideration", notes: "1★ (4/6). Woodpecker weapon. Bench. Low priority vs Alonzo for Marksman slot."
  },
  // === PHASE 8: Long-Term – Mia Prep ===
  {
    id: "w-031", phase: 8, phaseLabel: "Long-Term – Mia Prep",
    heroName: "Mia", goalType: "hoard",
    description: "Continue gem hoard for Mia Lucky Wheel (~120k–175k gems target for 120 spins)",
    target: {},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Future primary Lancer", notes: "Lucky Wheel = 3-day event every ~2 weeks, 6 cycles per Gen 2. 120 spins per event = 175 total Mythic shards (115 milestones + ~60 wheel). Skip Mia Daily Value packs (poor ROI). Free gear transfer from Molly planned."
  },
  {
    id: "w-032", phase: 8, phaseLabel: "Long-Term – Mia Prep",
    heroName: "Mia", goalType: "hoard",
    description: "Skip Gen 3+ hero shard investments until Mia is 4★",
    target: {},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Discipline gate", notes: "When server unlocks Gen 3 heroes, tempting to chase newest — DON'T. 4★ Mia > partial any-Gen-3 hero for a F2P-leaning account."
  },
];

export const BEAV_ROADMAP = [
  // === PHASE 1: Immediate – Deploy Hoard ===
  {
    id: "b-001", phase: 1, phaseLabel: "Immediate – Deploy Hoard",
    heroName: "Flint", goalType: "gear_acquire",
    description: "Flint Goggles → Mythic",
    target: {"gearSlot":"Goggles","targetRarity":"Mythic"},
    manualOnly: true, completed: false, completedDate: null,
    modeImpact: "All modes – completes Mythic main set", notes: "Last Epic piece on Flint's main set. Grind Arena tokens / Labyrinth / HoH."
  },
  {
    id: "b-002", phase: 1, phaseLabel: "Immediate – Deploy Hoard",
    heroName: "Flint", goalType: "gear_enhancement",
    description: "Flint Boots Mythic → +30",
    target: {"gearSlot":"Boots","targetEnhancement":30},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "All modes", notes: "Boots just became Mythic (at +0). Raise to floor of ~+30 quickly, then push with rest of set."
  },
  {
    id: "b-003", phase: 1, phaseLabel: "Immediate – Deploy Hoard",
    heroName: "Molly", goalType: "star_ascension",
    description: "Molly → 4★",
    target: {"targetStars":4},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Unlocks Lv5 skills", notes: "1 sliver away (3★ 5/6). Prioritize over most other work. Unlocks Molly's Lv5 skill ceiling."
  },
  {
    id: "b-004", phase: 1, phaseLabel: "Immediate – Deploy Hoard",
    heroName: "Molly", goalType: "gear_acquire",
    description: "Molly Gloves → Mythic",
    target: {"gearSlot":"Gloves","targetRarity":"Mythic"},
    manualOnly: true, completed: false, completedDate: null,
    modeImpact: "Arena + Expedition", notes: "Currently Epic. Beav Molly lags Wally Molly here — acquisition priority."
  },
  {
    id: "b-005", phase: 1, phaseLabel: "Immediate – Deploy Hoard",
    heroName: "Molly", goalType: "gear_acquire",
    description: "Molly Belt → Mythic",
    target: {"gearSlot":"Belt","targetRarity":"Mythic"},
    manualOnly: true, completed: false, completedDate: null,
    modeImpact: "Arena + Expedition", notes: "Currently Epic. Pair with Gloves for complete Mythic set."
  },
  {
    id: "b-006", phase: 1, phaseLabel: "Immediate – Deploy Hoard",
    heroName: "Flint", goalType: "skill_level",
    description: "Flint Immolation → Lv5",
    target: {"skillName":"Immolation","skillCategory":"expedition","targetLevel":5},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: "POST-JAN 2026 REWORK: now flat +25% Lethality (no RNG). Fires of Vengeance and Burning Resolve already at Lv5 on Beav — this closes the S-tier skill gap."
  },
  // === PHASE 2: Pet Gen 1 – Development Foundation ===
  {
    id: "b-007", phase: 2, phaseLabel: "Pet Gen 1 – Development Foundation",
    heroName: "Cave Hyena", goalType: "pet_capture",
    description: "Capture Cave Hyena",
    target: {"targetRarity":"Rare"},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Construction QoL", notes: "Beav is strict F2P — Cave Hyena construction stacking matters even more here. Activate before every big upgrade."
  },
  {
    id: "b-008", phase: 2, phaseLabel: "Pet Gen 1 – Development Foundation",
    heroName: "Musk Ox", goalType: "pet_capture",
    description: "Capture Musk Ox",
    target: {"targetRarity":"Uncommon"},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Resource farming", notes: "Gates Giant Tapir (Pet Gen 2)."
  },
  {
    id: "b-009", phase: 2, phaseLabel: "Pet Gen 1 – Development Foundation",
    heroName: "Arctic Wolf", goalType: "pet_capture",
    description: "Capture Arctic Wolf",
    target: {"targetRarity":"Uncommon"},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Stamina QoL", notes: ""
  },
  {
    id: "b-010", phase: 2, phaseLabel: "Pet Gen 1 – Development Foundation",
    heroName: "Musk Ox", goalType: "pet_level",
    description: "Musk Ox → Lv15 (unlocks Giant Tapir)",
    target: {"targetLevel":15},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Unlocks Gen 2 pet chain", notes: "Same as Wally — THE gate pet. Giant Tapir = passive pet food engine."
  },
  {
    id: "b-011", phase: 2, phaseLabel: "Pet Gen 1 – Development Foundation",
    heroName: "Cave Hyena", goalType: "pet_level",
    description: "Cave Hyena → Lv10",
    target: {"targetLevel":10},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Construction QoL", notes: "Lv10 = Talent Skill unlock."
  },
  {
    id: "b-012", phase: 2, phaseLabel: "Pet Gen 1 – Development Foundation",
    heroName: "Arctic Wolf", goalType: "pet_level",
    description: "Arctic Wolf → Lv10",
    target: {"targetLevel":10},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Stamina QoL", notes: ""
  },
  {
    id: "b-013", phase: 2, phaseLabel: "Pet Gen 1 – Development Foundation",
    heroName: "All Gen 1 Pets", goalType: "pet_refine",
    description: "Refine with Common Wild Marks ONLY",
    target: {"targetRarity":"Common"},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Passive stats", notes: "HARD RULE: save ALL Advanced Wild Marks for Snow Leopard / Cave Lion (Gen 3-4). This matters more on Beav because of strict F2P."
  },
  // === PHASE 3: Chief Gear – Furnace 22 Path ===
  {
    id: "b-014", phase: 3, phaseLabel: "Chief Gear – Furnace 22 Path",
    heroName: "Chief", goalType: "chief_gear",
    description: "Deploy saved chief gear materials toward Furnace 22 progression",
    target: {},
    manualOnly: true, completed: false, completedDate: null,
    modeImpact: "Furnace gate / power", notes: "Targeting Furnace 22 unlock. Same discipline as Wally: raise the floor, don't sprint single pieces."
  },
  {
    id: "b-015", phase: 3, phaseLabel: "Chief Gear – Furnace 22 Path",
    heroName: "Chief", goalType: "chief_gear",
    description: "Lock in highest-uniform chief gear tier across all 6 slots",
    target: {},
    manualOnly: true, completed: false, completedDate: null,
    modeImpact: "Furnace gate / power", notes: "Set bonus caps at the lowest-tier piece."
  },
  // === PHASE 4: Lv5 Pushes ===
  {
    id: "b-016", phase: 4, phaseLabel: "Lv5 Pushes",
    heroName: "Molly", goalType: "skill_level",
    description: "Molly Snow's Grace → Lv4 (then Lv5 after 4★)",
    target: {"skillName":"Snow's Grace","skillCategory":"expedition","targetLevel":5},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: "Currently Lv3 — push to Lv4 now, Lv5 once Molly hits 4★ (Phase 1)."
  },
  {
    id: "b-017", phase: 4, phaseLabel: "Lv5 Pushes",
    heroName: "Molly", goalType: "skill_level",
    description: "Molly Youthful Rage → Lv5 (after 4★)",
    target: {"skillName":"Youthful Rage","skillCategory":"expedition","targetLevel":5},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: ""
  },
  {
    id: "b-018", phase: 4, phaseLabel: "Lv5 Pushes",
    heroName: "Jessie", goalType: "skill_level",
    description: "Jessie Stand at Arms → Lv5",
    target: {"skillName":"Stand at Arms","skillCategory":"expedition","targetLevel":5},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: "25% all-troop damage-dealt buff at max. Most accessible Lv5 on Beav (Epic hero at 4★ — much cheaper than Mythic Lv5s)."
  },
  // === PHASE 5: Skill & Gear Gap Fills ===
  {
    id: "b-019", phase: 5, phaseLabel: "Skill & Gear Gap Fills",
    heroName: "Bahiti", goalType: "gear_acquire",
    description: "Bahiti Belt → Mythic",
    target: {"gearSlot":"Belt","targetRarity":"Mythic"},
    manualOnly: true, completed: false, completedDate: null,
    modeImpact: "Arena + Expedition", notes: "Last Epic piece on Bahiti's main set. Arena token grind."
  },
  {
    id: "b-020", phase: 5, phaseLabel: "Skill & Gear Gap Fills",
    heroName: "Sergey", goalType: "gear_acquire",
    description: "Sergey Boots → Mythic",
    target: {"gearSlot":"Boots","targetRarity":"Mythic"},
    manualOnly: true, completed: false, completedDate: null,
    modeImpact: "Garrison / Joiner", notes: "Sergey as defensive joiner benefits from Mythic boots for troop stats. Lower priority than Bahiti slots."
  },
  {
    id: "b-021", phase: 5, phaseLabel: "Skill & Gear Gap Fills",
    heroName: "Molly", goalType: "skill_level",
    description: "Molly Super Snowball → Lv5",
    target: {"skillName":"Super Snowball","skillCategory":"exploration","targetLevel":5},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena", notes: "Currently Lv4. Arena Molly completion."
  },
  {
    id: "b-022", phase: 5, phaseLabel: "Skill & Gear Gap Fills",
    heroName: "Molly", goalType: "skill_level",
    description: "Molly Ice Dominion → Lv5 (after 4★)",
    target: {"skillName":"Ice Dominion","skillCategory":"expedition","targetLevel":5},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: ""
  },
  {
    id: "b-023", phase: 5, phaseLabel: "Skill & Gear Gap Fills",
    heroName: "Jessie", goalType: "skill_level",
    description: "Jessie Defense Upgrade → Lv4",
    target: {"skillName":"Defense Upgrade","skillCategory":"exploration","targetLevel":4},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena", notes: "50% → 62.5% defense buff. Carry-over."
  },
  {
    id: "b-024", phase: 5, phaseLabel: "Skill & Gear Gap Fills",
    heroName: "Jessie", goalType: "skill_level",
    description: "Jessie Burst Fire → Lv4",
    target: {"skillName":"Burst Fire","skillCategory":"exploration","targetLevel":4},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena", notes: ""
  },
  {
    id: "b-025", phase: 5, phaseLabel: "Skill & Gear Gap Fills",
    heroName: "Gina", goalType: "skill_level",
    description: "Gina Endurance Training → Lv3",
    target: {"skillName":"Endurance Training","skillCategory":"expedition","targetLevel":3},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: "Cheap Lv2→3."
  },
  {
    id: "b-026", phase: 5, phaseLabel: "Skill & Gear Gap Fills",
    heroName: "Gina", goalType: "skill_level",
    description: "Gina Quick Paced → Lv3",
    target: {"skillName":"Quick Paced","skillCategory":"expedition","targetLevel":3},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: ""
  },
  {
    id: "b-027", phase: 5, phaseLabel: "Skill & Gear Gap Fills",
    heroName: "Jasser", goalType: "skill_level",
    description: "Jasser Enlightened Warfare → Lv3",
    target: {"skillName":"Enlightened Warfare","skillCategory":"expedition","targetLevel":3},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Rally join", notes: ""
  },
  {
    id: "b-028", phase: 5, phaseLabel: "Skill & Gear Gap Fills",
    heroName: "Patrick", goalType: "skill_level",
    description: "Patrick Caloric Booster → Lv3",
    target: {"skillName":"Caloric Booster","skillCategory":"expedition","targetLevel":3},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Defensive rally join", notes: ""
  },
  {
    id: "b-029", phase: 5, phaseLabel: "Skill & Gear Gap Fills",
    heroName: "Sergey", goalType: "skill_level",
    description: "Sergey Joint Defense → Lv4",
    target: {"skillName":"Joint Defense","skillCategory":"exploration","targetLevel":4},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena", notes: ""
  },
  {
    id: "b-030", phase: 5, phaseLabel: "Skill & Gear Gap Fills",
    heroName: "Sergey", goalType: "skill_level",
    description: "Sergey Shield Block → Lv4",
    target: {"skillName":"Shield Block","skillCategory":"exploration","targetLevel":4},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena", notes: ""
  },
  // === PHASE 6: Alonzo Transition (Deferred) ===
  {
    id: "b-031", phase: 6, phaseLabel: "Alonzo Transition (Deferred)",
    heroName: "Alonzo", goalType: "star_ascension",
    description: "Alonzo → 3★ (roster-ready)",
    target: {"targetStars":3},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Future Marksman anchor", notes: "STRICT F2P: daily mark only on Beav, no gem spend. Alonzo already has all six skills at Lv3 (completed 4/17) — this is pure shard accumulation."
  },
  // === PHASE 7: Bench – No Investment ===
  {
    id: "b-032", phase: 7, phaseLabel: "Bench – No Investment",
    heroName: "Natalia", goalType: "star_ascension",
    description: "Natalia (just acquired) → 0 investment, passive shard gather",
    target: {},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Future consideration", notes: "NEW to Beav roster — 0★, Lv1. Strict F2P rule applies: no gems, no manuals, no gear. Revisit after Mia acquisition and server reaches Gen 3. Could become bench Infantry option if Flint remains primary."
  },
  {
    id: "b-033", phase: 7, phaseLabel: "Bench – No Investment",
    heroName: "Zinman", goalType: "star_ascension",
    description: "Zinman → passive shard gather (no gem spend)",
    target: {},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Future consideration", notes: "1★ (1/6). Bench. Alonzo is the Marksman pipeline here."
  },
  // === PHASE 8: Long-Term – Mia Prep ===
  {
    id: "b-034", phase: 8, phaseLabel: "Long-Term – Mia Prep",
    heroName: "Mia", goalType: "hoard",
    description: "Continue gem hoard for Mia Lucky Wheel (~80 days from Gen 2 entry)",
    target: {},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Future primary Lancer", notes: "Beav's #1 long-term F2P target. Alonzo HoH gem purchases PAUSED entirely to protect this hoard. Skip Mia Daily Value packs. Free gear transfer from Molly planned."
  },
  {
    id: "b-035", phase: 8, phaseLabel: "Long-Term – Mia Prep",
    heroName: "Mia", goalType: "hoard",
    description: "Target: 120 spins across ~3 Mia Lucky Wheel cycles for 4★",
    target: {},
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "4★ is F2P stopping point", notes: "Per roster rule: 4★ is F2P stopping point. 4→5★ (600 shards) is poor ROI. 3 events × 120 spins × ~175 shards per event = comfortably into 4★ territory."
  },
];

export function seedRoadmapIfNeeded(appData) {
  if (appData.chiefs["Wally"] && (!appData.chiefs["Wally"].roadmap || appData.chiefs["Wally"].roadmap.length === 0)) {
    appData.chiefs["Wally"].roadmap = structuredClone(WALLY_ROADMAP);
  }
  if (appData.chiefs["Beav"] && (!appData.chiefs["Beav"].roadmap || appData.chiefs["Beav"].roadmap.length === 0)) {
    appData.chiefs["Beav"].roadmap = structuredClone(BEAV_ROADMAP);
  }
  return appData;
}
