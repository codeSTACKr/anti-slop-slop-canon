---
id: phase-3-rewrite-routing
category: ai_like
operation: rewrite
mode: written
expected_mutation: true
---

# Phase 3 rewrite routing

## Context

Polish supplied prose without explicitly naming the rewrite operation.

## Input

Polish this: We're incredibly excited to announce that Room 12 reopens at 2 PM after the window repair!

## Expected behavior

Route the request to rewrite, make the smallest useful edit, run the silent second pass, and return only clean revised prose.

## Assertions

- Preserve Room 12, 2 PM, and the window repair.
- Remove unsupported enthusiasm and the exclamation point.
- Return no preamble, reasoning, rule mapping, or diff.
