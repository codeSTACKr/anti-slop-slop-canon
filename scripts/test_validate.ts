#!/usr/bin/env -S npx tsx
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_ROOT = path.resolve(__dirname, "..");
const TSX_BIN = path.join(SOURCE_ROOT, "node_modules", ".bin", "tsx");

// Version-control, dependency, and build output trees are never authored
// repository content, so the fixture copy skips them. Copying them would also
// be slow enough to stall the suite once the showcase site installs its
// dependencies under site/node_modules.
const IGNORED_BASENAMES = new Set([".git", "node_modules", "dist", ".astro"]);

function copyAuthoredTree(source: string, destination: string): void {
  if (IGNORED_BASENAMES.has(path.basename(source))) return;

  const stat = fs.statSync(source);
  if (stat.isDirectory()) {
    fs.mkdirSync(destination, { recursive: true });
    for (const child of fs.readdirSync(source)) {
      copyAuthoredTree(path.join(source, child), path.join(destination, child));
    }
  } else if (stat.isFile()) {
    fs.copyFileSync(source, destination);
  }
}

function withRepository(fn: (root: string) => void): void {
  const tmpParent = fs.mkdtempSync(path.join(os.tmpdir(), "anti-slop-validation-"));
  try {
    const root = path.join(tmpParent, "repo");
    fs.mkdirSync(root, { recursive: true });
    for (const child of fs.readdirSync(SOURCE_ROOT)) {
      copyAuthoredTree(path.join(SOURCE_ROOT, child), path.join(root, child));
    }
    // Node/tsx must resolve bare-specifier imports (e.g. "yaml") relative to
    // the executing script's location. Ruby's gem resolution needs no such
    // bridge, so this symlink is a JS-only adaptation with no Ruby analogue.
    fs.symlinkSync(path.join(SOURCE_ROOT, "node_modules"), path.join(root, "node_modules"), "dir");
    fn(root);
  } finally {
    fs.rmSync(tmpParent, { recursive: true, force: true });
  }
}

function runValidator(root: string): { stdout: string; stderr: string; success: boolean } {
  const result = spawnSync(TSX_BIN, [path.join(root, "scripts/validate.ts")], {
    cwd: root,
    encoding: "utf8",
  });
  return {
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    success: result.status === 0,
  };
}

function mutate(filePath: string, transform: (content: string) => string): void {
  fs.writeFileSync(filePath, transform(fs.readFileSync(filePath, "utf8")));
}

class AssertionError extends Error {}

function assert(condition: unknown, message = "Failed assertion"): void {
  if (!condition) throw new AssertionError(message);
}

function refute(condition: unknown, message = "Expected condition to be false"): void {
  if (condition) throw new AssertionError(message);
}

function assertIncludes(haystack: string, needle: string, message?: string): void {
  if (!haystack.includes(needle)) {
    throw new AssertionError(message ?? `Expected to find ${JSON.stringify(needle)} in:\n${haystack}`);
  }
}

type TestFn = () => void;
const tests: [string, TestFn][] = [];
function test(name: string, fn: TestFn): void {
  tests.push([name, fn]);
}

test("test_current_repository_passes", () => {
  withRepository((root) => {
    const { stdout, stderr, success } = runValidator(root);
    assert(success, `${stdout}\n${stderr}`);
    assertIncludes(stdout, "PASS: repository contracts");
  });
});

test("test_missing_required_fixture_category_fails", () => {
  withRepository((root) => {
    const fixturesDir = path.join(root, "evals/fixtures");
    for (const name of fs.readdirSync(fixturesDir)) {
      if (!name.endsWith(".md")) continue;
      const fixturePath = path.join(fixturesDir, name);
      if (fs.readFileSync(fixturePath, "utf8").includes("category: onboarding")) {
        fs.rmSync(fixturePath);
      }
    }
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing categories onboarding");
  });
});

test("test_runtime_script_fails_markdown_only_gate", () => {
  withRepository((root) => {
    fs.writeFileSync(path.join(root, "skills/anti-slop-slop-canon/runtime.py"), "print('unexpected')\n");
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "unexpected runtime file");
  });
});

test("test_schema_version_drift_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/defaults.md");
    mutate(p, (c) => c.replace('schema_version: "1.0.0"', 'schema_version: "1.1.0"'));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "same schema_version");
  });
});

test("test_context_budget_overrun_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/SKILL.md");
    mutate(p, (c) => c + " budget".repeat(600));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "must be below 600");
  });
});

test("test_profile_template_budget_overrun_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/assets/voice-profile.template.md");
    mutate(p, (c) => c + " profile".repeat(1200));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "must be below 1500");
  });
});

test("test_router_default_version_drift_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/SKILL.md");
    mutate(p, (c) => c.replace("default content version `0.1.0`", "default content version `0.2.0`"));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "current default content version must match defaults.md");
  });
});

test("test_project_isolation_contract_removal_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/SKILL.md");
    mutate(p, (c) => c.replace("never inspect or fall back to global state", "prefer project state"));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing project isolation contract");
  });
});

test("test_profile_scope_validation_removal_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/SKILL.md");
    mutate(p, (c) => c.replace("active scope, every required section", "declared scope, every required section"));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing profile scope match contract");
  });
});

test("test_missing_phase_3_fixture_fails", () => {
  withRepository((root) => {
    fs.rmSync(path.join(root, "evals/fixtures/phase-3-audit-routing.md"));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing Phase 3 fixture phase-3-audit-routing");
  });
});

test("test_missing_foundational_legal_exemption_fixture_fails", () => {
  withRepository((root) => {
    fs.rmSync(path.join(root, "evals/fixtures/exempt-fixed-content.md"));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing foundational protected-content fixture exempt-fixed-content");
  });
});

test("test_missing_operations_workflow_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/operations.md");
    mutate(p, (c) => c.replace("## Realtime", "## Voice module"));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing Realtime workflow");
  });
});

test("test_weakening_all_code_forms_contract_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/operations.md");
    mutate(p, (c) => c.replace("code in any form", "fenced code"));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing all code forms contract");
  });
});

test("test_metadata_only_mismatch_detection_weakening_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/operations.md");
    mutate(p, (c) =>
      c.replace(
        "Use only metadata already loaded from the router and winning profile",
        "Load defaults to compare their contents with the profile"
      )
    );
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing already-loaded mismatch detection contract");
  });
});

test("test_post_task_notice_order_weakening_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/operations.md");
    mutate(p, (c) =>
      c.replace("Complete the current writing task with the profile alone", "Pause the current task for the update notice")
    );
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing post-task notice contract");
  });
});

test("test_interrupted_refresh_state_recovery_removal_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/operations.md");
    mutate(p, (c) =>
      c.replace(
        "recover its transient `refresh` state to `shown` without another notice",
        "leave the refresh state unchanged"
      )
    );
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing interrupted refresh recovery contract");
  });
});

test("test_automatic_refresh_merge_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/operations.md");
    mutate(p, (c) => c.replace("Never merge or write automatically", "Merge the new defaults into the profile automatically"));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing no automatic refresh contract");
  });
});

test("test_refresh_direct_edit_precedence_removal_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/operations.md");
    mutate(p, (c) =>
      c.replace(
        "including direct edits, as approved preferences over new defaults",
        "except direct edits, as temporary preferences below new defaults"
      )
    );
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing direct edits win refresh contract");
  });
});

test("test_permanent_keep_suppression_weakening_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/operations.md");
    mutate(p, (c) =>
      c.replace("Never notify for that defaults version again", "Notify for that defaults version in a later session")
    );
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing permanent keep contract");
  });
});

test("test_later_cooldown_length_mutation_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/operations.md");
    mutate(p, (c) => c.replace("exactly 14 calendar days after the choice", "about one week after the choice"));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing deterministic later contract");
  });
});

test("test_overdue_later_deadline_mutation_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/operations.md");
    mutate(p, (c) =>
      c.replace("Do not advance from an overdue date", "Advance from the prior deadline even when it stays in the past")
    );
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing overdue reminder recovery contract");
  });
});

test("test_lifecycle_scope_isolation_weakening_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/operations.md");
    mutate(p, (c) =>
      c.replace("A project copy reads and writes project state only", "A project copy may use global lifecycle state")
    );
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing lifecycle scope isolation contract");
  });
});

test("test_automatic_realtime_regeneration_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/operations.md");
    mutate(p, (c) =>
      c.replace(
        "only during approved onboarding, approved refresh, or an explicit regeneration request",
        "whenever the profile or defaults version changes"
      )
    );
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "personalized realtime generation boundary is required");
  });
});

test("test_missing_phase_5_fixture_fails", () => {
  withRepository((root) => {
    fs.rmSync(path.join(root, "evals/fixtures/phase-5-refresh-preview.md"));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing Phase 5 fixture phase-5-refresh-preview");
  });
});

test("test_mismatch_notice_moved_into_task_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "evals/fixtures/phase-5-mismatch-notice.md");
    const contract = "- Do not show the notice before or inside the requested content.\n";
    mutate(p, (c) => c.replace(contract, "").replace("## Expected behavior\n", `## Expected behavior\n\n${contract}`));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "Assertions must preserve Phase 5 contract");
  });
});

test("test_refresh_failure_rollback_relocation_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "evals/fixtures/phase-5-refresh-preview.md");
    const contract = "- On cancellation or failure, preserve the prior profile and prompt as the active pair.\n";
    mutate(p, (c) => c.replace(contract, "").replace("## Expected behavior\n", `## Expected behavior\n\n${contract}`));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "Assertions must preserve Phase 5 contract");
  });
});

test("test_later_fixture_date_arithmetic_mutation_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "evals/fixtures/phase-5-later-cooldown.md");
    mutate(p, (c) => c.replace('defaults_remind_after: "2026-07-31"', 'defaults_remind_after: "2026-07-24"'));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "Expected behavior must preserve Phase 5 contract");
  });
});

test("test_profile_inspection_mutation_regression_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "evals/fixtures/phase-5-profile-edit-stability.md");
    mutate(p, (c) => c.replace("Return the project profile unchanged", "Normalize and return the project profile"));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "Expected behavior must preserve Phase 5 contract");
  });
});

test("test_missing_phase_4_fixture_fails", () => {
  withRepository((root) => {
    fs.rmSync(path.join(root, "evals/fixtures/phase-4-preview-before-save.md"));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing Phase 4 fixture phase-4-preview-before-save");
  });
});

test("test_first_use_choice_weakening_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/onboarding.md");
    mutate(p, (c) => c.replace("personalize now, use defaults, or defer", "choose a setup path"));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing exact first-use choice contract");
  });
});

test("test_batch_question_onboarding_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/onboarding.md");
    mutate(p, (c) => c.replace("Ask one question per turn", "Ask all useful questions together"));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing one-question interview contract");
  });
});

test("test_preview_approval_gate_removal_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/onboarding.md");
    mutate(p, (c) => c.replace("Approval must be explicit", "Assume approval when the preview is shown"));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing approval gate contract");
  });
});

test("test_profile_precedence_weakening_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/onboarding.md");
    mutate(p, (c) => c.replace("Non-overridable product invariants from the router", "Use whichever rules seem strongest"));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing profile precedence contract");
  });
});

test("test_profile_precedence_reordering_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/onboarding.md");
    mutate(p, (c) =>
      c.replace(
        "3. Traits consistent across supplied samples.\n4. Bundled defaults.",
        "3. Bundled defaults.\n4. Traits consistent across supplied samples."
      )
    );
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "profile precedence must preserve the exact ordered chain");
  });
});

test("test_copying_invariants_into_profile_contract_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/onboarding.md");
    mutate(p, (c) =>
      c.replace("Product invariants constrain compilation but stay in the router", "Copy product invariants into every profile")
    );
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing invariants remain outside profile contract");
  });
});

test("test_rerun_profile_version_contract_removal_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/onboarding.md");
    mutate(p, (c) => c.replace("increment the existing profile content version", "keep the prior content version"));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing rerun content version contract");
  });
});

test("test_sample_retention_contract_removal_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/onboarding.md");
    mutate(p, (c) =>
      c.replace(
        "Never copy or retain raw samples, pasted text, URLs, downloads, transcripts, source lists, extraction notes, confidence data, measurements, or onboarding analysis",
        "Retain useful source material"
      )
    );
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing non-retention contract");
  });
});

test("test_scope_safe_write_contract_removal_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/onboarding.md");
    mutate(p, (c) =>
      c.replace(
        "Never write above project scope or into the installed skill directory",
        "Write to any convenient configuration directory"
      )
    );
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing scope-safe writes contract");
  });
});

test("test_atomic_pair_write_contract_removal_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/onboarding.md");
    mutate(p, (c) => c.replace("atomically where the host supports it", "one file at a time"));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing atomic pair write contract");
  });
});

test("test_pair_validation_before_replacement_contract_removal_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/onboarding.md");
    mutate(p, (c) =>
      c.replace("and budgets before replacing either current file", "and budgets after replacing the current files")
    );
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing validate pair before replacement contract");
  });
});

test("test_rerun_rollback_fixture_relocation_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "evals/fixtures/onboarding-conflicting-evidence.md");
    const contract = "- If either replacement fails, restore the prior profile and prompt rather than leaving a mixed pair.\n";
    mutate(p, (c) => c.replace(contract, "").replace("## Expected behavior\n", `## Expected behavior\n\n${contract}`));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "Assertions must preserve Phase 4 contract");
  });
});

test("test_state_allowlist_contract_removal_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/onboarding.md");
    mutate(p, (c) =>
      c.replace(
        "only `voice-profile.md`, `realtime-voice-prompt.md`, and minimal `settings.md`",
        "the generated state files"
      )
    );
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing exact retained state contract");
  });
});

test("test_helper_approval_contract_removal_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/references/onboarding.md");
    mutate(p, (c) => c.replace("explicit approval before any installation", "install a useful helper"));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "missing helper approval contract");
  });
});

test("test_profile_template_empty_section_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/assets/voice-profile.template.md");
    mutate(p, (c) => c.replace("\n[Give complete instructions for written composition and revision.]\n", "\n"));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "Written guidance must contain guidance");
  });
});

test("test_realtime_policy_content_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/assets/realtime-voice-prompt.md");
    mutate(p, (c) => c + "\nUse tools when needed.\n");
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "realtime module must not define tool");
  });
});

test("test_realtime_policy_synonym_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/assets/realtime-voice-prompt.md");
    mutate(p, (c) => c + "\nTransfer the caller when escalation is needed.\n");
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "realtime module must not define handoff");
  });
});

test("test_realtime_budget_overrun_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "skills/anti-slop-slop-canon/assets/realtime-voice-prompt.md");
    mutate(p, (c) => c + " voice".repeat(120));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "must be between 250 and 400");
  });
});

test("test_weakening_realtime_fixture_policy_boundary_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "evals/fixtures/phase-4-personalized-realtime.md");
    mutate(p, (c) =>
      c.replace(
        "Define no jobs or roles; tools, APIs, or function calls; safety or refusal policy; facts or knowledge; conversation flow, greetings, or follow-up behavior; handoff, transfer, or escalation; interruption or barge-in behavior; or orchestration or delegation",
        "Keep the module useful"
      )
    );
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "Assertions must preserve Phase 4 contract");
  });
});

test("test_weakening_exact_quote_fixture_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "evals/fixtures/phase-3-exact-quote-exemption.md");
    mutate(p, (c) => c.replace("preserve the quotation byte for byte", "preserve the quotation's meaning"));
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "Expected behavior must preserve Phase 3 contract");
  });
});

test("test_moving_fixture_assertion_to_wrong_section_fails", () => {
  withRepository((root) => {
    const p = path.join(root, "evals/fixtures/phase-3-compose-routing.md");
    mutate(p, (c) =>
      c
        .replace("- Do not invent a time, cause, safety claim, or apology.\n", "")
        .replace("## Expected behavior\n", "## Expected behavior\n\nDo not invent a time, cause, safety claim, or apology.\n")
    );
    const { stderr, success } = runValidator(root);
    refute(success);
    assertIncludes(stderr, "Assertions must preserve Phase 3 contract");
  });
});

function main(): void {
  console.log(`Running ${tests.length} tests:\n`);
  let failures = 0;
  const failureDetails: { name: string; error: Error }[] = [];

  for (const [name, fn] of tests) {
    try {
      fn();
      process.stdout.write(".");
    } catch (e) {
      failures++;
      failureDetails.push({ name, error: e instanceof Error ? e : new Error(String(e)) });
      process.stdout.write("F");
    }
  }

  console.log("\n");
  for (const { name, error } of failureDetails) {
    console.log(`FAIL: ${name}`);
    console.log(`  ${error.message}\n`);
  }

  console.log(`${tests.length} runs, ${failures} failures`);
  process.exitCode = failures === 0 ? 0 : 1;
}

main();
