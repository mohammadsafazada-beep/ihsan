export type Sex = "MALE" | "FEMALE";
export type WeightUnit = "KG" | "LB";

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly clerkId: string,
    public readonly email: string,
    public readonly name: string | null,
    public readonly heightCm: number | null,
    public readonly sex: Sex | null,
    public readonly weightUnit: WeightUnit,
  ) {}
}
