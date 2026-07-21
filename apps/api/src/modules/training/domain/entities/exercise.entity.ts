export class ExerciseEntity {
  constructor(
    public readonly id: string,
    /** null means this is a global catalog exercise, visible to every user. */
    public readonly userId: string | null,
    public readonly name: string,
    public readonly muscleGroup: string,
    public readonly equipment: string | null,
    public readonly createdAt: Date,
  ) {}
}
