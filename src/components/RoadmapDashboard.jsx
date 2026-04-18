import { useMemo } from 'react';
import { runAutoDetection, getGoalProgress, PHASE_COLORS } from '../lib/roadmap';

export default function RoadmapDashboard({ roadmap, heroes, onViewRoadmap }) {
  const { goals, totalCount } = useMemo(() => {
    if (!roadmap || !heroes) return { goals: [], totalCount: 0 };
    const detected = runAutoDetection(roadmap, heroes);
    const incomplete = detected.filter(g => !g.completed);
    return { goals: incomplete.slice(0, 3), totalCount: detected.length };
  }, [roadmap, heroes]);

  if (!roadmap || roadmap.length === 0) {
    return (
      <div className="mx-3 my-2 p-3 rounded-lg bg-[#111827] border border-[#1E293B]">
        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Roadmap</div>
        <p className="text-xs text-gray-400">No roadmap set up. Import one or add goals manually.</p>
      </div>
    );
  }

  const allComplete = goals.length === 0;

  return (
    <div className="mx-3 my-2 p-3 rounded-lg bg-[#111827] border border-[#1E293B]">
      <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Next Up</div>

      {allComplete ? (
        <p className="text-xs text-green-400">All goals complete! Add new goals in the Roadmap.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {goals.map((goal, i) => (
            <GoalRow key={goal.id} goal={goal} index={i + 1} heroes={heroes} />
          ))}
        </div>
      )}

      {onViewRoadmap && (
        <button
          onClick={onViewRoadmap}
          className="mt-2.5 text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
        >
          ▸ View Full Roadmap ({totalCount} goals)
        </button>
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

function GoalRow({ goal, index, heroes }) {
  const progress = getGoalProgress(goal, heroes);
  const color = PHASE_COLORS[goal.phase] || PHASE_COLORS[1];
  const icon = NON_HERO_ICONS[goal.goalType] || "";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-1.5">
        <span className="text-[10px] text-gray-500 font-mono w-3 shrink-0">{index}.</span>
        <span className="text-xs text-gray-200 truncate">{icon ? `${icon} ` : ""}{goal.description}</span>
      </div>
      <div className="flex items-center gap-2 ml-[18px]">
        {/* Progress bar */}
        <div className="flex-1 h-1.5 rounded-full bg-[#1E293B] overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${(progress.pct * 100).toFixed(0)}%`, backgroundColor: color }}
          />
        </div>
        <span className="text-[10px] text-gray-400 whitespace-nowrap">{progress.label}</span>
        <span className="text-[9px] text-gray-500 whitespace-nowrap truncate max-w-[60px]">{goal.modeImpact}</span>
      </div>
    </div>
  );
}
