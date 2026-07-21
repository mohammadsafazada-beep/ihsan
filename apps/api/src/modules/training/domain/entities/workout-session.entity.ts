export interface SetLogLine {
  id: string;
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  reps: number;
  weightKg: number;
  rpe: number | null;
  isWarmup: boolean;
}

export class WorkoutSessionEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly date: string,
    public readonly programId: string | null,
    public readonly workoutDayId: string | null,
    public readonly startedAt: Date | null,
    public readonly completedAt: Date | null,
    public readonly notes: string | null,
    public readonly setLogs: SetLogLine[],
    public readonly createdAt: Date,
  ) {}
}
