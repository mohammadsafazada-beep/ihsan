import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UsePipes } from "@nestjs/common";
import {
  createIngredientSchema,
  CreateIngredientInput,
  updateIngredientSchema,
  UpdateIngredientInput,
  searchFoodDatabaseQuerySchema,
} from "@ihsan/contracts";
import { ClerkAuthGuard } from "../../../shared/guards/clerk-auth.guard";
import { ResolveCurrentUserGuard } from "../../../shared/guards/resolve-current-user.guard";
import { CurrentUser } from "../../../shared/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../../shared/pipes/zod-validation.pipe";
import { UserEntity } from "../../users/domain/entities/user.entity";
import { CreateIngredientUseCase } from "../application/use-cases/create-ingredient.use-case";
import { UpdateIngredientUseCase } from "../application/use-cases/update-ingredient.use-case";
import { DeleteIngredientUseCase } from "../application/use-cases/delete-ingredient.use-case";
import { ListIngredientsUseCase } from "../application/use-cases/list-ingredients.use-case";
import { SearchFoodDatabaseUseCase } from "../application/use-cases/search-food-database.use-case";
import { toIngredientDto } from "./nutrition.mapper";

@Controller("ingredients")
@UseGuards(ClerkAuthGuard, ResolveCurrentUserGuard)
export class IngredientController {
  constructor(
    private readonly createIngredient: CreateIngredientUseCase,
    private readonly updateIngredient: UpdateIngredientUseCase,
    private readonly deleteIngredient: DeleteIngredientUseCase,
    private readonly listIngredients: ListIngredientsUseCase,
    private readonly searchFoodDatabase: SearchFoodDatabaseUseCase,
  ) {}

  @Get()
  async list(@CurrentUser() user: UserEntity) {
    const ingredients = await this.listIngredients.execute(user.id);
    return ingredients.map(toIngredientDto);
  }

  @Get("search")
  async search(@Query("query", new ZodValidationPipe(searchFoodDatabaseQuerySchema.shape.query)) query: string) {
    return this.searchFoodDatabase.execute(query);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createIngredientSchema))
  async create(@CurrentUser() user: UserEntity, @Body() body: CreateIngredientInput) {
    const ingredient = await this.createIngredient.execute(user.id, body);
    return toIngredientDto(ingredient);
  }

  @Patch(":id")
  @UsePipes(new ZodValidationPipe(updateIngredientSchema))
  async update(
    @CurrentUser() user: UserEntity,
    @Param("id") id: string,
    @Body() body: UpdateIngredientInput,
  ) {
    const ingredient = await this.updateIngredient.execute(id, user.id, body);
    return toIngredientDto(ingredient);
  }

  @Delete(":id")
  async delete(@CurrentUser() user: UserEntity, @Param("id") id: string) {
    await this.deleteIngredient.execute(id, user.id);
    return { deleted: true };
  }
}
