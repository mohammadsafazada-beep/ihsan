import { CreateMealInput, UpdateMealInput } from "@ihsan/contracts";
import { MealEntity } from "../../domain/entities/meal.entity";

export const MEAL_REPOSITORY = "MEAL_REPOSITORY";

export interface MealRepositoryPort {
  create(userId: string, input: CreateMealInput): Promise<MealEntity>;
  update(id: string, userId: string, input: UpdateMealInput): Promise<MealEntity>;
  delete(id: string, userId: string): Promise<void>;
  findById(id: string, userId: string): Promise<MealEntity | null>;
  findManyByUserAndDate(userId: string, date: string): Promise<MealEntity[]>;
}
