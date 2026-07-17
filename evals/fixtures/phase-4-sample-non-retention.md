---
id: phase-4-sample-non-retention
category: onboarding
operation: onboarding
mode: onboarding
expected_mutation: true
---

# Phase 4 sample non-retention

## Context

The user supplies pasted text, a local Markdown file, a URL, and a temporary transcript. They approve the final profile.

## Input

Save the profile for this project using those sources.

## Expected behavior

Leave the user's local original in place, discard temporary derived material, and retain only the approved profile, approved realtime prompt, and minimal settings in active state.

## Assertions

- Retain no pasted text, URL, download, transcript, source list, extraction note, confidence data, measurement, or onboarding analysis.
- Do not copy the local Markdown sample into state.
- Do not verify authorship, ownership, identity, or provenance.
- Keep the state directory to the exact three-file allowlist.
