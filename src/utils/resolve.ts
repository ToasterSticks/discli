import { underline } from "chalk";
import { Client, GuildEmoji, Message } from "discord.js";

function resolveAttachmentLinks(message: Message, attachments = true) {
	const attachmentLinks = message.attachments.map((x) => x.proxyURL).join("\n");
	return (message.content + (attachments ? underline(attachmentLinks) : '')).trim();
}

function resolveMentions(input: string, client: Client) {
	// resolve #channel
	input = input.replace(/#([\w-]+)/g, (match, g1) => {
		const channel = client.currentGuild.channels.cache.find(
			(x) => x.name === g1.toLowerCase()
		);
		if (!channel) return match;
		return `<#${channel.id}>`;
	});
	// resolve @username#tag
	input = input.replace(/@(.+?#\d{4})/g, (match, g1) => {
		const user = client.users.cache.find((u) => u.tag === g1);
		if (!user) return match;
		return `<@${user.id}>`;
	});
	return input;
}

function resolveEmojis(str: string, client: Client): string {
	return str.replace(/:([\w-]{2,32}):/g, (match, g1) => {
		const hasPremium = client.user!.premium;

		const predicate = ({ name, animated }: GuildEmoji) =>
			(hasPremium || !animated) && name === g1;

		const emoji =
			client.currentGuild.emojis.cache.find(predicate) ?? hasPremium
				? client.emojis.cache.find(predicate)
				: null;

		return emoji?.toString() ?? match;
	});
}

export { resolveAttachmentLinks, resolveEmojis, resolveMentions };
