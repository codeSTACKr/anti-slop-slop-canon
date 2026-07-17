# Contributing writing rules

Writing-rule changes begin in Phase 2. Keep the normative default canon in `skills/anti-slop-slop-canon/references/defaults.md`; do not copy it into documentation, fixtures, tool-specific rule files, or the router.

Every proposed rule must identify the reader harm, include bad and improved examples, add a failing fixture, protect already-good prose with a control, and report the context-budget change. Fixtures describe observable behavior rather than duplicating the rule text.

Run `ruby scripts/validate.rb` before review. Jesse Hall retains final editorial authority for the default canon.
