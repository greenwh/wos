# WOS Hero Tracker

A hero roster tracker for [Whiteout Survival](https://whiteoutsurvival.fandom.com/). Manage multiple game accounts, track hero stats, gear, and skills, and sync data via spreadsheet import/export.

**Live app:** [greenwh.github.io/wos](https://greenwh.github.io/wos/)

## Features

- **Multi-account support** — Switch between game accounts ("chiefs") with tab navigation
- **Full hero tracking** — Level, stars, slivers, troop type, rarity, priority, role, weapon
- **Gear management** — 4 gear slots per hero with rarity, enhancement level, and master forgery tracking
- **Skill tracking** — Up to 3 exploration and 3 expedition skills per hero with levels 1-5
- **Spreadsheet import/export** — Import and export hero data as `.xlsx` files with 3 structured sheets
- **Active roster & bench** — Heroes with priority 1-6 are active; unranked heroes go to the bench
- **Mobile-optimized** — Dark theme, touch-friendly controls, responsive layout
- **Offline-capable** — All data stored in browser localStorage, no account or backend required

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173/wos/](http://localhost:5173/wos/) in your browser.

## Build & Deploy

```bash
npm run build     # Output to dist/
npm run preview   # Preview the build locally
```

Deployment to GitHub Pages happens automatically on push to `main` via GitHub Actions.

## Tech Stack

- [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [SheetJS](https://sheetjs.com/) for spreadsheet I/O
- localStorage for persistence
- GitHub Pages for hosting

## Spreadsheet Format

Exported `.xlsx` files contain 3 sheets:

| Sheet | Contents |
|-------|----------|
| Hero Overview | Name, troop type, rarity, level, stars, weapon, priority, role |
| Gear Detail | Per-slot gear rarity, enhancement, master forgery, notes |
| Skills | Exploration and expedition skill names and levels |

Import detects the chief name from the filename (e.g., `Wally_hero_tracker.xlsx`) or prompts for one.
