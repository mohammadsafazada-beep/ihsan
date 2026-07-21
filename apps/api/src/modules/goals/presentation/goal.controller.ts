import { Body, Controller, Get, Param, Patch, Post, UseGuards, UsePipes } from "@nestjs/common";
import { createGoalSchema, CreateGoalInput, updateGoalSchema, UpdateGoalInput } from "@ihsan/contracts";
import { ClerkAuthGuard } from "../../../shared/guards/clerk-auth.guard";
import { ResolveCurrentUserGuard } from "../../../shared/guards/resolve-current-user.guard";
import { CurrentUser } from "../../../shared/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../../shared/pipes/zod-validation.pipe";
import { UserEntity } from "../../users/domain/entities/user.entity";
import { CreateGoalUseCase } from "../application/use-cases/create-goal.use-case";
import { UpdateGoalUseCase } from "../application/use-cases/update-goal.use-case";
import { ListGoalsUseCase } from "../application/use-cases/list-goals.use-case";

@Controller("goals")
@UseGuards(ClerkAuthGuard, ResolveCurrentUserGuard)
export class GoalController {
  constructor(
    private readonly createGoal: CreateGoalUseCase,
    private readonly updateGoal: UpdateGoalUseCase,
    private readonly listGoals: ListGoalsUseCase,
  ) {}

  @Get()
  async list(@CurrentUser() user: UserEntity) {
    return this.listGoals.execute(user.id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createGoalSchema))
  async create(@CurrentUser() user: UserEntity, @Body() body: CreateGoalInput) {
    return this.createGoal.execute(user.id, body);
  }

  @Patch(":id")
  @UsePipes(new ZodValidationPipe(updateGoalSchema))
  async update(@CurrentUser() user: UserEntity, @Param("id") id: string, @Body() body: UpdateGoalInput) {
    return this.updateGoal.execute(id, user.id, body);
  }
}
