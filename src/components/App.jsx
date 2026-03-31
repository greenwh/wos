import { useState, useCallback } from 'react';
import { loadData, saveData } from '../lib/storage';
import { importFile } from '../lib/import';
import { exportChief } from '../lib/export';
import { runAutoDetection } from '../lib/roadmap';
import ChiefTabs from './ChiefTabs';
import ChiefView from './ChiefView';
import ActionBar from './ActionBar';
import BuffTab from './BuffTab';

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
  const [activeView, setActiveView] = useState('roster'); // 'roster' | 'roadmap' | 'buffs'

  const chief = data.chiefs[activeChief];

  const updateData = useCallback((newData) => {
    saveData(newData);
    setData({ ...newData });
  }, []);

  const handleImport = useCallback(async (file) => {
    try {
      const { heroes, suggestedName, roadmap } = await importFile(file);
      setImportModal({ heroes, suggestedName, roadmap });
    } catch (err) {
      alert('Failed to import: ' + err.message);
    }
  }, []);

  const confirmImport = useCallback((chiefName) => {
    if (!chiefName || !importModal) return;
    // Use imported roadmap if present, otherwise keep existing
    const roadmap = importModal.roadmap != null
      ? importModal.roadmap
      : (data.chiefs[chiefName]?.roadmap || []);
    const newData = {
      ...data,
      chiefs: {
        ...data.chiefs,
        [chiefName]: {
          name: chiefName,
          heroes: importModal.heroes,
          roadmap,
          buffStrategy: data.chiefs[chiefName]?.buffStrategy || { items: [], preEventChecklist: [] },
        },
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
    const updatedRoadmap = runAutoDetection(chief.roadmap, heroes);
    const newData = {
      ...data,
      chiefs: {
        ...data.chiefs,
        [activeChief]: { ...chief, heroes, roadmap: updatedRoadmap },
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

  const handleAddGoal = useCallback((goal) => {
    if (!chief) return;
    const roadmap = [...(chief.roadmap || []), goal];
    const newData = {
      ...data,
      chiefs: {
        ...data.chiefs,
        [activeChief]: { ...chief, roadmap },
      },
    };
    updateData(newData);
  }, [data, chief, activeChief, updateData]);

  const handleUpdateGoal = useCallback((updatedGoal) => {
    if (!chief?.roadmap) return;
    const roadmap = chief.roadmap.map(g => g.id === updatedGoal.id ? updatedGoal : g);
    const updatedRoadmap = runAutoDetection(roadmap, chief.heroes);
    const newData = {
      ...data,
      chiefs: {
        ...data.chiefs,
        [activeChief]: { ...chief, roadmap: updatedRoadmap },
      },
    };
    updateData(newData);
  }, [data, chief, activeChief, updateData]);

  const handleDeleteGoal = useCallback((goalId) => {
    if (!chief?.roadmap) return;
    const roadmap = chief.roadmap.filter(g => g.id !== goalId);
    const newData = {
      ...data,
      chiefs: {
        ...data.chiefs,
        [activeChief]: { ...chief, roadmap },
      },
    };
    updateData(newData);
  }, [data, chief, activeChief, updateData]);

  const handleReorderGoal = useCallback((goalId, direction) => {
    if (!chief?.roadmap) return;
    const roadmap = [...chief.roadmap];
    const idx = roadmap.findIndex(g => g.id === goalId);
    if (idx === -1) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= roadmap.length) return;
    [roadmap[idx], roadmap[newIdx]] = [roadmap[newIdx], roadmap[idx]];
    const newData = {
      ...data,
      chiefs: {
        ...data.chiefs,
        [activeChief]: { ...chief, roadmap },
      },
    };
    updateData(newData);
  }, [data, chief, activeChief, updateData]);

  const updateBuffStrategy = useCallback((buffStrategy) => {
    if (!chief) return;
    const newData = {
      ...data,
      chiefs: {
        ...data.chiefs,
        [activeChief]: { ...chief, buffStrategy },
      },
    };
    updateData(newData);
  }, [data, chief, activeChief, updateData]);

  const handleToggleGoal = useCallback((goalId) => {
    if (!chief?.roadmap) return;
    const now = new Date().toISOString().slice(0, 10);
    const updatedRoadmap = chief.roadmap.map(g => {
      if (g.id !== goalId) return g;
      const nowComplete = !g.completed;
      return { ...g, completed: nowComplete, completedDate: nowComplete ? now : null };
    });
    const newData = {
      ...data,
      chiefs: {
        ...data.chiefs,
        [activeChief]: { ...chief, roadmap: updatedRoadmap },
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

      {/* View toggle */}
      <ViewToggle activeView={activeView} onSelect={setActiveView} />

      {/* Views */}
      {activeView === 'roster' && (
        <ChiefView
          chief={chief}
          heroes={chief?.heroes}
          roadmap={chief?.roadmap}
          onSaveHero={handleSaveHero}
          onDeleteHero={handleDeleteHero}
          onAddHero={handleAddHero}
          showRoadmap={false}
          onViewRoadmap={() => setActiveView('roadmap')}
          onCloseRoadmap={() => setActiveView('roster')}
          onToggleGoal={handleToggleGoal}
          onAddGoal={handleAddGoal}
          onUpdateGoal={handleUpdateGoal}
          onDeleteGoal={handleDeleteGoal}
          onReorderGoal={handleReorderGoal}
        />
      )}

      {activeView === 'roadmap' && (
        <ChiefView
          chief={chief}
          heroes={chief?.heroes}
          roadmap={chief?.roadmap}
          onSaveHero={handleSaveHero}
          onDeleteHero={handleDeleteHero}
          onAddHero={handleAddHero}
          showRoadmap={true}
          onViewRoadmap={() => {}}
          onCloseRoadmap={() => setActiveView('roster')}
          onToggleGoal={handleToggleGoal}
          onAddGoal={handleAddGoal}
          onUpdateGoal={handleUpdateGoal}
          onDeleteGoal={handleDeleteGoal}
          onReorderGoal={handleReorderGoal}
        />
      )}

      {activeView === 'buffs' && (
        <BuffTab
          buffStrategy={chief?.buffStrategy}
          onUpdate={updateBuffStrategy}
          onGoToRoadmap={() => setActiveView('roadmap')}
        />
      )}

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

const VIEW_TABS = [
  { key: 'roster',  label: 'Roster' },
  { key: 'roadmap', label: 'Roadmap' },
  { key: 'buffs',   label: 'Buffs' },
];

function ViewToggle({ activeView, onSelect }) {
  return (
    <div className="flex gap-1 px-3 py-1.5 bg-[#0B1120]">
      {VIEW_TABS.map(tab => (
        <button
          key={tab.key}
          onClick={() => onSelect(tab.key)}
          className={`flex-1 py-1.5 text-[11px] font-semibold rounded transition-colors cursor-pointer ${
            activeView === tab.key
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-gray-200 bg-[#111827]'
          }`}
        >
          {tab.label}
        </button>
      ))}
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
