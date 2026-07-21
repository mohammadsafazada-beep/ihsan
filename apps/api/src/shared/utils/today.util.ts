/** Server's notion of "today" as a calendar date string (YYYY-MM-DD), UTC-based. */
export function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}
