import { Inject, Injectable } from "@nestjs/common";
import type { PrismaClient } from "@ihsan/database";
import { PRISMA_CLIENT } from "../../../../shared/database/prisma.module";
import { UserEntity } from "../../domain/entities/user.entity";
import {
  CreateOrUpdateUserInput,
  UpdateUserProfileInput,
  UserRepositoryPort,
} from "../../application/ports/user.repository.port";

type PrismaUserRow = {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  heightCm: number | null;
  sex: "MALE" | "FEMALE" | null;
  weightUnit: "KG" | "LB";
};

function toEntity(row: PrismaUserRow): UserEntity {
  return new UserEntity(row.id, row.clerkId, row.email, row.name, row.heightCm, row.sex, row.weightUnit);
}

@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async findByClerkId(clerkId: string): Promise<UserEntity | null> {
    const row = await this.prisma.user.findUnique({ where: { clerkId } });
    return row ? toEntity(row) : null;
  }

  async upsertFromClerk(input: CreateOrUpdateUserInput): Promise<UserEntity> {
    const row = await this.prisma.user.upsert({
      where: { clerkId: input.clerkId },
      create: { clerkId: input.clerkId, email: input.email, name: input.name },
      update: { email: input.email, name: input.name },
    });
    return toEntity(row);
  }

  async updateProfile(userId: string, input: UpdateUserProfileInput): Promise<UserEntity> {
    const row = await this.prisma.user.update({
      where: { id: userId },
      data: input,
    });
    return toEntity(row);
  }
}
