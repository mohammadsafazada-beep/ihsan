import { Inject, Injectable } from "@nestjs/common";
import { CreateGoalInput } from "@ihsan/contracts";
import { GoalEntity } from "../../domain/entities/goal.entity";
import { GOAL_REPOSITORY, GoalRepositoryPort } from "../ports/goal.repository.port";

@Injectable()
export class CreateGoalUseCase {
  constructor(@Inject(GOAL_REPOSITORY) private readonly goals: GoalRepositoryPort) {}

  async execute(userId: string, input: CreateGoalInput): Promise<GoalEntity> {
    const existingActive = await this.goals.findActiveByType(userId, input.type);
    if (existingActive) {
      await this.goals.abandon(existingActive.id);
    }
    return this.goals.create(userId, input);
  }
}
