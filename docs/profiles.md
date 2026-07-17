# Voice profiles

A voice profile is a complete, directly editable Markdown bundle that replaces the bundled defaults at runtime. Defaults and personal profiles share one contract, defined in [../skills/anti-slop-slop-canon/references/profile-schema.md](../skills/anti-slop-slop-canon/references/profile-schema.md). Both use the same ten sections in the same order, with schema and content versions that advance independently of each other.

## Where profiles live

| Scope | State directory | Lookup rule |
| --- | --- | --- |
| Global | `~/.config/anti-slop-slop-canon/` | Global state only |
| Project | `<project-root>/.anti-slop-slop-canon/` | Current project state only, never global |

Each state directory holds at most `voice-profile.md`, `realtime-voice-prompt.md`, and `settings.md`. A project copy never falls through to global state, even when both are installed on the same machine. The runtime loads exactly one bundle for a task: the active in-scope profile, or the bundled defaults when no valid profile exists. It never loads both.

## How a profile is built

Onboarding compiles all ten sections, previews the complete profile alongside a written and a spoken example, and saves only after you approve it. See [onboarding.md](onboarding.md). Style decisions resolve in this order: product invariants fixed in the router, your explicit current instructions, your explicit onboarding answers, consistent traits found in supplied samples, then Jesse's defaults.

## Editing directly

The profile is a plain file, not a compiled artifact. Open it and change a line, and the skill treats that edit as authoritative on the next task. It does not normalize, regenerate, or replace the file because it changed. If a direct edit makes the profile unusable, the skill keeps the bundled defaults active for that task, explains the problem afterward, and offers a previewed repair rather than silently overwriting anything.

You can inspect the active profile at any time: its content, scope, schema version, content version, and the defaults version it was compiled against. Inspection never modifies the file.

## When defaults move ahead of your profile

Your profile records the defaults version it was compiled against as `defaults_version`. When that no longer matches the skill's current default version, the skill finishes your current task using your profile alone, then shows one non-blocking notice offering three choices. The notice state lives in the active scope's `settings.md`:

```yaml
defaults_notice_version: "0.2.0"
defaults_notice_state: later
defaults_remind_after: "2026-07-31"
```

- **Refresh** recompiles your profile from scratch, treating your current profile, including any direct edits, as approved preferences over the new defaults. It previews the complete replacement profile and realtime prompt with a written and a spoken example, and writes only after you approve. A cancelled or interrupted refresh leaves your existing pair untouched.
- **Keep** suppresses the notice for that defaults version permanently, without changing either file.
- **Later** suppresses the notice for 14 calendar days, then shows it once more when that date arrives. Each time it is shown, the next date is set 14 days from that day, not from the original deadline, so you never get repeated reminders in a row.

A newer defaults version starts its own notice, independent of any earlier `keep` or `later` choice. Project and global lifecycle state never mix, and no mismatch, notice, or lifecycle choice regenerates the profile or realtime prompt on its own. Only an approved refresh, approved onboarding, or an explicit realtime regeneration request does that. See [realtime-voice.md](realtime-voice.md).
