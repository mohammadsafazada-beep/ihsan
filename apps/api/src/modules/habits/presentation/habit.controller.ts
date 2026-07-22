import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import {
  createHabitSchema,
  CreateHabitInput,
  updateHabitSchema,
  UpdateHabitInput,
  logHabitSchema,
  LogHabitInput,
} from "@ihsan/contracts";
import { ClerkAuthGuard } from "../../../shared/guards/clerk-auth.guard";
import { ResolveCurrentUserGuard } from "../../../shared/guards/resolve-current-user.guard";
import { CurrentUser } from "../../../shared/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../../shared/pipes/zod-validation.pipe";
import { todayDateString } from "../../../shared/utils/today.util";
import { UserEntity } from "../../users/domain/entities/user.entity";
import { CreateHabitUseCase } from "../application/use-cases/create-habit.use-case";
import { UpdateHabitUseCase } from "../application/use-cases/update-habit.use-case";
import { LogHabitUseCase } from "../application/use-cases/log-habit.use-case";
import { ListHabitsUseCase } from "../application/use-cases/list-habits.use-case";

@Controller("habits")
@UseGuards(ClerkAuthGuard, ResolveCurrentUserGuard)
export class HabitController {
  constructor(
    private readonly createHabit: CreateHabitUseCase,
    private readonly updateHabit: UpdateHabitUseCase,
    private readonly logHabit: LogHabitUseCase,
    private readonly listHabits: ListHabitsUseCase,
  ) {}

  @Get()
  async list(@CurrentUser() user: UserEntity) {
    return this.listHabits.execute(user.id, todayDateString());
  }

  @Post()
  async create(
    @CurrentUser() user: UserEntity,
    @Body(new ZodValidationPipe(createHabitSchema)) body: CreateHabitInput,
  ) {
    return this.createHabit.execute(user.id, body);
  }

  @Patch(":id")
  async update(
    @CurrentUser() user: UserEntity,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateHabitSchema)) body: UpdateHabitInput,
  ) {
    return this.updateHabit.execute(id, user.id, body);
  }

  @Post(":id/logs")
  async log(
    @CurrentUser() user: UserEntity,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(logHabitSchema)) body: LogHabitInput,
  ) {
    await this.logHabit.execute(id, user.id, body);
    return { logged: true };
  }
}
