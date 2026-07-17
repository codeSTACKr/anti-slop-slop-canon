---
id: phase-4-preview-before-save
category: onboarding
operation: onboarding
mode: onboarding
expected_mutation: false
---

# Phase 4 preview before save

## Context

The interview is decision-complete. No active-scope state file exists yet.

## Input

I am ready to see what you came up with.

## Expected behavior

Show the complete proposed profile, complete personalized realtime module, one short written example, and one short spoken example before any write. Offer approve, revise one trait, or continue the interview.

## Assertions

- Require explicit approval after the full preview.
- Do not write `voice-profile.md`, `realtime-voice-prompt.md`, or `settings.md` during preview.
- A trait revision must lead to a new complete preview.
- Do not describe the preview as already saved or active.
