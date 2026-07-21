import { CreateHabitInput, UpdateHabitInput } from "@ihsan/contracts";
import { HabitEntity } from "../../domain/entities/habit.entity";

export const HABIT_REPOSITORY = "HABIT_REPOSITORY";

export interface HabitRepositoryPort {
  create(userId: string, input: CreateHabitInput): Promise<HabitEntity>;
  update(id: string, userId: string, input: UpdateHabitInput): Promise<HabitEntity>;
  findById(id: string, userId: string): Promise<HabitEntity | null>;
  findManyActiveByUser(userId: string): Promise<HabitEntity[]>;
  upsertLog(habitId: string, date: string, completed: boolean): Promise<void>;
}
