import { Inject, Injectable } from "@nestjs/common";
import type { PrismaClient } from "@ihsan/database";
import { PRISMA_CLIENT } from "../../../../shared/database/prisma.module";
import {
  NutritionTargetRepositoryPort,
  NutritionTargetSnapshot,
} from "../../application/ports/nutrition-target.repository.port";

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
}
