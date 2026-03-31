export const WALLY_ROADMAP = [
  // === PHASE 1: Immediate ===
  {
    id: "w-001", phase: 1, phaseLabel: "Immediate",
    heroName: "Molly", goalType: "gear_enhancement",
    description: "Molly Boots → +45",
    target: { gearSlot: "Boots", targetEnhancement: 45 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena + Expedition", notes: "Biggest single-piece improvement on roster"
  },
  {
    id: "w-002", phase: 1, phaseLabel: "Immediate",
    heroName: "Molly", goalType: "gear_enhancement",
    description: "Molly Goggles → +52",
    target: { gearSlot: "Goggles", targetEnhancement: 52 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena + Expedition", notes: ""
  },
  {
    id: "w-003", phase: 1, phaseLabel: "Immediate",
    heroName: "Bahiti", goalType: "gear_enhancement",
    description: "Bahiti Goggles → +55",
    target: { gearSlot: "Goggles", targetEnhancement: 55 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena + Expedition", notes: "Push toward +55-60 range"
  },
  {
    id: "w-004", phase: 1, phaseLabel: "Immediate",
    heroName: "Bahiti", goalType: "gear_enhancement",
    description: "Bahiti Boots → +50",
    target: { gearSlot: "Boots", targetEnhancement: 50 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena + Expedition", notes: "MF3 already done, needs raw enhancement"
  },
  {
    id: "w-005", phase: 1, phaseLabel: "Immediate",
    heroName: "Bahiti", goalType: "skill_level",
    description: "Bahiti Precise Shot → Lv4",
    target: { skillName: "Precise Shot", skillCategory: "exploration", targetLevel: 4 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena", notes: "Highest-impact Arena skill upgrade"
  },
  {
    id: "w-006", phase: 1, phaseLabel: "Immediate",
    heroName: "Bahiti", goalType: "skill_level",
    description: "Bahiti Quick Shot → Lv4",
    target: { skillName: "Quick Shot", skillCategory: "exploration", targetLevel: 4 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena", notes: ""
  },
  {
    id: "w-007", phase: 1, phaseLabel: "Immediate",
    heroName: "Bahiti", goalType: "skill_level",
    description: "Bahiti Pathfinder Vision → Lv4",
    target: { skillName: "Pathfinder Vision", skillCategory: "exploration", targetLevel: 4 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena", notes: ""
  },
  {
    id: "w-008", phase: 1, phaseLabel: "Immediate",
    heroName: "Gina", goalType: "skill_level",
    description: "Gina Quick Paced → Lv3",
    target: { skillName: "Quick Paced", skillCategory: "expedition", targetLevel: 3 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: "Cheap Lv2→3 upgrade"
  },
  {
    id: "w-009", phase: 1, phaseLabel: "Immediate",
    heroName: "Molly", goalType: "gear_mf",
    description: "Molly Goggles MF → MF2",
    target: { gearSlot: "Goggles", targetMF: 2 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena + Expedition", notes: "When Essence Stones allow"
  },

  // === PHASE 2: Mid-Term ===
  {
    id: "w-010", phase: 2, phaseLabel: "Mid-Term",
    heroName: "Flint", goalType: "gear_acquire",
    description: "Acquire Mythic Goggles for Flint",
    target: { gearSlot: "Goggles", targetRarity: "Mythic" },
    manualOnly: true, completed: false, completedDate: null,
    modeImpact: "All modes", notes: "Grind via Arena tokens"
  },
  {
    id: "w-011", phase: 2, phaseLabel: "Mid-Term",
    heroName: "Jessie", goalType: "gear_enhancement",
    description: "Jessie Boots → +45",
    target: { gearSlot: "Boots", targetEnhancement: 45 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: ""
  },
  {
    id: "w-012", phase: 2, phaseLabel: "Mid-Term",
    heroName: "Jessie", goalType: "gear_enhancement",
    description: "Jessie Belt → +25",
    target: { gearSlot: "Belt", targetEnhancement: 25 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: "Mythic Belt sitting at zero"
  },
  {
    id: "w-013", phase: 2, phaseLabel: "Mid-Term",
    heroName: "Jessie", goalType: "skill_level",
    description: "Jessie Defense Upgrade → Lv4",
    target: { skillName: "Defense Upgrade", skillCategory: "exploration", targetLevel: 4 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena", notes: "50% → 62.5% defense buff"
  },
  {
    id: "w-014", phase: 2, phaseLabel: "Mid-Term",
    heroName: "Molly", goalType: "star_ascension",
    description: "Molly → 4★",
    target: { targetStars: 4 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Unlocks Lv5 skills", notes: "1 sliver away"
  },
  {
    id: "w-015", phase: 2, phaseLabel: "Mid-Term",
    heroName: "Gina", goalType: "skill_level",
    description: "Gina Endurance Training → Lv4",
    target: { skillName: "Endurance Training", skillCategory: "expedition", targetLevel: 4 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: "When manuals allow"
  },
  {
    id: "w-016", phase: 2, phaseLabel: "Mid-Term",
    heroName: "Jessie", goalType: "skill_level",
    description: "Jessie Burst Fire → Lv4",
    target: { skillName: "Burst Fire", skillCategory: "exploration", targetLevel: 4 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena", notes: ""
  },
  {
    id: "w-017", phase: 2, phaseLabel: "Mid-Term",
    heroName: "Bahiti", goalType: "gear_mf",
    description: "Bahiti Goggles MF → MF3",
    target: { gearSlot: "Goggles", targetMF: 3 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena + Expedition", notes: ""
  },

  // === PHASE 3: Alonzo Transition ===
  {
    id: "w-018", phase: 3, phaseLabel: "Alonzo Transition",
    heroName: "Alonzo", goalType: "star_ascension",
    description: "Alonzo → 3★ (roster-ready)",
    target: { targetStars: 3 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Future everything", notes: "Minimum before activating"
  },
  {
    id: "w-019", phase: 3, phaseLabel: "Alonzo Transition",
    heroName: "Alonzo", goalType: "skill_level",
    description: "Alonzo Trapnet → Lv3",
    target: { skillName: "Trapnet", skillCategory: "exploration", targetLevel: 3 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena", notes: "Signature AoE + immobilize"
  },
  {
    id: "w-020", phase: 3, phaseLabel: "Alonzo Transition",
    heroName: "Alonzo", goalType: "skill_level",
    description: "Alonzo Onslaught → Lv3",
    target: { skillName: "Onslaught", skillCategory: "expedition", targetLevel: 3 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: "Primary troop buff"
  },

  // === PHASE 4: Lv5 Pushes & Endgame ===
  {
    id: "w-021", phase: 4, phaseLabel: "Lv5 Pushes & Endgame",
    heroName: "Flint", goalType: "skill_level",
    description: "Flint Burning Resolve → Lv5",
    target: { skillName: "Burning Resolve", skillCategory: "expedition", targetLevel: 5 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally / AC", notes: "#1 Lv5 target on entire roster. Requires 4★."
  },
  {
    id: "w-022", phase: 4, phaseLabel: "Lv5 Pushes & Endgame",
    heroName: "Jessie", goalType: "skill_level",
    description: "Jessie Stand at Arms → Lv5",
    target: { skillName: "Stand at Arms", skillCategory: "expedition", targetLevel: 5 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: "25% all-troop damage buff at max"
  },
  {
    id: "w-023", phase: 4, phaseLabel: "Lv5 Pushes & Endgame",
    heroName: "Molly", goalType: "skill_level",
    description: "Molly Snow's Grace → Lv5",
    target: { skillName: "Snow's Grace", skillCategory: "expedition", targetLevel: 5 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: "Requires 4★"
  },
];

export const BEAV_ROADMAP = [
  // === PHASE 1: Immediate ===
  {
    id: "b-001", phase: 1, phaseLabel: "Immediate",
    heroName: "Flint", goalType: "gear_enhancement",
    description: "Flint Gloves → +55",
    target: { gearSlot: "Gloves", targetEnhancement: 55 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "All modes", notes: "Best Ore ROI on account"
  },
  {
    id: "b-002", phase: 1, phaseLabel: "Immediate",
    heroName: "Flint", goalType: "gear_enhancement",
    description: "Flint Belt → +55",
    target: { gearSlot: "Belt", targetEnhancement: 55 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "All modes", notes: "Keep even with Gloves"
  },
  {
    id: "b-003", phase: 1, phaseLabel: "Immediate",
    heroName: "Molly", goalType: "gear_enhancement",
    description: "Molly Boots → +40",
    target: { gearSlot: "Boots", targetEnhancement: 40 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena + Expedition", notes: "MF2 already strong, needs raw enhancement"
  },
  {
    id: "b-004", phase: 1, phaseLabel: "Immediate",
    heroName: "Molly", goalType: "gear_enhancement",
    description: "Molly Goggles → +38",
    target: { gearSlot: "Goggles", targetEnhancement: 38 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena + Expedition", notes: "MF3 already ahead of Wally's Molly"
  },
  {
    id: "b-005", phase: 1, phaseLabel: "Immediate",
    heroName: "Bahiti", goalType: "skill_level",
    description: "Bahiti Precise Shot → Lv4",
    target: { skillName: "Precise Shot", skillCategory: "exploration", targetLevel: 4 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena", notes: "Single biggest Arena improvement on Beav"
  },
  {
    id: "b-006", phase: 1, phaseLabel: "Immediate",
    heroName: "Bahiti", goalType: "skill_level",
    description: "Bahiti Quick Shot → Lv4",
    target: { skillName: "Quick Shot", skillCategory: "exploration", targetLevel: 4 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena", notes: ""
  },
  {
    id: "b-007", phase: 1, phaseLabel: "Immediate",
    heroName: "Bahiti", goalType: "skill_level",
    description: "Bahiti Pathfinder Vision → Lv4",
    target: { skillName: "Pathfinder Vision", skillCategory: "exploration", targetLevel: 4 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena", notes: ""
  },
  {
    id: "b-008", phase: 1, phaseLabel: "Immediate",
    heroName: "Flint", goalType: "skill_level",
    description: "Flint Heat Diffusion → Lv3",
    target: { skillName: "Heat Diffusion", skillCategory: "exploration", targetLevel: 3 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena", notes: "Cheap Lv2→3 fix, removes Arena weak link"
  },
  {
    id: "b-009", phase: 1, phaseLabel: "Immediate",
    heroName: "Flint", goalType: "skill_level",
    description: "Flint Pyromaniac → Lv4",
    target: { skillName: "Pyromaniac", skillCategory: "expedition", targetLevel: 4 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Labyrinth / Rally", notes: ""
  },
  {
    id: "b-010", phase: 1, phaseLabel: "Immediate",
    heroName: "Flint", goalType: "skill_level",
    description: "Flint Immolation → Lv4",
    target: { skillName: "Immolation", skillCategory: "expedition", targetLevel: 4 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Labyrinth / Rally", notes: ""
  },

  // === PHASE 2: Mid-Term ===
  {
    id: "b-011", phase: 2, phaseLabel: "Mid-Term",
    heroName: "Molly", goalType: "skill_level",
    description: "Molly Snow's Grace → Lv4",
    target: { skillName: "Snow's Grace", skillCategory: "expedition", targetLevel: 4 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Labyrinth / Rally", notes: "Core Expedition skill, 1 level behind others"
  },
  {
    id: "b-012", phase: 2, phaseLabel: "Mid-Term",
    heroName: "Gina", goalType: "skill_level",
    description: "Gina Endurance Training → Lv3",
    target: { skillName: "Endurance Training", skillCategory: "expedition", targetLevel: 3 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: "Cheap Lv2→3"
  },
  {
    id: "b-013", phase: 2, phaseLabel: "Mid-Term",
    heroName: "Gina", goalType: "skill_level",
    description: "Gina Quick Paced → Lv3",
    target: { skillName: "Quick Paced", skillCategory: "expedition", targetLevel: 3 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: "Cheap Lv2→3"
  },
  {
    id: "b-014", phase: 2, phaseLabel: "Mid-Term",
    heroName: "Bahiti", goalType: "gear_acquire",
    description: "Acquire Mythic Goggles for Bahiti",
    target: { gearSlot: "Goggles", targetRarity: "Mythic" },
    manualOnly: true, completed: false, completedDate: null,
    modeImpact: "All modes", notes: "First Arena token target"
  },
  {
    id: "b-015", phase: 2, phaseLabel: "Mid-Term",
    heroName: "Jessie", goalType: "gear_acquire",
    description: "Acquire Epic Boots for Jessie",
    target: { gearSlot: "Boots", targetRarity: "Epic" },
    manualOnly: true, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: "Replace Rare +33"
  },
  {
    id: "b-016", phase: 2, phaseLabel: "Mid-Term",
    heroName: "Bahiti", goalType: "star_ascension",
    description: "Bahiti → 4★",
    target: { targetStars: 4 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Stat boost + Lv5 unlock", notes: "1 sliver away"
  },
  {
    id: "b-017", phase: 2, phaseLabel: "Mid-Term",
    heroName: "Sergey", goalType: "star_ascension",
    description: "Sergey → 4★",
    target: { targetStars: 4 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Stat boost", notes: "1 sliver away"
  },
  {
    id: "b-018", phase: 2, phaseLabel: "Mid-Term",
    heroName: "Molly", goalType: "gear_mf",
    description: "Molly Boots MF → MF3",
    target: { gearSlot: "Boots", targetMF: 3 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena + Expedition", notes: "Both priority pieces at MF3"
  },
  {
    id: "b-019", phase: 2, phaseLabel: "Mid-Term",
    heroName: "Molly", goalType: "skill_level",
    description: "Molly Youthful Persistence → Lv4",
    target: { skillName: "Youthful Persistence", skillCategory: "exploration", targetLevel: 4 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena", notes: "Completes Molly's Exploration set"
  },

  // === PHASE 3: Filling Skill Gaps ===
  {
    id: "b-020", phase: 3, phaseLabel: "Skill Gaps",
    heroName: "Jessie", goalType: "skill_level",
    description: "Jessie Defense Upgrade → Lv4",
    target: { skillName: "Defense Upgrade", skillCategory: "exploration", targetLevel: 4 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena", notes: "50% → 62.5% defense buff"
  },
  {
    id: "b-021", phase: 3, phaseLabel: "Skill Gaps",
    heroName: "Jessie", goalType: "skill_level",
    description: "Jessie Burst Fire → Lv4",
    target: { skillName: "Burst Fire", skillCategory: "exploration", targetLevel: 4 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena", notes: ""
  },
  {
    id: "b-022", phase: 3, phaseLabel: "Skill Gaps",
    heroName: "Bahiti", goalType: "skill_level",
    description: "Bahiti Sixth Sense → Lv4",
    target: { skillName: "Sixth Sense", skillCategory: "expedition", targetLevel: 4 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Labyrinth / Rally", notes: ""
  },
  {
    id: "b-023", phase: 3, phaseLabel: "Skill Gaps",
    heroName: "Bahiti", goalType: "skill_level",
    description: "Bahiti Fluorescence → Lv4",
    target: { skillName: "Fluorescence", skillCategory: "expedition", targetLevel: 4 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Labyrinth / Rally", notes: ""
  },
  {
    id: "b-024", phase: 3, phaseLabel: "Skill Gaps",
    heroName: "Jessie", goalType: "skill_level",
    description: "Jessie Bulwarks → Lv4",
    target: { skillName: "Bulwarks", skillCategory: "expedition", targetLevel: 4 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: ""
  },
  {
    id: "b-025", phase: 3, phaseLabel: "Skill Gaps",
    heroName: "Sergey", goalType: "skill_level",
    description: "Sergey Joint Defense → Lv4",
    target: { skillName: "Joint Defense", skillCategory: "exploration", targetLevel: 4 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena", notes: "Low priority, when manuals allow"
  },
  {
    id: "b-026", phase: 3, phaseLabel: "Skill Gaps",
    heroName: "Sergey", goalType: "skill_level",
    description: "Sergey Shield Block → Lv4",
    target: { skillName: "Shield Block", skillCategory: "exploration", targetLevel: 4 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena", notes: ""
  },

  // === PHASE 4: Alonzo Transition ===
  {
    id: "b-027", phase: 4, phaseLabel: "Alonzo Transition",
    heroName: "Alonzo", goalType: "star_ascension",
    description: "Alonzo → 3★ (roster-ready)",
    target: { targetStars: 3 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Future everything", notes: "Long F2P road, 3-4 Lucky Wheel cycles"
  },
  {
    id: "b-028", phase: 4, phaseLabel: "Alonzo Transition",
    heroName: "Alonzo", goalType: "skill_level",
    description: "Alonzo Trapnet → Lv3",
    target: { skillName: "Trapnet", skillCategory: "exploration", targetLevel: 3 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Arena", notes: "Don't go beyond Lv3 until replacing Bahiti"
  },
  {
    id: "b-029", phase: 4, phaseLabel: "Alonzo Transition",
    heroName: "Alonzo", goalType: "skill_level",
    description: "Alonzo Onslaught → Lv3",
    target: { skillName: "Onslaught", skillCategory: "expedition", targetLevel: 3 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: ""
  },

  // === PHASE 5: Lv5 Pushes & Endgame ===
  {
    id: "b-030", phase: 5, phaseLabel: "Lv5 Pushes & Endgame",
    heroName: "Jessie", goalType: "skill_level",
    description: "Jessie Stand at Arms → Lv5",
    target: { skillName: "Stand at Arms", skillCategory: "expedition", targetLevel: 5 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: "Most accessible Lv5 target (already 4★ Epic)"
  },
  {
    id: "b-031", phase: 5, phaseLabel: "Lv5 Pushes & Endgame",
    heroName: "Flint", goalType: "skill_level",
    description: "Flint Burning Resolve → Lv5",
    target: { skillName: "Burning Resolve", skillCategory: "expedition", targetLevel: 5 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally / AC", notes: "#1 long-term target. Requires 4★."
  },
  {
    id: "b-032", phase: 5, phaseLabel: "Lv5 Pushes & Endgame",
    heroName: "Molly", goalType: "skill_level",
    description: "Molly Snow's Grace → Lv5",
    target: { skillName: "Snow's Grace", skillCategory: "expedition", targetLevel: 5 },
    manualOnly: false, completed: false, completedDate: null,
    modeImpact: "Expedition / Rally", notes: "Requires 4★"
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
