# Realtime voice prompt

The skill ships a prebuilt default realtime module at `skills/anti-slop-slop-canon/assets/realtime-voice-prompt.md`. An explicit realtime request returns the active-scope personalized module when one exists, otherwise the bundled default.

Approved onboarding creates a personalized module at the same time as the voice profile. It retains plain speakable output, concise pronounceable sentences, no Markdown or visual notation, and first-listen clarity while applying approved spoken traits. Both default and personalized modules target 250 to 400 guarded units.

Realtime modules contain output style only. They never define jobs or roles; tools, APIs, or function calls; safety or refusal policy; facts or knowledge; conversation flow, greetings, or follow-up behavior; handoff, transfer, or escalation; interruption or barge-in behavior; or orchestration or delegation.

The skill regenerates a personalized module only during approved onboarding, an approved profile refresh, or an explicit regeneration request. Explicit regeneration uses the active profile alone, previews and validates the complete module, requires approval, and replaces only the in-scope prompt. A direct profile edit or version mismatch never regenerates it automatically.
