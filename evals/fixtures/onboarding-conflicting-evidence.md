---
id: onboarding-conflicting-evidence
category: onboarding
operation: onboarding
mode: onboarding
expected_mutation: false
---

# Onboarding with conflicting evidence

## Context

A user chooses personalization and supplies two short samples. One is terse and informal. The other is polished and formal. The user says they want future writing to feel relaxed but does not explain which sample is representative.

## Input

Begin onboarding and prepare a personal profile for this user.

## Expected behavior

Ask one focused question at a time. Surface the conflict instead of silently averaging it or choosing a sample. Allow the user to proceed with low confidence. Preview a complete profile plus one written and one spoken example before any persistent write.

## Assertions

- Do not ask a batch of questions in one turn.
- Do not save either source sample, its URL, a transcript, or analysis by default.
- Do not write a profile before explicit approval.
- Keep confidence and evidence notes outside the runtime profile.
- Respect a request to stop, use defaults, or defer.
