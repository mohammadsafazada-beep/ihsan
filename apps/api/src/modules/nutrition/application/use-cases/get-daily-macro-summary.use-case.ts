import { Inject, Injectable } from "@nestjs/common";
import { Macros, ZERO_MACROS } from "../../domain/value-objects/macros.vo";
import { subtractMacros, sumMacros } from "../../domain/services/macro-calculator.service";
import { MEAL_REPOSITORY, MealRepositoryPort } from "../ports/meal.repository.port";
import {
  NUTRITION_TARGET_REPOSITORY,
  NutritionTargetRepositoryPort,
} from "../ports/nutrition-target.repository.port";

export interface DailyMacroSummary {
  date: string;
  target: Macros;
  consumed: Macros;
  remaining: Macros;
}

@Injectable()
export class GetDailyMacroSummaryUseCase {
  constructor(
    @Inject(MEAL_REPOSITORY) private readonly meals: MealRepositoryPort,
    @Inject(NUTRITION_TARGET_REPOSITORY) private readonly targets: NutritionTargetRepositoryPort,
  ) {}

  async execute(userId: string, date: string): Promise<DailyMacroSummary> {
    const [mealsForDate, target] = await Promise.all([
      this.meals.findManyByUserAndDate(userId, date),
      this.targets.findActiveForDate(userId, date),
    ]);

    const consumed = sumMacros(mealsForDate.map((meal) => meal.getTotalMacros()));
    const targetMacros: Macros = target ?? ZERO_MACROS;

    return {
      date,
      target: targetMacros,
      consumed,
      remaining: subtractMacros(targetMacros, consumed),
    };
  }
}
