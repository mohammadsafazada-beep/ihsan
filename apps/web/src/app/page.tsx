import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppHeader } from "@/components/AppHeader";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
        <h1 className="text-title font-semibold">Dashboard</h1>

        <Card>
          <CardHeader>
            <CardTitle>No data yet</CardTitle>
          </CardHeader>
          <CardContent className="text-text-secondary">
            Training, Progress, Habits, Goals, and the AI Coach land in the upcoming sprints (see{" "}
            <code>docs/05-development-roadmap.md</code>). Nutrition is live —{" "}
            <a href="/nutrition" className="text-brand underline">
              log a meal
            </a>
            . This screen will show today&apos;s workout, calories remaining, today&apos;s meals and
            habits, current vs. goal weight, and weekly progress as each module ships.
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
