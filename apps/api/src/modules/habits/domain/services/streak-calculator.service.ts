function shiftDate(dateStr: string, days: number): string {
  const parts = dateStr.split("-").map(Number);
  const year = parts[0] ?? 0;
  const month = parts[1] ?? 1;
  const day = parts[2] ?? 1;
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * Consecutive completed days ending today. If today isn't logged yet, counting
 * starts from yesterday instead — the day isn't over, so it shouldn't break the streak.
 */
export function calculateStreak(completedDates: string[], today: string): number {
  const completed = new Set(completedDates);
  let cursor = completed.has(today) ? today : shiftDate(today, -1);
  let streak = 0;
  while (completed.has(cursor)) {
    streak++;
    cursor = shiftDate(cursor, -1);
  }
  return streak;
}
