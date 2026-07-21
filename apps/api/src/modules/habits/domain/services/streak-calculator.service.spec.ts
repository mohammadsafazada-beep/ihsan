import { calculateStreak } from "./streak-calculator.service";

describe("calculateStreak", () => {
  it("counts consecutive days ending today when today is completed", () => {
    const dates = ["2026-01-01", "2026-01-02", "2026-01-03"];
    expect(calculateStreak(dates, "2026-01-03")).toBe(3);
  });

  it("counts from yesterday without penalty when today isn't logged yet", () => {
    const dates = ["2026-01-01", "2026-01-02", "2026-01-03"];
    expect(calculateStreak(dates, "2026-01-04")).toBe(3);
  });

  it("breaks the streak at the first gap", () => {
    const dates = ["2026-01-01", "2026-01-03"];
    expect(calculateStreak(dates, "2026-01-03")).toBe(1);
  });

  it("returns 0 when there is no completion today or yesterday", () => {
    const dates = ["2026-01-01"];
    expect(calculateStreak(dates, "2026-01-05")).toBe(0);
  });

  it("returns 0 for a habit with no completions at all", () => {
    expect(calculateStreak([], "2026-01-05")).toBe(0);
  });

  it("handles a streak that crosses a month boundary", () => {
    const dates = ["2026-01-30", "2026-01-31", "2026-02-01"];
    expect(calculateStreak(dates, "2026-02-01")).toBe(3);
  });
});
