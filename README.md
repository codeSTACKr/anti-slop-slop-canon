# anti-slop-slop-canon

Sound like yourself.

`anti-slop-slop-canon` is an open-source Agent Skill for removing recognizable AI-writing habits and adapting written and spoken content to a transparent, editable personal voice.

The repository now includes the frozen profile schema, default writing canon, canonical runtime router, adaptive onboarding, update-safe profile lifecycle, default and personalized realtime prompt contracts, evaluation fixtures, and maintainer validation. Cross-host release evaluation, packaging, and the showcase remain later-phase work, so the skill is not ready to install.

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
- `scripts/validate.rb` checks schemas, onboarding, routing and lifecycle fixtures, links, exact runtime contents, realtime policy boundaries, and context budgets.
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
