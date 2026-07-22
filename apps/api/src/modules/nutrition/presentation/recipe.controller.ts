import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import {
  createRecipeSchema,
  CreateRecipeInput,
  updateRecipeSchema,
  UpdateRecipeInput,
} from "@ihsan/contracts";
import { ClerkAuthGuard } from "../../../shared/guards/clerk-auth.guard";
import { ResolveCurrentUserGuard } from "../../../shared/guards/resolve-current-user.guard";
import { CurrentUser } from "../../../shared/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../../shared/pipes/zod-validation.pipe";
import { UserEntity } from "../../users/domain/entities/user.entity";
import { CreateRecipeUseCase } from "../application/use-cases/create-recipe.use-case";
import { UpdateRecipeUseCase } from "../application/use-cases/update-recipe.use-case";
import { DeleteRecipeUseCase } from "../application/use-cases/delete-recipe.use-case";
import { ListRecipesUseCase } from "../application/use-cases/list-recipes.use-case";
import { GetRecipeUseCase } from "../application/use-cases/get-recipe.use-case";
import { toRecipeDto } from "./nutrition.mapper";

@Controller("recipes")
@UseGuards(ClerkAuthGuard, ResolveCurrentUserGuard)
export class RecipeController {
  constructor(
    private readonly createRecipe: CreateRecipeUseCase,
    private readonly updateRecipe: UpdateRecipeUseCase,
    private readonly deleteRecipe: DeleteRecipeUseCase,
    private readonly listRecipes: ListRecipesUseCase,
    private readonly getRecipe: GetRecipeUseCase,
  ) {}

  @Get()
  async list(@CurrentUser() user: UserEntity) {
    const recipes = await this.listRecipes.execute(user.id);
    return recipes.map(toRecipeDto);
  }

  @Get(":id")
  async get(@CurrentUser() user: UserEntity, @Param("id") id: string) {
    const recipe = await this.getRecipe.execute(id, user.id);
    return toRecipeDto(recipe);
  }

  @Post()
  async create(
    @CurrentUser() user: UserEntity,
    @Body(new ZodValidationPipe(createRecipeSchema)) body: CreateRecipeInput,
  ) {
    const recipe = await this.createRecipe.execute(user.id, body);
    return toRecipeDto(recipe);
  }

  @Patch(":id")
  async update(
    @CurrentUser() user: UserEntity,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateRecipeSchema)) body: UpdateRecipeInput,
  ) {
    const recipe = await this.updateRecipe.execute(id, user.id, body);
    return toRecipeDto(recipe);
  }

  @Delete(":id")
  async delete(@CurrentUser() user: UserEntity, @Param("id") id: string) {
    await this.deleteRecipe.execute(id, user.id);
    return { deleted: true };
  }
}
