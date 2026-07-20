# Future Improvements (post-v1 backlog)

Explicitly not built in v1. Listed with rationale so a future decision to build them is informed, not default. Nothing here should be started before v1 has been used daily for at least 30 days — real usage should decide what's actually missing, not this list's existence.

## Near-term candidates (likely v1.1)

- **Progress photos.** Supabase Storage upload, timeline view, before/after comparison slider. Deferred because it's a meaningful chunk of infrastructure (upload, storage lifecycle, privacy) for a feature that's valuable weekly/monthly, not daily — lower priority than anything on the daily critical path.
- **AI Coach write-actions.** Letting the AI log a meal or adjust a workout via tool calls. Requires a confirmation/undo UX pattern that doesn't exist yet ("the AI is about to log X — confirm?") and an audit trail of AI-initiated writes. Do this once the read-only Coach has proven its advice is actually good.
- **Multi-day meal scheduling ("real" Meal Plans).** If Meal Templates (v1) turn out to be limiting — e.g. wanting to pre-plan a whole week rather than apply one template at a time — build a proper scheduling entity then, informed by which limitation is actually felt.

## Medium-term

- **Wearable/health data integration** (Apple Health, Oura, Whoop) — sleep, resting heart rate, steps, HRV. High-value for the AI Coach ("I feel tired" gets a real sleep signal instead of an inference from training load alone), but each integration is a nontrivial OAuth + sync + schema addition. Prioritize sleep first since the AI Coach example in the product spec explicitly calls it out.
- **Redis caching / rate limiting.** Not needed at single-user request volume. Revisit if the AI Coach's LLM calls need response caching or if request volume ever changes (e.g. exposing an API to other clients).
- **Notifications / reminders** ("log your weight", "workout today") — likely valuable for daily-driver stickiness, deliberately deferred because it's easy to over-build (push infra, notification preferences) before knowing which reminders actually get used.
- **Voice input for AI Coach** — lower friction than typing, natural fit for gym/kitchen contexts. Needs the text chat to be proven useful first.

## Long-term / speculative

- **Additional life domains beyond body/food/training** — sleep, finance, work/deep-focus tracking — feeding the same AI Coach and Dashboard. This is the actual long-term vision of "Personal AI Operating System," but every new domain is a new module with its own data model; add them one at a time, each validated the same way Nutrition/Training were (a real daily loop, not a speculative one).
- **Offline-first / PWA.** Only worth it if connectivity is actually a recurring problem in daily use.
- **Native mobile app.** Only worth it if the responsive web app's mobile experience proves to be a real limitation, not a hypothetical one.
- **Multi-user support.** Explicitly not a goal of this product. If ever revisited, the `userId`-on-every-table design (see `03-database-schema.md §1`) means the data model doesn't need to change — only auth/authorization would.

## Explicitly rejected, not just deferred

- **Gamification** (points, badges, leaderboards, streak "rewards"). Contrary to the product philosophy — habit streaks are shown as information, never as a game mechanic. Not a "later" item; a deliberate permanent no.
- **Social features** (sharing, feeds, friends). This is a single-user personal OS by design, not a social product.
- **Monetization/billing.** No business model to build for a personal tool.
