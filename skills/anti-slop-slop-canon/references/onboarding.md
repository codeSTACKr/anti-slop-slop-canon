# Adaptive onboarding

Use this workflow only for the first-use gate or an explicit onboarding, setup, or voice-learning request. Ask one question per turn. Always let the user proceed with defaults, sparse evidence, or the decisions already made.

## First use

On the first natural-language task in the active scope, when neither `voice-profile.md` nor `settings.md` exists, ask exactly one choice before doing the task: personalize now, use defaults, or defer. Do not add another question.

- `personalize now`: start the interview. Persist nothing yet.
- `use defaults`: write only a minimal in-scope `settings.md` recording `setup: defaults`, then resume the original task with bundled defaults.
- `defer`: write only a minimal in-scope `settings.md` recording `setup: deferred`, then complete the original task with bundled defaults. Profile mismatch lifecycle begins only after a profile exists.

Explicit onboarding may start or rerun at any time. It bypasses the first-use choice. Preserve every existing state file until the replacement preview receives explicit approval.

## Establish intent and collect evidence

First ask what the user writes and how they want it to sound. Next ask for representative material early. Accept pasted text, Markdown, and plain-text or local text files. One short sample is enough; mark its analysis low confidence, lean on explicit answers and defaults, and offer to proceed.

Use host-native file reading or browsing for supplied URLs, PDFs, videos, or transcripts when available. If native extraction is unavailable, ask for pasted text or an export. An optional helper such as `yt-dlp` or `pdftotext` may be offered only when it would help and is missing. It is never required or blocking. Ask for explicit approval before any installation and do not install without that approval.

Use supplied material without authorship, ownership, identity, or provenance checks. For a request to imitate a named third party, describe and learn abstract traits such as cadence, formality, vocabulary, or humor. Do not promise exact imitation or voice cloning.

## Analyze and adapt

Keep confidence, evidence notes, measurements, sources, extraction notes, and all working analysis ephemeral. Separate recurring voice traits from subject matter, channel formatting, quotations, borrowed language, and one-off quirks.

- Strong consistent evidence shortens the interview. Ask only about choices the evidence cannot settle.
- Sparse evidence triggers a focused question about the highest-impact unknown, while preserving an immediate proceed option.
- Inconsistent evidence or a conflict with an explicit preference triggers one focused resolution question. Never average, choose a side, or suppress the conflict silently.
- Continue one question at a time until the profile is decision-complete or the user chooses to proceed.

## Compile the proposal

Compile a complete, self-contained profile using [profile-schema.md](profile-schema.md) and the exact ten-section order. Use schema `1.0.0`, initial profile content version `1.0.0`, active scope `global` or `project`, and defaults version `0.1.0`. For an approved rerun that changes profile instructions, increment the existing profile content version. Include actionable written and spoken guidance. Do not include confidence, measurements, evidence, sources, samples, URLs, transcripts, or analysis.

Resolve every style decision in this order:

1. Non-overridable product invariants from the router.
2. Explicit current user answers.
3. Traits consistent across supplied samples.
4. Bundled defaults.

Product invariants constrain compilation but stay in the router; do not copy them into the editable profile. The profile must replace defaults at runtime, not supplement them. Therefore carry forward every applicable style decision needed for a complete bundle, while allowing higher-precedence personal choices to replace conflicting defaults. Keep the complete file below 1,500 guarded units.

Compile the personalized realtime module from [../assets/realtime-voice-prompt.md](../assets/realtime-voice-prompt.md) plus applicable approved spoken traits. Retain plain speakable output, concise pronounceable sentences, no Markdown or visual notation, and first-listen clarity. Personalize cadence, contractions, formality, vocabulary, energy, humor, and signature phrasing only when approved. Keep it style-only and between 250 and 400 guarded units. Never define jobs or roles; tools, APIs, or function calls; safety or refusal policy; facts or knowledge; conversation flow, greetings, or follow-up behavior; handoff, transfer, or escalation; interruption or barge-in behavior; or orchestration or delegation.

## Preview and approve

Before any persistent write, show all of the following in one preview:

1. The complete proposed `voice-profile.md`.
2. The complete proposed `realtime-voice-prompt.md`.
3. One short written example.
4. One short spoken example.

Then offer exactly these paths: approve, revise one trait, or continue the interview. Approval must be explicit. A revision returns to one-question-at-a-time resolution and a new complete preview. Do not claim that settings, profile, or prompt have been saved before approval.

## Persist approved state

Write only inside the active state directory: `<project-root>/.anti-slop-slop-canon/` for a project copy or `~/.config/anti-slop-slop-canon/` for a global copy. Never write above project scope or into the installed skill directory.

On approval, stage both approved files inside the active state directory and validate their metadata, scope, sections, content, and budgets before replacing either current file. Replace `voice-profile.md` and `realtime-voice-prompt.md` atomically where the host supports it. Otherwise replace them as one rollback-protected approval action. If both replacements cannot complete, restore the prior pair or leave neither new file and report the failure. Record only minimal `setup: personalized` in `settings.md` when setup state is needed. For first-use personalization, resume the original task with the approved profile.

Retain by default only `voice-profile.md`, `realtime-voice-prompt.md`, and minimal `settings.md`. Never copy or retain raw samples, pasted text, URLs, downloads, transcripts, source lists, extraction notes, confidence data, measurements, or onboarding analysis. Leave user originals in place. Delete temporary derived material after the approved write or when onboarding ends.
