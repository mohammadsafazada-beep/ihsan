import { Inject, Injectable } from "@nestjs/common";
import { NotFoundError } from "../../../../shared/errors/domain-errors";
import { suggestNextWeight } from "../../domain/services/progression-suggestor.service";
import { PROGRAM_REPOSITORY, ProgramRepositoryPort } from "../ports/program.repository.port";
import { SESSION_REPOSITORY, SessionRepositoryPort } from "../ports/session.repository.port";

export interface NextSuggestionResult {
  exerciseId: string;
  exerciseName: string;
  suggestedWeightKg: number | null;
  reason: string;
}

@Injectable()
export class GetNextSuggestionUseCase {
  constructor(
    @Inject(PROGRAM_REPOSITORY) private readonly programs: ProgramRepositoryPort,
    @Inject(SESSION_REPOSITORY) private readonly sessions: SessionRepositoryPort,
  ) {}

  async execute(
    userId: string,
    programId: string,
    workoutDayId: string,
    exerciseId: string,
  ): Promise<NextSuggestionResult> {
    const program = await this.programs.findById(programId, userId);
    if (!program) {
      throw new NotFoundError("Program", programId);
    }
    const day = program.days.find((d) => d.id === workoutDayId);
    if (!day) {
      throw new NotFoundError("WorkoutDay", workoutDayId);
    }
    const prescription = day.exercises.find((e) => e.exerciseId === exerciseId);
    if (!prescription) {
      throw new NotFoundError("Exercise", exerciseId);
    }

    const lastSets = await this.sessions.findLastSessionSetsForWorkoutDayExercise(
      userId,
      workoutDayId,
      exerciseId,
    );

    if (!lastSets) {
      return {
        exerciseId,
        exerciseName: prescription.exerciseName,
        suggestedWeightKg: null,
        reason: "No previous session logged for this exercise yet.",
      };
    }

    const suggestion = suggestNextWeight(lastSets, prescription.targetRepsMin, prescription.targetRepsMax);
    return {
      exerciseId,
      exerciseName: prescription.exerciseName,
      suggestedWeightKg: suggestion.suggestedWeightKg,
      reason: suggestion.reason,
    };
  }
}
