# Operations

Use these workflows after the router resolves one style bundle and selects written or spoken mode. Keep protected content outside all transformations.

## Operation selection

Choose one operation from the user's requested outcome.

| Request | Operation |
| --- | --- |
| Create, draft, answer, summarize, or continue mutable prose | `compose` |
| Rewrite, edit, polish, shorten, expand, or adapt supplied prose | `rewrite` |
| Review, check, diagnose, or list style violations without changing text | `audit` |
| Start setup, learn a voice, or create or replace a profile | `onboarding` |
| Inspect the active voice, profile, scope, or versions | `profile` |
| Retrieve a voice-agent style module | `realtime` |

Prefer an explicit operation over inference. Treat a request for both review and correction as `rewrite`. Include an explanation or diff only when asked. Do not turn operation names into shell commands.

## Shared preparation

1. Identify mutable prose and protected spans before drafting or editing.
2. Preserve exact quotations, code in any form, structured data, and legally fixed wording byte for byte. Preserve their position unless the user explicitly requests a move.
3. Use spoken guidance only when output is clearly for listening. Scripts, narration, station announcements, prepared remarks, text-to-speech copy, and voice-agent responses qualify. Labels such as message, post, page, note, document, or response are written unless context clearly says they will be heard. Default every ambiguous case to written without asking.
4. Follow compatible explicit current instructions, then the selected complete bundle. Never supplement a profile with defaults.

## Compose

1. Extract purpose, audience, facts, constraints, and format.
2. Draft only from supplied or established information. Do not invent evidence, claims, personal experience, or enthusiasm.
3. Apply the active bundle's shared rules and selected mode guidance.
4. Preserve required protected material exactly.
5. Return only ready-to-use content unless an explanation was requested.

## Rewrite

1. Make the smallest changes needed for the request and active bundle.
2. Preserve meaning, factual detail, uncertainty, effective voice, useful formatting, and deliberate rhythm.
3. Leave clean prose unchanged. Do not normalize harmless personal choices.
4. Edit mutable prose around protected spans without changing them.
5. Return only revised content. When asked for a diff, add a focused before-and-after or unified diff. When asked for reasoning, map material changes to active rules without exposing hidden chain-of-thought.

## Audit

1. Inspect without rewriting.
2. Report only concrete violations or risks, cite the active-bundle rule, and identify affected mutable text.
3. Separate hard violations from optional improvements. Report no issue when text complies.
4. Ignore prohibited patterns inside protected content.
5. Keep the report concise. Rewrite only on a separate request.

## Onboarding

Read [onboarding.md](onboarding.md). Use it for the first-use choice and every explicit onboarding or voice-learning session. On explicit reruns, do not alter the current profile, prompt, or settings until the new preview is approved.

## Profile

- Report whether the active bundle is a valid project profile, valid global profile, or bundled defaults. Include the selected state path, scope, schema version, content version, and `defaults_version` when present.
- If a profile is unusable, keep defaults selected for the task, explain the defect afterward, and offer a previewed repair. Never overwrite or silently repair it.
- If `defaults_version` differs from the router version, keep the profile selected and report the mismatch after the task. Do not load defaults, persist a choice, refresh, merge, or offer keep/later behavior. Those actions belong to Phase 5.
- Route profile creation or replacement through onboarding. Direct inspection remains read-only.

## Realtime

- Treat a normal voice-agent response as spoken compose or rewrite. Do not load a realtime prompt for that task.
- For an explicit module request, return the active scope's `realtime-voice-prompt.md` unchanged when present. Otherwise return [../assets/realtime-voice-prompt.md](../assets/realtime-voice-prompt.md).
- Generate a personalized module only as part of approved onboarding. Standalone regeneration after direct profile edits belongs to the later profile lifecycle.
- Keep every module style-only and within its guarded budget.

## Silent second pass

Before returning compose or rewrite output, silently verify and correct mutable prose only:

- Preserve requested meaning, facts, uncertainty, intent, format, and protected bytes.
- Use the selected written or spoken guidance consistently.
- Satisfy the active bundle without loading another bundle.
- Remove unsupported claims and unnecessary edits.
- Emit clean content unless the user requested an explanation or diff.

For audit, do not treat exempt material as violations. Reveal this checklist only when asked for an explanation.
