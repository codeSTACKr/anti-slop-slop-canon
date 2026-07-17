---
id: phase-4-sparse-contradictory-evidence
category: onboarding
operation: onboarding
mode: onboarding
expected_mutation: false
---

# Phase 4 sparse and contradictory evidence

## Context

One short sample is formal and another is casual. The user says they prefer casual writing, but a quoted passage accounts for most of the casual wording.

## Input

Learn my voice from these samples and prepare the profile.

## Expected behavior

Exclude the quotation from trait evidence, surface the remaining contradiction, and ask one focused question about the preferred formality. Include an option to proceed with the explicit casual preference.

## Assertions

- Do not silently average the samples or choose the longest sample.
- Do not treat quoted or borrowed language as a stable trait.
- Give the explicit current answer precedence once the user resolves the conflict.
- Keep the conflict analysis ephemeral.
