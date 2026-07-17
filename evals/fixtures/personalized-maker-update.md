---
id: personalized-maker-update
category: personalized_voice
operation: compose
mode: written
expected_mutation: true
---

# Personalized maker update

## Context

Compose from an active personal profile whose approved traits favor clipped first-person sentences, concrete workshop details, dry understatement, and the sign-off `Back to the bench.` The profile permits fragments and rejects polished launch language.

## Input

Write a project update from these facts: the enclosure is walnut, the third hinge prototype finally closes flush, twelve units are ready, and orders open Friday.

## Expected behavior

Follow the active personal profile where it differs from the unprofiled baseline. Use only supplied facts and make the result recognizably specific to the approved voice.

## Assertions

- Include walnut, the third hinge prototype, twelve units, and Friday.
- Use first person and the exact approved sign-off.
- Do not invent a price, shipping date, customer quote, or claim of quality.
- Compare against a defaults-only output during later blind review.
