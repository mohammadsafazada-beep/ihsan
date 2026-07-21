import { Inject, Injectable } from "@nestjs/common";
import { IngredientEntity } from "../../domain/entities/ingredient.entity";
import { INGREDIENT_REPOSITORY, IngredientRepositoryPort } from "../ports/ingredient.repository.port";

@Injectable()
export class ListIngredientsUseCase {
  constructor(
    @Inject(INGREDIENT_REPOSITORY) private readonly ingredients: IngredientRepositoryPort,
  ) {}

  async execute(userId: string): Promise<IngredientEntity[]> {
    return this.ingredients.findManyByUser(userId);
  }
}
