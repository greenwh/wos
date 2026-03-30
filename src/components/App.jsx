import { useState, useCallback } from 'react';
import { loadData, saveData } from '../lib/storage';
import { importFile } from '../lib/import';
import { exportChief } from '../lib/export';
import ChiefTabs from './ChiefTabs';
import ChiefView from './ChiefView';
import ActionBar from './ActionBar';

function newHero() {
  return {
    name: 'New Hero',
    troopType: 'Infantry',
    rarity: 'Common',
    level: 1,
    stars: 0,
    slivers: 0,
    weaponName: '',
    weaponRarity: '',
    priority: null,
    role: '',
    gear: ['Goggles', 'Gloves', 'Belt', 'Boots'].map(slot => ({
      slot, rarity: 'Empty', enhancement: null, masterForgery: null, notes: '',
    })),
    skills: { exploration: [], expedition: [] },
  };
}

export default function App() {
  const [data, setData] = useState(() => loadData());
  const [activeChief, setActiveChief] = useState(data.activeChief);
  const [importModal, setImportModal] = useState(null);

  const chief = data.chiefs[activeChief];

  const updateData = useCallback((newData) => {
    saveData(newData);
    setData({ ...newData });
  }, []);

  const handleImport = useCallback(async (file) => {
    try {
      const { heroes, suggestedName } = await importFile(file);
      setImportModal({ heroes, suggestedName });
    } catch (err) {
      alert('Failed to import: ' + err.message);
    }
  }, []);

  const confirmImport = useCallback((chiefName) => {
    if (!chiefName || !importModal) return;
    const newData = {
      ...data,
      chiefs: {
        ...data.chiefs,
        [chiefName]: { name: chiefName, heroes: importModal.heroes },
      },
      activeChief: chiefName,
    };
    updateData(newData);
    setActiveChief(chiefName);
    setImportModal(null);
  }, [data, importModal, updateData]);

  const handleExport = useCallback(() => {
    if (chief) exportChief(chief);
  }, [chief]);

  const handleSaveHero = useCallback((oldName, updatedHero) => {
    const heroes = chief.heroes.map(h => h.name === oldName ? updatedHero : h);
    const newData = {
      ...data,
      chiefs: {
        ...data.chiefs,
        [activeChief]: { ...chief, heroes },
      },
    };
    updateData(newData);
  }, [data, chief, activeChief, updateData]);

  const handleDeleteHero = useCallback((heroName) => {
    const heroes = chief.heroes.filter(h => h.name !== heroName);
    const newData = {
      ...data,
      chiefs: {
        ...data.chiefs,
        [activeChief]: { ...chief, heroes },
      },
    };
    updateData(newData);
  }, [data, chief, activeChief, updateData]);

  const handleAddHero = useCallback(() => {
    const hero = newHero();
    // Ensure unique name
    const names = new Set(chief?.heroes?.map(h => h.name) || []);
    let n = 1;
    while (names.has(hero.name)) {
      hero.name = `New Hero ${n++}`;
    }
    const heroes = [...(chief?.heroes || []), hero];
    const newData = {
      ...data,
      chiefs: {
        ...data.chiefs,
        [activeChief]: { ...chief, name: activeChief, heroes },
      },
    };
    updateData(newData);
  }, [data, chief, activeChief, updateData]);

  return (
    <div className="min-h-screen bg-[#0B1120] max-w-lg mx-auto">
      {/* Header */}
      <div className="px-3 py-3 flex items-center gap-2 bg-[#0B1120] border-b border-gray-800">
        <span className="text-xl">❄️</span>
        <h1 className="text-base font-bold text-white">WOS Hero Tracker</h1>
      </div>

      {/* Chief tabs */}
      {Object.keys(data.chiefs).length > 0 && (
        <ChiefTabs
          chiefs={data.chiefs}
          activeChief={activeChief}
          onSelect={setActiveChief}
        />
      )}

      {/* Action bar */}
      <ActionBar onImport={handleImport} onExport={handleExport} />

      {/* Hero roster */}
      <ChiefView
        chief={chief}
        onSaveHero={handleSaveHero}
        onDeleteHero={handleDeleteHero}
        onAddHero={handleAddHero}
      />

      {/* Import modal */}
      {importModal && (
        <ImportModal
          suggestedName={importModal.suggestedName}
          heroCount={importModal.heroes.length}
          onConfirm={confirmImport}
          onCancel={() => setImportModal(null)}
        />
      )}
    </div>
  );
}

function ImportModal({ suggestedName, heroCount, onConfirm, onCancel }) {
  const [name, setName] = useState(suggestedName);
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E293B] rounded-lg p-5 w-full max-w-xs">
        <h2 className="text-sm font-bold text-white mb-3">Import {heroCount} Heroes</h2>
        <label className="text-xs text-gray-400 block mb-1">Chief Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-[#0F172A] border border-gray-600 rounded px-3 py-2 text-sm text-white mb-4 outline-none focus:border-blue-500"
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && name.trim() && onConfirm(name.trim())}
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs text-gray-400 hover:text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => name.trim() && onConfirm(name.trim())}
            className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-500 cursor-pointer"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}
