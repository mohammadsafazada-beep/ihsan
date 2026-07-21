import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UsePipes } from "@nestjs/common";
import {
  createMealSchema,
  CreateMealInput,
  updateMealSchema,
  UpdateMealInput,
  calendarDateSchema,
} from "@ihsan/contracts";
import { ClerkAuthGuard } from "../../../shared/guards/clerk-auth.guard";
import { ResolveCurrentUserGuard } from "../../../shared/guards/resolve-current-user.guard";
import { CurrentUser } from "../../../shared/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../../shared/pipes/zod-validation.pipe";
import { UserEntity } from "../../users/domain/entities/user.entity";
import { LogMealUseCase } from "../application/use-cases/log-meal.use-case";
import { UpdateMealUseCase } from "../application/use-cases/update-meal.use-case";
import { DeleteMealUseCase } from "../application/use-cases/delete-meal.use-case";
import { ListMealsByDateUseCase } from "../application/use-cases/list-meals-by-date.use-case";
import { toMealDto } from "./nutrition.mapper";

@Controller("meals")
@UseGuards(ClerkAuthGuard, ResolveCurrentUserGuard)
export class MealController {
  constructor(
    private readonly logMeal: LogMealUseCase,
    private readonly updateMeal: UpdateMealUseCase,
    private readonly deleteMeal: DeleteMealUseCase,
    private readonly listMealsByDate: ListMealsByDateUseCase,
  ) {}

  @Get()
  async list(
    @CurrentUser() user: UserEntity,
    @Query("date", new ZodValidationPipe(calendarDateSchema)) date: string,
  ) {
    const meals = await this.listMealsByDate.execute(user.id, date);
    return meals.map(toMealDto);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createMealSchema))
  async create(@CurrentUser() user: UserEntity, @Body() body: CreateMealInput) {
    const meal = await this.logMeal.execute(user.id, body);
    return toMealDto(meal);
  }

  @Patch(":id")
  @UsePipes(new ZodValidationPipe(updateMealSchema))
  async update(@CurrentUser() user: UserEntity, @Param("id") id: string, @Body() body: UpdateMealInput) {
    const meal = await this.updateMeal.execute(id, user.id, body);
    return toMealDto(meal);
  }

  @Delete(":id")
  async delete(@CurrentUser() user: UserEntity, @Param("id") id: string) {
    await this.deleteMeal.execute(id, user.id);
    return { deleted: true };
  }
}
