import { Inject, Injectable } from "@nestjs/common";
import { LogHabitInput } from "@ihsan/contracts";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { HABIT_REPOSITORY, HabitRepositoryPort } from "../ports/habit.repository.port";

@Injectable()
export class LogHabitUseCase {
  constructor(@Inject(HABIT_REPOSITORY) private readonly habits: HabitRepositoryPort) {}

  async execute(habitId: string, userId: string, input: LogHabitInput): Promise<void> {
    const existing = await this.habits.findById(habitId, userId);
    if (!existing) {
      throw new NotFoundError("Habit", habitId);
    }
    await this.habits.upsertLog(habitId, input.date, input.completed);
  }
}
