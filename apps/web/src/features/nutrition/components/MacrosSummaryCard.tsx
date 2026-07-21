import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NutritionSummary } from "@ihsan/contracts";

interface MacrosSummaryCardProps {
  summary: NutritionSummary | undefined;
  isLoading: boolean;
}

function Stat({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-micro text-text-tertiary">{label}</span>
      <span className="text-display font-semibold tabular-nums">
        {value}
        <span className="text-caption text-text-secondary ml-1">{unit}</span>
      </span>
    </div>
  );
}

export function MacrosSummaryCard({ summary, isLoading }: MacrosSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s macros</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || !summary ? (
          <p className="text-text-secondary">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <Stat label="CALORIES REMAINING" value={summary.remaining.calories} unit="kcal" />
            <Stat label="PROTEIN REMAINING" value={summary.remaining.proteinGrams} unit="g" />
            <Stat label="CARBS REMAINING" value={summary.remaining.carbsGrams} unit="g" />
            <Stat label="FAT REMAINING" value={summary.remaining.fatGrams} unit="g" />
          </div>
        )}
        {summary && summary.target.calories === 0 && (
          <p className="text-caption text-text-tertiary mt-4">
            No nutrition target set yet — remaining is shown as negative consumed. Targets are
            configurable starting Sprint 2.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
