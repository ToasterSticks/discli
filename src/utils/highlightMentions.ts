import { blue, bold, hex } from "chalk";

import type { Message } from "discord.js";

export function highlightMentions([match, g1, id]: [string, string, string], message: Message) {
	const type = getMentionType(g1)!;

	const isMentioned = message.mentions.has(message.client.user!);

	switch (type) {
		case "user": {
			return isMentioned && id === message.client.user!.id ? bold(blue(match)) : blue(match);
		}
		case "role": {
			const role = message.guild!.roles.cache.get(id);

			if (!role) return match;

			const roleColor = role.color ? role.hexColor : "#d3d3d3";
			return isMentioned && message.member!.roles.cache.has(id) ? bold(hex(roleColor)(match)) : hex(roleColor)(match);
		}
		case "channel": {
			if (message.guild!.channels.cache.has(id)) return blue(match);
			return match;
		}
	}
}

function getMentionType(type: string) {
	switch (type) {
		case "@":
		case "@!": {
			return "user";
		}
		case "@&": {
			return "role";
		}
		case "#": {
			return "channel";
		}
	}
}
