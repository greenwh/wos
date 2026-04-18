import { useState, useMemo, useEffect } from 'react';
import { TROOP_RATIOS, ROLE_LABELS, ROLE_ORDER, getActivityByCode } from '../data/troopRatiosSeed';
import { TROOP_COLORS } from '../lib/constants';

const GEN_KEY = 'wos:ratios:gen';
const REASONING_PREVIEW = 60;

export default function RatiosView() {
  const [code, setCode] = useState('DEF');
  const [gen, setGen] = useState(() => {
    try {
      const saved = localStorage.getItem(GEN_KEY);
      return saved === 'gen8+' ? 'gen8+' : 'early';
    } catch {
      return 'early';
    }
  });

  useEffect(() => {
    try { localStorage.setItem(GEN_KEY, gen); } catch {}
  }, [gen]);

  const activity = getActivityByCode(code);
  const hasGenVariants = !!activity?.roles.some(r => r.gen);

  const orderedRoles = useMemo(() => {
    if (!activity) return [];
    const pool = hasGenVariants
      ? activity.roles.filter(r => !r.gen || r.gen === gen)
      : activity.roles;
    return ROLE_ORDER
      .map(role => pool.find(x => x.role === role))
      .filter(Boolean);
  }, [activity, hasGenVariants, gen]);

  return (
    <div className="pb-6">
      <div className="sticky top-0 z-10 bg-[#0B1120]">
        <ActivityPillGrid selected={code} onSelect={setCode} />
      </div>

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

      {hasGenVariants && (
        <div className="mx-3 mb-3">
          <GenToggle value={gen} onChange={setGen} />
        </div>
      )}

      <div className="mx-3 space-y-2">
        {orderedRoles.map(r => (
          <RoleCard key={`${r.role}:${r.gen ?? 'x'}`} row={r} />
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

function GenToggle({ value, onChange }) {
  const options = [
    { key: 'early',  label: 'Gen 1–7' },
    { key: 'gen8+',  label: 'Gen 8+' },
  ];
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
        Server gen
      </span>
      <div className="flex gap-1">
        {options.map(o => {
          const active = o.key === value;
          return (
            <button
              key={o.key}
              onClick={() => onChange(o.key)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors cursor-pointer ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#111827] text-gray-400 hover:text-gray-200'
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RoleCard({ row }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const text = `${row.infantry}/${row.lancer}/${row.marksman}`;
  const reasoningIsLong = row.reasoning.length > REASONING_PREVIEW;
  const visibleReasoning =
    expanded || !reasoningIsLong
      ? row.reasoning
      : row.reasoning.slice(0, REASONING_PREVIEW).trimEnd() + '…';

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // noop: clipboard blocked
    }
  };

  const toggleExpand = () => {
    if (reasoningIsLong) setExpanded(v => !v);
  };

  return (
    <div
      onClick={toggleExpand}
      className={`rounded-lg bg-[#111827] border border-[#1E293B] p-3 ${
        reasoningIsLong ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-baseline justify-between mb-2">
        <div className="text-xs font-semibold text-white">
          {ROLE_LABELS[row.role]}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 font-mono">{row.role}</span>
          <button
            onClick={handleCopy}
            title={`Copy ${text}`}
            className="text-gray-500 hover:text-white text-[11px] px-1.5 py-0.5 rounded bg-[#0F172A] border border-[#1E293B] cursor-pointer"
          >
            {copied ? '✓' : '⧉'}
          </button>
        </div>
      </div>

      <RatioBar
        infantry={row.infantry}
        lancer={row.lancer}
        marksman={row.marksman}
      />

      <div className="flex gap-4 mt-2 mb-2">
        <RatioNumber label="I" value={row.infantry} color={TROOP_COLORS.Infantry} />
        <RatioNumber label="L" value={row.lancer} color={TROOP_COLORS.Lancer} />
        <RatioNumber label="M" value={row.marksman} color={TROOP_COLORS.Marksman} />
      </div>

      <div className="text-[11px] text-gray-400 leading-snug">
        {visibleReasoning}
        {reasoningIsLong && (
          <span className="ml-1 text-blue-400 text-[10px] font-semibold">
            {expanded ? 'less' : 'more'}
          </span>
        )}
      </div>

      {row.genNote && (
        <div className="mt-1.5 text-[11px] italic text-amber-300/90 leading-snug">
          ⚠️ {row.genNote}
        </div>
      )}
    </div>
  );
}

function RatioBar({ infantry, lancer, marksman }) {
  const segments = [
    { pct: infantry, color: TROOP_COLORS.Infantry, label: 'I' },
    { pct: lancer,   color: TROOP_COLORS.Lancer,   label: 'L' },
    { pct: marksman, color: TROOP_COLORS.Marksman, label: 'M' },
  ].filter(s => s.pct > 0);

  return (
    <div className="flex w-full h-4 rounded overflow-hidden bg-[#0F172A]">
      {segments.map((s, i) => (
        <div
          key={i}
          style={{
            width: `${s.pct}%`,
            minWidth: '2px',
            backgroundColor: s.color,
          }}
          className="flex items-center justify-center text-[9px] font-bold text-black/70"
        >
          {s.pct >= 15 ? s.pct : ''}
        </div>
      ))}
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
