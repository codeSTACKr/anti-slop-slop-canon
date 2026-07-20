# Contributing

Issue reports and focused pull requests are welcome.

## Writing-rule changes

Changing or adding a rule in the default canon follows a specific policy, including required evidence and fixtures. Read [docs/contributing-rules.md](docs/contributing-rules.md) before opening that kind of pull request.

Jesse Hall is the final editorial authority for the default canon. Community input shapes the canon, but a taste decision is not settled by a vote.

## Other changes

For documentation, fixtures, router behavior, or repository tooling, describe the problem and the reader-facing effect of your change in the pull request. Run the checks below before requesting review:

```sh
pnpm run validate
```

## Product boundary

Do not propose detector-evasion features, detector benchmarks, hidden or undisclosed voice profiles, hosted tracking or telemetry, or new runtime dependencies. See [README.md](README.md) for the product this repository is building.
