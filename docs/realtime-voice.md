# Realtime voice prompt

A realtime voice agent needs its style guidance compressed into a system prompt it can hold in context every turn, not a reference file it reads on demand. The realtime voice prompt is that compressed module.

## What it is

The bundled default lives at [../skills/anti-slop-slop-canon/assets/realtime-voice-prompt.md](../skills/anti-slop-slop-canon/assets/realtime-voice-prompt.md). It covers delivery only: plain conversational language, first-listen clarity, pronounceable sentences, and no Markdown, emojis, or visual-only notation. Onboarding compiles a personalized module at the same time it compiles your voice profile, applying your approved spoken traits, such as cadence, contractions, formality, and humor, on top of that same default shape.

Both the default and every personalized module stay style-only. Neither defines a job or role, a tool, an API, or a function call, safety or refusal policy, facts or knowledge, conversation flow or greetings, handoff or escalation behavior, interruption handling, or orchestration. Write those separately in your voice agent's own instructions. The realtime prompt sits alongside them and governs how the words come out.

## Generating and pasting it

Ask the skill for the realtime prompt. It returns your active scope's personalized module if one exists, or the bundled default otherwise. Copy the returned text into the part of your voice agent's system prompt that governs speaking style, next to, not instead of, your tool definitions, safety policy, and conversation logic.

## Regenerating it

A personalized realtime module is only ever regenerated in three situations: during approved onboarding, during an approved profile refresh, or when you explicitly ask for regeneration. See [profiles.md](profiles.md) for onboarding and refresh. An explicit regeneration request recompiles the module from your active profile alone, previews the complete result, and replaces only the in-scope prompt after you approve it. Editing your profile directly, or a defaults-version mismatch on its own, never regenerates the realtime prompt.
