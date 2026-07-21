import { Inject, Injectable } from "@nestjs/common";
import { UpdateIngredientInput } from "@ihsan/contracts";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { IngredientEntity } from "../../domain/entities/ingredient.entity";
import { INGREDIENT_REPOSITORY, IngredientRepositoryPort } from "../ports/ingredient.repository.port";

@Injectable()
export class UpdateIngredientUseCase {
  constructor(
    @Inject(INGREDIENT_REPOSITORY) private readonly ingredients: IngredientRepositoryPort,
  ) {}

  async execute(id: string, userId: string, input: UpdateIngredientInput): Promise<IngredientEntity> {
    const existing = await this.ingredients.findById(id, userId);
    if (!existing) {
      throw new NotFoundError("Ingredient", id);
    }
    return this.ingredients.update(id, userId, input);
  }
}
