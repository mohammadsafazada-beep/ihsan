import { Inject, Injectable } from "@nestjs/common";
import { CreateHabitInput } from "@ihsan/contracts";
import { HabitEntity } from "../../domain/entities/habit.entity";
import { HABIT_REPOSITORY, HabitRepositoryPort } from "../ports/habit.repository.port";

@Injectable()
export class CreateHabitUseCase {
  constructor(@Inject(HABIT_REPOSITORY) private readonly habits: HabitRepositoryPort) {}

  async execute(userId: string, input: CreateHabitInput): Promise<HabitEntity> {
    return this.habits.create(userId, input);
  }
}
