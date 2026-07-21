import { Inject, Injectable } from "@nestjs/common";
import type { Prisma, PrismaClient } from "@ihsan/database";
import { CreateMealInput, UpdateMealInput } from "@ihsan/contracts";
import { PRISMA_CLIENT } from "../../../../shared/database/prisma.module";
import { MealEntity, MealItemSource, MealType } from "../../domain/entities/meal.entity";
import { macrosForRecipe, macrosPerServing } from "../../domain/services/macro-calculator.service";
import { MealRepositoryPort } from "../../application/ports/meal.repository.port";

const mealWithItems = {
  include: {
    items: {
      include: {
        recipe: { include: { ingredients: { include: { ingredient: true } } } },
        ingredient: true,
      },
    },
  },
} satisfies Prisma.MealDefaultArgs;

type MealRow = Prisma.MealGetPayload<typeof mealWithItems>;
type MealItemRow = MealRow["items"][number];

function toSourceAndLabel(item: MealItemRow): { source: MealItemSource; label: string } {
  if (item.recipe) {
    const totalMacros = macrosForRecipe(
      item.recipe.ingredients.map((line) => ({
        quantityGrams: line.quantityGrams,
        macrosPer100g: {
          calories: line.ingredient.caloriesPer100g,
          proteinGrams: line.ingredient.proteinPer100g,
          carbsGrams: line.ingredient.carbsPer100g,
          fatGrams: line.ingredient.fatPer100g,
        },
      })),
    );
    return {
      source: {
        kind: "recipe",
        recipeId: item.recipe.id,
        macrosPerServing: macrosPerServing(totalMacros, item.recipe.servings),
      },
      label: item.recipe.name,
    };
  }

  if (!item.ingredient) {
    throw new Error(`Meal item ${item.id} has neither a recipe nor an ingredient`);
  }

  return {
    source: {
      kind: "ingredient",
      ingredientId: item.ingredient.id,
      macrosPer100g: {
        calories: item.ingredient.caloriesPer100g,
        proteinGrams: item.ingredient.proteinPer100g,
        carbsGrams: item.ingredient.carbsPer100g,
        fatGrams: item.ingredient.fatPer100g,
      },
    },
    label: item.ingredient.name,
  };
}

function toEntity(row: MealRow): MealEntity {
  return new MealEntity(
    row.id,
    row.userId,
    row.date.toISOString().slice(0, 10),
    row.mealType as MealType,
    row.name,
    row.items.map((item) => {
      const { source, label } = toSourceAndLabel(item);
      return { id: item.id, label, quantity: item.quantity, source };
    }),
    row.createdAt,
  );
}

@Injectable()
export class PrismaMealRepository implements MealRepositoryPort {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async create(userId: string, input: CreateMealInput): Promise<MealEntity> {
    const row = await this.prisma.meal.create({
      data: {
        userId,
        date: new Date(input.date),
        mealType: input.mealType,
        name: input.name,
        items: {
          create: input.items.map((item) => ({
            recipeId: item.recipeId,
            ingredientId: item.ingredientId,
            quantity: item.quantity,
          })),
        },
      },
      ...mealWithItems,
    });
    return toEntity(row);
  }

  async update(id: string, _userId: string, input: UpdateMealInput): Promise<MealEntity> {
    const row = await this.prisma.$transaction(async (tx) => {
      if (input.items) {
        await tx.mealItem.deleteMany({ where: { mealId: id } });
      }
      return tx.meal.update({
        where: { id },
        data: {
          date: input.date ? new Date(input.date) : undefined,
          mealType: input.mealType,
          name: input.name,
          items: input.items
            ? {
                create: input.items.map((item) => ({
                  recipeId: item.recipeId,
                  ingredientId: item.ingredientId,
                  quantity: item.quantity,
                })),
              }
            : undefined,
        },
        ...mealWithItems,
      });
    });
    return toEntity(row);
  }

  async delete(id: string, _userId: string): Promise<void> {
    await this.prisma.meal.delete({ where: { id } });
  }

  async findById(id: string, userId: string): Promise<MealEntity | null> {
    const row = await this.prisma.meal.findFirst({ where: { id, userId }, ...mealWithItems });
    return row ? toEntity(row) : null;
  }

  async findManyByUserAndDate(userId: string, date: string): Promise<MealEntity[]> {
    const rows = await this.prisma.meal.findMany({
      where: { userId, date: new Date(date) },
      orderBy: { createdAt: "asc" },
      ...mealWithItems,
    });
    return rows.map(toEntity);
  }
}
