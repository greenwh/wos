import { useState, useMemo } from 'react';

const GEN_COLORS = {
  1: { bg: '#166534', border: '#22C55E', label: '#4ADE80' },
  2: { bg: '#1E3A5F', border: '#3B82F6', label: '#60A5FA' },
  3: { bg: '#4C1D95', border: '#8B5CF6', label: '#A78BFA' },
  4: { bg: '#7C2D12', border: '#F97316', label: '#FB923C' },
};

const STATUS_OPTIONS = ['To Capture', 'Captured', 'Locked'];

const PRIORITY_COLORS = {
  'High': 'text-red-400',
  'High (Gate)': 'text-red-400',
  'Medium': 'text-yellow-400',
  'Low': 'text-gray-400',
  'Future High': 'text-blue-400',
  'Future Medium': 'text-blue-400',
  'Future S-Tier': 'text-purple-400',
  'Future Niche': 'text-gray-500',
};

export default function PetsView({ pets, onUpdatePet }) {
  const [editingPet, setEditingPet] = useState(null);

  const groups = useMemo(() => {
    if (!pets?.length) return [];
    const map = new Map();
    pets.forEach(pet => {
      if (!map.has(pet.generation)) map.set(pet.generation, []);
      map.get(pet.generation).push(pet);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a - b)
      .map(([gen, list]) => ({ gen, pets: list }));
  }, [pets]);

  if (!pets || pets.length === 0) {
    return (
      <div className="mx-3 my-4 p-4 rounded-lg bg-[#111827] border border-[#1E293B] text-center">
        <p className="text-xs text-gray-400">No pets data. Import a v2 xlsx file to populate pets.</p>
      </div>
    );
  }

  return (
    <div className="pb-6">
      {groups.map(({ gen, pets: genPets }) => {
        const colors = GEN_COLORS[gen] || GEN_COLORS[1];
        const captured = genPets.filter(p => p.status === 'Captured').length;
        return (
          <div key={gen} className="mb-3">
            <div className="px-3 py-2 flex items-center gap-2 bg-[#0B1120]">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.border }} />
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: colors.label }}>
                Gen {gen} Pets
              </span>
              <span className="text-[10px] text-gray-500">
                ({captured}/{genPets.length} captured)
              </span>
            </div>
            <div className="flex flex-col">
              {genPets.map(pet => (
                <PetCard
                  key={pet.name}
                  pet={pet}
                  colors={colors}
                  onEdit={() => setEditingPet(pet)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {editingPet && (
        <PetEditModal
          pet={editingPet}
          onSave={(updated) => {
            onUpdatePet(updated);
            setEditingPet(null);
          }}
          onCancel={() => setEditingPet(null)}
        />
      )}
    </div>
  );
}

function PetCard({ pet, colors, onEdit }) {
  const [expanded, setExpanded] = useState(false);
  const isLocked = pet.status === 'Locked';
  const isCaptured = pet.status === 'Captured';

  return (
    <div
      className={`mx-3 my-1 rounded-lg border p-2.5 cursor-pointer transition-colors ${
        isLocked ? 'opacity-50 bg-[#111827]/60 border-[#1E293B]/50' : 'bg-[#111827] border-[#1E293B]'
      }`}
      style={{ borderLeftWidth: 3, borderLeftColor: colors.border }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-2">
        {/* Status icon */}
        <span className="text-sm">
          {isCaptured ? '🐾' : isLocked ? '🔒' : '🎯'}
        </span>

        {/* Name + basic info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-200">{pet.name}</span>
            <span className="text-[9px] text-gray-500">{pet.rarity}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {isCaptured && (
              <span className="text-[10px] text-gray-400">
                Lv{pet.level}{pet.advancement > 0 ? ` / Adv ${pet.advancement}` : ''}
              </span>
            )}
            <span className={`text-[9px] ${PRIORITY_COLORS[pet.priority] || 'text-gray-500'}`}>
              {pet.priority}
            </span>
          </div>
        </div>

        {/* Active skill badge */}
        <span className="text-[9px] text-gray-500 max-w-[80px] truncate hidden sm:block">
          {pet.activeSkill}
        </span>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-2.5 pt-2 border-t border-gray-700/50 flex flex-col gap-1.5">
          <div className="text-[10px] text-gray-300">
            <span className="text-gray-500">Skill:</span> {pet.activeSkill} — {pet.activeSkillEffect}
          </div>
          {pet.refinementFocus && (
            <div className="text-[10px] text-gray-300">
              <span className="text-gray-500">Refinement:</span> {pet.refinementFocus}
            </div>
          )}
          {pet.unlockRequirement && (
            <div className="text-[10px] text-gray-300">
              <span className="text-gray-500">Unlock:</span> {pet.unlockRequirement}
            </div>
          )}
          {pet.notes && (
            <div className="text-[10px] text-gray-400 italic">{pet.notes}</div>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="self-start mt-1 px-2.5 py-1 text-[10px] text-blue-400 hover:text-blue-300 border border-blue-400/30 rounded cursor-pointer"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}

function PetEditModal({ pet, onSave, onCancel }) {
  const [status, setStatus] = useState(pet.status);
  const [level, setLevel] = useState(pet.level);
  const [advancement, setAdvancement] = useState(pet.advancement);
  const [notes, setNotes] = useState(pet.notes);

  const handleSave = () => {
    onSave({
      ...pet,
      status,
      level: parseInt(level) || 0,
      advancement: parseInt(advancement) || 0,
      notes,
    });
  };

  const inputClass = "w-full bg-[#0F172A] border border-gray-600 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500";
  const selectClass = inputClass + " appearance-none";
  const labelClass = "text-[10px] text-gray-400 block mb-0.5";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-[60]">
      <div className="bg-[#1E293B] rounded-t-xl w-full max-w-lg max-h-[70vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 shrink-0">
          <button onClick={onCancel} className="text-xs text-gray-400 hover:text-white cursor-pointer">Cancel</button>
          <span className="text-xs font-bold text-white">{pet.name}</span>
          <button onClick={handleSave} className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer">Save</button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
          <div>
            <label className={labelClass}>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className={selectClass}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className={labelClass}>Level</label>
              <input
                type="number"
                min="0"
                max="50"
                value={level}
                onChange={e => setLevel(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex-1">
              <label className={labelClass}>Advancement</label>
              <input
                type="number"
                min="0"
                max="10"
                value={advancement}
                onChange={e => setAdvancement(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Notes</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className={inputClass}
              placeholder="Optional notes"
            />
          </div>

          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}
