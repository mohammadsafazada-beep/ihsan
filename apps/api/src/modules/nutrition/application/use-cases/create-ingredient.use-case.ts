import { Inject, Injectable } from "@nestjs/common";
import { CreateIngredientInput } from "@ihsan/contracts";
import { IngredientEntity } from "../../domain/entities/ingredient.entity";
import { INGREDIENT_REPOSITORY, IngredientRepositoryPort } from "../ports/ingredient.repository.port";

@Injectable()
export class CreateIngredientUseCase {
  constructor(
    @Inject(INGREDIENT_REPOSITORY) private readonly ingredients: IngredientRepositoryPort,
  ) {}

  async execute(userId: string, input: CreateIngredientInput): Promise<IngredientEntity> {
    return this.ingredients.create(userId, input);
  }
}
