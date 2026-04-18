import { useState, useMemo } from 'react';
import { runAutoDetection, getGoalProgress, PHASE_COLORS } from '../lib/roadmap';
import GoalEditor from './GoalEditor';

export default function RoadmapView({ roadmap, heroes, onClose, onToggleGoal, onAddGoal, onUpdateGoal, onDeleteGoal, onReorderGoal }) {
  const [collapsedCompleted, setCollapsedCompleted] = useState({});
  const [editingGoal, setEditingGoal] = useState(null); // null = closed, {} = add new, goal object = editing
  const [confirmDelete, setConfirmDelete] = useState(null);

  const detected = useMemo(() => {
    if (!roadmap || !heroes) return [];
    return runAutoDetection(roadmap, heroes);
  }, [roadmap, heroes]);

  // Group goals by phase, preserving priority order within each phase
  const phases = useMemo(() => {
    const map = new Map();
    detected.forEach((goal, idx) => {
      if (!map.has(goal.phase)) {
        map.set(goal.phase, { phase: goal.phase, label: goal.phaseLabel, goals: [] });
      }
      map.get(goal.phase).goals.push({ ...goal, _globalIdx: idx });
    });
    return Array.from(map.values()).sort((a, b) => a.phase - b.phase);
  }, [detected]);

  const totalCount = detected.length;

  const toggleCollapsed = (phase) => {
    setCollapsedCompleted(prev => ({ ...prev, [phase]: !prev[phase] }));
  };

  const handleSaveGoal = (goal) => {
    if (editingGoal && editingGoal.id) {
      onUpdateGoal(goal);
    } else {
      onAddGoal(goal);
    }
    setEditingGoal(null);
  };

  const handleConfirmDelete = (goalId) => {
    onDeleteGoal(goalId);
    setConfirmDelete(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0B1120]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-gray-800 bg-[#0B1120] shrink-0">
        <button
          onClick={onClose}
          className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer"
        >
          &larr; Back
        </button>
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Roadmap</h2>
        <button
          onClick={() => setEditingGoal({})}
          className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer"
        >
          + Add
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {phases.length === 0 ? (
          <p className="text-xs text-gray-400 text-center mt-8">No goals in roadmap. Tap "+ Add" to create one.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {phases.map(group => (
              <PhaseGroup
                key={group.phase}
                group={group}
                heroes={heroes}
                totalCount={totalCount}
                collapsed={collapsedCompleted[group.phase]}
                onToggleCollapse={() => toggleCollapsed(group.phase)}
                onToggleGoal={onToggleGoal}
                onEdit={(goal) => setEditingGoal(goal)}
                onDelete={(goalId) => setConfirmDelete(goalId)}
                onReorder={onReorderGoal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Goal Editor modal */}
      {editingGoal !== null && (
        <GoalEditor
          goal={editingGoal.id ? editingGoal : null}
          heroes={heroes}
          onSave={handleSaveGoal}
          onCancel={() => setEditingGoal(null)}
        />
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[70] p-4">
          <div className="bg-[#1E293B] rounded-lg p-5 w-full max-w-xs">
            <h3 className="text-sm font-bold text-white mb-2">Delete Goal?</h3>
            <p className="text-xs text-gray-400 mb-4">This action cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-3 py-1.5 text-xs text-gray-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmDelete(confirmDelete)}
                className="px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-500 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PhaseGroup({ group, heroes, totalCount, collapsed, onToggleCollapse, onToggleGoal, onEdit, onDelete, onReorder }) {
  const completed = group.goals.filter(g => g.completed);
  const incomplete = group.goals.filter(g => !g.completed);
  const color = PHASE_COLORS[group.phase] || PHASE_COLORS[1];

  return (
    <div>
      {/* Phase header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
          Phase {group.phase} &mdash; {group.label}
        </span>
        <span className="text-[10px] text-gray-500">
          ({completed.length}/{group.goals.length} done)
        </span>
      </div>

      {/* Incomplete goals */}
      <div className="flex flex-col gap-1.5">
        {incomplete.map(goal => (
          <GoalCard
            key={goal.id}
            goal={goal}
            heroes={heroes}
            totalCount={totalCount}
            onToggle={onToggleGoal}
            onEdit={onEdit}
            onDelete={onDelete}
            onReorder={onReorder}
          />
        ))}
      </div>

      {/* Completed goals (collapsible) */}
      {completed.length > 0 && (
        <div className="mt-1.5">
          <button
            onClick={onToggleCollapse}
            className="text-[10px] text-gray-500 hover:text-gray-400 cursor-pointer mb-1"
          >
            {collapsed ? '▶' : '▼'} {completed.length} completed
          </button>
          {!collapsed && (
            <div className="flex flex-col gap-1.5">
              {completed.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  heroes={heroes}
                  totalCount={totalCount}
                  onToggle={onToggleGoal}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onReorder={onReorder}
                  dimmed
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const NON_HERO_ICONS = {
  pet_capture: "\u{1F43E}",
  pet_level: "\u{1F43E}",
  pet_refine: "\u{1F43E}",
  chief_gear: "\u{1F3F0}",
  hoard: "\u{1F48E}",
};

function GoalCard({ goal, heroes, totalCount, onToggle, onEdit, onDelete, onReorder, dimmed }) {
  const [showActions, setShowActions] = useState(false);
  const progress = getGoalProgress(goal, heroes);
  const color = PHASE_COLORS[goal.phase] || PHASE_COLORS[1];
  const icon = NON_HERO_ICONS[goal.goalType] || "";

  return (
    <div
      className={`rounded-lg border p-2.5 ${
        dimmed
          ? 'bg-[#111827]/50 border-[#1E293B]/50 opacity-60'
          : 'bg-[#111827] border-[#1E293B]'
      }`}
    >
      <div className="flex items-start gap-2">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(goal.id)}
          className="mt-0.5 shrink-0 w-4 h-4 rounded border flex items-center justify-center cursor-pointer"
          style={{
            borderColor: goal.completed ? color : '#4B5563',
            backgroundColor: goal.completed ? color : 'transparent',
          }}
        >
          {goal.completed && (
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className={`text-xs text-gray-200 flex-1 ${dimmed ? 'line-through' : ''}`}>
              {icon ? `${icon} ` : ""}{goal.description}
            </span>
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

          {/* Progress bar for incomplete goals */}
          {!goal.completed && (
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 h-1.5 rounded-full bg-[#1E293B] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(progress.pct * 100).toFixed(0)}%`, backgroundColor: color }}
                />
              </div>
              <span className="text-[10px] text-gray-400 whitespace-nowrap">{progress.label}</span>
            </div>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-2 mt-1">
            {goal.modeImpact && (
              <span className="text-[9px] text-gray-500">{goal.modeImpact}</span>
            )}
            {goal.completed && goal.completedDate && (
              <span className="text-[9px] text-gray-500">
                Completed {formatDate(goal.completedDate)}
              </span>
            )}
          </div>

          {/* Action buttons row */}
          {showActions && (
            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-700/50">
              <button
                onClick={() => onReorder(goal.id, -1)}
                disabled={goal._globalIdx === 0}
                className="px-2 py-1 text-[10px] text-gray-400 hover:text-white border border-gray-600 rounded cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ↑ Up
              </button>
              <button
                onClick={() => onReorder(goal.id, 1)}
                disabled={goal._globalIdx === totalCount - 1}
                className="px-2 py-1 text-[10px] text-gray-400 hover:text-white border border-gray-600 rounded cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ↓ Down
              </button>
              <button
                onClick={() => { setShowActions(false); onEdit(goal); }}
                className="px-2 py-1 text-[10px] text-blue-400 hover:text-blue-300 border border-blue-400/30 rounded cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => { setShowActions(false); onDelete(goal.id); }}
                className="px-2 py-1 text-[10px] text-red-400 hover:text-red-300 border border-red-400/30 rounded cursor-pointer"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m, 10) - 1]} ${parseInt(d, 10)}`;
}
