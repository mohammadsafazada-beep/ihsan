"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useApplyMealTemplate, useMealTemplates } from "../api/meal-templates.api";

export function MealTemplatesList({ date }: { date: string }) {
  const { data: templates, isLoading } = useMealTemplates();
  const applyTemplate = useApplyMealTemplate(date);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  if (isLoading) return <p className="text-text-secondary">Loading templates...</p>;
  if (!templates || templates.length === 0) {
    return <p className="text-text-secondary">No templates yet — save a logged meal as one below.</p>;
  }

  function handleApply(templateId: string) {
    setApplyingId(templateId);
    applyTemplate.mutate(
      { templateId, input: { date } },
      { onSettled: () => setApplyingId(null) },
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {templates.map((template) => (
        <li
          key={template.id}
          className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2"
        >
          <div>
            <p className="text-body font-medium">{template.name}</p>
            <p className="text-caption text-text-secondary">
              {template.items.map((item) => item.label).join(", ")}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={applyingId === template.id}
            onClick={() => handleApply(template.id)}
          >
            {applyingId === template.id ? "Applying..." : "Apply to today"}
          </Button>
        </li>
      ))}
    </ul>
  );
}
