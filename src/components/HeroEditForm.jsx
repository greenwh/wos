import { useState } from 'react';
import { SLOT_LABELS } from '../lib/constants';

const TROOP_OPTIONS = ['Infantry', 'Lancer', 'Marksman'];
const RARITY_OPTIONS = ['Mythic', 'Epic', 'Rare', 'Common'];
const GEAR_RARITY_OPTIONS = ['Mythic', 'Epic', 'Rare', 'Common', 'Empty'];

const inputClass = "w-full bg-[#0F172A] border border-gray-600 rounded px-2 py-1.5 text-sm text-white outline-none focus:border-blue-500";
const selectClass = "w-full bg-[#0F172A] border border-gray-600 rounded px-2 py-1.5 text-sm text-white outline-none focus:border-blue-500 appearance-auto";
const labelClass = "text-[10px] text-gray-400 block mb-0.5";
const sectionHeader = "text-[10px] font-semibold text-gray-400 uppercase mb-2 mt-3";

function clamp(val, min, max) {
  if (val === '' || val == null) return null;
  const n = parseInt(val);
  if (isNaN(n)) return null;
  return Math.max(min, Math.min(max, n));
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export default function HeroEditForm({ hero, onSave, onCancel, onDelete }) {
  const [form, setForm] = useState(() => deepClone(hero));
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const setGear = (slotIdx, field, value) => {
    setForm(prev => {
      const gear = [...prev.gear];
      gear[slotIdx] = { ...gear[slotIdx], [field]: value };
      // Clear enhancement/MF/notes when set to Empty
      if (field === 'rarity' && value === 'Empty') {
        gear[slotIdx].enhancement = null;
        gear[slotIdx].masterForgery = null;
        gear[slotIdx].notes = '';
      }
      return { ...prev, gear };
    });
  };

  const setSkill = (category, idx, field, value) => {
    setForm(prev => {
      const skills = { ...prev.skills };
      skills[category] = [...skills[category]];
      skills[category][idx] = { ...skills[category][idx], [field]: value };
      return { ...prev, skills };
    });
  };

  const addSkill = (category) => {
    setForm(prev => {
      const skills = { ...prev.skills };
      skills[category] = [...skills[category], { name: '', level: 1 }];
      return { ...prev, skills };
    });
  };

  const removeSkill = (category, idx) => {
    setForm(prev => {
      const skills = { ...prev.skills };
      skills[category] = skills[category].filter((_, i) => i !== idx);
      return { ...prev, skills };
    });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (form.level < 1 || form.level > 99) errs.level = '1-99';
    if (form.stars < 0 || form.stars > 5) errs.stars = '0-5';
    if (form.slivers < 0 || form.slivers > 5) errs.slivers = '0-5';
    if (form.priority != null && (form.priority < 1 || form.priority > 6)) errs.priority = '1-6 or blank';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(form);
  };

  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="px-4 py-3 bg-[#111827] border-t border-gray-800">
      {/* Hero Info */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        <div className="col-span-2">
          <label className={labelClass}>Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            className={`${inputClass} ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <span className="text-[10px] text-red-400">{errors.name}</span>}
        </div>
        <div>
          <label className={labelClass}>Troop Type</label>
          <select value={form.troopType} onChange={e => set('troopType', e.target.value)} className={selectClass}>
            {TROOP_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Rarity</label>
          <select value={form.rarity} onChange={e => set('rarity', e.target.value)} className={selectClass}>
            {RARITY_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Level</label>
          <input
            type="number"
            inputMode="numeric"
            value={form.level}
            onChange={e => set('level', clamp(e.target.value, 1, 99) ?? 1)}
            className={`${inputClass} ${errors.level ? 'border-red-500' : ''}`}
          />
        </div>
        <div>
          <label className={labelClass}>Priority (1-6 or blank)</label>
          <input
            type="number"
            inputMode="numeric"
            value={form.priority ?? ''}
            onChange={e => set('priority', e.target.value === '' ? null : clamp(e.target.value, 1, 6))}
            className={`${inputClass} ${errors.priority ? 'border-red-500' : ''}`}
            placeholder="Blank = bench"
          />
          {errors.priority && <span className="text-[10px] text-red-400">{errors.priority}</span>}
        </div>
        <div>
          <label className={labelClass}>Stars (0-5)</label>
          <select
            value={form.stars}
            onChange={e => set('stars', parseInt(e.target.value))}
            className={selectClass}
          >
            {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Slivers (0-5 of 6)</label>
          <select
            value={form.slivers}
            onChange={e => set('slivers', parseInt(e.target.value))}
            className={selectClass}
          >
            {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Weapon Name</label>
          <input
            type="text"
            value={form.weaponName}
            onChange={e => set('weaponName', e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Role</label>
          <input
            type="text"
            value={form.role}
            onChange={e => set('role', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Gear */}
      <div className={sectionHeader}>Gear</div>
      {form.gear.map((g, i) => (
        <div key={i} className="mb-2 p-2 bg-[#0F172A] rounded">
          <div className="text-[10px] font-semibold text-gray-300 mb-1">{SLOT_LABELS[i]}</div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className={labelClass}>Rarity</label>
              <select
                value={g.rarity}
                onChange={e => setGear(i, 'rarity', e.target.value)}
                className={selectClass}
              >
                {GEAR_RARITY_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Enhance</label>
              <input
                type="number"
                inputMode="numeric"
                value={g.enhancement ?? ''}
                onChange={e => setGear(i, 'enhancement', e.target.value === '' ? null : clamp(e.target.value, 0, 99))}
                className={inputClass}
                disabled={g.rarity === 'Empty'}
              />
            </div>
            <div>
              <label className={labelClass}>MF (1-5)</label>
              <select
                value={g.masterForgery ?? ''}
                onChange={e => setGear(i, 'masterForgery', e.target.value === '' ? null : parseInt(e.target.value))}
                className={selectClass}
                disabled={g.rarity === 'Empty'}
              >
                <option value="">—</option>
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
        </div>
      ))}

      {/* Skills */}
      {['exploration', 'expedition'].map(cat => (
        <div key={cat}>
          <div className={sectionHeader}>{cat} Skills</div>
          {(form.skills?.[cat] || []).map((s, i) => (
            <div key={i} className="flex items-end gap-2 mb-2">
              <div className="flex-1">
                <label className={labelClass}>Name</label>
                <input
                  type="text"
                  value={s.name}
                  onChange={e => setSkill(cat, i, 'name', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="w-16">
                <label className={labelClass}>Lv</label>
                <select
                  value={s.level}
                  onChange={e => setSkill(cat, i, 'level', parseInt(e.target.value))}
                  className={selectClass}
                >
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <button
                onClick={() => removeSkill(cat, i)}
                className="text-red-400 hover:text-red-300 text-xs pb-1.5 cursor-pointer"
                title="Remove skill"
              >
                ✕
              </button>
            </div>
          ))}
          {(form.skills?.[cat] || []).length < 3 && (
            <button
              onClick={() => addSkill(cat)}
              className="text-[10px] text-blue-400 hover:text-blue-300 cursor-pointer"
            >
              + Add skill
            </button>
          )}
        </div>
      ))}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-700">
        <button
          onClick={handleSave}
          className="px-4 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-500 cursor-pointer font-medium"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-xs text-gray-400 hover:text-white cursor-pointer"
        >
          Cancel
        </button>
        <div className="ml-auto">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="px-3 py-2 text-xs text-red-400 hover:text-red-300 cursor-pointer"
            >
              Delete
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-red-400">Delete {form.name}?</span>
              <button
                onClick={() => onDelete(hero.name)}
                className="px-2 py-1 text-[10px] bg-red-600 text-white rounded cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-2 py-1 text-[10px] text-gray-400 cursor-pointer"
              >
                No
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
