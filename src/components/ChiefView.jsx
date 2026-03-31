import { useState, useEffect, useRef } from 'react';
import { RARITY_ORDER } from '../lib/constants';
import HeroRow from './HeroRow';
import EmptyState from './EmptyState';
import RoadmapDashboard from './RoadmapDashboard';

function sortHeroes(heroes) {
  const active = heroes
    .filter(h => h.priority != null)
    .sort((a, b) => a.priority - b.priority);

  const bench = heroes
    .filter(h => h.priority == null)
    .sort((a, b) => {
      const rarityDiff = (RARITY_ORDER[a.rarity] ?? 99) - (RARITY_ORDER[b.rarity] ?? 99);
      if (rarityDiff !== 0) return rarityDiff;
      return a.name.localeCompare(b.name);
    });

  return { active, bench };
}

export default function ChiefView({ chief, heroes, roadmap, onSaveHero, onDeleteHero, onAddHero }) {
  const [benchOpen, setBenchOpen] = useState(false);
  const [expandedHero, setExpandedHero] = useState(null);
  const [editingHero, setEditingHero] = useState(null);
  const prevHeroCount = useRef(chief?.heroes?.length || 0);

  // When a new hero is added, auto-open bench and expand+edit it
  useEffect(() => {
    const count = chief?.heroes?.length || 0;
    if (count > prevHeroCount.current) {
      // Find the new hero (last one added)
      const newHero = chief.heroes[chief.heroes.length - 1];
      if (newHero && newHero.priority == null) {
        setBenchOpen(true);
      }
      setExpandedHero(newHero.name);
      setEditingHero(newHero.name);
    }
    prevHeroCount.current = count;
  }, [chief?.heroes?.length]);

  if (!chief || !chief.heroes || chief.heroes.length === 0) {
    return (
      <div>
        <EmptyState />
        {onAddHero && (
          <div className="flex justify-center pb-6">
            <button
              onClick={onAddHero}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-500 cursor-pointer"
            >
              + Add Hero
            </button>
          </div>
        )}
      </div>
    );
  }

  const { active, bench } = sortHeroes(chief.heroes);

  const toggleHero = (name) => {
    setExpandedHero(prev => prev === name ? null : name);
    if (expandedHero === name) setEditingHero(null);
  };

  const renderRow = (hero, i) => (
    <HeroRow
      key={hero.name}
      hero={hero}
      index={i}
      expanded={expandedHero === hero.name}
      startEditing={editingHero === hero.name}
      onToggle={() => toggleHero(hero.name)}
      onSave={(oldName, updated) => {
        onSaveHero(oldName, updated);
        setEditingHero(null);
        if (updated.name !== oldName) setExpandedHero(updated.name);
      }}
      onDelete={(name) => {
        onDeleteHero(name);
        setExpandedHero(null);
        setEditingHero(null);
      }}
    />
  );

  return (
    <div>
      {/* Roadmap Dashboard */}
      <RoadmapDashboard roadmap={roadmap} heroes={heroes} />

      {/* Active Roster */}
      {active.length > 0 && (
        <div>
          <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-[#0B1120]">
            Active Roster
          </div>
          {active.map((hero, i) => renderRow(hero, i))}
        </div>
      )}

      {/* Bench */}
      {bench.length > 0 && (
        <div>
          <button
            onClick={() => setBenchOpen(!benchOpen)}
            className="w-full px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-[#0B1120] flex items-center gap-1 cursor-pointer"
          >
            <span className="text-[10px]">{benchOpen ? "▼" : "▶"}</span>
            Bench ({bench.length} heroes)
          </button>
          {benchOpen && (
            <div className="opacity-80">
              {bench.map((hero, i) => renderRow(hero, i))}
            </div>
          )}
        </div>
      )}

      {/* Add Hero button */}
      {onAddHero && (
        <div className="flex justify-center py-4">
          <button
            onClick={onAddHero}
            className="px-4 py-2 text-xs text-blue-400 hover:text-blue-300 border border-blue-400/30 rounded cursor-pointer"
          >
            + Add Hero
          </button>
        </div>
      )}
    </div>
  );
}
