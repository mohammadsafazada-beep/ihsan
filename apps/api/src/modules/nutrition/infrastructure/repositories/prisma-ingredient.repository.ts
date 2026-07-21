import { Inject, Injectable } from "@nestjs/common";
import type { Ingredient as IngredientRow, PrismaClient } from "@ihsan/database";
import { CreateIngredientInput, UpdateIngredientInput } from "@ihsan/contracts";
import { PRISMA_CLIENT } from "../../../../shared/database/prisma.module";
import { ConflictError } from "../../../../shared/errors/domain-errors";
import { IngredientEntity } from "../../domain/entities/ingredient.entity";
import { IngredientRepositoryPort } from "../../application/ports/ingredient.repository.port";

function toEntity(row: IngredientRow): IngredientEntity {
  return new IngredientEntity(
    row.id,
    row.userId,
    row.name,
    {
      calories: row.caloriesPer100g,
      proteinGrams: row.proteinPer100g,
      carbsGrams: row.carbsPer100g,
      fatGrams: row.fatPer100g,
    },
    row.createdAt,
  );
}

@Injectable()
export class PrismaIngredientRepository implements IngredientRepositoryPort {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async create(userId: string, input: CreateIngredientInput): Promise<IngredientEntity> {
    const row = await this.prisma.ingredient.create({
      data: {
        userId,
        name: input.name,
        caloriesPer100g: input.caloriesPer100g,
        proteinPer100g: input.proteinPer100g,
        carbsPer100g: input.carbsPer100g,
        fatPer100g: input.fatPer100g,
      },
    });
    return toEntity(row);
  }

  async update(id: string, userId: string, input: UpdateIngredientInput): Promise<IngredientEntity> {
    const row = await this.prisma.ingredient.update({
      where: { id },
      data: {
        name: input.name,
        caloriesPer100g: input.caloriesPer100g,
        proteinPer100g: input.proteinPer100g,
        carbsPer100g: input.carbsPer100g,
        fatPer100g: input.fatPer100g,
      },
    });
    return toEntity(row);
  }

  async delete(id: string, _userId: string): Promise<void> {
    try {
      await this.prisma.ingredient.delete({ where: { id } });
    } catch (error) {
      if (isForeignKeyConstraintError(error)) {
        throw new ConflictError(
          "This ingredient is used by a recipe or logged meal and can't be deleted.",
        );
      }
      throw error;
    }
  }

  async findById(id: string, userId: string): Promise<IngredientEntity | null> {
    const row = await this.prisma.ingredient.findFirst({ where: { id, userId } });
    return row ? toEntity(row) : null;
  }

  async findManyByUser(userId: string): Promise<IngredientEntity[]> {
    const rows = await this.prisma.ingredient.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });
    return rows.map(toEntity);
  }
}

function isForeignKeyConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && (error as { code?: string }).code === "P2003";
}
