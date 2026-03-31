# WOS Hero Tracker — Roadmap Feature Spec (Addendum)

## Extends: WOS_HERO_TRACKER_SPEC.md

This document specifies the Roadmap feature addition to the WOS Hero Tracker PWA. It adds priority-based goal tracking per chief, with auto-detection of progress where possible and manual checkoff for acquisition milestones.

---

## Table of Contents

1. [Feature Overview](#1-feature-overview)
2. [Data Model Additions](#2-data-model-additions)
3. [Auto-Detection Logic](#3-auto-detection-logic)
4. [UI Specification](#4-ui-specification)
5. [Seed Data](#5-seed-data)
6. [Spreadsheet Integration](#6-spreadsheet-integration)
7. [Build Phases](#7-build-phases)

---

## 1. Feature Overview

### What It Does
- Displays a prioritized queue of enhancement goals per chief (gear upgrades, skill levels, star ascensions, gear acquisitions)
- Shows a **dashboard summary** at the top of the hero view with the next 3 actionable goals
- Provides a **full roadmap tab** with all goals grouped by phase, showing completion status
- **Auto-detects** completion for measurable goals (enhancement level hit, skill leveled, stars gained)
- Supports **manual checkoff** for acquisition goals ("acquire Mythic Goggles") and other milestones that can't be derived from current hero data
- Goals are editable in-app: reorder, edit targets, add new goals, remove completed ones
- Seeded from the Wally and Beav enhancement roadmaps on first load

### What It Does NOT Do
- No notifications or reminders (out of scope for PWA v1)
- No cross-chief goal dependencies
- No resource cost estimation (Ore, manuals, etc.)

---

## 2. Data Model Additions

### Updated AppData

```typescript
interface AppData {
  version: 2;  // bump from 1
  chiefs: Record<string, Chief>;
  activeChief: string;
}

interface Chief {
  name: string;
  heroes: Hero[];
  roadmap: RoadmapGoal[];  // NEW — ordered array, index = display priority
}
```

### RoadmapGoal

```typescript
interface RoadmapGoal {
  id: string;              // unique ID, e.g. "wally-goal-001"
  phase: number;           // 1-5, for grouping (maps to roadmap phases)
  phaseLabel: string;      // "Immediate", "Mid-Term", "Alonzo Transition", etc.
  heroName: string;        // which hero this goal applies to, or "" for general goals
  goalType: GoalType;
  description: string;     // human-readable: "Push Molly Boots to +45"
  target: GoalTarget;      // what "done" looks like
  manualOnly: boolean;     // true = no auto-detect, must be manually checked
  completed: boolean;      // manual override or auto-detected
  completedDate: string | null;  // ISO date when marked complete
  modeImpact: string;      // "Arena + Expedition", "Labyrinth / Rally", etc.
  notes: string;           // optional context
}

type GoalType =
  | "gear_enhancement"    // push a gear slot to a target enhancement level
  | "gear_mf"            // push a gear slot to a target MF level
  | "gear_acquire"       // acquire a specific rarity gear for a slot (manual)
  | "skill_level"        // level a specific skill to a target level
  | "star_ascension"     // reach a target star level
  | "shard_accumulate"   // accumulate shards for a hero (manual)
  | "weapon_upgrade"     // upgrade exclusive weapon (manual)
  | "chief_gear"         // chief gear milestone (manual, future)
  | "general";           // freeform goal not tied to a specific measurable

interface GoalTarget {
  // For gear_enhancement:
  gearSlot?: "Goggles" | "Gloves" | "Belt" | "Boots";
  targetEnhancement?: number;       // e.g. 45, 55, 60

  // For gear_mf:
  gearSlot?: string;
  targetMF?: number;                // e.g. 2, 3

  // For gear_acquire:
  gearSlot?: string;
  targetRarity?: string;            // e.g. "Mythic", "Epic"

  // For skill_level:
  skillName?: string;               // exact skill name
  skillCategory?: "exploration" | "expedition";
  targetLevel?: number;             // e.g. 4, 5

  // For star_ascension:
  targetStars?: number;             // e.g. 4

  // General: no specific target fields, just description + manualOnly
}
```

### Design Notes

- `roadmap` is an ordered array. The index IS the priority. Reordering means splicing the array.
- `phase` is for visual grouping only — it doesn't affect priority order. A Phase 2 goal can be prioritized above a Phase 1 goal if the user reorders.
- `completed` can be set by auto-detection OR manual toggle. Once manually marked complete, auto-detection does not un-complete it (prevents flickering if user edits gear temporarily).
- `completedDate` is set when status transitions to complete. Useful for tracking velocity over time.

---

## 3. Auto-Detection Logic

On every render of the roadmap (and whenever hero data changes via edit or import), run detection:

```typescript
function detectGoalCompletion(goal: RoadmapGoal, heroes: Hero[]): boolean {
  if (goal.manualOnly) return goal.completed;  // respect manual state
  if (goal.completed) return true;              // don't un-complete

  const hero = heroes.find(h => h.name === goal.heroName);
  if (!hero) return goal.completed;             // hero not found, keep current state

  switch (goal.goalType) {
    case "gear_enhancement": {
      const gear = hero.gear.find(g => g.slot === goal.target.gearSlot);
      return gear ? (gear.enhancement ?? 0) >= (goal.target.targetEnhancement ?? Infinity) : false;
    }
    case "gear_mf": {
      const gear = hero.gear.find(g => g.slot === goal.target.gearSlot);
      return gear ? (gear.masterForgery ?? 0) >= (goal.target.targetMF ?? Infinity) : false;
    }
    case "skill_level": {
      const category = goal.target.skillCategory;
      const skills = category === "exploration" ? hero.skills.exploration : hero.skills.expedition;
      const skill = skills.find(s => s.name === goal.target.skillName);
      return skill ? skill.level >= (goal.target.targetLevel ?? Infinity) : false;
    }
    case "star_ascension": {
      return hero.stars >= (goal.target.targetStars ?? Infinity);
    }
    // gear_acquire, shard_accumulate, weapon_upgrade, chief_gear, general:
    default:
      return goal.completed;  // manual only
  }
}
```

### Important Behaviors

- Auto-detection runs on mount and after any hero edit/import. Not on a timer.
- When auto-detection flips a goal to complete, set `completedDate` to now.
- A goal that was manually marked complete stays complete even if hero data regresses (user might be mid-edit).
- The dashboard "next 3" skips completed goals — it shows the first 3 incomplete goals in priority order.

---

## 4. UI Specification

### 4.1 Dashboard Summary (Top of ChiefView)

Positioned between the action bar and the "ACTIVE ROSTER" section header. Compact card showing the next 3 incomplete goals.

```
┌──────────────────────────────────┐
│  📋 NEXT UP                      │
│                                  │
│  1. Molly Boots → +45           │
│     ████████░░░░ +23/+45  Arena │
│                                  │
│  2. Bahiti Precise Shot → Lv4   │
│     ██████░░░░░░ Lv3/Lv4  Arena │
│                                  │
│  3. Molly Goggles → +52         │
│     ██████████░░ +45/+52  Arena │
│                                  │
│  ▸ View Full Roadmap (14 goals) │
└──────────────────────────────────┘
```

**Dashboard card specs:**
- Dark card background (#111827), subtle border (#1E293B), rounded corners
- "NEXT UP" header in small caps, muted color
- Each goal row shows:
  - Priority number (1-indexed among incomplete goals)
  - Short description (from `description` field)
  - Progress bar: colored by phase (Phase 1 = green, Phase 2 = blue, Phase 3 = amber, Phase 4 = purple, Phase 5 = gray)
  - Current/target values (auto-derived where possible, e.g. "+23/+45")
  - Mode impact tag in small muted text
- "View Full Roadmap" link at bottom navigates to full roadmap view
- If all goals are complete, show a congratulatory message: "All goals complete! Add new goals in the Roadmap."
- If no roadmap exists, show: "No roadmap set up. Import one or add goals manually."
- Tapping a goal row scrolls to / highlights the relevant hero in the roster below

**Progress bar calculation:**
- `gear_enhancement`: current enhancement / target enhancement (e.g. 23/45 = 51%)
- `gear_mf`: current MF / target MF (e.g. 1/3 = 33%)
- `skill_level`: (currentLevel - 1) / (targetLevel - 1) — adjusted so Lv1 = 0%, target = 100%
- `star_ascension`: current stars / target stars
- `gear_acquire`, `manual`: 0% if incomplete, 100% if complete (binary)

### 4.2 Full Roadmap Tab

Accessible via "View Full Roadmap" link on dashboard, or a "Roadmap" button in the action bar. This could be a modal/sheet that slides up (mobile-friendly) or a separate view.

```
┌──────────────────────────────────┐
│  ← Back    ROADMAP    + Add     │
├──────────────────────────────────┤
│                                  │
│  PHASE 1 — Immediate (3/6 done) │
│  ┌────────────────────────────┐ │
│  │ ✅ Molly Boots → +45       │ │
│  │    Completed Mar 15        │ │
│  ├────────────────────────────┤ │
│  │ ⬜ Molly Goggles → +52     │ │
│  │    +45/+52 · Arena + Expd  │ │
│  │    ██████████░░             │ │
│  ├────────────────────────────┤ │
│  │ ⬜ Bahiti Precise Shot Lv4  │ │
│  │    Lv3/Lv4 · Arena         │ │
│  │    ██████░░░░░░             │ │
│  └────────────────────────────┘ │
│                                  │
│  PHASE 2 — Mid-Term (0/5 done)  │
│  ┌────────────────────────────┐ │
│  │ ⬜ Flint Mythic Goggles     │ │
│  │    Acquire · All modes      │ │
│  │    ░░░░░░░░░░░░ Manual     │ │
│  └────────────────────────────┘ │
│  ...                             │
└──────────────────────────────────┘
```

**Roadmap view specs:**
- Grouped by phase with phase label and completion count
- Each goal card shows:
  - Checkbox (tap to manually toggle complete)
  - Description
  - Progress bar + current/target (for auto-detect goals)
  - Mode impact tag
  - Completion date if done
- Completed goals are visually dimmed (lower opacity, strikethrough on description)
- Completed goals collapse within their phase group (show count, expandable)
- Long-press or swipe on a goal to access: Edit, Reorder (drag handle), Delete
- "+ Add" button opens a goal creation form

### 4.3 Goal Editor (Add / Edit)

Simple form for creating or editing a goal:

| Field | Input | Notes |
|-------|-------|-------|
| Hero | Dropdown of current chief's heroes + "General" | Required |
| Goal Type | Dropdown: Gear Enhancement, Gear MF, Gear Acquire, Skill Level, Star Ascension, General | Determines which target fields appear |
| Description | Text input | Auto-generated from type + target, but editable |
| Phase | Dropdown: 1-5 | For grouping |
| Target fields | Conditional on goal type | See below |
| Mode Impact | Text input | Freeform, e.g. "Arena + Expedition" |
| Notes | Text input | Optional context |

**Conditional target fields by goal type:**

- **Gear Enhancement:** Gear Slot dropdown (Goggles/Gloves/Belt/Boots) + Target Enhancement number input
- **Gear MF:** Gear Slot dropdown + Target MF number input (1-5)
- **Gear Acquire:** Gear Slot dropdown + Target Rarity dropdown (Mythic/Epic/Rare)
- **Skill Level:** Skill Category toggle (Exploration/Expedition) + Skill Name text input + Target Level number input (1-5)
- **Star Ascension:** Target Stars number input (1-5)
- **General:** No target fields, just description. Always manualOnly.

Auto-set `manualOnly = true` for: gear_acquire, shard_accumulate, weapon_upgrade, chief_gear, general.

### 4.4 Reordering

Goals can be reordered within the full roadmap view. Two options (pick whichever is simpler to implement for v1):

**Option A — Drag handles:** Small grip icon on the left of each goal card. Drag to reorder. Works well with libraries like `@dnd-kit/sortable`.

**Option B — Move buttons:** Up/down arrow buttons on each goal card. Simpler to implement, works fine on mobile.

Reordering changes the array index, which changes display priority. Phase grouping is purely visual — a goal's phase doesn't change when reordered.

---

## 5. Seed Data

### 5.1 Wally Roadmap

Seeded on first load (when Wally chief exists and has no roadmap). 14 goals matching the Wally Enhancement Roadmap.

```javascript
const WALLY_ROADMAP = [
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

  // === PHASE 4: Lv5 Skill Pushes ===
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
```

### 5.2 Beav Roadmap

```javascript
const BEAV_ROADMAP = [
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
    modeImpact: "Stat boost", notes: "1 sliver away, free stats"
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
```

### 5.3 Seeding Logic

```typescript
function seedRoadmapIfNeeded(appData: AppData): AppData {
  // Only seed if chief exists and has no roadmap
  if (appData.chiefs["Wally"] && (!appData.chiefs["Wally"].roadmap || appData.chiefs["Wally"].roadmap.length === 0)) {
    appData.chiefs["Wally"].roadmap = WALLY_ROADMAP;
  }
  if (appData.chiefs["Beav"] && (!appData.chiefs["Beav"].roadmap || appData.chiefs["Beav"].roadmap.length === 0)) {
    appData.chiefs["Beav"].roadmap = BEAV_ROADMAP;
  }
  return appData;
}
```

---

## 6. Spreadsheet Integration

### New Sheet: "Roadmap" (Sheet 4)

Add a 4th sheet to the import/export format:

| Column | Header | Type | Example |
|--------|--------|------|---------|
| A | Priority | number | 1 |
| B | Phase | number | 1 |
| C | Phase Label | string | "Immediate" |
| D | Hero | string | "Molly" |
| E | Goal Type | string | "gear_enhancement" |
| F | Description | string | "Molly Boots → +45" |
| G | Target Slot | string | "Boots" or "" |
| H | Target Value | number or blank | 45 |
| I | Target Rarity | string or blank | "Mythic" |
| J | Skill Name | string or blank | "Precise Shot" |
| K | Skill Category | string or blank | "exploration" |
| L | Manual Only | boolean | FALSE |
| M | Completed | boolean | FALSE |
| N | Completed Date | date or blank | 2026-03-15 |
| O | Mode Impact | string | "Arena + Expedition" |
| P | Notes | string | "" |

### Import Logic Update

When importing a spreadsheet that has a "Roadmap" sheet:
- Parse rows into RoadmapGoal objects
- Replace the chief's existing roadmap (with confirmation if goals exist)

When importing a spreadsheet without a "Roadmap" sheet:
- Keep existing roadmap untouched

### Export Logic Update

Always include the Roadmap sheet in exports, even if empty.

---

## 7. Build Phases

### Phase R1: Data Model + Seed Data

1. Add `roadmap` field to Chief interface
2. Bump data version to 2, add migration from v1 (adds empty `roadmap: []` to existing chiefs)
3. Implement seed data for Wally and Beav
4. Implement auto-detection function
5. Add roadmap to localStorage persistence

### Phase R2: Dashboard Summary

1. Build the "NEXT UP" dashboard card component
2. Position it at top of ChiefView, between action bar and roster
3. Show top 3 incomplete goals with progress bars
4. Wire up auto-detection on render
5. "View Full Roadmap" link (placeholder until R3)

### Phase R3: Full Roadmap View

1. Build roadmap view (slide-up sheet or separate route)
2. Group goals by phase with completion counts
3. Manual checkoff toggle on each goal
4. Completed goals dimmed/collapsed
5. Wire up "View Full Roadmap" from dashboard

### Phase R4: Goal Editor + Reorder

1. Add/edit goal form with conditional target fields
2. Delete with confirmation
3. Reorder via up/down buttons (drag-and-drop can come in polish phase)
4. All changes persist to localStorage

### Phase R5: Spreadsheet Integration

1. Add "Roadmap" sheet to export generator
2. Add "Roadmap" sheet parser to import
3. Handle missing sheet gracefully on import

---

## Summary

This feature turns the static enhancement roadmaps into a living tracking system inside the app. The dashboard keeps the top priorities visible at a glance on every visit, while the full roadmap view gives the complete picture with phase grouping and progress visualization. Auto-detection means most goals complete themselves as you update hero data — you only need to manually check off acquisition milestones.

The seed data covers 23 goals for Wally and 32 goals for Beav, matching the roadmap documents exactly. Both accounts can evolve independently as priorities shift.
