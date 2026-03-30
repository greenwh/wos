import { useState } from 'react';
import { RARITY_COLORS, TROOP_COLORS } from '../lib/constants';
import HeroEditForm from './HeroEditForm';

function SkillList({ title, skills }) {
  if (!skills || skills.length === 0) return null;
  return (
    <div>
      <div className="text-[10px] font-semibold text-gray-400 uppercase mb-1">{title}</div>
      {skills.map((s, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <span className="text-xs text-gray-200 flex-1">{s.name}</span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(lv => (
              <div
                key={lv}
                className="w-3 h-3 rounded-sm"
                style={{
                  background: lv <= s.level ? '#FBBF24' : '#374151',
                  border: `1px solid ${lv <= s.level ? '#F59E0B' : '#4B5563'}`,
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function GearDetail({ gear }) {
  const r = RARITY_COLORS[gear.rarity] || RARITY_COLORS.Empty;
  const isEmpty = gear.rarity === 'Empty';
  return (
    <div className="flex items-center gap-2 py-1">
      <div
        className="w-8 h-8 rounded flex items-center justify-center shrink-0 text-[10px] font-bold"
        style={{
          border: `2px solid ${r.border}`,
          background: isEmpty ? '#111827' : `linear-gradient(135deg, ${r.bg}22, ${r.bg}44)`,
          color: r.border,
        }}
      >
        {isEmpty ? '—' : r.label}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-200">{gear.slot}</div>
        <div className="text-[10px] text-gray-400">
          {isEmpty ? 'Empty' : (
            <>
              {gear.rarity}
              {gear.enhancement != null && <span> +{gear.enhancement}</span>}
              {gear.masterForgery != null && (
                <span className="ml-1 text-amber-300">MF {gear.masterForgery}</span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HeroDetail({ hero, onSave, onDelete, startEditing = false }) {
  const [editing, setEditing] = useState(startEditing);
  const r = RARITY_COLORS[hero.rarity] || RARITY_COLORS.Common;
  const troopColor = TROOP_COLORS[hero.troopType] || '#6B7280';

  if (editing) {
    return (
      <HeroEditForm
        hero={hero}
        onSave={(updated) => {
          onSave(hero.name, updated);
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
        onDelete={(name) => {
          onDelete(name);
          setEditing(false);
        }}
      />
    );
  }

  return (
    <div className="px-4 py-3 bg-[#111827] border-t border-gray-800">
      {/* Edit button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setEditing(true)}
          className="px-3 py-1 text-[10px] text-blue-400 hover:text-blue-300 border border-blue-400/30 rounded cursor-pointer"
        >
          ✏️ Edit
        </button>
      </div>

      {/* Hero stats */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3 text-xs">
        <div>
          <span className="text-gray-500">Troop: </span>
          <span style={{ color: troopColor }}>{hero.troopType}</span>
        </div>
        <div>
          <span className="text-gray-500">Rarity: </span>
          <span style={{ color: r.border }}>{hero.rarity}</span>
        </div>
        <div>
          <span className="text-gray-500">Level: </span>
          <span className="text-gray-200">{hero.level}</span>
        </div>
        <div>
          <span className="text-gray-500">Stars: </span>
          <span className="text-gray-200">
            {hero.stars}{hero.slivers > 0 && ` (${hero.slivers}/6)`}
          </span>
        </div>
        {hero.weaponName && (
          <div className="col-span-2">
            <span className="text-gray-500">Weapon: </span>
            <span className="text-gray-200">{hero.weaponName}</span>
            {hero.weaponRarity && (
              <span className="text-gray-400 text-[10px]"> ({hero.weaponRarity})</span>
            )}
          </div>
        )}
        {hero.role && (
          <div className="col-span-2">
            <span className="text-gray-500">Role: </span>
            <span className="text-gray-200">{hero.role}</span>
          </div>
        )}
      </div>

      {/* Gear */}
      <div className="mb-3">
        <div className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Gear</div>
        <div className="grid grid-cols-2 gap-x-3">
          {hero.gear.map((g, i) => (
            <GearDetail key={i} gear={g} />
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="grid grid-cols-2 gap-4">
        <SkillList title="Exploration" skills={hero.skills?.exploration} />
        <SkillList title="Expedition" skills={hero.skills?.expedition} />
      </div>
    </div>
  );
}
