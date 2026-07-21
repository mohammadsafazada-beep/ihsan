import { Inject, Injectable } from "@nestjs/common";
import {
  NUTRITION_TARGET_REPOSITORY,
  NutritionTargetRecord,
  NutritionTargetRepositoryPort,
} from "../ports/nutrition-target.repository.port";

@Injectable()
export class ListNutritionTargetsUseCase {
  constructor(
    @Inject(NUTRITION_TARGET_REPOSITORY) private readonly targets: NutritionTargetRepositoryPort,
  ) {}

  async execute(userId: string): Promise<NutritionTargetRecord[]> {
    return this.targets.findManyByUser(userId);
  }
}
