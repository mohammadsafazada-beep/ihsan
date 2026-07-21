import { Inject, Injectable } from "@nestjs/common";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { SESSION_REPOSITORY, SessionRepositoryPort } from "../ports/session.repository.port";

@Injectable()
export class DeleteSetUseCase {
  constructor(@Inject(SESSION_REPOSITORY) private readonly sessions: SessionRepositoryPort) {}

  async execute(setId: string, userId: string): Promise<void> {
    const ownerUserId = await this.sessions.findSetOwnerUserId(setId);
    if (!ownerUserId || ownerUserId !== userId) {
      throw new NotFoundError("SetLog", setId);
    }
    await this.sessions.deleteSet(setId);
  }
}
