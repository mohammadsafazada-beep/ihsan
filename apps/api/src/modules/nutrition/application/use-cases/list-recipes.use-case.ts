import { Inject, Injectable } from "@nestjs/common";
import { RecipeEntity } from "../../domain/entities/recipe.entity";
import { RECIPE_REPOSITORY, RecipeRepositoryPort } from "../ports/recipe.repository.port";

@Injectable()
export class ListRecipesUseCase {
  constructor(@Inject(RECIPE_REPOSITORY) private readonly recipes: RecipeRepositoryPort) {}

  async execute(userId: string): Promise<RecipeEntity[]> {
    return this.recipes.findManyByUser(userId);
  }
}
