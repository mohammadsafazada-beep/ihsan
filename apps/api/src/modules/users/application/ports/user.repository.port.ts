import { UserEntity } from "../../domain/entities/user.entity";

export interface CreateOrUpdateUserInput {
  clerkId: string;
  email: string;
  name: string | null;
}

export interface UpdateUserProfileInput {
  name?: string;
  heightCm?: number;
  sex?: "MALE" | "FEMALE";
  weightUnit?: "KG" | "LB";
}

export const USER_REPOSITORY = "USER_REPOSITORY";

export interface UserRepositoryPort {
  findByClerkId(clerkId: string): Promise<UserEntity | null>;
  upsertFromClerk(input: CreateOrUpdateUserInput): Promise<UserEntity>;
  updateProfile(userId: string, input: UpdateUserProfileInput): Promise<UserEntity>;
}
