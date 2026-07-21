import { Body, Controller, Get, Param, Post, UseGuards, UsePipes } from "@nestjs/common";
import {
  createMealTemplateSchema,
  CreateMealTemplateInput,
  applyMealTemplateSchema,
  ApplyMealTemplateInput,
} from "@ihsan/contracts";
import { ClerkAuthGuard } from "../../../shared/guards/clerk-auth.guard";
import { ResolveCurrentUserGuard } from "../../../shared/guards/resolve-current-user.guard";
import { CurrentUser } from "../../../shared/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../../shared/pipes/zod-validation.pipe";
import { UserEntity } from "../../users/domain/entities/user.entity";
import { CreateMealTemplateUseCase } from "../application/use-cases/create-meal-template.use-case";
import { ListMealTemplatesUseCase } from "../application/use-cases/list-meal-templates.use-case";
import { ApplyMealTemplateUseCase } from "../application/use-cases/apply-meal-template.use-case";
import { toMealDto, toMealTemplateDto } from "./nutrition.mapper";

@Controller("meal-templates")
@UseGuards(ClerkAuthGuard, ResolveCurrentUserGuard)
export class MealTemplateController {
  constructor(
    private readonly createMealTemplate: CreateMealTemplateUseCase,
    private readonly listMealTemplates: ListMealTemplatesUseCase,
    private readonly applyMealTemplate: ApplyMealTemplateUseCase,
  ) {}

  @Get()
  async list(@CurrentUser() user: UserEntity) {
    const templates = await this.listMealTemplates.execute(user.id);
    return templates.map(toMealTemplateDto);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createMealTemplateSchema))
  async create(@CurrentUser() user: UserEntity, @Body() body: CreateMealTemplateInput) {
    const template = await this.createMealTemplate.execute(user.id, body);
    return toMealTemplateDto(template);
  }

  @Post(":id/apply")
  @UsePipes(new ZodValidationPipe(applyMealTemplateSchema))
  async apply(
    @CurrentUser() user: UserEntity,
    @Param("id") id: string,
    @Body() body: ApplyMealTemplateInput,
  ) {
    const meals = await this.applyMealTemplate.execute(id, user.id, body);
    return meals.map(toMealDto);
  }
}
