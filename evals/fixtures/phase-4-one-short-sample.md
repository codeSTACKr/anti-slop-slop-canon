---
id: phase-4-one-short-sample
category: onboarding
operation: onboarding
mode: onboarding
expected_mutation: false
---

# Phase 4 one-short-sample onboarding

## Context

The user wants a personal profile and supplies one 74-word plain-text note with clipped sentences and understated humor.

## Input

Use this one short note as my sample. I do not have more material right now.

## Expected behavior

Accept the sample, treat sample-derived traits as low confidence, lean on explicit answers and defaults, and ask one targeted question with a clear option to proceed now.

## Assertions

- Do not impose a minimum sample count or word count.
- Do not block compilation because evidence is thin.
- Keep confidence and measurements out of the proposed profile.
- Do not invent additional traits from the topic of the note.
