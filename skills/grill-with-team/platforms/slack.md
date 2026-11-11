# Slack

**Status:** built and tested with the Claude Slack connector.

## Tools needed

- Send a message to a channel, and send a reply in a thread (by the root message's `ts`).
- Read a thread's replies.
- Look up users and channels by name, to resolve IDs.
- Optional: read reactions on a message. Without it, set `reactions readable: no` and use `agree` replies only.

## Posting account

The Claude Slack connector posts as the facilitator's own account and adds Slack's "Sent using Claude" footer. Other Slack tools (e.g. an MCP server with a bot token) may post as a bot user. Record whichever it is in the session log.

## Thread

- The root message is a normal channel message. Its `ts` identifies the thread; every other post is a reply with `thread_ts` set to it.
- Message ID: the message's `ts` (e.g. `1731312000.123456`).

## Mentions

`<@USERID>`, e.g. `<@U012AB3CD>`. Channels are `C…` IDs.

## Formatting

- With the Claude Slack connector, write markdown as shown in POSTS.md, including the status table. With tools that send raw Slack mrkdwn, write bold as `*bold*` and put the status table in a code block.
- Length limit: keep each post under 5,000 characters.

## Links

Thread links look like `https://<workspace>.slack.com/archives/<channel ID>/p<ts without the dot>`, sometimes with `?thread_ts=<ts>&cid=<channel ID>`. Put the dot back six digits from the end to get the `ts`.

## Resume without a session log

With the Claude Slack connector, your posts carry the "Sent using Claude" footer. Use it to shortlist the candidates you show the facilitator, but still have them confirm. The footer alone is not proof.
