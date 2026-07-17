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
      FileUtils.rm(root / "evals/fixtures/onboarding-conflicting-evidence.md")
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
end
