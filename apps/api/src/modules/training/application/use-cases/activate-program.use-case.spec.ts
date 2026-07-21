import { UpdateProgramInput } from "@ihsan/contracts";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { ProgramEntity } from "../../domain/entities/program.entity";
import { ProgramRepositoryPort } from "../ports/program.repository.port";
import { ActivateProgramUseCase } from "./activate-program.use-case";

class FakeProgramRepository implements ProgramRepositoryPort {
  public activateCalls: { id: string; userId: string }[] = [];

  constructor(private readonly programs: ProgramEntity[]) {}

  async create(): Promise<ProgramEntity> {
    throw new Error("not needed for this test");
  }
  async update(_id: string, _userId: string, _input: UpdateProgramInput): Promise<ProgramEntity> {
    throw new Error("not needed for this test");
  }
  async findById(id: string, userId: string): Promise<ProgramEntity | null> {
    return this.programs.find((p) => p.id === id && p.userId === userId) ?? null;
  }
  async findManyByUser(userId: string): Promise<ProgramEntity[]> {
    return this.programs.filter((p) => p.userId === userId);
  }
  async activateExclusive(id: string, userId: string): Promise<ProgramEntity> {
    this.activateCalls.push({ id, userId });
    const target = this.programs.find((p) => p.id === id)!;
    return new ProgramEntity(target.id, target.userId, target.name, true, target.days, target.createdAt);
  }
}

function makeProgram(id: string, userId: string, isActive: boolean): ProgramEntity {
  return new ProgramEntity(id, userId, `Program ${id}`, isActive, [], new Date());
}

describe("ActivateProgramUseCase", () => {
  it("activates the requested program when it belongs to the user", async () => {
    const repo = new FakeProgramRepository([makeProgram("p1", "user-1", false), makeProgram("p2", "user-1", true)]);
    const useCase = new ActivateProgramUseCase(repo);

    const result = await useCase.execute("p1", "user-1");

    expect(result.isActive).toBe(true);
    expect(repo.activateCalls).toEqual([{ id: "p1", userId: "user-1" }]);
  });

  it("refuses to activate a program belonging to a different user", async () => {
    const repo = new FakeProgramRepository([makeProgram("p1", "someone-else", false)]);
    const useCase = new ActivateProgramUseCase(repo);

    await expect(useCase.execute("p1", "user-1")).rejects.toThrow(NotFoundError);
    expect(repo.activateCalls).toHaveLength(0);
  });
});
