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

export interface SessionRepositoryPort {
  create(userId: string, input: CreateSessionInput): Promise<WorkoutSessionEntity>;
  update(id: string, userId: string, input: UpdateSessionInput): Promise<WorkoutSessionEntity>;
  findById(id: string, userId: string): Promise<WorkoutSessionEntity | null>;
  findManyByUserInRange(userId: string, from?: string, to?: string): Promise<WorkoutSessionEntity[]>;
  addSet(sessionId: string, input: LogSetInput): Promise<SetLogRecord>;
  /** Resolves a set's owning session's userId, for ownership checks on top-level /sets/:id routes. */
  findSetOwnerUserId(setId: string): Promise<string | null>;
  updateSet(setId: string, input: UpdateSetInput): Promise<SetLogRecord>;
  deleteSet(setId: string): Promise<void>;
}
