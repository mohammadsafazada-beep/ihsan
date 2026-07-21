import { Inject, Injectable } from "@nestjs/common";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { MEAL_REPOSITORY, MealRepositoryPort } from "../ports/meal.repository.port";

@Injectable()
export class DeleteMealUseCase {
  constructor(@Inject(MEAL_REPOSITORY) private readonly meals: MealRepositoryPort) {}

  async execute(id: string, userId: string): Promise<void> {
    const existing = await this.meals.findById(id, userId);
    if (!existing) {
      throw new NotFoundError("Meal", id);
    }
    await this.meals.delete(id, userId);
  }
}
