import { Inject, Injectable } from "@nestjs/common";
import { UpdateGoalInput } from "@ihsan/contracts";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { GoalEntity } from "../../domain/entities/goal.entity";
import { GOAL_REPOSITORY, GoalRepositoryPort } from "../ports/goal.repository.port";

@Injectable()
export class UpdateGoalUseCase {
  constructor(@Inject(GOAL_REPOSITORY) private readonly goals: GoalRepositoryPort) {}

  async execute(id: string, userId: string, input: UpdateGoalInput): Promise<GoalEntity> {
    const existing = await this.goals.findById(id, userId);
    if (!existing) {
      throw new NotFoundError("Goal", id);
    }
    return this.goals.update(id, userId, input);
  }
}
