# Changelog

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/).

## [Unreleased]

Targets initial release `0.1.0`. The skill is not yet published. See the README status line before recommending an install command to anyone.

### Added

- **Phase 1, contracts and scaffold.** The public repository, the MIT license, the canonical skill scaffold under `skills/anti-slop-slop-canon/`, the shared style-bundle schema, the first representative evaluation fixtures, and the deterministic repository validator.
- **Phase 2, default writing canon.** `defaults.md` at content version `0.1.0`, covering written and spoken guidance, vocabulary, rhythm, structure, signature moves, and the required no-hype, no-marketing-jargon, no-em/en-dash, no-semicolon, no-exclamation, no-mid-sentence-colon, no-rule-of-three, no-"here's the thing," and no-contrast-framing rules, under 1,500 guarded tokens. Fixtures across every rule family, plus good-writing controls that must remain unchanged, and an independent blind restraint review of the result.
- **Phase 3, router and operations.** `SKILL.md` as the canonical router, under 600 guarded tokens, plus `references/operations.md` covering compose, rewrite, audit, profile, profile lifecycle, and realtime workflows. Scope-safe profile resolution, written-by-default mode inference, protected-content exemptions, a silent second pass, and clean output by default. Routing and exemption fixtures, and an independent contract review.
- **Phase 4, adaptive onboarding.** The first-use choice between personalize, defaults, and defer, one-question-at-a-time evidence collection, optional and approval-gated extraction helpers, contradiction handling, complete profile compilation with the agreed precedence order, preview before any write, and default non-retention of samples and analysis. The prebuilt default realtime module and personalized generation at approval time. Ten onboarding fixtures and an independent onboarding and privacy review.
- **Phase 5, profile lifecycle.** Read-only profile inspection, stability of direct edits, metadata-only version-mismatch detection, and post-task notices. Refresh, keep, and later lifecycle states, with refresh as a complete preview-and-approve recompilation, permanent per-version suppression for keep, and a deterministic 14-day cooldown for later. Explicit, approval-gated realtime prompt regeneration. Six lifecycle fixtures and an independent lifecycle review.
- **Phase 6, evaluation and release gates.** Human scoring rubrics for meaning preservation, edit restraint, personal fidelity, written-versus-spoken routing, and first-listen clarity. A cross-agent fixture matrix for Claude Code, Codex, and Cursor. An optional, maintainer-run model-judge policy that never substitutes for human or editorial review. A blind-comparison template for personalized-versus-default scoring. The deterministic half of the release gate, frontmatter, schema sections, version parity, banned patterns, fixture coverage, broken links, and context budgets, passes. Recording actual scored comparisons, filling the cross-agent matrix, and Jesse's editorial approval of representative output remain open.
- **Compose restraint rule.** `defaults.md` now bars adding conclusions or reassurance the supplied facts do not contain. This closes an interpretive-gloss gap observed in the 2026-07-18 cross-agent run, where a defaults-only compose added "so that problem is behind us" to plain facts. Amended within the unreleased `0.1.0` content version.
- **Phase 7, documentation and distribution.** A README that leads with the product's purpose and a real before-and-after example drawn from an evaluation fixture, states the planned global and project install commands, and documents scope, first-use choices, direct editing, privacy, supported operations, and the realtime prompt. Expanded `docs/installation.md`, `docs/onboarding.md`, `docs/profiles.md`, `docs/realtime-voice.md`, and `docs/contributing-rules.md`. A manual-install fallback that copies the one canonical skill folder without generating a host-specific rule file. Optional extraction helpers documented as suggestions that require approval, never as dependencies. The detector-evasion boundary stated once, plainly, without making it the product's theme.

### Deferred

- Cross-agent manual test runs, recorded blind comparisons, and Jesse's editorial sign-off on representative output.
- The Astro, shadcn, and Hallmark showcase.
- Tagging and publishing `0.1.0` itself.
