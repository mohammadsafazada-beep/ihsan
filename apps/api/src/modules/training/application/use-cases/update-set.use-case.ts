import { Inject, Injectable } from "@nestjs/common";
import { UpdateSetInput } from "@ihsan/contracts";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { SESSION_REPOSITORY, SessionRepositoryPort, SetLogRecord } from "../ports/session.repository.port";
import { RecalculatePersonalRecordsUseCase } from "./recalculate-personal-records.use-case";

@Injectable()
export class UpdateSetUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY) private readonly sessions: SessionRepositoryPort,
    private readonly recalculatePersonalRecords: RecalculatePersonalRecordsUseCase,
  ) {}

  async execute(setId: string, userId: string, input: UpdateSetInput): Promise<SetLogRecord> {
    const ownership = await this.sessions.findSetOwnership(setId);
    if (!ownership || ownership.userId !== userId) {
      throw new NotFoundError("SetLog", setId);
    }
    const updated = await this.sessions.updateSet(setId, input);
    await this.recalculatePersonalRecords.execute(userId, updated.exerciseId);
    if (input.exerciseId && input.exerciseId !== ownership.exerciseId) {
      await this.recalculatePersonalRecords.execute(userId, ownership.exerciseId);
    }
    return updated;
  }
}
