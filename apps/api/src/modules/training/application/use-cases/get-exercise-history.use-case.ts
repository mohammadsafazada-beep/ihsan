import { Inject, Injectable } from "@nestjs/common";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { EXERCISE_REPOSITORY, ExerciseRepositoryPort } from "../ports/exercise.repository.port";
import { SESSION_REPOSITORY, SessionRepositoryPort, SetHistoryEntry } from "../ports/session.repository.port";

@Injectable()
export class GetExerciseHistoryUseCase {
  constructor(
    @Inject(EXERCISE_REPOSITORY) private readonly exercises: ExerciseRepositoryPort,
    @Inject(SESSION_REPOSITORY) private readonly sessions: SessionRepositoryPort,
  ) {}

  async execute(exerciseId: string, userId: string): Promise<SetHistoryEntry[]> {
    const exercise = await this.exercises.findVisibleById(exerciseId, userId);
    if (!exercise) {
      throw new NotFoundError("Exercise", exerciseId);
    }
    return this.sessions.findSetHistoryForExercise(userId, exerciseId);
  }
}
