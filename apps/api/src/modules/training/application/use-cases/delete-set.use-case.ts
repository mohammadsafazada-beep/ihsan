import { Inject, Injectable } from "@nestjs/common";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { SESSION_REPOSITORY, SessionRepositoryPort } from "../ports/session.repository.port";
import { RecalculatePersonalRecordsUseCase } from "./recalculate-personal-records.use-case";

@Injectable()
export class DeleteSetUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY) private readonly sessions: SessionRepositoryPort,
    private readonly recalculatePersonalRecords: RecalculatePersonalRecordsUseCase,
  ) {}

  async execute(setId: string, userId: string): Promise<void> {
    const ownership = await this.sessions.findSetOwnership(setId);
    if (!ownership || ownership.userId !== userId) {
      throw new NotFoundError("SetLog", setId);
    }
    await this.sessions.deleteSet(setId);
    await this.recalculatePersonalRecords.execute(userId, ownership.exerciseId);
  }
}
