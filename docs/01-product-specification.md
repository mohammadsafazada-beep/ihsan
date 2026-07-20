# Product Specification — Personal AI Operating System (v1 / MVP)

## 1. What this is

A single-user, daily-driver application that answers one question every time you open it:

> **"What should I do today to get closer to my goal?"**

It is not a fitness tracker. Nutrition and Training are two of the input modules that feed a single Dashboard and a single AI Coach that reasons over your whole life data (starting with body, food, training — extensible later to sleep, work, finance, etc.).

## 2. Non-goals (explicitly out of scope for v1)

- Multi-user / multi-tenant support, teams, sharing
- Monetization, billing, subscription tiers
- Social features (feed, friends, leaderboards)
- Gamification (badges, streaks-as-reward, points) — habit streaks are shown as *information*, never as a reward mechanic
- Native mobile apps (responsive web only)
- Offline-first / PWA
- Wearable/device integrations (Apple Health, Oura, Whoop) — data model should not preclude this later, but no v1 work here
- Meal Plans as a multi-day scheduling entity (collapsed into Meal Templates — see §4.2)
- Progress photos (deferred to v1.1 — see `10-future-improvements.md`)
- AI Coach write-actions (the AI never mutates data in v1 — see §5)

## 3. Product philosophy

1. **One home screen.** The Dashboard is the product. Everything else is a detail view reachable from it.
2. **Log fast, think never.** Logging a meal or a set should take seconds. Any screen that takes more than ~3 taps to log something common is wrong.
3. **The AI is a lens, not a database.** It never becomes the primary way to enter data — it explains and advises on data that already exists.
4. **No feature without a daily loop.** If a feature isn't touched most days, it doesn't belong in the MVP.

## 4. MVP Modules

### 4.1 Dashboard

The home page (`/`). Most polished screen in the product. Reads (never writes) from every other module:

- Today's workout (from active Workout Program → today's Workout Day, or "Rest day")
- Calories remaining (Nutrition Target − sum of today's logged Meals)
- Protein remaining (same, protein)
- Today's meals (list, tap to expand/edit)
- Today's habits (checklist, tap to toggle)
- Current weight (latest Weight Entry)
- Weight goal (from active Goal, with delta and projected date at current rate)
- Weekly progress (7-day rollup: weight trend, workouts completed vs. planned, avg. calories vs. target, habit completion %)
- Quick actions: Log meal, Log weight, Start workout, Open AI Coach

### 4.2 Nutrition

Entities: Ingredient, Recipe, Meal, Meal Template, Nutrition Target.

- **Ingredients**: name + macros per 100g (or per unit for non-weighable items). User-owned, no shared catalog in v1 (no need — single user).
- **Recipes**: composed of Ingredients + quantities + servings. Macros are **always computed**, never hand-entered, from the ingredient composition.
- **Meals**: a logged instance on a specific date/meal-slot (breakfast/lunch/dinner/snack), composed of Recipe references and/or raw Ingredient references with quantities.
- **Meal Templates** (replaces "meal plans" + "duplicate meal" + "meal from scratch" as three separate ideas): a named, reusable set of meal items. "Apply template to today" creates a real Meal from it. Duplicating a meal is "save this meal as a template" or "copy this logged meal to another date" — no separate concept needed.
- **Nutrition Target**: current daily calorie/protein/carb/fat targets. Versioned by `effectiveFrom` date so historical days are evaluated against the target that applied *then*, not today's target.
- Daily macro totals are **computed on read** (aggregation over today's Meals), not stored — trivial at single-user data volumes, avoids a whole class of cache-invalidation bugs.

### 4.3 Training

Entities: Workout Program, Workout Day, Exercise, Workout Session, Set Log, Personal Record.

- **Workout Program**: a named plan (e.g. "Upper/Lower — Summer 2026"), one active at a time.
- **Workout Day**: a template day inside a program ("Push Day"), an ordered list of prescribed exercises with target sets/rep range.
- **Exercise**: global movement catalog (seeded) + user-added custom exercises.
- **Workout Session**: an actual instance of training on a real date, optionally linked to a Workout Day template.
- **Set Log**: the actual reps/weight/RPE performed, belongs to a session.
- **Personal Record**: derived/cached best performance per exercise per metric (max weight, est. 1RM, max volume), recalculated whenever a new relevant Set Log is written.
- **Progressive overload suggestion**: computed on demand (not stored) by a Training Progression service — looks at the last session for that Workout Day exercise and suggests next weight (e.g. "hit top of rep range on all sets → +2.5kg next time").

### 4.4 Progress

Entities: Weight Entry, Measurement.

- **Weight Entry**: one weight per date.
- **Measurement**: waist/chest/hips/arm/thigh/neck circumferences per date.
- **Estimated body fat % / lean body mass**: computed on read from Measurement + user height/sex using a standard formula (U.S. Navy method), exposed as derived fields — not persisted, since the formula may improve later and persisted estimates would go stale silently.
- **Progress pictures**: deferred (see `10-future-improvements.md`).
- **Goal tracking**: see Goals module below (§4.6), surfaced here as graphs against the active Goal.

### 4.5 AI Coach

A single chat interface. Backed by an LLM with **tool access to application services only — never direct database access**. Available tools in v1 (all read-only):

- `getNutritionSummary(dateRange)` — targets vs. actuals
- `getTrainingHistory(exercise?, dateRange)` — sessions, sets, PRs, adherence to program
- `getWeightTrend(dateRange)` — weight entries + trend line
- `getMeasurements(dateRange)`
- `getActiveGoals()`
- `getHabitAdherence(dateRange)`

Example: *"I feel tired"* → AI calls `getTrainingHistory` (volume/intensity last 7 days), `getWeightTrend` (rate of loss/gain), `getNutritionSummary` (calorie deficit size) → synthesizes an answer citing the actual numbers it pulled.

The AI **cannot** log a meal, edit a workout, or change a goal in v1. It can only tell you to. Write-actions are a v1.1+ decision (see `10-future-improvements.md`) because they require confirmation/undo UX that doesn't exist yet.

### 4.6 Goals *(new — required by Dashboard, not originally called out)*

Entity: Goal.

Minimal, generic goal record: type (`WEIGHT` or `BODY_FAT_PERCENT` in v1), target value, target date, start value/date, status (`ACTIVE` / `ACHIEVED` / `ABANDONED`). One `ACTIVE` goal per type at a time. This is what the Dashboard's "weight goal" and "weekly progress" and the Progress module's "goal tracking" all read from.

### 4.7 Habits *(new — required by Dashboard, not originally called out)*

Entities: Habit, Habit Log.

- **Habit**: a thing you track daily (e.g. "10k steps", "no alcohol", "read 20 min"). Just a name + active flag in v1 — no complex scheduling (specific weekdays, etc.) needed yet.
- **Habit Log**: one completed/not-completed record per habit per date. Streak is a *display* computation (consecutive completed days ending today), never stored, never gamified with points/badges.

## 5. AI Coach data-access contract

The AI Coach module must depend only on the **Application layer interfaces** already exposed to the REST controllers (the same use-cases power both the web UI and the AI tool layer). This is a hard architectural rule, not a style preference — see `02-folder-architecture.md` and `06-coding-guidelines.md`.

## 6. Success criteria for v1

The MVP is "done" when, for 30 consecutive days, the user:
- Opens the Dashboard daily and it answers "what do I do today" without needing another screen
- Logs all meals and all workout sets through the app (zero pen-and-paper / other-app fallback)
- Gets at least one useful AI Coach answer per week that references real logged data
