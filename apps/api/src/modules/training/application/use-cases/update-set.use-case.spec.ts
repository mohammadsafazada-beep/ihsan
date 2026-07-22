import { CreateSessionInput, LogSetInput, UpdateSetInput } from "@ihsan/contracts";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { WorkoutSessionEntity } from "../../domain/entities/workout-session.entity";
import {
  SessionRepositoryPort,
  SetHistoryEntry,
  SetLogRecord,
  SetOwnership,
} from "../ports/session.repository.port";
import {
  PersonalRecordEntry,
  PersonalRecordRepositoryPort,
} from "../ports/personal-record.repository.port";
import { RecalculatePersonalRecordsUseCase } from "./recalculate-personal-records.use-case";
import { UpdateSetUseCase } from "./update-set.use-case";

class FakePersonalRecordRepository implements PersonalRecordRepositoryPort {
  async replaceForExercise(): Promise<void> {}
  async findManyByUser(): Promise<PersonalRecordEntry[]> {
    return [];
  }
}

class FakeSessionRepository implements SessionRepositoryPort {
  public updateSetCalls: { setId: string; input: UpdateSetInput }[] = [];

  constructor(private readonly setOwners: Record<string, SetOwnership>) {}

  async create(_userId: string, _input: CreateSessionInput): Promise<WorkoutSessionEntity> {
    throw new Error("not needed for this test");
  }
  async update(): Promise<WorkoutSessionEntity> {
    throw new Error("not needed for this test");
  }
  async findById(): Promise<WorkoutSessionEntity | null> {
    throw new Error("not needed for this test");
  }
  async findManyByUserInRange(): Promise<WorkoutSessionEntity[]> {
    throw new Error("not needed for this test");
  }
  async addSet(_sessionId: string, _input: LogSetInput): Promise<SetLogRecord> {
    throw new Error("not needed for this test");
  }
  async findSetOwnership(setId: string): Promise<SetOwnership | null> {
    return this.setOwners[setId] ?? null;
  }
  async findSetHistoryForExercise(): Promise<SetHistoryEntry[]> {
    return [];
  }
  async findLastSessionSetsForWorkoutDayExercise(): Promise<
    { reps: number; weightKg: number; isWarmup: boolean }[] | null
  > {
    throw new Error("not needed for this test");
  }
  async updateSet(setId: string, input: UpdateSetInput): Promise<SetLogRecord> {
    this.updateSetCalls.push({ setId, input });
    return {
      id: setId,
      workoutSessionId: "session-1",
      exerciseId: input.exerciseId ?? "exercise-1",
      setNumber: input.setNumber ?? 1,
      reps: input.reps ?? 10,
      weightKg: input.weightKg ?? 20,
      rpe: input.rpe ?? null,
      isWarmup: input.isWarmup ?? false,
      createdAt: new Date(),
    };
  }
  async deleteSet(): Promise<void> {
    throw new Error("not needed for this test");
  }
}

function makeUseCase(repo: FakeSessionRepository): UpdateSetUseCase {
  const recalculate = new RecalculatePersonalRecordsUseCase(repo, new FakePersonalRecordRepository());
  return new UpdateSetUseCase(repo, recalculate);
}

describe("UpdateSetUseCase", () => {
  it("updates a set that belongs to the requesting user", async () => {
    const repo = new FakeSessionRepository({ "set-1": { userId: "user-1", exerciseId: "exercise-1" } });
    const useCase = makeUseCase(repo);

    const result = await useCase.execute("set-1", "user-1", { reps: 12 });

    expect(result.reps).toBe(12);
    expect(repo.updateSetCalls).toEqual([{ setId: "set-1", input: { reps: 12 } }]);
  });

  it("refuses to update a set that belongs to a different user", async () => {
    const repo = new FakeSessionRepository({
      "set-1": { userId: "someone-else", exerciseId: "exercise-1" },
    });
    const useCase = makeUseCase(repo);

    await expect(useCase.execute("set-1", "user-1", { reps: 12 })).rejects.toThrow(NotFoundError);
    expect(repo.updateSetCalls).toHaveLength(0);
  });

  it("refuses to update a set that doesn't exist", async () => {
    const repo = new FakeSessionRepository({});
    const useCase = makeUseCase(repo);

    await expect(useCase.execute("does-not-exist", "user-1", { reps: 12 })).rejects.toThrow(NotFoundError);
  });
});
