import { Inject, Injectable } from "@nestjs/common";
import { CreateExerciseInput } from "@ihsan/contracts";
import { ExerciseEntity } from "../../domain/entities/exercise.entity";
import { EXERCISE_REPOSITORY, ExerciseRepositoryPort } from "../ports/exercise.repository.port";

@Injectable()
export class CreateExerciseUseCase {
  constructor(@Inject(EXERCISE_REPOSITORY) private readonly exercises: ExerciseRepositoryPort) {}

  async execute(userId: string, input: CreateExerciseInput): Promise<ExerciseEntity> {
    return this.exercises.create(userId, input);
  }
}
