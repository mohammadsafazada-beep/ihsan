import { Inject, Injectable } from "@nestjs/common";
import { CreateProgramInput } from "@ihsan/contracts";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { ProgramEntity } from "../../domain/entities/program.entity";
import { EXERCISE_REPOSITORY, ExerciseRepositoryPort } from "../ports/exercise.repository.port";
import { PROGRAM_REPOSITORY, ProgramRepositoryPort } from "../ports/program.repository.port";

@Injectable()
export class CreateProgramUseCase {
  constructor(
    @Inject(PROGRAM_REPOSITORY) private readonly programs: ProgramRepositoryPort,
    @Inject(EXERCISE_REPOSITORY) private readonly exercises: ExerciseRepositoryPort,
  ) {}

  async execute(userId: string, input: CreateProgramInput): Promise<ProgramEntity> {
    const exerciseIds = new Set(input.days.flatMap((day) => day.exercises.map((e) => e.exerciseId)));
    for (const exerciseId of exerciseIds) {
      const exercise = await this.exercises.findVisibleById(exerciseId, userId);
      if (!exercise) {
        throw new NotFoundError("Exercise", exerciseId);
      }
    }
    return this.programs.create(userId, input);
  }
}
