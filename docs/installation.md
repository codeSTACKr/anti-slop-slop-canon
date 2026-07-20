# Installation

## Installing

```sh
npx skills add codeSTACKr/anti-slop-slop-canon
```

The installer asks whether you want global or project scope. Pick the one that fits; there is no need to pass a flag.

## Global scope

A global install stays active across every project on the machine unless a project-scoped copy overrides it.

State lives at `~/.config/anti-slop-slop-canon/`, holding at most `voice-profile.md`, `realtime-voice-prompt.md`, and `settings.md`.

## Project scope

A project install stays local to the current repository.

State lives at `<project-root>/.anti-slop-slop-canon/`. A project copy reads and writes only that directory. It never falls back to global state, even if global state exists on the same machine.

## Both scopes at once

You can install both a global copy and a project copy. Inside the project, the project copy wins and the global copy is not consulted. Outside that project, the global copy applies. The two copies never merge.

## Manual install

If your host agent does not support `npx skills`, copy the canonical skill folder into wherever your host loads skills from:

```sh
cp -R skills/anti-slop-slop-canon /path/to/your/agent/skills/anti-slop-slop-canon
```

Copy the whole `anti-slop-slop-canon` directory as one unit, including `SKILL.md`, `references/`, and `assets/`. Do not split it into a host-specific rule file such as `AGENTS.md` or `.cursorrules`, and do not generate a second copy of the rules in another format. There is one canonical skill. Every supported host reads the same `SKILL.md` and the same reference files.

## Optional extraction helpers

Onboarding can read pasted text, Markdown, and local text files without any extra tool. If you supply a URL, PDF, or video and your host cannot read it natively, the skill may suggest an optional helper such as `yt-dlp` or `pdftotext`. It never installs one on its own. You approve the specific command before it runs, and you can decline and paste the text yourself instead. See [onboarding.md](onboarding.md).

## After installing

With no saved state, your first writing task in that scope offers a single choice: personalize now, use the defaults, or defer. Choosing defaults or defer resumes the task immediately using the bundled voice. See [onboarding.md](onboarding.md) and [profiles.md](profiles.md).
