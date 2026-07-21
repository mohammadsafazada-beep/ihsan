import { CreateRecipeInput, UpdateRecipeInput } from "@ihsan/contracts";
import { RecipeEntity } from "../../domain/entities/recipe.entity";

export const RECIPE_REPOSITORY = "RECIPE_REPOSITORY";

export interface RecipeRepositoryPort {
  create(userId: string, input: CreateRecipeInput): Promise<RecipeEntity>;
  update(id: string, userId: string, input: UpdateRecipeInput): Promise<RecipeEntity>;
  delete(id: string, userId: string): Promise<void>;
  findById(id: string, userId: string): Promise<RecipeEntity | null>;
  findManyByUser(userId: string): Promise<RecipeEntity[]>;
}
