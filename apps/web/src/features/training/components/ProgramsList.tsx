"use client";

import { Button } from "@/components/ui/button";
import { useActivateProgram, usePrograms } from "../api/programs.api";

export function ProgramsList() {
  const { data: programs, isLoading } = usePrograms();
  const activateProgram = useActivateProgram();

  if (isLoading) return <p className="text-text-secondary">Loading programs...</p>;
  if (!programs || programs.length === 0) {
    return <p className="text-text-secondary">No programs yet — build your first one above.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {programs.map((program) => (
        <li key={program.id} className="flex flex-col gap-2 rounded-md border border-border bg-surface p-3">
          <div className="flex items-center justify-between">
            <p className="text-body font-medium">
              {program.name}
              {program.isActive && <span className="text-caption text-success"> · active</span>}
            </p>
            {!program.isActive && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={activateProgram.isPending}
                onClick={() => activateProgram.mutate(program.id)}
              >
                Activate
              </Button>
            )}
          </div>
          <p className="text-caption text-text-secondary">
            {program.days.map((day) => `${day.name} (${day.exercises.length} exercises)`).join(", ")}
          </p>
        </li>
      ))}
    </ul>
  );
}
