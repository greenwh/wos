import { SEED_DATA } from '../data/seed';
import { seedRoadmapIfNeeded } from '../data/roadmapSeed';
import { seedBuffStrategyIfNeeded } from '../data/buffSeed';
import { seedPetsIfNeeded } from '../data/petsSeed';

const STORAGE_KEY = 'wos-hero-tracker';
const CURRENT_VERSION = 4;

function migrate(data) {
  if (!data.version || data.version < 2) {
    // v1 → v2: add empty roadmap to all chiefs
    for (const chief of Object.values(data.chiefs)) {
      if (!chief.roadmap) {
        chief.roadmap = [];
      }
    }
    data.version = 2;
  }
  if (data.version < 3) {
    // v2 → v3: add empty buffStrategy to all chiefs
    for (const chief of Object.values(data.chiefs)) {
      if (!chief.buffStrategy) {
        chief.buffStrategy = { items: [], preEventChecklist: [] };
      }
    }
    data.version = 3;
  }
  if (data.version < 4) {
    // v3 → v4: add empty pets array to all chiefs
    for (const chief of Object.values(data.chiefs)) {
      if (!chief.pets) {
        chief.pets = [];
      }
    }
    data.version = 4;
  }
  // Seed Wally/Beav roadmaps and buff strategies if empty
  seedRoadmapIfNeeded(data);
  seedBuffStrategyIfNeeded(data);
  seedPetsIfNeeded(data);
  return data;
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data && data.chiefs) {
        const migrated = migrate(data);
        if (migrated.version !== data.version) {
          saveData(migrated);
        }
        return migrated;
      }
    }
  } catch (e) {
    console.error('Failed to load data from localStorage:', e);
  }
  // First load: seed and persist
  const seeded = migrate(structuredClone(SEED_DATA));
  saveData(seeded);
  return seeded;
}

export function saveData(data) {
  try {
    data.version = CURRENT_VERSION;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data to localStorage:', e);
  }
}

export function clearData() {
  localStorage.removeItem(STORAGE_KEY);
}
