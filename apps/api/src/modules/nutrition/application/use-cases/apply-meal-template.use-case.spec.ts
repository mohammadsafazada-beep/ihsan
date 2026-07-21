import { CreateMealInput, UpdateMealInput } from "@ihsan/contracts";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { MealEntity } from "../../domain/entities/meal.entity";
import { MealTemplateEntity } from "../../domain/entities/meal-template.entity";
import { MealRepositoryPort } from "../ports/meal.repository.port";
import { MealTemplateRepositoryPort } from "../ports/meal-template.repository.port";
import { ApplyMealTemplateUseCase } from "./apply-meal-template.use-case";

class FakeMealTemplateRepository implements MealTemplateRepositoryPort {
  constructor(private readonly templates: MealTemplateEntity[] = []) {}
  async create(): Promise<MealTemplateEntity> {
    throw new Error("not needed for this test");
  }
  async findById(id: string, userId: string): Promise<MealTemplateEntity | null> {
    return this.templates.find((t) => t.id === id && t.userId === userId) ?? null;
  }
  async findManyByUser(): Promise<MealTemplateEntity[]> {
    return this.templates;
  }
}

class FakeMealRepository implements MealRepositoryPort {
  public created: { userId: string; input: CreateMealInput }[] = [];
  async create(userId: string, input: CreateMealInput): Promise<MealEntity> {
    this.created.push({ userId, input });
    return new MealEntity(`meal-${this.created.length}`, userId, input.date, input.mealType, null, [], new Date());
  }
  async update(_id: string, _userId: string, _input: UpdateMealInput): Promise<MealEntity> {
    throw new Error("not needed for this test");
  }
  async delete(): Promise<void> {}
  async findById(): Promise<MealEntity | null> {
    return null;
  }
  async findManyByUserAndDate(): Promise<MealEntity[]> {
    return [];
  }
}

const template = new MealTemplateEntity(
  "template-1",
  "user-1",
  "Full day",
  [
    { id: "item-1", label: "Oats", quantity: 60, mealType: "BREAKFAST", recipeId: null, ingredientId: "ing-oats" },
    {
      id: "item-2",
      label: "Chicken & rice",
      quantity: 1,
      mealType: "LUNCH",
      recipeId: "recipe-chicken",
      ingredientId: null,
    },
    {
      id: "item-3",
      label: "Salmon",
      quantity: 150,
      mealType: "LUNCH",
      recipeId: null,
      ingredientId: "ing-salmon",
    },
  ],
  new Date(),
);

describe("ApplyMealTemplateUseCase", () => {
  it("creates one meal per distinct meal type found in the template", async () => {
    const templates = new FakeMealTemplateRepository([template]);
    const meals = new FakeMealRepository();
    const useCase = new ApplyMealTemplateUseCase(templates, meals);

    const result = await useCase.execute("template-1", "user-1", { date: "2026-03-01" });

    expect(result).toHaveLength(2);
    expect(meals.created).toHaveLength(2);

    const breakfast = meals.created.find((c) => c.input.mealType === "BREAKFAST");
    expect(breakfast?.input.items).toEqual([{ quantity: 60, ingredientId: "ing-oats" }]);

    const lunch = meals.created.find((c) => c.input.mealType === "LUNCH");
    expect(lunch?.input.items).toEqual([
      { quantity: 1, recipeId: "recipe-chicken" },
      { quantity: 150, ingredientId: "ing-salmon" },
    ]);
  });

  it("throws when the template doesn't belong to the user", async () => {
    const templates = new FakeMealTemplateRepository([template]);
    const meals = new FakeMealRepository();
    const useCase = new ApplyMealTemplateUseCase(templates, meals);

    await expect(useCase.execute("template-1", "someone-else", { date: "2026-03-01" })).rejects.toThrow(
      NotFoundError,
    );
    expect(meals.created).toHaveLength(0);
  });
});
