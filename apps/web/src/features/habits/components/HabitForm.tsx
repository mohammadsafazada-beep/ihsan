"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateHabit } from "../api/habits.api";

export function HabitForm() {
  const [name, setName] = useState("");
  const createHabit = useCreateHabit();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    createHabit.mutate({ name: name.trim() }, { onSuccess: () => setName("") });
  }

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <Input
        placeholder="e.g. 10k steps, no alcohol, read 20 min"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" disabled={createHabit.isPending || !name.trim()}>
        {createHabit.isPending ? "Adding..." : "Add habit"}
      </Button>
    </form>
  );
}
