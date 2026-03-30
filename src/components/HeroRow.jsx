import { RARITY_COLORS, TROOP_COLORS, SLOT_LABELS } from '../lib/constants';
import GearSlot from './GearSlot';
import StarBar from './StarBar';
import HeroDetail from './HeroDetail';

function heroDisplayName(name) {
  if (name.length > 9) return name.split(" ").map(w => w[0]).join("");
  return name;
}

export default function HeroRow({ hero, index, expanded, startEditing, onToggle, onSave, onDelete }) {
  const r = RARITY_COLORS[hero.rarity] || RARITY_COLORS.Common;
  const troopColor = TROOP_COLORS[hero.troopType] || "#6B7280";

  return (
    <div>
      <div
        onClick={onToggle}
        className="flex items-center gap-2 cursor-pointer active:bg-[#1E293B] transition-colors"
        style={{
          padding: "8px 10px",
          background: index % 2 === 0 ? "#0F172A" : "#111827",
          borderLeft: `3px solid ${troopColor}`,
        }}
      >
        {/* Hero avatar frame */}
        <div
          className="flex flex-col items-center justify-center shrink-0"
          style={{
            width: 52,
            height: 52,
            borderRadius: 8,
            border: `2px solid ${r.border}`,
            background: `linear-gradient(135deg, ${r.bg}33, ${r.bg}66)`,
          }}
        >
          <span
            className="font-extrabold text-center leading-tight px-0.5"
            style={{
              fontSize: hero.name.length > 7 ? 9 : 11,
              color: r.border,
            }}
          >
            {heroDisplayName(hero.name)}
          </span>
          <span className="text-[8px] text-gray-400">Lv.{hero.level}</span>
        </div>

        {/* Info section */}
        <div className="shrink-0" style={{ width: 60, minWidth: 0 }}>
          <div className="text-[10px] font-semibold" style={{ color: troopColor }}>
            {hero.troopType}
          </div>
          <StarBar stars={hero.stars} slivers={hero.slivers} />
          {hero.priority && (
            <div className="text-[8px] text-gray-300 mt-0.5 truncate">
              #{hero.priority} {hero.role?.split(" ").slice(0, 2).join(" ")}
            </div>
          )}
        </div>

        {/* Gear grid */}
        <div className="flex gap-1 ml-auto">
          {hero.gear.map((g, i) => (
            <GearSlot key={i} gear={g} slotLabel={SLOT_LABELS[i]} />
          ))}
        </div>
      </div>

      {/* Expanded detail view */}
      {expanded && <HeroDetail hero={hero} onSave={onSave} onDelete={onDelete} startEditing={startEditing} />}
    </div>
  );
}
