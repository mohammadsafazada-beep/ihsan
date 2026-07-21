"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { todayDateString } from "@/lib/utils";
import { useCreateGoal, useGoals } from "../api/goals.api";

export function WeightGoalCard() {
  const { data: goals, isLoading } = useGoals();
  const createGoal = useCreateGoal();
  const [showForm, setShowForm] = useState(false);
  const [startValue, setStartValue] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const activeGoal = goals?.find((g) => g.type === "WEIGHT" && g.status === "ACTIVE");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!startValue || !targetValue) return;
    createGoal.mutate(
      {
        type: "WEIGHT",
        startValue: Number(startValue),
        targetValue: Number(targetValue),
        startDate: todayDateString(),
        targetDate: targetDate || undefined,
      },
      {
        onSuccess: () => {
          setShowForm(false);
          setStartValue("");
          setTargetValue("");
          setTargetDate("");
        },
      },
    );
  }

  if (isLoading) return <p className="text-text-secondary">Loading goal...</p>;

  return (
    <div className="flex flex-col gap-3">
      {activeGoal ? (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-body font-medium">
              {activeGoal.startValue}kg <span className="text-text-tertiary">&rarr;</span>{" "}
              {activeGoal.targetValue}kg
            </p>
            {activeGoal.targetDate && (
              <p className="text-caption text-text-secondary">by {activeGoal.targetDate}</p>
            )}
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Cancel" : "Update goal"}
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-text-secondary">No weight goal set yet.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Cancel" : "Set a goal"}
          </Button>
        </div>
      )}

      {showForm && (
        <form className="flex flex-wrap items-end gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label>Current weight (kg)</Label>
            <Input
              type="number"
              step="0.1"
              className="w-32"
              value={startValue}
              onChange={(e) => setStartValue(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Target weight (kg)</Label>
            <Input
              type="number"
              step="0.1"
              className="w-32"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Target date (optional)</Label>
            <Input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
          </div>
          <Button type="submit" disabled={createGoal.isPending || !startValue || !targetValue}>
            {createGoal.isPending ? "Saving..." : "Save goal"}
          </Button>
        </form>
      )}
    </div>
  );
}
