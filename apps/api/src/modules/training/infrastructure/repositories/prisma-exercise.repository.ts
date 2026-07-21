import { Inject, Injectable } from "@nestjs/common";
import type { PrismaClient } from "@ihsan/database";
import { CreateExerciseInput } from "@ihsan/contracts";
import { PRISMA_CLIENT } from "../../../../shared/database/prisma.module";
import { ExerciseEntity } from "../../domain/entities/exercise.entity";
import { ExerciseRepositoryPort } from "../../application/ports/exercise.repository.port";

type ExerciseRow = {
  id: string;
  userId: string | null;
  name: string;
  muscleGroup: string;
  equipment: string | null;
  createdAt: Date;
};

function toEntity(row: ExerciseRow): ExerciseEntity {
  return new ExerciseEntity(row.id, row.userId, row.name, row.muscleGroup, row.equipment, row.createdAt);
}

@Injectable()
export class PrismaExerciseRepository implements ExerciseRepositoryPort {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async create(userId: string, input: CreateExerciseInput): Promise<ExerciseEntity> {
    const row = await this.prisma.exercise.create({
      data: { userId, name: input.name, muscleGroup: input.muscleGroup, equipment: input.equipment },
    });
    return toEntity(row);
  }

  async findVisibleById(id: string, userId: string): Promise<ExerciseEntity | null> {
    const row = await this.prisma.exercise.findFirst({
      where: { id, OR: [{ userId: null }, { userId }] },
    });
    return row ? toEntity(row) : null;
  }

  async findManyVisibleToUser(userId: string): Promise<ExerciseEntity[]> {
    const rows = await this.prisma.exercise.findMany({
      where: { OR: [{ userId: null }, { userId }] },
      orderBy: { name: "asc" },
    });
    return rows.map(toEntity);
  }
}
