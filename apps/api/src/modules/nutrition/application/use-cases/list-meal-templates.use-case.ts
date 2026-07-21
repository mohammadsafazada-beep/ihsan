import { Inject, Injectable } from "@nestjs/common";
import { MealTemplateEntity } from "../../domain/entities/meal-template.entity";
import {
  MEAL_TEMPLATE_REPOSITORY,
  MealTemplateRepositoryPort,
} from "../ports/meal-template.repository.port";

@Injectable()
export class ListMealTemplatesUseCase {
  constructor(
    @Inject(MEAL_TEMPLATE_REPOSITORY) private readonly templates: MealTemplateRepositoryPort,
  ) {}

  async execute(userId: string): Promise<MealTemplateEntity[]> {
    return this.templates.findManyByUser(userId);
  }
}
