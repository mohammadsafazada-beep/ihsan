import { calculatePersonalRecords } from "./personal-record-calculator.service";

describe("calculatePersonalRecords", () => {
  it("returns no records when there are no working sets", () => {
    expect(calculatePersonalRecords([])).toEqual([]);
  });

  it("ignores warmup sets entirely", () => {
    const records = calculatePersonalRecords([
      { workoutSessionId: "s1", reps: 20, weightKg: 100, isWarmup: true },
    ]);
    expect(records).toEqual([]);
  });

  it("computes max weight as the heaviest working set", () => {
    const records = calculatePersonalRecords([
      { workoutSessionId: "s1", reps: 5, weightKg: 100, isWarmup: false },
      { workoutSessionId: "s1", reps: 5, weightKg: 120, isWarmup: false },
      { workoutSessionId: "s1", reps: 20, weightKg: 40, isWarmup: true },
    ]);
    expect(records.find((r) => r.type === "MAX_WEIGHT")).toEqual({ type: "MAX_WEIGHT", value: 120 });
  });

  it("computes estimated 1RM using the Epley formula, taking the best across all sets", () => {
    const records = calculatePersonalRecords([
      { workoutSessionId: "s1", reps: 5, weightKg: 100, isWarmup: false }, // 100 * (1 + 5/30) = 116.7
      { workoutSessionId: "s1", reps: 1, weightKg: 110, isWarmup: false }, // 110 * (1 + 1/30) = 113.7
    ]);
    expect(records.find((r) => r.type === "ESTIMATED_1RM")).toEqual({ type: "ESTIMATED_1RM", value: 116.7 });
  });

  it("computes max volume session as the highest total (weight * reps) within a single session", () => {
    const records = calculatePersonalRecords([
      // session s1: (100*5) + (100*5) = 1000
      { workoutSessionId: "s1", reps: 5, weightKg: 100, isWarmup: false },
      { workoutSessionId: "s1", reps: 5, weightKg: 100, isWarmup: false },
      // session s2: (110*5) = 550
      { workoutSessionId: "s2", reps: 5, weightKg: 110, isWarmup: false },
    ]);
    expect(records.find((r) => r.type === "MAX_VOLUME_SESSION")).toEqual({
      type: "MAX_VOLUME_SESSION",
      value: 1000,
    });
  });
});
