"use client";

import { Control, Controller, useFieldArray, useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProgramSchema, type CreateProgramInput } from "@ihsan/contracts";
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
import { useCreateProgram } from "../api/programs.api";

function DayFields({
  control,
  register,
  dayIndex,
  onRemoveDay,
}: {
  control: Control<CreateProgramInput>;
  register: UseFormRegister<CreateProgramInput>;
  dayIndex: number;
  onRemoveDay: () => void;
}) {
  const { data: exercises } = useExercises();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `days.${dayIndex}.exercises`,
  });

  return (
    <div className="flex flex-col gap-3 rounded-md border border-border p-3">
      <div className="flex items-end gap-3">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label>Day name</Label>
          <Input placeholder="e.g. Push Day" {...register(`days.${dayIndex}.name`)} />
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onRemoveDay}>
          Remove day
        </Button>
      </div>

      {fields.map((field, exerciseIndex) => (
        <div key={field.id} className="flex flex-wrap items-end gap-2 rounded-md bg-surface p-2">
          <div className="flex min-w-40 flex-1 flex-col gap-1.5">
            <Label className="text-caption text-text-tertiary">Exercise</Label>
            <Controller
              control={control}
              name={`days.${dayIndex}.exercises.${exerciseIndex}.exerciseId`}
              render={({ field: selectField }) => (
                <Select value={selectField.value} onValueChange={selectField.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an exercise" />
                  </SelectTrigger>
                  <SelectContent>
                    {exercises?.map((exercise) => (
                      <SelectItem key={exercise.id} value={exercise.id}>
                        {exercise.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex w-20 flex-col gap-1.5">
            <Label className="text-caption text-text-tertiary">Sets</Label>
            <Input
              type="number"
              min={1}
              {...register(`days.${dayIndex}.exercises.${exerciseIndex}.targetSets`, {
                valueAsNumber: true,
              })}
            />
          </div>
          <div className="flex w-20 flex-col gap-1.5">
            <Label className="text-caption text-text-tertiary">Min reps</Label>
            <Input
              type="number"
              min={1}
              {...register(`days.${dayIndex}.exercises.${exerciseIndex}.targetRepsMin`, {
                valueAsNumber: true,
              })}
            />
          </div>
          <div className="flex w-20 flex-col gap-1.5">
            <Label className="text-caption text-text-tertiary">Max reps</Label>
            <Input
              type="number"
              min={1}
              {...register(`days.${dayIndex}.exercises.${exerciseIndex}.targetRepsMax`, {
                valueAsNumber: true,
              })}
            />
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => remove(exerciseIndex)}>
            Remove
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        onClick={() =>
          append({
            exerciseId: "",
            order: fields.length,
            targetSets: 3,
            targetRepsMin: 8,
            targetRepsMax: 12,
          })
        }
      >
        Add exercise
      </Button>
    </div>
  );
}

export function ProgramForm() {
  const createProgram = useCreateProgram();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProgramInput>({
    resolver: zodResolver(createProgramSchema),
    defaultValues: { name: "", days: [] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "days" });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit((values) => createProgram.mutate(values, { onSuccess: () => reset() }))}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="program-name">Program name</Label>
        <Input id="program-name" placeholder="e.g. Upper/Lower — Summer" {...register("name")} />
        {errors.name && <p className="text-caption text-danger">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-3">
        <Label>Days</Label>
        {fields.map((field, dayIndex) => (
          <DayFields
            key={field.id}
            control={control}
            register={register}
            dayIndex={dayIndex}
            onRemoveDay={() => remove(dayIndex)}
          />
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => append({ name: "", dayOrder: fields.length, exercises: [] })}
        >
          Add day
        </Button>
        {errors.days && <p className="text-caption text-danger">{errors.days.message as string}</p>}
      </div>

      <Button type="submit" disabled={createProgram.isPending || fields.length === 0} className="self-start">
        {createProgram.isPending ? "Saving..." : "Save program"}
      </Button>
    </form>
  );
}
