---
id: phase-4-defaults-defer
category: onboarding
operation: onboarding
mode: onboarding
expected_mutation: true
---

# Phase 4 defaults and defer choices

## Context

Two first-use branches are tested in project scope. One user selects use defaults. Another selects defer.

## Input

Record my choice and finish the original writing task.

## Expected behavior

Write only minimal in-scope setup state: `setup: defaults` or `setup: deferred`. Use bundled defaults for the original task and do not start personalization.

## Assertions

- Create no profile or personalized realtime prompt.
- Write nowhere above `<project-root>/.anti-slop-slop-canon/`.
- Do not implement reminder cooldown, refresh, keep, or later lifecycle fields.
- Do not ask the first-use choice again while that settings state exists.
