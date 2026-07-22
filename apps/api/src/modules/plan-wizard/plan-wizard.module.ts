import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { TrainingModule } from "../training/training.module";
import { NutritionModule } from "../nutrition/nutrition.module";
import { GoalsModule } from "../goals/goals.module";
import { ResolveCurrentUserGuard } from "../../shared/guards/resolve-current-user.guard";

import { PlanWizardController } from "./presentation/plan-wizard.controller";

import { GeneratePlanUseCase } from "./application/use-cases/generate-plan.use-case";
import { ApplyPlanUseCase } from "./application/use-cases/apply-plan.use-case";

@Module({
  imports: [UsersModule, TrainingModule, NutritionModule, GoalsModule],
  controllers: [PlanWizardController],
  providers: [ResolveCurrentUserGuard, GeneratePlanUseCase, ApplyPlanUseCase],
})
export class PlanWizardModule {}
