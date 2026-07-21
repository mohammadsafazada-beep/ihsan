import { Inject, Injectable } from "@nestjs/common";
import type { PrismaClient } from "@ihsan/database";
import { SetNutritionTargetInput } from "@ihsan/contracts";
import { PRISMA_CLIENT } from "../../../../shared/database/prisma.module";
import {
  NutritionTargetRecord,
  NutritionTargetRepositoryPort,
  NutritionTargetSnapshot,
} from "../../application/ports/nutrition-target.repository.port";

type TargetRow = {
  id: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  effectiveFrom: Date;
  createdAt: Date;
};

function toRecord(row: TargetRow): NutritionTargetRecord {
  return {
    id: row.id,
    calories: row.calories,
    proteinGrams: row.proteinGrams,
    carbsGrams: row.carbsGrams,
    fatGrams: row.fatGrams,
    effectiveFrom: row.effectiveFrom.toISOString().slice(0, 10),
    createdAt: row.createdAt,
  };
}

@Injectable()
export class PrismaNutritionTargetRepository implements NutritionTargetRepositoryPort {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async findActiveForDate(userId: string, date: string): Promise<NutritionTargetSnapshot | null> {
    const row = await this.prisma.nutritionTarget.findFirst({
      where: { userId, effectiveFrom: { lte: new Date(date) } },
      orderBy: { effectiveFrom: "desc" },
    });
    if (!row) return null;
    return {
      calories: row.calories,
      proteinGrams: row.proteinGrams,
      carbsGrams: row.carbsGrams,
      fatGrams: row.fatGrams,
    };
  }

  async create(userId: string, input: SetNutritionTargetInput): Promise<NutritionTargetRecord> {
    const row = await this.prisma.nutritionTarget.create({
      data: {
        userId,
        calories: input.calories,
        proteinGrams: input.proteinGrams,
        carbsGrams: input.carbsGrams,
        fatGrams: input.fatGrams,
        effectiveFrom: new Date(input.effectiveFrom),
      },
    });
    return toRecord(row);
  }

  async findManyByUser(userId: string): Promise<NutritionTargetRecord[]> {
    const rows = await this.prisma.nutritionTarget.findMany({
      where: { userId },
      orderBy: { effectiveFrom: "desc" },
    });
    return rows.map(toRecord);
  }
}
