import { Inject, Injectable } from "@nestjs/common";
import { UpdateMealInput } from "@ihsan/contracts";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { MealEntity } from "../../domain/entities/meal.entity";
import { INGREDIENT_REPOSITORY, IngredientRepositoryPort } from "../ports/ingredient.repository.port";
import { MEAL_REPOSITORY, MealRepositoryPort } from "../ports/meal.repository.port";
import { RECIPE_REPOSITORY, RecipeRepositoryPort } from "../ports/recipe.repository.port";

@Injectable()
export class UpdateMealUseCase {
  constructor(
    @Inject(MEAL_REPOSITORY) private readonly meals: MealRepositoryPort,
    @Inject(RECIPE_REPOSITORY) private readonly recipes: RecipeRepositoryPort,
    @Inject(INGREDIENT_REPOSITORY) private readonly ingredients: IngredientRepositoryPort,
  ) {}

  async execute(id: string, userId: string, input: UpdateMealInput): Promise<MealEntity> {
    const existing = await this.meals.findById(id, userId);
    if (!existing) {
      throw new NotFoundError("Meal", id);
    }
    if (input.items) {
      for (const item of input.items) {
        if (item.recipeId) {
          const recipe = await this.recipes.findById(item.recipeId, userId);
          if (!recipe) throw new NotFoundError("Recipe", item.recipeId);
        } else if (item.ingredientId) {
          const ingredient = await this.ingredients.findById(item.ingredientId, userId);
          if (!ingredient) throw new NotFoundError("Ingredient", item.ingredientId);
        }
      }
    }
    return this.meals.update(id, userId, input);
  }
}
