---
id: phase-4-first-use-choice
category: onboarding
operation: onboarding
mode: onboarding
expected_mutation: false
---

# Phase 4 first-use choice

## Context

A project-scoped copy receives its first natural-language writing task. The project state directory has neither `voice-profile.md` nor `settings.md`. Global state may exist but is out of scope.

## Input

Write a two-sentence project update from the supplied facts.

## Expected behavior

Before writing, ask exactly one choice: personalize now, use defaults, or defer. Do not inspect global state or ask any second setup question in the same turn.

## Assertions

- Present all three choices and no onboarding questionnaire yet.
- Treat the project directory as the only state scope.
- Do not claim any profile, prompt, or settings write before a choice.
- Resume the original task after a defaults or defer choice.
- After first-use personalization is approved, resume the original task with the approved profile.
