import { underline } from "./colors";

import type { Client, GuildEmoji, Message } from "discord.js";

function resolveAttachmentLinks(message: Message, attachments = true) {
	const attachmentLinks = message.attachments.map((x) => x.proxyURL).join("\n");
	return (message.content + (attachments ? `\n${underline(attachmentLinks)}` : "")).trim();
}

function resolveMentions(input: string, client: Client<true>) {
	// resolve #channel
	input = input.replace(/#([\w-]{1,100})/g, (match, g1) => {
		const channel = client.currentGuild.channels.cache.find((x) => x.name === g1.toLowerCase());
		return channel ? `<#${channel.id}>` : match;
	});
	// resolve @username#tag
	input = input.replace(/@(.{2,32}#\d{4})/g, (match, g1) => {
		const user = client.users.cache.find((u) => u.tag === g1);
		return user ? `<@${user.id}>` : match;
	});
	// resolve @role
	input = input.replace(/@(.{1,100})/g, (match, g1) => {
		const role = client.currentGuild.roles.cache.find((r) => r.name === g1);
		return role ? `<@&${role.id}>` : match;
	});
	return input;
}

function resolveEmojis(str: string, client: Client<true>): string {
	return str.replace(/:([\w-]{2,32}):/g, (match, g1) => {
		const hasPremium = client.user.premium;

		const predicate = ({ name, animated }: GuildEmoji) => (hasPremium || !animated) && name === g1;

		const emoji = client.currentGuild.emojis.cache.find(predicate) ?? client.emojis.cache.find(predicate);

		return emoji?.toString() ?? match;
	});
}

export { resolveAttachmentLinks, resolveEmojis, resolveMentions };
