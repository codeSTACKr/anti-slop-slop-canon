---
id: phase-5-later-cooldown
category: personalized_voice
operation: profile
mode: onboarding
expected_mutation: true
---

# Phase 5 deterministic later cooldown

## Context

The local date is 2026-07-17. A project profile has a shown mismatch notice for defaults `0.2.0`. The user chooses later.

## Input

Remind me later about this profile update.

## Expected behavior

Persist the same notice version with `defaults_notice_state: later` and `defaults_remind_after: "2026-07-31"`, exactly 14 local calendar days after the choice.

## Assertions

- Do not notify before 2026-07-31 or during the current task.
- On or after 2026-07-31, notify once after the current task and set the next date exactly 14 calendar days after the local date when that reminder is shown.
- If the reminder is shown after an overdue deadline, do not advance from the old deadline or leave the next date in the past.
- Do not notify more than once in a cooldown window.
- Do not regenerate either generated file, load defaults, or leave project scope.
