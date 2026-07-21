import { Inject, Injectable } from "@nestjs/common";
import type { Prisma, PrismaClient } from "@ihsan/database";
import { CreateMealTemplateInput } from "@ihsan/contracts";
import { PRISMA_CLIENT } from "../../../../shared/database/prisma.module";
import { MealTemplateEntity } from "../../domain/entities/meal-template.entity";
import { MealType } from "../../domain/entities/meal.entity";
import { MealTemplateRepositoryPort } from "../../application/ports/meal-template.repository.port";

const templateWithItems = {
  include: { items: { include: { recipe: true, ingredient: true } } },
} satisfies Prisma.MealTemplateDefaultArgs;

type TemplateRow = Prisma.MealTemplateGetPayload<typeof templateWithItems>;

function toEntity(row: TemplateRow): MealTemplateEntity {
  return new MealTemplateEntity(
    row.id,
    row.userId,
    row.name,
    row.items.map((item) => ({
      id: item.id,
      label: item.recipe?.name ?? item.ingredient?.name ?? "Unknown",
      quantity: item.quantity,
      mealType: item.mealType as MealType,
      recipeId: item.recipeId,
      ingredientId: item.ingredientId,
    })),
    row.createdAt,
  );
}

@Injectable()
export class PrismaMealTemplateRepository implements MealTemplateRepositoryPort {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async create(userId: string, input: CreateMealTemplateInput): Promise<MealTemplateEntity> {
    const row = await this.prisma.mealTemplate.create({
      data: {
        userId,
        name: input.name,
        items: {
          create: input.items.map((item) => ({
            recipeId: item.recipeId,
            ingredientId: item.ingredientId,
            quantity: item.quantity,
            mealType: item.mealType,
          })),
        },
      },
      ...templateWithItems,
    });
    return toEntity(row);
  }

  async findById(id: string, userId: string): Promise<MealTemplateEntity | null> {
    const row = await this.prisma.mealTemplate.findFirst({
      where: { id, userId },
      ...templateWithItems,
    });
    return row ? toEntity(row) : null;
  }

  async findManyByUser(userId: string): Promise<MealTemplateEntity[]> {
    const rows = await this.prisma.mealTemplate.findMany({
      where: { userId },
      orderBy: { name: "asc" },
      ...templateWithItems,
    });
    return rows.map(toEntity);
  }
}
