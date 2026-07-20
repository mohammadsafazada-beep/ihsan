import { Module } from "@nestjs/common";
import { UsersController } from "./presentation/users.controller";
import { ClerkWebhookController } from "./webhooks/clerk-webhook.controller";
import { GetCurrentUserUseCase } from "./application/use-cases/get-current-user.use-case";
import { UpdateUserProfileUseCase } from "./application/use-cases/update-user-profile.use-case";
import { SyncClerkUserUseCase } from "./application/use-cases/sync-clerk-user.use-case";
import { USER_REPOSITORY } from "./application/ports/user.repository.port";
import { PrismaUserRepository } from "./infrastructure/repositories/prisma-user.repository";

@Module({
  controllers: [UsersController, ClerkWebhookController],
  providers: [
    GetCurrentUserUseCase,
    UpdateUserProfileUseCase,
    SyncClerkUserUseCase,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
  ],
  exports: [GetCurrentUserUseCase],
})
export class UsersModule {}
