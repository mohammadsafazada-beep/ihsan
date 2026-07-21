export type GoalType = "WEIGHT" | "BODY_FAT_PERCENT";
export type GoalStatus = "ACTIVE" | "ACHIEVED" | "ABANDONED";

export class GoalEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly type: GoalType,
    public readonly startValue: number,
    public readonly targetValue: number,
    public readonly startDate: string,
    public readonly targetDate: string | null,
    public readonly status: GoalStatus,
    public readonly createdAt: Date,
  ) {}
}
