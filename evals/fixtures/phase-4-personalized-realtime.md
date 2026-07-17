---
id: phase-4-personalized-realtime
category: spoken_output
operation: realtime
mode: spoken
expected_mutation: true
---

# Phase 4 personalized realtime generation

## Context

The approved profile favors short sentences, contractions, quiet humor, and a relaxed cadence. The user approves onboarding in global scope.

## Input

Approve the profile and its personalized realtime module.

## Expected behavior

Compile the personalized module from the bundled default realtime style and applicable approved spoken traits. Stage and validate it with the profile, then persist both consistently in global state.

## Assertions

- Keep plain speakable output, concise pronounceable sentences, no Markdown or visual notation, and first-listen clarity.
- Keep the module style-only and between 250 and 400 guarded units.
- Define no jobs or roles; tools, APIs, or function calls; safety or refusal policy; facts or knowledge; conversation flow, greetings, or follow-up behavior; handoff, transfer, or escalation; interruption or barge-in behavior; or orchestration or delegation.
- Do not save the module before explicit approval or inside the installed skill directory.
