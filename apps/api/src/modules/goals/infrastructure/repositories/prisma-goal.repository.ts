import { Inject, Injectable } from "@nestjs/common";
import type { GoalStatus as PrismaGoalStatus, GoalType as PrismaGoalType, PrismaClient } from "@ihsan/database";
import { CreateGoalInput, UpdateGoalInput } from "@ihsan/contracts";
import { PRISMA_CLIENT } from "../../../../shared/database/prisma.module";
import { GoalEntity, GoalStatus, GoalType } from "../../domain/entities/goal.entity";
import { GoalRepositoryPort } from "../../application/ports/goal.repository.port";

type GoalRow = {
  id: string;
  userId: string;
  type: PrismaGoalType;
  startValue: number;
  targetValue: number;
  startDate: Date;
  targetDate: Date | null;
  status: PrismaGoalStatus;
  createdAt: Date;
};

function toEntity(row: GoalRow): GoalEntity {
  return new GoalEntity(
    row.id,
    row.userId,
    row.type as GoalType,
    row.startValue,
    row.targetValue,
    row.startDate.toISOString().slice(0, 10),
    row.targetDate ? row.targetDate.toISOString().slice(0, 10) : null,
    row.status as GoalStatus,
    row.createdAt,
  );
}

@Injectable()
export class PrismaGoalRepository implements GoalRepositoryPort {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async create(userId: string, input: CreateGoalInput): Promise<GoalEntity> {
    const row = await this.prisma.goal.create({
      data: {
        userId,
        type: input.type,
        startValue: input.startValue,
        targetValue: input.targetValue,
        startDate: new Date(input.startDate),
        targetDate: input.targetDate ? new Date(input.targetDate) : undefined,
      },
    });
    return toEntity(row);
  }

  async update(id: string, _userId: string, input: UpdateGoalInput): Promise<GoalEntity> {
    const row = await this.prisma.goal.update({
      where: { id },
      data: {
        targetValue: input.targetValue,
        targetDate: input.targetDate ? new Date(input.targetDate) : undefined,
        status: input.status,
      },
    });
    return toEntity(row);
  }

  async findById(id: string, userId: string): Promise<GoalEntity | null> {
    const row = await this.prisma.goal.findFirst({ where: { id, userId } });
    return row ? toEntity(row) : null;
  }

  async findActiveByType(userId: string, type: GoalType): Promise<GoalEntity | null> {
    const row = await this.prisma.goal.findFirst({ where: { userId, type, status: "ACTIVE" } });
    return row ? toEntity(row) : null;
  }

  async findManyByUser(userId: string): Promise<GoalEntity[]> {
    const rows = await this.prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toEntity);
  }

  async abandon(id: string): Promise<void> {
    await this.prisma.goal.update({ where: { id }, data: { status: "ABANDONED" } });
  }
}
