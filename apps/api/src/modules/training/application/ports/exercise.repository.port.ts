import { CreateExerciseInput } from "@ihsan/contracts";
import { ExerciseEntity } from "../../domain/entities/exercise.entity";

export const EXERCISE_REPOSITORY = "EXERCISE_REPOSITORY";

export interface ExerciseRepositoryPort {
  create(userId: string, input: CreateExerciseInput): Promise<ExerciseEntity>;
  /** An exercise is visible to a user if it's global (userId null) or owned by them. */
  findVisibleById(id: string, userId: string): Promise<ExerciseEntity | null>;
  findManyVisibleToUser(userId: string): Promise<ExerciseEntity[]>;
}
