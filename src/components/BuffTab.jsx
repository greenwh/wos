import { useState, useMemo } from 'react';
import { BUFF_CATEGORIES, TIER_META } from '../data/buffCategories';
import BuffItemEditor from './BuffItemEditor';
import PreEventChecklist from './PreEventChecklist';

const FILTERS = [
  { key: 'ready',   label: 'Ready' },
  { key: 'all',     label: 'All' },
  { key: 'blocked', label: 'Blocked' },
];

const STATUS_CYCLE = { todo: 'active', active: 'done', done: 'todo' };

export default function BuffTab({ buffStrategy, chiefName, onUpdate, onGoToRoadmap }) {
  const [filter, setFilter] = useState('ready');
  const [collapsedTiers, setCollapsedTiers] = useState({ 3: true });
  const [editing, setEditing] = useState(null); // null=closed, {}=add, item=edit
  const [hidePaid, setHidePaid] = useState(chiefName === 'Beav');

  const allItems = buffStrategy?.items || [];
  const preEvent = buffStrategy?.preEventChecklist || [];

  // Filter out spend-flagged items if hidden
  const items = useMemo(() => {
    if (!hidePaid) return allItems;
    return allItems.filter(i => !i.spendFlag);
  }, [allItems, hidePaid]);

  const hasSpendItems = allItems.some(i => i.spendFlag);

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

  // Progress (based on visible items)
  const doneCount = items.filter(i => i.status === 'done').length;
  const totalCount = items.length;
  const pct = totalCount > 0 ? doneCount / totalCount : 0;

  // Tier-colored progress segments
  const tierSegments = useMemo(() => {
    if (totalCount === 0) return [];
    return [1, 2, 3].map(t => {
      const tierItems = items.filter(i => i.priorityTier === t);
      const tierDone = tierItems.filter(i => i.status === 'done').length;
      return { tier: t, total: tierItems.length, done: tierDone, color: TIER_META[t]?.color || '#6B7280' };
    }).filter(s => s.total > 0);
  }, [items, totalCount]);

  const handleCycleStatus = (id) => {
    const updated = allItems.map(item => {
      if (item.id !== id) return item;
      if (item.status === 'blocked') return item;
      return { ...item, status: STATUS_CYCLE[item.status] };
    });
    onUpdate({ ...buffStrategy, items: updated });
  };

  const handleSaveItem = (saved) => {
    let updated;
    if (allItems.find(i => i.id === saved.id)) {
      updated = allItems.map(i => i.id === saved.id ? saved : i);
    } else {
      updated = [...allItems, saved];
    }
    onUpdate({ ...buffStrategy, items: updated });
    setEditing(null);
  };

  const handleDeleteItem = (id) => {
    onUpdate({ ...buffStrategy, items: allItems.filter(i => i.id !== id) });
    setEditing(null);
  };

  const handleReorder = (id, direction) => {
    const idx = allItems.findIndex(i => i.id === id);
    if (idx === -1) return;
    // Find next/prev item in the same tier
    const item = allItems[idx];
    const sameOrder = allItems
      .map((it, i) => ({ it, i }))
      .filter(({ it }) => it.priorityTier === item.priorityTier);
    const posInTier = sameOrder.findIndex(({ i }) => i === idx);
    const swapPos = posInTier + direction;
    if (swapPos < 0 || swapPos >= sameOrder.length) return;
    const swapIdx = sameOrder[swapPos].i;
    const updated = [...allItems];
    // Swap sortOrder values
    const tmpSort = updated[idx].sortOrder;
    updated[idx] = { ...updated[idx], sortOrder: updated[swapIdx].sortOrder };
    updated[swapIdx] = { ...updated[swapIdx], sortOrder: tmpSort };
    // Also swap positions in array
    [updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]];
    onUpdate({ ...buffStrategy, items: updated });
  };

  const handleTogglePreEvent = (id) => {
    const updated = preEvent.map(i => i.id === id ? { ...i, checked: !i.checked } : i);
    onUpdate({ ...buffStrategy, preEventChecklist: updated });
  };

  const handleResetTimed = () => {
    const updated = preEvent.map(i =>
      (i.category === 'timed' || i.category === 'event-specific') ? { ...i, checked: false } : i
    );
    onUpdate({ ...buffStrategy, preEventChecklist: updated });
  };

  const toggleTier = (tier) => {
    setCollapsedTiers(prev => ({ ...prev, [tier]: !prev[tier] }));
  };

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 140px)' }}>
      {/* Filter chips + hide paid toggle */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-[#0B1120]">
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
        {hasSpendItems && (
          <button
            onClick={() => setHidePaid(!hidePaid)}
            className="ml-auto text-[9px] text-gray-500 hover:text-gray-300 cursor-pointer whitespace-nowrap"
            title={hidePaid ? 'Show paid items' : 'Hide paid items'}
          >
            {hidePaid ? '👁️ Show 💰' : '👁️‍🗨️ Hide 💰'}
          </button>
        )}
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
      <div className="flex-1 overflow-y-auto px-3 pb-20">
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
                      {tierItems.map((item, i) => (
                        <BuffItemRow
                          key={item.id}
                          item={item}
                          isFirst={i === 0}
                          isLast={i === tierItems.length - 1}
                          onCycleStatus={handleCycleStatus}
                          onEdit={() => setEditing(item)}
                          onReorder={handleReorder}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pre-Event Checklist */}
        <PreEventChecklist
          items={preEvent}
          onToggle={handleTogglePreEvent}
          onResetTimed={handleResetTimed}
        />

        {/* Cross-link to Roadmap */}
        <button
          onClick={onGoToRoadmap}
          className="mt-4 mb-2 w-full text-left text-xs text-blue-400 hover:text-blue-300 cursor-pointer"
        >
          Hero goals (gear, skills, stars) → Roadmap tab
        </button>
      </div>

      {/* Floating add button */}
      <button
        onClick={() => setEditing({})}
        className="fixed bottom-12 right-4 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-500 cursor-pointer z-40 text-lg"
        style={{ maxWidth: 'calc(50% + 240px)', left: 'auto' }}
      >
        +
      </button>

      {/* Progress footer with tier-colored segments */}
      <div className="sticky bottom-0 px-3 py-2 bg-[#0B1120] border-t border-gray-800 flex items-center gap-2 z-30">
        <span className="text-[10px] text-gray-400 whitespace-nowrap">{doneCount}/{totalCount}</span>
        <div className="flex-1 h-1.5 rounded-full bg-[#1E293B] overflow-hidden flex">
          {tierSegments.map(seg => (
            <div
              key={seg.tier}
              className="h-full transition-all"
              style={{
                width: `${(seg.total / totalCount * 100).toFixed(1)}%`,
                backgroundColor: seg.done > 0 ? seg.color : 'transparent',
                opacity: seg.done / seg.total,
              }}
            />
          ))}
        </div>
        <span className="text-[10px] text-gray-400 whitespace-nowrap">{(pct * 100).toFixed(0)}%</span>
      </div>

      {/* Editor modal */}
      {editing !== null && (
        <BuffItemEditor
          item={editing.id ? editing : null}
          onSave={handleSaveItem}
          onDelete={handleDeleteItem}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function BuffItemRow({ item, isFirst, isLast, onCycleStatus, onEdit, onReorder }) {
  const [showActions, setShowActions] = useState(false);
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
          title={isBlocked ? 'Blocked — tap edit to change' : `Status: ${item.status}`}
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
            {/* Actions toggle */}
            <button
              onClick={() => setShowActions(!showActions)}
              className="shrink-0 text-gray-500 hover:text-gray-300 cursor-pointer px-1"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
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

          {/* Action buttons row */}
          {showActions && (
            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-700/50">
              <button
                onClick={() => onReorder(item.id, -1)}
                disabled={isFirst}
                className="px-2 py-1 text-[10px] text-gray-400 hover:text-white border border-gray-600 rounded cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ↑ Up
              </button>
              <button
                onClick={() => onReorder(item.id, 1)}
                disabled={isLast}
                className="px-2 py-1 text-[10px] text-gray-400 hover:text-white border border-gray-600 rounded cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ↓ Down
              </button>
              <button
                onClick={() => { setShowActions(false); onEdit(); }}
                className="px-2 py-1 text-[10px] text-blue-400 hover:text-blue-300 border border-blue-400/30 rounded cursor-pointer"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
