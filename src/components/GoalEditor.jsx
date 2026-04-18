import { useState, useMemo } from 'react';
import { PHASE_COLORS } from '../lib/roadmap';

const GOAL_TYPES = [
  { value: 'gear_enhancement', label: 'Gear Enhancement' },
  { value: 'gear_mf', label: 'Gear Master Forgery' },
  { value: 'gear_acquire', label: 'Gear Acquire' },
  { value: 'skill_level', label: 'Skill Level' },
  { value: 'star_ascension', label: 'Star Ascension' },
  { value: 'shard_accumulate', label: 'Shard Accumulate' },
  { value: 'weapon_upgrade', label: 'Weapon Upgrade' },
  { value: 'chief_gear', label: 'Chief Gear' },
  { value: 'pet_capture', label: 'Pet Capture' },
  { value: 'pet_level', label: 'Pet Level' },
  { value: 'pet_refine', label: 'Pet Refine' },
  { value: 'hoard', label: 'Hoard' },
  { value: 'general', label: 'General' },
];

const MANUAL_ONLY_TYPES = ['gear_acquire', 'shard_accumulate', 'weapon_upgrade', 'chief_gear', 'general'];
const GEAR_SLOTS = ['Goggles', 'Gloves', 'Belt', 'Boots'];

function generateId() {
  return 'g-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
}

function autoDescription(goalType, target, heroName) {
  const hero = heroName || '???';
  switch (goalType) {
    case 'gear_enhancement':
      return `${hero} ${target.gearSlot || '???'} → +${target.targetEnhancement || '?'}`;
    case 'gear_mf':
      return `${hero} ${target.gearSlot || '???'} MF → MF${target.targetMF || '?'}`;
    case 'gear_acquire':
      return `Acquire ${target.targetRarity || '???'} ${target.gearSlot || '???'} for ${hero}`;
    case 'skill_level':
      return `${hero} ${target.skillName || '???'} → Lv${target.targetLevel || '?'}`;
    case 'star_ascension':
      return `${hero} → ${target.targetStars || '?'}★`;
    default:
      return '';
  }
}

export default function GoalEditor({ goal, heroes, onSave, onCancel }) {
  const isEdit = !!goal;
  const heroNames = useMemo(() => (heroes || []).map(h => h.name).sort(), [heroes]);

  const [heroName, setHeroName] = useState(goal?.heroName || '');
  const [goalType, setGoalType] = useState(goal?.goalType || 'gear_enhancement');
  const [description, setDescription] = useState(goal?.description || '');
  const [phase, setPhase] = useState(goal?.phase || 1);
  const [phaseLabel, setPhaseLabel] = useState(goal?.phaseLabel || 'Immediate');
  const [modeImpact, setModeImpact] = useState(goal?.modeImpact || '');
  const [notes, setNotes] = useState(goal?.notes || '');

  // Target fields
  const [gearSlot, setGearSlot] = useState(goal?.target?.gearSlot || 'Goggles');
  const [targetEnhancement, setTargetEnhancement] = useState(goal?.target?.targetEnhancement || '');
  const [targetMF, setTargetMF] = useState(goal?.target?.targetMF || '');
  const [targetRarity, setTargetRarity] = useState(goal?.target?.targetRarity || 'Mythic');
  const [skillName, setSkillName] = useState(goal?.target?.skillName || '');
  const [skillCategory, setSkillCategory] = useState(goal?.target?.skillCategory || 'exploration');
  const [targetLevel, setTargetLevel] = useState(goal?.target?.targetLevel || '');
  const [targetStars, setTargetStars] = useState(goal?.target?.targetStars || '');

  const [autoDesc, setAutoDesc] = useState(!isEdit);

  const PHASE_LABELS = { 1: 'Immediate – Deploy Hoard', 2: 'Pet Gen 1 – Development Foundation', 3: 'Chief Gear – Furnace 22 Path', 4: 'Lv5 Pushes', 5: 'Skill & Gear Gap Fills', 6: 'Alonzo Transition (Deferred)', 7: 'Bench – No Investment', 8: 'Long-Term – Mia Prep' };

  const handlePhaseChange = (val) => {
    const p = parseInt(val) || 1;
    setPhase(p);
    setPhaseLabel(PHASE_LABELS[p] || phaseLabel);
  };

  // Auto-generate description when fields change
  const currentTarget = { gearSlot, targetEnhancement: parseInt(targetEnhancement) || 0, targetMF: parseInt(targetMF) || 0, targetRarity, skillName, skillCategory, targetLevel: parseInt(targetLevel) || 0, targetStars: parseInt(targetStars) || 0 };
  const generated = autoDescription(goalType, currentTarget, heroName);

  const effectiveDesc = autoDesc && generated ? generated : description;

  const handleSave = () => {
    const target = {};
    if (['gear_enhancement', 'gear_mf', 'gear_acquire'].includes(goalType)) {
      target.gearSlot = gearSlot;
    }
    if (goalType === 'gear_enhancement') target.targetEnhancement = parseInt(targetEnhancement) || 0;
    if (goalType === 'gear_mf') target.targetMF = parseInt(targetMF) || 0;
    if (goalType === 'gear_acquire') target.targetRarity = targetRarity;
    if (goalType === 'skill_level') {
      target.skillName = skillName;
      target.skillCategory = skillCategory;
      target.targetLevel = parseInt(targetLevel) || 1;
    }
    if (goalType === 'star_ascension') target.targetStars = parseInt(targetStars) || 1;
    if (goalType === 'pet_capture') target.targetRarity = targetRarity;
    if (goalType === 'pet_level') target.targetLevel = parseInt(targetLevel) || 1;
    if (goalType === 'pet_refine') target.targetRarity = targetRarity;

    const result = {
      id: goal?.id || generateId(),
      phase,
      phaseLabel,
      heroName,
      goalType,
      description: effectiveDesc || description || 'New Goal',
      target,
      manualOnly: MANUAL_ONLY_TYPES.includes(goalType),
      completed: goal?.completed || false,
      completedDate: goal?.completedDate || null,
      modeImpact,
      notes,
    };

    onSave(result);
  };

  const inputClass = "w-full bg-[#0F172A] border border-gray-600 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500";
  const selectClass = inputClass + " appearance-none";
  const labelClass = "text-[10px] text-gray-400 block mb-0.5";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-[60]">
      <div className="bg-[#1E293B] rounded-t-xl w-full max-w-lg max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 shrink-0">
          <button onClick={onCancel} className="text-xs text-gray-400 hover:text-white cursor-pointer">Cancel</button>
          <span className="text-xs font-bold text-white">{isEdit ? 'Edit Goal' : 'Add Goal'}</span>
          <button onClick={handleSave} className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer">Save</button>
        </div>

        {/* Scrollable form */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
          {/* Hero */}
          <div>
            <label className={labelClass}>Hero</label>
            <select value={heroName} onChange={e => setHeroName(e.target.value)} className={selectClass}>
              <option value="">-- Select Hero --</option>
              {heroNames.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {/* Goal Type */}
          <div>
            <label className={labelClass}>Goal Type</label>
            <select value={goalType} onChange={e => { setGoalType(e.target.value); setAutoDesc(true); }} className={selectClass}>
              {GOAL_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          {/* Conditional target fields */}
          {['gear_enhancement', 'gear_mf', 'gear_acquire'].includes(goalType) && (
            <div>
              <label className={labelClass}>Gear Slot</label>
              <select value={gearSlot} onChange={e => setGearSlot(e.target.value)} className={selectClass}>
                {GEAR_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}

          {goalType === 'gear_enhancement' && (
            <div>
              <label className={labelClass}>Target Enhancement</label>
              <input type="number" min="0" max="99" value={targetEnhancement} onChange={e => setTargetEnhancement(e.target.value)} className={inputClass} placeholder="e.g. 45" />
            </div>
          )}

          {goalType === 'gear_mf' && (
            <div>
              <label className={labelClass}>Target MF Level</label>
              <select value={targetMF} onChange={e => setTargetMF(e.target.value)} className={selectClass}>
                {[1,2,3,4,5].map(v => <option key={v} value={v}>MF{v}</option>)}
              </select>
            </div>
          )}

          {goalType === 'gear_acquire' && (
            <div>
              <label className={labelClass}>Target Rarity</label>
              <select value={targetRarity} onChange={e => setTargetRarity(e.target.value)} className={selectClass}>
                {['Mythic', 'Epic', 'Rare'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          )}

          {goalType === 'skill_level' && (
            <>
              <div>
                <label className={labelClass}>Skill Category</label>
                <select value={skillCategory} onChange={e => setSkillCategory(e.target.value)} className={selectClass}>
                  <option value="exploration">Exploration</option>
                  <option value="expedition">Expedition</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Skill Name</label>
                <input type="text" value={skillName} onChange={e => setSkillName(e.target.value)} className={inputClass} placeholder="e.g. Precise Shot" />
              </div>
              <div>
                <label className={labelClass}>Target Level</label>
                <select value={targetLevel} onChange={e => setTargetLevel(e.target.value)} className={selectClass}>
                  {[1,2,3,4,5].map(v => <option key={v} value={v}>Lv{v}</option>)}
                </select>
              </div>
            </>
          )}

          {goalType === 'star_ascension' && (
            <div>
              <label className={labelClass}>Target Stars</label>
              <select value={targetStars} onChange={e => setTargetStars(e.target.value)} className={selectClass}>
                {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}★</option>)}
              </select>
            </div>
          )}

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <input
              type="text"
              value={effectiveDesc}
              onChange={e => { setDescription(e.target.value); setAutoDesc(false); }}
              className={inputClass}
              placeholder="Goal description"
            />
            {!autoDesc && generated && (
              <button onClick={() => setAutoDesc(true)} className="text-[9px] text-blue-400 mt-0.5 cursor-pointer">Reset to auto</button>
            )}
          </div>

          {/* Phase */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className={labelClass}>Phase</label>
              <select value={phase} onChange={e => handlePhaseChange(e.target.value)} className={selectClass}>
                {[1,2,3,4,5,6,7,8].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className={labelClass}>Phase Label</label>
              <input type="text" value={phaseLabel} onChange={e => setPhaseLabel(e.target.value)} className={inputClass} />
            </div>
          </div>

          {/* Mode Impact */}
          <div>
            <label className={labelClass}>Mode Impact</label>
            <input type="text" value={modeImpact} onChange={e => setModeImpact(e.target.value)} className={inputClass} placeholder="e.g. Arena + Expedition" />
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Notes</label>
            <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className={inputClass} placeholder="Optional context" />
          </div>

          {/* Bottom padding for scroll */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}
