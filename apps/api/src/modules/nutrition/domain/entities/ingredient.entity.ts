import { Macros } from "../value-objects/macros.vo";

export class IngredientEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly macrosPer100g: Macros,
    public readonly createdAt: Date,
  ) {}
}
