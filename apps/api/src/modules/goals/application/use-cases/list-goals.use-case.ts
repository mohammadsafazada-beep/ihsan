import { Inject, Injectable } from "@nestjs/common";
import { GoalEntity } from "../../domain/entities/goal.entity";
import { GOAL_REPOSITORY, GoalRepositoryPort } from "../ports/goal.repository.port";

@Injectable()
export class ListGoalsUseCase {
  constructor(@Inject(GOAL_REPOSITORY) private readonly goals: GoalRepositoryPort) {}

  async execute(userId: string): Promise<GoalEntity[]> {
    return this.goals.findManyByUser(userId);
  }
}
