export interface PrescribedExerciseLine {
  id: string;
  exerciseId: string;
  exerciseName: string;
  order: number;
  targetSets: number;
  targetRepsMin: number;
  targetRepsMax: number;
  restSeconds: number | null;
}

export interface WorkoutDayLine {
  id: string;
  name: string;
  dayOrder: number;
  exercises: PrescribedExerciseLine[];
}

export class ProgramEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly isActive: boolean,
    public readonly days: WorkoutDayLine[],
    public readonly createdAt: Date,
  ) {}
}
