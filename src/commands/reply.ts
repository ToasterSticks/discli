import { resolveEmojis, resolveMentions } from "../utils/resolve";
import type { Command } from "../types/Command";
import { TextChannel } from "discord.js";

const command: Command = {
	data: {
		name: "reply",
		description: "reply to a message by id",
		usage: `
- {{prefix}}reply [message-id] message # defaults to no mention
- {{prefix}}reply [message-reference] message # the message number of the message from the bottom
- {{prefix}}reply [message-id|message-reference] message --mention # reply with mention
		`
	},
	async execute(input, client) {
		let content: string;
		let id: string;
		let mention = false;
		if (/^\d{17-19}/.test(input)) {
			const match = /^(?<id>\d{17-19}) (?<content>.+)}/.exec(input);
			content = match?.groups?.content ?? "";
			id = match?.groups?.id ?? "";
		} else if (/^\d+/.test(input)) {
			const match = /^(?<id>\d+) (?<content>.+)/.exec(input);
			content = match?.groups?.content ?? "";
			id = match?.groups?.id ?? "";
			id = client.cache.channels.get(client.currentChannel.id)!.messages.at(-parseInt(id, 10))?.[1]?.id ?? id;
		} else {
			client.appendToScreen("discli: Invalid command usage");
			return;
		}
		if (content.includes("--mention")) mention = true;
		content = content.replace("--mention", "");
		if (!content || !id) {
			client.appendToScreen("discli: Missing message content");
			return;
		}
		const ch = client.channels.cache.get(client.currentChannel.id);
		if (!ch || !(ch instanceof TextChannel)) {
			return;
		}
		const message = client.cache.channels.get(client.currentChannel.id)?.messages.get(id) ?? ch.messages.cache.get(id);
		if (!message) {
			client.appendToScreen("discli: Could not find message");
			return;
		}
		message.reply({
			content: resolveEmojis(resolveMentions(content, client), client),
			allowedMentions: { repliedUser: mention }
		});
	}
};

export default command;
