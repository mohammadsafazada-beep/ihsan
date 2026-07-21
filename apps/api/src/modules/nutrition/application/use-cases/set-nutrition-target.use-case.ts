import { Inject, Injectable } from "@nestjs/common";
import { SetNutritionTargetInput } from "@ihsan/contracts";
import {
  NUTRITION_TARGET_REPOSITORY,
  NutritionTargetRecord,
  NutritionTargetRepositoryPort,
} from "../ports/nutrition-target.repository.port";

@Injectable()
export class SetNutritionTargetUseCase {
  constructor(
    @Inject(NUTRITION_TARGET_REPOSITORY) private readonly targets: NutritionTargetRepositoryPort,
  ) {}

  async execute(userId: string, input: SetNutritionTargetInput): Promise<NutritionTargetRecord> {
    return this.targets.create(userId, input);
  }
}
