import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import {
  createSessionSchema,
  CreateSessionInput,
  updateSessionSchema,
  UpdateSessionInput,
  logSetSchema,
  LogSetInput,
  calendarDateSchema,
} from "@ihsan/contracts";
import { ClerkAuthGuard } from "../../../shared/guards/clerk-auth.guard";
import { ResolveCurrentUserGuard } from "../../../shared/guards/resolve-current-user.guard";
import { CurrentUser } from "../../../shared/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../../shared/pipes/zod-validation.pipe";
import { UserEntity } from "../../users/domain/entities/user.entity";
import { CreateSessionUseCase } from "../application/use-cases/create-session.use-case";
import { UpdateSessionUseCase } from "../application/use-cases/update-session.use-case";
import { ListSessionsUseCase } from "../application/use-cases/list-sessions.use-case";
import { LogSetUseCase } from "../application/use-cases/log-set.use-case";
import { toSessionDto } from "./training.mapper";

const optionalDateSchema = calendarDateSchema.optional();

@Controller("sessions")
@UseGuards(ClerkAuthGuard, ResolveCurrentUserGuard)
export class SessionController {
  constructor(
    private readonly createSession: CreateSessionUseCase,
    private readonly updateSession: UpdateSessionUseCase,
    private readonly listSessions: ListSessionsUseCase,
    private readonly logSet: LogSetUseCase,
  ) {}

  @Get()
  async list(
    @CurrentUser() user: UserEntity,
    @Query("from", new ZodValidationPipe(optionalDateSchema)) from: string | undefined,
    @Query("to", new ZodValidationPipe(optionalDateSchema)) to: string | undefined,
  ) {
    const sessions = await this.listSessions.execute(user.id, from, to);
    return sessions.map(toSessionDto);
  }

  @Post()
  async create(
    @CurrentUser() user: UserEntity,
    @Body(new ZodValidationPipe(createSessionSchema)) body: CreateSessionInput,
  ) {
    const session = await this.createSession.execute(user.id, body);
    return toSessionDto(session);
  }

  @Patch(":id")
  async update(
    @CurrentUser() user: UserEntity,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateSessionSchema)) body: UpdateSessionInput,
  ) {
    const session = await this.updateSession.execute(id, user.id, body);
    return toSessionDto(session);
  }

  @Post(":id/sets")
  async addSet(
    @CurrentUser() user: UserEntity,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(logSetSchema)) body: LogSetInput,
  ) {
    return this.logSet.execute(id, user.id, body);
  }
}
