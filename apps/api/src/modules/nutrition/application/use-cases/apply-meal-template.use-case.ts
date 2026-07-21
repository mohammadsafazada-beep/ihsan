import { Inject, Injectable } from "@nestjs/common";
import { ApplyMealTemplateInput } from "@ihsan/contracts";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { MealEntity, MealType } from "../../domain/entities/meal.entity";
import { MEAL_REPOSITORY, MealRepositoryPort } from "../ports/meal.repository.port";
import {
  MEAL_TEMPLATE_REPOSITORY,
  MealTemplateRepositoryPort,
} from "../ports/meal-template.repository.port";

@Injectable()
export class ApplyMealTemplateUseCase {
  constructor(
    @Inject(MEAL_TEMPLATE_REPOSITORY) private readonly templates: MealTemplateRepositoryPort,
    @Inject(MEAL_REPOSITORY) private readonly meals: MealRepositoryPort,
  ) {}

  async execute(templateId: string, userId: string, input: ApplyMealTemplateInput): Promise<MealEntity[]> {
    const template = await this.templates.findById(templateId, userId);
    if (!template) {
      throw new NotFoundError("MealTemplate", templateId);
    }

    const itemsByMealType = new Map<MealType, typeof template.items>();
    for (const item of template.items) {
      const group = itemsByMealType.get(item.mealType) ?? [];
      group.push(item);
      itemsByMealType.set(item.mealType, group);
    }

    const createdMeals: MealEntity[] = [];
    for (const [mealType, items] of itemsByMealType) {
      const meal = await this.meals.create(userId, {
        date: input.date,
        mealType,
        items: items.map((item) => ({
          quantity: item.quantity,
          ...(item.recipeId ? { recipeId: item.recipeId } : { ingredientId: item.ingredientId! }),
        })),
      });
      createdMeals.push(meal);
    }
    return createdMeals;
  }
}
