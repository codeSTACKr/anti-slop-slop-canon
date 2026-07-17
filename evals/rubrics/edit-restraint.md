# Edit restraint rubric

## What it measures

Whether the model changes only what needs changing. Clean prose stays untouched, deliberate rhythm and fragments survive, and warranted hedges are not smoothed into false confidence. This rubric checks over-editing and under-editing on the same scale, since both are restraint failures.

## Scoring scale

Score each generation 0 to 3.

- **0, restraint failure.** The model rewrote prose that needed no change, or flattened a deliberate stylistic choice, such as a fragment, a repeated word, or a warranted hedge, into generic prose.
- **1, partial restraint.** The prose stayed mostly intact, but one deliberate choice was smoothed away that did not need to be.
- **2, restraint held.** Where a fixture marks `expected_mutation: false`, nothing changed. Where it marks `expected_mutation: true`, only the necessary edit happened.
- **3, restraint held with legible reasoning.** Same as 2, and when an audit or diff is requested, the response names the specific rule behind each change rather than rewriting silently.

## Pass and fail thresholds

A generation passes at 2 or 3. Any 0 or 1 on a `good_prose` fixture or an `expected_mutation: false` fixture blocks release. This maps to the Phase 6 exit criterion "good-writing controls do not regress."

## Fixtures that exercise this rubric

- `already-good-field-note`
- `dry-humor-control`
- `warranted-uncertainty-control`
- `spoken-cadence-control`
- `phase-3-audit-routing`
- `phase-5-profile-edit-stability`

Score each fixture's `Expected behavior` and `Assertions` sections against the actual host generation. A pass requires zero unrequested edits on every `expected_mutation: false` fixture in the set, not an average across the set.
