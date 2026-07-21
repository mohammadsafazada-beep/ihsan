import { Inject, Injectable } from "@nestjs/common";
import { calculateStreak } from "../../domain/services/streak-calculator.service";
import { HABIT_REPOSITORY, HabitRepositoryPort } from "../ports/habit.repository.port";

export interface HabitWithStatus {
  id: string;
  userId: string;
  name: string;
  isActive: boolean;
  completedToday: boolean;
  currentStreak: number;
  createdAt: Date;
}

@Injectable()
export class ListHabitsUseCase {
  constructor(@Inject(HABIT_REPOSITORY) private readonly habits: HabitRepositoryPort) {}

  async execute(userId: string, today: string): Promise<HabitWithStatus[]> {
    const habits = await this.habits.findManyActiveByUser(userId);
    return habits.map((habit) => ({
      id: habit.id,
      userId: habit.userId,
      name: habit.name,
      isActive: habit.isActive,
      completedToday: habit.completedDates.includes(today),
      currentStreak: calculateStreak(habit.completedDates, today),
      createdAt: habit.createdAt,
    }));
  }
}
