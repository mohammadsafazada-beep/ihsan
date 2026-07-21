import { MealType } from "./meal.entity";

export interface MealTemplateItemLine {
  id: string;
  label: string;
  quantity: number;
  mealType: MealType;
  recipeId: string | null;
  ingredientId: string | null;
}

export class MealTemplateEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly items: MealTemplateItemLine[],
    public readonly createdAt: Date,
  ) {}
}
