---
id: spoken-cadence-control
category: good_prose
operation: rewrite
mode: spoken
expected_mutation: false
---

# Spoken cadence control

## Context

Review a short announcement that already puts the main point first and reads clearly on one hearing.

## Input

Route 4 leaves from Bay C today. Your ticket still works. Staff will be there if you need help finding the bay.

## Expected behavior

Leave the announcement unchanged. Do not add visual formatting, merge the sentences, or replace its natural repetition with pronouns.

## Assertions

- Preserve `Route 4`, `Bay C`, and the ticket guidance.
- Keep all three sentences in the same order.
- Preserve the repeated reference to the bay because it helps first-listen clarity.
- Treat no mutation as a successful result.
