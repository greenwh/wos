export const DEFAULT_PETS = [
  {
    name: "Cave Hyena", generation: 1, rarity: "Rare", status: "To Capture",
    level: 0, advancement: 0,
    activeSkill: "Builder's Aid",
    activeSkillEffect: "+15% construction speed for 5 min (20-23h CD)",
    refinementFocus: "Common Wild Marks only",
    unlockRequirement: "Furnace 18 + Server Day 54",
    priority: "High",
    notes: "Stack with Double Time chief skill = ~35% total construction reduction. Activate RIGHT BEFORE starting big upgrades (Furnace, Embassy, Research Center)."
  },
  {
    name: "Arctic Wolf", generation: 1, rarity: "Uncommon", status: "To Capture",
    level: 0, advancement: 0,
    activeSkill: "Arctic Embrace",
    activeSkillEffect: "Restore 60 Chief Stamina",
    refinementFocus: "Common Wild Marks only",
    unlockRequirement: "Furnace 18 + Server Day 54",
    priority: "Medium",
    notes: "Useful on active beast-hunting days. Cooldown ~23h so plan around SVS/Bear Trap."
  },
  {
    name: "Musk Ox", generation: 1, rarity: "Uncommon", status: "To Capture",
    level: 0, advancement: 0,
    activeSkill: "Burden Bearer",
    activeSkillEffect: "Instantly complete one resource gathering tile",
    refinementFocus: "Common Wild Marks only",
    unlockRequirement: "Furnace 18 + Server Day 54",
    priority: "High (Gate)",
    notes: "LEVELING PRIORITY: must reach Lv15 to unlock Giant Tapir at Gen 2. Giant Tapir is the pet-food engine that funds all later pet development."
  },
  {
    name: "Giant Tapir", generation: 2, rarity: "Rare", status: "Locked",
    level: 0, advancement: 0,
    activeSkill: "Natural Intuition",
    activeSkillEffect: "+500 Pet Food (23h CD)",
    refinementFocus: "TBD — likely Common Wild Marks",
    unlockRequirement: "Musk Ox Lv15 + Server Day 90",
    priority: "Future High",
    notes: "Priority Gen 2 unlock. Permanent pet-food income boost compounds every day."
  },
  {
    name: "Titan Roc", generation: 2, rarity: "Rare", status: "Locked",
    level: 0, advancement: 0,
    activeSkill: "Razorbeak / Armor Rift",
    activeSkillEffect: "Reduce enemy health 5% for 2h (20h CD)",
    refinementFocus: "TBD",
    unlockRequirement: "Giant Tapir Lv15 + Server Day 90",
    priority: "Future Medium",
    notes: "Combat utility. Debuff stacks with other reductions."
  },
  {
    name: "Giant Elk", generation: 3, rarity: "Rare", status: "Locked",
    level: 0, advancement: 0,
    activeSkill: "Mystical Finding",
    activeSkillEffect: "Random rare item (Chief Charm / Fire Crystal)",
    refinementFocus: "TBD",
    unlockRequirement: "Titan Roc Lv15 + Server Day 140",
    priority: "Future Medium",
    notes: "Gate to Snow Leopard."
  },
  {
    name: "Snow Leopard", generation: 3, rarity: "Epic (SR)", status: "Locked",
    level: 0, advancement: 0,
    activeSkill: "Lightning Raid",
    activeSkillEffect: "+30% march speed, -5% enemy lethality for 2h",
    refinementFocus: "ADVANCED Wild Marks go here",
    unlockRequirement: "Giant Elk Lv15 + Server Day 140",
    priority: "Future S-Tier",
    notes: "FIRST TRUE COMBAT PET — begin spending Advanced Wild Marks on Snow Leopard refinement the day it unlocks."
  },
  {
    name: "Cave Lion", generation: 4, rarity: "Epic (SR)", status: "Locked",
    level: 0, advancement: 0,
    activeSkill: "Feral Anthem",
    activeSkillEffect: "+10% all troop attack for 2h",
    refinementFocus: "ADVANCED Wild Marks",
    unlockRequirement: "Snow Leopard Lv15 + Server Day 200",
    priority: "Future S-Tier",
    notes: "Primary Advanced Wild Mark target. Gold-standard general combat pet."
  },
  {
    name: "Snow Ape", generation: 4, rarity: "Legendary (SSR)", status: "Locked",
    level: 0, advancement: 0,
    activeSkill: "Tumbling Power",
    activeSkillEffect: "+15k squad capacity for 2h",
    refinementFocus: "Endgame Advanced Wild Marks",
    unlockRequirement: "Cave Lion Lv30 + Server Day 200",
    priority: "Future Niche",
    notes: "Rally-size booster. Very useful for Bear Trap. Long road — needs Cave Lion Lv30."
  },
];

export function seedPetsIfNeeded(appData) {
  for (const chief of Object.values(appData.chiefs)) {
    if (!chief.pets || chief.pets.length === 0) {
      chief.pets = structuredClone(DEFAULT_PETS);
    }
  }
  return appData;
}
