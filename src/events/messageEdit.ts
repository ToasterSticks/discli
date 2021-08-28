import { Message, TextChannel } from "discord.js";
import { DiscordEvent } from "../types/DiscordEvent";

const event: DiscordEvent = {
	data: {
		name: "messageEdit",
		description: "remove deleted messages from cache and text box",
		event: "messageUpdate",
	},
	async execute(_: Message, message: Message) {
		const { channel } = message;
		if (channel instanceof TextChannel) {
			message.client.cache.channels.get(channel.id)?.editMessage(message);
		}
	},
};

export default event;
