import { Inject, Injectable } from "@nestjs/common";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { RECIPE_REPOSITORY, RecipeRepositoryPort } from "../ports/recipe.repository.port";

@Injectable()
export class DeleteRecipeUseCase {
  constructor(@Inject(RECIPE_REPOSITORY) private readonly recipes: RecipeRepositoryPort) {}

  async execute(id: string, userId: string): Promise<void> {
    const existing = await this.recipes.findById(id, userId);
    if (!existing) {
      throw new NotFoundError("Recipe", id);
    }
    await this.recipes.delete(id, userId);
  }
}
