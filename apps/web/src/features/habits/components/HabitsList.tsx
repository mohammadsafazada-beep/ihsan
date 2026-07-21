"use client";

import { Button } from "@/components/ui/button";
import { todayDateString } from "@/lib/utils";
import { useHabits, useLogHabit } from "../api/habits.api";

export function HabitsList() {
  const { data: habits, isLoading } = useHabits();
  const logHabit = useLogHabit();

  if (isLoading) return <p className="text-text-secondary">Loading habits...</p>;
  if (!habits || habits.length === 0) {
    return <p className="text-text-secondary">No habits yet — add your first one below.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {habits.map((habit) => (
        <li
          key={habit.id}
          className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2"
        >
          <div>
            <p className="text-body font-medium">{habit.name}</p>
            <p className="text-caption text-text-secondary">
              {habit.currentStreak > 0
                ? `${habit.currentStreak} day streak`
                : "No current streak"}
            </p>
          </div>
          <Button
            type="button"
            variant={habit.completedToday ? "default" : "outline"}
            size="sm"
            disabled={logHabit.isPending}
            onClick={() =>
              logHabit.mutate({
                habitId: habit.id,
                input: { date: todayDateString(), completed: !habit.completedToday },
              })
            }
          >
            {habit.completedToday ? "Done today" : "Mark done"}
          </Button>
        </li>
      ))}
    </ul>
  );
}
