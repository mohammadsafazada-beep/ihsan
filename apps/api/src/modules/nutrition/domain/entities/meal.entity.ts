import { Macros } from "../value-objects/macros.vo";
import { macrosForMealItem, sumMacros } from "../services/macro-calculator.service";

export type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";

export type MealItemSource =
  | { kind: "recipe"; recipeId: string; macrosPerServing: Macros }
  | { kind: "ingredient"; ingredientId: string; macrosPer100g: Macros };

export interface MealItemLine {
  id: string;
  label: string;
  quantity: number;
  source: MealItemSource;
}

export class MealEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly date: string,
    public readonly mealType: MealType,
    public readonly name: string | null,
    public readonly items: MealItemLine[],
    public readonly createdAt: Date,
  ) {}

  getTotalMacros(): Macros {
    return sumMacros(this.items.map((item) => macrosForMealItem(item.source, item.quantity)));
  }

  getItemMacros(itemId: string): Macros | null {
    const item = this.items.find((i) => i.id === itemId);
    return item ? macrosForMealItem(item.source, item.quantity) : null;
  }
}
