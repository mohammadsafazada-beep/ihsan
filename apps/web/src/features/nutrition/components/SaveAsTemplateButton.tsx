"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSaveMealAsTemplate } from "../api/meal-templates.api";

export function SaveAsTemplateButton({ mealId, defaultName }: { mealId: string; defaultName: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(defaultName);
  const saveAsTemplate = useSaveMealAsTemplate();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    saveAsTemplate.mutate(
      { mealId, input: { name: name.trim() } },
      { onSuccess: () => setOpen(false) },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(true)}>
        Save as template
      </Button>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Save as template</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-1.5 py-4">
            <Label htmlFor="template-name">Template name</Label>
            <Input id="template-name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={saveAsTemplate.isPending || !name.trim()}>
              {saveAsTemplate.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
