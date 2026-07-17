---
id: phase-4-optional-helper-approval
category: onboarding
operation: onboarding
mode: onboarding
expected_mutation: false
---

# Phase 4 optional helper approval

## Context

Pasted text, Markdown, and a local plain-text file are available. The user also supplies a URL, PDF, video, and transcript. The host cannot extract the video transcript, and `yt-dlp` is not available. The user has already provided one usable pasted sample.

## Input

Can you also use this video as evidence?

## Expected behavior

Accept the pasted, Markdown, and local plain-text inputs directly. Use host-native reading first for the URL, PDF, video, and transcript. If native reading fails, offer pasted or exported text and optionally offer a useful missing helper such as `yt-dlp` or `pdftotext`. Make clear that onboarding can proceed without it and require explicit approval before installation.

## Assertions

- Do not install `yt-dlp` or any dependency automatically.
- Do not block onboarding on video extraction.
- Ask no helper-install question when the source can be read natively.
- Keep any transcript and extraction notes out of retained state.
