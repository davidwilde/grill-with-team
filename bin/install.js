#!/usr/bin/env node
// Copies the grill-with-team skill into an agent's skills folder.

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const SKILL = "grill-with-team";
const source = path.join(__dirname, "..", "skills", SKILL);

const usage = `Usage: npx ${SKILL} [--agent claude|codex] [--project] [--force]

Installs the ${SKILL} skill.

  --agent claude   Claude Code (default): ~/.claude/skills/
  --agent codex    Codex: ~/.agents/skills/
  --project        Install into the current project (.claude/skills/ or
                   .agents/skills/) instead of your home folder
  --force          Replace an existing install
  --help           Show this message`;

const args = process.argv.slice(2);
let agent = "claude";
let project = false;
let force = false;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === "--help" || arg === "-h") {
    console.log(usage);
    process.exit(0);
  } else if (arg === "--agent") {
    agent = args[++i];
  } else if (arg.startsWith("--agent=")) {
    agent = arg.slice("--agent=".length);
  } else if (arg === "--project") {
    project = true;
  } else if (arg === "--force") {
    force = true;
  } else {
    console.error(`Unknown option: ${arg}\n\n${usage}`);
    process.exit(1);
  }
}

const folders = { claude: ".claude", codex: ".agents" };
if (!folders[agent]) {
  console.error(`Unknown agent: ${agent}. Use "claude" or "codex".`);
  process.exit(1);
}

const base = project ? process.cwd() : os.homedir();
const target = path.join(base, folders[agent], "skills", SKILL);

if (fs.existsSync(target)) {
  if (!force) {
    console.error(`${target} already exists. Re-run with --force to replace it.`);
    process.exit(1);
  }
  fs.rmSync(target, { recursive: true, force: true });
}

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.cpSync(source, target, { recursive: true });

const invoke = agent === "codex" ? `$${SKILL}` : `/${SKILL}`;
console.log(`Installed ${SKILL} to ${target}`);
console.log(`Start a session with: ${invoke} <topic>`);
console.log(
  "It also needs the grilling and domain-modeling skills from https://github.com/mattpocock/skills"
);
