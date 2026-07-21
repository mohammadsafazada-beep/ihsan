import { Inject, Injectable } from "@nestjs/common";
import { UpdateRecipeInput } from "@ihsan/contracts";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { RecipeEntity } from "../../domain/entities/recipe.entity";
import { INGREDIENT_REPOSITORY, IngredientRepositoryPort } from "../ports/ingredient.repository.port";
import { RECIPE_REPOSITORY, RecipeRepositoryPort } from "../ports/recipe.repository.port";

@Injectable()
export class UpdateRecipeUseCase {
  constructor(
    @Inject(RECIPE_REPOSITORY) private readonly recipes: RecipeRepositoryPort,
    @Inject(INGREDIENT_REPOSITORY) private readonly ingredients: IngredientRepositoryPort,
  ) {}

  async execute(id: string, userId: string, input: UpdateRecipeInput): Promise<RecipeEntity> {
    const existing = await this.recipes.findById(id, userId);
    if (!existing) {
      throw new NotFoundError("Recipe", id);
    }
    if (input.ingredients) {
      for (const ingredientId of new Set(input.ingredients.map((i) => i.ingredientId))) {
        const ingredient = await this.ingredients.findById(ingredientId, userId);
        if (!ingredient) {
          throw new NotFoundError("Ingredient", ingredientId);
        }
      }
    }
    return this.recipes.update(id, userId, input);
  }
}
