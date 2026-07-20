# Database Schema

Full Prisma schema: [`schema.prisma`](./schema.prisma). This document explains the design decisions; the `.prisma` file is the source of truth for fields/types.

## 1. Design principles

- **Normalized, no premature denormalization.** Daily macro totals, streaks, and body-fat % are all computed on read (see below) rather than stored, because at single-user data volumes (a few dozen rows read per request) the query cost is negligible and stored derived values would need invalidation logic that adds real complexity for zero real benefit.
- **`userId` on every user-owned table**, even though there's one user today. Removing multi-tenancy later would be a bigger migration than keeping a column that's always the same value now. This is the one piece of "future-proofing" that's cheap enough to justify (a single indexed column), unlike a users/roles/permissions system, which we do not build.
- **cuid() ids**, not auto-increment ints — avoids enumeration, trivial to generate client-side if ever needed (offline drafts, optimistic UI).
- **Cascade deletes** on ownership edges (delete a Recipe's owning User → gone). **Restrict** on reference edges where the referenced row is used elsewhere (deleting an Ingredient that's used in a Recipe should fail loudly, not silently orphan data).

## 2. Computed-on-read values (not stored)

| Value | Computed from | Where |
|---|---|---|
| Daily calories/protein/carb/fat totals | `Meal` + `MealItem` → `Recipe`/`Ingredient` macros, for a given date | `NutritionModule` application service |
| Calories/protein remaining | Above total vs. active `NutritionTarget` for that date | Dashboard use-case |
| Estimated body fat % / lean body mass | Latest `Measurement` + `User.heightCm` + `User.sex` (U.S. Navy method) | `ProgressModule` domain service |
| Habit streak | Consecutive `HabitLog.completed = true` ending today | `HabitsModule` application service |
| Suggested next weight | Last `SetLog`s for the relevant `WorkoutDayExercise` | `TrainingModule` progression domain service |
| Weekly progress rollup | 7-day aggregation across Nutrition/Training/Progress/Habits | Dashboard use-case (fan-out to each module's service) |

## 3. The "one of two FKs" pattern (`MealItem`, `MealTemplateItem`)

A meal item is either a recipe-with-quantity-in-servings or a raw-ingredient-with-quantity-in-grams. Modeled as two nullable FKs rather than a polymorphic `itemType` + `itemId` string column, because:
- Real FKs give us referential integrity and cascade/restrict behavior for free.
- The "exactly one of the two is set" invariant is enforced in the `application/` use-case that creates these rows (`AddMealItemUseCase`), not the database — Postgres check constraints referencing two nullable columns are possible but add migration friction for a rule the application layer already owns and tests.

## 4. Why Goals and Habits are their own tables (not JSON on `User`)

Both are collections that grow over time (goal history, habit list) and need their own list/filter queries (`getActiveGoals`, `getActiveHabits`) called directly by the AI Coach tool layer. A JSON blob on `User` would work for "one goal" but breaks the moment there's a second concurrent goal (e.g. weight + body fat %) or historical goal tracking ("I hit my goal in March, here's the next one").

## 5. Why `NutritionTarget` is separate from `Goal`

A Goal is an outcome ("reach 80kg by December"). A `NutritionTarget` is a daily operational input ("2200 kcal / 180g protein"), versioned by `effectiveFrom` because targets change (e.g. recalculated every few weeks) and past days must be evaluated against the target that applied *then*. Conflating them would force every target change to also be a goal change, which isn't true (you can change your calorie target without changing your weight goal).

## 6. Exercise catalog: global + custom

`Exercise.userId` is nullable: `null` = seeded global catalog (Squat, Bench Press, etc.), non-null = user-added custom exercise. Avoids a separate `CustomExercise` table and a union type in every query that needs "all exercises available to this user."

## 7. Indexes

Every table has an index on `(userId, <date or lookup field>)` where relevant, since virtually every query is "this user's records, filtered/sorted by date." At single-user scale this is more about query-plan hygiene than raw performance necessity — cheap to add now, and it's the right habit for when the app does need to scale.

## 8. Explicitly not modeled (see `10-future-improvements.md`)

- Progress photos / media table
- Multi-day meal scheduling ("meal plan" as a calendar of future days)
- Sleep, steps, or other wearable data
- Any notion of teams, roles, or a second user
