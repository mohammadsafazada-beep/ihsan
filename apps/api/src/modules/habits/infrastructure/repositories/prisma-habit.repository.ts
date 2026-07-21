import { Inject, Injectable } from "@nestjs/common";
import type { Prisma, PrismaClient } from "@ihsan/database";
import { CreateHabitInput, UpdateHabitInput } from "@ihsan/contracts";
import { PRISMA_CLIENT } from "../../../../shared/database/prisma.module";
import { HabitEntity } from "../../domain/entities/habit.entity";
import { HabitRepositoryPort } from "../../application/ports/habit.repository.port";

const habitWithLogs = {
  include: { logs: { where: { completed: true } } },
} satisfies Prisma.HabitDefaultArgs;

type HabitRow = Prisma.HabitGetPayload<typeof habitWithLogs>;

function toEntity(row: HabitRow): HabitEntity {
  return new HabitEntity(
    row.id,
    row.userId,
    row.name,
    row.isActive,
    row.logs.map((log) => log.date.toISOString().slice(0, 10)),
    row.createdAt,
  );
}

@Injectable()
export class PrismaHabitRepository implements HabitRepositoryPort {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async create(userId: string, input: CreateHabitInput): Promise<HabitEntity> {
    const row = await this.prisma.habit.create({
      data: { userId, name: input.name },
      ...habitWithLogs,
    });
    return toEntity(row);
  }

  async update(id: string, _userId: string, input: UpdateHabitInput): Promise<HabitEntity> {
    const row = await this.prisma.habit.update({
      where: { id },
      data: { name: input.name, isActive: input.isActive },
      ...habitWithLogs,
    });
    return toEntity(row);
  }

  async findById(id: string, userId: string): Promise<HabitEntity | null> {
    const row = await this.prisma.habit.findFirst({ where: { id, userId }, ...habitWithLogs });
    return row ? toEntity(row) : null;
  }

  async findManyActiveByUser(userId: string): Promise<HabitEntity[]> {
    const rows = await this.prisma.habit.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: "asc" },
      ...habitWithLogs,
    });
    return rows.map(toEntity);
  }

  async upsertLog(habitId: string, date: string, completed: boolean): Promise<void> {
    await this.prisma.habitLog.upsert({
      where: { habitId_date: { habitId, date: new Date(date) } },
      create: { habitId, date: new Date(date), completed },
      update: { completed },
    });
  }
}
