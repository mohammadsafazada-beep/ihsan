import { Macros, ZERO_MACROS } from "../value-objects/macros.vo";

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/** Scales a macros value by an arbitrary factor (e.g. grams/100, or a recipe's serving count). */
export function scaleMacros(macros: Macros, factor: number): Macros {
  return {
    calories: round1(macros.calories * factor),
    proteinGrams: round1(macros.proteinGrams * factor),
    carbsGrams: round1(macros.carbsGrams * factor),
    fatGrams: round1(macros.fatGrams * factor),
  };
}

export function sumMacros(macrosList: Macros[]): Macros {
  return macrosList.reduce(
    (total, m) => ({
      calories: round1(total.calories + m.calories),
      proteinGrams: round1(total.proteinGrams + m.proteinGrams),
      carbsGrams: round1(total.carbsGrams + m.carbsGrams),
      fatGrams: round1(total.fatGrams + m.fatGrams),
    }),
    ZERO_MACROS,
  );
}

export function subtractMacros(a: Macros, b: Macros): Macros {
  return {
    calories: round1(a.calories - b.calories),
    proteinGrams: round1(a.proteinGrams - b.proteinGrams),
    carbsGrams: round1(a.carbsGrams - b.carbsGrams),
    fatGrams: round1(a.fatGrams - b.fatGrams),
  };
}

/** An ingredient's macros are stored per 100g; quantityGrams scales them. */
export function macrosForIngredientQuantity(macrosPer100g: Macros, quantityGrams: number): Macros {
  return scaleMacros(macrosPer100g, quantityGrams / 100);
}

/** A recipe's macros are the sum of its ingredient lines, each scaled by their quantity. */
export function macrosForRecipe(lines: { macrosPer100g: Macros; quantityGrams: number }[]): Macros {
  return sumMacros(lines.map((line) => macrosForIngredientQuantity(line.macrosPer100g, line.quantityGrams)));
}

export function macrosPerServing(totalMacros: Macros, servings: number): Macros {
  if (servings <= 0) return ZERO_MACROS;
  return scaleMacros(totalMacros, 1 / servings);
}

/** A meal item referencing a recipe: quantity is a serving count. Referencing an ingredient: quantity is grams. */
export function macrosForMealItem(
  source: { kind: "recipe"; macrosPerServing: Macros } | { kind: "ingredient"; macrosPer100g: Macros },
  quantity: number,
): Macros {
  return source.kind === "recipe"
    ? scaleMacros(source.macrosPerServing, quantity)
    : macrosForIngredientQuantity(source.macrosPer100g, quantity);
}
