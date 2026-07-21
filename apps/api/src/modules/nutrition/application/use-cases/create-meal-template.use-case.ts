import { Inject, Injectable } from "@nestjs/common";
import { CreateMealTemplateInput } from "@ihsan/contracts";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { MealTemplateEntity } from "../../domain/entities/meal-template.entity";
import { INGREDIENT_REPOSITORY, IngredientRepositoryPort } from "../ports/ingredient.repository.port";
import { RECIPE_REPOSITORY, RecipeRepositoryPort } from "../ports/recipe.repository.port";
import {
  MEAL_TEMPLATE_REPOSITORY,
  MealTemplateRepositoryPort,
} from "../ports/meal-template.repository.port";

@Injectable()
export class CreateMealTemplateUseCase {
  constructor(
    @Inject(MEAL_TEMPLATE_REPOSITORY) private readonly templates: MealTemplateRepositoryPort,
    @Inject(RECIPE_REPOSITORY) private readonly recipes: RecipeRepositoryPort,
    @Inject(INGREDIENT_REPOSITORY) private readonly ingredients: IngredientRepositoryPort,
  ) {}

  async execute(userId: string, input: CreateMealTemplateInput): Promise<MealTemplateEntity> {
    for (const item of input.items) {
      if (item.recipeId) {
        const recipe = await this.recipes.findById(item.recipeId, userId);
        if (!recipe) throw new NotFoundError("Recipe", item.recipeId);
      } else if (item.ingredientId) {
        const ingredient = await this.ingredients.findById(item.ingredientId, userId);
        if (!ingredient) throw new NotFoundError("Ingredient", item.ingredientId);
      }
    }
    return this.templates.create(userId, input);
  }
}
