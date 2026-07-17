# Voice profiles

Defaults and personal profiles share the contract in `skills/anti-slop-slop-canon/references/profile-schema.md`. Schema and content versions advance independently.

A global profile belongs in `~/.config/anti-slop-slop-canon/voice-profile.md`. A project profile belongs in `<project-root>/.anti-slop-slop-canon/voice-profile.md`. Project-scoped resolution never falls through to global state.

Profiles are complete, directly editable bundles. Normal runtime use loads the winning profile or the bundled defaults, never both. Runtime resolution and refresh behavior are deferred to later phases.
