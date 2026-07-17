# Operations

Use these workflows after the router resolves one style bundle and selects written or spoken mode. Keep protected content outside all transformations.

## Operation selection

Choose one operation from the user's requested outcome.

| Request | Operation |
| --- | --- |
| Create, draft, answer, summarize, or continue mutable prose | `compose` |
| Rewrite, edit, polish, shorten, expand, or adapt supplied prose | `rewrite` |
| Review, check, diagnose, or list style violations without changing text | `audit` |
| Inspect the active voice, profile, scope, or versions | `profile` |
| Retrieve or regenerate a voice-agent style module | `realtime` |

Prefer an explicit operation over inference. Treat a request for both review and correction as `rewrite`. Include an explanation or diff only when the user asks for it. Do not turn natural-language operation names into shell commands.

## Shared preparation

1. Identify mutable prose and protected spans before drafting or editing.
2. Preserve exact quotations, code in any form, structured data, and legally fixed wording byte for byte. Preserve their position unless the user explicitly requests a move.
3. Use spoken guidance only when the output is clearly intended for listening. Treat scripts, narration, station announcements, prepared remarks, text-to-speech copy, and voice-agent responses as spoken. Treat labels such as message, post, page, note, document, or response as written unless the context clearly says they will be heard. Default every ambiguous case to written without asking.
4. Follow explicit current instructions that do not violate product invariants. Then follow the selected complete bundle. Never supplement a profile with defaults.

## Compose

1. Extract the requested purpose, audience, facts, constraints, and format.
2. Draft only from supplied or established information. Do not invent evidence, claims, personal experience, or enthusiasm.
3. Apply the active bundle's shared rules and selected mode guidance while composing.
4. Preserve required protected material exactly.
5. Return only ready-to-use content unless an explanation was requested.

## Rewrite

1. Identify the smallest changes needed to satisfy the request and active bundle.
2. Preserve meaning, factual detail, uncertainty, effective voice, useful formatting, and deliberate rhythm.
3. Leave already-good prose unchanged. Do not normalize harmless personal choices merely to make the text sound polished.
4. Edit mutable prose around protected spans without changing those spans.
5. Return only the revised content. When explicitly asked for a diff, show a focused before-and-after or unified diff after producing the clean revision. When explicitly asked for reasoning, map material changes to active rules without exposing hidden chain-of-thought.

## Audit

1. Inspect without rewriting.
2. Report only concrete violations or risks, cite the relevant active-bundle rule, and point to the affected mutable text.
3. Separate hard violations from optional improvements. Report no issue when the text already complies.
4. Ignore prohibited style patterns inside protected content.
5. Keep the report concise. Provide a rewrite only if the user separately requests one.

## Profile

Limit Phase 3 profile handling to runtime inspection and routing.

- Report whether the active bundle is a valid project profile, a valid global profile, or bundled defaults.
- Report the selected state path, scope, schema version, content version, and `defaults_version` when present.
- If a profile is unusable, keep defaults selected for the current task, explain the defect after the task, and offer a previewed repair. Never overwrite or silently repair the file.
- If a profile's `defaults_version` differs from the router's current default version, keep the profile selected and report the mismatch after the current task. Report it at most once per current defaults version when the session shows a prior notice. Explain that refresh, keep, and later persistence belong to the later profile lifecycle. Do not present them as available actions or implement persistence or recompilation in Phase 3.
- Route setup, onboarding, learning from samples, profile creation, refresh, and persistent edits to the later profile workflow. Do not improvise those artifacts or retain source material.

## Realtime

Limit Phase 3 realtime handling to safe retrieval and routing.

- Treat a normal voice-agent response as spoken compose or rewrite. Do not load `realtime-voice-prompt.md` merely to write one response.
- For an explicit request to obtain the realtime module, read only the active scope's `realtime-voice-prompt.md` when it already exists and return it unchanged.
- If the file is absent or regeneration is requested, explain that generation belongs to the later onboarding and profile lifecycle workflow. Do not synthesize or persist a replacement in Phase 3.
- Keep any future realtime module style-only. Never add job, tools, safety policy, facts, conversation flow, handoffs, interruption logic, or orchestration.

## Silent second pass

Before returning compose or rewrite output, silently verify all of the following and correct mutable prose only:

- Preserve requested meaning, facts, uncertainty, intent, and format.
- Preserve every protected span byte for byte.
- Use the selected written or spoken guidance consistently.
- Satisfy the active bundle without loading another bundle.
- Remove unsupported claims and avoid unnecessary edits.
- Emit clean content unless the user opted into an explanation or diff.

For audit, verify that findings do not treat exempt material as violations. Do not reveal this checklist unless the user asks for an explanation.
