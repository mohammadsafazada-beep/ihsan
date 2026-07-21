import { Inject, Injectable } from "@nestjs/common";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { INGREDIENT_REPOSITORY, IngredientRepositoryPort } from "../ports/ingredient.repository.port";

@Injectable()
export class DeleteIngredientUseCase {
  constructor(
    @Inject(INGREDIENT_REPOSITORY) private readonly ingredients: IngredientRepositoryPort,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const existing = await this.ingredients.findById(id, userId);
    if (!existing) {
      throw new NotFoundError("Ingredient", id);
    }
    await this.ingredients.delete(id, userId);
  }
}
