export class HabitEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly isActive: boolean,
    /** Dates (YYYY-MM-DD) this habit was logged completed, most recent first. */
    public readonly completedDates: string[],
    public readonly createdAt: Date,
  ) {}
}
