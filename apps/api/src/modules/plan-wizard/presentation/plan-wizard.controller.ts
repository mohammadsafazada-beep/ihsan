import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { applyPlanRequestSchema, ApplyPlanRequest, planIntakeSchema, PlanIntake } from "@ihsan/contracts";
import { ClerkAuthGuard } from "../../../shared/guards/clerk-auth.guard";
import { ResolveCurrentUserGuard } from "../../../shared/guards/resolve-current-user.guard";
import { CurrentUser } from "../../../shared/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../../shared/pipes/zod-validation.pipe";
import { todayDateString } from "../../../shared/utils/today.util";
import { UserEntity } from "../../users/domain/entities/user.entity";
import { GeneratePlanUseCase } from "../application/use-cases/generate-plan.use-case";
import { ApplyPlanUseCase } from "../application/use-cases/apply-plan.use-case";

@Controller("plan-wizard")
@UseGuards(ClerkAuthGuard, ResolveCurrentUserGuard)
export class PlanWizardController {
  constructor(
    private readonly generatePlan: GeneratePlanUseCase,
    private readonly applyPlan: ApplyPlanUseCase,
  ) {}

  @Post("generate")
  async generate(@CurrentUser() user: UserEntity, @Body(new ZodValidationPipe(planIntakeSchema)) body: PlanIntake) {
    return this.generatePlan.execute(user.id, body);
  }

  @Post("apply")
  async apply(
    @CurrentUser() user: UserEntity,
    @Body(new ZodValidationPipe(applyPlanRequestSchema)) body: ApplyPlanRequest,
  ) {
    return this.applyPlan.execute(user.id, body, todayDateString());
  }
}
