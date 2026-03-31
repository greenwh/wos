import { SEED_DATA } from '../data/seed';
import { seedRoadmapIfNeeded } from '../data/roadmapSeed';

const STORAGE_KEY = 'wos-hero-tracker';
const CURRENT_VERSION = 2;

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
  // Seed Wally/Beav roadmaps if they exist but have no goals
  seedRoadmapIfNeeded(data);
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
