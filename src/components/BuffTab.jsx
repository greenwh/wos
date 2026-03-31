import { useState, useMemo } from 'react';
import { BUFF_CATEGORIES, TIER_META } from '../data/buffCategories';

const FILTERS = [
  { key: 'ready',   label: 'Ready' },
  { key: 'all',     label: 'All' },
  { key: 'blocked', label: 'Blocked' },
];

const STATUS_CYCLE = { todo: 'active', active: 'done', done: 'todo' };

export default function BuffTab({ buffStrategy, onUpdate, onGoToRoadmap }) {
  const [filter, setFilter] = useState('ready');
  const [collapsedTiers, setCollapsedTiers] = useState({ 3: true });

  const items = buffStrategy?.items || [];

  const filtered = useMemo(() => {
    if (filter === 'ready') return items.filter(i => i.status === 'todo' || i.status === 'active');
    if (filter === 'blocked') return items.filter(i => i.status === 'blocked');
    // 'all': show everything, done items sorted to bottom within each tier
    return [...items].sort((a, b) => {
      if (a.priorityTier !== b.priorityTier) return a.priorityTier - b.priorityTier;
      if (a.status === 'done' && b.status !== 'done') return 1;
      if (a.status !== 'done' && b.status === 'done') return -1;
      return a.sortOrder - b.sortOrder;
    });
  }, [items, filter]);

  // Group by tier
  const tiers = useMemo(() => {
    const map = new Map();
    for (const item of filtered) {
      if (!map.has(item.priorityTier)) map.set(item.priorityTier, []);
      map.get(item.priorityTier).push(item);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [filtered]);

  // What's Next banner
  const whatsNext = useMemo(() => {
    const active = items.find(i => i.status === 'active');
    const todo = items.find(i => i.status === 'todo');
    return [active, todo].filter(Boolean).slice(0, 2);
  }, [items]);

  // Progress
  const doneCount = items.filter(i => i.status === 'done').length;
  const totalCount = items.length;
  const pct = totalCount > 0 ? doneCount / totalCount : 0;

  const handleCycleStatus = (id) => {
    const updated = items.map(item => {
      if (item.id !== id) return item;
      if (item.status === 'blocked') return item; // blocked only via edit
      return { ...item, status: STATUS_CYCLE[item.status] };
    });
    onUpdate({ ...buffStrategy, items: updated });
  };

  const toggleTier = (tier) => {
    setCollapsedTiers(prev => ({ ...prev, [tier]: !prev[tier] }));
  };

  return (
    <div className="flex flex-col min-h-0">
      {/* Filter chips */}
      <div className="flex gap-1.5 px-3 py-2 bg-[#0B1120]">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1 text-[10px] font-semibold rounded-full cursor-pointer transition-colors ${
              filter === f.key
                ? 'bg-blue-600 text-white'
                : 'bg-[#1E293B] text-gray-400 hover:text-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* What's Next banner */}
      {whatsNext.length > 0 && filter !== 'blocked' && (
        <div className="mx-3 mt-1 mb-2 p-2.5 rounded-lg bg-[#111827] border border-[#1E293B]">
          <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Next up</div>
          <div className="flex flex-col gap-0.5">
            {whatsNext.map(item => (
              <div key={item.id} className="text-xs text-gray-200">
                {item.label}
                <span className="text-[9px] text-gray-500 ml-1.5">
                  ({item.status})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tier sections */}
      <div className="flex-1 overflow-y-auto px-3 pb-16">
        {tiers.length === 0 ? (
          <p className="text-xs text-gray-400 text-center mt-6">
            {filter === 'blocked' ? 'No blocked items.' : 'No items to show.'}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {tiers.map(([tier, tierItems]) => {
              const meta = TIER_META[tier] || TIER_META[1];
              const collapsed = collapsedTiers[tier];
              const doneTier = tierItems.filter(i => i.status === 'done').length;
              return (
                <div key={tier}>
                  {/* Tier header */}
                  <button
                    onClick={() => toggleTier(tier)}
                    className="flex items-center gap-2 mb-1.5 cursor-pointer w-full text-left"
                  >
                    <span className="text-[10px]">{collapsed ? '▶' : '▼'}</span>
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: meta.color }} />
                    <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: meta.color }}>
                      {meta.label}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      ({doneTier}/{tierItems.length})
                    </span>
                  </button>

                  {!collapsed && (
                    <div className="flex flex-col gap-1">
                      {tierItems.map(item => (
                        <BuffItemRow key={item.id} item={item} onCycleStatus={handleCycleStatus} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Cross-link to Roadmap */}
        <button
          onClick={onGoToRoadmap}
          className="mt-4 mb-2 w-full text-left text-xs text-blue-400 hover:text-blue-300 cursor-pointer"
        >
          Hero goals (gear, skills, stars) → Roadmap tab
        </button>
      </div>

      {/* Progress footer */}
      <div className="sticky bottom-0 px-3 py-2 bg-[#0B1120] border-t border-gray-800 flex items-center gap-2">
        <span className="text-[10px] text-gray-400 whitespace-nowrap">{doneCount}/{totalCount}</span>
        <div className="flex-1 h-1.5 rounded-full bg-[#1E293B] overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{ width: `${(pct * 100).toFixed(0)}%` }}
          />
        </div>
        <span className="text-[10px] text-gray-400 whitespace-nowrap">{(pct * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
}

function BuffItemRow({ item, onCycleStatus }) {
  const cat = BUFF_CATEGORIES[item.category] || { icon: '?', label: item.category, color: '#6B7280' };
  const isDone = item.status === 'done';
  const isBlocked = item.status === 'blocked';
  const isActive = item.status === 'active';

  return (
    <div
      className={`rounded-lg border p-2.5 ${
        isDone ? 'bg-[#111827]/50 border-[#1E293B]/50 opacity-50' : 'bg-[#111827] border-[#1E293B]'
      }`}
    >
      <div className="flex items-start gap-2">
        {/* Status button */}
        <button
          onClick={() => onCycleStatus(item.id)}
          className="mt-0.5 shrink-0 w-4 h-4 rounded border flex items-center justify-center cursor-pointer"
          style={{
            borderColor: isDone ? '#22C55E' : isActive ? '#F59E0B' : isBlocked ? '#6B7280' : '#4B5563',
            backgroundColor: isDone ? '#22C55E' : isActive ? '#F59E0B' : 'transparent',
          }}
          title={isBlocked ? 'Blocked — edit to unblock' : `Status: ${item.status}`}
        >
          {isDone && (
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
          {isActive && (
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          )}
          {isBlocked && (
            <span className="text-[8px] text-gray-400">||</span>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px]">{cat.icon}</span>
            <span className={`text-xs flex-1 ${isDone ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
              {item.label}
            </span>
            {item.spendFlag && <span className="text-[9px]" title="Requires spending">💰</span>}
          </div>

          {/* Category + status line */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[9px] px-1 py-0.5 rounded" style={{ backgroundColor: cat.color + '20', color: cat.color }}>
              {cat.label}
            </span>
            <span className={`text-[9px] ${
              isActive ? 'text-amber-400' : isBlocked ? 'text-gray-500' : isDone ? 'text-green-400' : 'text-gray-500'
            }`}>
              {item.status}
            </span>
          </div>

          {/* Block reason */}
          {isBlocked && item.blockReason && (
            <div className="text-[9px] text-gray-500 mt-1">
              ⏳ {item.blockReason}
            </div>
          )}

          {/* Notes (truncated) */}
          {item.notes && !isDone && (
            <div className="text-[9px] text-gray-500 mt-0.5 truncate">{item.notes}</div>
          )}
        </div>
      </div>
    </div>
  );
}
