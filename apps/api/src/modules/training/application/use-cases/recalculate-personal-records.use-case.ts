import { Inject, Injectable } from "@nestjs/common";
import { calculatePersonalRecords } from "../../domain/services/personal-record-calculator.service";
import { SESSION_REPOSITORY, SessionRepositoryPort } from "../ports/session.repository.port";
import {
  PERSONAL_RECORD_REPOSITORY,
  PersonalRecordRepositoryPort,
} from "../ports/personal-record.repository.port";

@Injectable()
export class RecalculatePersonalRecordsUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY) private readonly sessions: SessionRepositoryPort,
    @Inject(PERSONAL_RECORD_REPOSITORY) private readonly personalRecords: PersonalRecordRepositoryPort,
  ) {}

  async execute(userId: string, exerciseId: string): Promise<void> {
    const history = await this.sessions.findSetHistoryForExercise(userId, exerciseId);
    const records = calculatePersonalRecords(
      history.map((entry) => ({
        workoutSessionId: entry.workoutSessionId,
        reps: entry.reps,
        weightKg: entry.weightKg,
        isWarmup: entry.isWarmup,
      })),
    );
    await this.personalRecords.replaceForExercise(userId, exerciseId, records);
  }
}
