import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, UsePipes } from "@nestjs/common";
import { createProgramSchema, CreateProgramInput, updateProgramSchema, UpdateProgramInput } from "@ihsan/contracts";
import { z } from "zod";
import { ClerkAuthGuard } from "../../../shared/guards/clerk-auth.guard";
import { ResolveCurrentUserGuard } from "../../../shared/guards/resolve-current-user.guard";
import { CurrentUser } from "../../../shared/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../../shared/pipes/zod-validation.pipe";
import { UserEntity } from "../../users/domain/entities/user.entity";
import { CreateProgramUseCase } from "../application/use-cases/create-program.use-case";
import { UpdateProgramUseCase } from "../application/use-cases/update-program.use-case";
import { ListProgramsUseCase } from "../application/use-cases/list-programs.use-case";
import { ActivateProgramUseCase } from "../application/use-cases/activate-program.use-case";
import { GetNextSuggestionUseCase } from "../application/use-cases/get-next-suggestion.use-case";
import { toProgramDto } from "./training.mapper";

const exerciseIdQuerySchema = z.string().min(1);

@Controller("programs")
@UseGuards(ClerkAuthGuard, ResolveCurrentUserGuard)
export class ProgramController {
  constructor(
    private readonly createProgram: CreateProgramUseCase,
    private readonly updateProgram: UpdateProgramUseCase,
    private readonly listPrograms: ListProgramsUseCase,
    private readonly activateProgram: ActivateProgramUseCase,
    private readonly getNextSuggestion: GetNextSuggestionUseCase,
  ) {}

  @Get()
  async list(@CurrentUser() user: UserEntity) {
    const programs = await this.listPrograms.execute(user.id);
    return programs.map(toProgramDto);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createProgramSchema))
  async create(@CurrentUser() user: UserEntity, @Body() body: CreateProgramInput) {
    const program = await this.createProgram.execute(user.id, body);
    return toProgramDto(program);
  }

  @Patch(":id")
  @UsePipes(new ZodValidationPipe(updateProgramSchema))
  async update(@CurrentUser() user: UserEntity, @Param("id") id: string, @Body() body: UpdateProgramInput) {
    const program = await this.updateProgram.execute(id, user.id, body);
    return toProgramDto(program);
  }

  @Post(":id/activate")
  async activate(@CurrentUser() user: UserEntity, @Param("id") id: string) {
    const program = await this.activateProgram.execute(id, user.id);
    return toProgramDto(program);
  }

  @Get(":id/days/:dayId/next-suggestion")
  async nextSuggestion(
    @CurrentUser() user: UserEntity,
    @Param("id") programId: string,
    @Param("dayId") dayId: string,
    @Query("exerciseId", new ZodValidationPipe(exerciseIdQuerySchema)) exerciseId: string,
  ) {
    return this.getNextSuggestion.execute(user.id, programId, dayId, exerciseId);
  }
}
