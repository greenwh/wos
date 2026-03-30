import * as XLSX from 'xlsx';

function parseStars(val) {
  if (val == null || val === '') return { stars: 0, slivers: 0 };
  const s = String(val).trim();
  const m = s.match(/^(\d+)\s*(?:\((\d+)\/6\))?$/);
  if (m) return { stars: parseInt(m[1]), slivers: m[2] ? parseInt(m[2]) : 0 };
  const n = parseInt(s);
  return { stars: isNaN(n) ? 0 : n, slivers: 0 };
}

function num(val) {
  if (val == null || val === '') return null;
  const n = typeof val === 'number' ? val : parseInt(String(val));
  return isNaN(n) ? null : n;
}

function str(val) {
  if (val == null) return '';
  return String(val).trim();
}

const SLOT_ORDER = ['Goggles', 'Gloves', 'Belt', 'Boots'];

export function parseWorkbook(workbook) {
  const heroSheet = workbook.Sheets[workbook.SheetNames[0]];
  const gearSheet = workbook.Sheets[workbook.SheetNames[1]];
  const skillSheet = workbook.Sheets[workbook.SheetNames[2]];

  // Parse Hero Overview
  const heroRows = XLSX.utils.sheet_to_json(heroSheet);
  const heroMap = {};

  for (const row of heroRows) {
    const name = str(row['Hero']);
    if (!name) continue;
    const { stars, slivers } = parseStars(row['Stars']);
    heroMap[name] = {
      name,
      troopType: str(row['Troop Type']),
      rarity: str(row['Rarity']),
      level: num(row['Level']) || 1,
      stars,
      slivers,
      weaponName: str(row['Weapon Name']),
      weaponRarity: '',
      priority: num(row['Priority']),
      role: str(row['Role']),
      gear: SLOT_ORDER.map(slot => ({
        slot,
        rarity: 'Empty',
        enhancement: null,
        masterForgery: null,
        notes: '',
      })),
      skills: { exploration: [], expedition: [] },
    };
  }

  // Parse Gear Detail
  const gearRows = XLSX.utils.sheet_to_json(gearSheet);
  for (const row of gearRows) {
    const heroName = str(row['Hero']);
    const slot = str(row['Slot']);
    const hero = heroMap[heroName];
    if (!hero) continue;

    if (slot === 'Weapon') {
      hero.weaponRarity = str(row['Rarity']);
      if (!hero.weaponName) hero.weaponName = str(row['Notes']);
      continue;
    }

    const slotIdx = SLOT_ORDER.indexOf(slot);
    if (slotIdx === -1) continue;

    hero.gear[slotIdx] = {
      slot,
      rarity: str(row['Rarity']) || 'Empty',
      enhancement: num(row['Enhancement (+)']) ?? num(row['Enhancement']),
      masterForgery: num(row['Master Forgery Lv']) ?? num(row['Master Forgery']),
      notes: str(row['Notes']),
    };
  }

  // Parse Skills (merged headers: data starts at row 3, index 2)
  if (skillSheet) {
    const allRows = XLSX.utils.sheet_to_json(skillSheet, { header: 1, defval: '' });
    // Data starts at row index 2 (row 3 in spreadsheet)
    for (let i = 2; i < allRows.length; i++) {
      const r = allRows[i];
      const heroName = str(r[0]);
      const hero = heroMap[heroName];
      if (!hero) continue;

      hero.skills.exploration = [];
      hero.skills.expedition = [];

      // Exploration: columns C-H (indices 2-7), pairs of name/level
      for (let j = 2; j <= 6; j += 2) {
        const sName = str(r[j]);
        if (sName) hero.skills.exploration.push({ name: sName, level: num(r[j + 1]) || 1 });
      }
      // Expedition: columns I-N (indices 8-13), pairs of name/level
      for (let j = 8; j <= 12; j += 2) {
        const sName = str(r[j]);
        if (sName) hero.skills.expedition.push({ name: sName, level: num(r[j + 1]) || 1 });
      }
    }
  }

  return Object.values(heroMap);
}

export function importFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        const heroes = parseWorkbook(wb);
        // Try to detect chief name from filename
        const match = file.name.match(/^(\w+)_hero_tracker/i);
        const suggestedName = match ? match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase() : '';
        resolve({ heroes, suggestedName });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
