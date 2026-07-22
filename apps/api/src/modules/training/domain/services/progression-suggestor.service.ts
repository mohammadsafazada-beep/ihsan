export interface SetForSuggestion {
  reps: number;
  weightKg: number;
  isWarmup: boolean;
}

export interface WeightSuggestion {
  suggestedWeightKg: number | null;
  reason: string;
}

const WEIGHT_INCREMENT_KG = 2.5;

/**
 * Suggests next session's weight for an exercise from the last time it was performed,
 * comparing actual reps against the prescribed rep range. Mirrors a simple, deterministic
 * progressive-overload rule: hit the top of the range -> add weight; missed the bottom
 * of the range -> back off slightly; otherwise repeat the same weight.
 */
export function suggestNextWeight(
  lastSessionSets: SetForSuggestion[],
  targetRepsMin: number,
  targetRepsMax: number,
): WeightSuggestion {
  const workingSets = lastSessionSets.filter((set) => !set.isWarmup);
  if (workingSets.length === 0) {
    return { suggestedWeightKg: null, reason: "No previous session logged for this exercise yet." };
  }

  const lastWeight = Math.max(...workingSets.map((set) => set.weightKg));
  const setsAtLastWeight = workingSets.filter((set) => set.weightKg === lastWeight);

  const allHitTop = setsAtLastWeight.every((set) => set.reps >= targetRepsMax);
  if (allHitTop) {
    return {
      suggestedWeightKg: lastWeight + WEIGHT_INCREMENT_KG,
      reason: `Hit the top of your rep range (${targetRepsMax}) on every set last time — try +${WEIGHT_INCREMENT_KG}kg.`,
    };
  }

  const anyMissedBottom = setsAtLastWeight.some((set) => set.reps < targetRepsMin);
  if (anyMissedBottom) {
    return {
      suggestedWeightKg: Math.max(0, lastWeight - WEIGHT_INCREMENT_KG),
      reason: `Missed your rep range (${targetRepsMin}) on at least one set last time — consider -${WEIGHT_INCREMENT_KG}kg.`,
    };
  }

  return {
    suggestedWeightKg: lastWeight,
    reason: "Still within your rep range — repeat the same weight and aim for more reps.",
  };
}
