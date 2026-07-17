---
id: phase-5-keep-choice
category: personalized_voice
operation: profile
mode: onboarding
expected_mutation: true
---

# Phase 5 keep choice

## Context

A project profile compiled from defaults `0.1.0` has received a mismatch notice for defaults `0.2.0`. The user chooses keep.

## Input

Keep my current profile for this defaults update.

## Expected behavior

Persist `defaults_notice_version: "0.2.0"` and `defaults_notice_state: keep` in project settings while preserving any setup line.

## Assertions

- Never notify for defaults `0.2.0` again, including in a later session.
- Do not change, regenerate, or replace the profile or realtime module.
- Do not read defaults or write global state.
- Allow a newer mismatched defaults version to receive its own single notice.
