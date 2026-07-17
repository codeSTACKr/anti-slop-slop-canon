---
id: spoken-service-delay
category: spoken_output
operation: compose
mode: spoken
expected_mutation: true
---

# Spoken service delay

## Context

Prepare a short service announcement that will be read aloud once in a station.

## Input

Tell passengers that Route 6 is delayed about 15 minutes because a disabled vehicle is blocking Oak Street. Valid tickets will be accepted on Route 9 until 6:30 PM.

## Expected behavior

Choose spoken guidance without asking. Optimize for first-listen clarity and pronounceable delivery rather than visual scanning.

## Assertions

- Preserve Route 6, about 15 minutes, Oak Street, Route 9, and 6:30 PM.
- State the delay before the ticket alternative.
- Avoid Markdown, emojis, visual-only notation, and stage directions.
- Do not imply that service is cancelled.
