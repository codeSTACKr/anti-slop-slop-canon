---
id: exempt-fixed-content
category: exemptions
operation: rewrite
mode: mixed
expected_mutation: true
---

# Exempt fixed content

## Context

Improve the mutable introduction while preserving an exact quotation, code, structured data, and legally fixed wording.

## Input

Polish this release note but keep protected blocks exact.

Intro: We're excited to provide a robust update that makes exports better than ever!

Quote: “Move fast; keep the receipt — every time!”

Code: `const label = "Ready: yes!";`

Data: `{"status":"ready!","range":"1–3"}`

Legal: Copyright (c) 2026 Example Co. All rights reserved.

## Expected behavior

Revise only the mutable introduction. Preserve protected spans byte for byte even when they contain patterns that ordinary prose rules would reject.

## Assertions

- Preserve the quote, code, JSON, and legal line exactly.
- Remove no punctuation from protected spans.
- Do not treat structured data as prose.
- Keep the release-note meaning while editing the introduction with restraint.
