import { Inject, Injectable } from "@nestjs/common";
import { UpdateHabitInput } from "@ihsan/contracts";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { HabitEntity } from "../../domain/entities/habit.entity";
import { HABIT_REPOSITORY, HabitRepositoryPort } from "../ports/habit.repository.port";

@Injectable()
export class UpdateHabitUseCase {
  constructor(@Inject(HABIT_REPOSITORY) private readonly habits: HabitRepositoryPort) {}

  async execute(id: string, userId: string, input: UpdateHabitInput): Promise<HabitEntity> {
    const existing = await this.habits.findById(id, userId);
    if (!existing) {
      throw new NotFoundError("Habit", id);
    }
    return this.habits.update(id, userId, input);
  }
}
