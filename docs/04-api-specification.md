# API Specification

## 1. Conventions

- **Base URL**: `/api/v1`
- **Auth**: Clerk-issued JWT in `Authorization: Bearer <token>`, verified by `ClerkAuthGuard` on every route except health check. `@CurrentUser()` decorator injects the resolved internal `User` (mapped from `clerkId`) into the handler.
- **Response envelope**: every 2xx response is `{ data: <payload> }`. Every error is `{ error: { code: string, message: string, details?: unknown } }` with a matching HTTP status, produced by a single `DomainExceptionFilter` that maps domain exceptions (`NotFoundError`, `ValidationError`, `ConflictError`) to HTTP status codes. Controllers never construct error responses by hand.
- **Validation**: every request body/query is validated against the matching Zod schema from `packages/contracts` via a `ZodValidationPipe`. Controllers never see unvalidated input.
- **Dates**: `YYYY-MM-DD` for calendar dates (weight, meals, sessions — timezone-less, "the day this happened"), ISO-8601 datetime for timestamps.
- **Pagination**: none in v1. All list endpoints take an optional `from`/`to` date range and return the full matching set — at single-user data volumes, a year of daily logs is a few hundred rows.

## 2. Nutrition

| Method | Path | Description |
|---|---|---|
| GET | `/ingredients` | List user's ingredients |
| POST | `/ingredients` | Create ingredient |
| PATCH | `/ingredients/:id` | Update ingredient |
| DELETE | `/ingredients/:id` | Delete (fails if referenced by a Recipe/Meal — `409`) |
| GET | `/recipes` | List recipes (with computed macros per serving) |
| POST | `/recipes` | Create recipe with ingredient list |
| GET | `/recipes/:id` | Recipe detail incl. computed macros |
| PATCH | `/recipes/:id` | Update recipe / ingredient list |
| DELETE | `/recipes/:id` | Delete recipe |
| GET | `/meals?date=YYYY-MM-DD` | Meals logged on a date |
| POST | `/meals` | Log a meal (items = recipe or ingredient refs + quantity) |
| PATCH | `/meals/:id` | Edit a logged meal |
| DELETE | `/meals/:id` | Remove a logged meal |
| POST | `/meals/:id/save-as-template` | Save an existing meal as a `MealTemplate` |
| GET | `/meal-templates` | List templates |
| POST | `/meal-templates` | Create template from scratch |
| POST | `/meal-templates/:id/apply` | Body: `{ date }` → creates real `Meal`(s) for that date |
| GET | `/nutrition/summary?date=YYYY-MM-DD` | Totals + remaining vs. active target for that date |
| GET | `/nutrition/targets` | Current + historical targets |
| POST | `/nutrition/targets` | Set a new target effective from a date |

## 3. Training

| Method | Path | Description |
|---|---|---|
| GET | `/exercises` | Global catalog + user's custom exercises |
| POST | `/exercises` | Add custom exercise |
| GET | `/programs` | List programs |
| POST | `/programs` | Create program (with days + prescribed exercises) |
| PATCH | `/programs/:id` | Update program / days / prescriptions |
| POST | `/programs/:id/activate` | Set as the single active program |
| GET | `/programs/:id/days/:dayId/next-suggestion` | Suggested weights for today, per exercise, from progression service |
| GET | `/sessions?from=&to=` | Logged sessions in range |
| POST | `/sessions` | Start a session (optionally linked to a program day) |
| PATCH | `/sessions/:id` | Update (e.g. mark completed) |
| POST | `/sessions/:id/sets` | Log a set |
| PATCH | `/sets/:id` | Edit a logged set |
| DELETE | `/sets/:id` | Delete a logged set |
| GET | `/personal-records` | Current PRs per exercise/type |
| GET | `/exercises/:id/history` | All sets ever logged for this exercise (for the AI Coach and exercise detail view) |

## 4. Progress & Goals

| Method | Path | Description |
|---|---|---|
| GET | `/weight-entries?from=&to=` | Weight history |
| POST | `/weight-entries` | Log today's weight (upsert by date) |
| GET | `/measurements?from=&to=` | Measurement history |
| POST | `/measurements` | Log measurements (upsert by date) |
| GET | `/progress/composition?date=` | Estimated body fat % / lean mass for a date (computed) |
| GET | `/goals` | List goals (active + history) |
| POST | `/goals` | Create a goal (sets any existing active goal of the same type to `ABANDONED`) |
| PATCH | `/goals/:id` | Update target / status |

## 5. Habits

| Method | Path | Description |
|---|---|---|
| GET | `/habits` | List active habits with today's status + current streak |
| POST | `/habits` | Create habit |
| PATCH | `/habits/:id` | Rename / deactivate |
| POST | `/habits/:id/logs` | Body: `{ date, completed }` — upsert today's (or any date's) log |

## 6. Dashboard

| Method | Path | Description |
|---|---|---|
| GET | `/dashboard` | Single aggregated payload: today's workout, macros remaining, today's meals, today's habits, current/goal weight, weekly progress rollup. Backed by a dedicated `GetDashboardUseCase` that fans out to the other modules' application services — no logic lives in the controller. |

## 7. AI Coach

| Method | Path | Description |
|---|---|---|
| GET | `/coach/conversations` | List conversations |
| POST | `/coach/conversations` | Start a new conversation |
| GET | `/coach/conversations/:id/messages` | Message history |
| POST | `/coach/conversations/:id/messages` | Send a user message → streamed assistant response |

Internally, `SendMessageUseCase` runs the LLM tool-call loop against the fixed tool set defined in `01-product-specification.md §4.5`. Every tool implementation calls an existing Application-layer use-case — there is no code path from `ai-coach/` into `infrastructure/prisma` in any *other* module.

## 8. Users

| Method | Path | Description |
|---|---|---|
| POST | `/webhooks/clerk` | Clerk webhook (user.created/updated) → upserts internal `User` |
| GET | `/me` | Current user profile |
| PATCH | `/me` | Update profile (height, sex, weight unit) |
