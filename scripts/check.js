#!/usr/bin/env node
// Fast repo checks, run by the pre-commit hook and in CI.
// Usage: node scripts/check.js [repo root]   (defaults to the current folder)

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(process.argv[2] || ".");
const SKILL = "grill-with-team";
const skillDir = path.join(root, "skills", SKILL);
const errors = [];
const fail = (msg) => errors.push(msg);
const rel = (p) => path.relative(root, p);

// SKILL.md frontmatter, against the Agent Skills spec (agentskills.io).
function checkFrontmatter() {
  const file = path.join(skillDir, "SKILL.md");
  const text = fs.readFileSync(file, "utf8");
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return fail(`${rel(file)}: no frontmatter block`);

  const fields = {};
  for (const line of match[1].split("\n")) {
    const m = line.match(/^([\w-]+):\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (/^(["']).*\1$/.test(value)) value = value.slice(1, -1);
    fields[m[1]] = value;
  }

  const { name, description } = fields;
  if (!name) fail(`${rel(file)}: missing name`);
  else {
    if (name !== SKILL) fail(`${rel(file)}: name "${name}" doesn't match folder "${SKILL}"`);
    if (name.length > 64) fail(`${rel(file)}: name is over 64 characters`);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name))
      fail(`${rel(file)}: name must be lowercase letters, digits and single hyphens`);
  }
  if (!description) fail(`${rel(file)}: missing description`);
  else if (description.length > 1024)
    fail(`${rel(file)}: description is ${description.length} characters (max 1024)`);
}

// Relative links in Markdown files point at files that exist.
function markdownFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith(".") || entry.name === "node_modules") return [];
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(full);
    return entry.name.endsWith(".md") ? [full] : [];
  });
}

function checkLinks() {
  for (const file of markdownFiles(root)) {
    const text = fs
      .readFileSync(file, "utf8")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`[^`\n]*`/g, "");
    for (const [, target] of text.matchAll(/\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g)) {
      if (/^([a-z][a-z0-9+.-]*:|#)/i.test(target)) continue;
      const filePart = decodeURIComponent(target.split("#")[0]);
      if (!fs.existsSync(path.resolve(path.dirname(file), filePart)))
        fail(`${rel(file)}: broken link to ${target}`);
    }
  }
}

// package.json parses and the installer is valid JavaScript.
function checkPackage() {
  try {
    JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  } catch (e) {
    fail(`package.json: ${e.message}`);
  }
  const syntax = spawnSync(process.execPath, ["--check", path.join(root, "bin", "install.js")], {
    encoding: "utf8",
  });
  if (syntax.status !== 0) fail(`bin/install.js: ${syntax.stderr.trim()}`);
}

// The installer copies the skill for each agent and refuses to overwrite.
function checkInstaller() {
  const installer = path.join(root, "bin", "install.js");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "gwt-check-"));
  const run = (args, cwd = tmp) =>
    spawnSync(process.execPath, [installer, ...args], {
      cwd,
      env: { ...process.env, HOME: tmp, USERPROFILE: tmp },
      encoding: "utf8",
    });
  const expect = (cond, msg) => cond || fail(`installer: ${msg}`);
  const installed = (...p) => fs.existsSync(path.join(tmp, ...p, "skills", SKILL, "SKILL.md"));

  try {
    expect(run([]).status === 0 && installed(".claude"), "default install failed");
    expect(run([]).status !== 0, "second install without --force should fail");
    expect(run(["--force"]).status === 0, "--force install failed");
    expect(run(["--agent", "codex"]).status === 0 && installed(".agents"), "codex install failed");
    const project = fs.mkdtempSync(path.join(tmp, "project-"));
    expect(
      run(["--project"], project).status === 0 && installed(path.basename(project), ".claude"),
      "--project install failed"
    );
    expect(run(["--agent", "nope"]).status !== 0, "unknown agent should fail");
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

checkFrontmatter();
checkLinks();
checkPackage();
checkInstaller();

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join("\n"));
  process.exit(1);
}
console.log("✓ checks passed");
