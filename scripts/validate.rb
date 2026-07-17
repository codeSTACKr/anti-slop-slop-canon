#!/usr/bin/env ruby
# frozen_string_literal: true

require "pathname"
require "yaml"

ROOT = Pathname(__dir__).parent
SKILL_DIR = ROOT / "skills/anti-slop-slop-canon"
DEFAULTS = SKILL_DIR / "references/defaults.md"
PROFILE_TEMPLATE = SKILL_DIR / "assets/voice-profile.template.md"
SKILL = SKILL_DIR / "SKILL.md"
OPENAI_YAML = SKILL_DIR / "agents/openai.yaml"
SCHEMA_DOC = SKILL_DIR / "references/profile-schema.md"
FIXTURE_DIR = ROOT / "evals/fixtures"

REQUIRED_BUNDLE_SECTIONS = [
  "Voice summary",
  "Non-negotiable preferences",
  "Written guidance",
  "Spoken guidance",
  "Vocabulary",
  "Rhythm and sentence shape",
  "Structure and formatting",
  "Signature moves",
  "Patterns to avoid",
  "Short examples"
].freeze

REQUIRED_FIXTURE_SECTIONS = [
  "Context",
  "Input",
  "Expected behavior",
  "Assertions"
].freeze

REQUIRED_CATEGORIES = %w[
  ai_like
  good_prose
  personalized_voice
  spoken_output
  exemptions
  onboarding
].freeze

ALLOWED_OPERATIONS = %w[compose rewrite audit onboarding].freeze
ALLOWED_MODES = %w[written spoken mixed onboarding].freeze
SEMVER = /\A(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\z/

class Validation
  attr_reader :errors

  def initialize
    @errors = []
  end

  def check(condition, message)
    @errors << message unless condition
  end

  def frontmatter(path)
    text = path.read
    match = text.match(/\A---\s*\n(.*?)\n---\s*\n/m)
    check(!match.nil?, "#{relative(path)}: missing YAML frontmatter")
    return [{}, text] unless match

    data = YAML.safe_load(match[1], permitted_classes: [], aliases: false)
    check(data.is_a?(Hash), "#{relative(path)}: frontmatter must be a mapping")
    [data.is_a?(Hash) ? data : {}, text]
  rescue Psych::Exception => e
    @errors << "#{relative(path)}: invalid YAML frontmatter (#{e.message.lines.first.strip})"
    [{}, path.read]
  end

  def relative(path)
    path.relative_path_from(ROOT)
  end
end

def headings(text)
  text.scan(/^## ([^#\n].*)$/).flatten
end

def section_bodies(text)
  text.scan(/^## ([^\n]+)\n(.*?)(?=^## |\z)/m).to_h.transform_values(&:strip)
end

def lexical_units(text)
  text.scan(/[\p{L}\p{N}_]+(?:['’][\p{L}\p{N}_]+)*|[^\s]/u).length
end

def guarded_tokens(text)
  (lexical_units(text) * 1.25).ceil
end

def local_markdown_links(text)
  text.scan(/\[[^\]]+\]\((?!https?:|mailto:|#)([^)]+)\)/).flatten
end

validation = Validation.new

skill_meta, skill_text = validation.frontmatter(SKILL)
validation.check(skill_meta.keys.sort == %w[description name], "skills/anti-slop-slop-canon/SKILL.md: frontmatter may contain only name and description")
validation.check(skill_meta["name"] == "anti-slop-slop-canon", "skills/anti-slop-slop-canon/SKILL.md: name must match the skill directory")
validation.check(skill_meta["name"].to_s.match?(/\A[a-z0-9]+(?:-[a-z0-9]+)*\z/), "skills/anti-slop-slop-canon/SKILL.md: name must be lowercase hyphen-case")
validation.check(skill_meta["name"].to_s.length <= 64, "skills/anti-slop-slop-canon/SKILL.md: name exceeds 64 characters")
validation.check(!skill_meta["description"].to_s.strip.empty?, "skills/anti-slop-slop-canon/SKILL.md: description is required")
validation.check(skill_meta["description"].is_a?(String), "skills/anti-slop-slop-canon/SKILL.md: description must be a string")
validation.check(skill_meta["description"].to_s.length <= 1024, "skills/anti-slop-slop-canon/SKILL.md: description exceeds 1,024 characters")
validation.check(!skill_meta["description"].to_s.match?(/[<>]/), "skills/anti-slop-slop-canon/SKILL.md: description cannot contain angle brackets")

begin
  openai_meta = YAML.safe_load(OPENAI_YAML.read, permitted_classes: [], aliases: false)
  interface = openai_meta.is_a?(Hash) ? openai_meta["interface"] : nil
  validation.check(openai_meta.is_a?(Hash) && openai_meta.keys == ["interface"], "skills/anti-slop-slop-canon/agents/openai.yaml: only interface metadata is expected in Phase 1")
  validation.check(interface.is_a?(Hash), "skills/anti-slop-slop-canon/agents/openai.yaml: interface mapping is required")
  if interface.is_a?(Hash)
    validation.check(interface.keys.sort == %w[default_prompt display_name short_description], "skills/anti-slop-slop-canon/agents/openai.yaml: interface fields do not match the generated metadata contract")
    validation.check(interface.values.all? { |value| value.is_a?(String) }, "skills/anti-slop-slop-canon/agents/openai.yaml: interface values must be strings")
    validation.check((25..64).cover?(interface["short_description"].to_s.length), "skills/anti-slop-slop-canon/agents/openai.yaml: short_description must be 25 to 64 characters")
    validation.check(interface["default_prompt"].to_s.include?("$anti-slop-slop-canon"), "skills/anti-slop-slop-canon/agents/openai.yaml: default_prompt must mention $anti-slop-slop-canon")
  end
rescue Psych::Exception => e
  validation.check(false, "skills/anti-slop-slop-canon/agents/openai.yaml: invalid YAML (#{e.message.lines.first.strip})")
end

bundle_data = {}
{ DEFAULTS => "defaults", PROFILE_TEMPLATE => "profile" }.each do |path, kind|
  meta, text = validation.frontmatter(path)
  bundle_data[kind] = meta
  required_keys = %w[bundle_kind content_version schema_version scope]
  required_keys << "defaults_version" if kind == "profile"
  validation.check(meta.keys.sort == required_keys.sort, "#{validation.relative(path)}: metadata fields must match the #{kind} contract")
  validation.check(meta["bundle_kind"] == kind, "#{validation.relative(path)}: bundle_kind must be #{kind}")
  %w[schema_version content_version].each do |field|
    validation.check(meta[field].is_a?(String) && meta[field].match?(SEMVER), "#{validation.relative(path)}: #{field} must be a quoted semantic version")
  end
  if kind == "profile"
    validation.check(meta["defaults_version"].is_a?(String) && meta["defaults_version"].match?(SEMVER), "#{validation.relative(path)}: defaults_version must be a quoted semantic version")
    validation.check(%w[global project].include?(meta["scope"]), "#{validation.relative(path)}: profile scope must be global or project")
  else
    validation.check(meta["scope"] == "bundled", "#{validation.relative(path)}: defaults scope must be bundled")
  end
  validation.check(headings(text) == REQUIRED_BUNDLE_SECTIONS, "#{validation.relative(path)}: required bundle sections are missing, duplicated, or out of order")
end

validation.check(bundle_data.dig("defaults", "schema_version") == bundle_data.dig("profile", "schema_version"), "defaults and profile template must use the same schema_version")
validation.check(bundle_data.dig("profile", "defaults_version") == bundle_data.dig("defaults", "content_version"), "profile defaults_version must match defaults content_version")
validation.check(bundle_data.dig("defaults", "schema_version") != bundle_data.dig("defaults", "content_version"), "Phase 1 schema and default content versions must demonstrate independent lifecycles")
schema_doc_version = SCHEMA_DOC.read[/^Schema version: `([^`]+)`$/, 1]
validation.check(schema_doc_version == bundle_data.dig("defaults", "schema_version"), "skills/anti-slop-slop-canon/references/profile-schema.md: declared schema version must match the bundles")

fixture_paths = FIXTURE_DIR.glob("*.md").sort
validation.check(!fixture_paths.empty?, "evals/fixtures: at least one fixture is required")
seen_ids = []
seen_categories = []
fixture_paths.each do |path|
  meta, text = validation.frontmatter(path)
  required = %w[category expected_mutation id mode operation]
  validation.check(meta.keys.sort == required, "#{validation.relative(path)}: fixture metadata fields must match the documented contract")
  validation.check(meta["id"] == path.basename(".md").to_s, "#{validation.relative(path)}: id must match the filename")
  validation.check(meta["id"].to_s.match?(/\A[a-z0-9]+(?:-[a-z0-9]+)*\z/), "#{validation.relative(path)}: id must be kebab-case")
  validation.check(!seen_ids.include?(meta["id"]), "#{validation.relative(path)}: duplicate fixture id #{meta['id']}")
  validation.check(REQUIRED_CATEGORIES.include?(meta["category"]), "#{validation.relative(path)}: unknown fixture category #{meta['category']}")
  validation.check(ALLOWED_OPERATIONS.include?(meta["operation"]), "#{validation.relative(path)}: unknown operation #{meta['operation']}")
  validation.check(ALLOWED_MODES.include?(meta["mode"]), "#{validation.relative(path)}: unknown mode #{meta['mode']}")
  validation.check([true, false].include?(meta["expected_mutation"]), "#{validation.relative(path)}: expected_mutation must be a boolean")
  validation.check(headings(text) == REQUIRED_FIXTURE_SECTIONS, "#{validation.relative(path)}: required fixture sections are missing, duplicated, or out of order")
  section_bodies(text).each do |section, body|
    validation.check(!body.empty?, "#{validation.relative(path)}: #{section} section must not be empty")
  end
  seen_ids << meta["id"]
  seen_categories << meta["category"]
end
missing_categories = REQUIRED_CATEGORIES - seen_categories
validation.check(missing_categories.empty?, "evals/fixtures: missing categories #{missing_categories.join(', ')}")

allowed_runtime_files = [
  "SKILL.md",
  "agents/openai.yaml",
  "assets/voice-profile.template.md",
  "references/defaults.md",
  "references/profile-schema.md"
].freeze
actual_runtime_files = SKILL_DIR.glob("**/*", File::FNM_DOTMATCH).select(&:file?).map { |path| path.relative_path_from(SKILL_DIR).to_s }.sort
validation.check(actual_runtime_files == allowed_runtime_files.sort, "skills/anti-slop-slop-canon: unexpected runtime file; keep the Phase 1 skill Markdown-only except agents/openai.yaml")

forbidden_parallel_sources = [ROOT / "AGENTS.md", ROOT / ".cursorrules"]
forbidden_parallel_sources.each do |path|
  validation.check(!path.exist?, "#{validation.relative(path)}: parallel rule sources are not allowed")
end

ROOT.glob("**/*.{md,yml,yaml}").reject { |path| path.to_s.include?("/.git/") }.each do |path|
  text = path.read
  validation.check(!text.match?(/\b(?:TODO|TBD|will be implemented|placeholder)\b/i), "#{validation.relative(path)}: unresolved scaffold marker")
  local_markdown_links(text).each do |target|
    clean_target = target.split("#", 2).first
    next if clean_target.empty?

    validation.check((path.dirname / clean_target).cleanpath.exist?, "#{validation.relative(path)}: broken local link #{target}")
  end
end

ROOT.glob("**/*.{yml,yaml}").reject { |path| path.to_s.include?("/.git/") }.each do |path|
  begin
    YAML.safe_load(path.read, permitted_classes: [], aliases: false)
  rescue Psych::Exception => e
    validation.check(false, "#{validation.relative(path)}: invalid YAML (#{e.message.lines.first.strip})")
  end
end

budgets = { SKILL => 600, DEFAULTS => 1500, PROFILE_TEMPLATE => 1500 }
budgets.each do |path, limit|
  text = path.read
  raw = lexical_units(text)
  guarded = guarded_tokens(text)
  puts format("budget %-68s raw=%4d guarded=%4d limit=<%d", validation.relative(path), raw, guarded, limit)
  validation.check(guarded < limit, "#{validation.relative(path)}: guarded context count #{guarded} must be below #{limit}")
end

if validation.errors.empty?
  puts "PASS: repository contracts, fixtures, links, runtime contents, and context budgets"
  exit 0
end

validation.errors.each { |error| warn "ERROR: #{error}" }
warn "FAIL: #{validation.errors.length} validation error(s)"
exit 1
