import { useState } from 'react';

const SECTION_ORDER = ['permanent', 'timed', 'event-specific'];
const SECTION_LABELS = {
  'permanent': 'Permanent (verify once)',
  'timed': 'Activate Before Event',
  'event-specific': 'Event-Specific',
};

export default function PreEventChecklist({ items, onToggle, onResetTimed }) {
  const [open, setOpen] = useState(false);

  if (!items || items.length === 0) return null;

  const sections = SECTION_ORDER
    .map(cat => ({ cat, label: SECTION_LABELS[cat], items: items.filter(i => i.category === cat) }))
    .filter(s => s.items.length > 0);

  const checkedCount = items.filter(i => i.checked).length;

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full text-left cursor-pointer"
      >
        <span className="text-[10px]">{open ? '▼' : '▶'}</span>
        <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
          Pre-Event Checklist
        </span>
        <span className="text-[10px] text-gray-500">({checkedCount}/{items.length})</span>
      </button>

      {open && (
        <div className="mt-2 rounded-lg border border-[#1E293B] bg-[#111827] p-3">
          {sections.map(section => (
            <div key={section.cat} className="mb-3 last:mb-0">
              <div className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {section.label}
              </div>
              <div className="flex flex-col gap-1">
                {section.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => onToggle(item.id)}
                    className="flex items-start gap-2 text-left cursor-pointer w-full"
                  >
                    <span className={`mt-0.5 shrink-0 w-3.5 h-3.5 rounded border flex items-center justify-center ${
                      item.checked
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-600 bg-transparent'
                    }`}>
                      {item.checked && (
                        <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span className={`text-[11px] ${item.checked ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Reset button */}
          <button
            onClick={onResetTimed}
            className="mt-2 px-3 py-1.5 text-[10px] text-amber-400 hover:text-amber-300 border border-amber-400/30 rounded cursor-pointer"
          >
            Reset All Timed Items
          </button>
        </div>
      )}
    </div>
  );
}
