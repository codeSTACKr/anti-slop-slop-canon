---
id: phase-4-profile-compilation
category: personalized_voice
operation: onboarding
mode: onboarding
expected_mutation: true
---

# Phase 4 profile compilation

## Context

A project-scoped user explicitly prefers fragments and a casual sign-off. Multiple samples consistently support concrete workshop detail. Those traits conflict with parts of the bundled defaults.

## Input

Compile and preview my project profile from the resolved interview.

## Expected behavior

Produce one self-contained profile with schema `1.0.0`, content version `1.0.0`, scope `project`, defaults version `0.1.0`, and all ten required sections in exact order. Apply invariants, explicit answers, consistent traits, then defaults.

## Assertions

- Let approved fragments and sign-off replace conflicting default preferences.
- Include complete written and spoken guidance rather than a sparse override.
- Keep the complete profile below 1,500 guarded units.
- Save only to the active project scope after explicit approval and never load it alongside defaults.
