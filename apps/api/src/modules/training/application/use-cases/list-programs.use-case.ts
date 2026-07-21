import { Inject, Injectable } from "@nestjs/common";
import { ProgramEntity } from "../../domain/entities/program.entity";
import { PROGRAM_REPOSITORY, ProgramRepositoryPort } from "../ports/program.repository.port";

@Injectable()
export class ListProgramsUseCase {
  constructor(@Inject(PROGRAM_REPOSITORY) private readonly programs: ProgramRepositoryPort) {}

  async execute(userId: string): Promise<ProgramEntity[]> {
    return this.programs.findManyByUser(userId);
  }
}
