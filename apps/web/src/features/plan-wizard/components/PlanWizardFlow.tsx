"use client";

import { useState } from "react";
import Link from "next/link";
import type { PlanIntake, ProposedPlan } from "@ihsan/contracts";
import { Button } from "@/components/ui/button";
import { PlanIntakeForm } from "./PlanIntakeForm";
import { PlanPreview } from "./PlanPreview";
import { useGeneratePlan } from "../api/wizard.api";

type Phase = "form" | "proposal" | "applied";

export function PlanWizardFlow({ onApplied }: { onApplied?: () => void }) {
  const [phase, setPhase] = useState<Phase>("form");
  const [plan, setPlan] = useState<ProposedPlan | null>(null);
  const [lastIntake, setLastIntake] = useState<PlanIntake | undefined>(undefined);
  const generatePlan = useGeneratePlan();

  function handleSubmit(intake: PlanIntake) {
    setLastIntake(intake);
    generatePlan.mutate(intake, {
      onSuccess: (proposedPlan) => {
        setPlan(proposedPlan);
        setPhase("proposal");
      },
    });
  }

  function handleAdjust() {
    setPhase("form");
  }

  function handleApplied() {
    setPhase("applied");
    onApplied?.();
  }

  if (phase === "form") {
    return (
      <div className="flex flex-col gap-3">
        <PlanIntakeForm defaultValues={lastIntake} isSubmitting={generatePlan.isPending} onSubmit={handleSubmit} />
        {generatePlan.isError && (
          <p className="text-caption text-destructive">Couldn&apos;t build your plan — try again.</p>
        )}
      </div>
    );
  }

  if (phase === "proposal" && plan) {
    return <PlanPreview plan={plan} onApplied={handleApplied} onAdjust={handleAdjust} />;
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-body">
        Your program is active, your nutrition target is set, and a meal template is ready — apply it to today
        from the Nutrition page whenever you like.
      </p>
      <div className="flex gap-3">
        <Button asChild size="sm">
          <Link href="/training">Go to Training</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/nutrition">Go to Nutrition</Link>
        </Button>
      </div>
    </div>
  );
}
