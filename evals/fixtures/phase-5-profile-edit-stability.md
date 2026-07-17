---
id: phase-5-profile-edit-stability
category: personalized_voice
operation: profile
mode: written
expected_mutation: false
---

# Phase 5 profile inspection and edit stability

## Context

A project profile was directly edited after onboarding. Its valid ten-section bundle now prefers sentence fragments, while the existing realtime module predates that edit. The user asks to inspect the active profile. Global state also exists.

## Input

Show my active voice profile, its versions, and lifecycle state. Do not change anything.

## Expected behavior

Return the project profile unchanged with its project state path, scope, schema version, content version, `defaults_version`, and minimal lifecycle settings. Treat the direct edit as authoritative and keep inspection read-only.

## Assertions

- Do not inspect global state, load defaults, or regenerate either generated file.
- Do not normalize the fragment preference or silently synchronize the realtime module.
- Route an explicit re-onboarding request through the preview-and-approval onboarding workflow.
- Preserve the exact three-file state allowlist.
