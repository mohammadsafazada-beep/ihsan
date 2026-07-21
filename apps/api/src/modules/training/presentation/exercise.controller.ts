import { Body, Controller, Get, Post, UseGuards, UsePipes } from "@nestjs/common";
import { createExerciseSchema, CreateExerciseInput } from "@ihsan/contracts";
import { ClerkAuthGuard } from "../../../shared/guards/clerk-auth.guard";
import { ResolveCurrentUserGuard } from "../../../shared/guards/resolve-current-user.guard";
import { CurrentUser } from "../../../shared/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../../shared/pipes/zod-validation.pipe";
import { UserEntity } from "../../users/domain/entities/user.entity";
import { CreateExerciseUseCase } from "../application/use-cases/create-exercise.use-case";
import { ListExercisesUseCase } from "../application/use-cases/list-exercises.use-case";
import { toExerciseDto } from "./training.mapper";

@Controller("exercises")
@UseGuards(ClerkAuthGuard, ResolveCurrentUserGuard)
export class ExerciseController {
  constructor(
    private readonly createExercise: CreateExerciseUseCase,
    private readonly listExercises: ListExercisesUseCase,
  ) {}

  @Get()
  async list(@CurrentUser() user: UserEntity) {
    const exercises = await this.listExercises.execute(user.id);
    return exercises.map(toExerciseDto);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createExerciseSchema))
  async create(@CurrentUser() user: UserEntity, @Body() body: CreateExerciseInput) {
    const exercise = await this.createExercise.execute(user.id, body);
    return toExerciseDto(exercise);
  }
}
