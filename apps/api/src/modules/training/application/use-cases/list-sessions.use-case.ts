import { Inject, Injectable } from "@nestjs/common";
import { WorkoutSessionEntity } from "../../domain/entities/workout-session.entity";
import { SESSION_REPOSITORY, SessionRepositoryPort } from "../ports/session.repository.port";

@Injectable()
export class ListSessionsUseCase {
  constructor(@Inject(SESSION_REPOSITORY) private readonly sessions: SessionRepositoryPort) {}

  async execute(userId: string, from?: string, to?: string): Promise<WorkoutSessionEntity[]> {
    return this.sessions.findManyByUserInRange(userId, from, to);
  }
}
