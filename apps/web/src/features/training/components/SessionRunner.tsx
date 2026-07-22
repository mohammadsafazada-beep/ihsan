"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useExercises } from "../api/exercises.api";
import { usePrograms } from "../api/programs.api";
import { useCreateSession, useDeleteSet, useLogSet, useSessionsForDate } from "../api/sessions.api";
import { useNextSuggestion } from "../api/suggestions.api";

function StartSessionForm({ date }: { date: string }) {
  const { data: programs } = usePrograms();
  const createSession = useCreateSession(date);
  const activeProgram = programs?.find((p) => p.isActive);
  const [dayId, setDayId] = useState<string>("");

  return (
    <div className="flex flex-wrap items-end gap-3">
      {activeProgram && activeProgram.days.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <Label>Workout day (optional)</Label>
          <Select value={dayId} onValueChange={setDayId}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Freestyle session" />
            </SelectTrigger>
            <SelectContent>
              {activeProgram.days.map((day) => (
                <SelectItem key={day.id} value={day.id}>
                  {day.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <Button
        type="button"
        onClick={() =>
          createSession.mutate({
            date,
            programId: dayId ? activeProgram?.id : undefined,
            workoutDayId: dayId || undefined,
          })
        }
        disabled={createSession.isPending}
      >
        {createSession.isPending ? "Starting..." : "Start today's session"}
      </Button>
    </div>
  );
}

function SuggestionHint({
  programId,
  workoutDayId,
  exerciseId,
  onUseSuggestion,
}: {
  programId: string;
  workoutDayId: string;
  exerciseId: string;
  onUseSuggestion: (weightKg: number) => void;
}) {
  const { data: suggestion, isLoading } = useNextSuggestion(programId, workoutDayId, exerciseId);

  if (isLoading || !suggestion) return null;

  return (
    <div className="flex items-center gap-2 text-caption text-text-secondary">
      <span>{suggestion.reason}</span>
      {suggestion.suggestedWeightKg !== null && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onUseSuggestion(suggestion.suggestedWeightKg!)}
        >
          Use {suggestion.suggestedWeightKg}kg
        </Button>
      )}
    </div>
  );
}

export function SessionRunner({ date }: { date: string }) {
  const { data: sessions, isLoading } = useSessionsForDate(date);
  const { data: exercises } = useExercises();
  const { data: programs } = usePrograms();
  const logSet = useLogSet(date);
  const deleteSet = useDeleteSet(date);

  const [exerciseId, setExerciseId] = useState("");
  const [reps, setReps] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [rpe, setRpe] = useState("");

  const session = sessions?.[0];
  const activeProgram = programs?.find((p) => p.isActive);
  const day = session?.workoutDayId
    ? activeProgram?.days.find((d) => d.id === session.workoutDayId)
    : undefined;
  const prescribedExerciseIds = new Set(day?.exercises.map((e) => e.exerciseId) ?? []);

  function handleLogSet(event: React.FormEvent) {
    event.preventDefault();
    if (!session || !exerciseId || !reps || !weightKg) return;
    const setsForExercise = session.setLogs.filter((s) => s.exerciseId === exerciseId);
    logSet.mutate({
      sessionId: session.id,
      input: {
        exerciseId,
        setNumber: setsForExercise.length + 1,
        reps: Number(reps),
        weightKg: Number(weightKg),
        rpe: rpe ? Number(rpe) : undefined,
        isWarmup: false,
      },
    });
    setReps("");
    setWeightKg("");
    setRpe("");
  }

  if (isLoading) return <p className="text-text-secondary">Loading today&apos;s session...</p>;

  if (!session) {
    return <StartSessionForm date={date} />;
  }

  const exerciseName = (id: string) => exercises?.find((e) => e.id === id)?.name ?? "Unknown";

  return (
    <div className="flex flex-col gap-4">
      <form className="flex flex-wrap items-end gap-3" onSubmit={handleLogSet}>
        <div className="flex flex-col gap-1.5">
          <Label>Exercise</Label>
          <Select value={exerciseId} onValueChange={setExerciseId}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Choose" />
            </SelectTrigger>
            <SelectContent>
              {exercises?.map((exercise) => (
                <SelectItem key={exercise.id} value={exercise.id}>
                  {exercise.name}
                  {prescribedExerciseIds.has(exercise.id) ? " ★" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Reps</Label>
          <Input type="number" className="w-20" value={reps} onChange={(e) => setReps(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Weight (kg)</Label>
          <Input
            type="number"
            step="0.5"
            className="w-24"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>RPE (optional)</Label>
          <Input
            type="number"
            min={1}
            max={10}
            className="w-20"
            value={rpe}
            onChange={(e) => setRpe(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={logSet.isPending || !exerciseId || !reps || !weightKg}>
          {logSet.isPending ? "Logging..." : "Log set"}
        </Button>
      </form>

      {session.programId && session.workoutDayId && exerciseId && prescribedExerciseIds.has(exerciseId) && (
        <SuggestionHint
          programId={session.programId}
          workoutDayId={session.workoutDayId}
          exerciseId={exerciseId}
          onUseSuggestion={(weight) => setWeightKg(String(weight))}
        />
      )}

      {session.setLogs.length === 0 ? (
        <p className="text-text-secondary">No sets logged yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {session.setLogs.map((set) => (
            <li
              key={set.id}
              className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2"
            >
              <p className="text-body">
                {exerciseName(set.exerciseId)}{" "}
                <span className="text-text-tertiary">
                  · Set {set.setNumber} · {set.reps} reps @ {set.weightKg}kg
                  {set.rpe ? ` · RPE ${set.rpe}` : ""}
                </span>
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={deleteSet.isPending}
                onClick={() => deleteSet.mutate(set.id)}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
