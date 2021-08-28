import { Client } from "discord.js";

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

export { resolveMentions };
