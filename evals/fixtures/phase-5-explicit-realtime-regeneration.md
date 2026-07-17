---
id: phase-5-explicit-realtime-regeneration
category: spoken_output
operation: realtime
mode: spoken
expected_mutation: true
---

# Phase 5 explicit realtime regeneration

## Context

The user directly edited a valid global profile but has not refreshed or rerun onboarding. They explicitly request a new realtime module from that active profile.

## Input

Regenerate and preview my realtime voice prompt from my current profile.

## Expected behavior

Use the active profile alone to generate and preview one complete style-only realtime module. Require explicit approval, validate the guarded budget and policy boundary, then replace only the global realtime prompt with rollback protection.

## Assertions

- Do not load defaults, rewrite the profile, or infer regeneration merely from the prior direct edit.
- Do not write the prompt before approval or outside global state.
- Keep the module between 250 and 400 guarded units and preserve every realtime policy exclusion.
- Regenerate only during approved onboarding, approved refresh, or this explicit request.
