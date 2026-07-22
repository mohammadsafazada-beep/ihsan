import { suggestNextWeight } from "./progression-suggestor.service";

describe("suggestNextWeight", () => {
  it("suggests no weight when there is no prior session", () => {
    const result = suggestNextWeight([], 8, 12);
    expect(result.suggestedWeightKg).toBeNull();
    expect(result.reason).toMatch(/no previous session/i);
  });

  it("ignores warmup sets when deciding", () => {
    const result = suggestNextWeight(
      [{ reps: 20, weightKg: 40, isWarmup: true }],
      8,
      12,
    );
    expect(result.suggestedWeightKg).toBeNull();
  });

  it("suggests +2.5kg when every set hit the top of the rep range", () => {
    const result = suggestNextWeight(
      [
        { reps: 12, weightKg: 100, isWarmup: false },
        { reps: 13, weightKg: 100, isWarmup: false },
      ],
      8,
      12,
    );
    expect(result.suggestedWeightKg).toBe(102.5);
    expect(result.reason).toMatch(/\+2\.5kg/);
  });

  it("suggests -2.5kg when at least one set missed the bottom of the rep range", () => {
    const result = suggestNextWeight(
      [
        { reps: 10, weightKg: 100, isWarmup: false },
        { reps: 6, weightKg: 100, isWarmup: false },
      ],
      8,
      12,
    );
    expect(result.suggestedWeightKg).toBe(97.5);
    expect(result.reason).toMatch(/-2\.5kg/);
  });

  it("suggests the same weight when reps stayed within range without hitting the top", () => {
    const result = suggestNextWeight(
      [
        { reps: 9, weightKg: 100, isWarmup: false },
        { reps: 10, weightKg: 100, isWarmup: false },
      ],
      8,
      12,
    );
    expect(result.suggestedWeightKg).toBe(100);
    expect(result.reason).toMatch(/same weight/i);
  });

  it("never suggests a negative weight", () => {
    const result = suggestNextWeight([{ reps: 1, weightKg: 1, isWarmup: false }], 8, 12);
    expect(result.suggestedWeightKg).toBe(0);
  });

  it("bases the decision on the heaviest set performed, ignoring lighter back-off sets", () => {
    const result = suggestNextWeight(
      [
        { reps: 12, weightKg: 100, isWarmup: false },
        { reps: 15, weightKg: 80, isWarmup: false },
      ],
      8,
      12,
    );
    expect(result.suggestedWeightKg).toBe(102.5);
  });
});
