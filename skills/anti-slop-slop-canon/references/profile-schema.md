# Style-bundle schema

Schema version: `1.0.0`

Use this contract for the bundled `defaults.md` and every compiled `voice-profile.md`. Keep the documents human-readable and directly editable. Treat recognizable headings as the runtime interface rather than requiring a brittle parser.

## Frontmatter

Start every bundle with YAML frontmatter. Quote every version value.

| Field | Defaults | Profile | Meaning |
| --- | --- | --- | --- |
| `bundle_kind` | `defaults` | `profile` | Select the bundle variant. |
| `schema_version` | Required | Required | Version the document structure and field semantics. |
| `content_version` | Required | Required | Version the rules contained in this document. |
| `scope` | `bundled` | `global` or `project` | Identify where the bundle is allowed to resolve. |
| `defaults_version` | Omit | Required | Record the defaults content version used to compile a profile. |

Use three-part semantic versions such as `1.0.0`. Increment `schema_version` only when the metadata or required-section contract changes. Increment `content_version` when instructions within a bundle change. A schema release does not imply a content release, and a content release does not imply a schema release.

The bundled defaults use their own `content_version`. A profile uses its own `content_version` and records the source defaults version separately in `defaults_version`.

## Required sections

Include these level-two headings exactly once and in this order:

1. `Voice summary`
2. `Non-negotiable preferences`
3. `Written guidance`
4. `Spoken guidance`
5. `Vocabulary`
6. `Rhythm and sentence shape`
7. `Structure and formatting`
8. `Signature moves`
9. `Patterns to avoid`
10. `Short examples`

Write actionable instructions inside the sections. Keep measurements, confidence notes, evidence lists, source material, URLs, transcripts, and analysis outside the runtime bundle.

## Bundle rules

- Compile a profile as a complete bundle, not a sparse override.
- Load either the active profile or the bundled defaults during normal use, never both.
- Keep product invariants outside style bundles because users may edit personal style rules.
- Preserve the section order after direct edits. Tolerate harmless Markdown changes within sections.
- Repair an unusable profile only after explaining and previewing the repair. Never replace it silently.
- Store profiles outside the installed skill folder in the active global or project state directory.
