import { Inject, Injectable } from "@nestjs/common";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { RecipeEntity } from "../../domain/entities/recipe.entity";
import { RECIPE_REPOSITORY, RecipeRepositoryPort } from "../ports/recipe.repository.port";

@Injectable()
export class GetRecipeUseCase {
  constructor(@Inject(RECIPE_REPOSITORY) private readonly recipes: RecipeRepositoryPort) {}

  async execute(id: string, userId: string): Promise<RecipeEntity> {
    const recipe = await this.recipes.findById(id, userId);
    if (!recipe) {
      throw new NotFoundError("Recipe", id);
    }
    return recipe;
  }
}
