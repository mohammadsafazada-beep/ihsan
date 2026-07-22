"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { planIntakeSchema, type DietaryRestriction, type PlanIntake } from "@ihsan/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const DEFAULT_VALUES: PlanIntake = {
  daysPerWeek: 3,
  experienceLevel: "BEGINNER",
  trainingGoal: "GENERAL_FITNESS",
  physicalRestrictions: "",
  equipmentAccess: "FULL_GYM",
  jobType: "MODERATE",
  dietaryRestrictions: [],
  otherDietaryNotes: "",
  mealsPerDay: 3,
  weightGoalDirection: "MAINTAIN",
  targetWeightKg: null,
  age: 30,
  currentWeightKg: 75,
  heightCm: 175,
  sex: "MALE",
};

const DIETARY_OPTIONS: { value: DietaryRestriction; label: string }[] = [
  { value: "VEGETARIAN", label: "Vegetarian" },
  { value: "VEGAN", label: "Vegan" },
  { value: "GLUTEN_FREE", label: "Gluten-free" },
  { value: "DAIRY_FREE", label: "Dairy-free" },
  { value: "NUT_FREE", label: "Nut-free" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-caption font-medium uppercase text-text-tertiary">{title}</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">{children}</div>
    </div>
  );
}

export function PlanIntakeForm({
  defaultValues,
  isSubmitting,
  onSubmit,
}: {
  defaultValues?: PlanIntake;
  isSubmitting?: boolean;
  onSubmit: (intake: PlanIntake) => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PlanIntake>({
    resolver: zodResolver(planIntakeSchema),
    defaultValues: defaultValues ?? DEFAULT_VALUES,
  });

  const weightGoalDirection = watch("weightGoalDirection");
  const errorMessages = Object.values(errors)
    .map((error) => error?.message)
    .filter((message): message is string => Boolean(message));

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <Section title="Training">
        <Field label="Days per week">
          <Controller
            control={control}
            name="daysPerWeek"
            render={({ field }) => (
              <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field label="Experience">
          <Controller
            control={control}
            name="experienceLevel"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field label="Main goal">
          <Controller
            control={control}
            name="trainingGoal"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STRENGTH">Strength</SelectItem>
                  <SelectItem value="HYPERTROPHY">Muscle gain</SelectItem>
                  <SelectItem value="FAT_LOSS">Fat loss</SelectItem>
                  <SelectItem value="GENERAL_FITNESS">General fitness</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field label="Equipment access">
          <Controller
            control={control}
            name="equipmentAccess"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FULL_GYM">Full gym</SelectItem>
                  <SelectItem value="BASIC_HOME">Basic home equipment</SelectItem>
                  <SelectItem value="BODYWEIGHT_ONLY">Bodyweight only</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field label="Physical restrictions (optional)">
          <Input placeholder="e.g. bad knee" {...register("physicalRestrictions")} />
        </Field>

        <Field label="Job type">
          <Controller
            control={control}
            name="jobType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEDENTARY">Desk job</SelectItem>
                  <SelectItem value="MODERATE">On my feet</SelectItem>
                  <SelectItem value="PHYSICAL">Physical labor</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </Section>

      <Section title="Body stats">
        <Field label="Age">
          <Input type="number" {...register("age", { valueAsNumber: true })} />
        </Field>
        <Field label="Current weight (kg)">
          <Input type="number" step="0.1" {...register("currentWeightKg", { valueAsNumber: true })} />
        </Field>
        <Field label="Height (cm)">
          <Input type="number" {...register("heightCm", { valueAsNumber: true })} />
        </Field>
        <Field label="Sex">
          <Controller
            control={control}
            name="sex"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </Section>

      <div className="flex flex-col gap-3">
        <h3 className="text-caption font-medium uppercase text-text-tertiary">Nutrition</h3>
        <Controller
          control={control}
          name="dietaryRestrictions"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((option) => {
                const checked = field.value.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      field.onChange(
                        checked
                          ? field.value.filter((r) => r !== option.value)
                          : [...field.value, option.value],
                      )
                    }
                    className={cn(
                      "rounded-full border px-3 py-1 text-caption",
                      checked
                        ? "border-brand bg-brand text-brand-foreground"
                        : "border-border bg-surface text-text-secondary",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="Meals per day">
            <Controller
              control={control}
              name="mealsPerDay"
              render={({ field }) => (
                <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 3, 4, 5, 6].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field label="Other dietary notes (optional)">
            <Input placeholder="e.g. no pork" {...register("otherDietaryNotes")} />
          </Field>
        </div>
      </div>

      <Section title="Weight goal">
        <Field label="Direction">
          <Controller
            control={control}
            name="weightGoalDirection"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOSE">Lose weight</SelectItem>
                  <SelectItem value="GAIN">Gain weight</SelectItem>
                  <SelectItem value="MAINTAIN">Maintain</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        {weightGoalDirection !== "MAINTAIN" && (
          <Field label="Target weight (kg)">
            <Input
              type="number"
              step="0.1"
              {...register("targetWeightKg", { valueAsNumber: true })}
            />
          </Field>
        )}
      </Section>

      {errorMessages.length > 0 && (
        <div className="rounded-md border border-destructive/50 bg-surface px-3 py-2">
          {errorMessages.map((message, index) => (
            <p key={index} className="text-caption text-destructive">
              {message}
            </p>
          ))}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Building your plan..." : "Build my plan"}
      </Button>
    </form>
  );
}
