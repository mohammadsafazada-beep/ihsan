import { Body, Controller, Get, Post, UseGuards, UsePipes } from "@nestjs/common";
import { setNutritionTargetSchema, SetNutritionTargetInput } from "@ihsan/contracts";
import { ClerkAuthGuard } from "../../../shared/guards/clerk-auth.guard";
import { ResolveCurrentUserGuard } from "../../../shared/guards/resolve-current-user.guard";
import { CurrentUser } from "../../../shared/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../../shared/pipes/zod-validation.pipe";
import { UserEntity } from "../../users/domain/entities/user.entity";
import { SetNutritionTargetUseCase } from "../application/use-cases/set-nutrition-target.use-case";
import { ListNutritionTargetsUseCase } from "../application/use-cases/list-nutrition-targets.use-case";

@Controller("nutrition/targets")
@UseGuards(ClerkAuthGuard, ResolveCurrentUserGuard)
export class NutritionTargetController {
  constructor(
    private readonly setNutritionTarget: SetNutritionTargetUseCase,
    private readonly listNutritionTargets: ListNutritionTargetsUseCase,
  ) {}

  @Get()
  async list(@CurrentUser() user: UserEntity) {
    return this.listNutritionTargets.execute(user.id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(setNutritionTargetSchema))
  async set(@CurrentUser() user: UserEntity, @Body() body: SetNutritionTargetInput) {
    return this.setNutritionTarget.execute(user.id, body);
  }
}
