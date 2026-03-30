# WOS Hero Tracker — Technical Specification & Build Prompt

## For Claude Code: Cold Start Instructions

You are building a Progressive Web App (PWA) called **WOS Hero Tracker** for the mobile game Whiteout Survival. The user (Bill) has two game accounts (Wally and Beav) and wants a visual quick-reference tool to track hero progression, gear, and skills across both accounts. His wife (KayB) also plays and will run her own instance.

**This is a hobby project.** Keep the code clean and simple. No over-engineering. The user will host it on GitHub Pages as a static site.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Data Model](#3-data-model)
4. [Spreadsheet Import/Export Format](#4-spreadsheet-importexport-format)
5. [UI Specification](#5-ui-specification)
6. [WOS Domain Knowledge](#6-wos-domain-knowledge)
7. [Build Phases](#7-build-phases)
8. [Reference Prototype](#8-reference-prototype)
9. [File Structure](#9-file-structure)
10. [PWA Requirements](#10-pwa-requirements)
11. [Deployment](#11-deployment)

---

## 1. Project Overview

### What It Does
- Displays hero roster for each game account ("chief") as a visual quick-reference
- Shows hero info (name, troop type, rarity, level, stars) alongside gear loadout at a glance
- Color-codes gear by rarity using the game's color scheme
- Shows enhancement levels and master forgery badges on gear
- Allows switching between multiple chiefs (accounts) via tabs
- Supports spreadsheet import/export for data loading and backup
- Skills are viewable in a detail view when tapping a hero
- Stores all data in localStorage (no backend)

### What It Does NOT Do (out of scope for v1)
- No user accounts or authentication
- No cloud sync (spreadsheet import/export is the sync mechanism)
- No real-time data from the game
- No chief gear tracking (future feature)
- No image assets from the game (copyright) — use colored frames + initials

### Target Devices
- **Mobile first** — iPhone and iPad are primary devices
- PWA installable on home screen
- Should also work on desktop browsers

---

## 2. Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | React (Vite) | Fast, simple, good PWA plugin support |
| Styling | Tailwind CSS | Utility-first, mobile-friendly, fast iteration |
| Spreadsheet I/O | SheetJS (xlsx) | Read/write .xlsx files client-side |
| Storage | localStorage | Simple, no backend needed |
| PWA | vite-plugin-pwa | Service worker, manifest, offline support |
| Hosting | GitHub Pages | Free static hosting |
| Build | Vite | Fast builds, good defaults |

### Initialize Project

```bash
npm create vite@latest wos -- --template react
cd wos
npm install
npm install -D tailwindcss @tailwindcss/vite
npm install xlsx
npm install -D vite-plugin-pwa
```

### Tailwind v4 Setup (Vite plugin)

In `vite.config.js`:
```js
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({ /* see PWA section */ })
  ],
  base: '/wos/' // GitHub Pages repo name
}
```

In your main CSS file (e.g. `src/index.css`):
```css
@import "tailwindcss";
```

---

## 3. Data Model

All data is stored in localStorage as a JSON blob. The root structure is:

```typescript
interface AppData {
  version: 1;
  chiefs: Record<string, Chief>;  // keyed by chief name: "Wally", "Beav", etc.
  activeChief: string;            // which tab is selected
}

interface Chief {
  name: string;          // "Wally", "Beav", etc.
  heroes: Hero[];
}

interface Hero {
  name: string;           // "Flint", "Molly", etc.
  troopType: "Infantry" | "Lancer" | "Marksman";
  rarity: "Mythic" | "Epic" | "Rare" | "Common";
  level: number;          // 1-80+
  stars: number;          // 0-5, completed stars
  slivers: number;        // 0-5, progress toward next star (out of 6)
  weaponName: string;     // "" if none
  weaponRarity: string;   // "Legendary", "Epic", etc. or ""
  priority: number | null; // 1-6 for active roster, null for bench
  role: string;           // freeform: "Primary Infantry", "Bench", etc.
  gear: GearSlot[];       // exactly 4 entries: Goggles, Gloves, Belt, Boots
  skills: SkillSet;
}

interface GearSlot {
  slot: "Goggles" | "Gloves" | "Belt" | "Boots";
  rarity: "Mythic" | "Epic" | "Rare" | "Common" | "Empty";
  enhancement: number | null;   // +0 to +60+
  masterForgery: number | null; // 1-5 or null
  notes: string;
}

interface SkillSet {
  exploration: Skill[];  // 2-3 skills
  expedition: Skill[];   // 2-3 skills
}

interface Skill {
  name: string;
  level: number;    // 1-5
}
```

### Sort Order

Heroes are displayed in this order:
1. **Active Roster** (priority 1-6, sorted by priority number)
2. **Bench** (no priority set, sorted by hero rarity descending then name)

Rarity sort order: Mythic > Epic > Rare > Common

---

## 4. Spreadsheet Import/Export Format

The app must read and write `.xlsx` files matching the format below. Two reference spreadsheets (`wally_hero_tracker.xlsx` and `beav_hero_tracker.xlsx`) are included in the project directory as examples.

### Sheet 1: "Hero Overview"

| Column | Header | Type | Example |
|--------|--------|------|---------|
| A | Hero | string | "Flint" |
| B | Troop Type | string | "Infantry" |
| C | Rarity | string | "Mythic" |
| D | Level | number | 69 |
| E | Stars | string | "3 (2/6)" — format: "{stars} ({slivers}/6)" or just "{stars}" if 0 slivers |
| F | Weapon Name | string | "Dragonbane" or "" |
| G | Priority | number or blank | 1-6 or empty |
| H | Role | string | "Primary Infantry" |

**Parsing the Stars column:** 
- "3 (2/6)" → stars: 3, slivers: 2
- "4" → stars: 4, slivers: 0
- "0 (1/6)" → stars: 0, slivers: 1

Use regex: `/^(\d+)\s*(?:\((\d+)\/6\))?$/`

### Sheet 2: "Gear Detail"

| Column | Header | Type | Example |
|--------|--------|------|---------|
| A | Hero | string | "Flint" |
| B | Troop Type | string | "Infantry" |
| C | Slot | string | "Goggles" / "Gloves" / "Belt" / "Boots" / "Weapon" |
| D | Rarity | string | "Mythic" / "Epic" / "Rare" / "Empty" |
| E | Enhancement (+) | number or blank | 60, 45, etc. |
| F | Master Forgery Lv | number or blank | 1, 2, 3 |
| G | Notes | string | "Dragonbane", etc. |

**Important:** Weapon rows exist in the spreadsheet but are NOT displayed in the gear grid (only 4 armor slots). Store weapon data on the Hero object, not in the gear array. Filter out "Weapon" rows when populating gear[].

### Sheet 3: "Skills"

This sheet has a merged header structure:

- **Row 1:** Hero | Troop Type | "Exploration Skills" (merged across 6 cols) | "Expedition Skills" (merged across 6 cols)
- **Row 2:** (blank) | (blank) | Skill 1 Name | Lv | Skill 2 Name | Lv | Skill 3 Name | Lv | Skill 1 Name | Lv | Skill 2 Name | Lv | Skill 3 Name | Lv

Data starts at Row 3. Columns:
- A: Hero name
- B: Troop Type
- C: Exploration Skill 1 Name
- D: Exploration Skill 1 Level
- E: Exploration Skill 2 Name
- F: Exploration Skill 2 Level
- G: Exploration Skill 3 Name (may be blank)
- H: Exploration Skill 3 Level (may be blank)
- I: Expedition Skill 1 Name
- J: Expedition Skill 1 Level
- K: Expedition Skill 2 Name
- L: Expedition Skill 2 Level
- M: Expedition Skill 3 Name (may be blank)
- N: Expedition Skill 3 Level (may be blank)

**Important:** Some heroes have only 2 exploration and 2 expedition skills (4 total). When columns G/H or M/N are blank, that hero has no 3rd skill in that category.

### Import Logic

1. User selects a `.xlsx` file
2. Parse all 3 sheets
3. Build Hero objects by joining data across sheets (matched on hero name)
4. Ask user which chief name to assign (or detect from filename)
5. Merge into existing data (replace chief if same name, add if new)
6. Save to localStorage

### Export Logic

1. User selects a chief to export
2. Generate a `.xlsx` with the 3 sheets in the format above
3. Trigger browser download as `{chiefname}_hero_tracker.xlsx`

---

## 5. UI Specification

### Layout: Mobile-First Single Page App

```
┌──────────────────────────────┐
│  ❄️ WOS Hero Tracker         │  ← App header
│  [Wally] [Beav] [+]         │  ← Chief tabs (+ adds new chief)
├──────────────────────────────┤
│  ⚙️ Import | Export | Edit   │  ← Action bar (small icons/text)
├──────────────────────────────┤
│  ACTIVE ROSTER               │  ← Section header
│  ┌────┬──────┬──┬──┬──┬──┐  │
│  │Hero│ Info │Go│Gl│Be│Bo│  │  ← Hero row with 4 gear slots
│  └────┴──────┴──┴──┴──┴──┘  │
│  ... (6 rows max)            │
├──────────────────────────────┤
│  ▼ Bench (12 heroes)         │  ← Collapsible section
│  ... (collapsed by default)  │
└──────────────────────────────┘
```

### Color System

**Rarity Colors (borders and backgrounds):**
```javascript
const RARITY_COLORS = {
  Mythic:  { border: "#F59E0B", bg: "#D97706", text: "#FFF" },  // Amber/Orange
  Epic:    { border: "#A78BFA", bg: "#7C3AED", text: "#FFF" },  // Purple
  Rare:    { border: "#60A5FA", bg: "#2563EB", text: "#FFF" },  // Blue
  Common:  { border: "#9CA3AF", bg: "#6B7280", text: "#FFF" },  // Gray
  Empty:   { border: "#374151", bg: "#1F2937", text: "#6B7280" }, // Dark gray
};
```

**Troop Type Colors (left border accent on hero rows):**
```javascript
const TROOP_COLORS = {
  Infantry: "#EF4444",  // Red
  Lancer:   "#3B82F6",  // Blue
  Marksman: "#22C55E",  // Green
};
```

**App Theme:** Dark background (#0B1120 base), matching the game's cold/winter aesthetic.

### Hero Row Component

Each row contains:

1. **Hero Frame** (52×52px): Rounded square with hero rarity border color. Shows hero initials (or abbreviation for long names) and "Lv.{level}" below. Background is a subtle gradient of the rarity color.

2. **Info Section** (60px wide): 
   - Troop type in troop color (small text)
   - Star bar: 5 star outlines, filled stars in gold (#FBBF24), unfilled in dark gray. If slivers > 0, show "+{slivers}" next to the stars.
   - Priority and role (very small text, only for active roster heroes)

3. **Gear Grid** (4 slots, right-aligned):
   - Each slot is 52×52px rounded square
   - Border color = gear rarity
   - Background = subtle gradient of rarity color (darker, transparent)
   - Center content:
     - If Empty: "—" in dark gray
     - If no enhancement: show rarity letter (M, E, R)
     - If enhanced: show "+{enhancement}" in rarity border color
   - Master Forgery badge: small "M{level}" pill in amber, positioned top-right corner
   - Slot label ("Goggles", "Gloves", etc.) in tiny gray text at top of each slot

### Hero Detail View (Tap to Expand)

When a hero row is tapped, it expands (or navigates to) a detail view showing:

1. **Full hero info:** name, troop type, rarity, level, stars (slivers/6), weapon, role
2. **Gear detail:** Same 4 slots but larger, showing slot name, rarity text, enhancement, MF level
3. **Skills:** Two columns — Exploration (left) and Expedition (right). Each skill shows name and level as small horizontal bars or simple list.
4. **Edit button** to modify this hero's data inline

For v1, a simple expand/collapse accordion on the row is fine. Full page navigation can come later.

### Chief Tab Bar

- Horizontal scrollable tabs below the header
- Active tab has highlighted background and bottom accent
- "+" button at the end to add a new chief
- Long-press or swipe on a tab to rename/delete (Phase 7)

### Action Bar

Small row of action buttons:
- **Import** (📥): Opens file picker for .xlsx import
- **Export** (📤): Downloads current chief's data as .xlsx
- **Edit Mode** (✏️): Per-hero editing in the detail view (Phase 5)

### Bench Section

- Collapsed by default, shows "Bench ({count} heroes)" with expand/collapse arrow
- When expanded, same hero row format but with slightly dimmed styling
- Bench heroes sorted by rarity descending, then alphabetically

### Empty State

When no data is loaded:
- Show a centered message: "No heroes yet"
- Prominent "Import Spreadsheet" button
- Secondary "Add Hero Manually" button (Phase 5)

---

## 6. WOS Domain Knowledge

This context helps you make correct design and data decisions.

### Troop Types
There are 3 troop types: **Infantry** (tanky, frontline), **Lancer** (balanced, melee), **Marksman** (ranged, damage). Every hero belongs to exactly one troop type.

### Hero Rarity
Heroes come in rarities: Common (gray), Rare (blue), Epic (purple), Mythic (orange). This is the hero's own rarity — separate from their gear rarity. Higher rarity heroes have more skill slots and higher stat ceilings.

### Stars and Slivers
Heroes can be ascended from 0-star to 5-star. Each star requires 6 **slivers** to complete. Slivers are built from **shards** (the raw collectible items). The tracker stores completed stars (0-5) and sliver progress (0-5, out of 6). Display format: "3 (2/6)" means 3 complete stars, 2 of 6 slivers toward the 4th star.

### Gear System
Each hero has 4 gear slots: **Goggles** (head), **Gloves** (hands), **Belt** (waist), **Boots** (feet). Some heroes also have a **Weapon** but weapons are not displayed in the gear grid — just stored as metadata.

Gear has its own rarity (independent of hero rarity): Empty → Common → Rare → Epic → Mythic. Gear can be enhanced (+1 through +60 and beyond) and has Master Forgery levels (1-5) at higher tiers.

**Gear priority by troop type** (for reference, not enforced in the app):
- Infantry: Gloves + Belt are priority pieces
- Lancer: Goggles + Boots are priority pieces  
- Marksman: Goggles + Boots are priority pieces

### Skills
Each hero has **Exploration** skills (used in overworld/beast hunting content) and **Expedition** skills (used in garrison defense, labyrinth, alliance championship — the PvP/competitive content). Most heroes have 3 of each type, some only have 2. Skills go from Level 1 to Level 5. Higher star ascension unlocks the ability to level skills further.

### Priority System
The user assigns priority 1-6 to their active roster heroes. This indicates the order of resource investment focus. Heroes without a priority number are "Bench" heroes — owned but not actively being developed.

---

## 7. Build Phases

### Phase 1: Core Display (Build This First)

**Goal:** Render the hero roster from hardcoded data, matching the prototype visual.

1. Set up Vite + React + Tailwind project
2. Create the component hierarchy:
   - `App` → manages chief tabs and active chief state
   - `ChiefView` → renders active/bench sections for one chief
   - `HeroRow` → single hero row with avatar frame + gear grid
   - `GearSlot` → single gear slot with rarity coloring
   - `StarBar` → star display with sliver indicator
3. Hardcode the Wally and Beav data from the spreadsheets (exact data provided in the reference spreadsheets — `wally_hero_tracker.xlsx` and `beav_hero_tracker.xlsx` in the project root)
4. Make sure it looks good at 375px-428px width (iPhone range)
5. Verify the rarity colors, troop colors, and layout match the prototype

**Acceptance:** App renders both chiefs' rosters correctly with proper colors, sorting, and layout. Bench collapses/expands. Chief tabs switch correctly.

### Phase 2: localStorage Persistence

**Goal:** Move from hardcoded data to localStorage.

1. On first load, seed localStorage with the hardcoded data
2. All reads come from localStorage
3. All writes go to localStorage
4. Add a data version number for future migration

**Acceptance:** Refresh the page — data persists. Clear localStorage — app shows empty state.

### Phase 3: Spreadsheet Import/Export

**Goal:** Load data from .xlsx files and export back.

1. Add SheetJS (xlsx) library
2. Build import parser:
   - Parse "Hero Overview" sheet → build hero objects
   - Parse "Gear Detail" sheet → attach gear to heroes by name
   - Parse "Skills" sheet → attach skills to heroes by name
   - Handle the merged header rows in Skills sheet
   - Handle the Stars column format "3 (2/6)"
   - Prompt user for chief name (pre-fill from filename if possible)
3. Build export generator:
   - Generate 3-sheet .xlsx matching the input format exactly
   - User can round-trip: export → edit in Excel → re-import
4. Add Import/Export buttons to the action bar

**Acceptance:** Import `wally_hero_tracker.xlsx` → see Wally's data. Export → re-import → data matches. Import `beav_hero_tracker.xlsx` → Beav tab appears.

### Phase 4: Hero Detail View

**Goal:** Tap a hero row to see expanded detail with skills.

1. Add expand/collapse to hero rows (accordion style)
2. Expanded view shows:
   - Full hero stats (all fields)
   - Gear detail with enhancement and MF levels spelled out
   - Skills split into Exploration / Expedition columns
   - Weapon info if applicable
3. This is read-only initially — editing is Phase 5

**Acceptance:** Tap Flint → see all exploration skills, all expedition skills, gear details, weapon info, star/sliver count.

### Phase 5: Full Inline Editing

**Goal:** Users can manually edit all hero data directly in the app. Every field that can change through gameplay should be editable without needing to export/re-import a spreadsheet.

#### Editing UX

Editing happens inside the hero detail view (from Phase 4). When the user taps a hero row to expand it, the expanded detail view includes an **Edit** button. Tapping Edit switches that hero's detail view into edit mode. Tapping **Save** writes to localStorage and returns to read-only view. Tapping **Cancel** discards changes.

**Do NOT use a global edit mode toggle.** Editing is per-hero — you edit one hero at a time.

#### Editable Fields — Hero Info

| Field | Input Type | Constraints |
|-------|-----------|-------------|
| Name | Text input | Required, freeform |
| Troop Type | Dropdown | Infantry / Lancer / Marksman |
| Rarity | Dropdown | Mythic / Epic / Rare / Common |
| Level | Number input | 1-99 |
| Stars | Number input or stepper | 0-5 |
| Slivers | Number input or stepper | 0-5 (out of 6) |
| Weapon Name | Text input | Optional, freeform |
| Priority | Number input or dropdown | 1-6 or blank (blank = bench) |
| Role | Text input | Optional, freeform |

#### Editable Fields — Gear (per slot: Goggles, Gloves, Belt, Boots)

| Field | Input Type | Constraints |
|-------|-----------|-------------|
| Rarity | Dropdown | Mythic / Epic / Rare / Common / Empty |
| Enhancement | Number input | Blank or 1-99. Disabled if rarity is Empty |
| Master Forgery | Number input or stepper | Blank or 1-5. Disabled if rarity is Empty |
| Notes | Text input | Optional, freeform |

When rarity is changed to "Empty", auto-clear enhancement, MF, and notes.

#### Editable Fields — Skills

Skills are displayed as two groups (Exploration / Expedition), each with 2-3 skill slots.

| Field | Input Type | Constraints |
|-------|-----------|-------------|
| Skill Name | Text input | Freeform. Blank = no skill in that slot |
| Skill Level | Number input or stepper | 1-5 |

The user should be able to add or remove the 3rd skill slot (some heroes only have 2 per category).

#### Adding / Removing Heroes

- **Add Hero:** Button in the action bar or at the bottom of the hero list. Creates a new hero with default empty values, opens it in edit mode immediately.
- **Delete Hero:** Available inside the edit view for a hero. Requires confirmation ("Delete Flint? This cannot be undone.").
- **Reorder:** Priority 1-6 determines active roster order. Changing priority in edit mode reorders on save. If a user assigns priority 3 to a hero that didn't have one, and another hero already has priority 3, prompt to resolve or auto-shift others down.

#### Mobile-Friendly Input Considerations

- Use `type="number"` with `inputmode="numeric"` for number fields — this brings up the numeric keyboard on iOS
- Dropdowns should use native `<select>` on mobile (not custom dropdown components) — native selects work better with iOS/Android keyboards
- Keep form fields large enough to tap (minimum 44px touch targets)
- Auto-save is NOT recommended — explicit Save/Cancel buttons prevent accidental changes

#### Data Validation

- Stars must be 0-5. Slivers must be 0-5.
- Enhancement and MF only valid when gear rarity is not "Empty"
- Priority must be unique per chief (1-6 or null)
- Show inline validation errors (red border + message below field)

**Acceptance:** Edit Flint's Belt enhancement from +60 to +61 → save → main view updates immediately. Add a new hero → fill in details → appears in roster. Delete a bench hero → gone. All changes persist across page refresh.

### Phase 6: PWA Setup

**Goal:** Installable on iPhone/iPad home screen, works offline.

1. Configure vite-plugin-pwa:
   - App name: "WOS Hero Tracker"
   - Short name: "WOS Tracker"
   - Theme color: #0B1120
   - Background color: #0B1120
   - Display: standalone
   - Icon: Generate a simple snowflake ❄️ icon (or use a placeholder)
2. Service worker for offline caching
3. Verify it installs on iOS Safari (Add to Home Screen)

**Acceptance:** Add to home screen on iPhone → launches without browser chrome. Works in airplane mode after first load.

### Phase 7: Polish & Future Prep

**Goal:** Quality of life improvements.

1. Add chief management: rename, delete, reorder tabs
2. Add "+" button to create empty chief
3. Smooth transitions on accordion expand/collapse
4. Pull-to-refresh gesture (re-reads localStorage)
5. Add a simple about/help screen explaining import/export
6. Prep the data model for future features (chief gear tracking, etc.)

---

## 8. Reference Prototype

The following React component is a working prototype of the main view. Use it as the visual and behavioral reference. The final app should look and feel like this, but with proper component structure, Tailwind classes, and localStorage integration.

```jsx
import { useState } from "react";

const RARITY = {
  Mythic:    { bg: "#D97706", border: "#F59E0B", text: "#FFF", label: "M" },
  Legendary: { bg: "#D97706", border: "#F59E0B", text: "#FFF", label: "L" },
  Epic:      { bg: "#7C3AED", border: "#A78BFA", text: "#FFF", label: "E" },
  Rare:      { bg: "#2563EB", border: "#60A5FA", text: "#FFF", label: "R" },
  Common:    { bg: "#6B7280", border: "#9CA3AF", text: "#FFF", label: "C" },
  Empty:     { bg: "#1F2937", border: "#374151", text: "#6B7280", label: "" },
};

const TROOP_COLORS = {
  Infantry:  "#EF4444",
  Lancer:    "#3B82F6",
  Marksman:  "#22C55E",
};

const SLOT_LABELS = ["Goggles", "Gloves", "Belt", "Boots"];

function StarBar({ stars, slivers }) {
  const filled = stars || 0;
  const partial = slivers || 0;
  return (
    <div style={{ display: "flex", gap: 1, alignItems: "center" }}>
      {[0,1,2,3,4].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 12 12">
          <polygon
            points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.2 3,11 3.5,7.5 1,5 4.5,4.5"
            fill={i < filled ? "#FBBF24" : "#374151"}
            stroke={i < filled ? "#F59E0B" : "#4B5563"}
            strokeWidth="0.5"
          />
        </svg>
      ))}
      {partial > 0 && (
        <span style={{ fontSize: 9, color: "#9CA3AF", marginLeft: 2 }}>+{partial}</span>
      )}
    </div>
  );
}

function GearSlot({ gear, slotLabel }) {
  const r = RARITY[gear.rarity] || RARITY.Empty;
  const isEmpty = gear.rarity === "Empty";
  return (
    <div style={{
      width: 52, height: 52, borderRadius: 6,
      border: `2px solid ${r.border}`,
      background: isEmpty ? "#111827" : `linear-gradient(135deg, ${r.bg}22, ${r.bg}44)`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative", flexShrink: 0,
    }}>
      <span style={{ fontSize: 8, color: "#9CA3AF", marginBottom: 1 }}>{slotLabel}</span>
      {isEmpty ? (
        <span style={{ fontSize: 16, color: "#374151" }}>—</span>
      ) : (
        <>
          <span style={{ fontSize: 11, fontWeight: 700, color: r.border }}>
            {gear.enh ? `+${gear.enh}` : r.label}
          </span>
          {gear.mf && (
            <span style={{
              position: "absolute", top: 1, right: 2,
              fontSize: 8, fontWeight: 700, color: "#FDE68A",
              background: "#78350F", borderRadius: 3, padding: "0 3px",
            }}>M{gear.mf}</span>
          )}
        </>
      )}
    </div>
  );
}

function HeroRow({ hero, index }) {
  const r = RARITY[hero.rarity] || RARITY.Common;
  const troopColor = TROOP_COLORS[hero.troop] || "#6B7280";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 10px",
      background: index % 2 === 0 ? "#0F172A" : "#111827",
      borderLeft: `3px solid ${troopColor}`,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 8, flexShrink: 0,
        border: `2px solid ${r.border}`,
        background: `linear-gradient(135deg, ${r.bg}33, ${r.bg}66)`,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{
          fontSize: hero.name.length > 7 ? 9 : 11,
          fontWeight: 800, color: r.border,
          textAlign: "center", lineHeight: 1.1, padding: "0 2px",
        }}>
          {hero.name.length > 9 ? hero.name.split(" ").map(w => w[0]).join("") : hero.name}
        </span>
        <span style={{ fontSize: 8, color: "#9CA3AF" }}>Lv.{hero.level}</span>
      </div>
      <div style={{ flex: "0 0 60px", minWidth: 0 }}>
        <div style={{ fontSize: 10, color: troopColor, fontWeight: 600 }}>{hero.troop}</div>
        <StarBar stars={hero.stars} slivers={hero.slivers} />
        {hero.priority && (
          <div style={{
            fontSize: 8, color: "#D1D5DB", marginTop: 2,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            #{hero.priority} {hero.role?.split(" ").slice(0,2).join(" ")}
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
        {hero.gear.map((g, i) => (
          <GearSlot key={i} gear={g} slotLabel={SLOT_LABELS[i]} />
        ))}
      </div>
    </div>
  );
}
```

---

## 9. File Structure

```
wos/
├── public/
│   ├── icons/                  # PWA icons (192, 512)
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── App.jsx             # Root: chief tabs, action bar, routing
│   │   ├── ChiefView.jsx      # Renders hero list for one chief
│   │   ├── HeroRow.jsx        # Single hero row (compact view)
│   │   ├── HeroDetail.jsx     # Expanded hero detail (accordion)
│   │   ├── GearSlot.jsx       # Single gear slot display
│   │   ├── StarBar.jsx        # Star + sliver display
│   │   ├── ChiefTabs.jsx      # Tab bar component
│   │   ├── ActionBar.jsx      # Import/Export/Edit buttons
│   │   └── EmptyState.jsx     # Shown when no data loaded
│   ├── lib/
│   │   ├── storage.js          # localStorage read/write/migrate
│   │   ├── import.js           # .xlsx → app data parser
│   │   ├── export.js           # app data → .xlsx generator
│   │   └── constants.js        # Rarity colors, troop colors, slot labels
│   ├── data/
│   │   └── seed.js             # Hardcoded initial data for Phase 1
│   ├── index.css               # Tailwind imports + custom styles
│   └── main.jsx                # React entry point
├── data/                       # Reference spreadsheets (not bundled)
│   ├── wally_hero_tracker.xlsx
│   └── beav_hero_tracker.xlsx
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 10. PWA Requirements

### vite-plugin-pwa Configuration

```javascript
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'WOS Hero Tracker',
    short_name: 'WOS Tracker',
    description: 'Track Whiteout Survival hero progression across accounts',
    theme_color: '#0B1120',
    background_color: '#0B1120',
    display: 'standalone',
    orientation: 'portrait',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
  },
})
```

### iOS-Specific Meta Tags (in index.html)

```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="WOS Tracker">
<link rel="apple-touch-icon" href="/icons/icon-192.png">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
```

---

## 11. Deployment

### GitHub Pages via GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
```

### Vite Base Path

In `vite.config.js`, set `base: '/wos/'` (matching the GitHub repo name). If using a custom domain, set `base: '/'`.

---

## Appendix: Data Reference

The two spreadsheets in the `data/` directory contain the complete current state of both accounts. Use them to:

1. Seed the hardcoded data in Phase 1
2. Test the import parser in Phase 3
3. Verify the export generator produces matching output

Parse them with SheetJS during development to generate the seed data object rather than transcribing manually.

---

## Summary for Claude Code

**Build order:** Phase 1 (core display) → Phase 2 (localStorage) → Phase 3 (import/export) → Phase 4 (hero detail) → Phase 5 (inline editing) → Phase 6 (PWA) → Phase 7 (polish).

**Key principles:**
- Mobile first, 375-428px primary target
- Dark theme matching the game's winter aesthetic
- Rarity colors are the primary visual language — get them right
- Keep it simple — this is a hobby tool, not a SaaS product
- The spreadsheet is the source of truth — import/export must be rock solid
- Test with the real spreadsheet files in the data/ directory
