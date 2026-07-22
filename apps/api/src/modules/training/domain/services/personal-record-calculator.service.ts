export type PrType = "MAX_WEIGHT" | "ESTIMATED_1RM" | "MAX_VOLUME_SESSION";

export interface SetForPrCalculation {
  workoutSessionId: string;
  reps: number;
  weightKg: number;
  isWarmup: boolean;
}

export interface PersonalRecordValue {
  type: PrType;
  value: number;
}

/** Epley formula — a standard, simple estimate; good enough for tracking trend, not exact physiology. */
function estimateOneRepMax(weightKg: number, reps: number): number {
  return weightKg * (1 + reps / 30);
}

/**
 * Computes the best-ever value for each PR type from a lifter's full set history for one exercise.
 * Returns an empty array if there are no working (non-warmup) sets yet — no PR without a real attempt.
 */
export function calculatePersonalRecords(sets: SetForPrCalculation[]): PersonalRecordValue[] {
  const workingSets = sets.filter((set) => !set.isWarmup);
  if (workingSets.length === 0) {
    return [];
  }

  const maxWeight = Math.max(...workingSets.map((set) => set.weightKg));
  const estimated1Rm = Math.max(...workingSets.map((set) => estimateOneRepMax(set.weightKg, set.reps)));

  const volumeBySession = new Map<string, number>();
  for (const set of workingSets) {
    const volume = set.weightKg * set.reps;
    volumeBySession.set(set.workoutSessionId, (volumeBySession.get(set.workoutSessionId) ?? 0) + volume);
  }
  const maxVolumeSession = Math.max(...volumeBySession.values());

  return [
    { type: "MAX_WEIGHT", value: maxWeight },
    { type: "ESTIMATED_1RM", value: Math.round(estimated1Rm * 10) / 10 },
    { type: "MAX_VOLUME_SESSION", value: maxVolumeSession },
  ];
}
