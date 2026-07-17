# Written versus spoken choice rubric

## What it measures

Whether the router selects written or spoken guidance correctly from context, resolves ambiguous cases silently in the written default instead of asking, and never lets one mode's habits leak into the other.

## Scoring scale

Score each generation 0 to 3.

- **0, routing failure.** The wrong mode was selected, the model asked a routing question when context already answered it, or Markdown, emojis, or other visual-only notation appears in spoken output.
- **1, correct mode with leakage.** The mode is right, but a written-only habit shows up in spoken output, or a spoken-only habit (like a filler word) shows up in written output.
- **2, clean routing.** The correct mode is selected with no cross-contamination, matching the fixture's `Expected behavior` exactly.
- **3, clean routing under ambiguity.** Same as 2, and an ambiguous case that could plausibly read as either mode is resolved silently toward written, with no clarifying question.

## Pass and fail thresholds

A generation passes at 2 or 3. Any 0 on a routing fixture blocks release. This maps to the "written/spoken routing... pass" clause of the Phase 6 exit criteria. Context-budget and scope-isolation portions of that same exit criterion are checked deterministically by `scripts/validate.rb` and are not re-scored here.

## Fixtures that exercise this rubric

- `phase-3-compose-routing`
- `phase-3-spoken-routing`
- `spoken-service-delay`
- `phase-4-personalized-realtime`
- `phase-5-explicit-realtime-regeneration`
- `spoken-cadence-control`

Score routing decisions against each fixture's `Expected behavior` section. Spoken-mode delivery quality itself is scored separately under [first-listen clarity](first-listen-clarity.md).
