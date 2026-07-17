---
id: repetitive-rhythm-report
category: ai_like
operation: rewrite
mode: written
expected_mutation: true
---

# Repetitive rhythm report

## Context

Rewrite a report whose repeated openings and equal sentence shapes make distinct facts sound mechanical.

## Input

The north sensor failed at 9:10. The north sensor restarted at 9:14. The north sensor sent its next reading at 9:16. The backup sensor stayed online throughout.

## Expected behavior

Vary the sentence shapes enough to restore a natural cadence while preserving every event and timestamp. Do not decorate the report or force the facts into a polished three-part sequence.

## Assertions

- Preserve `north sensor`, `9:10`, `9:14`, `9:16`, and the backup sensor's uninterrupted status.
- Keep the event order unchanged.
- Avoid repeating the same sentence opening three times.
- Do not add a cause, consequence, or assessment of reliability.
