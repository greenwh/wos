# CLAUDE.md - WOS Hero Tracker

Hero roster tracker for the mobile game Whiteout Survival. React SPA with localStorage persistence, spreadsheet import/export, and GitHub Pages deployment.

---

## Commands

```bash
npm run dev       # Start dev server (Vite)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

No test framework is configured.

---

## Architecture

### Tech Stack
- **React 19** with Vite 8 (no router, single-page)
- **Tailwind CSS 4** via `@tailwindcss/vite` plugin
- **SheetJS (xlsx)** for spreadsheet import/export
- **localStorage** for all persistence (key: `wos-hero-tracker`)
- **GitHub Pages** deployment via Actions (push to `main` triggers build + deploy)

### Component Hierarchy
```
App (state: data, activeChief, importModal)
├─ ChiefTabs          # Chief account tabs
├─ ActionBar           # Import/Export buttons
├─ ChiefView           # Hero list for active chief
│  └─ HeroRow[]        # Collapsed hero display
│     ├─ GearSlot[]    # 4 gear icons
│     ├─ StarBar       # Star rating + slivers
│     └─ HeroDetail    # Expanded view OR HeroEditForm
└─ ImportModal         # Overlay for confirming imports
```

### Directory Layout
```
src/
├─ components/     # All React components (App, ChiefTabs, ChiefView, HeroRow, HeroDetail, HeroEditForm, GearSlot, StarBar, ActionBar, EmptyState)
├─ lib/            # Utilities (constants.js, storage.js, import.js, export.js)
├─ data/           # seed.js — initial demo data (2 chiefs, ~30 heroes)
├─ main.jsx        # Entry point
└─ index.css       # Tailwind import + base styles
```

---

## Data Model

All data stored as a single JSON blob in localStorage:

```
{ version: 1, chiefs: { [name]: { name, heroes[] } }, activeChief }
```

**Hero object:**
- `name`, `troopType` (Infantry/Lancer/Marksman), `rarity` (Mythic/Epic/Rare/Common)
- `level` (1-99), `stars` (0-5), `slivers` (0-5), `priority` (1-6 or null=bench)
- `weaponName`, `weaponRarity`, `role` (all strings)
- `gear[4]` — each: `{ slot, rarity, enhancement (0-99), masterForgery (1-5), notes }`
- `skills.exploration[0-3]`, `skills.expedition[0-3]` — each: `{ name, level (1-5) }`

---

## Patterns & Conventions

### State Management
- All state lives in `App.jsx`, passed down as props
- `updateData()` writes full data blob to localStorage on every change
- First load seeds from `seed.js` if localStorage is empty

### Styling
- Dark theme throughout: base `#0B1120`, inputs `#0F172A`, containers `#111827`
- All styling via Tailwind utility classes with arbitrary values (`bg-[#hex]`)
- Rarity colors defined in `constants.js` (border, bg, text, label)
- Troop type colors: Infantry=red, Lancer=blue, Marksman=green

### Sorting
- Active roster: sorted by priority ascending
- Bench: sorted by rarity (Mythic > Epic > Rare > Common) then alphabetically

### Spreadsheet Format (3 sheets)
1. **Hero Overview** — name, troop, rarity, level, stars (with slivers notation "3 (2/6)"), weapon, priority, role
2. **Gear Detail** — hero name, slot, rarity, enhancement, MF level, notes
3. **Skills** — merged headers, 3 exploration + 3 expedition skill name/level pairs

Chief name extracted from filename pattern: `{chiefname}_hero_tracker.xlsx`

### Form Inputs
- Small-range fields (Stars, Slivers, MF, Skill Level) use `<select>` dropdowns for mobile compatibility
- Wider-range fields (Level, Enhancement) use `<input type="number">` with `clamp()` utility
- Priority accepts blank (null = bench)

---

## Deployment

- **URL:** `https://greenwh.github.io/wos/`
- **Base path:** `/wos/` (set in `vite.config.js`)
- **CI/CD:** `.github/workflows/deploy.yml` — push to `main` → Node 20 → `npm ci` → `npm run build` → deploy `dist/` to GitHub Pages
- No environment variables or secrets required
