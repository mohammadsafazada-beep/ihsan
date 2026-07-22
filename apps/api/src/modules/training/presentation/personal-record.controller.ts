import { Controller, Get, UseGuards } from "@nestjs/common";
import { ClerkAuthGuard } from "../../../shared/guards/clerk-auth.guard";
import { ResolveCurrentUserGuard } from "../../../shared/guards/resolve-current-user.guard";
import { CurrentUser } from "../../../shared/decorators/current-user.decorator";
import { UserEntity } from "../../users/domain/entities/user.entity";
import { ListPersonalRecordsUseCase } from "../application/use-cases/list-personal-records.use-case";
import { toPersonalRecordDto } from "./training.mapper";

@Controller("personal-records")
@UseGuards(ClerkAuthGuard, ResolveCurrentUserGuard)
export class PersonalRecordController {
  constructor(private readonly listPersonalRecords: ListPersonalRecordsUseCase) {}

  @Get()
  async list(@CurrentUser() user: UserEntity) {
    const records = await this.listPersonalRecords.execute(user.id);
    return records.map(toPersonalRecordDto);
  }
}
