# Component Conventions

## 1. Primitives vs. feature components

- `components/ui/*` = shadcn/ui primitives (Button, Card, Dialog, Input, ...), generated via the shadcn CLI and left close to stock. Don't fork/rewrite a primitive to fit one screen — extend via props/composition instead.
- `features/*/components/*` = everything domain-specific (`MacrosCard`, `SetLogRow`, `HabitChecklist`). These compose primitives; they never redefine styling that a primitive already provides.

## 2. Component structure

- **Presentational components** take data + callbacks as props and render. No `useQuery`/`useMutation` inside them — this is what makes them easy to place on the Dashboard, a detail page, or a Storybook-less manual test without rewiring data fetching.
- **Container components** (usually the thing a route renders) call the feature's `hooks/`/`api/` functions and pass results down to presentational components.
- A component that needs both data-fetching and complex presentation is split into a thin container + presentational child, not left as one file mixing both — this is the concrete form of "no business logic inside React components."

## 3. Naming & files

- One component per file, filename matches the exported component (`MacrosCard.tsx` exports `MacrosCard`).
- Props typed with a named `interface <ComponentName>Props`, not inline object types, so the shape is greppable and reusable in tests.
- Co-locate a component's tiny helper (e.g. a formatter used only by it) in the same file; promote to `lib/` only once a second component needs it.

## 4. Forms

- Every form: React Hook Form + `zodResolver` against the same schema from `packages/contracts` that the API validates. Field-level errors render from RHF's `formState.errors` — no separate manual validation path.
- Optimistic UX for fast, common actions (log a set, check a habit) via TanStack Query's `onMutate` — the whole point of "logging fast" from the product spec. Non-optimistic for anything destructive (delete) or infrequent (creating a program).

## 5. State

- Server state (anything from the API) lives in TanStack Query — never mirrored into `useState`.
- Local UI state (dialog open, active tab) is `useState`/`useReducer` in the component that owns it. No global client-state library — nothing in this app needs cross-tree client state that isn't server state.

## 6. Styling

- Tailwind utility classes directly in JSX. `cn()` helper (clsx + tailwind-merge) for conditional classes. No CSS modules, no styled-components — one styling approach, no exceptions.
- Design tokens (`09-design-tokens.md`) are the only source of raw color/spacing values. No hard-coded hex colors or magic pixel values in a component — if the token you need doesn't exist, add it to the token set, don't inline it.

## 7. Loading / empty / error states

Every data-driven component defines all three explicitly — this app has no "just spin forever" or "blank white box" states:
- **Loading**: skeleton matching the real layout (no generic spinner-in-a-box for anything above a button-level action).
- **Empty**: a specific message + the relevant quick action (e.g. Nutrition page with no meals today shows "No meals logged yet" + "Log a meal" button, not a bare empty list).
- **Error**: a retry action, never a raw error message/stack.

## 8. Accessibility baseline

- All interactive elements keyboard-reachable and labeled (shadcn primitives handle most of this — don't bypass them with raw `<div onClick>`).
- Color is never the only signal (e.g. "calories over target" pairs a color change with a text/icon change too).
