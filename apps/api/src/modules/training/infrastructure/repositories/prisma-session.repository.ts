import { Inject, Injectable } from "@nestjs/common";
import type { Prisma, PrismaClient } from "@ihsan/database";
import { CreateSessionInput, LogSetInput, UpdateSessionInput, UpdateSetInput } from "@ihsan/contracts";
import { PRISMA_CLIENT } from "../../../../shared/database/prisma.module";
import { WorkoutSessionEntity } from "../../domain/entities/workout-session.entity";
import {
  SessionRepositoryPort,
  SetLogRecord,
} from "../../application/ports/session.repository.port";

const sessionWithSets = {
  include: { setLogs: { orderBy: { createdAt: "asc" }, include: { exercise: true } } },
} satisfies Prisma.WorkoutSessionDefaultArgs;

type SessionRow = Prisma.WorkoutSessionGetPayload<typeof sessionWithSets>;

function toEntity(row: SessionRow): WorkoutSessionEntity {
  return new WorkoutSessionEntity(
    row.id,
    row.userId,
    row.date.toISOString().slice(0, 10),
    row.programId,
    row.workoutDayId,
    row.startedAt,
    row.completedAt,
    row.notes,
    row.setLogs.map((set) => ({
      id: set.id,
      exerciseId: set.exerciseId,
      exerciseName: set.exercise.name,
      setNumber: set.setNumber,
      reps: set.reps,
      weightKg: set.weightKg,
      rpe: set.rpe,
      isWarmup: set.isWarmup,
    })),
    row.createdAt,
  );
}

function toSetRecord(setLogId: string, workoutSessionId: string, set: {
  exerciseId: string;
  setNumber: number;
  reps: number;
  weightKg: number;
  rpe: number | null;
  isWarmup: boolean;
  createdAt: Date;
}): SetLogRecord {
  return {
    id: setLogId,
    workoutSessionId,
    exerciseId: set.exerciseId,
    setNumber: set.setNumber,
    reps: set.reps,
    weightKg: set.weightKg,
    rpe: set.rpe,
    isWarmup: set.isWarmup,
    createdAt: set.createdAt,
  };
}

@Injectable()
export class PrismaSessionRepository implements SessionRepositoryPort {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async create(userId: string, input: CreateSessionInput): Promise<WorkoutSessionEntity> {
    const row = await this.prisma.workoutSession.create({
      data: {
        userId,
        date: new Date(input.date),
        programId: input.programId,
        workoutDayId: input.workoutDayId,
        notes: input.notes,
        startedAt: new Date(),
      },
      ...sessionWithSets,
    });
    return toEntity(row);
  }

  async update(id: string, _userId: string, input: UpdateSessionInput): Promise<WorkoutSessionEntity> {
    const row = await this.prisma.workoutSession.update({
      where: { id },
      data: {
        notes: input.notes,
        completedAt: input.completedAt ? new Date(input.completedAt) : undefined,
      },
      ...sessionWithSets,
    });
    return toEntity(row);
  }

  async findById(id: string, userId: string): Promise<WorkoutSessionEntity | null> {
    const row = await this.prisma.workoutSession.findFirst({ where: { id, userId }, ...sessionWithSets });
    return row ? toEntity(row) : null;
  }

  async findManyByUserInRange(userId: string, from?: string, to?: string): Promise<WorkoutSessionEntity[]> {
    const rows = await this.prisma.workoutSession.findMany({
      where: {
        userId,
        date: {
          gte: from ? new Date(from) : undefined,
          lte: to ? new Date(to) : undefined,
        },
      },
      orderBy: { date: "desc" },
      ...sessionWithSets,
    });
    return rows.map(toEntity);
  }

  async addSet(sessionId: string, input: LogSetInput): Promise<SetLogRecord> {
    const set = await this.prisma.setLog.create({
      data: {
        workoutSessionId: sessionId,
        exerciseId: input.exerciseId,
        setNumber: input.setNumber,
        reps: input.reps,
        weightKg: input.weightKg,
        rpe: input.rpe,
        isWarmup: input.isWarmup,
      },
    });
    return toSetRecord(set.id, set.workoutSessionId, set);
  }

  async findSetOwnerUserId(setId: string): Promise<string | null> {
    const set = await this.prisma.setLog.findUnique({
      where: { id: setId },
      include: { workoutSession: { select: { userId: true } } },
    });
    return set?.workoutSession.userId ?? null;
  }

  async updateSet(setId: string, input: UpdateSetInput): Promise<SetLogRecord> {
    const set = await this.prisma.setLog.update({
      where: { id: setId },
      data: {
        exerciseId: input.exerciseId,
        setNumber: input.setNumber,
        reps: input.reps,
        weightKg: input.weightKg,
        rpe: input.rpe,
        isWarmup: input.isWarmup,
      },
    });
    return toSetRecord(set.id, set.workoutSessionId, set);
  }

  async deleteSet(setId: string): Promise<void> {
    await this.prisma.setLog.delete({ where: { id: setId } });
  }
}
