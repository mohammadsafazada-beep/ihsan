import { Inject, Injectable } from "@nestjs/common";
import {
  PERSONAL_RECORD_REPOSITORY,
  PersonalRecordEntry,
  PersonalRecordRepositoryPort,
} from "../ports/personal-record.repository.port";

@Injectable()
export class ListPersonalRecordsUseCase {
  constructor(
    @Inject(PERSONAL_RECORD_REPOSITORY) private readonly personalRecords: PersonalRecordRepositoryPort,
  ) {}

  async execute(userId: string): Promise<PersonalRecordEntry[]> {
    return this.personalRecords.findManyByUser(userId);
  }
}
