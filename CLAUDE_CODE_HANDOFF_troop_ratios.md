# Claude Code Handoff — Troop Ratios Tab

**Context:** Adds a new "Troop Ratios" reference tab to the WOS Hero Tracker PWA. The user (Bill, alliance leader) currently has to dig through old chat logs or Reddit posts before every fight to remember what composition to set. This tab is a static, selectable quick-reference: tap the 3-letter activity code (BHT, SFC, FAC, etc.), see the recommended Infantry/Lancer/Marksman ratios for Rally Lead, Rally Join, Garrison, and Solo roles. Data is static/global (not per-chief), lives in a seed file, and is not editable through the UI in v1.

**⚠️ Spec-drift caveat:** This document was written against a snapshot of project files (`App.jsx`, `ChiefView.jsx`, `ChiefTabs.jsx`, `RoadmapDashboard.jsx`, and the `wos-buff-strategy-tab-spec.md` addendum) as of the tracker-v2 build. It assumes the app uses Tailwind CSS v4, React 18+, localStorage for state, and the Vite + GitHub Pages setup at `https://greenwh.github.io/wos/`. If a view-toggle pattern, bottom-nav, or top-tab bar has been built since for the Buff Strategy tab, this feature should reuse that exact pattern rather than inventing a new one. **Do not start editing until Phase 0 completes.**

**Target ordering:**
- **Phase 0** (required, non-destructive): orientation pass — survey the real code, reconcile with this spec.
- **Phase A** (required): seed data + plain display. Minimum viable ratio lookup.
- **Phase B** (recommended): polish — visual bar, reasoning disclosure, gen-sensitive display.
- **Phase C** (optional): favorites, search, per-chief notes.

---

## Background — what this feature replaces

Bill already has the verified CSV (`troop_ratios.csv`, attached to this handoff) with all 24 role/activity combinations. The seed file you'll build (§A.2) is a direct transcription of that CSV. The reasoning summary lives in the CSV's `reasoning` column.

**12 activities with 3-character codes:**
| Code | Activity |
|------|----------|
| PVP | Open-Field PvP / City Burn |
| FAC | Facility Battle (Foundry / Fortress / Stronghold) |
| SFC | Sunfire Castle (SvS) |
| SVS | SvS Battle Phase (open-world) |
| BHT | Bear Trap |
| PLT | Polar Terror |
| BNT | Intel Bounty Beast (Expert+) |
| LAB | Labyrinth |
| CJO | Crazy Joe |
| ACH | Alliance Championship |
| CTY | City Defense (shield down) |
| DEF | Default / Unsure |

**4 role codes:**
- `LEAD` — Rally Leader (composition of the lead's own march; joiners contribute their own troops)
- `JOIN` — Rally Joiner
- `GARR` — Garrison / Reinforcement
- `SOLO` — Solo march (no rally)

Not every activity has all four roles. The seed data enumerates only the role/activity pairs that apply.

---

## Phase 0 — Orientation Pass (DO THIS FIRST, DO NOT EDIT YET)

**Goal:** confirm the current view-toggle / tab pattern before adding a third option to it. Expected effort: 5–10 minutes, read-only.

### 0.0 Ground rules
- **Read-only.** No file edits in Phase 0.
- **No assumptions about the tab system.** The main spec originally had one view (roster). The Buff Strategy spec added a Roster/Buffs toggle. This spec needs to know whether that toggle was ever implemented and, if so, how.

### 0.1 Survey checklist

| Spec references… | Find the real location of… |
|---|---|
| `App.jsx` top-level layout | Whether a view-toggle (Roster / Buffs) already exists. If so, what component renders it. |
| Any `BuffTab.jsx`, `BuffListView.jsx`, or `buffSeed.js` file | Has the Buff Strategy tab been built? Note its integration pattern verbatim. |
| `ChiefTabs.jsx` | Is this still just Wally/Beav? Or has it evolved into multi-level tabs? |
| `src/data/seed.js`, `src/data/roadmapSeed.js` | Confirm seed-file location convention. New seed file will follow the same pattern. |
| Any existing troop-type color constants | Where are Infantry (red) / Lancer (blue) / Marksman (green) colors defined? Reuse, don't redefine. |
| Tailwind config | Confirm Tailwind v4. Note any custom theme colors, particularly anything named `infantry`, `lancer`, `marksman`. |
| `src/lib/constants.js` or similar | Any existing enum or constant list for activities, events, ratio presets? |

### 0.2 Behavioral checks

1. **Is there a view-toggle already?** If yes, its exact visual pattern (segment control? bottom nav? top tabs?) must be matched — don't invent a fourth pattern.
2. **If the Buffs tab exists, how is it navigated to?** Document the component hierarchy: `App → ViewToggle → (RosterView | BuffsView)` or similar.
3. **Are troop type colors defined as Tailwind utility classes, as CSS variables, or inline hex?** This feature needs to use them consistently.
4. **Does the app have a "no chief selected" state?** The Troop Ratios tab should work even when no chief is loaded — it's global reference data.

### 0.3 Conflict categorization

- **🟢 Path-only drift** — a file moved. Record and proceed per spec.
- **🟡 Partial overlap** — something like a tab system exists but differs from what this spec assumes. Propose extension, don't duplicate.
- **🔴 Hard conflict** — the app architecture makes a new top-level tab impractical (e.g., everything is single-scroll-view with no tab concept). STOP. Report to Bill.

### 0.4 Phase 0 deliverable — Reconciliation Report

Post a short markdown block back, structured as:

```markdown
## Phase 0 Reconciliation Report — Troop Ratios

### Tab / view-toggle pattern in current code
<describe exactly what exists>

### Existing troop-type colors
- Infantry: <where defined, what value>
- Lancer: <...>
- Marksman: <...>

### What's already built that's adjacent to this spec
- <item>: <status>

### 🟢 Path-only drift
### 🟡 Partial overlap
### 🔴 Hard conflicts
### Proposed deviations from spec
### Go/No-go
```

### 0.5 Gate criteria

- [ ] View-toggle pattern (if any) is documented.
- [ ] Troop-type color source is identified.
- [ ] No 🔴 hard conflicts unaddressed.
- [ ] Bill has posted "approved" in chat.

---

## Phase A — Minimum Viable (required)

**Prerequisite:** Phase 0 complete and approved.

### A.1 Data model

Single flat type. No per-chief state. Ratios are global reference data.

```javascript
// src/data/troopRatiosSeed.js

/**
 * @typedef {'LEAD' | 'JOIN' | 'GARR' | 'SOLO'} RoleCode
 * @typedef {'PVP'|'FAC'|'SFC'|'SVS'|'BHT'|'PLT'|'BNT'|'LAB'|'CJO'|'ACH'|'CTY'|'DEF'} ActivityCode
 *
 * @typedef {Object} RatioRow
 * @property {RoleCode} role
 * @property {number} infantry    // 0–100, must sum to 100 with lancer + marksman
 * @property {number} lancer
 * @property {number} marksman
 * @property {string} reasoning   // short explanation
 * @property {string} [genNote]   // server-generation caveat, optional
 *
 * @typedef {Object} Activity
 * @property {ActivityCode} code  // 3-char, uppercase
 * @property {string} name        // display name
 * @property {string} [blurb]     // optional 1-sentence context shown under the code
 * @property {RatioRow[]} roles   // 1–4 entries, in display order LEAD > JOIN > GARR > SOLO
 */
```

### A.2 Seed file

Create `src/data/troopRatiosSeed.js` with the 12 activities below. **Copy-paste this exactly** — it's the verified output from Bill's CSV fact-check session.

```javascript
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
      { role: 'LEAD', infantry: 0, lancer: 10, marksman: 90,
        reasoning: "Bear has fixed HP and no counter triangle so maximize lethality. Joiners bring the infantry meat shield.",
        genNote: "Gen 1–7: keep ≥5,000 infantry in the march as a safety floor. Gen 8+: can push to 0/15/85 or pure 0/10/90 as marksman lethality outpaces lancer." },
      { role: 'JOIN', infantry: 20, lancer: 20, marksman: 60,
        reasoning: "Pre-Gen 8 balance point: infantry to absorb hits and stabilize lancer/marksman skill triggers.",
        genNote: "Gen-dependent. Pre-Gen 8 the 25–30% lancer is common to stably proc lancer hero buffs. Gen 8+: shift to 10/15/75." },
    ],
  },
  {
    code: 'PLT',
    name: 'Polar Terror',
    blurb: 'World-map PvE boss rally. Same logic as Bear Trap.',
    roles: [
      { role: 'LEAD', infantry: 0, lancer: 10, marksman: 90,
        reasoning: "PvE boss with no counter triangle — maximize marksman for peak damage.",
        genNote: "Same gen-sensitivity as Bear Trap. Pre-Gen 8 keep infantry ≥5,000." },
      { role: 'JOIN', infantry: 20, lancer: 20, marksman: 60,
        reasoning: "Balanced joiner; enough infantry to survive across levels without being glass cannons." },
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
```

**Verification:** every row must have `infantry + lancer + marksman === 100`. Consider adding a dev-time assertion at module load:

```javascript
if (import.meta.env.DEV) {
  TROOP_RATIOS.forEach(a => a.roles.forEach(r => {
    const sum = r.infantry + r.lancer + r.marksman;
    if (sum !== 100) console.warn(`Ratio mismatch: ${a.code} ${r.role} sums to ${sum}`);
  }));
}
```

### A.3 Top-level tab integration

**Depends on Phase 0 findings.** Two scenarios:

**Scenario 1 — the Roster/Buffs toggle exists.** Add a third option, `Ratios`. The toggle is whatever shape Phase 0 found: pill buttons, segment control, bottom nav. Match it.

**Scenario 2 — no view toggle exists yet.** Build one now as a 2-option segment control in `App.jsx`, directly below `ChiefTabs`, with options `Roster` and `Ratios`. Default is `Roster`. State lives in `App.jsx` useState; no need to persist to localStorage (resets to Roster on reload is fine).

```jsx
// Sketch — adapt to Phase 0 findings
const [view, setView] = useState('roster');

<ViewToggle
  options={[
    { value: 'roster', label: 'Roster' },
    { value: 'ratios', label: 'Ratios' },
  ]}
  value={view}
  onChange={setView}
/>

{view === 'roster' && <ChiefView ... />}
{view === 'ratios' && <RatiosView />}
```

The Ratios tab does **not** depend on `activeChief`. It renders the same whether or not a chief is loaded. Bill should be able to import a fresh xlsx and immediately use Ratios without first loading any data.

### A.4 RatiosView component — minimum viable

`src/components/RatiosView.jsx`:

```
┌──────────────────────────────────┐
│  Activity                        │
│  ┌────┬────┬────┬────┐           │
│  │PVP │FAC │SFC │SVS │           │  ← 3-col pill grid, codes as labels
│  ├────┼────┼────┼────┤           │
│  │BHT │PLT │BNT │LAB │           │
│  ├────┼────┼────┼────┤           │
│  │CJO │ACH │CTY │DEF │           │
│  └────┴────┴────┴────┘           │
│                                  │
│  Selected: SFC — Sunfire Castle  │  ← name + blurb when selected
│  SvS castle fight. Alliance-     │
│  coordinated.                    │
│  ─────────────────────────────── │
│                                  │
│  ┌──────────────────────────────┐│
│  │ Rally Leader                 ││  ← role card
│  │ I 50  L 20  M 30             ││
│  │ [███████    ░░░░░    ░░░░]  ││  ← visual bar, red/blue/green
│  │                              ││
│  │ Confirmed by 2026 SvS...     ││  ← reasoning
│  └──────────────────────────────┘│
│  ┌──────────────────────────────┐│
│  │ Rally Joiner ...             ││
│  └──────────────────────────────┘│
│  ┌──────────────────────────────┐│
│  │ Garrison ...                 ││
│  └──────────────────────────────┘│
└──────────────────────────────────┘
```

**Behaviors:**
- Default selection: `DEF` (or whatever was last selected — store in localStorage under `wos:ratios:lastCode`, optional).
- Tapping an activity pill selects it; the role cards below re-render.
- Role cards render in fixed order: LEAD → JOIN → GARR → SOLO, skipping any the activity doesn't have.
- The activity pill grid is sticky-top-ish — stays in view as user scrolls role cards (can defer to Phase B if tricky).

**Color reuse — don't redefine:**
Find the existing troop type colors from Phase 0 findings. If the convention is `TROOP_COLORS.Infantry`, `TROOP_COLORS.Lancer`, `TROOP_COLORS.Marksman`, use those. If they're Tailwind classes like `bg-red-600 / bg-blue-600 / bg-green-600`, use those. Do not introduce new hex values. The visual bar and the I/L/M labels should both use these colors.

**Reasoning text:** Render inline, small, muted. No collapse/expand in Phase A. Gen note, if present, rendered as a separate italic line prefixed with ⚠️.

### A.5 Acceptance criteria — Phase A

- Open the app → tap Ratios (or whichever label) → see the 3×4 activity pill grid.
- Tap `SFC` → see 3 role cards (LEAD, JOIN, GARR) with correct numbers.
- Tap `BNT` → see 1 role card (SOLO) with 20/40/40.
- Tap `BHT` LEAD card → the gen note (italic, ⚠️-prefixed) is visible.
- Every role card's I/L/M values sum to 100.
- Ratios tab works with zero chiefs loaded.
- The view toggle returns to Roster correctly.

---

## Phase B — Polish (recommended)

Gate: Phase A merged and working.

### B.1 Visual ratio bar

Horizontal bar, 100% width, split into colored segments proportional to I/L/M. Minimum segment width: 2px (so a 0% segment disappears but 1% doesn't create a render glitch). Labels inside segments if the segment is wide enough, otherwise labels below.

```
[████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░]
 Inf 50              Lan 20      Mrk 30
 (red)               (blue)      (green)
```

### B.2 Reasoning disclosure

Default state: reasoning text collapsed to first ~60 chars + "…". Tap the card → expands. Gen note always visible if present (it's the most actionable caveat).

Rationale: Bill knows the numbers cold after a week. The reasoning is there for "why not 10/10/80?" moments, but shouldn't take up screen real estate every time.

### B.3 Sticky activity selector

As the user scrolls through role cards, the activity pill grid sticks to the top of the viewport (below ChiefTabs and the view toggle). On a phone screen, this means the user can always reach "switch to a different activity" without scrolling to top.

Tailwind: `sticky top-[Npx] z-10` where `N` is the combined height of the header bars above. Confirm the value against the current layout in DevTools.

### B.4 Gen-sensitivity toggle (Bear Trap / Polar Terror only)

For `BHT` and `PLT`, add a small pill toggle above the role cards:

```
Server gen:  [Gen 1–7 ✓]  [Gen 8+]
```

Default: `Gen 1–7` (Bill's current server is Gen 2). Selecting `Gen 8+` swaps the displayed numbers *and* the reasoning to the gen-8 variants.

To support this cleanly, extend the seed for BHT and PLT only:

```javascript
// In BHT and PLT entries:
roles: [
  { role: 'LEAD', gen: 'early', infantry: 0, lancer: 10, marksman: 90, reasoning: "..." },
  { role: 'LEAD', gen: 'gen8+', infantry: 0, lancer: 10, marksman: 90, reasoning: "Pure DPS — lancer lethality no longer matches marksman, drop it." },
  { role: 'JOIN', gen: 'early', infantry: 20, lancer: 20, marksman: 60, reasoning: "..." },
  { role: 'JOIN', gen: 'gen8+', infantry: 10, lancer: 15, marksman: 75, reasoning: "Gen 8+ lethality shift. Marksman pulls ahead by ~358 points." },
],
```

All other activities: omit `gen`, treat as gen-agnostic. The selector only appears when at least one role in the current activity has a `gen` field.

Persist the selected gen to localStorage (`wos:ratios:gen`). Don't tie it to activeChief — it's a global preference (Bill and KayB are on the same server).

### B.5 Copy-to-clipboard

Each role card has a small copy icon in the top-right. Tapping it copies `50/20/30` (or whatever the ratio is) as plain text. Useful when Bill is relaying to the alliance chat. Toast confirmation: "Copied 50/20/30".

### B.6 Acceptance criteria — Phase B

- Ratio bars visually match I/L/M split with correct colors.
- Tap a role card → reasoning expands; tap again → collapses.
- Scroll role cards → activity pill grid stays visible at top.
- Select `BHT` → the Gen 1–7 / Gen 8+ toggle appears.
- Switch to Gen 8+ → BHT LEAD shows updated reasoning.
- Switch to `SFC` → gen toggle hides (SFC is gen-agnostic).
- Tap copy icon on any role card → clipboard contains `X/Y/Z`.
- Gen preference persists across reload.

---

## Phase C — Optional

These are ideas, not commitments. Implement only if Bill asks.

- **Per-chief notes.** A free-text scratchpad tied to `{chiefName}:{activityCode}` for things like "KayB — use 60/20/20 JOIN for SFC, she runs out of lancers". Extends to Bill's alliance leader role (writing notes for the group).
- **Search / filter.** Overkill for 12 activities, skip unless the list grows past 20.
- **Export to image.** Render the current activity's role cards as a shareable PNG for alliance chat. Deferred — Bill already uses the copy-to-clipboard.
- **Integration with the Buff Strategy tab.** If the Buffs tab has a "troops" category, link each activity's card to the relevant buff items. Nice-to-have.
- **Hero recommendations per activity.** Given the chief's roster, suggest which heroes belong in slot 1 for each activity (SFC rally joiner → Jessie > Jeronimo > Sergey). This is a significant feature, not a polish — spec separately if wanted.

---

## Files to create

```
src/
├── data/
│   └── troopRatiosSeed.js        # §A.2 — the seed data
├── components/
│   ├── RatiosView.jsx            # §A.4 — main container
│   ├── ActivityPillGrid.jsx      # §A.4 — 3×4 pill grid
│   ├── RoleCard.jsx              # §A.4 + §B.1, B.2, B.5 — one role's ratios
│   └── RatioBar.jsx              # §B.1 — the visual bar
```

Optional/Phase B:
```
src/
├── components/
│   ├── GenToggle.jsx             # §B.4 — Gen 1–7 / Gen 8+ pill toggle
│   └── (reuse ActivityPillGrid for the gen toggle — same pattern)
├── hooks/
│   └── useCopyToClipboard.js     # §B.5
```

## Files to modify

- `App.jsx` — add the view toggle (or extend if it already exists), route to `RatiosView`.
- Whichever file holds troop-type color constants — **no change, just reuse**. Verify in Phase 0.

## Files not touched

- `ChiefView.jsx`, `HeroRow.jsx`, `HeroDetail.jsx`, `HeroEditForm.jsx` — Ratios tab lives alongside, not inside.
- `RoadmapDashboard.jsx` — unrelated.
- All `lib/*` — no parsing, no export, no storage logic affected.
- All existing xlsx files — ratios data is not imported/exported via spreadsheet.

---

## Design rationale (for when you wonder why something is the way it is)

**Why static seed, not xlsx import?** These 24 rows don't change per chief and rarely change at all (maybe once per meta shift). Making them editable via spreadsheet adds complexity without benefit. When meta shifts (e.g., Gen 8 arrives on Bill's server), the seed file gets a PR-sized update.

**Why 3-char codes at all?** Bill asked for them explicitly. They're also useful as stable identifiers (the display name could be tweaked without breaking any reference by code).

**Why a view toggle and not a bottom nav?** Bottom nav would imply parity of importance between Roster (daily use) and Ratios (look-up, a few times per week). The view toggle keeps Roster as the primary experience.

**Why gen-sensitivity only on BHT/PLT?** Those are the only activities where community 2026 data gives meaningfully different numbers between Gen 1–7 and Gen 8+. For everything else, 50/20/30 works across all generations; adding a gen toggle on every card would add clutter for no payoff.

**Why reasoning is collapsed by default in Phase B?** Scanning the numbers is the 90% use case. Reading the reasoning is the 10% use case. Collapse by default reflects that split.

**Why no edit UI in v1?** Bill's existing pattern for reference data (the buff strategy seed, the roadmap seed) is "edit the JS file, redeploy." Keeps the surface area small.

---

## Summary for Claude Code

1. Phase 0 — orient, don't edit, post a reconciliation report.
2. Phase A — create `troopRatiosSeed.js` verbatim, add view toggle, build `RatiosView` with pill grid + role cards + basic reasoning.
3. Phase B — visual bar, reasoning disclosure, sticky selector, gen toggle for BHT/PLT, copy-to-clipboard.
4. Phase C — punt unless asked.

Bill's priorities: mobile-first, match existing visual language, don't break anything, keep it simple.
