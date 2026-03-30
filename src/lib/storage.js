import { SEED_DATA } from '../data/seed';

const STORAGE_KEY = 'wos-hero-tracker';
const CURRENT_VERSION = 1;

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data && data.chiefs) {
        data.version = data.version || CURRENT_VERSION;
        return data;
      }
    }
  } catch (e) {
    console.error('Failed to load data from localStorage:', e);
  }
  // First load: seed and persist
  saveData(SEED_DATA);
  return SEED_DATA;
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
