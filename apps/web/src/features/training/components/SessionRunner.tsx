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
import { useCreateSession, useDeleteSet, useLogSet, useSessionsForDate } from "../api/sessions.api";

export function SessionRunner({ date }: { date: string }) {
  const { data: sessions, isLoading } = useSessionsForDate(date);
  const { data: exercises } = useExercises();
  const createSession = useCreateSession(date);
  const logSet = useLogSet(date);
  const deleteSet = useDeleteSet(date);

  const [exerciseId, setExerciseId] = useState("");
  const [reps, setReps] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [rpe, setRpe] = useState("");

  const session = sessions?.[0];

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
    return (
      <Button type="button" onClick={() => createSession.mutate({ date })} disabled={createSession.isPending}>
        {createSession.isPending ? "Starting..." : "Start today's session"}
      </Button>
    );
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
