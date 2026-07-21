import { Inject, Injectable } from "@nestjs/common";
import { SaveMealAsTemplateInput } from "@ihsan/contracts";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { MealTemplateEntity } from "../../domain/entities/meal-template.entity";
import { MEAL_REPOSITORY, MealRepositoryPort } from "../ports/meal.repository.port";
import {
  MEAL_TEMPLATE_REPOSITORY,
  MealTemplateRepositoryPort,
} from "../ports/meal-template.repository.port";

@Injectable()
export class SaveMealAsTemplateUseCase {
  constructor(
    @Inject(MEAL_TEMPLATE_REPOSITORY) private readonly templates: MealTemplateRepositoryPort,
    @Inject(MEAL_REPOSITORY) private readonly meals: MealRepositoryPort,
  ) {}

  async execute(mealId: string, userId: string, input: SaveMealAsTemplateInput): Promise<MealTemplateEntity> {
    const meal = await this.meals.findById(mealId, userId);
    if (!meal) {
      throw new NotFoundError("Meal", mealId);
    }

    return this.templates.create(userId, {
      name: input.name,
      items: meal.items.map((item) => ({
        quantity: item.quantity,
        mealType: meal.mealType,
        ...(item.source.kind === "recipe"
          ? { recipeId: item.source.recipeId }
          : { ingredientId: item.source.ingredientId }),
      })),
    });
  }
}
