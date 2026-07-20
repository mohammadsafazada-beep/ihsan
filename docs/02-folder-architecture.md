# Folder Architecture

## 1. Monorepo layout (TurboRepo + pnpm workspaces)

```
ihsan/
├── apps/
│   ├── web/                 # Next.js frontend
│   └── api/                 # NestJS backend
├── packages/
│   ├── database/            # Prisma schema + generated client, one source of truth
│   ├── contracts/           # Shared Zod schemas + TS types (DTOs) used by web AND api
│   └── config/              # Shared tsconfig, eslint, prettier presets
├── docs/                    # This documentation set
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

**Deliberately not included in v1**: a shared `packages/ui` component library. There is exactly one frontend app — a shared UI package is speculative generality until a second app (e.g. a native client) exists. Components live in `apps/web`.

## 2. `packages/contracts`

The single source of truth for request/response shapes, shared between NestJS controllers and the Next.js API client. Built with Zod so the same schema gives you runtime validation on the API side and static types on both sides.

```
packages/contracts/src/
├── nutrition/ (ingredient.schema.ts, recipe.schema.ts, meal.schema.ts, meal-template.schema.ts, nutrition-target.schema.ts)
├── training/  (program.schema.ts, workout-day.schema.ts, exercise.schema.ts, session.schema.ts, set-log.schema.ts, pr.schema.ts)
├── progress/  (weight-entry.schema.ts, measurement.schema.ts)
├── goals/     (goal.schema.ts)
├── habits/    (habit.schema.ts, habit-log.schema.ts)
├── ai-coach/  (chat-message.schema.ts)
└── index.ts
```

## 3. `apps/api` (NestJS) — Clean Architecture, feature-sliced

Each feature module is internally layered. Dependencies point **inward only**: Presentation → Application → Domain. Infrastructure implements Domain-defined ports and is injected via NestJS DI — it never leaks upward.

```
apps/api/src/
├── modules/
│   ├── nutrition/
│   │   ├── presentation/
│   │   │   ├── ingredient.controller.ts
│   │   │   ├── recipe.controller.ts
│   │   │   └── meal.controller.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── create-recipe.use-case.ts
│   │   │   │   ├── log-meal.use-case.ts
│   │   │   │   ├── apply-meal-template.use-case.ts
│   │   │   │   └── get-daily-macro-summary.use-case.ts
│   │   │   └── ports/
│   │   │       ├── ingredient.repository.port.ts
│   │   │       ├── recipe.repository.port.ts
│   │   │       └── meal.repository.port.ts
│   │   ├── domain/
│   │   │   ├── entities/ (recipe.entity.ts, meal.entity.ts, ...)
│   │   │   ├── value-objects/ (macros.vo.ts)
│   │   │   └── services/ (macro-calculator.service.ts)
│   │   ├── infrastructure/
│   │   │   └── repositories/ (prisma-ingredient.repository.ts, ...)
│   │   └── nutrition.module.ts
│   ├── training/          # same 4-layer shape
│   ├── progress/          # same 4-layer shape
│   ├── goals/              # same 4-layer shape
│   ├── habits/             # same 4-layer shape
│   ├── ai-coach/
│   │   ├── presentation/ (chat.controller.ts)
│   │   ├── application/
│   │   │   ├── tools/ (get-nutrition-summary.tool.ts, get-training-history.tool.ts, ...)
│   │   │   └── use-cases/ (send-message.use-case.ts)
│   │   ├── domain/ (chat-conversation.entity.ts)
│   │   └── infrastructure/ (llm-client.adapter.ts, repositories/)
│   └── users/              # profile, synced from Clerk webhook
├── shared/
│   ├── guards/ (clerk-auth.guard.ts)
│   ├── interceptors/ (response-envelope.interceptor.ts)
│   ├── filters/ (domain-exception.filter.ts)
│   └── decorators/ (current-user.decorator.ts)
├── app.module.ts
└── main.ts
```

**Rule**: an `ai-coach` "tool" is a thin wrapper that calls the *same* use-case a controller calls (e.g. `get-nutrition-summary.tool.ts` calls `GetDailyMacroSummaryUseCase`, same class the `meal.controller.ts` GET endpoint calls). This is what makes "AI never accesses the database directly" true by construction, not by convention.

**Rule**: nothing under `infrastructure/` is imported by anything outside its own module. Controllers depend on Application; Application depends on Domain + Ports; only Infrastructure depends on Prisma.

## 4. `apps/web` (Next.js, App Router) — feature-sliced, thin routes

```
apps/web/src/
├── app/                        # routing only — no business logic, minimal JSX
│   ├── (dashboard)/page.tsx
│   ├── nutrition/...
│   ├── training/...
│   ├── progress/...
│   ├── coach/page.tsx
│   └── layout.tsx
├── features/
│   ├── dashboard/
│   │   ├── components/ (TodayWorkoutCard.tsx, MacrosCard.tsx, ...)
│   │   ├── hooks/ (useDashboardData.ts)
│   │   └── api/ (dashboard.api.ts)          # TanStack Query hooks, typed via packages/contracts
│   ├── nutrition/  (components/ hooks/ api/)
│   ├── training/   (components/ hooks/ api/)
│   ├── progress/   (components/ hooks/ api/)
│   ├── habits/     (components/ hooks/ api/)
│   ├── goals/      (components/ hooks/ api/)
│   └── ai-coach/   (components/ hooks/ api/)
├── components/ui/              # shadcn primitives (button, card, dialog, ...) — generated, not hand-rolled
├── lib/
│   ├── api-client.ts           # fetch wrapper, base URL, auth header injection
│   ├── query-client.ts
│   └── utils.ts
└── styles/globals.css
```

`app/` route files are only allowed to: fetch initial data via a server component calling a `features/*/api` function, and render a feature component. No calculations, no direct fetch calls, no inline business logic.

## 5. Import boundaries (enforced via eslint `no-restricted-imports` / import zones)

- `apps/web` may import `packages/contracts`. It may **not** import anything from `apps/api`.
- `apps/api` may import `packages/contracts` and `packages/database`.
- `packages/database` (Prisma) is imported **only** from `infrastructure/` folders inside `apps/api`.
- Cross-feature imports inside either app go through the other feature's public `index.ts`, never into its internals.
