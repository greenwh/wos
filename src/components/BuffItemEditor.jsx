import { useState } from 'react';
import { BUFF_CATEGORIES, TIER_META } from '../data/buffCategories';

const CATEGORY_KEYS = Object.keys(BUFF_CATEGORIES);
const STATUSES = ['todo', 'active', 'blocked', 'done'];

function generateId() {
  return 'bi-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
}

export default function BuffItemEditor({ item, onSave, onDelete, onCancel }) {
  const isEdit = !!item;
  const [label, setLabel] = useState(item?.label || '');
  const [category, setCategory] = useState(item?.category || 'research');
  const [priorityTier, setPriorityTier] = useState(item?.priorityTier || 1);
  const [status, setStatus] = useState(item?.status || 'todo');
  const [blockReason, setBlockReason] = useState(item?.blockReason || '');
  const [furnaceGate, setFurnaceGate] = useState(item?.furnaceGate ?? '');
  const [spendFlag, setSpendFlag] = useState(item?.spendFlag || false);
  const [notes, setNotes] = useState(item?.notes || '');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handleSave = () => {
    if (!label.trim()) return;
    onSave({
      id: item?.id || generateId(),
      label: label.trim(),
      category,
      priorityTier,
      status,
      blockReason: status === 'blocked' ? blockReason : '',
      sortOrder: item?.sortOrder ?? 999,
      furnaceGate: furnaceGate === '' || furnaceGate === null ? null : parseInt(furnaceGate) || null,
      spendFlag,
      notes,
    });
  };

  const inputClass = "w-full bg-[#0F172A] border border-gray-600 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500";
  const labelClass = "text-[10px] text-gray-400 block mb-0.5";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-[60]">
      <div className="bg-[#1E293B] rounded-t-xl w-full max-w-lg max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 shrink-0">
          <button onClick={onCancel} className="text-xs text-gray-400 hover:text-white cursor-pointer">Cancel</button>
          <span className="text-xs font-bold text-white">{isEdit ? 'Edit Item' : 'Add Item'}</span>
          <button onClick={handleSave} className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer">Save</button>
        </div>

        {/* Scrollable form */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
          {/* Label */}
          <div>
            <label className={labelClass}>Label</label>
            <input type="text" value={label} onChange={e => setLabel(e.target.value)} className={inputClass} placeholder="e.g. Level Cave Lion priority" autoFocus />
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className={inputClass + " appearance-none"}>
              {CATEGORY_KEYS.map(k => (
                <option key={k} value={k}>{BUFF_CATEGORIES[k].icon} {BUFF_CATEGORIES[k].label}</option>
              ))}
            </select>
          </div>

          {/* Priority Tier */}
          <div>
            <label className={labelClass}>Priority Tier</label>
            <div className="flex gap-2">
              {[1, 2, 3].map(t => (
                <button
                  key={t}
                  onClick={() => setPriorityTier(t)}
                  className={`flex-1 py-1.5 text-[10px] font-semibold rounded cursor-pointer border transition-colors ${
                    priorityTier === t
                      ? 'text-white'
                      : 'text-gray-400 border-gray-600 bg-transparent hover:text-gray-200'
                  }`}
                  style={priorityTier === t ? { backgroundColor: TIER_META[t].color, borderColor: TIER_META[t].color } : undefined}
                >
                  {TIER_META[t].label}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className={labelClass}>Status</label>
            <div className="flex gap-1.5">
              {STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex-1 py-1.5 text-[10px] font-semibold rounded cursor-pointer transition-colors ${
                    status === s
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#0F172A] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Block Reason (visible when blocked) */}
          {status === 'blocked' && (
            <div>
              <label className={labelClass}>Block Reason</label>
              <input type="text" value={blockReason} onChange={e => setBlockReason(e.target.value)} className={inputClass} placeholder="e.g. Need Furnace 22" />
            </div>
          )}

          {/* Furnace Gate + Spend Flag row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className={labelClass}>Furnace Gate</label>
              <input type="number" min="1" max="40" value={furnaceGate} onChange={e => setFurnaceGate(e.target.value)} className={inputClass} placeholder="None" />
            </div>
            <div className="flex-1">
              <label className={labelClass}>Requires Spending</label>
              <button
                onClick={() => setSpendFlag(!spendFlag)}
                className={`w-full py-1.5 text-[10px] font-semibold rounded cursor-pointer transition-colors ${
                  spendFlag ? 'bg-amber-600 text-white' : 'bg-[#0F172A] text-gray-400 border border-gray-600'
                }`}
              >
                {spendFlag ? '💰 Yes' : 'No'}
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className={inputClass + " h-16 resize-none"}
              placeholder="Tips, sources, context..."
            />
          </div>

          {/* Delete */}
          {isEdit && (
            <div className="pt-2 border-t border-gray-700">
              {confirmingDelete ? (
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-gray-400 flex-1">Delete this item?</span>
                  <button onClick={() => setConfirmingDelete(false)} className="px-3 py-1.5 text-xs text-gray-400 hover:text-white cursor-pointer">No</button>
                  <button onClick={() => onDelete(item.id)} className="px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-500 cursor-pointer">Delete</button>
                </div>
              ) : (
                <button onClick={() => setConfirmingDelete(true)} className="text-xs text-red-400 hover:text-red-300 cursor-pointer">Delete Item</button>
              )}
            </div>
          )}

          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}
