/**
 * Auto-detection and progress calculation for roadmap goals.
 */

export function detectGoalCompletion(goal, heroes) {
  if (goal.manualOnly) return goal.completed;
  if (goal.completed) return true;

  const hero = heroes.find(h => h.name === goal.heroName);
  if (!hero) return goal.completed;

  switch (goal.goalType) {
    case "gear_enhancement": {
      const gear = hero.gear.find(g => g.slot === goal.target.gearSlot);
      return gear ? (gear.enhancement ?? 0) >= (goal.target.targetEnhancement ?? Infinity) : false;
    }
    case "gear_mf": {
      const gear = hero.gear.find(g => g.slot === goal.target.gearSlot);
      return gear ? (gear.masterForgery ?? 0) >= (goal.target.targetMF ?? Infinity) : false;
    }
    case "skill_level": {
      const skills = goal.target.skillCategory === "exploration"
        ? hero.skills.exploration
        : hero.skills.expedition;
      const skill = skills.find(s => s.name === goal.target.skillName);
      return skill ? skill.level >= (goal.target.targetLevel ?? Infinity) : false;
    }
    case "star_ascension": {
      return hero.stars >= (goal.target.targetStars ?? Infinity);
    }
    default:
      return goal.completed;
  }
}

/**
 * Run auto-detection across all goals for a chief, updating completed/completedDate.
 * Returns a new roadmap array (does not mutate).
 */
export function runAutoDetection(roadmap, heroes) {
  if (!roadmap || !heroes) return roadmap || [];
  const now = new Date().toISOString().slice(0, 10);
  return roadmap.map(goal => {
    const wasComplete = goal.completed;
    const isComplete = detectGoalCompletion(goal, heroes);
    if (isComplete && !wasComplete) {
      return { ...goal, completed: true, completedDate: now };
    }
    return goal;
  });
}

/**
 * Get the current value for a goal's target (for progress display).
 * Returns { current, target, label } or null if not applicable.
 */
export function getGoalProgress(goal, heroes) {
  const hero = heroes.find(h => h.name === goal.heroName);

  switch (goal.goalType) {
    case "gear_enhancement": {
      const gear = hero?.gear.find(g => g.slot === goal.target.gearSlot);
      const current = gear?.enhancement ?? 0;
      const target = goal.target.targetEnhancement;
      return { current, target, label: `+${current}/+${target}`, pct: Math.min(current / target, 1) };
    }
    case "gear_mf": {
      const gear = hero?.gear.find(g => g.slot === goal.target.gearSlot);
      const current = gear?.masterForgery ?? 0;
      const target = goal.target.targetMF;
      return { current, target, label: `MF${current}/MF${target}`, pct: target > 0 ? Math.min(current / target, 1) : 0 };
    }
    case "skill_level": {
      const skills = goal.target.skillCategory === "exploration"
        ? hero?.skills.exploration
        : hero?.skills.expedition;
      const skill = skills?.find(s => s.name === goal.target.skillName);
      const current = skill?.level ?? 1;
      const target = goal.target.targetLevel;
      // Lv1 = 0%, target = 100%
      const range = target - 1;
      const progress = current - 1;
      return { current, target, label: `Lv${current}/Lv${target}`, pct: range > 0 ? Math.min(progress / range, 1) : 0 };
    }
    case "star_ascension": {
      const current = hero?.stars ?? 0;
      const target = goal.target.targetStars;
      return { current, target, label: `${current}★/${target}★`, pct: target > 0 ? Math.min(current / target, 1) : 0 };
    }
    case "gear_acquire":
    case "shard_accumulate":
    case "weapon_upgrade":
    case "chief_gear":
    case "general":
    default:
      return { current: goal.completed ? 1 : 0, target: 1, label: goal.completed ? "Done" : "Manual", pct: goal.completed ? 1 : 0 };
  }
}

/** Phase colors for progress bars */
export const PHASE_COLORS = {
  1: "#22C55E", // green
  2: "#3B82F6", // blue
  3: "#F59E0B", // amber
  4: "#A78BFA", // purple
  5: "#9CA3AF", // gray
};
