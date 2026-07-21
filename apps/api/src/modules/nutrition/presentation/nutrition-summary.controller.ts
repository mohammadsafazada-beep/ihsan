import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { calendarDateSchema } from "@ihsan/contracts";
import { ClerkAuthGuard } from "../../../shared/guards/clerk-auth.guard";
import { ResolveCurrentUserGuard } from "../../../shared/guards/resolve-current-user.guard";
import { CurrentUser } from "../../../shared/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../../shared/pipes/zod-validation.pipe";
import { UserEntity } from "../../users/domain/entities/user.entity";
import { GetDailyMacroSummaryUseCase } from "../application/use-cases/get-daily-macro-summary.use-case";

@Controller("nutrition")
@UseGuards(ClerkAuthGuard, ResolveCurrentUserGuard)
export class NutritionSummaryController {
  constructor(private readonly getDailyMacroSummary: GetDailyMacroSummaryUseCase) {}

  @Get("summary")
  async summary(
    @CurrentUser() user: UserEntity,
    @Query("date", new ZodValidationPipe(calendarDateSchema)) date: string,
  ) {
    return this.getDailyMacroSummary.execute(user.id, date);
  }
}
