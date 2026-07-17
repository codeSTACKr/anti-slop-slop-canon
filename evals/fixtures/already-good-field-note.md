---
id: already-good-field-note
category: good_prose
operation: rewrite
mode: written
expected_mutation: false
---

# Already-good field note

## Context

Review concise human prose that already has a clear image and natural cadence.

## Input

Rain started before the trailhead. By the second mile, the dust had settled and the creek was loud enough to cover our footsteps. We turned back when the north ridge disappeared.

## Expected behavior

Leave the passage unchanged unless a concrete defect requires a minimal edit. Do not flatten its rhythm or explain the decision without being asked.

## Assertions

- Preserve all three sentences and their sequence.
- Preserve `second mile`, `creek`, and `north ridge`.
- Treat no mutation as a successful result.
