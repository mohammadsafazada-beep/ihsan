import { CreateGoalInput, UpdateGoalInput } from "@ihsan/contracts";
import { GoalEntity, GoalType } from "../../domain/entities/goal.entity";

export const GOAL_REPOSITORY = "GOAL_REPOSITORY";

export interface GoalRepositoryPort {
  create(userId: string, input: CreateGoalInput): Promise<GoalEntity>;
  update(id: string, userId: string, input: UpdateGoalInput): Promise<GoalEntity>;
  findById(id: string, userId: string): Promise<GoalEntity | null>;
  findActiveByType(userId: string, type: GoalType): Promise<GoalEntity | null>;
  findManyByUser(userId: string): Promise<GoalEntity[]>;
  abandon(id: string): Promise<void>;
}
