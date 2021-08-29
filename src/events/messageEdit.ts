import type { DiscordEvent } from "../types/DiscordEvent";
import type { Message } from "discord.js";
import { TextChannel } from "discord.js";

const event: DiscordEvent = {
	data: {
		name: "messageEdit",
		description: "remove deleted messages from cache and text box",
		event: "messageUpdate"
	},
	async execute(_: Message, message: Message) {
		const { channel } = message;
		if (channel instanceof TextChannel) {
			message.client.cache.channels.get(channel.id)?.editMessage(message);
		}
	}
};

export default event;
