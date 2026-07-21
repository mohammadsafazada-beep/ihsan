import { Inject, Injectable } from "@nestjs/common";
import { ExerciseEntity } from "../../domain/entities/exercise.entity";
import { EXERCISE_REPOSITORY, ExerciseRepositoryPort } from "../ports/exercise.repository.port";

@Injectable()
export class ListExercisesUseCase {
  constructor(@Inject(EXERCISE_REPOSITORY) private readonly exercises: ExerciseRepositoryPort) {}

  async execute(userId: string): Promise<ExerciseEntity[]> {
    return this.exercises.findManyVisibleToUser(userId);
  }
}
