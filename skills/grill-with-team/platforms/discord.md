# Discord

**Status:** untested. Discord has no official MCP server; use a community one whose tools cover the list below.

## Tools needed

- Send a message to a text channel, and start a thread from that message. Alternatively, create a post in a forum channel, which is a thread.
- Send a message into a thread, and read a thread's messages (by thread ID).
- List guild members and channels, to resolve IDs.
- Optional: read reactions on a message. Many Discord MCP servers can add reactions but not read them; in that case set `reactions readable: no` and use `agree` replies only.

If your tools can only work with forum posts, use a forum channel for the session.

## Posting account

Always a bot. Automating a user account breaks Discord's terms, so don't use tools that do. Because the bot is never the facilitator, every bot message in the thread that is in the session log is yours, and every message from the facilitator is their answer.

## Bot setup (for the facilitator)

- Gateway intent **Message Content** must be enabled in the Discord developer portal. Without it the bot can't read what replies say.
- **Server Members** intent, to resolve stakeholders by name.
- Channel permissions: View Channel, Send Messages, Create Public Threads, Send Messages in Threads, Read Message History, Add Reactions.

## Thread

- Text channel: post the root message, then start a thread from it named `Grilling: <topic>`. The thread's ID is the same as the root message's ID. Post everything else in the thread.
- Forum channel: create a post titled `Grilling: <topic>` whose first message is the root message. The post's ID is the thread ID.
- Log both the `channel` (parent) and `thread` IDs in the session log header.
- Message ID: the message's snowflake ID.

## Mentions

`<@USERID>`, e.g. `<@123456789012345678>`. Channels are `<#CHANNELID>`.

## Formatting

- Markdown: `**bold**` works as in POSTS.md. Discord does not render tables: put the status table in a code block (```` ``` ````), padded into aligned columns.
- Length limit: 2,000 characters per message. Rounds will often need splitting; split between questions.

## Links

Message links look like `https://discord.com/channels/<guild ID>/<channel or thread ID>/<message ID>`. A link to the thread itself is `https://discord.com/channels/<guild ID>/<thread ID>`.
