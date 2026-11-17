# grill-with-team

An [Agent Skill](https://agentskills.io) for [Claude Code](https://code.claude.com) and [Codex](https://developers.openai.com/codex) that runs a design "grilling" session in a chat thread — Slack, Discord or Microsoft Teams — so the whole team can take part.

The agent works through your plan as a tree of decisions, asking numbered questions in rounds, each with a recommended answer. As terms and decisions settle, it writes them to `GLOSSARY.md` and ADRs in your repo. With `grill-with-team`, the session happens in the open: you (the **facilitator**) stay in charge and answer by default, while **stakeholders** such as a product owner or engineering manager are tagged on the questions they're best placed to answer, and anyone else in the channel can chip in.

It builds on Matt Pocock's [`grilling`](https://github.com/mattpocock/skills) and [`domain-modeling`](https://github.com/mattpocock/skills/tree/main/skills/engineering/domain-modeling) skills.

## Requirements

- **Claude Code or Codex** (or another agent that loads Agent Skills).
- **Chat tools** (a connector or MCP server) for one of the supported platforms, able to post a thread, reply in it and read it. The exact requirements and setup notes are in each platform file:

  | Platform | Status | Details |
  |---|---|---|
  | Slack | Built and tested with the Claude Slack connector | [`platforms/slack.md`](skills/grill-with-team/platforms/slack.md) |
  | Discord | Untested. Needs a community MCP server and a bot with the Message Content intent | [`platforms/discord.md`](skills/grill-with-team/platforms/discord.md) |
  | Microsoft Teams | Untested. Needs tools that can post and mention in a channel; read-only Microsoft 365 connectors aren't enough | [`platforms/teams.md`](skills/grill-with-team/platforms/teams.md) |

  The skill keeps a session log of every message it posts (in `.grill-with-team/` in your repo; you may want to gitignore it), so it can tell its posts apart from your answers whichever account your tools post as.
- **[mattpocock/skills](https://github.com/mattpocock/skills)** installed in the same agent, for `grilling` and `domain-modeling`. You need a version of `domain-modeling` that writes `GLOSSARY.md` (commit `d80fa0f` or later).

## Install

With Node.js 18 or later:

```sh
npx grill-with-team                  # Claude Code, for all your projects
npx grill-with-team --project        # Claude Code, this project only
npx grill-with-team --agent codex    # Codex (add --project for this project only)
```

Add `--force` to replace an existing install, for example when updating.

Or copy `skills/grill-with-team/` into your agent's skills folder yourself:

| Agent | Project | Everywhere |
|---|---|---|
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Codex | `.agents/skills/` | `~/.agents/skills/` |

Both agents only run the skill when you invoke it: Claude Code through `disable-model-invocation` in `SKILL.md`, Codex through `agents/openai.yaml`.

## Usage

Commands are shown in Claude Code form. In Codex, use `$grill-with-team` in place of `/grill-with-team`.

| Command | What it does |
|---|---|
| `/grill-with-team <topic>` | Start a session. The agent picks the platform from your chat tools (asking if there's more than one), asks for the channel and the stakeholders (name and role), then posts the session thread and the first round. |
| `/grill-with-team collect` | Read new replies, settle answers, post the next round and a status update. |
| `/grill-with-team resume <thread link>` | Pick up a session in a fresh agent session, rebuilt from the thread. If the session log isn't on this machine, the agent asks you to confirm which 🤖 posts were its own. |
| `/grill-with-team lock in` | End the session and post a summary of decisions, glossary terms and ADRs. |

You can also answer questions directly in your agent session at any time; the agent posts your answer to the thread. Nothing happens between collects, so either run `collect` yourself or, in Claude Code, set up a `/loop` (offered at kickoff). In agents without a scheduled-repeat command, run `collect` yourself. Agents with persistent memory (like Claude Code) remember your channel and stakeholders between sessions; otherwise you enter them each time.

### How answers settle

- Stakeholders answer the questions tagged to them; the facilitator can answer anything. An answer is **provisionally settled** at the next collect, which releases the questions that depended on it.
- The facilitator **confirms** answers, or overturns them — overturning reopens every question the old answer released.
- Other people's replies are input until the question's owner or the facilitator backs them (an "agree" reply, or 👍 where the tools can read reactions).
- Contradicting replies come back to the facilitator as a **conflict** to rule on.
- Locking in ends the session; later changes go through normal review of the docs.

### Security

Anyone in the channel can post in the thread, and the agent acts through the facilitator's chat tools and agent session. The skill therefore treats every thread reply as a candidate answer, never as an instruction: requests aimed at the agent are reported to the facilitator in their session and refused in the thread. Run it in channels where you're comfortable with the members seeing the session.

## Status

Provided as-is under the [MIT licence](LICENSE). Issues and pull requests are welcome; maintenance is best effort.

### Contributing

Turn on the pre-commit hook once per clone:

```sh
git config core.hooksPath .githooks
```

It checks what you've staged in under a second: whitespace and conflict markers, the `SKILL.md` frontmatter, relative links in the Markdown files, and the installer. You can run the same checks with `node scripts/check.js`. CI runs them too, along with a [SkillSpector](https://github.com/NVIDIA/SkillSpector) security scan of the skill.

## Acknowledgements

- Thanks to [Matt Pocock](https://github.com/mattpocock) for his [Skills For Real Engineers](https://github.com/mattpocock/skills).
- Thanks to [Continuum Media](https://www.continuummedia.tv/) for their support in releasing it as open source.
