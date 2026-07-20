# Coding Guidelines

## 1. TypeScript

- `strict: true` everywhere. `noImplicitAny`, `noUncheckedIndexedAccess` on.
- **Never use `any`.** Unknown external data (LLM tool-call args, webhook payloads) gets typed as `unknown` and narrowed via the matching Zod schema from `packages/contracts` — parsing *is* the type check.
- Prefer `type` aliases for data shapes, `interface` for anything meant to be implemented (ports/repositories) or extended.
- No enums for open-ended sets that might grow via user input (e.g. `MealType`/`GoalType` are real Prisma enums because their set is genuinely fixed by the domain — don't add a "generic tag" table just to avoid an enum).

## 2. Dependency injection & layering (backend)

- Every cross-layer dependency is an interface (`*.port.ts`) defined in `application/ports/`, implemented in `infrastructure/`, bound in the feature's `*.module.ts`. A use-case class only ever imports the port, never the Prisma implementation.
- One use-case class = one public method (`execute()`). If a use-case grows a second responsibility, split it — don't add a second public method.
- Controllers are thin: parse (via pipe, automatic) → call one use-case → return its result. No `if`/business branching in a controller. If you're writing an `if` in a controller, it belongs in a use-case or domain service.
- Domain entities can contain behavior (e.g. `Recipe.computeMacros()`), but never depend on NestJS, Prisma, or HTTP concepts — a domain file should compile with zero framework imports.

## 3. DTOs & validation

- Every controller input/output shape is defined once in `packages/contracts` as a Zod schema, with the inferred TS type exported alongside it. Backend and frontend both import from there — never redeclare the same shape twice.
- `ZodValidationPipe` runs on every controller method. If a field isn't in the schema, it isn't accepted — no silent extra-field pass-through.

## 4. Repositories

- One repository interface per aggregate root (e.g. `RecipeRepository`, not one per table — `RecipeIngredient` rows are managed through `RecipeRepository`, not their own repository, since they have no independent lifecycle).
- Repository methods are named by intent (`findActiveByUserId`, `findByDateRange`), never leak Prisma query objects through the interface.

## 5. Error handling

- Domain/application code throws typed errors (`NotFoundError`, `ValidationError`, `ConflictError` — defined once in `shared/errors/`), never raw `Error` or NestJS `HttpException` directly from a use-case.
- `DomainExceptionFilter` is the *only* place that maps a domain error to an HTTP status. This keeps use-cases reusable from the AI Coach tool layer, which has no HTTP context to throw an `HttpException` into.
- Never swallow an error silently (`catch {}`). If a caught error is expected and handled, say why in a one-line comment; otherwise let it propagate to the filter.

## 6. Frontend

- Server Components fetch data; Client Components handle interaction. Don't mark a component `"use client"` unless it actually needs state, effects, or event handlers.
- All server communication goes through TanStack Query hooks in `features/*/api/`, typed against `packages/contracts`. No `fetch()` calls inside components.
- Forms use React Hook Form + the same Zod schema the backend validates against (`zodResolver`) — one schema, one source of truth for a form's shape, front and back.
- No business logic (macro math, streak calculation, PR comparison) in a component or hook. If a component is computing a domain value, that computation belongs in the backend response or a shared pure function imported from `packages/contracts` if it's truly presentation-only (e.g. formatting).

## 7. Testing

- **Domain layer**: unit tests, no mocking needed beyond plain objects (pure functions/entities).
- **Application layer**: unit tests with in-memory fakes of the repository ports (not Prisma mocks — test against the interface).
- **Infrastructure layer**: integration tests against a real test Postgres (Prisma), verifying the repository actually satisfies its port contract.
- **API**: a small set of e2e tests covering the critical daily loop (log meal, log set, check habit, dashboard aggregation, one AI Coach tool call) — not exhaustive endpoint coverage. This is a single-user app; breadth of manual testing during daily use covers more than a large e2e suite would.
- No test is written to satisfy a coverage number. Every test exists because a specific regression would be embarrassing to reintroduce.

## 8. Naming

- Files: `kebab-case.ts`, one exported concept per file matching the filename (`log-meal.use-case.ts` exports `LogMealUseCase`).
- Booleans read as questions (`isActive`, `hasCompletedToday`), not `active`/`completedToday`.
- Dates in code are always explicit about calendar-date vs. timestamp: `date: string /* YYYY-MM-DD */` vs `occurredAt: Date`.
