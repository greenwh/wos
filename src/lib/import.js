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

const MANUAL_ONLY_TYPES = ['gear_acquire', 'shard_accumulate', 'weapon_upgrade', 'chief_gear', 'general'];

function parseRoadmapSheet(workbook) {
  const sheet = workbook.Sheets['Roadmap'];
  if (!sheet) return null;
  const rows = XLSX.utils.sheet_to_json(sheet);
  if (!rows.length) return [];

  return rows.map((row, i) => {
    const goalType = str(row['Goal Type']) || 'general';
    const target = {};
    const slot = str(row['Target Slot']);
    const val = num(row['Target Value']);

    if (['gear_enhancement', 'gear_mf', 'gear_acquire'].includes(goalType) && slot) {
      target.gearSlot = slot;
    }
    if (goalType === 'gear_enhancement' && val != null) target.targetEnhancement = val;
    if (goalType === 'gear_mf' && val != null) target.targetMF = val;
    if (goalType === 'gear_acquire') target.targetRarity = str(row['Target Rarity']) || '';
    if (goalType === 'skill_level') {
      target.skillName = str(row['Skill Name']);
      target.skillCategory = str(row['Skill Category']) || 'exploration';
      if (val != null) target.targetLevel = val;
    }
    if (goalType === 'star_ascension' && val != null) target.targetStars = val;
    if (goalType === 'pet_capture') target.targetRarity = str(row['Target Rarity']) || '';
    if (goalType === 'pet_level' && val != null) target.targetLevel = val;
    if (goalType === 'pet_refine') target.targetRarity = str(row['Target Rarity']) || '';

    const completed = str(row['Completed']).toUpperCase() === 'TRUE';

    return {
      id: `imp-${i + 1}-${Date.now().toString(36)}`,
      phase: num(row['Phase']) || 1,
      phaseLabel: str(row['Phase Label']) || '',
      heroName: str(row['Hero']),
      goalType,
      description: str(row['Description']) || '',
      target,
      manualOnly: str(row['Manual Only']).toUpperCase() === 'TRUE' || MANUAL_ONLY_TYPES.includes(goalType),
      completed,
      completedDate: str(row['Completed Date']) || null,
      modeImpact: str(row['Mode Impact']),
      notes: str(row['Notes']),
    };
  });
}

function parsePetsSheet(workbook) {
  const sheet = workbook.Sheets['Pets'];
  if (!sheet) return null;
  const rows = XLSX.utils.sheet_to_json(sheet);
  if (!rows.length) return [];

  return rows.map(row => ({
    name: str(row['Pet']),
    generation: num(row['Generation']) || 1,
    rarity: str(row['Rarity']),
    status: str(row['Status']) || 'Locked',
    level: (() => { const v = row['Level']; return (v == null || v === '-' || v === '') ? 0 : (num(v) ?? 0); })(),
    advancement: (() => { const v = row['Advancement']; return (v == null || v === '-' || v === '') ? 0 : (num(v) ?? 0); })(),
    activeSkill: str(row['Active Skill']),
    activeSkillEffect: str(row['Active Skill Effect']),
    refinementFocus: str(row['Refinement Focus']),
    unlockRequirement: str(row['Unlock Requirement']),
    priority: str(row['Priority']),
    notes: str(row['Notes']),
  }));
}

export function importFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        const heroes = parseWorkbook(wb);
        const roadmap = parseRoadmapSheet(wb);
        const pets = parsePetsSheet(wb);
        // Try to detect chief name from filename
        const match = file.name.match(/^(\w+)_hero_tracker/i);
        const suggestedName = match ? match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase() : '';
        resolve({ heroes, suggestedName, roadmap, pets });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
