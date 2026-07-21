"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppHeader } from "@/components/AppHeader";
import { HabitsList } from "@/features/habits/components/HabitsList";
import { HabitForm } from "@/features/habits/components/HabitForm";
import { WeightGoalCard } from "@/features/goals/components/WeightGoalCard";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
        <h1 className="text-title font-semibold">Dashboard</h1>

        <Card>
          <CardHeader>
            <CardTitle>Weight goal</CardTitle>
          </CardHeader>
          <CardContent>
            <WeightGoalCard />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s habits</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <HabitsList />
            <HabitForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nutrition</CardTitle>
          </CardHeader>
          <CardContent className="text-text-secondary">
            Training, Progress, and the AI Coach land in upcoming sprints (see{" "}
            <code>docs/05-development-roadmap.md</code>). Head to{" "}
            <a href="/nutrition" className="text-brand underline">
              Nutrition
            </a>{" "}
            to log meals and manage recipes.
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
