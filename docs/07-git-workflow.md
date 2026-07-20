# Git Workflow

Solo-developer workflow — optimized for velocity with just enough discipline that history stays readable and `main` never breaks. No multi-reviewer process, but the *habits* of one (small commits, CI gate, no direct force-push) are kept because they're what keeps a five-year-old solo codebase legible to its future self.

## 1. Branching

- `main` is always deployable. Railway auto-deploys `main`.
- One short-lived branch per task: `feat/meal-templates`, `fix/pr-calculation-off-by-one`, `chore/upgrade-prisma`. Branch from and merge back to `main`.
- No `develop` branch, no long-lived environment branches — unnecessary process for a single deploy target.

## 2. Commits

- [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`. Scoped when helpful: `feat(nutrition): add meal templates`.
- Commit at the size of "one coherent change I could explain in one sentence." Not one commit per file, not one commit per day.
- Never commit directly against a red CI run — fix or revert before continuing.

## 3. Pull requests

- Even solo, open a PR per branch before merging — it's the checkpoint where CI runs and where you self-review the diff before it lands on `main`. Squash-merge into a single commit on `main` per PR.
- PR description: what changed and why, not a restatement of the diff. Link the roadmap sprint item it closes.

## 4. CI gate (required to merge)

1. `pnpm lint`
2. `pnpm typecheck`
3. `pnpm test`
4. `pnpm build` (both apps)

All four must pass. No `--no-verify`, no skipped checks, ever — a single-user app has no safety net of "other users didn't notice"; a broken `main` means the app you use daily is broken.

## 5. Releases

- Tag `main` at the end of each sprint: `v0.1.0` (Sprint 0), `v0.2.0` (Sprint 1), … `v1.0.0` at the end of Sprint 7. Tag message = the sprint's demo bullet from `05-development-roadmap.md`.
- No changelog automation needed at this scale — the tag + PR history is the changelog.

## 6. Database migrations

- Every schema change is a Prisma migration committed alongside the code that needs it, in the same PR. Never hand-edit the schema on Railway's Postgres directly.
- Migrations are one-way forward in this repo's history — if a migration is wrong, write a new corrective migration rather than editing a merged one, even solo (Railway's deployed database has already seen it).
