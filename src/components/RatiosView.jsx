import { useState } from 'react';
import { TROOP_RATIOS, ROLE_LABELS, ROLE_ORDER, getActivityByCode } from '../data/troopRatiosSeed';
import { TROOP_COLORS } from '../lib/constants';

export default function RatiosView() {
  const [code, setCode] = useState('DEF');
  const activity = getActivityByCode(code);

  const orderedRoles = activity
    ? ROLE_ORDER
        .map(r => activity.roles.find(x => x.role === r))
        .filter(Boolean)
    : [];

  return (
    <div className="pb-6">
      <ActivityPillGrid selected={code} onSelect={setCode} />

      {activity && (
        <div className="mx-3 mt-2 mb-3">
          <div className="text-sm font-semibold text-white">
            <span className="text-blue-400">{activity.code}</span>
            <span className="text-gray-500"> — </span>
            {activity.name}
          </div>
          {activity.blurb && (
            <div className="text-[11px] text-gray-400 mt-0.5">{activity.blurb}</div>
          )}
        </div>
      )}

      <div className="mx-3 space-y-2">
        {orderedRoles.map(r => (
          <RoleCard key={r.role} row={r} />
        ))}
      </div>
    </div>
  );
}

function ActivityPillGrid({ selected, onSelect }) {
  return (
    <div className="px-3 py-2">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
        Activity
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {TROOP_RATIOS.map(a => {
          const active = a.code === selected;
          return (
            <button
              key={a.code}
              onClick={() => onSelect(a.code)}
              title={a.name}
              className={`py-2 text-xs font-bold rounded transition-colors cursor-pointer ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#111827] text-gray-300 hover:text-white'
              }`}
            >
              {a.code}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RoleCard({ row }) {
  return (
    <div className="rounded-lg bg-[#111827] border border-[#1E293B] p-3">
      <div className="flex items-baseline justify-between mb-2">
        <div className="text-xs font-semibold text-white">
          {ROLE_LABELS[row.role]}
        </div>
        <div className="text-[10px] text-gray-500 font-mono">{row.role}</div>
      </div>

      <div className="flex gap-4 mb-2">
        <RatioNumber label="I" value={row.infantry} color={TROOP_COLORS.Infantry} />
        <RatioNumber label="L" value={row.lancer} color={TROOP_COLORS.Lancer} />
        <RatioNumber label="M" value={row.marksman} color={TROOP_COLORS.Marksman} />
      </div>

      <div className="text-[11px] text-gray-400 leading-snug">
        {row.reasoning}
      </div>

      {row.genNote && (
        <div className="mt-1.5 text-[11px] italic text-amber-300/90 leading-snug">
          ⚠️ {row.genNote}
        </div>
      )}
    </div>
  );
}

function RatioNumber({ label, value, color }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-[10px] font-bold" style={{ color }}>{label}</span>
      <span className="text-sm font-semibold text-white tabular-nums">{value}</span>
    </div>
  );
}
