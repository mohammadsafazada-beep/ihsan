export const FOOD_DATABASE = "FOOD_DATABASE";

export interface FoodSearchResult {
  externalId: string;
  name: string;
  brand: string | null;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
}

export interface FoodDatabasePort {
  search(query: string): Promise<FoodSearchResult[]>;
}
