import { Body, Controller, Get, Patch, UseGuards, UsePipes } from "@nestjs/common";
import { updateUserProfileSchema, UpdateUserProfileInput } from "@ihsan/contracts";
import { ClerkAuthGuard, AuthContext } from "../../../shared/guards/clerk-auth.guard";
import { CurrentAuth } from "../../../shared/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../../shared/pipes/zod-validation.pipe";
import { GetCurrentUserUseCase } from "../application/use-cases/get-current-user.use-case";
import { UpdateUserProfileUseCase } from "../application/use-cases/update-user-profile.use-case";

@Controller("me")
@UseGuards(ClerkAuthGuard)
export class UsersController {
  constructor(
    private readonly getCurrentUser: GetCurrentUserUseCase,
    private readonly updateUserProfile: UpdateUserProfileUseCase,
  ) {}

  @Get()
  async getMe(@CurrentAuth() auth: AuthContext) {
    return this.getCurrentUser.execute(auth.clerkId);
  }

  @Patch()
  @UsePipes(new ZodValidationPipe(updateUserProfileSchema))
  async updateMe(@CurrentAuth() auth: AuthContext, @Body() body: UpdateUserProfileInput) {
    return this.updateUserProfile.execute(auth.clerkId, body);
  }
}
