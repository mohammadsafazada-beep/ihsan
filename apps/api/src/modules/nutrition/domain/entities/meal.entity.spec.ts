import { MealEntity } from "./meal.entity";

describe("MealEntity", () => {
  const meal = new MealEntity(
    "meal-1",
    "user-1",
    "2026-01-01",
    "LUNCH",
    null,
    [
      {
        id: "item-1",
        label: "Chicken & rice",
        quantity: 1.5, // servings, since this item references a recipe
        source: {
          kind: "recipe",
          recipeId: "recipe-1",
          macrosPerServing: { calories: 345, proteinGrams: 48.6, carbsGrams: 21, fatGrams: 5.7 },
        },
      },
      {
        id: "item-2",
        label: "Almonds",
        quantity: 30, // grams, since this item references a raw ingredient
        source: {
          kind: "ingredient",
          ingredientId: "ing-almonds",
          macrosPer100g: { calories: 579, proteinGrams: 21, carbsGrams: 22, fatGrams: 50 },
        },
      },
    ],
    new Date("2026-01-01"),
  );

  it("sums recipe items (scaled by servings) and ingredient items (scaled by grams)", () => {
    expect(meal.getTotalMacros()).toEqual({
      calories: 691.2,
      proteinGrams: 79.2,
      carbsGrams: 38.1,
      fatGrams: 23.6,
    });
  });

  it("returns a single item's macros by id", () => {
    expect(meal.getItemMacros("item-2")).toEqual({
      calories: 173.7,
      proteinGrams: 6.3,
      carbsGrams: 6.6,
      fatGrams: 15,
    });
  });

  it("returns null for an unknown item id", () => {
    expect(meal.getItemMacros("does-not-exist")).toBeNull();
  });
});
