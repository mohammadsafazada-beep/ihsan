import { Inject, Injectable } from "@nestjs/common";
import type { PrismaClient } from "@ihsan/database";
import { PRISMA_CLIENT } from "../../../../shared/database/prisma.module";
import { PersonalRecordValue } from "../../domain/services/personal-record-calculator.service";
import {
  PersonalRecordEntry,
  PersonalRecordRepositoryPort,
} from "../../application/ports/personal-record.repository.port";

@Injectable()
export class PrismaPersonalRecordRepository implements PersonalRecordRepositoryPort {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async replaceForExercise(userId: string, exerciseId: string, records: PersonalRecordValue[]): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.personalRecord.deleteMany({ where: { userId, exerciseId } });
      if (records.length === 0) return;
      const achievedAt = new Date();
      await tx.personalRecord.createMany({
        data: records.map((record) => ({
          userId,
          exerciseId,
          type: record.type,
          value: record.value,
          achievedAt,
        })),
      });
    });
  }

  async findManyByUser(userId: string): Promise<PersonalRecordEntry[]> {
    const rows = await this.prisma.personalRecord.findMany({
      where: { userId },
      include: { exercise: true },
      orderBy: { achievedAt: "desc" },
    });
    return rows.map((row) => ({
      id: row.id,
      exerciseId: row.exerciseId,
      exerciseName: row.exercise.name,
      type: row.type,
      value: row.value,
      achievedAt: row.achievedAt,
    }));
  }
}
