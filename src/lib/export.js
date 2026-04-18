import * as XLSX from 'xlsx';

export function exportChief(chief) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Hero Overview
  const overviewData = chief.heroes.map(h => ({
    'Hero': h.name,
    'Troop Type': h.troopType,
    'Rarity': h.rarity,
    'Level': h.level,
    'Stars': h.slivers > 0 ? `${h.stars} (${h.slivers}/6)` : String(h.stars),
    'Weapon Name': h.weaponName || '',
    'Priority': h.priority ?? '',
    'Role': h.role || '',
  }));
  const ws1 = XLSX.utils.json_to_sheet(overviewData);
  XLSX.utils.book_append_sheet(wb, ws1, 'Hero Overview');

  // Sheet 2: Gear Detail
  const gearData = [];
  for (const h of chief.heroes) {
    // Weapon row
    if (h.weaponName) {
      gearData.push({
        'Hero': h.name,
        'Troop Type': h.troopType,
        'Slot': 'Weapon',
        'Rarity': h.weaponRarity || '',
        'Enhancement (+)': '',
        'Master Forgery Lv': '',
        'Notes': h.weaponName,
      });
    }
    for (const g of h.gear) {
      gearData.push({
        'Hero': h.name,
        'Troop Type': h.troopType,
        'Slot': g.slot,
        'Rarity': g.rarity,
        'Enhancement (+)': g.enhancement ?? '',
        'Master Forgery Lv': g.masterForgery ?? '',
        'Notes': g.notes || '',
      });
    }
  }
  const ws2 = XLSX.utils.json_to_sheet(gearData);
  XLSX.utils.book_append_sheet(wb, ws2, 'Gear Detail');

  // Sheet 3: Skills
  const skillRows = [
    ['Hero', 'Troop Type', 'Exploration Skills', '', '', '', '', '', 'Expedition Skills', '', '', '', '', ''],
    ['', '', 'Skill 1 Name', 'Lv', 'Skill 2 Name', 'Lv', 'Skill 3 Name', 'Lv', 'Skill 1 Name', 'Lv', 'Skill 2 Name', 'Lv', 'Skill 3 Name', 'Lv'],
  ];
  for (const h of chief.heroes) {
    const row = [h.name, h.troopType];
    for (let i = 0; i < 3; i++) {
      const s = h.skills.exploration[i];
      row.push(s ? s.name : '', s ? s.level : '');
    }
    for (let i = 0; i < 3; i++) {
      const s = h.skills.expedition[i];
      row.push(s ? s.name : '', s ? s.level : '');
    }
    skillRows.push(row);
  }
  const ws3 = XLSX.utils.aoa_to_sheet(skillRows);
  // Merge header cells for Exploration and Expedition
  ws3['!merges'] = [
    { s: { r: 0, c: 2 }, e: { r: 0, c: 7 } },
    { s: { r: 0, c: 8 }, e: { r: 0, c: 13 } },
  ];
  XLSX.utils.book_append_sheet(wb, ws3, 'Skills');

  // Sheet 4: Roadmap
  const ROADMAP_HEADERS = [
    'Priority', 'Phase', 'Phase Label', 'Hero', 'Goal Type', 'Description',
    'Target Slot', 'Target Value', 'Target Rarity', 'Skill Name', 'Skill Category',
    'Manual Only', 'Completed', 'Completed Date', 'Mode Impact', 'Notes',
  ];
  const roadmapRows = (chief.roadmap || []).map((g, i) => [
    i + 1,
    g.phase,
    g.phaseLabel,
    g.heroName,
    g.goalType,
    g.description,
    g.target?.gearSlot || '',
    g.target?.targetEnhancement ?? g.target?.targetMF ?? g.target?.targetLevel ?? g.target?.targetStars ?? '',
    g.target?.targetRarity || '',
    g.target?.skillName || '',
    g.target?.skillCategory || '',
    g.manualOnly ? 'TRUE' : 'FALSE',
    g.completed ? 'TRUE' : 'FALSE',
    g.completedDate || '',
    g.modeImpact || '',
    g.notes || '',
  ]);
  const ws4 = XLSX.utils.aoa_to_sheet([ROADMAP_HEADERS, ...roadmapRows]);
  XLSX.utils.book_append_sheet(wb, ws4, 'Roadmap');

  // Sheet 5: Pets
  if (chief.pets && chief.pets.length > 0) {
    const petsData = chief.pets.map(p => ({
      'Pet': p.name,
      'Generation': p.generation,
      'Rarity': p.rarity,
      'Status': p.status,
      'Level': p.level || (p.status === 'Locked' ? '-' : 0),
      'Advancement': p.advancement || (p.status === 'Locked' ? '-' : 0),
      'Active Skill': p.activeSkill || '',
      'Active Skill Effect': p.activeSkillEffect || '',
      'Refinement Focus': p.refinementFocus || '',
      'Unlock Requirement': p.unlockRequirement || '',
      'Priority': p.priority || '',
      'Notes': p.notes || '',
    }));
    const ws5 = XLSX.utils.json_to_sheet(petsData);
    XLSX.utils.book_append_sheet(wb, ws5, 'Pets');
  }

  // Trigger download
  XLSX.writeFile(wb, `${chief.name.toLowerCase()}_hero_tracker.xlsx`);
}
