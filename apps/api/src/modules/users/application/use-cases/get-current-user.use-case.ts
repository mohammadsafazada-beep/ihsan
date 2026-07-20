import { Inject, Injectable } from "@nestjs/common";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { UserEntity } from "../../domain/entities/user.entity";
import { USER_REPOSITORY, UserRepositoryPort } from "../ports/user.repository.port";

@Injectable()
export class GetCurrentUserUseCase {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort) {}

  async execute(clerkId: string): Promise<UserEntity> {
    const user = await this.userRepository.findByClerkId(clerkId);
    if (!user) {
      throw new NotFoundError("User", clerkId);
    }
    return user;
  }
}
