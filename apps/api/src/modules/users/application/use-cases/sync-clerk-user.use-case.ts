import { Inject, Injectable } from "@nestjs/common";
import { UserEntity } from "../../domain/entities/user.entity";
import {
  CreateOrUpdateUserInput,
  USER_REPOSITORY,
  UserRepositoryPort,
} from "../ports/user.repository.port";

@Injectable()
export class SyncClerkUserUseCase {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort) {}

  async execute(input: CreateOrUpdateUserInput): Promise<UserEntity> {
    return this.userRepository.upsertFromClerk(input);
  }
}
