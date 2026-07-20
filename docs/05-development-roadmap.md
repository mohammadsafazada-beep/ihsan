# Development Roadmap

Solo-developer pace, one-week sprints. **Every sprint ends with a deployed, working application** — no sprint hands off a half-built feature to the next one. If a feature can't be finished production-quality within its sprint, it's cut down until it can (see `01-product-specification.md` non-goals) rather than shipped half-done.

## Sprint 0 — Foundations
**Goal: empty app deployed end-to-end.**
- TurboRepo + pnpm workspace scaffold (`apps/web`, `apps/api`, `packages/database`, `packages/contracts`, `packages/config`)
- Prisma schema (from `03-database-schema.md`) + initial migration, Postgres on Railway
- Clerk integration: sign-in/sign-up on `apps/web`, `ClerkAuthGuard` + webhook → `User` sync on `apps/api`
- Base layout, dark-mode theme, design tokens wired into Tailwind config
- CI: lint + typecheck + build on every push (GitHub Actions)
- Both apps deployed to Railway, talking to each other
- **Demo**: sign in, see an empty Dashboard shell that says "no data yet"

## Sprint 1 — Nutrition core
- Ingredient CRUD, Recipe CRUD with computed macros
- Log a Meal (from recipe or raw ingredient), edit/delete
- `/nutrition/summary` endpoint + Nutrition page showing today's meals and totals
- **Demo**: log real meals for a real day, see accurate macro totals

## Sprint 2 — Nutrition templates + Habits + Goals
- Meal Templates (create, save-meal-as-template, apply-to-date)
- Nutrition Targets (set target, versioned by date)
- Habits module (CRUD + daily check-off + streak display)
- Goals module (create/track weight goal)
- **Demo**: apply a saved template to today, check off habits, set a weight goal

## Sprint 3 — Training core
- Exercise catalog (seed ~40 common exercises) + custom exercise creation
- Workout Program + Workout Day + prescribed exercises (builder UI)
- Start a Workout Session, log sets (reps/weight/RPE) against it
- **Demo**: build a program, run a real session, log real sets

## Sprint 4 — Training intelligence
- Personal Record computation (recalculated on relevant set log)
- Progressive-overload suggestion endpoint + surfaced in session-start UI
- Exercise history view (all-time sets for one exercise, for later AI Coach grounding)
- **Demo**: log enough sessions to see a PR trigger and a weight suggestion change

## Sprint 5 — Progress + Dashboard
- Weight Entry + Measurement logging, history graphs
- Estimated body fat % / lean mass (computed, U.S. Navy method)
- Full Dashboard: aggregate use-case wiring today's workout, macros remaining, today's meals, today's habits, current/goal weight, weekly rollup, quick actions
- Dashboard polish pass (this is the "most polished page" — budget real design time here)
- **Demo**: the Dashboard fully answers "what do I do today" from real data

## Sprint 6 — AI Coach
- Chat UI (conversation list + message thread)
- Tool layer: the six read-only tools from `01-product-specification.md §4.5`, each wrapping an existing use-case
- LLM integration (tool-call loop, streaming responses)
- **Demo**: ask "I feel tired" and get an answer that cites real numbers

## Sprint 7 — Hardening & polish
- Responsive pass (desktop-first → mobile-friendly) across all screens
- Error states, empty states, loading states audit
- E2E smoke tests for the critical daily loop (log meal, log set, check habit, ask coach)
- Performance pass (query N+1 check, dashboard load time)
- Production readiness: backups configured on Railway Postgres, env var audit, error monitoring (Sentry or equivalent)
- **Demo**: this is v1. Daily-driver ready.

## Explicitly deferred past Sprint 7
See `10-future-improvements.md`. Nothing below is "Sprint 8" — it's a backlog to revisit after 30 days of real usage informs what's actually missing.
