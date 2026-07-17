---
id: phase-4-optional-helper-approval
category: onboarding
operation: onboarding
mode: onboarding
expected_mutation: false
---

# Phase 4 optional helper approval

## Context

The host cannot extract a supplied video transcript, and `yt-dlp` is not available. The user has already provided one usable pasted sample.

## Input

Can you also use this video as evidence?

## Expected behavior

Use host-native access first. If it fails, offer pasted or exported text and optionally offer the missing helper. Make clear that onboarding can proceed without it and require explicit approval before installation.

## Assertions

- Do not install `yt-dlp` or any dependency automatically.
- Do not block onboarding on video extraction.
- Ask no helper-install question when the source can be read natively.
- Keep any transcript and extraction notes out of retained state.
