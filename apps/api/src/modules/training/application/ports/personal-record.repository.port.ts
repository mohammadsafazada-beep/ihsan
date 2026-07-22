import { PrType, PersonalRecordValue } from "../../domain/services/personal-record-calculator.service";

export const PERSONAL_RECORD_REPOSITORY = "PERSONAL_RECORD_REPOSITORY";

export interface PersonalRecordEntry {
  id: string;
  exerciseId: string;
  exerciseName: string;
  type: PrType;
  value: number;
  achievedAt: Date;
}

export interface PersonalRecordRepositoryPort {
  /** Replaces every PR row for this exercise with the freshly computed set (may be empty). */
  replaceForExercise(userId: string, exerciseId: string, records: PersonalRecordValue[]): Promise<void>;
  findManyByUser(userId: string): Promise<PersonalRecordEntry[]>;
}
