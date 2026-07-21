export const NUTRITION_TARGET_REPOSITORY = "NUTRITION_TARGET_REPOSITORY";

export interface NutritionTargetSnapshot {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export interface NutritionTargetRepositoryPort {
  /** The most recent target with effectiveFrom <= date, or null if none has been set yet. */
  findActiveForDate(userId: string, date: string): Promise<NutritionTargetSnapshot | null>;
}
