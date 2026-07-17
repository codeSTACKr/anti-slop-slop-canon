# Voice profiles

Defaults and personal profiles share the contract in `skills/anti-slop-slop-canon/references/profile-schema.md`. Schema and content versions advance independently.

A global profile belongs in `~/.config/anti-slop-slop-canon/voice-profile.md`. A project profile belongs in `<project-root>/.anti-slop-slop-canon/voice-profile.md`. Project-scoped resolution never falls through to global state.

Profiles are complete, directly editable bundles. Runtime resolution loads one valid in-scope profile or the bundled defaults, never both. Phase 4 onboarding compiles and previews all ten sections, including written and spoken guidance, then saves only after explicit approval. Explicit answers outrank consistent sample traits, which outrank defaults; product invariants remain non-overridable.

The approved profile and personalized realtime module are staged and validated together before replacement. You may inspect the active profile and its versions at any time. Direct Markdown edits are authoritative and do not trigger normalization or regeneration.

When the active profile's `defaults_version` differs from the router's current version, the skill finishes the current task with that profile alone. It then offers `refresh`, `keep`, or `later` without loading defaults for mismatch detection. The notice state stays in the active scope's `settings.md`:

```yaml
defaults_notice_version: "0.2.0"
defaults_notice_state: later
defaults_remind_after: "2026-07-31"
```

`keep` suppresses that defaults version permanently. `later` uses local calendar dates and a 14-day cooldown. Each reminder advances the date by another 14 days, so it appears at most once per cooldown window and only after a completed task. A newer mismatch version starts a separate notice state.

`refresh` is a complete recompilation, not an automatic merge. It treats the current profile, including direct edits, as approved preferences over new defaults, previews the complete profile and realtime module with written and spoken examples, and writes only after explicit approval. Failed or cancelled refreshes leave the prior pair active. Project and global lifecycle state never mix.
