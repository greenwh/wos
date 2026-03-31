# WOS Hero Tracker — Buff Strategy Tab Specification

## Addendum to WOS_HERO_TRACKER_SPEC.md & WOS_ROADMAP_FEATURE_SPEC.md

**Purpose:** An account-wide "Buff Strategy" tab that tracks every non-hero buff system impacting march effectiveness — the systems the existing Roadmap doesn't cover. Together, the Roadmap (per-hero gear/skills/stars) + Buff Strategy (everything else) give complete coverage of "what should I work on next?"

---

## Relationship to Existing Roadmap

The **Roadmap** (already implemented) handles:
- Hero gear enhancement, MF, acquisition
- Hero skill levels (Exploration + Expedition)
- Star ascensions
- Widget/weapon upgrades
- Shard accumulation

The **Buff Strategy tab** (this spec) handles everything else:
- Chief Gear (crafting, enhancement, set bonuses)
- Chief Charms (leveling, uniformity bonus)
- Pets (leveling, refinement, active skill routines)
- Research Center — Battle Tree
- War Academy / Fire Crystal Tech
- VIP Level progression
- Gem Buffs (stockpiling, pre-event activation)
- Daybreak Island (Tree of Life, decorations)
- Skins (city, teleport — stacking bonuses)
- Alliance Tech (contribution, battle tree)
- Troop Tier (promotion, ratio optimization)
- Pre-Event Activation Checklist

**No per-hero items.** Those belong in the Roadmap. If a user needs to add a per-hero goal (like "Flint Widget → Level 6"), that's a Roadmap goal with type `widget` or `general`. The Buff Strategy tab links to the Roadmap for hero-specific work via a "See Roadmap for hero goals" cross-link.

---

## 1. Design Philosophy

### Priority Without Rigidity

The UX problem: "What should I work on next?" — but the best thing might not be available right now (Furnace too low, waiting on event materials, gems scarce). The UI needs to:

1. **Show priority clearly** — what matters most for march effectiveness
2. **Let the user skip freely** — mark items "blocked" and move on
3. **Surface what's actionable** — a "Ready" filter for items workable right now
4. **Track completion** — check items off, see progress, feel momentum
5. **Flag spending** — Beav is F2P, Wally is light-spender; spending items must be clearly marked

### Account-Wide Focus

Every item on this tab applies to the entire account — not a single hero. This is the "rising tide lifts all boats" checklist. When you upgrade Chief Gear, all three troop types benefit. When you level a pet, every march benefits.

---

## 2. Data Model Additions

### Updated Chief Interface

```typescript
interface Chief {
  // ... existing fields ...
  heroes: Hero[];
  roadmap: RoadmapGoal[];          // existing — per-hero goals
  buffStrategy: BuffStrategy;       // NEW — account-wide buff tracking
}

interface BuffStrategy {
  items: BuffItem[];                // ordered checklist
  preEventChecklist: PreEventItem[]; // separate quick-reference checklist
}

interface BuffItem {
  id: string;                       // unique, e.g. "chief-gear-coat-craft"
  category: BuffCategory;
  label: string;                    // human-readable: "Craft all 6 Chief Gear pieces"
  notes: string;                    // freeform context, tips, sources
  priorityTier: 1 | 2 | 3;         // 1=Do Now, 2=Next, 3=Long-Term
  status: ItemStatus;
  blockReason: string;              // why it's blocked (empty if not blocked)
  sortOrder: number;                // manual ordering within a tier
  spendFlag: boolean;               // true if this practically requires real money
  furnaceGate: number | null;       // Furnace level required (null if none)
}

interface PreEventItem {
  id: string;
  label: string;                    // "Activate Cave Lion (Feral Anthem)"
  category: "permanent" | "timed" | "event-specific";
  checked: boolean;                 // resets to false after each use (manual)
  notes: string;
}

type ItemStatus =
  | "todo"       // not started, ready to work on
  | "active"     // currently working on this
  | "blocked"    // want to do but can't right now
  | "done";      // completed

type BuffCategory =
  | "chief-gear"
  | "chief-charms"
  | "pets"
  | "research"
  | "war-academy"
  | "vip"
  | "gem-buffs"
  | "island"
  | "skins"
  | "alliance"
  | "troops";
```

### Data Version Bump

Increment the data version. Migration from previous version adds `buffStrategy: { items: [], preEventChecklist: [] }` to each existing chief, then runs the seed function to populate defaults.

---

## 3. UI Specification

### Tab Navigation

Add a third view alongside the existing Roster and Roadmap views:

```
┌──────────────────────────────────┐
│  ❄️ WOS Hero Tracker             │
│  [Wally] [Beav]                  │  ← chief tabs (existing)
├──────────────────────────────────┤
│  [📋 Roster] [🎯 Roadmap] [⚔️ Buffs] │  ← view toggle (Buffs = new)
├──────────────────────────────────┤
```

The existing Roster and Roadmap views are unchanged. The Buffs tab is a new full-screen view.

### Buffs Tab Layout

```
┌──────────────────────────────────┐
│  Filter: [All] [Ready] [Blocked] │  ← status filter chips
│  ─────────────────────────────── │
│  💡 Next up: Level Cave Lion     │
│     (active) · Push VIP to 8    │
│     (ready)                      │
│  ─────────────────────────────── │
│  🔴 DO NOW (Tier 1)              │  ← collapsible section
│  ┌──────────────────────────────┐│
│  │ 🔬 Battle tree: balance stats ││
│  │   ☐ todo                     ││
│  │ 👑 VIP: keep status active   ││
│  │   ● active · 10k gems/month  ││
│  │ ⚔️ Promote all troops to max  ││
│  │   ☐ todo                     ││
│  └──────────────────────────────┘│
│  🟡 NEXT (Tier 2)                │
│  ┌──────────────────────────────┐│
│  │ 🎖️ Craft all 6 chief gear    ││
│  │   ⏳ blocked · Need Furnace 22││
│  │ 🐾 Level Cave Lion (priority) ││
│  │   ● active                   ││
│  │ 🎨 Collect free city skins   ││
│  │   ● active · +2% Attack each ││
│  │ 🏝️ Tree of Life → Lv5        ││
│  │   ☐ todo                     ││
│  └──────────────────────────────┘│
│  🔵 LONG-TERM (Tier 3)           │
│  ...                             │
│  ─────────────────────────────── │
│  🚀 Pre-Event Checklist ▸        │  ← expandable section
│  ─────────────────────────────── │
│  📋 Hero goals → Roadmap ▸       │  ← cross-link to Roadmap tab
├──────────────────────────────────┤
│  Progress: 4/31 ████░░░░ 13%    │  ← sticky footer
└──────────────────────────────────┘
```

### Tier Headers

| Tier | Label | Color | Meaning |
|------|-------|-------|---------|
| 1 | 🔴 DO NOW | Red (#EF4444) | Highest impact, active focus |
| 2 | 🟡 NEXT | Amber (#F59E0B) | High impact, queue after Tier 1 |
| 3 | 🔵 LONG-TERM | Blue (#3B82F6) | Ongoing investment, no rush |

Tiers are collapsible. Default: Tier 1 and 2 open, Tier 3 collapsed.

### Checklist Item Row

```
┌─────────────────────────────────────┐
│ [Icon] Label text                   │
│        Category tag · status        │
│        ⏳ Need Furnace 22           │  ← only if blocked
│        💰 Requires spending          │  ← only if spendFlag
└─────────────────────────────────────┘
```

**Status icons and tap behavior:**
- `☐` todo → tap cycles to `active`
- `●` active (pulsing amber) → tap cycles to `done`
- `☑` done (dimmed, checkmark) → tap cycles back to `todo`
- `⏳` blocked (grayed) → only set via long-press menu

**Long-press** opens the detail/edit bottom sheet with all fields.

### Item Detail / Edit Sheet

Bottom sheet (slide-up on mobile):

```
┌──────────────────────────────────┐
│  Level Cave Lion (priority)      │  ← label (editable)
│  ─────────────────────────────── │
│  Category: 🐾 Pets               │  ← dropdown
│  Priority: [1] [2] [3]          │  ← tappable chips
│  Status: [Todo] [Active]        │
│          [Blocked] [Done]        │
│  ─────────────────────────────── │
│  Block Reason:                   │
│  [ __________________________ ]  │  ← text, visible when blocked
│  ─────────────────────────────── │
│  Furnace Gate: [ 18 ]           │  ← number input, null = no gate
│  💰 Requires spending: [off]     │  ← toggle
│  ─────────────────────────────── │
│  Notes:                          │
│  [ +10% Attack at max skill.   ] │
│  [ S-tier combat pet.          ] │
│  ─────────────────────────────── │
│  [Delete]                [Save]  │
└──────────────────────────────────┘
```

### Filter Chips

| Filter | Shows | Notes |
|--------|-------|-------|
| **All** | Everything (done items at bottom, dimmed) | |
| **Ready** | `todo` + `active` only | **Default on load** |
| **Blocked** | `blocked` only | "What am I waiting on?" |

### Floating Add Button

`+` button (bottom-right, above progress bar) opens the edit sheet with empty fields for adding custom items.

### Pre-Event Checklist

A collapsible section below the main tiers. This is a quick-reference checklist meant to be run through before Foundry Battle, AC, SvS, Bear Trap, etc.

```
┌──────────────────────────────────┐
│  🚀 PRE-EVENT CHECKLIST          │
│  ─────────────────────────────── │
│  PERMANENT (verify once)         │
│  ☑ Hero gear equipped correctly  │
│  ☑ Chief gear equipped           │
│  ☑ Skins equipped (city+teleport)│
│  ☑ VIP status active             │
│  ─────────────────────────────── │
│  ACTIVATE BEFORE EVENT           │
│  ☐ Cave Lion skill (Feral Anthem)│
│  ☐ Saber-Tooth skill (Apex)     │
│  ☐ Gem buff: Attack Up           │
│  ☐ Gem buff: Lethality Up        │
│  ☐ Gem buff: Defense Up          │
│  ☐ Gem buff: Deployment Up       │
│  ☐ Troop ratio set (50/20/30)   │
│  ─────────────────────────────── │
│  EVENT-SPECIFIC                  │
│  ☐ AC: register with buffs active│
│  ☐ Foundry: teleporters stocked  │
│  ─────────────────────────────── │
│  [Reset All Timed Items]         │  ← unchecks "activate" items
└──────────────────────────────────┘
```

The "Reset All Timed Items" button unchecks everything in the "Activate Before Event" and "Event-Specific" sections, leaving "Permanent" items checked. This lets the user reuse the checklist each event cycle.

### Progress Bar (Sticky Footer)

Shows completion across the main buff items (not the pre-event checklist):
- Fraction: `4/31`
- Visual bar with tier-colored segments
- Percentage

### "What's Next?" Banner

Compact 1–2 line summary above the tier sections:

> **Next up:** Level Cave Lion (active) · Push VIP to 8 (ready)

Pulls from: first `active` item in highest tier, then first `todo` item. Tapping navigates to that item's detail sheet.

### Spend Flag Handling

Items with `spendFlag: true` show a `💰` badge. On Beav's account, a toggle at the top of the Buffs tab:

> `[👁️ Show paid items]` / `[👁️‍🗨️ Hide paid items]`

Default: hidden on Beav, shown on Wally. Hiding removes spend-flagged items from the list entirely (they still exist in data, just filtered out).

### Cross-Link to Roadmap

At the bottom of the buff list (above the progress bar), a tappable link:

> 📋 **Hero goals (gear, skills, stars) → Roadmap tab**

This navigates to the existing Roadmap view. Keeps the user oriented on where to go for what.

### Reordering

Within each tier, items can be reordered via up/down arrow buttons on each row (consistent with existing Roadmap reorder UX). The `sortOrder` field controls display order within a tier.

---

## 4. Seed Data

### Wally Account Seed

Generated when Wally chief exists and has no `buffStrategy` data. All `spendFlag` defaults to `false` unless noted.

```javascript
const WALLY_BUFF_SEED = {
  items: [
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
      id: "wb-012", category: "pets", label: "Pet refinement: Cave Lion → purple stats",
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
      id: "wb-019", category: "island", label: "Tree of Life → Level 5 (Attack buff)",
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
      id: "wb-026", category: "island", label: "Tree of Life → Level 10 (Lethality buff)",
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
  ],

  preEventChecklist: [
    // PERMANENT
    { id: "wpe-01", label: "Hero gear equipped on correct heroes", category: "permanent", checked: false, notes: "" },
    { id: "wpe-02", label: "Chief gear equipped and enhanced", category: "permanent", checked: false, notes: "Once crafted at F22" },
    { id: "wpe-03", label: "Skins equipped (city + teleport)", category: "permanent", checked: false, notes: "Verify after acquiring new skins" },
    { id: "wpe-04", label: "VIP status active", category: "permanent", checked: false, notes: "" },
    { id: "wpe-05", label: "Combat heroes assigned (not gathering)", category: "permanent", checked: false, notes: "" },
    // TIMED
    { id: "wpe-06", label: "Cave Lion skill (Feral Anthem) — +10% Attack", category: "timed", checked: false, notes: "2hr duration" },
    { id: "wpe-07", label: "Saber-Tooth skill (Apex Assault) — +10% Lethality", category: "timed", checked: false, notes: "2hr duration" },
    { id: "wpe-08", label: "Frost Gorilla skill — +10% Health", category: "timed", checked: false, notes: "If available. 2hr duration" },
    { id: "wpe-09", label: "Snow Ape skill — +15k Squad Capacity", category: "timed", checked: false, notes: "For rally events" },
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
  ]
};
```

### Beav Account Seed

Same structure with these key differences:
- `spendFlag` items excluded entirely (not seeded — Beav is pure F2P)
- VIP items note "gems are scarce, prioritize Alliance Shop VIP XP"
- Chief gear, charms, War Academy may have different Furnace gate statuses
- Pet priorities identical (equally accessible F2P)
- Notes adjusted for tighter resource constraints

Generate `BEAV_BUFF_SEED` following the same categories but with adjusted notes/statuses and zero spend-flagged items.

---

## 5. Category Reference (Icons & Colors)

| Category | Icon | Color | Sort Order |
|----------|------|-------|-----------|
| chief-gear | 🎖️ | #F59E0B (amber) | 1 |
| chief-charms | 💎 | #A78BFA (purple) | 2 |
| pets | 🐾 | #22C55E (green) | 3 |
| research | 🔬 | #3B82F6 (blue) | 4 |
| war-academy | 🏛️ | #EF4444 (red) | 5 |
| vip | 👑 | #FBBF24 (gold) | 6 |
| gem-buffs | 💠 | #06B6D4 (cyan) | 7 |
| island | 🏝️ | #22C55E (green) | 8 |
| skins | 🎨 | #EC4899 (pink) | 9 |
| alliance | 🤝 | #3B82F6 (blue) | 10 |
| troops | ⚔️ | #EF4444 (red) | 11 |

---

## 6. Build Phases

### Phase B1: Data Model + Seed Data
1. Add `buffStrategy` to Chief interface
2. Bump data version, migrate existing chiefs
3. Create `buffSeed.js` with Wally and Beav seed generators
4. Create `buffCategories.js` with icons, colors, sort order
5. Persist to localStorage

### Phase B2: Buff List View
1. Add Buffs tab to the view toggle (alongside Roster and Roadmap)
2. Build `BuffTab.jsx` container
3. Build `BuffListView.jsx` — tiered sections, collapsible, with filter chips
4. Build `BuffItemRow.jsx` — status cycling, spend flag badge, block reason
5. Filter logic: All / Ready / Blocked
6. "What's Next?" banner at top

### Phase B3: Item Detail + Editor
1. Build `BuffItemDetail.jsx` — bottom sheet with all editable fields
2. Long-press to open detail sheet
3. Add new item via `+` floating button
4. Delete with confirmation
5. Reorder via up/down buttons within tiers

### Phase B4: Pre-Event Checklist
1. Build `PreEventChecklist.jsx` — collapsible section below tiers
2. Three sub-sections: Permanent, Timed, Event-Specific
3. Checkbox toggling per item
4. "Reset All Timed Items" button
5. Persist checked state

### Phase B5: Progress + Polish
1. Build `BuffProgressBar.jsx` — sticky footer
2. Tier-colored progress segments
3. Cross-link to Roadmap tab
4. Beav: "Hide paid items" toggle
5. Smooth transitions and mobile polish

### New Files

```
src/
├── components/
│   ├── BuffTab.jsx              # Main container
│   ├── BuffListView.jsx         # Tiered, filtered list
│   ├── BuffItemRow.jsx          # Single row with status cycling
│   ├── BuffItemDetail.jsx       # Edit/detail bottom sheet
│   ├── BuffProgressBar.jsx      # Sticky footer
│   ├── BuffWhatsNext.jsx        # "Next up" banner
│   └── PreEventChecklist.jsx    # Pre-event activation checklist
├── data/
│   ├── buffSeed.js              # Wally + Beav seed generators
│   └── buffCategories.js        # Category metadata
```

### Acceptance Criteria

- Open Wally Buffs tab → see 28 items across 3 tiers
- Tap an item → cycles todo → active → done
- Long-press → opens detail sheet with block reason, notes, spend flag
- "Ready" filter hides blocked and done items
- Expand Pre-Event Checklist → check items → "Reset Timed" unchecks timed/event items
- Switch to Beav → no spend-flagged items visible
- Add custom item → appears in chosen tier
- Progress bar updates on completion
- "Hero goals → Roadmap" link navigates to Roadmap tab
- All data persists across refresh

---

## 7. Domain Reference

The file `wos-buff-strategy-roadmap.md` contains the full research behind the buff prioritization:
- All 14 buff systems explained with stat impacts
- Pet skill details and activation priorities
- Gem buff costs and values
- Chief Gear set bonus mechanics
- Where buffs work and don't work by game mode
- Pre-battle activation checklist source material

Use this as reference when generating seed data and writing item notes. It does NOT need to be read by the app — it's a human/Claude reference document only.
