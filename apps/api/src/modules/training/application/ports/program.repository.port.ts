import { CreateProgramInput, UpdateProgramInput } from "@ihsan/contracts";
import { ProgramEntity } from "../../domain/entities/program.entity";

export const PROGRAM_REPOSITORY = "PROGRAM_REPOSITORY";

export interface ProgramRepositoryPort {
  create(userId: string, input: CreateProgramInput): Promise<ProgramEntity>;
  update(id: string, userId: string, input: UpdateProgramInput): Promise<ProgramEntity>;
  findById(id: string, userId: string): Promise<ProgramEntity | null>;
  findManyByUser(userId: string): Promise<ProgramEntity[]>;
  /** Deactivates every other program for the user, then activates this one. */
  activateExclusive(id: string, userId: string): Promise<ProgramEntity>;
}
