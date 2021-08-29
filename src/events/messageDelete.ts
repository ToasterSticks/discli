import type { DiscordEvent } from "../types/DiscordEvent";
import type { Message } from "discord.js";
import { TextChannel } from "discord.js";

const event: DiscordEvent = {
	data: {
		name: "messageDelete",
		description: "remove deleted messages from cache and text box",
		event: "messageDelete"
	},
	async execute(message: Message) {
		const { channel } = message;
		if (channel instanceof TextChannel) {
			message.client.cache.channels.get(channel.id)?.removeMessage(message);
		}
	}
};

export default event;
