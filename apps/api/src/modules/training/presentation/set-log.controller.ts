import { Body, Controller, Delete, Param, Patch, UseGuards, UsePipes } from "@nestjs/common";
import { updateSetSchema, UpdateSetInput } from "@ihsan/contracts";
import { ClerkAuthGuard } from "../../../shared/guards/clerk-auth.guard";
import { ResolveCurrentUserGuard } from "../../../shared/guards/resolve-current-user.guard";
import { CurrentUser } from "../../../shared/decorators/current-user.decorator";
import { ZodValidationPipe } from "../../../shared/pipes/zod-validation.pipe";
import { UserEntity } from "../../users/domain/entities/user.entity";
import { UpdateSetUseCase } from "../application/use-cases/update-set.use-case";
import { DeleteSetUseCase } from "../application/use-cases/delete-set.use-case";

@Controller("sets")
@UseGuards(ClerkAuthGuard, ResolveCurrentUserGuard)
export class SetLogController {
  constructor(
    private readonly updateSet: UpdateSetUseCase,
    private readonly deleteSet: DeleteSetUseCase,
  ) {}

  @Patch(":id")
  @UsePipes(new ZodValidationPipe(updateSetSchema))
  async update(@CurrentUser() user: UserEntity, @Param("id") id: string, @Body() body: UpdateSetInput) {
    return this.updateSet.execute(id, user.id, body);
  }

  @Delete(":id")
  async delete(@CurrentUser() user: UserEntity, @Param("id") id: string) {
    await this.deleteSet.execute(id, user.id);
    return { deleted: true };
  }
}
