import { Inject, Injectable } from "@nestjs/common";
import type { Prisma, PrismaClient } from "@ihsan/database";
import { CreateProgramInput, UpdateProgramInput } from "@ihsan/contracts";
import { PRISMA_CLIENT } from "../../../../shared/database/prisma.module";
import { ProgramEntity } from "../../domain/entities/program.entity";
import { ProgramRepositoryPort } from "../../application/ports/program.repository.port";

const programWithDays = {
  include: {
    days: {
      orderBy: { dayOrder: "asc" },
      include: { exercises: { orderBy: { order: "asc" }, include: { exercise: true } } },
    },
  },
} satisfies Prisma.WorkoutProgramDefaultArgs;

type ProgramRow = Prisma.WorkoutProgramGetPayload<typeof programWithDays>;

function toEntity(row: ProgramRow): ProgramEntity {
  return new ProgramEntity(
    row.id,
    row.userId,
    row.name,
    row.isActive,
    row.days.map((day) => ({
      id: day.id,
      name: day.name,
      dayOrder: day.dayOrder,
      exercises: day.exercises.map((line) => ({
        id: line.id,
        exerciseId: line.exerciseId,
        exerciseName: line.exercise.name,
        order: line.order,
        targetSets: line.targetSets,
        targetRepsMin: line.targetRepsMin,
        targetRepsMax: line.targetRepsMax,
        restSeconds: line.restSeconds,
      })),
    })),
    row.createdAt,
  );
}

@Injectable()
export class PrismaProgramRepository implements ProgramRepositoryPort {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async create(userId: string, input: CreateProgramInput): Promise<ProgramEntity> {
    const row = await this.prisma.workoutProgram.create({
      data: {
        userId,
        name: input.name,
        days: {
          create: input.days.map((day) => ({
            name: day.name,
            dayOrder: day.dayOrder,
            exercises: {
              create: day.exercises.map((exercise) => ({
                exerciseId: exercise.exerciseId,
                order: exercise.order,
                targetSets: exercise.targetSets,
                targetRepsMin: exercise.targetRepsMin,
                targetRepsMax: exercise.targetRepsMax,
                restSeconds: exercise.restSeconds,
              })),
            },
          })),
        },
      },
      ...programWithDays,
    });
    return toEntity(row);
  }

  async update(id: string, _userId: string, input: UpdateProgramInput): Promise<ProgramEntity> {
    const row = await this.prisma.$transaction(async (tx) => {
      if (input.days) {
        await tx.workoutDay.deleteMany({ where: { programId: id } });
      }
      return tx.workoutProgram.update({
        where: { id },
        data: {
          name: input.name,
          days: input.days
            ? {
                create: input.days.map((day) => ({
                  name: day.name,
                  dayOrder: day.dayOrder,
                  exercises: {
                    create: day.exercises.map((exercise) => ({
                      exerciseId: exercise.exerciseId,
                      order: exercise.order,
                      targetSets: exercise.targetSets,
                      targetRepsMin: exercise.targetRepsMin,
                      targetRepsMax: exercise.targetRepsMax,
                      restSeconds: exercise.restSeconds,
                    })),
                  },
                })),
              }
            : undefined,
        },
        ...programWithDays,
      });
    });
    return toEntity(row);
  }

  async findById(id: string, userId: string): Promise<ProgramEntity | null> {
    const row = await this.prisma.workoutProgram.findFirst({ where: { id, userId }, ...programWithDays });
    return row ? toEntity(row) : null;
  }

  async findManyByUser(userId: string): Promise<ProgramEntity[]> {
    const rows = await this.prisma.workoutProgram.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      ...programWithDays,
    });
    return rows.map(toEntity);
  }

  async activateExclusive(id: string, userId: string): Promise<ProgramEntity> {
    const row = await this.prisma.$transaction(async (tx) => {
      await tx.workoutProgram.updateMany({ where: { userId }, data: { isActive: false } });
      return tx.workoutProgram.update({ where: { id }, data: { isActive: true }, ...programWithDays });
    });
    return toEntity(row);
  }
}
