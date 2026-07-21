import { Inject, Injectable } from "@nestjs/common";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { ProgramEntity } from "../../domain/entities/program.entity";
import { PROGRAM_REPOSITORY, ProgramRepositoryPort } from "../ports/program.repository.port";

@Injectable()
export class ActivateProgramUseCase {
  constructor(@Inject(PROGRAM_REPOSITORY) private readonly programs: ProgramRepositoryPort) {}

  async execute(id: string, userId: string): Promise<ProgramEntity> {
    const existing = await this.programs.findById(id, userId);
    if (!existing) {
      throw new NotFoundError("Program", id);
    }
    return this.programs.activateExclusive(id, userId);
  }
}
