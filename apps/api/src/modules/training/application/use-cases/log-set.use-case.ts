import { Inject, Injectable } from "@nestjs/common";
import { LogSetInput } from "@ihsan/contracts";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { EXERCISE_REPOSITORY, ExerciseRepositoryPort } from "../ports/exercise.repository.port";
import { SESSION_REPOSITORY, SessionRepositoryPort, SetLogRecord } from "../ports/session.repository.port";
import { RecalculatePersonalRecordsUseCase } from "./recalculate-personal-records.use-case";

@Injectable()
export class LogSetUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY) private readonly sessions: SessionRepositoryPort,
    @Inject(EXERCISE_REPOSITORY) private readonly exercises: ExerciseRepositoryPort,
    private readonly recalculatePersonalRecords: RecalculatePersonalRecordsUseCase,
  ) {}

  async execute(sessionId: string, userId: string, input: LogSetInput): Promise<SetLogRecord> {
    const session = await this.sessions.findById(sessionId, userId);
    if (!session) {
      throw new NotFoundError("WorkoutSession", sessionId);
    }
    const exercise = await this.exercises.findVisibleById(input.exerciseId, userId);
    if (!exercise) {
      throw new NotFoundError("Exercise", input.exerciseId);
    }
    const set = await this.sessions.addSet(sessionId, input);
    await this.recalculatePersonalRecords.execute(userId, input.exerciseId);
    return set;
  }
}
