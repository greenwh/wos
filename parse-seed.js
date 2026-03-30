const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

const SLOT_ORDER = ["Goggles", "Gloves", "Belt", "Boots"];
const STARS_RE = /^(\d+)\s*(?:\((\d+)\/6\))?$/;

function parseNum(v) {
  if (v === "" || v === undefined || v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function parseStars(raw) {
  const s = String(raw).trim();
  const m = STARS_RE.exec(s);
  if (!m) return { stars: parseNum(raw) ?? 0, slivers: 0 };
  return { stars: Number(m[1]), slivers: m[2] ? Number(m[2]) : 0 };
}

function parseFile(filePath, chiefName) {
  const wb = XLSX.readFile(filePath);

  // --- Hero Overview ---
  const overviewRows = XLSX.utils.sheet_to_json(wb.Sheets["Hero Overview"]);
  const heroMap = new Map();

  for (const r of overviewRows) {
    const name = String(r["Hero"] || "").trim();
    if (!name) continue;
    const { stars, slivers } = parseStars(r["Stars"]);
    heroMap.set(name, {
      name,
      troopType: String(r["Troop Type"] || "").trim(),
      rarity: String(r["Rarity"] || "").trim(),
      level: parseNum(r["Level"]) ?? 0,
      stars,
      slivers,
      weaponName: String(r["Weapon Name"] || "").trim(),
      weaponRarity: "",
      priority: parseNum(r["Priority"]),
      role: String(r["Role"] || "").trim(),
      gear: [],
      skills: { exploration: [], expedition: [] },
    });
  }

  // --- Gear Detail ---
  const gearRows = XLSX.utils.sheet_to_json(wb.Sheets["Gear Detail"]);

  for (const r of gearRows) {
    const heroName = String(r["Hero"] || "").trim();
    const slot = String(r["Slot"] || "").trim();
    const hero = heroMap.get(heroName);
    if (!hero) continue;

    if (slot === "Weapon") {
      hero.weaponRarity = String(r["Rarity"] || "").trim();
      continue;
    }

    if (!SLOT_ORDER.includes(slot)) continue;

    hero.gear.push({
      slot,
      rarity: String(r["Rarity"] || "").trim(),
      enhancement: parseNum(r["Enhancement (+)"]),
      masterForgery: parseNum(r["Master Forgery Lv"]),
      notes: String(r["Notes"] || "").trim(),
    });
  }

  // Ensure every hero has exactly 4 gear slots in order
  for (const hero of heroMap.values()) {
    const gearBySlot = new Map(hero.gear.map((g) => [g.slot, g]));
    hero.gear = SLOT_ORDER.map(
      (slot) =>
        gearBySlot.get(slot) || {
          slot,
          rarity: "Empty",
          enhancement: null,
          masterForgery: null,
          notes: "",
        }
    );
  }

  // --- Skills ---
  const skillsSheet = wb.Sheets["Skills"];
  const range = XLSX.utils.decode_range(skillsSheet["!ref"]);

  function cellVal(r, c) {
    const addr = XLSX.utils.encode_cell({ r, c });
    const cell = skillsSheet[addr];
    return cell ? cell.v : "";
  }

  // Data starts at row index 2 (0-indexed)
  for (let r = 2; r <= range.e.r; r++) {
    const heroName = String(cellVal(r, 0)).trim();
    const hero = heroMap.get(heroName);
    if (!hero) continue;

    // Exploration: cols C-H (2-7), pairs at (2,3), (4,5), (6,7)
    for (let p = 0; p < 3; p++) {
      const skillName = String(cellVal(r, 2 + p * 2)).trim();
      const skillLv = parseNum(cellVal(r, 3 + p * 2));
      if (skillName) {
        hero.skills.exploration.push({ name: skillName, level: skillLv ?? 0 });
      }
    }

    // Expedition: cols I-N (8-13), pairs at (8,9), (10,11), (12,13)
    for (let p = 0; p < 3; p++) {
      const skillName = String(cellVal(r, 8 + p * 2)).trim();
      const skillLv = parseNum(cellVal(r, 9 + p * 2));
      if (skillName) {
        hero.skills.expedition.push({ name: skillName, level: skillLv ?? 0 });
      }
    }
  }

  return {
    name: chiefName,
    heroes: Array.from(heroMap.values()),
  };
}

// Parse both files
const wally = parseFile(
  path.join(__dirname, "data", "wally_hero_tracker.xlsx"),
  "Wally"
);
const beav = parseFile(
  path.join(__dirname, "data", "beav_hero_tracker.xlsx"),
  "Beav"
);

const seedData = {
  version: 1,
  chiefs: {
    Wally: wally,
    Beav: beav,
  },
  activeChief: "Wally",
};

// Output as ES module
const output = `export const SEED_DATA = ${JSON.stringify(seedData, null, 2)};\n`;
process.stdout.write(output);

// Summary to stderr so it doesn't pollute stdout
process.stderr.write(
  `\nParsed ${wally.heroes.length} heroes for Wally, ${beav.heroes.length} heroes for Beav\n`
);
