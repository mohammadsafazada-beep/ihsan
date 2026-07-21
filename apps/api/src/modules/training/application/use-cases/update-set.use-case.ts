import { Inject, Injectable } from "@nestjs/common";
import { UpdateSetInput } from "@ihsan/contracts";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { SESSION_REPOSITORY, SessionRepositoryPort, SetLogRecord } from "../ports/session.repository.port";

@Injectable()
export class UpdateSetUseCase {
  constructor(@Inject(SESSION_REPOSITORY) private readonly sessions: SessionRepositoryPort) {}

  async execute(setId: string, userId: string, input: UpdateSetInput): Promise<SetLogRecord> {
    const ownerUserId = await this.sessions.findSetOwnerUserId(setId);
    if (!ownerUserId || ownerUserId !== userId) {
      throw new NotFoundError("SetLog", setId);
    }
    return this.sessions.updateSet(setId, input);
  }
}
