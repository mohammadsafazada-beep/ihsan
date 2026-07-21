import { Inject, Injectable } from "@nestjs/common";
import { FOOD_DATABASE, FoodDatabasePort, FoodSearchResult } from "../ports/food-database.port";

@Injectable()
export class SearchFoodDatabaseUseCase {
  constructor(@Inject(FOOD_DATABASE) private readonly foodDatabase: FoodDatabasePort) {}

  async execute(query: string): Promise<FoodSearchResult[]> {
    return this.foodDatabase.search(query);
  }
}
