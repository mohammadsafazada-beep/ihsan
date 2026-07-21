import {
  macrosForIngredientQuantity,
  macrosForMealItem,
  macrosForRecipe,
  macrosPerServing,
  subtractMacros,
  sumMacros,
} from "./macro-calculator.service";
import { Macros, ZERO_MACROS } from "../value-objects/macros.vo";

const chickenPer100g: Macros = { calories: 165, proteinGrams: 31, carbsGrams: 0, fatGrams: 3.6 };
const ricePer100g: Macros = { calories: 130, proteinGrams: 2.7, carbsGrams: 28, fatGrams: 0.3 };

describe("macrosForIngredientQuantity", () => {
  it("scales per-100g macros linearly with quantity", () => {
    expect(macrosForIngredientQuantity(chickenPer100g, 200)).toEqual({
      calories: 330,
      proteinGrams: 62,
      carbsGrams: 0,
      fatGrams: 7.2,
    });
  });

  it("returns zero macros for zero quantity", () => {
    expect(macrosForIngredientQuantity(chickenPer100g, 0)).toEqual(ZERO_MACROS);
  });
});

describe("macrosForRecipe", () => {
  it("sums every ingredient line scaled by its own quantity", () => {
    const total = macrosForRecipe([
      { macrosPer100g: chickenPer100g, quantityGrams: 300 },
      { macrosPer100g: ricePer100g, quantityGrams: 150 },
    ]);
    // chicken 300g: 495 / 93 / 0 / 10.8 ; rice 150g: 195 / 4.05 / 42 / 0.45
    expect(total).toEqual({
      calories: 690,
      proteinGrams: 97.1,
      carbsGrams: 42,
      fatGrams: 11.3,
    });
  });

  it("returns zero macros for a recipe with no ingredient lines", () => {
    expect(macrosForRecipe([])).toEqual(ZERO_MACROS);
  });
});

describe("macrosPerServing", () => {
  it("divides total macros evenly across servings", () => {
    const total: Macros = { calories: 800, proteinGrams: 80, carbsGrams: 40, fatGrams: 20 };
    expect(macrosPerServing(total, 4)).toEqual({
      calories: 200,
      proteinGrams: 20,
      carbsGrams: 10,
      fatGrams: 5,
    });
  });

  it("returns zero macros rather than dividing by zero when servings is zero", () => {
    const total: Macros = { calories: 800, proteinGrams: 80, carbsGrams: 40, fatGrams: 20 };
    expect(macrosPerServing(total, 0)).toEqual(ZERO_MACROS);
  });
});

describe("macrosForMealItem", () => {
  it("treats a recipe item's quantity as a serving count", () => {
    const macrosPerServingValue: Macros = { calories: 200, proteinGrams: 20, carbsGrams: 10, fatGrams: 5 };
    const result = macrosForMealItem({ kind: "recipe", macrosPerServing: macrosPerServingValue }, 2);
    expect(result).toEqual({ calories: 400, proteinGrams: 40, carbsGrams: 20, fatGrams: 10 });
  });

  it("treats an ingredient item's quantity as grams", () => {
    const result = macrosForMealItem({ kind: "ingredient", macrosPer100g: chickenPer100g }, 50);
    expect(result).toEqual({ calories: 82.5, proteinGrams: 15.5, carbsGrams: 0, fatGrams: 1.8 });
  });
});

describe("sumMacros / subtractMacros", () => {
  it("sums a list of macros field by field", () => {
    const a: Macros = { calories: 100, proteinGrams: 10, carbsGrams: 5, fatGrams: 2 };
    const b: Macros = { calories: 50, proteinGrams: 5, carbsGrams: 2, fatGrams: 1 };
    expect(sumMacros([a, b])).toEqual({ calories: 150, proteinGrams: 15, carbsGrams: 7, fatGrams: 3 });
  });

  it("subtracts consumed macros from a target to get what's remaining", () => {
    const target: Macros = { calories: 2000, proteinGrams: 150, carbsGrams: 200, fatGrams: 70 };
    const consumed: Macros = { calories: 1200, proteinGrams: 90, carbsGrams: 120, fatGrams: 40 };
    expect(subtractMacros(target, consumed)).toEqual({
      calories: 800,
      proteinGrams: 60,
      carbsGrams: 80,
      fatGrams: 30,
    });
  });
});
