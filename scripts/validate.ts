#!/usr/bin/env -S npx tsx
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYAML } from "yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const SKILL_DIR = path.join(ROOT, "skills/anti-slop-slop-canon");
const DEFAULTS = path.join(SKILL_DIR, "references/defaults.md");
const PROFILE_TEMPLATE = path.join(SKILL_DIR, "assets/voice-profile.template.md");
const SKILL = path.join(SKILL_DIR, "SKILL.md");
const OPENAI_YAML = path.join(SKILL_DIR, "agents/openai.yaml");
const SCHEMA_DOC = path.join(SKILL_DIR, "references/profile-schema.md");
const OPERATIONS = path.join(SKILL_DIR, "references/operations.md");
const ONBOARDING = path.join(SKILL_DIR, "references/onboarding.md");
const REALTIME_PROMPT = path.join(SKILL_DIR, "assets/realtime-voice-prompt.md");
const FIXTURE_DIR = path.join(ROOT, "evals/fixtures");

const REQUIRED_BUNDLE_SECTIONS = [
  "Voice summary",
  "Non-negotiable preferences",
  "Written guidance",
  "Spoken guidance",
  "Vocabulary",
  "Rhythm and sentence shape",
  "Structure and formatting",
  "Signature moves",
  "Patterns to avoid",
  "Short examples",
];

const REQUIRED_FIXTURE_SECTIONS = ["Context", "Input", "Expected behavior", "Assertions"];

const REQUIRED_CATEGORIES = ["ai_like", "good_prose", "personalized_voice", "spoken_output", "exemptions", "onboarding"];

const ALLOWED_OPERATIONS = ["compose", "rewrite", "audit", "profile", "realtime", "onboarding"];
const ALLOWED_MODES = ["written", "spoken", "mixed", "onboarding"];
const SEMVER = /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/;

type FixtureContract = {
  metadata: [string, string, boolean];
  [section: string]: [string, string, boolean] | string[];
};

const PHASE_3_FIXTURE_CONTRACTS: Record<string, FixtureContract> = {
  "phase-3-compose-routing": {
    metadata: ["compose", "written", true],
    Context: ["without an explicit operation name"],
    Input: ["west elevator reopens Tuesday", "door sensor is replaced", "east elevator remains available"],
    "Expected behavior": ["select written mode without asking", "run the silent second pass", "return clean prose"],
    Assertions: [
      "Preserve Tuesday, the door sensor, and the east elevator's availability",
      "Do not invent a time, cause, safety claim, or apology",
      "Return no operation label, explanation, checklist, or diff",
    ],
  },
  "phase-3-rewrite-routing": {
    metadata: ["rewrite", "written", true],
    Input: ["Room 12 reopens at 2 PM after the window repair!"],
    "Expected behavior": ["smallest useful edit", "run the silent second pass", "return only clean revised prose"],
    Assertions: [
      "Preserve Room 12, 2 PM, and the window repair",
      "Remove unsupported enthusiasm and the exclamation point",
      "Return no preamble, reasoning, rule mapping, or diff",
    ],
  },
  "phase-3-audit-routing": {
    metadata: ["audit", "written", false],
    Input: ["Audit this without rewriting", "Here's the thing: this revolutionary update changes everything!"],
    "Expected behavior": ["report concrete findings without supplying corrected prose"],
    Assertions: [
      "canned phrase, unsupported hype, mid-sentence colon, and exclamation point",
      "Map findings to active rules",
      "Do not rewrite or silently replace the input",
    ],
  },
  "phase-3-spoken-routing": {
    metadata: ["compose", "spoken", true],
    Input: [
      "narration for a training video",
      "red switch stops the conveyor",
      "green switch restarts it after the guard is closed",
    ],
    "Expected behavior": ["explicit narration context without asking", "pronounceable, first-listen delivery"],
    Assertions: [
      "Preserve the switch colors, actions, and closed-guard condition",
      "Use no Markdown, emojis, visual-only notation, or stage directions",
      "Do not treat the ambiguous word `write` as evidence for written mode",
    ],
  },
  "phase-3-exact-quote-exemption": {
    metadata: ["rewrite", "written", true],
    Input: ["Quote: “Here's the thing: it was fast—really fast!”"],
    "Expected behavior": ["preserve the quotation byte for byte"],
    Assertions: [
      "Preserve `“Here's the thing: it was fast—really fast!”` exactly",
      "Do not report protected punctuation or wording as a violation",
      "unchanged quote unless a diff is requested",
    ],
  },
  "phase-3-code-exemption": {
    metadata: ["rewrite", "written", true],
    Input: ['const message = "Ready: yes!";', 'const range = "1–3";'],
    "Expected behavior": ["preserving the entire fenced code block byte for byte"],
    Assertions: [
      "Preserve both code lines, punctuation, quotes, and indentation exactly",
      "Do not apply prose punctuation bans inside code",
      "minimal edit",
    ],
  },
  "phase-3-structured-data-exemption": {
    metadata: ["rewrite", "written", true],
    Input: ['status: "ready!"', 'range: "1–3"', '`{"label":"Ready: yes!","enabled":true}`'],
    "Expected behavior": ["preserve both structured-data spans byte for byte"],
    Assertions: [
      "Preserve the YAML and inline JSON exactly",
      "Do not apply prose rules to keys, values, punctuation, or delimiters",
      "Return no explanation or diff unless requested",
    ],
  },
};

const PHASE_4_FIXTURE_CONTRACTS: Record<string, FixtureContract> = {
  "phase-4-first-use-choice": {
    metadata: ["onboarding", "onboarding", false],
    Context: ["neither `voice-profile.md` nor `settings.md`", "Global state may exist but is out of scope"],
    "Expected behavior": ["ask exactly one choice", "personalize now, use defaults, or defer", "Do not inspect global state"],
    Assertions: [
      "Present all three choices and no onboarding questionnaire",
      "Do not claim any profile, prompt, or settings write",
      "After first-use personalization is approved, resume the original task with the approved profile",
    ],
  },
  "phase-4-one-short-sample": {
    metadata: ["onboarding", "onboarding", false],
    Context: ["one 74-word plain-text note"],
    "Expected behavior": ["Accept the sample", "low confidence", "option to proceed now"],
    Assertions: [
      "Do not impose a minimum sample count or word count",
      "Keep confidence and measurements out of the proposed profile",
    ],
  },
  "phase-4-strong-evidence": {
    metadata: ["onboarding", "onboarding", false],
    Context: ["four representative samples", "agree across them"],
    "Expected behavior": ["Shorten the interview", "proceed directly to a complete preview"],
    Assertions: ["Do not run a fixed questionnaire", "Separate channel formatting and subject matter"],
  },
  "phase-4-sparse-contradictory-evidence": {
    metadata: ["onboarding", "onboarding", false],
    Context: ["quoted passage accounts for most of the casual wording"],
    "Expected behavior": ["Exclude the quotation", "ask one focused question", "explicit casual preference"],
    Assertions: ["Do not silently average", "Do not treat quoted or borrowed language as a stable trait"],
  },
  "phase-4-preview-before-save": {
    metadata: ["onboarding", "onboarding", false],
    "Expected behavior": [
      "complete proposed profile",
      "complete personalized realtime module",
      "one short written example",
      "one short spoken example",
      "approve, revise one trait, or continue the interview",
    ],
    Assertions: [
      "Require explicit approval",
      "Do not write `voice-profile.md`, `realtime-voice-prompt.md`, or `settings.md` during preview",
      "new complete preview",
    ],
  },
  "phase-4-defaults-defer": {
    metadata: ["onboarding", "onboarding", true],
    "Expected behavior": ["`setup: defaults`", "`setup: deferred`", "bundled defaults"],
    Assertions: [
      "Create no profile or personalized realtime prompt",
      "Write nowhere above",
      "Do not create profile-mismatch lifecycle fields when no profile exists",
    ],
  },
  "phase-4-sample-non-retention": {
    metadata: ["onboarding", "onboarding", true],
    Context: ["pasted text", "local Markdown file", "URL", "temporary transcript"],
    "Expected behavior": [
      "Leave the user's local original in place",
      "retain only the approved profile, approved realtime prompt, and minimal settings",
    ],
    Assertions: [
      "Retain no pasted text, URL, download, transcript, source list, extraction note, confidence data, measurement, or onboarding analysis",
      "exact three-file allowlist",
    ],
  },
  "phase-4-optional-helper-approval": {
    metadata: ["onboarding", "onboarding", false],
    Context: [
      "Pasted text, Markdown, and a local plain-text file",
      "URL, PDF, video, and transcript",
      "`yt-dlp` is not available",
      "usable pasted sample",
    ],
    "Expected behavior": [
      "Accept the pasted, Markdown, and local plain-text inputs directly",
      "Use host-native reading first for the URL, PDF, video, and transcript",
      "`yt-dlp` or `pdftotext`",
      "proceed without it",
      "explicit approval before installation",
    ],
    Assertions: [
      "Do not install `yt-dlp`",
      "Do not block onboarding",
      "Ask no helper-install question when the source can be read natively",
    ],
  },
  "phase-4-profile-compilation": {
    metadata: ["onboarding", "onboarding", true],
    "Expected behavior": [
      "schema `1.0.0`",
      "content version `1.0.0`",
      "scope `project`",
      "defaults version `0.1.0`",
      "all ten required sections in exact order",
      "invariants, explicit answers, consistent traits, then defaults",
    ],
    Assertions: [
      "replace conflicting default preferences",
      "complete written and spoken guidance",
      "below 1,500 guarded units",
      "never load it alongside defaults",
    ],
  },
  "phase-4-personalized-realtime": {
    metadata: ["realtime", "spoken", true],
    "Expected behavior": ["bundled default realtime style", "approved spoken traits", "persist both consistently in global state"],
    Assertions: [
      "plain speakable output",
      "concise pronounceable sentences",
      "no Markdown or visual notation",
      "first-listen clarity",
      "between 250 and 400 guarded units",
      "Define no jobs or roles; tools, APIs, or function calls; safety or refusal policy; facts or knowledge; conversation flow, greetings, or follow-up behavior; handoff, transfer, or escalation; interruption or barge-in behavior; or orchestration or delegation",
    ],
  },
  "onboarding-conflicting-evidence": {
    metadata: ["onboarding", "onboarding", false],
    Context: ["explicitly reruns onboarding"],
    "Expected behavior": [
      "Preserve current state",
      "one focused question at a time",
      "instead of silently averaging",
      "before any persistent write",
    ],
    Assertions: [
      "Preserve the prior profile and prompt unless the user explicitly approves the replacement",
      "increment the profile content version when the profile instructions changed",
      "If either replacement fails, restore the prior profile and prompt rather than leaving a mixed pair",
    ],
  },
};

const PHASE_5_FIXTURE_CONTRACTS: Record<string, FixtureContract> = {
  "phase-5-profile-edit-stability": {
    metadata: ["profile", "written", false],
    Context: ["directly edited after onboarding", "Global state also exists"],
    "Expected behavior": ["Return the project profile unchanged", "minimal lifecycle settings", "inspection read-only"],
    Assertions: [
      "Do not inspect global state, load defaults, or regenerate either generated file",
      "silently synchronize the realtime module",
      "preview-and-approval onboarding workflow",
      "exact three-file state allowlist",
    ],
  },
  "phase-5-mismatch-notice": {
    metadata: ["compose", "written", true],
    Context: [
      "router declares defaults version `0.2.0`",
      'defaults_version: "0.1.0"',
      "No notice state exists",
      "global state exists",
    ],
    "Expected behavior": [
      "already-loaded router and winning-profile metadata",
      "writing task with the project profile alone",
      "then show one non-blocking `refresh`, `keep`, or `later` notice",
      "shown state in project settings",
    ],
    Assertions: [
      "Do not read bundled defaults, global settings, or the global profile",
      "Do not show the notice before or inside",
      'defaults_notice_version: "0.2.0"',
      "defaults_notice_state: shown",
      "Do not repeat a shown notice",
      "Do not regenerate or replace",
    ],
  },
  "phase-5-refresh-preview": {
    metadata: ["profile", "onboarding", true],
    Context: ["current project profile includes direct edits", "current defaults are `0.2.0`"],
    "Expected behavior": [
      "separate complete recompilation after the prior writing task",
      "direct edits, as approved preferences over the new defaults",
      "complete replacement profile",
      "complete realtime module",
      "one written example",
      "one spoken example",
      "before any replacement",
    ],
    Assertions: [
      "Do not automatically merge, patch, overwrite, or activate",
      "Increment profile content version",
      'defaults_version: "0.2.0"',
      "all ten sections",
      "both context budgets",
      "Require explicit approval",
      "stage and validate both files before rollback-protected pair replacement",
      "On cancellation or failure, preserve the prior profile and prompt",
      "interrupted stale refresh",
      "restore the notice to `shown`",
      "remove any reminder date",
      "do not display a duplicate notice",
      "Clear lifecycle notice keys only after approved replacement",
    ],
  },
  "phase-5-keep-choice": {
    metadata: ["profile", "onboarding", true],
    "Expected behavior": ['defaults_notice_version: "0.2.0"', "defaults_notice_state: keep", "preserving any setup line"],
    Assertions: [
      "Never notify for defaults `0.2.0` again",
      "Do not change, regenerate, or replace",
      "Do not read defaults or write global state",
      "newer mismatched defaults version",
    ],
  },
  "phase-5-later-cooldown": {
    metadata: ["profile", "onboarding", true],
    Context: ["local date is 2026-07-17", "shown mismatch notice"],
    "Expected behavior": ["defaults_notice_state: later", 'defaults_remind_after: "2026-07-31"', "exactly 14 local calendar days"],
    Assertions: [
      "Do not notify before 2026-07-31",
      "notify once after the current task",
      "exactly 14 calendar days after the local date when that reminder is shown",
      "do not advance from the old deadline or leave the next date in the past",
      "Do not notify more than once in a cooldown window",
      "Do not regenerate either generated file, load defaults, or leave project scope",
    ],
  },
  "phase-5-explicit-realtime-regeneration": {
    metadata: ["realtime", "spoken", true],
    Context: ["directly edited a valid global profile", "explicitly request"],
    "Expected behavior": [
      "active profile alone",
      "preview one complete style-only realtime module",
      "Require explicit approval",
      "replace only the global realtime prompt with rollback protection",
    ],
    Assertions: [
      "Do not load defaults, rewrite the profile, or infer regeneration",
      "Do not write the prompt before approval or outside global state",
      "between 250 and 400 guarded units",
      "preserve every realtime policy exclusion",
      "approved onboarding, approved refresh, or this explicit request",
    ],
  },
};

class Validation {
  errors: string[] = [];

  check(condition: boolean, message: string): void {
    if (!condition) this.errors.push(message);
  }

  relative(p: string): string {
    return path.relative(ROOT, p);
  }

  frontmatter(p: string): [Record<string, unknown>, string] {
    const text = fs.readFileSync(p, "utf8");
    const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
    this.check(match !== null, `${this.relative(p)}: missing YAML frontmatter`);
    if (!match) return [{}, text];

    try {
      const data = parseYAML(match[1]);
      const isMapping = isPlainObject(data);
      this.check(isMapping, `${this.relative(p)}: frontmatter must be a mapping`);
      return [isMapping ? (data as Record<string, unknown>) : {}, text];
    } catch (e) {
      this.errors.push(`${this.relative(p)}: invalid YAML frontmatter (${firstLine(errorMessage(e))})`);
      return [{}, text];
    }
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

function firstLine(message: string): string {
  return message.split("\n")[0].trim();
}

function toS(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}

function arraysEqual(a: unknown[], b: unknown[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

function sortedKeys(obj: Record<string, unknown>): string[] {
  return Object.keys(obj).sort();
}

function headings(text: string): string[] {
  const result: string[] = [];
  for (const line of text.split("\n")) {
    const m = line.match(/^## ([^#\n].*)$/);
    if (m) result.push(m[1]);
  }
  return result;
}

function sectionBodies(text: string): Map<string, string> {
  const map = new Map<string, string>();
  const lines = text.split("\n");
  let i = 0;
  while (i < lines.length) {
    const m = lines[i].match(/^## (.+)$/);
    if (m) {
      const heading = m[1];
      const body: string[] = [];
      let j = i + 1;
      while (j < lines.length && !/^## (.+)$/.test(lines[j])) {
        body.push(lines[j]);
        j++;
      }
      map.set(heading, body.join("\n").trim());
      i = j;
    } else {
      i++;
    }
  }
  return map;
}

const LEXICAL_UNIT_RE = /[\p{L}\p{N}_]+(?:['’][\p{L}\p{N}_]+)*|[^\s]/gu;
function lexicalUnits(text: string): number {
  const matches = text.match(LEXICAL_UNIT_RE);
  return matches ? matches.length : 0;
}

function guardedTokens(text: string): number {
  return Math.ceil(lexicalUnits(text) * 1.25);
}

function localMarkdownLinks(text: string): string[] {
  const re = /\[[^\]]+\]\((?!https?:|mailto:|#)([^)]+)\)/g;
  const results: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    results.push(m[1]);
  }
  return results;
}

const PRUNE_DIR_NAMES = new Set(["node_modules", "dist"]);

function walk(dir: string, opts: { exts?: string[]; includeDotfiles: boolean }): string[] {
  const out: string[] = [];
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (!opts.includeDotfiles && entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (PRUNE_DIR_NAMES.has(entry.name)) continue;
      out.push(...walk(full, opts));
    } else if (entry.isFile()) {
      if (!opts.exts || opts.exts.includes(path.extname(entry.name).slice(1))) {
        out.push(full);
      }
    }
  }
  return out;
}

function padRight(s: string, width: number): string {
  return s.length >= width ? s : s + " ".repeat(width - s.length);
}

function padLeft(n: number, width: number): string {
  const s = String(n);
  return s.length >= width ? s : " ".repeat(width - s.length) + s;
}

const validation = new Validation();

const [skillMeta, skillText] = validation.frontmatter(SKILL);
validation.check(
  arraysEqual(sortedKeys(skillMeta), ["description", "name"]),
  "skills/anti-slop-slop-canon/SKILL.md: frontmatter may contain only name and description"
);
validation.check(
  skillMeta["name"] === "anti-slop-slop-canon",
  "skills/anti-slop-slop-canon/SKILL.md: name must match the skill directory"
);
validation.check(
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(toS(skillMeta["name"])),
  "skills/anti-slop-slop-canon/SKILL.md: name must be lowercase hyphen-case"
);
validation.check(
  toS(skillMeta["name"]).length <= 64,
  "skills/anti-slop-slop-canon/SKILL.md: name exceeds 64 characters"
);
validation.check(
  toS(skillMeta["description"]).trim() !== "",
  "skills/anti-slop-slop-canon/SKILL.md: description is required"
);
validation.check(
  typeof skillMeta["description"] === "string",
  "skills/anti-slop-slop-canon/SKILL.md: description must be a string"
);
validation.check(
  toS(skillMeta["description"]).length <= 1024,
  "skills/anti-slop-slop-canon/SKILL.md: description exceeds 1,024 characters"
);
validation.check(
  !/[<>]/.test(toS(skillMeta["description"])),
  "skills/anti-slop-slop-canon/SKILL.md: description cannot contain angle brackets"
);

for (const trigger of ["composition", "rewriting", "editing", "scripts", "narration", "voice-agent"]) {
  const needle = trigger.replace("composition", "compose").replace("rewriting", "rewrite").replace("editing", "edit");
  validation.check(
    toS(skillMeta["description"]).toLowerCase().includes(needle),
    `skills/anti-slop-slop-canon/SKILL.md: description must trigger ${trigger}`
  );
}

const routerRequirements: Record<string, string> = {
  "project state path": "<project-root>/.anti-slop-slop-canon/",
  "global state path": "~/.config/anti-slop-slop-canon/",
  "project isolation": "never inspect or fall back to global state",
  "ambiguous written routing": "Otherwise use written without asking",
  "single profile bundle": "Load it alone",
  "single defaults bundle": "load [references/defaults.md](references/defaults.md) alone",
  "profile schema compatibility": "schema `1.0.0`",
  "profile scope match": "active scope",
  "profile required sections": "every required section",
  "profile actionable content": "actionable rules",
  "exact quotation exemption": "exact quotations",
  "code exemption": "code",
  "structured data exemption": "structured data",
  "legal exemption": "legally fixed wording",
  "silent second pass": "Silently check meaning, exemptions, mode, and rules",
  "clean output": "Return clean compose or rewrite output",
  "first-use state gate": "When profile and `settings.md` are absent",
  "conditional onboarding": "otherwise do not",
  "onboarding routing": "explicit onboarding, setup, or voice learning",
  "audit routing": "audit",
  "profile routing": "profile",
  "realtime routing": "realtime",
};
for (const [label, text] of Object.entries(routerRequirements)) {
  validation.check(skillText.includes(text), `skills/anti-slop-slop-canon/SKILL.md: missing ${label} contract`);
}

const operationsText = fs.readFileSync(OPERATIONS, "utf8");
const requiredOperationHeadings = ["Compose", "Rewrite", "Audit", "Profile", "Realtime"];
for (const heading of requiredOperationHeadings) {
  validation.check(
    headings(operationsText).includes(heading),
    `skills/anti-slop-slop-canon/references/operations.md: missing ${heading} workflow`
  );
}
const operationRequirements: Record<string, string> = {
  "all code forms": "code in any form",
  "protected bytes": "legally fixed wording byte for byte",
  "meaning preservation": "Preserve meaning, factual detail, uncertainty",
  "ambiguous written routing": "Default every ambiguous case to written without asking",
  "single bundle": "Never supplement a profile with defaults",
  "clean compose output": "Return only ready-to-use content unless an explanation was requested",
  "meaningful second pass": "Preserve requested meaning, facts, uncertainty, intent, format, and protected bytes",
};
for (const [label, text] of Object.entries(operationRequirements)) {
  validation.check(operationsText.includes(text), `skills/anti-slop-slop-canon/references/operations.md: missing ${label} contract`);
}
const profileLifecycleRequirements: Record<string, string> = {
  "already-loaded mismatch detection": "Use only metadata already loaded from the router and winning profile",
  "post-task notice": "Complete the current writing task with the profile alone",
  "single notice": "`shown`, `refresh`, and `keep` suppress another notice",
  "interrupted refresh recovery": "recover its transient `refresh` state to `shown` without another notice",
  "shown-state ordering": "only after showing it",
  "minimal settings keys": "defaults_notice_version`, `defaults_notice_state`, and, only for `later`, `defaults_remind_after`",
  "settings state allowlist": "Accept only `shown`, `refresh`, `keep`, or `later`",
  "separate refresh": "Only then load current defaults alongside the profile",
  "direct edits win refresh": "including direct edits, as approved preferences over new defaults",
  "complete refresh preview": "Preview both complete files plus written and spoken examples",
  "no automatic refresh": "Never merge or write automatically",
  "refresh approval": "Require explicit approval",
  "refresh pair validation": "Stage and validate the pair before rollback-protected replacement",
  "failed refresh state recovery": "restore `defaults_notice_state: shown` for that version",
  "permanent keep": "Never notify for that defaults version again",
  "deterministic later": "exactly 14 calendar days after the choice",
  "later repeat cadence": "exactly 14 calendar days after the local date when the reminder was shown",
  "overdue reminder recovery": "Do not advance from an overdue date",
  "lifecycle scope isolation": "A project copy reads and writes project state only",
  "no mismatch regeneration": "never regenerates either generated file",
};
for (const [label, text] of Object.entries(profileLifecycleRequirements)) {
  validation.check(operationsText.includes(text), `skills/anti-slop-slop-canon/references/operations.md: missing ${label} contract`);
}
validation.check(
  operationsText.includes("only during approved onboarding, approved refresh, or an explicit regeneration request"),
  "skills/anti-slop-slop-canon/references/operations.md: personalized realtime generation boundary is required"
);
validation.check(
  operationsText.includes("Do not rewrite the profile or load defaults"),
  "skills/anti-slop-slop-canon/references/operations.md: explicit realtime regeneration must preserve single-bundle isolation"
);

const onboardingText = fs.readFileSync(ONBOARDING, "utf8");
const onboardingRequirements: Record<string, string> = {
  "one-question interview": "Ask one question per turn",
  "exact first-use choice": "personalize now, use defaults, or defer",
  "minimal defaults state": "`setup: defaults`",
  "minimal defer state": "`setup: deferred`",
  "profile-only mismatch lifecycle": "Profile mismatch lifecycle begins only after a profile exists",
  "explicit rerun": "Explicit onboarding may start or rerun at any time",
  "early samples": "Next ask for representative material early",
  "guaranteed inputs": "pasted text, Markdown, and plain-text or local text files",
  "short sample": "One short sample is enough",
  "host-native rich sources": "host-native file reading or browsing",
  "optional helpers": "`yt-dlp` or `pdftotext`",
  "helper approval": "explicit approval before any installation",
  "no provenance checks": "without authorship, ownership, identity, or provenance checks",
  "third-party abstraction": "abstract traits",
  "ephemeral analysis": "all working analysis ephemeral",
  "trait separation": "subject matter, channel formatting, quotations, borrowed language, and one-off quirks",
  "strong evidence": "Strong consistent evidence shortens the interview",
  "contradiction resolution": "Never average, choose a side, or suppress the conflict silently",
  "profile versions": "initial profile content version `1.0.0`",
  "rerun content version": "increment the existing profile content version",
  "active scope metadata": "active scope `global` or `project`",
  "profile precedence": "Non-overridable product invariants from the router",
  "invariants remain outside profile": "Product invariants constrain compilation but stay in the router",
  "profile replaces defaults": "replace defaults at runtime, not supplement them",
  "profile budget": "below 1,500 guarded units",
  "personalized realtime policy boundary":
    "Never define jobs or roles; tools, APIs, or function calls; safety or refusal policy; facts or knowledge; conversation flow, greetings, or follow-up behavior; handoff, transfer, or escalation; interruption or barge-in behavior; or orchestration or delegation",
  "complete preview": "The complete proposed `voice-profile.md`",
  "realtime preview": "The complete proposed `realtime-voice-prompt.md`",
  "written preview": "One short written example",
  "spoken preview": "One short spoken example",
  "approval paths": "approve, revise one trait, or continue the interview",
  "approval gate": "Approval must be explicit",
  "scope-safe writes": "Never write above project scope or into the installed skill directory",
  "atomic pair write": "atomically where the host supports it",
  "validate pair before replacement": "validate their metadata, scope, sections, content, and budgets before replacing either current file",
  "consistent pair write": "Otherwise replace them as one rollback-protected approval action",
  "exact retained state": "only `voice-profile.md`, `realtime-voice-prompt.md`, and minimal `settings.md`",
  "non-retention":
    "Never copy or retain raw samples, pasted text, URLs, downloads, transcripts, source lists, extraction notes, confidence data, measurements, or onboarding analysis",
};
for (const [label, text] of Object.entries(onboardingRequirements)) {
  validation.check(onboardingText.includes(text), `skills/anti-slop-slop-canon/references/onboarding.md: missing ${label} contract`);
}
const precedencePattern =
  /1\. Non-overridable product invariants from the router\.\n2\. Explicit current user answers\.\n3\. Traits consistent across supplied samples\.\n4\. Bundled defaults\./;
validation.check(
  precedencePattern.test(onboardingText),
  "skills/anti-slop-slop-canon/references/onboarding.md: profile precedence must preserve the exact ordered chain"
);
validation.check(
  onboardingText.includes("higher-precedence personal choices to replace conflicting defaults"),
  "skills/anti-slop-slop-canon/references/onboarding.md: higher-precedence rules must replace conflicting lower-precedence rules"
);

try {
  const openaiMeta = parseYAML(fs.readFileSync(OPENAI_YAML, "utf8"));
  const interfaceValue = isPlainObject(openaiMeta) ? openaiMeta["interface"] : undefined;
  validation.check(
    isPlainObject(openaiMeta) && arraysEqual(Object.keys(openaiMeta), ["interface"]),
    "skills/anti-slop-slop-canon/agents/openai.yaml: only interface metadata is expected in Phase 1"
  );
  validation.check(
    isPlainObject(interfaceValue),
    "skills/anti-slop-slop-canon/agents/openai.yaml: interface mapping is required"
  );
  if (isPlainObject(interfaceValue)) {
    validation.check(
      arraysEqual(sortedKeys(interfaceValue), ["default_prompt", "display_name", "short_description"]),
      "skills/anti-slop-slop-canon/agents/openai.yaml: interface fields do not match the generated metadata contract"
    );
    validation.check(
      Object.values(interfaceValue).every((value) => typeof value === "string"),
      "skills/anti-slop-slop-canon/agents/openai.yaml: interface values must be strings"
    );
    const shortDescriptionLength = toS(interfaceValue["short_description"]).length;
    validation.check(
      shortDescriptionLength >= 25 && shortDescriptionLength <= 64,
      "skills/anti-slop-slop-canon/agents/openai.yaml: short_description must be 25 to 64 characters"
    );
    validation.check(
      toS(interfaceValue["default_prompt"]).includes("$anti-slop-slop-canon"),
      "skills/anti-slop-slop-canon/agents/openai.yaml: default_prompt must mention $anti-slop-slop-canon"
    );
  }
} catch (e) {
  validation.check(false, `skills/anti-slop-slop-canon/agents/openai.yaml: invalid YAML (${firstLine(errorMessage(e))})`);
}

const bundleData: Record<string, Record<string, unknown>> = {};
const bundleEntries: [string, string][] = [
  [DEFAULTS, "defaults"],
  [PROFILE_TEMPLATE, "profile"],
];
for (const [bundlePath, kind] of bundleEntries) {
  const [meta, text] = validation.frontmatter(bundlePath);
  bundleData[kind] = meta;
  const requiredKeys = ["bundle_kind", "content_version", "schema_version", "scope"];
  if (kind === "profile") requiredKeys.push("defaults_version");
  validation.check(
    arraysEqual(sortedKeys(meta), [...requiredKeys].sort()),
    `${validation.relative(bundlePath)}: metadata fields must match the ${kind} contract`
  );
  validation.check(meta["bundle_kind"] === kind, `${validation.relative(bundlePath)}: bundle_kind must be ${kind}`);
  for (const field of ["schema_version", "content_version"]) {
    validation.check(
      typeof meta[field] === "string" && SEMVER.test(meta[field] as string),
      `${validation.relative(bundlePath)}: ${field} must be a quoted semantic version`
    );
  }
  if (kind === "profile") {
    validation.check(
      typeof meta["defaults_version"] === "string" && SEMVER.test(meta["defaults_version"] as string),
      `${validation.relative(bundlePath)}: defaults_version must be a quoted semantic version`
    );
    validation.check(
      ["global", "project"].includes(meta["scope"] as string),
      `${validation.relative(bundlePath)}: profile scope must be global or project`
    );
  } else {
    validation.check(meta["scope"] === "bundled", `${validation.relative(bundlePath)}: defaults scope must be bundled`);
  }
  validation.check(
    arraysEqual(headings(text), REQUIRED_BUNDLE_SECTIONS),
    `${validation.relative(bundlePath)}: required bundle sections are missing, duplicated, or out of order`
  );
  const bodies = sectionBodies(text);
  for (const section of REQUIRED_BUNDLE_SECTIONS) {
    validation.check(
      (bodies.get(section) ?? "") !== "",
      `${validation.relative(bundlePath)}: ${section} must contain guidance`
    );
  }
}

validation.check(
  bundleData["defaults"]?.["schema_version"] === bundleData["profile"]?.["schema_version"],
  "defaults and profile template must use the same schema_version"
);
validation.check(
  bundleData["profile"]?.["defaults_version"] === bundleData["defaults"]?.["content_version"],
  "profile defaults_version must match defaults content_version"
);
validation.check(
  bundleData["profile"]?.["content_version"] === "1.0.0",
  "profile template content_version must be the Phase 4 initial profile version 1.0.0"
);
validation.check(
  bundleData["defaults"]?.["schema_version"] !== bundleData["defaults"]?.["content_version"],
  "schema and default content versions must demonstrate independent lifecycles"
);
const schemaDocVersion = fs.readFileSync(SCHEMA_DOC, "utf8").match(/^Schema version: `([^`]+)`$/m)?.[1];
validation.check(
  schemaDocVersion === bundleData["defaults"]?.["schema_version"],
  "skills/anti-slop-slop-canon/references/profile-schema.md: declared schema version must match the bundles"
);
const routerDefaultVersion = skillText.match(/^Use default content version `([^`]+)`\.$/m)?.[1];
validation.check(
  routerDefaultVersion === bundleData["defaults"]?.["content_version"],
  "skills/anti-slop-slop-canon/SKILL.md: current default content version must match defaults.md"
);

const fixturePaths = fs
  .readdirSync(FIXTURE_DIR)
  .filter((f) => f.endsWith(".md"))
  .map((f) => path.join(FIXTURE_DIR, f))
  .sort();
validation.check(fixturePaths.length > 0, "evals/fixtures: at least one fixture is required");
const seenIds: string[] = [];
const seenCategories: string[] = [];
const fixtureRecords = new Map<string, [Record<string, unknown>, string]>();
for (const fixturePath of fixturePaths) {
  const [meta, text] = validation.frontmatter(fixturePath);
  const required = ["category", "expected_mutation", "id", "mode", "operation"];
  validation.check(
    arraysEqual(sortedKeys(meta), required),
    `${validation.relative(fixturePath)}: fixture metadata fields must match the documented contract`
  );
  const basename = path.basename(fixturePath, ".md");
  validation.check(meta["id"] === basename, `${validation.relative(fixturePath)}: id must match the filename`);
  validation.check(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(toS(meta["id"])),
    `${validation.relative(fixturePath)}: id must be kebab-case`
  );
  validation.check(
    !seenIds.includes(meta["id"] as string),
    `${validation.relative(fixturePath)}: duplicate fixture id ${meta["id"]}`
  );
  validation.check(
    REQUIRED_CATEGORIES.includes(meta["category"] as string),
    `${validation.relative(fixturePath)}: unknown fixture category ${meta["category"]}`
  );
  validation.check(
    ALLOWED_OPERATIONS.includes(meta["operation"] as string),
    `${validation.relative(fixturePath)}: unknown operation ${meta["operation"]}`
  );
  validation.check(
    ALLOWED_MODES.includes(meta["mode"] as string),
    `${validation.relative(fixturePath)}: unknown mode ${meta["mode"]}`
  );
  validation.check(
    meta["expected_mutation"] === true || meta["expected_mutation"] === false,
    `${validation.relative(fixturePath)}: expected_mutation must be a boolean`
  );
  validation.check(
    arraysEqual(headings(text), REQUIRED_FIXTURE_SECTIONS),
    `${validation.relative(fixturePath)}: required fixture sections are missing, duplicated, or out of order`
  );
  for (const [section, body] of sectionBodies(text)) {
    validation.check(body !== "", `${validation.relative(fixturePath)}: ${section} section must not be empty`);
  }
  seenIds.push(meta["id"] as string);
  seenCategories.push(meta["category"] as string);
  fixtureRecords.set(meta["id"] as string, [meta, text]);
}
const missingCategories = REQUIRED_CATEGORIES.filter((c) => !seenCategories.includes(c));
validation.check(missingCategories.length === 0, `evals/fixtures: missing categories ${missingCategories.join(", ")}`);

function checkPhaseFixtureContracts(phaseLabel: string, contracts: Record<string, FixtureContract>): void {
  for (const [id, contract] of Object.entries(contracts)) {
    const record = fixtureRecords.get(id);
    validation.check(record !== undefined, `evals/fixtures: missing ${phaseLabel} fixture ${id}`);
    if (!record) continue;

    const [meta, text] = record;
    const [operation, mode, mutation] = contract.metadata;
    validation.check(meta["operation"] === operation, `evals/fixtures/${id}.md: operation must be ${operation}`);
    validation.check(meta["mode"] === mode, `evals/fixtures/${id}.md: mode must be ${mode}`);
    validation.check(
      meta["expected_mutation"] === mutation,
      `evals/fixtures/${id}.md: expected_mutation must be ${mutation}`
    );
    const sections = sectionBodies(text);
    for (const [section, snippets] of Object.entries(contract)) {
      if (section === "metadata") continue;
      for (const snippet of snippets as string[]) {
        validation.check(
          (sections.get(section) ?? "").includes(snippet),
          `evals/fixtures/${id}.md: ${section} must preserve ${phaseLabel} contract ${JSON.stringify(snippet)}`
        );
      }
    }
  }
}

checkPhaseFixtureContracts("Phase 3", PHASE_3_FIXTURE_CONTRACTS);
checkPhaseFixtureContracts("Phase 4", PHASE_4_FIXTURE_CONTRACTS);
checkPhaseFixtureContracts("Phase 5", PHASE_5_FIXTURE_CONTRACTS);

const fixedRecord = fixtureRecords.get("exempt-fixed-content");
validation.check(
  fixedRecord !== undefined,
  "evals/fixtures: missing foundational protected-content fixture exempt-fixed-content"
);
if (fixedRecord) {
  const [, fixedText] = fixedRecord;
  const fixedSections = sectionBodies(fixedText);
  const protectedLiterals = [
    "Quote: “Move fast; keep the receipt — every time!”",
    'Code: `const label = "Ready: yes!";`',
    'Data: `{"status":"ready!","range":"1–3"}`',
    "Legal: Copyright (c) 2026 Example Co. All rights reserved.",
  ];
  for (const protectedLiteral of protectedLiterals) {
    validation.check(
      (fixedSections.get("Input") ?? "").includes(protectedLiteral),
      `evals/fixtures/exempt-fixed-content.md: Input must preserve protected literal ${JSON.stringify(protectedLiteral)}`
    );
  }
  validation.check(
    (fixedSections.get("Expected behavior") ?? "").includes("Preserve protected spans byte for byte"),
    "evals/fixtures/exempt-fixed-content.md: expected behavior must require byte-for-byte preservation"
  );
  validation.check(
    (fixedSections.get("Assertions") ?? "").includes("Preserve the quote, code, JSON, and legal line exactly"),
    "evals/fixtures/exempt-fixed-content.md: assertions must cover every protected form"
  );
}

const allowedRuntimeFiles = [
  "SKILL.md",
  "agents/openai.yaml",
  "assets/realtime-voice-prompt.md",
  "assets/voice-profile.template.md",
  "references/defaults.md",
  "references/onboarding.md",
  "references/operations.md",
  "references/profile-schema.md",
];
const actualRuntimeFiles = walk(SKILL_DIR, { includeDotfiles: true })
  .map((p) => path.relative(SKILL_DIR, p))
  .sort();
validation.check(
  arraysEqual(actualRuntimeFiles, [...allowedRuntimeFiles].sort()),
  "skills/anti-slop-slop-canon: unexpected runtime file; keep the skill Markdown-only except agents/openai.yaml"
);

const realtimeText = fs.readFileSync(REALTIME_PROMPT, "utf8");
const requiredRealtimeStyle = [
  "plain, conversational language",
  "no Markdown",
  "concise, pronounceable sentences",
  "first hearing",
  "Repeat a key noun",
  "Read the response aloud",
];
for (const text of requiredRealtimeStyle) {
  validation.check(
    realtimeText.includes(text),
    `skills/anti-slop-slop-canon/assets/realtime-voice-prompt.md: missing realtime style contract ${JSON.stringify(text)}`
  );
}
const forbiddenRealtimePolicy: Record<string, RegExp> = {
  job: /\bjobs?\b|\broles?\b|\bresponsibilit(?:y|ies)\b/i,
  tool: /\btools?\b|\bAPIs?\b|\bfunction calls?\b|\bbrowsers?\b|\bdatabases?\b/i,
  "safety policy": /\bsafety\b|\bpolic(?:y|ies)\b|\brefus(?:e|es|al)\b|\bdisallow(?:s|ed)?\b/i,
  facts: /\bfacts?\b|\bfactual(?:ly)?\b|\bknowledge\b|\btruth(?:ful|fully)?\b/i,
  "conversation flow": /\bconversation flow\b|\bfollow-up questions?\b|\bturn-taking\b|\bgreet(?:ing|s)?\b/i,
  handoff: /\bhandoffs?\b|\btransfer(?:s|red|ring)?\b|\bescalat(?:e|es|ed|ing|ion)\b/i,
  "interruption logic": /\binterrupt(?:ion|ions|ed|ing)?\b|\bbarge-in\b/i,
  orchestration: /\borchestrat(?:e|es|ed|ing|ion)\b|\bdelegat(?:e|es|ed|ing|ion)\b/i,
};
for (const [label, pattern] of Object.entries(forbiddenRealtimePolicy)) {
  validation.check(
    !pattern.test(realtimeText),
    `skills/anti-slop-slop-canon/assets/realtime-voice-prompt.md: realtime module must not define ${label}`
  );
}

const forbiddenParallelSources = [path.join(ROOT, "AGENTS.md"), path.join(ROOT, ".cursorrules")];
for (const forbiddenPath of forbiddenParallelSources) {
  validation.check(!fs.existsSync(forbiddenPath), `${validation.relative(forbiddenPath)}: parallel rule sources are not allowed`);
}

// Skip version-control, dependency, and build output trees. These may exist
// locally (for example when the showcase site has installed its dependencies)
// but are never part of the repository's authored, committed content.
const scaffoldMarker = /\b(?:TODO|TBD|will be implemented|placeholder)\b/i;
for (const filePath of walk(ROOT, { exts: ["md", "yml", "yaml"], includeDotfiles: false }).sort()) {
  const text = fs.readFileSync(filePath, "utf8");
  validation.check(!scaffoldMarker.test(text), `${validation.relative(filePath)}: unresolved scaffold marker`);
  for (const target of localMarkdownLinks(text)) {
    const hashIndex = target.indexOf("#");
    const cleanTarget = hashIndex === -1 ? target : target.slice(0, hashIndex);
    if (cleanTarget === "") continue;

    const resolved = path.join(path.dirname(filePath), cleanTarget);
    validation.check(fs.existsSync(resolved), `${validation.relative(filePath)}: broken local link ${target}`);
  }
}

for (const filePath of walk(ROOT, { exts: ["yml", "yaml"], includeDotfiles: false }).sort()) {
  try {
    parseYAML(fs.readFileSync(filePath, "utf8"));
  } catch (e) {
    validation.check(false, `${validation.relative(filePath)}: invalid YAML (${firstLine(errorMessage(e))})`);
  }
}

const budgets: [string, number][] = [
  [SKILL, 600],
  [DEFAULTS, 1500],
  [PROFILE_TEMPLATE, 1500],
];
for (const [budgetPath, limit] of budgets) {
  const text = fs.readFileSync(budgetPath, "utf8");
  const raw = lexicalUnits(text);
  const guarded = guardedTokens(text);
  console.log(
    `budget ${padRight(validation.relative(budgetPath), 68)} raw=${padLeft(raw, 4)} guarded=${padLeft(guarded, 4)} limit=<${limit}`
  );
  validation.check(guarded < limit, `${validation.relative(budgetPath)}: guarded context count ${guarded} must be below ${limit}`);
}

const realtimeRaw = lexicalUnits(realtimeText);
const realtimeGuarded = guardedTokens(realtimeText);
console.log(
  `budget ${padRight(validation.relative(REALTIME_PROMPT), 68)} raw=${padLeft(realtimeRaw, 4)} guarded=${padLeft(realtimeGuarded, 4)} range=250...400`
);
validation.check(
  realtimeGuarded >= 250 && realtimeGuarded <= 400,
  `skills/anti-slop-slop-canon/assets/realtime-voice-prompt.md: guarded context count ${realtimeGuarded} must be between 250 and 400`
);

if (validation.errors.length === 0) {
  console.log("PASS: repository contracts, fixtures, links, runtime contents, and context budgets");
  process.exitCode = 0;
} else {
  for (const error of validation.errors) {
    console.error(`ERROR: ${error}`);
  }
  console.error(`FAIL: ${validation.errors.length} validation error(s)`);
  process.exitCode = 1;
}
