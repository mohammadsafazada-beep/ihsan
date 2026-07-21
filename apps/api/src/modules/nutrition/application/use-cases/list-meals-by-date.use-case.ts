import { Inject, Injectable } from "@nestjs/common";
import { MealEntity } from "../../domain/entities/meal.entity";
import { MEAL_REPOSITORY, MealRepositoryPort } from "../ports/meal.repository.port";

@Injectable()
export class ListMealsByDateUseCase {
  constructor(@Inject(MEAL_REPOSITORY) private readonly meals: MealRepositoryPort) {}

  async execute(userId: string, date: string): Promise<MealEntity[]> {
    return this.meals.findManyByUserAndDate(userId, date);
  }
}
