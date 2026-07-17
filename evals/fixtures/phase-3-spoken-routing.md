---
id: phase-3-spoken-routing
category: spoken_output
operation: compose
mode: spoken
expected_mutation: true
---

# Phase 3 spoken routing

## Context

Prepare one-hearing narration from supplied facts.

## Input

Write narration for a training video. The red switch stops the conveyor. The green switch restarts it after the guard is closed.

## Expected behavior

Infer spoken mode from the explicit narration context without asking and optimize for pronounceable, first-listen delivery.

## Assertions

- Preserve the switch colors, actions, and closed-guard condition.
- Use no Markdown, emojis, visual-only notation, or stage directions.
- Do not treat the ambiguous word `write` as evidence for written mode.
