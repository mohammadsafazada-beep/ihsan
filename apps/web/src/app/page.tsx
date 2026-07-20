import { UserButton } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="text-sm font-medium uppercase tracking-wide text-text-tertiary">
          Ihsan
        </span>
        <UserButton />
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
        <h1 className="text-title font-semibold">Dashboard</h1>

        <Card>
          <CardHeader>
            <CardTitle>No data yet</CardTitle>
          </CardHeader>
          <CardContent className="text-text-secondary">
            Nutrition, Training, Progress, Habits, Goals, and the AI Coach land in the upcoming
            sprints (see <code>docs/05-development-roadmap.md</code>). This screen will show
            today&apos;s workout, calories remaining, today&apos;s meals and habits, current vs.
            goal weight, and weekly progress as each module ships.
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
