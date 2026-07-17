---
id: phase-3-audit-routing
category: ai_like
operation: audit
mode: written
expected_mutation: false
---

# Phase 3 audit routing

## Context

Inspect mutable prose for active-rule violations without editing it.

## Input

Audit this without rewriting: Here's the thing: this revolutionary update changes everything!

## Expected behavior

Route the request to audit and report concrete findings without supplying corrected prose.

## Assertions

- Identify the canned phrase, unsupported hype, mid-sentence colon, and exclamation point.
- Map findings to active rules.
- Do not rewrite or silently replace the input.
