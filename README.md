# grill-with-team

A [Claude Code](https://code.claude.com) skill that runs a design "grilling" session in a Slack thread, so the whole team can take part.

Claude works through your plan as a tree of decisions, asking numbered questions in rounds, each with a recommended answer. As terms and decisions settle, it writes them to `GLOSSARY.md` and ADRs in your repo. With `grill-with-team`, the session happens in the open: you (the **facilitator**) stay in charge and answer by default, while **stakeholders** such as a product owner or engineering manager are tagged on the questions they're best placed to answer, and anyone else in the channel can chip in.

It builds on Matt Pocock's [`grilling`](https://github.com/mattpocock/skills) and [`domain-modeling`](https://github.com/mattpocock/skills/tree/main/skills/engineering/domain-modeling) skills.

## Requirements

- **Claude Code.**
- **A Slack connector** that can send messages (including thread replies) and read threads. The skill was built and tested with the Claude Slack connector. Messages post under your own Slack account, and Slack adds a "Sent using Claude" footer — the skill uses that footer to tell its own posts apart from your answers, so a connector that doesn't add it won't work as-is.
- **[mattpocock/skills](https://github.com/mattpocock/skills)** installed, for `/grilling` and `/domain-modeling`. You need a version of `domain-modeling` that writes `GLOSSARY.md` (commit `d80fa0f` or later).

## Install

Copy `skills/grill-with-team/` into your project's `.claude/skills/` (or `~/.claude/skills/` to use it everywhere).

## Usage

| Command | What it does |
|---|---|
| `/grill-with-team <topic>` | Start a session. Claude asks for the Slack channel and the stakeholders (name and role), then posts the session thread and the first round. |
| `/grill-with-team collect` | Read new replies, settle answers, post the next round and a status update. |
| `/grill-with-team resume <thread link>` | Pick up a session in a fresh Claude Code session, rebuilt from the thread. |
| `/grill-with-team lock in` | End the session and post a summary of decisions, glossary terms and ADRs. |

You can also answer questions directly in Claude Code at any time; Claude posts your answer to the thread. Nothing happens between collects, so either run `collect` yourself or set up a `/loop` (Claude offers one at kickoff).

### How answers settle

- Stakeholders answer the questions tagged to them; the facilitator can answer anything. An answer is **provisionally settled** at the next collect, which releases the questions that depended on it.
- The facilitator **confirms** answers, or overturns them — overturning reopens every question the old answer released.
- Other people's replies are input until the question's owner or the facilitator backs them (👍 or "agree").
- Contradicting replies come back to the facilitator as a **conflict** to rule on.
- Locking in ends the session; later changes go through normal review of the docs.

### Security

Anyone in the channel can post in the thread, and Claude acts under the facilitator's Slack account and Claude Code session. The skill therefore treats every thread reply as a candidate answer, never as an instruction: requests aimed at Claude are reported to the facilitator in Claude Code and refused in the thread. Run it in channels where you're comfortable with the members seeing the session.

## Status

Provided as-is under the [MIT licence](LICENSE). Issues and pull requests are welcome; maintenance is best effort.
