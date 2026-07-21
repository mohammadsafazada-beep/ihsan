import { CreateMealTemplateInput } from "@ihsan/contracts";
import { MealTemplateEntity } from "../../domain/entities/meal-template.entity";

export const MEAL_TEMPLATE_REPOSITORY = "MEAL_TEMPLATE_REPOSITORY";

export interface MealTemplateRepositoryPort {
  create(userId: string, input: CreateMealTemplateInput): Promise<MealTemplateEntity>;
  findById(id: string, userId: string): Promise<MealTemplateEntity | null>;
  findManyByUser(userId: string): Promise<MealTemplateEntity[]>;
}
