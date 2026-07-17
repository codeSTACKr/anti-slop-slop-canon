#!/usr/bin/env ruby
# frozen_string_literal: true

require "fileutils"
require "minitest/autorun"
require "open3"
require "pathname"
require "tmpdir"

SOURCE_ROOT = Pathname(__dir__).parent

class ValidateScriptTest < Minitest::Test
  def with_repository
    Dir.mktmpdir("anti-slop-validation-") do |directory|
      root = Pathname(directory) / "repo"
      root.mkpath
      SOURCE_ROOT.children.reject { |path| path.basename.to_s == ".git" }.each do |path|
        FileUtils.cp_r(path, root / path.basename)
      end
      yield root
    end
  end

  def run_validator(root)
    Open3.capture3("ruby", (root / "scripts/validate.rb").to_s, chdir: root.to_s)
  end

  def test_current_repository_passes
    with_repository do |root|
      stdout, stderr, status = run_validator(root)
      assert status.success?, "#{stdout}\n#{stderr}"
      assert_includes stdout, "PASS: repository contracts"
    end
  end

  def test_missing_required_fixture_category_fails
    with_repository do |root|
      (root / "evals/fixtures").glob("*.md").each do |fixture|
        FileUtils.rm(fixture) if fixture.read.include?("category: onboarding")
      end
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing categories onboarding"
    end
  end

  def test_runtime_script_fails_markdown_only_gate
    with_repository do |root|
      (root / "skills/anti-slop-slop-canon/runtime.py").write("print('unexpected')\n")
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "unexpected runtime file"
    end
  end

  def test_schema_version_drift_fails
    with_repository do |root|
      defaults = root / "skills/anti-slop-slop-canon/references/defaults.md"
      defaults.write(defaults.read.sub('schema_version: "1.0.0"', 'schema_version: "1.1.0"'))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "same schema_version"
    end
  end

  def test_context_budget_overrun_fails
    with_repository do |root|
      skill = root / "skills/anti-slop-slop-canon/SKILL.md"
      skill.write(skill.read + (" budget" * 600))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "must be below 600"
    end
  end

  def test_profile_template_budget_overrun_fails
    with_repository do |root|
      profile = root / "skills/anti-slop-slop-canon/assets/voice-profile.template.md"
      profile.write(profile.read + (" profile" * 1_200))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "must be below 1500"
    end
  end

  def test_router_default_version_drift_fails
    with_repository do |root|
      skill = root / "skills/anti-slop-slop-canon/SKILL.md"
      skill.write(skill.read.sub('default content version `0.1.0`', 'default content version `0.2.0`'))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "current default content version must match defaults.md"
    end
  end

  def test_project_isolation_contract_removal_fails
    with_repository do |root|
      skill = root / "skills/anti-slop-slop-canon/SKILL.md"
      skill.write(skill.read.sub("never inspect or fall back to global state", "prefer project state"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing project isolation contract"
    end
  end

  def test_profile_scope_validation_removal_fails
    with_repository do |root|
      skill = root / "skills/anti-slop-slop-canon/SKILL.md"
      skill.write(skill.read.sub("active scope, every required section", "declared scope, every required section"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing profile scope match contract"
    end
  end

  def test_missing_phase_3_fixture_fails
    with_repository do |root|
      FileUtils.rm(root / "evals/fixtures/phase-3-audit-routing.md")
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing Phase 3 fixture phase-3-audit-routing"
    end
  end

  def test_missing_foundational_legal_exemption_fixture_fails
    with_repository do |root|
      FileUtils.rm(root / "evals/fixtures/exempt-fixed-content.md")
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing foundational protected-content fixture exempt-fixed-content"
    end
  end

  def test_missing_operations_workflow_fails
    with_repository do |root|
      operations = root / "skills/anti-slop-slop-canon/references/operations.md"
      operations.write(operations.read.sub("## Realtime", "## Voice module"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing Realtime workflow"
    end
  end

  def test_weakening_all_code_forms_contract_fails
    with_repository do |root|
      operations = root / "skills/anti-slop-slop-canon/references/operations.md"
      operations.write(operations.read.sub("code in any form", "fenced code"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing all code forms contract"
    end
  end

  def test_metadata_only_mismatch_detection_weakening_fails
    with_repository do |root|
      operations = root / "skills/anti-slop-slop-canon/references/operations.md"
      operations.write(operations.read.sub("Use only metadata already loaded from the router and winning profile", "Load defaults to compare their contents with the profile"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing already-loaded mismatch detection contract"
    end
  end

  def test_post_task_notice_order_weakening_fails
    with_repository do |root|
      operations = root / "skills/anti-slop-slop-canon/references/operations.md"
      operations.write(operations.read.sub("Complete the current writing task with the profile alone", "Pause the current task for the update notice"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing post-task notice contract"
    end
  end

  def test_automatic_refresh_merge_fails
    with_repository do |root|
      operations = root / "skills/anti-slop-slop-canon/references/operations.md"
      operations.write(operations.read.sub("Never merge or write automatically", "Merge the new defaults into the profile automatically"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing no automatic refresh contract"
    end
  end

  def test_refresh_direct_edit_precedence_removal_fails
    with_repository do |root|
      operations = root / "skills/anti-slop-slop-canon/references/operations.md"
      operations.write(operations.read.sub("including direct edits, as approved preferences over new defaults", "except direct edits, as temporary preferences below new defaults"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing direct edits win refresh contract"
    end
  end

  def test_permanent_keep_suppression_weakening_fails
    with_repository do |root|
      operations = root / "skills/anti-slop-slop-canon/references/operations.md"
      operations.write(operations.read.sub("Never notify for that defaults version again", "Notify for that defaults version in a later session"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing permanent keep contract"
    end
  end

  def test_later_cooldown_length_mutation_fails
    with_repository do |root|
      operations = root / "skills/anti-slop-slop-canon/references/operations.md"
      operations.write(operations.read.sub("exactly 14 calendar days after the choice", "about one week after the choice"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing deterministic later contract"
    end
  end

  def test_lifecycle_scope_isolation_weakening_fails
    with_repository do |root|
      operations = root / "skills/anti-slop-slop-canon/references/operations.md"
      operations.write(operations.read.sub("A project copy reads and writes project state only", "A project copy may use global lifecycle state"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing lifecycle scope isolation contract"
    end
  end

  def test_automatic_realtime_regeneration_fails
    with_repository do |root|
      operations = root / "skills/anti-slop-slop-canon/references/operations.md"
      operations.write(operations.read.sub("only during approved onboarding, approved refresh, or an explicit regeneration request", "whenever the profile or defaults version changes"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "personalized realtime generation boundary is required"
    end
  end

  def test_missing_phase_5_fixture_fails
    with_repository do |root|
      FileUtils.rm(root / "evals/fixtures/phase-5-refresh-preview.md")
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing Phase 5 fixture phase-5-refresh-preview"
    end
  end

  def test_mismatch_notice_moved_into_task_fails
    with_repository do |root|
      fixture = root / "evals/fixtures/phase-5-mismatch-notice.md"
      contract = "- Do not show the notice before or inside the requested content.\n"
      fixture.write(fixture.read.sub(contract, "").sub("## Expected behavior\n", "## Expected behavior\n\n#{contract}"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "Assertions must preserve Phase 5 contract"
    end
  end

  def test_refresh_failure_rollback_relocation_fails
    with_repository do |root|
      fixture = root / "evals/fixtures/phase-5-refresh-preview.md"
      contract = "- On cancellation or failure, preserve the prior profile and prompt as the active pair.\n"
      fixture.write(fixture.read.sub(contract, "").sub("## Expected behavior\n", "## Expected behavior\n\n#{contract}"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "Assertions must preserve Phase 5 contract"
    end
  end

  def test_later_fixture_date_arithmetic_mutation_fails
    with_repository do |root|
      fixture = root / "evals/fixtures/phase-5-later-cooldown.md"
      fixture.write(fixture.read.sub('defaults_remind_after: "2026-07-31"', 'defaults_remind_after: "2026-07-24"'))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "Expected behavior must preserve Phase 5 contract"
    end
  end

  def test_profile_inspection_mutation_regression_fails
    with_repository do |root|
      fixture = root / "evals/fixtures/phase-5-profile-edit-stability.md"
      fixture.write(fixture.read.sub("Return the project profile unchanged", "Normalize and return the project profile"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "Expected behavior must preserve Phase 5 contract"
    end
  end

  def test_missing_phase_4_fixture_fails
    with_repository do |root|
      FileUtils.rm(root / "evals/fixtures/phase-4-preview-before-save.md")
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing Phase 4 fixture phase-4-preview-before-save"
    end
  end

  def test_first_use_choice_weakening_fails
    with_repository do |root|
      onboarding = root / "skills/anti-slop-slop-canon/references/onboarding.md"
      onboarding.write(onboarding.read.sub("personalize now, use defaults, or defer", "choose a setup path"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing exact first-use choice contract"
    end
  end

  def test_batch_question_onboarding_fails
    with_repository do |root|
      onboarding = root / "skills/anti-slop-slop-canon/references/onboarding.md"
      onboarding.write(onboarding.read.sub("Ask one question per turn", "Ask all useful questions together"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing one-question interview contract"
    end
  end

  def test_preview_approval_gate_removal_fails
    with_repository do |root|
      onboarding = root / "skills/anti-slop-slop-canon/references/onboarding.md"
      onboarding.write(onboarding.read.sub("Approval must be explicit", "Assume approval when the preview is shown"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing approval gate contract"
    end
  end

  def test_profile_precedence_weakening_fails
    with_repository do |root|
      onboarding = root / "skills/anti-slop-slop-canon/references/onboarding.md"
      onboarding.write(onboarding.read.sub("Non-overridable product invariants from the router", "Use whichever rules seem strongest"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing profile precedence contract"
    end
  end

  def test_profile_precedence_reordering_fails
    with_repository do |root|
      onboarding = root / "skills/anti-slop-slop-canon/references/onboarding.md"
      onboarding.write(onboarding.read.sub("3. Traits consistent across supplied samples.\n4. Bundled defaults.", "3. Bundled defaults.\n4. Traits consistent across supplied samples."))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "profile precedence must preserve the exact ordered chain"
    end
  end

  def test_copying_invariants_into_profile_contract_fails
    with_repository do |root|
      onboarding = root / "skills/anti-slop-slop-canon/references/onboarding.md"
      onboarding.write(onboarding.read.sub("Product invariants constrain compilation but stay in the router", "Copy product invariants into every profile"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing invariants remain outside profile contract"
    end
  end

  def test_rerun_profile_version_contract_removal_fails
    with_repository do |root|
      onboarding = root / "skills/anti-slop-slop-canon/references/onboarding.md"
      onboarding.write(onboarding.read.sub("increment the existing profile content version", "keep the prior content version"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing rerun content version contract"
    end
  end

  def test_sample_retention_contract_removal_fails
    with_repository do |root|
      onboarding = root / "skills/anti-slop-slop-canon/references/onboarding.md"
      onboarding.write(onboarding.read.sub("Never copy or retain raw samples, pasted text, URLs, downloads, transcripts, source lists, extraction notes, confidence data, measurements, or onboarding analysis", "Retain useful source material"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing non-retention contract"
    end
  end

  def test_scope_safe_write_contract_removal_fails
    with_repository do |root|
      onboarding = root / "skills/anti-slop-slop-canon/references/onboarding.md"
      onboarding.write(onboarding.read.sub("Never write above project scope or into the installed skill directory", "Write to any convenient configuration directory"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing scope-safe writes contract"
    end
  end

  def test_atomic_pair_write_contract_removal_fails
    with_repository do |root|
      onboarding = root / "skills/anti-slop-slop-canon/references/onboarding.md"
      onboarding.write(onboarding.read.sub("atomically where the host supports it", "one file at a time"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing atomic pair write contract"
    end
  end

  def test_pair_validation_before_replacement_contract_removal_fails
    with_repository do |root|
      onboarding = root / "skills/anti-slop-slop-canon/references/onboarding.md"
      onboarding.write(onboarding.read.sub("and budgets before replacing either current file", "and budgets after replacing the current files"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing validate pair before replacement contract"
    end
  end

  def test_rerun_rollback_fixture_relocation_fails
    with_repository do |root|
      fixture = root / "evals/fixtures/onboarding-conflicting-evidence.md"
      contract = "- If either replacement fails, restore the prior profile and prompt rather than leaving a mixed pair.\n"
      fixture.write(fixture.read.sub(contract, "").sub("## Expected behavior\n", "## Expected behavior\n\n#{contract}"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "Assertions must preserve Phase 4 contract"
    end
  end

  def test_state_allowlist_contract_removal_fails
    with_repository do |root|
      onboarding = root / "skills/anti-slop-slop-canon/references/onboarding.md"
      onboarding.write(onboarding.read.sub("only `voice-profile.md`, `realtime-voice-prompt.md`, and minimal `settings.md`", "the generated state files"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing exact retained state contract"
    end
  end

  def test_helper_approval_contract_removal_fails
    with_repository do |root|
      onboarding = root / "skills/anti-slop-slop-canon/references/onboarding.md"
      onboarding.write(onboarding.read.sub("explicit approval before any installation", "install a useful helper"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "missing helper approval contract"
    end
  end

  def test_profile_template_empty_section_fails
    with_repository do |root|
      profile = root / "skills/anti-slop-slop-canon/assets/voice-profile.template.md"
      profile.write(profile.read.sub("\n[Give complete instructions for written composition and revision.]\n", "\n"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "Written guidance must contain guidance"
    end
  end

  def test_realtime_policy_content_fails
    with_repository do |root|
      prompt = root / "skills/anti-slop-slop-canon/assets/realtime-voice-prompt.md"
      prompt.write(prompt.read + "\nUse tools when needed.\n")
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "realtime module must not define tool"
    end
  end

  def test_realtime_policy_synonym_fails
    with_repository do |root|
      prompt = root / "skills/anti-slop-slop-canon/assets/realtime-voice-prompt.md"
      prompt.write(prompt.read + "\nTransfer the caller when escalation is needed.\n")
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "realtime module must not define handoff"
    end
  end

  def test_realtime_budget_overrun_fails
    with_repository do |root|
      prompt = root / "skills/anti-slop-slop-canon/assets/realtime-voice-prompt.md"
      prompt.write(prompt.read + (" voice" * 120))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "must be between 250 and 400"
    end
  end

  def test_weakening_realtime_fixture_policy_boundary_fails
    with_repository do |root|
      fixture = root / "evals/fixtures/phase-4-personalized-realtime.md"
      fixture.write(fixture.read.sub("Define no jobs or roles; tools, APIs, or function calls; safety or refusal policy; facts or knowledge; conversation flow, greetings, or follow-up behavior; handoff, transfer, or escalation; interruption or barge-in behavior; or orchestration or delegation", "Keep the module useful"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "Assertions must preserve Phase 4 contract"
    end
  end

  def test_weakening_exact_quote_fixture_fails
    with_repository do |root|
      fixture = root / "evals/fixtures/phase-3-exact-quote-exemption.md"
      fixture.write(fixture.read.sub("preserve the quotation byte for byte", "preserve the quotation's meaning"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "Expected behavior must preserve Phase 3 contract"
    end
  end

  def test_moving_fixture_assertion_to_wrong_section_fails
    with_repository do |root|
      fixture = root / "evals/fixtures/phase-3-compose-routing.md"
      fixture.write(fixture.read.sub("- Do not invent a time, cause, safety claim, or apology.\n", "").sub("## Expected behavior\n", "## Expected behavior\n\nDo not invent a time, cause, safety claim, or apology.\n"))
      _stdout, stderr, status = run_validator(root)
      refute status.success?
      assert_includes stderr, "Assertions must preserve Phase 3 contract"
    end
  end
end
