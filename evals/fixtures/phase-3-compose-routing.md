---
id: phase-3-compose-routing
category: ai_like
operation: compose
mode: written
expected_mutation: true
---

# Phase 3 compose routing

## Context

Create a written maintenance update from supplied facts without an explicit operation name.

## Input

Write a note saying the west elevator reopens Tuesday after the door sensor is replaced. The east elevator remains available.

## Expected behavior

Route the request to compose, select written mode without asking, use only the supplied facts, run the silent second pass, and return clean prose.

## Assertions

- Preserve Tuesday, the door sensor, and the east elevator's availability.
- Do not invent a time, cause, safety claim, or apology.
- Return no operation label, explanation, checklist, or diff.
