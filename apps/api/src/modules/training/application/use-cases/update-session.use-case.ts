import { Inject, Injectable } from "@nestjs/common";
import { UpdateSessionInput } from "@ihsan/contracts";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { WorkoutSessionEntity } from "../../domain/entities/workout-session.entity";
import { SESSION_REPOSITORY, SessionRepositoryPort } from "../ports/session.repository.port";

@Injectable()
export class UpdateSessionUseCase {
  constructor(@Inject(SESSION_REPOSITORY) private readonly sessions: SessionRepositoryPort) {}

  async execute(id: string, userId: string, input: UpdateSessionInput): Promise<WorkoutSessionEntity> {
    const existing = await this.sessions.findById(id, userId);
    if (!existing) {
      throw new NotFoundError("WorkoutSession", id);
    }
    return this.sessions.update(id, userId, input);
  }
}
