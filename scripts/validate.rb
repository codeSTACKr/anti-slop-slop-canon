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
OPERATIONS = SKILL_DIR / "references/operations.md"
ONBOARDING = SKILL_DIR / "references/onboarding.md"
REALTIME_PROMPT = SKILL_DIR / "assets/realtime-voice-prompt.md"
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

ALLOWED_OPERATIONS = %w[compose rewrite audit profile realtime onboarding].freeze
ALLOWED_MODES = %w[written spoken mixed onboarding].freeze
SEMVER = /\A(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\z/

PHASE_3_FIXTURE_CONTRACTS = {
  "phase-3-compose-routing" => {
    metadata: ["compose", "written", true],
    Context: ["without an explicit operation name"],
    Input: ["west elevator reopens Tuesday", "door sensor is replaced", "east elevator remains available"],
    "Expected behavior": ["select written mode without asking", "run the silent second pass", "return clean prose"],
    Assertions: ["Preserve Tuesday, the door sensor, and the east elevator's availability", "Do not invent a time, cause, safety claim, or apology", "Return no operation label, explanation, checklist, or diff"]
  },
  "phase-3-rewrite-routing" => {
    metadata: ["rewrite", "written", true],
    Input: ["Room 12 reopens at 2 PM after the window repair!"],
    "Expected behavior": ["smallest useful edit", "run the silent second pass", "return only clean revised prose"],
    Assertions: ["Preserve Room 12, 2 PM, and the window repair", "Remove unsupported enthusiasm and the exclamation point", "Return no preamble, reasoning, rule mapping, or diff"]
  },
  "phase-3-audit-routing" => {
    metadata: ["audit", "written", false],
    Input: ["Audit this without rewriting", "Here's the thing: this revolutionary update changes everything!"],
    "Expected behavior": ["report concrete findings without supplying corrected prose"],
    Assertions: ["canned phrase, unsupported hype, mid-sentence colon, and exclamation point", "Map findings to active rules", "Do not rewrite or silently replace the input"]
  },
  "phase-3-spoken-routing" => {
    metadata: ["compose", "spoken", true],
    Input: ["narration for a training video", "red switch stops the conveyor", "green switch restarts it after the guard is closed"],
    "Expected behavior": ["explicit narration context without asking", "pronounceable, first-listen delivery"],
    Assertions: ["Preserve the switch colors, actions, and closed-guard condition", "Use no Markdown, emojis, visual-only notation, or stage directions", "Do not treat the ambiguous word `write` as evidence for written mode"]
  },
  "phase-3-exact-quote-exemption" => {
    metadata: ["rewrite", "written", true],
    Input: ["Quote: “Here's the thing: it was fast—really fast!”"],
    "Expected behavior": ["preserve the quotation byte for byte"],
    Assertions: ["Preserve `“Here's the thing: it was fast—really fast!”` exactly", "Do not report protected punctuation or wording as a violation", "unchanged quote unless a diff is requested"]
  },
  "phase-3-code-exemption" => {
    metadata: ["rewrite", "written", true],
    Input: ["const message = \"Ready: yes!\";", "const range = \"1–3\";"],
    "Expected behavior": ["preserving the entire fenced code block byte for byte"],
    Assertions: ["Preserve both code lines, punctuation, quotes, and indentation exactly", "Do not apply prose punctuation bans inside code", "minimal edit"]
  },
  "phase-3-structured-data-exemption" => {
    metadata: ["rewrite", "written", true],
    Input: ["status: \"ready!\"", "range: \"1–3\"", '`{"label":"Ready: yes!","enabled":true}`'],
    "Expected behavior": ["preserve both structured-data spans byte for byte"],
    Assertions: ["Preserve the YAML and inline JSON exactly", "Do not apply prose rules to keys, values, punctuation, or delimiters", "Return no explanation or diff unless requested"]
  }
}.freeze

PHASE_4_FIXTURE_CONTRACTS = {
  "phase-4-first-use-choice" => {
    metadata: ["onboarding", "onboarding", false],
    Context: ["neither `voice-profile.md` nor `settings.md`", "Global state may exist but is out of scope"],
    "Expected behavior": ["ask exactly one choice", "personalize now, use defaults, or defer", "Do not inspect global state"],
    Assertions: ["Present all three choices and no onboarding questionnaire", "Do not claim any profile, prompt, or settings write"]
  },
  "phase-4-one-short-sample" => {
    metadata: ["onboarding", "onboarding", false],
    Context: ["one 74-word plain-text note"],
    "Expected behavior": ["Accept the sample", "low confidence", "option to proceed now"],
    Assertions: ["Do not impose a minimum sample count or word count", "Keep confidence and measurements out of the proposed profile"]
  },
  "phase-4-strong-evidence" => {
    metadata: ["onboarding", "onboarding", false],
    Context: ["four representative samples", "agree across them"],
    "Expected behavior": ["Shorten the interview", "proceed directly to a complete preview"],
    Assertions: ["Do not run a fixed questionnaire", "Separate channel formatting and subject matter"]
  },
  "phase-4-sparse-contradictory-evidence" => {
    metadata: ["onboarding", "onboarding", false],
    Context: ["quoted passage accounts for most of the casual wording"],
    "Expected behavior": ["Exclude the quotation", "ask one focused question", "explicit casual preference"],
    Assertions: ["Do not silently average", "Do not treat quoted or borrowed language as a stable trait"]
  },
  "phase-4-preview-before-save" => {
    metadata: ["onboarding", "onboarding", false],
    "Expected behavior": ["complete proposed profile", "complete personalized realtime module", "one short written example", "one short spoken example", "approve, revise one trait, or continue the interview"],
    Assertions: ["Require explicit approval", "Do not write `voice-profile.md`, `realtime-voice-prompt.md`, or `settings.md` during preview", "new complete preview"]
  },
  "phase-4-defaults-defer" => {
    metadata: ["onboarding", "onboarding", true],
    "Expected behavior": ["`setup: defaults`", "`setup: deferred`", "bundled defaults"],
    Assertions: ["Create no profile or personalized realtime prompt", "Write nowhere above", "Do not implement reminder cooldown, refresh, keep, or later lifecycle fields"]
  },
  "phase-4-sample-non-retention" => {
    metadata: ["onboarding", "onboarding", true],
    Context: ["pasted text", "local Markdown file", "URL", "temporary transcript"],
    "Expected behavior": ["Leave the user's local original in place", "retain only the approved profile, approved realtime prompt, and minimal settings"],
    Assertions: ["Retain no pasted text, URL, download, transcript, source list, extraction note, confidence data, measurement, or onboarding analysis", "exact three-file allowlist"]
  },
  "phase-4-optional-helper-approval" => {
    metadata: ["onboarding", "onboarding", false],
    Context: ["`yt-dlp` is not available", "usable pasted sample"],
    "Expected behavior": ["Use host-native access first", "proceed without it", "explicit approval before installation"],
    Assertions: ["Do not install `yt-dlp`", "Do not block onboarding", "Ask no helper-install question when the source can be read natively"]
  },
  "phase-4-profile-compilation" => {
    metadata: ["onboarding", "onboarding", true],
    "Expected behavior": ["schema `1.0.0`", "content version `1.0.0`", "scope `project`", "defaults version `0.1.0`", "all ten required sections in exact order", "invariants, explicit answers, consistent traits, then defaults"],
    Assertions: ["replace conflicting default preferences", "complete written and spoken guidance", "below 1,500 guarded units", "never load it alongside defaults"]
  },
  "phase-4-personalized-realtime" => {
    metadata: ["realtime", "spoken", true],
    "Expected behavior": ["bundled default realtime style", "approved spoken traits", "persist both consistently in global state"],
    Assertions: ["plain speakable output", "concise pronounceable sentences", "no Markdown or visual notation", "first-listen clarity", "between 250 and 400 guarded units", "Define no jobs, tools, safety policy, facts, conversation flow, handoffs, interruption logic, or orchestration"]
  }
}.freeze

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

%w[composition rewriting editing scripts narration voice-agent].each do |trigger|
  validation.check(skill_meta["description"].to_s.downcase.include?(trigger.sub("composition", "compose").sub("rewriting", "rewrite").sub("editing", "edit")), "skills/anti-slop-slop-canon/SKILL.md: description must trigger #{trigger}")
end

router_requirements = {
  "project state path" => "<project-root>/.anti-slop-slop-canon/",
  "global state path" => "~/.config/anti-slop-slop-canon/",
  "project isolation" => "never inspect or fall back to global state",
  "ambiguous written routing" => "Otherwise use written without asking",
  "single profile bundle" => "Load it alone",
  "single defaults bundle" => "load [references/defaults.md](references/defaults.md) alone",
  "profile schema compatibility" => "schema `1.0.0`",
  "profile scope match" => "active scope",
  "profile required sections" => "every required section",
  "profile actionable content" => "actionable rules",
  "exact quotation exemption" => "exact quotations",
  "code exemption" => "code",
  "structured data exemption" => "structured data",
  "legal exemption" => "legally fixed wording",
  "silent second pass" => "Silently check meaning, exemptions, mode, and rules",
  "clean output" => "Return clean compose or rewrite output",
  "first-use state gate" => "When profile and `settings.md` are absent",
  "conditional onboarding" => "otherwise do not",
  "onboarding routing" => "explicit onboarding, setup, or voice learning",
  "audit routing" => "audit",
  "profile routing" => "profile",
  "realtime routing" => "realtime"
}.freeze
router_requirements.each do |label, text|
  validation.check(skill_text.include?(text), "skills/anti-slop-slop-canon/SKILL.md: missing #{label} contract")
end

operations_text = OPERATIONS.read
required_operation_headings = %w[Compose Rewrite Audit Profile Realtime]
required_operation_headings.each do |heading|
  validation.check(headings(operations_text).include?(heading), "skills/anti-slop-slop-canon/references/operations.md: missing #{heading} workflow")
end
operation_requirements = {
  "all code forms" => "code in any form",
  "protected bytes" => "legally fixed wording byte for byte",
  "meaning preservation" => "Preserve meaning, factual detail, uncertainty",
  "ambiguous written routing" => "Default every ambiguous case to written without asking",
  "single bundle" => "Never supplement a profile with defaults",
  "clean compose output" => "Return only ready-to-use content unless an explanation was requested",
  "meaningful second pass" => "Preserve requested meaning, facts, uncertainty, intent, format, and protected bytes"
}.freeze
operation_requirements.each do |label, text|
  validation.check(operations_text.include?(text), "skills/anti-slop-slop-canon/references/operations.md: missing #{label} contract")
end
validation.check(operations_text.include?("Do not load defaults, persist a choice, refresh, merge, or offer keep/later behavior"), "skills/anti-slop-slop-canon/references/operations.md: Phase 5 lifecycle boundary is required")
validation.check(operations_text.include?("Generate a personalized module only as part of approved onboarding"), "skills/anti-slop-slop-canon/references/operations.md: personalized realtime generation boundary is required")

onboarding_text = ONBOARDING.read
onboarding_requirements = {
  "one-question interview" => "Ask one question per turn",
  "exact first-use choice" => "personalize now, use defaults, or defer",
  "minimal defaults state" => "`setup: defaults`",
  "minimal defer state" => "`setup: deferred`",
  "no Phase 5 lifecycle" => "Do not implement reminders, cooldowns, refresh, keep, or later lifecycle behavior",
  "explicit rerun" => "Explicit onboarding may start or rerun at any time",
  "early samples" => "Next ask for representative material early",
  "guaranteed inputs" => "pasted text, Markdown, and plain-text or local text files",
  "short sample" => "One short sample is enough",
  "host-native rich sources" => "host-native file reading or browsing",
  "optional helpers" => "`yt-dlp` or `pdftotext`",
  "helper approval" => "explicit approval before any installation",
  "no provenance checks" => "without authorship, ownership, identity, or provenance checks",
  "third-party abstraction" => "abstract traits",
  "ephemeral analysis" => "all working analysis ephemeral",
  "trait separation" => "subject matter, channel formatting, quotations, borrowed language, and one-off quirks",
  "strong evidence" => "Strong consistent evidence shortens the interview",
  "contradiction resolution" => "Never average, choose a side, or suppress the conflict silently",
  "profile versions" => "initial profile content version `1.0.0`",
  "rerun content version" => "increment the existing profile content version",
  "active scope metadata" => "active scope `global` or `project`",
  "profile precedence" => "Non-overridable product invariants from the router",
  "invariants remain outside profile" => "Product invariants constrain compilation but stay in the router",
  "profile replaces defaults" => "replace defaults at runtime, not supplement them",
  "profile budget" => "below 1,500 guarded units",
  "personalized realtime policy boundary" => "Never define jobs, tools, safety policy, facts, conversation flow, handoffs, interruption logic, or orchestration",
  "complete preview" => "The complete proposed `voice-profile.md`",
  "realtime preview" => "The complete proposed `realtime-voice-prompt.md`",
  "written preview" => "One short written example",
  "spoken preview" => "One short spoken example",
  "approval paths" => "approve, revise one trait, or continue the interview",
  "approval gate" => "Approval must be explicit",
  "scope-safe writes" => "Never write above project scope or into the installed skill directory",
  "atomic pair write" => "atomically where the host supports it",
  "consistent pair write" => "otherwise as one consistent approval action",
  "exact retained state" => "only `voice-profile.md`, `realtime-voice-prompt.md`, and minimal `settings.md`",
  "non-retention" => "Never copy or retain raw samples, pasted text, URLs, downloads, transcripts, source lists, extraction notes, confidence data, measurements, or onboarding analysis"
}.freeze
onboarding_requirements.each do |label, text|
  validation.check(onboarding_text.include?(text), "skills/anti-slop-slop-canon/references/onboarding.md: missing #{label} contract")
end

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
  REQUIRED_BUNDLE_SECTIONS.each do |section|
    validation.check(!section_bodies(text).fetch(section, "").empty?, "#{validation.relative(path)}: #{section} must contain guidance")
  end
end

validation.check(bundle_data.dig("defaults", "schema_version") == bundle_data.dig("profile", "schema_version"), "defaults and profile template must use the same schema_version")
validation.check(bundle_data.dig("profile", "defaults_version") == bundle_data.dig("defaults", "content_version"), "profile defaults_version must match defaults content_version")
validation.check(bundle_data.dig("profile", "content_version") == "1.0.0", "profile template content_version must be the Phase 4 initial profile version 1.0.0")
validation.check(bundle_data.dig("defaults", "schema_version") != bundle_data.dig("defaults", "content_version"), "schema and default content versions must demonstrate independent lifecycles")
schema_doc_version = SCHEMA_DOC.read[/^Schema version: `([^`]+)`$/, 1]
validation.check(schema_doc_version == bundle_data.dig("defaults", "schema_version"), "skills/anti-slop-slop-canon/references/profile-schema.md: declared schema version must match the bundles")
router_default_version = skill_text[/^Use default content version `([^`]+)`\.$/, 1]
validation.check(router_default_version == bundle_data.dig("defaults", "content_version"), "skills/anti-slop-slop-canon/SKILL.md: current default content version must match defaults.md")

fixture_paths = FIXTURE_DIR.glob("*.md").sort
validation.check(!fixture_paths.empty?, "evals/fixtures: at least one fixture is required")
seen_ids = []
seen_categories = []
fixture_records = {}
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
  fixture_records[meta["id"]] = [meta, text]
end
missing_categories = REQUIRED_CATEGORIES - seen_categories
validation.check(missing_categories.empty?, "evals/fixtures: missing categories #{missing_categories.join(', ')}")

PHASE_3_FIXTURE_CONTRACTS.each do |id, contract|
  record = fixture_records[id]
  validation.check(!record.nil?, "evals/fixtures: missing Phase 3 fixture #{id}")
  next unless record

  meta, text = record
  operation, mode, mutation = contract.fetch(:metadata)
  validation.check(meta["operation"] == operation, "evals/fixtures/#{id}.md: operation must be #{operation}")
  validation.check(meta["mode"] == mode, "evals/fixtures/#{id}.md: mode must be #{mode}")
  validation.check(meta["expected_mutation"] == mutation, "evals/fixtures/#{id}.md: expected_mutation must be #{mutation}")
  sections = section_bodies(text)
  contract.reject { |key, _value| key == :metadata }.each do |section, snippets|
    snippets.each do |snippet|
      validation.check(sections.fetch(section.to_s, "").include?(snippet), "evals/fixtures/#{id}.md: #{section} must preserve Phase 3 contract #{snippet.inspect}")
    end
  end
end

PHASE_4_FIXTURE_CONTRACTS.each do |id, contract|
  record = fixture_records[id]
  validation.check(!record.nil?, "evals/fixtures: missing Phase 4 fixture #{id}")
  next unless record

  meta, text = record
  operation, mode, mutation = contract.fetch(:metadata)
  validation.check(meta["operation"] == operation, "evals/fixtures/#{id}.md: operation must be #{operation}")
  validation.check(meta["mode"] == mode, "evals/fixtures/#{id}.md: mode must be #{mode}")
  validation.check(meta["expected_mutation"] == mutation, "evals/fixtures/#{id}.md: expected_mutation must be #{mutation}")
  sections = section_bodies(text)
  contract.reject { |key, _value| key == :metadata }.each do |section, snippets|
    snippets.each do |snippet|
      validation.check(sections.fetch(section.to_s, "").include?(snippet), "evals/fixtures/#{id}.md: #{section} must preserve Phase 4 contract #{snippet.inspect}")
    end
  end
end

fixed_record = fixture_records["exempt-fixed-content"]
validation.check(!fixed_record.nil?, "evals/fixtures: missing foundational protected-content fixture exempt-fixed-content")
if fixed_record
  _meta, fixed_text = fixed_record
  fixed_sections = section_bodies(fixed_text)
  [
    'Quote: “Move fast; keep the receipt — every time!”',
    'Code: `const label = "Ready: yes!";`',
    'Data: `{"status":"ready!","range":"1–3"}`',
    "Legal: Copyright (c) 2026 Example Co. All rights reserved."
  ].each do |protected_literal|
    validation.check(fixed_sections.fetch("Input", "").include?(protected_literal), "evals/fixtures/exempt-fixed-content.md: Input must preserve protected literal #{protected_literal.inspect}")
  end
  validation.check(fixed_sections.fetch("Expected behavior", "").include?("Preserve protected spans byte for byte"), "evals/fixtures/exempt-fixed-content.md: expected behavior must require byte-for-byte preservation")
  validation.check(fixed_sections.fetch("Assertions", "").include?("Preserve the quote, code, JSON, and legal line exactly"), "evals/fixtures/exempt-fixed-content.md: assertions must cover every protected form")
end

allowed_runtime_files = [
  "SKILL.md",
  "agents/openai.yaml",
  "assets/realtime-voice-prompt.md",
  "assets/voice-profile.template.md",
  "references/defaults.md",
  "references/onboarding.md",
  "references/operations.md",
  "references/profile-schema.md"
].freeze
actual_runtime_files = SKILL_DIR.glob("**/*", File::FNM_DOTMATCH).select(&:file?).map { |path| path.relative_path_from(SKILL_DIR).to_s }.sort
validation.check(actual_runtime_files == allowed_runtime_files.sort, "skills/anti-slop-slop-canon: unexpected runtime file; keep the skill Markdown-only except agents/openai.yaml")

realtime_text = REALTIME_PROMPT.read
required_realtime_style = [
  "plain, conversational language",
  "no Markdown",
  "concise, pronounceable sentences",
  "first hearing",
  "Repeat a key noun",
  "Read the response aloud"
].freeze
required_realtime_style.each do |text|
  validation.check(realtime_text.include?(text), "skills/anti-slop-slop-canon/assets/realtime-voice-prompt.md: missing realtime style contract #{text.inspect}")
end
forbidden_realtime_policy = {
  "job" => /\bjobs?\b|\broles?\b|\bresponsibilit(?:y|ies)\b/i,
  "tool" => /\btools?\b|\bAPIs?\b|\bfunction calls?\b|\bbrowsers?\b|\bdatabases?\b/i,
  "safety policy" => /\bsafety\b|\bpolic(?:y|ies)\b|\brefus(?:e|es|al)\b|\bdisallow(?:s|ed)?\b/i,
  "facts" => /\bfacts?\b|\bfactual(?:ly)?\b|\bknowledge\b|\btruth(?:ful|fully)?\b/i,
  "conversation flow" => /\bconversation flow\b|\bfollow-up questions?\b|\bturn-taking\b|\bgreet(?:ing|s)?\b/i,
  "handoff" => /\bhandoffs?\b|\btransfer(?:s|red|ring)?\b|\bescalat(?:e|es|ed|ing|ion)\b/i,
  "interruption logic" => /\binterrupt(?:ion|ions|ed|ing)?\b|\bbarge-in\b/i,
  "orchestration" => /\borchestrat(?:e|es|ed|ing|ion)\b|\bdelegat(?:e|es|ed|ing|ion)\b/i
}.freeze
forbidden_realtime_policy.each do |label, pattern|
  validation.check(!realtime_text.match?(pattern), "skills/anti-slop-slop-canon/assets/realtime-voice-prompt.md: realtime module must not define #{label}")
end

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

realtime_raw = lexical_units(realtime_text)
realtime_guarded = guarded_tokens(realtime_text)
puts format("budget %-68s raw=%4d guarded=%4d range=250...400", validation.relative(REALTIME_PROMPT), realtime_raw, realtime_guarded)
validation.check((250..400).cover?(realtime_guarded), "skills/anti-slop-slop-canon/assets/realtime-voice-prompt.md: guarded context count #{realtime_guarded} must be between 250 and 400")

if validation.errors.empty?
  puts "PASS: repository contracts, fixtures, links, runtime contents, and context budgets"
  exit 0
end

validation.errors.each { |error| warn "ERROR: #{error}" }
warn "FAIL: #{validation.errors.length} validation error(s)"
exit 1
