# Claude Code Handoff — Tracker v2 Integration

**Context:** The WOS Hero Tracker PWA currently imports three sheets (Hero Overview, Gear Detail, Skills) and keeps Roadmap + future features in hardcoded seed files (`roadmapSeed.js`). Two new xlsx files (`wally_hero_tracker_v2.xlsx`, `beav_hero_tracker_v2.xlsx`) now include three *additional* sheets — **Strategy Summary**, **Roadmap**, and **Pets** — plus new roadmap goal types and new non-hero entities in the roadmap. The existing importer will silently ignore the new sheets (safe). This spec describes what to add so v2 data is first-class.

**⚠️ Spec-drift caveat:** this document was written against a snapshot of project files (`RoadmapDashboard.jsx`, `roadmapSeed.js`, `WOS_HERO_TRACKER_SPEC.md`, `WOS_ROADMAP_FEATURE_SPEC.md`) as of the tracker-v2 build. It references paths like `src/lib/import.js` and `src/lib/roadmap.js` *by inference from those specs, not from inspection of the live codebase.* If the Buff Strategy tab, Hero Pipeline feature, or any refactor has landed since then, the actual files may be named or organized differently. **Do not start editing until Phase 0 completes.**

**Target ordering:** work in phases.
- **Phase 0** (required, non-destructive): orientation pass — survey the real code, reconcile with this spec, report conflicts.
- **Phase A** (required): minimum viable — stop breaking roadmap parity with the xlsx.
- **Phase B** (recommended): pets as a real feature.
- **Phase C** (optional): polish.

---

## Background — what's in the v2 files

### New sheets
| Sheet | Purpose | Rows | Schema |
|-------|---------|------|--------|
| Strategy Summary | Front-page dashboard (Category / Current State / Deployment Plan / Priority). Static narrative content for the user, not app-driven data. | ~10 | No parsing required. See Phase C for optional rendering. |
| Roadmap | Replaces `roadmapSeed.js` as source of truth when imported. | 32–36 | See §A.1. |
| Pets | Pet roster including locked/future pets. | 10 | See §B.2. |

### New goal types in Roadmap
Four new values appear in the `Goal Type` column:
- `pet_capture` — acquire a pet (hero column holds pet name, not a real hero)
- `pet_level` — level a pet to `Target Value`
- `pet_refine` — refinement task (`Target Rarity` holds the wild-mark tier)
- `hoard` — resource-accumulation goal (gems for Mia). Manual-only.

Plus one existing-but-now-actually-used type:
- `chief_gear` — already in the enum per `WOS_ROADMAP_FEATURE_SPEC.md` but no previous data used it.

### Non-hero values in the Hero column
These appear in the Roadmap sheet but are NOT heroes in the roster:
- Pet names: `Cave Hyena`, `Arctic Wolf`, `Musk Ox`, `All Gen 1 Pets`
- Entity placeholders: `Chief` (for chief_gear), `Mia` (hoard target — hero not yet acquired)

---

## Phase 0 — Orientation Pass (DO THIS FIRST, DO NOT EDIT YET)

**Goal:** confirm what's actually in the codebase before touching it. Produce a short reconciliation report and get Bill's thumbs-up before proceeding to Phase A. Expected effort: one read-only pass, 5–15 minutes of exploration, followed by a written report.

### 0.0 Ground rules
- **Read-only.** No file edits in Phase 0. No `git commit`, no `npm install`, no scaffolding.
- **No assumptions.** If the spec says "`src/lib/import.js`" and you find `src/import/parseXlsx.ts` instead, record the mismatch — don't silently adapt.
- **Flag, don't fix.** If something in the spec looks wrong or outdated, write it down. Bill decides what to do.

### 0.1 Survey checklist — file and symbol inventory

For each row below, locate the actual file(s) and record the path. Use `rg`/`grep` freely.

| Spec references… | Find the real location of… |
|---|---|
| `src/lib/import.js` (xlsx parser) | The module that calls SheetJS / `XLSX.read` / `sheet_to_json`. Note if it's `.js` or `.ts`. |
| `src/lib/export.js` (xlsx writer) | The module that produces the downloaded xlsx. |
| `src/lib/roadmap.js` — `GoalType`, `detectGoalCompletion`, `getGoalProgress`, `runAutoDetection`, `PHASE_COLORS` | Whichever module(s) currently export these. |
| `src/data/roadmapSeed.js` | The hardcoded roadmap data (may be split per-chief). |
| `src/data/seed.js` | Hero roster seed data. |
| `RoadmapDashboard.jsx` | The "Next Up" dashboard component. |
| `ChiefView.jsx`, `ChiefTabs.jsx`, `HeroDetail.jsx`, `HeroEditForm.jsx`, `HeroRow.jsx`, `GearSlot.jsx`, `StarBar.jsx`, `ActionBar.jsx`, `EmptyState.jsx` | Confirm each still exists; note any renames or consolidations. |
| The `Chief` type/interface (may be implicit if plain JS) | The shape of a chief object — what fields does it currently carry? |
| The `Hero` type | Same — what fields? |
| Any `Pet`, `pets`, `BeastCage` references | Anything pet-related already started? |
| Any `ChiefGear`, `chiefGear`, `Furnace` references | Anything chief-gear already started? |
| Buff Strategy tab — any of `BuffStrategy*.jsx`, `buffStrategy*.js`, or routing referencing it | Has the tab been built, stubbed, or not started? |
| Hero Pipeline feature — any `HeroPipeline*`, `pipeline*` references | Same question. |

### 0.2 Behavioral checks

Answer each of these from the real code, not from memory of the spec:

1. **Where is the roadmap loaded from at app start?** Seed only, localStorage only, or both with a merge? If both, what's the precedence?
2. **Is the Roadmap sheet already being parsed from the xlsx?** If so, what does its schema look like, and does it match §A.1 of this spec? (There's a nonzero chance Bill already asked Claude Code to wire it up in a prior session.)
3. **Is the Pets sheet already being parsed from the xlsx?** Same question.
4. **Does the `Chief` object already have a `pets[]` field?** Even a stub counts.
5. **Current values of the `GoalType` union/enum.** List them verbatim. Compare against the spec's expected list (§A.2).
6. **Does `detectGoalCompletion` currently accept `(goal, heroes)` or `(goal, chief)`?** Phase B wants chief-level access; if it's already chief-scoped, Phase B gets easier.
7. **Does `getGoalProgress` have any code path that throws on a missing hero?** If so, note the line — Phase A.4 fixes it.
8. **Is `PHASE_COLORS` currently an array, an object keyed by phase number, or something else?** The v2 xlsx uses 8 phases; the original spec had 5.

### 0.3 Conflict categorization

When you encounter mismatches between the spec and reality, categorize each as:

- **🟢 Path-only drift** — a file moved or was renamed, but the design intent is unchanged. Record the new path, proceed per spec.
- **🟡 Partial overlap** — someone already built part of what this spec describes (e.g., pets sheet parser exists but only reads 6 of 12 columns). Don't duplicate; propose an extension.
- **🔴 Hard conflict** — the existing code does something incompatible with the spec (e.g., `GoalType` is now a numeric enum, not a string union; or pets are modeled as per-alliance not per-chief). STOP. Report to Bill, wait for direction.

### 0.4 Phase 0 deliverable — the Reconciliation Report

Produce a single markdown block with this structure, post it back, and **do not edit any files until Bill approves it.** Keep it short — a page or two at most.

```markdown
## Phase 0 Reconciliation Report

### Spec-path → actual-path map
- `src/lib/import.js` → <actual path>
- `src/lib/roadmap.js` → <actual path>
- …

### Current GoalType values
<verbatim list>

### What's already built from this spec (or adjacent)
- <feature>: <status — not started / stubbed / partial / complete>
- …

### 🟢 Path-only drift
- <one-line items>

### 🟡 Partial overlap — needs extension not duplication
- <area>: <what exists, what's missing, recommendation>

### 🔴 Hard conflicts — need Bill's decision
- <description of conflict>
- Options: (a) … (b) … (c) …
- Recommendation: …

### Proposed deviations from spec
- <any place where doing exactly what the spec says would be worse than an alternative, given what's actually there>

### Go/No-go
- If zero 🔴 items and Bill approves, proceed to Phase A.
- If any 🔴, wait for Bill.
```

### 0.5 Gate criteria — you may proceed to Phase A when…

- [ ] Every file path in the spec-path→actual-path map has been resolved (either confirmed as-is, or remapped).
- [ ] The current `GoalType` values are documented.
- [ ] No 🔴 hard conflicts remain unaddressed.
- [ ] Bill has posted "approved" or equivalent in chat.

If any of the above is not met, **do not start editing.** Wait.

---

## Phase A — Minimum Viable (required)

**Prerequisite:** Phase 0 complete, Reconciliation Report approved by Bill.

### A.1 Extend XLSX importer to read Roadmap sheet

**File:** `src/lib/import.js` (or wherever SheetJS parsing lives — use actual path from Phase 0)

Add a fourth parser pass after the existing three. The Roadmap sheet has this schema (Row 1 = headers, data from Row 2):

| Col | Header | Type | Notes |
|-----|--------|------|-------|
| A | Priority | number | Row order within phase. The array index is still the true priority (per existing design note). |
| B | Phase | number | 1–8 |
| C | Phase Label | string | "Immediate – Deploy Hoard", "Pet Gen 1 – Development Foundation", etc. |
| D | Hero | string | Hero name OR pet name OR "Chief" OR "Mia" (future hero) |
| E | Goal Type | string | See §0.2. Also: existing types. |
| F | Description | string | Human-readable |
| G | Target Slot | string | Gear slot for gear goals, empty otherwise |
| H | Target Value | number or string | Level number OR pet level OR enhancement +N |
| I | Target Rarity | string | "Mythic" / "Common" / etc. |
| J | Skill Name | string | For skill_level goals |
| K | Skill Category | string | "exploration" / "expedition" |
| L | Manual Only | string | "TRUE" / "FALSE" |
| M | Completed | string | "TRUE" / "FALSE" |
| N | Completed Date | string | ISO date or blank |
| O | Mode Impact | string | "Arena + Expedition", etc. |
| P | Notes | string | |

**Flat → nested translation.** The existing seed uses a nested `target` object. Translate per goal type:

```javascript
function xlsxRowToGoal(row, chiefPrefix, index) {
  const goalType = row["Goal Type"];
  const target = {};

  switch (goalType) {
    case "gear_enhancement":
      target.gearSlot = row["Target Slot"];
      target.targetEnhancement = Number(row["Target Value"]) || 0;
      break;
    case "gear_mf":
      target.gearSlot = row["Target Slot"];
      target.targetMF = Number(row["Target Value"]) || 0;
      break;
    case "gear_acquire":
      target.gearSlot = row["Target Slot"];
      target.targetRarity = row["Target Rarity"];
      break;
    case "skill_level":
      target.skillName = row["Skill Name"];
      target.skillCategory = row["Skill Category"];
      target.targetLevel = Number(row["Target Value"]) || 0;
      break;
    case "star_ascension":
      target.targetStars = Number(row["Target Value"]) || 0;
      break;
    case "pet_capture":
      target.targetRarity = row["Target Rarity"];
      break;
    case "pet_level":
      target.targetLevel = Number(row["Target Value"]) || 0;
      break;
    case "pet_refine":
      target.targetRarity = row["Target Rarity"]; // wild-mark tier
      break;
    case "chief_gear":
    case "hoard":
    case "general":
    default:
      // no target fields
      break;
  }

  return {
    id: `${chiefPrefix}-${String(index).padStart(3, "0")}`,
    phase: Number(row["Phase"]),
    phaseLabel: row["Phase Label"],
    heroName: row["Hero"] || "",
    goalType,
    description: row["Description"],
    target,
    manualOnly: row["Manual Only"] === "TRUE",
    completed: row["Completed"] === "TRUE",
    completedDate: row["Completed Date"] || null,
    modeImpact: row["Mode Impact"] || "",
    notes: row["Notes"] || "",
  };
}
```

**Import merge policy:** if the imported xlsx has a Roadmap sheet, replace the chief's roadmap entirely with the imported rows (do not append — the v2 roadmap is a coherent re-prioritization). Preserve this behavior in the existing import flow that already replaces Hero Overview/Gear/Skills.

**Graceful degradation:** if the Roadmap sheet is missing (v1 file), fall back to the seeded roadmap as today. Do not throw.

### A.2 Update GoalType enum

**File:** `src/lib/roadmap.js` (or wherever `GoalType` is defined) and `WOS_ROADMAP_FEATURE_SPEC.md`

Extend the union:
```typescript
type GoalType =
  | "gear_enhancement"
  | "gear_mf"
  | "gear_acquire"
  | "skill_level"
  | "star_ascension"
  | "shard_accumulate"
  | "weapon_upgrade"
  | "chief_gear"
  | "pet_capture"      // NEW
  | "pet_level"        // NEW
  | "pet_refine"       // NEW
  | "hoard"            // NEW
  | "general";
```

### A.3 Update auto-detection for non-crashing defaults

**File:** `src/lib/roadmap.js` `detectGoalCompletion()`

The existing `default:` returns `goal.completed`, so new types won't crash. Add explicit cases so pet goals can auto-detect once the Pet model exists (Phase B). Until then, they behave as manual-only:

```javascript
switch (goal.goalType) {
  // ... existing cases ...

  case "pet_capture":
  case "pet_level":
  case "pet_refine":
  case "chief_gear":
  case "hoard":
    return goal.completed;  // manual-only until Phase B/C adds models

  default:
    return goal.completed;
}
```

### A.4 RoadmapDashboard "Next Up" — handle non-hero rows

**File:** `RoadmapDashboard.jsx` / `GoalRow` component

Current `getGoalProgress(goal, heroes)` looks up a hero by `goal.heroName`. For pet / chief / hoard rows, that lookup returns undefined. Make sure `getGoalProgress` returns `{ pct: 0, label: "" }` (or `{ pct: goal.completed ? 1 : 0, label: goal.completed ? "Done" : "—" }`) in that case rather than throwing.

**File:** `RoadmapDashboard.jsx`

The dashboard "Next Up" card will now sometimes surface pet/chief/hoard goals. That's fine visually — they're just lines with a description and no progress bar. Consider a small visual distinction:
```jsx
const isNonHeroGoal = ["pet_capture", "pet_level", "pet_refine", "chief_gear", "hoard"].includes(goal.goalType);
// render a 🐾 / 🏰 / 💎 icon prefix on the description if isNonHeroGoal
```

Icon mapping:
- `pet_*` → 🐾
- `chief_gear` → 🏰
- `hoard` → 💎

### A.5 Update seed files

**Files:** `src/data/roadmapSeed.js`

After A.1 works, re-parse the v2 xlsx files once and dump the result into `roadmapSeed.js` so the hardcoded defaults match the latest xlsx (in case user loads the app fresh without importing). This can be done with a one-off script or manually. I can produce the seed contents if needed — just ask.

### Phase A acceptance

1. Import `wally_hero_tracker_v2.xlsx` → app loads without console errors.
2. The "Next Up" card on Wally shows items including `Flint → 4★`, and pet rows eventually appear.
3. Importing `beav_hero_tracker_v2.xlsx` replaces Beav's roadmap with the v2 priorities.
4. Unchecking auto-detection for a pet row does NOT crash.
5. Existing v1 xlsx files still import (graceful fallback to seed for missing Roadmap sheet).

---

## Phase B — First-class Pet support

### B.1 Pet data model

**File:** `src/lib/types.js` (or TS definitions)

```typescript
interface Pet {
  name: string;                         // "Cave Hyena", "Musk Ox"
  generation: 1 | 2 | 3 | 4 | 5 | 6;
  rarity: "Uncommon" | "Rare" | "Epic" | "Legendary";
  status: "To Capture" | "Captured" | "Locked";
  level: number;                        // 0 if not captured
  advancement: number;                  // advancement tier, 0-N
  activeSkill: string;                  // "Builder's Aid"
  activeSkillEffect: string;            // Long description
  refinementFocus: string;              // "Common Wild Marks only"
  unlockRequirement: string;            // "Furnace 18 + Server Day 54"
  priority: "High" | "High (Gate)" | "Medium" | "Low" | "Future High" | ...;
  notes: string;
}

interface Chief {
  // existing fields...
  pets: Pet[];                          // NEW
}
```

### B.2 Pets sheet parser

**File:** `src/lib/import.js`

Add a fifth parser pass for the Pets sheet. Columns (Row 1 = headers):

| Col | Header | Maps to |
|-----|--------|---------|
| A | Pet | `name` |
| B | Generation | `generation` (number) |
| C | Rarity | `rarity` |
| D | Status | `status` |
| E | Level | `level` (number; `"-"` → 0) |
| F | Advancement | `advancement` (number; `"-"` → 0) |
| G | Active Skill | `activeSkill` |
| H | Active Skill Effect | `activeSkillEffect` |
| I | Refinement Focus | `refinementFocus` |
| J | Unlock Requirement | `unlockRequirement` |
| K | Priority | `priority` |
| L | Notes | `notes` |

### B.3 Pet auto-detection

**File:** `src/lib/roadmap.js`

```javascript
case "pet_capture": {
  const pet = chief.pets?.find(p => p.name === goal.heroName);
  return pet && pet.status === "Captured";
}
case "pet_level": {
  const pet = chief.pets?.find(p => p.name === goal.heroName);
  return pet ? pet.level >= (goal.target.targetLevel ?? Infinity) : false;
}
case "pet_refine":
  return goal.completed;  // remains manual — no way to detect wild-mark usage
```

Note the signature change: `detectGoalCompletion` needs access to `chief.pets`, not just `heroes`. Update callers.

### B.4 Pets tab UI

**File:** new `PetsView.jsx`, wire into `ChiefTabs.jsx`

Add "Pets" as a third tab alongside existing chief tabs (or wherever Heroes currently live). Minimum render:
- Grouped by Generation (Gen 1 captured / Gen 2 locked / etc.)
- Each pet card: name, level/advancement, active skill + effect, priority badge
- Edit modal for setting Level, Advancement, Status

Visual treatment: the v2 xlsx uses generation-based row fills (Gen 1 green, Gen 2 blue, etc.). Match that color language in cards.

### B.5 Pet export

**File:** `src/lib/export.js`

When exporting a chief to xlsx, include a Pets sheet following the schema above. Match column widths and styling from the v2 reference files (view the generated files to copy them).

### Phase B acceptance

1. Importing v2 xlsx populates a Pets array on the chief.
2. New "Pets" tab shows the 3 Gen 1 pets + locked future pets.
3. Once a user sets `Cave Hyena` status to "Captured", the `pet_capture` goal for Cave Hyena auto-completes.
4. Once `Musk Ox` level >= 15, the corresponding `pet_level` goal auto-completes.
5. Export produces a xlsx that re-imports with identical pet data.

---

## Phase C — Polish (optional)

### C.1 Strategy Summary sheet rendering
The v2 xlsx has a `Strategy Summary` sheet with 4 columns (Category / Current State / Deployment Plan / Priority). Two options:
- **Skip** (recommended for now): user reads this in Excel, app doesn't need to render it.
- **Render**: build a "Chief Strategy" panel at the top of `ChiefView` that reads this sheet as a static, unparsed narrative block. Low ROI unless the user asks for it.

### C.2 Chief Gear tab
The new `chief_gear` goal type is currently bookkeeping-only. If Bill wants to track chief gear progression (Furnace 22 path), add a Chief Gear data model and tab parallel to Pets. This is tracked separately in the existing `wos-buff-strategy-tab-spec.md` — align with that spec before implementing so features don't conflict.

### C.3 Hoard tracker
The `hoard` goal type (gems for Mia, wild marks for Snow Leopard) could have a tiny tracker panel showing "X gems saved / 175,500 target" if Bill wants to enter his current gem count. Defer until the user requests it.

### C.4 Filter goal list by goal type / hero
With pet rows now mixed into the roadmap, the existing Roadmap full-view could gain a filter dropdown: All / Heroes only / Pets only / Chief Gear / Hoard. Useful if the list grows past ~40 rows.

---

## Gotchas / things to double-check

1. **Hero column can be blank** in some v1 rows already — the v2 uses `""` consistently but double-check no code assumes `goal.heroName` is always truthy.
2. **The `Target Value` column mixes types** (gear enhancement level vs. pet level vs. skill level vs. star count). The translator in §A.1 handles this correctly, but if any code reads the raw xlsx column, it'll break. Always route through the translator.
3. **`All Gen 1 Pets`** appears as a Hero value in one `pet_refine` row (intentional — it's a meta-rule reminder, not tied to a specific pet). Auto-detection for this row should fall through to manual.
4. **Natalia on Beav is Lv1, 0★** — the existing Stars regex `/^(\d+)\s*(?:\((\d+)\/6\))?$/` already handles `0` correctly, but verify it doesn't filter her out as "invalid".
5. **Priority field on a hoard row** — `Mia` is in the roadmap but not yet acquired. Don't let the roster view try to render her from a roadmap row; only the Hero Overview sheet should seed roster entries.

---

## File-change checklist (Phase A)

**Prerequisite:** Phase 0 Reconciliation Report has been posted and Bill has approved. Use the *actual* paths from the spec-path→actual-path map in that report — not the paths written below, which are inferred from an older snapshot.

- [ ] **Parser module** (spec says `src/lib/import.js`) — parse Roadmap sheet, add flat→nested translator per §A.1. If a partial parser already exists, extend rather than replace.
- [ ] **Roadmap logic module** (spec says `src/lib/roadmap.js`) — extend `GoalType` with the four new values per §A.2. If §A.2 overlaps with values already added in a prior session, skip the overlap and only add what's genuinely new.
- [ ] **Auto-detection** — add defensive cases in `detectGoalCompletion` per §A.3.
- [ ] **Progress calculation** — update `getGoalProgress` (or equivalent) to not throw on non-hero goals per §A.4.
- [ ] **Dashboard component** (spec says `RoadmapDashboard.jsx`) — optional icon prefix for non-hero goals per §A.4.
- [ ] **Roadmap seed** (spec says `src/data/roadmapSeed.js`) — regenerate from v2 xlsx per §A.5. Ask Bill if you want the regenerated seed content posted into chat; I can produce it on request.
- [ ] **Feature spec doc** (spec says `WOS_ROADMAP_FEATURE_SPEC.md`) — update `GoalType` union documentation. This is a docs update, not runtime code.
- [ ] **Smoke test** — import both v2 xlsx files, confirm the five acceptance criteria at the end of Phase A.

For Phase B the additional surface area is: a `Pet` type definition (wherever types live), a Pets-sheet parser in the import module, a Pets-sheet writer in the export module, a new `PetsView.jsx` (or equivalent), tab wiring in `ChiefTabs.jsx` (or equivalent), and optionally a `petsSeed.js` for default data.

---

## Questions Bill should answer before Phase B starts

These are raised by Phase 0 findings. Hold them until the reconciliation report is in — the answers may be obvious from the existing code.

1. **Does the existing app represent a Chief as containing heroes only**, or is there already a container object that could hold `pets[]`? If Phase 0 finds a `Chief` interface with a placeholder `pets` field, this question is answered.
2. **Should Pets be per-chief or shared across chiefs?** In-game they are per-chief — Wally's Cave Hyena is separate from Beav's. Default to per-chief unless the existing data model strongly suggests otherwise.
3. **Is there appetite for a Chief Gear tab now**, or is it deferred until after Mia lands? Aligns with the Buff Strategy tab spec.
4. **If the Buff Strategy tab is already partly built**, does it need to coordinate with the new `chief_gear` and `hoard` goal types? Phase 0 should surface this.

---

## Related docs in the project

For full context, Claude Code should skim these if they exist in the repo:

- `WOS_HERO_TRACKER_SPEC.md` — the original app spec (hero roster, gear, skills, import/export format).
- `WOS_ROADMAP_FEATURE_SPEC.md` — the roadmap feature spec (goal types, auto-detection, dashboard UI).
- `wos-buff-strategy-tab-spec.md` — the not-yet-built Buff Strategy tab. Phase C work overlaps with this; coordinate before building.
- `wos-buff-strategy-roadmap.md` — longer-form context on the buff-system strategy this all serves.
- `wally-enhancement-roadmap.md`, `beav-enhancement-roadmap.md` — markdown versions of per-chief roadmaps (predates the xlsx roadmap sheet).

The two v2 xlsx files themselves (`wally_hero_tracker_v2.xlsx`, `beav_hero_tracker_v2.xlsx`) are the authoritative data source — open them and read every sheet before writing parser code.

---

## Out of scope for this handoff

To be explicit about what this handoff does *not* cover:

- Building the Buff Strategy tab (separate spec).
- Building the Hero Pipeline feature (separate spec — Mia and Alonzo pipelines are already specified elsewhere).
- Any alliance-side features (battle plans, educational content) — those are document outputs, not app features.
- Any Wordscapes or non-WOS game features.

---

## Summary of phases

| Phase | Required? | Scope | Gate |
|---|---|---|---|
| 0 | Yes | Read-only orientation pass, produce Reconciliation Report | Bill approves report |
| A | Yes | Roadmap xlsx parity: parser, GoalType, defensive rendering | Both v2 xlsx files import clean; acceptance criteria pass |
| B | Recommended | Pets as a first-class feature: data model, tab, auto-detect | Pet auto-detection works; round-trip export/import |
| C | Optional | Polish: Strategy Summary panel, Chief Gear tab, hoard tracker, filters | User-requested only |

End of handoff.
