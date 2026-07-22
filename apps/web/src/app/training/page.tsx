"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppHeader } from "@/components/AppHeader";
import { todayDateString } from "@/lib/utils";
import { SessionRunner } from "@/features/training/components/SessionRunner";
import { ProgramForm } from "@/features/training/components/ProgramForm";
import { ProgramsList } from "@/features/training/components/ProgramsList";
import { ExerciseForm } from "@/features/training/components/ExerciseForm";
import { ExercisesList } from "@/features/training/components/ExercisesList";
import { PersonalRecordsList } from "@/features/training/components/PersonalRecordsList";

export default function TrainingPage() {
  const date = todayDateString();

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
        <h1 className="text-title font-semibold">Training</h1>

        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s session</CardTitle>
          </CardHeader>
          <CardContent>
            <SessionRunner date={date} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal records</CardTitle>
          </CardHeader>
          <CardContent>
            <PersonalRecordsList />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Programs</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <ProgramForm />
            <ProgramsList />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exercises</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <ExerciseForm />
            <ExercisesList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
