import { CreateIngredientInput, UpdateIngredientInput } from "@ihsan/contracts";
import { IngredientEntity } from "../../domain/entities/ingredient.entity";

export const INGREDIENT_REPOSITORY = "INGREDIENT_REPOSITORY";

export interface IngredientRepositoryPort {
  create(userId: string, input: CreateIngredientInput): Promise<IngredientEntity>;
  update(id: string, userId: string, input: UpdateIngredientInput): Promise<IngredientEntity>;
  delete(id: string, userId: string): Promise<void>;
  findById(id: string, userId: string): Promise<IngredientEntity | null>;
  findManyByUser(userId: string): Promise<IngredientEntity[]>;
}
