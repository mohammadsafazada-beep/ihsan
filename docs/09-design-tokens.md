# Design Tokens

Aesthetic target: Linear's density and restraint, Apple Health's clarity with numbers, dark mode as the primary (not secondary) experience. Minimal motion, no decorative animation, fast perceived performance over visual flourish.

## 1. Color — dark mode is the default theme

Defined as CSS variables in `globals.css`, consumed via Tailwind's `hsl(var(--token))` pattern so both themes share one set of Tailwind class names.

```css
:root {
  /* Dark (default) */
  --background:        222 15% 8%;    /* near-black, slightly warm */
  --surface:            222 14% 11%;   /* cards, panels */
  --surface-raised:     222 13% 15%;   /* modals, popovers */
  --border:              222 10% 20%;

  --text-primary:       210 20% 96%;
  --text-secondary:     215 12% 65%;
  --text-tertiary:      215 10% 45%;

  --accent:              255 85% 65%;  /* primary brand/interactive — indigo, not blue */
  --accent-foreground:   0 0% 100%;

  --success:             150 60% 45%;  /* under target / on track */
  --warning:             40 90% 55%;   /* close to limit */
  --danger:              5 80% 60%;    /* over target / missed */

  --focus-ring:          255 85% 65%;
}

[data-theme="light"] {
  --background:        0 0% 100%;
  --surface:            220 20% 98%;
  --surface-raised:     0 0% 100%;
  --border:              220 15% 90%;

  --text-primary:       222 20% 12%;
  --text-secondary:     220 10% 40%;
  --text-tertiary:      220 8% 55%;

  --accent:              255 75% 55%;
  --accent-foreground:   0 0% 100%;

  --success:             150 55% 38%;
  --warning:             40 85% 45%;
  --danger:              5 75% 50%;

  --focus-ring:          255 75% 55%;
}
```

**Rule**: color always pairs with an icon or text change for state (see `08-component-conventions.md §8`) — `success`/`warning`/`danger` are accents, not the sole signal.

## 2. Typography

- Font: **Inter** (system-ui fallback stack). One typeface, no display font — numbers (calories, weights, reps) are the visual hierarchy, not headline fonts.
- Tabular figures (`font-variant-numeric: tabular-nums`) on every numeric stat so dashboard numbers don't jitter as they update.

| Token | Size / Line height | Use |
|---|---|---|
| `text-display` | 32px / 40px, semibold | Dashboard hero numbers (current weight, calories remaining) |
| `text-title` | 20px / 28px, semibold | Page/section titles |
| `text-body` | 15px / 22px, regular | Default body text |
| `text-caption` | 13px / 18px, regular | Secondary labels, metadata |
| `text-micro` | 11px / 14px, medium, uppercase, tracked | Section eyebrows ("TODAY", "THIS WEEK") |

## 3. Spacing scale

4px base unit: `1 → 4px, 2 → 8px, 3 → 12px, 4 → 16px, 6 → 24px, 8 → 32px, 12 → 48px, 16 → 64px`. Maps directly onto Tailwind's default scale — no custom spacing config needed beyond confirming these are the only values used.

## 4. Radius

- `radius-sm: 6px` — inputs, small buttons, badges
- `radius-md: 10px` — cards, dialogs
- `radius-lg: 16px` — Dashboard hero cards only

No fully-rounded (`9999px`) elements except avatars/status dots.

## 5. Elevation

Flat by default (borders, not shadows, separate surfaces — Linear's approach). Shadow reserved for genuinely floating elements:

- `shadow-none` — cards on the page (bordered, not shadowed)
- `shadow-popover` — dropdowns, popovers, dialogs only: `0 4px 16px hsl(0 0% 0% / 0.25)`

## 6. Motion

- Durations: `120ms` (hover/press feedback), `200ms` (panel/dialog enter-exit). Nothing longer.
- Easing: `cubic-bezier(0.2, 0, 0, 1)` (fast-out, no bounce/spring).
- No animation on data updates beyond a subtle 120ms opacity/scale on the changed number — no confetti, no progress-bar fill animations, no celebratory motion anywhere (ties back to the explicit "forget gamification" product decision).

## 7. Layout

- Desktop-first max content width: `1120px`, centered, with the Dashboard using a responsive grid (`grid-cols-12`) that collapses to a single column under `768px`.
- Sidebar navigation on desktop (`≥1024px`), bottom tab bar on mobile (`<768px`) — Linear-style sidebar, no hamburger menu.
