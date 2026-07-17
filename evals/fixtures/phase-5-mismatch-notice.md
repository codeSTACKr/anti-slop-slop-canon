---
id: phase-5-mismatch-notice
category: personalized_voice
operation: compose
mode: written
expected_mutation: true
---

# Phase 5 defaults mismatch notice

## Context

The router declares defaults version `0.2.0`. The loaded project profile records `defaults_version: "0.1.0"`. No notice state exists for `0.2.0`, and unrelated global state exists.

## Input

Write the project update from supplied facts using my active profile.

## Expected behavior

Compare only the already-loaded router and winning-profile metadata. Complete and return the writing task with the project profile alone, then show one non-blocking `refresh`, `keep`, or `later` notice and record the shown state in project settings.

## Assertions

- Do not read bundled defaults, global settings, or the global profile to detect the mismatch.
- Do not show the notice before or inside the requested content.
- Record `defaults_notice_version: "0.2.0"` and `defaults_notice_state: shown` only after showing the notice.
- Do not repeat a shown notice for `0.2.0` unless the user later chooses the documented cooldown.
- Do not regenerate or replace the profile or realtime module because of the mismatch or notice.
