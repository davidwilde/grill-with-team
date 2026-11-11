# Microsoft Teams

**Status:** untested. Teams sessions run in a team **channel** (not a group chat), where a channel post and its replies form the thread.

## Tools needed

- Start a new channel post, and reply to a post.
- Read a post's replies.
- List team members, to resolve stakeholders.
- Mention users in a way that notifies them (see [Mentions](#mentions)).
- Optional: read reactions on a message. If not available, set `reactions readable: no` and use `agree` replies only.

Read-only Microsoft 365 connectors (search and read channel messages, but can't post) are not enough. Some Teams MCP servers are configured for a single team and channel; if so, the session's channel is whichever one the server is set up for, so tell the facilitator that at kickoff instead of asking.

## Posting account

Depends on the tools. Servers built on an app registration or bot post as the app; servers using delegated Microsoft Graph access post as the facilitator. Record whichever it is in the session log.

## Thread

- The root message is a new channel post with subject `Grilling: <topic>`. Its message ID identifies the thread; every other post is a reply to it.
- Message ID: the message's ID from the tools (a numeric string). Record the team ID and channel ID (`19:…@thread.tacv2`) in the session log header.

## Mentions

Teams mentions aren't plain text: a mention needs an `<at>` tag in the message body plus a matching mention entity carrying the user's ID. Use your tools' mention support for every `{@…}` in POSTS.md. A typed `@Name` doesn't notify anyone. If your tools can't mention, stop at kickoff: stakeholders wouldn't hear about their questions.

User IDs are Microsoft Entra object IDs (GUIDs).

## Formatting

- If your tools send HTML, use `<b>` for bold and an HTML `<table>` for the status table. If they send markdown, `**bold**` works; put the status table in a code block if tables don't render.
- Length limit: Teams allows about 28 KB per message including markup. Keep each post under 10,000 characters to stay well clear.

## Links

Links to a post look like `https://teams.microsoft.com/l/message/<channel ID>/<message ID>?tenantId=…&groupId=<team ID>&parentMessageId=<root message ID>&…`. The channel ID is URL-encoded. If `parentMessageId` is present, it is the root message; otherwise the message ID is.
