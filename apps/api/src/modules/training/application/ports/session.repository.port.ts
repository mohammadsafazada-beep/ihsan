import { CreateSessionInput, LogSetInput, UpdateSessionInput, UpdateSetInput } from "@ihsan/contracts";
import { WorkoutSessionEntity } from "../../domain/entities/workout-session.entity";

export const SESSION_REPOSITORY = "SESSION_REPOSITORY";

export interface SetLogRecord {
  id: string;
  workoutSessionId: string;
  exerciseId: string;
  setNumber: number;
  reps: number;
  weightKg: number;
  rpe: number | null;
  isWarmup: boolean;
  createdAt: Date;
}

export interface SetOwnership {
  userId: string;
  exerciseId: string;
}

export interface SetHistoryEntry {
  workoutSessionId: string;
  date: string;
  setNumber: number;
  reps: number;
  weightKg: number;
  rpe: number | null;
  isWarmup: boolean;
}

export interface SessionRepositoryPort {
  create(userId: string, input: CreateSessionInput): Promise<WorkoutSessionEntity>;
  update(id: string, userId: string, input: UpdateSessionInput): Promise<WorkoutSessionEntity>;
  findById(id: string, userId: string): Promise<WorkoutSessionEntity | null>;
  findManyByUserInRange(userId: string, from?: string, to?: string): Promise<WorkoutSessionEntity[]>;
  addSet(sessionId: string, input: LogSetInput): Promise<SetLogRecord>;
  /** Resolves a set's owning session's userId + its exerciseId, for ownership checks and PR recalculation. */
  findSetOwnership(setId: string): Promise<SetOwnership | null>;
  updateSet(setId: string, input: UpdateSetInput): Promise<SetLogRecord>;
  deleteSet(setId: string): Promise<void>;
  /** Full set history for one exercise across all of the user's sessions, newest first. */
  findSetHistoryForExercise(userId: string, exerciseId: string): Promise<SetHistoryEntry[]>;
  /** Non-warmup sets for this exercise from the most recent session tied to this workout day, or null if none yet. */
  findLastSessionSetsForWorkoutDayExercise(
    userId: string,
    workoutDayId: string,
    exerciseId: string,
  ): Promise<{ reps: number; weightKg: number; isWarmup: boolean }[] | null>;
}
