---
id: phase-5-refresh-preview
category: personalized_voice
operation: profile
mode: onboarding
expected_mutation: true
---

# Phase 5 refresh preview and approval

## Context

After a mismatch notice, the user chooses refresh. The current project profile includes direct edits and records defaults `0.1.0`; current defaults are `0.2.0`. A prior personalized realtime module is active.

## Input

Refresh my profile for the new defaults.

## Expected behavior

Start a separate complete recompilation after the prior writing task. Treat current profile instructions, including direct edits, as approved preferences over the new defaults. Preview the complete replacement profile, complete realtime module, one written example, and one spoken example before any replacement.

## Assertions

- Do not automatically merge, patch, overwrite, or activate either proposed file.
- Increment profile content version, set `defaults_version: "0.2.0"`, preserve project scope, all ten sections, and both context budgets.
- Require explicit approval, then stage and validate both files before rollback-protected pair replacement.
- On cancellation or failure, preserve the prior profile and prompt as the active pair.
- On cancellation, failure, or an interrupted stale refresh, restore the notice to `shown`, remove any reminder date, and do not display a duplicate notice.
- Clear lifecycle notice keys only after approved replacement makes profile metadata current.
