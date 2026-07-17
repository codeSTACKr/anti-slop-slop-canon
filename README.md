# anti-slop-slop-canon

Sound like yourself.

`anti-slop-slop-canon` is an open-source Agent Skill for removing recognizable AI-writing habits and adapting written and spoken content to a transparent, editable personal voice.

Phase 1 freezes the profile schema, evaluation fixture format, and maintainer validation. The runtime writing canon, router, and onboarding behavior are not included, so the skill is not ready to install.

## Planned install

Global:

```sh
npx skills add codeSTACKr/anti-slop-slop-canon -g
```

Project-scoped:

```sh
npx skills add codeSTACKr/anti-slop-slop-canon
```

## Repository

- `skills/anti-slop-slop-canon/` contains the canonical Agent Skill.
- `evals/` contains public fixtures and the evaluation contract.
- `scripts/validate.rb` checks schemas, fixtures, links, runtime contents, and context budgets.
- `docs/` contains user and contributor documentation.
- `site/` is reserved for a later Astro, shadcn, and Hallmark showcase phase.

## Development validation

Run:

```sh
ruby scripts/validate.rb
```

The check uses Ruby's standard-library YAML parser and requires no installed packages. See [evals/README.md](evals/README.md) for the fixture and token-count contracts.

## License

MIT
