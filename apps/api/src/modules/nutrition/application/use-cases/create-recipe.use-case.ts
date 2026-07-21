import { Inject, Injectable } from "@nestjs/common";
import { CreateRecipeInput } from "@ihsan/contracts";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { RecipeEntity } from "../../domain/entities/recipe.entity";
import { INGREDIENT_REPOSITORY, IngredientRepositoryPort } from "../ports/ingredient.repository.port";
import { RECIPE_REPOSITORY, RecipeRepositoryPort } from "../ports/recipe.repository.port";

@Injectable()
export class CreateRecipeUseCase {
  constructor(
    @Inject(RECIPE_REPOSITORY) private readonly recipes: RecipeRepositoryPort,
    @Inject(INGREDIENT_REPOSITORY) private readonly ingredients: IngredientRepositoryPort,
  ) {}

  async execute(userId: string, input: CreateRecipeInput): Promise<RecipeEntity> {
    await this.assertIngredientsExist(userId, input.ingredients.map((i) => i.ingredientId));
    return this.recipes.create(userId, input);
  }

  private async assertIngredientsExist(userId: string, ingredientIds: string[]): Promise<void> {
    for (const id of new Set(ingredientIds)) {
      const ingredient = await this.ingredients.findById(id, userId);
      if (!ingredient) {
        throw new NotFoundError("Ingredient", id);
      }
    }
  }
}
