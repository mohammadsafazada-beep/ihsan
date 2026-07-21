import { Inject, Injectable } from "@nestjs/common";
import { CreateSessionInput } from "@ihsan/contracts";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { WorkoutSessionEntity } from "../../domain/entities/workout-session.entity";
import { PROGRAM_REPOSITORY, ProgramRepositoryPort } from "../ports/program.repository.port";
import { SESSION_REPOSITORY, SessionRepositoryPort } from "../ports/session.repository.port";

@Injectable()
export class CreateSessionUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY) private readonly sessions: SessionRepositoryPort,
    @Inject(PROGRAM_REPOSITORY) private readonly programs: ProgramRepositoryPort,
  ) {}

  async execute(userId: string, input: CreateSessionInput): Promise<WorkoutSessionEntity> {
    if (input.programId) {
      const program = await this.programs.findById(input.programId, userId);
      if (!program) {
        throw new NotFoundError("Program", input.programId);
      }
    }
    return this.sessions.create(userId, input);
  }
}
