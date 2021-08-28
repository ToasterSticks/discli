import { Message, TextChannel } from "discord.js";
import { DiscordEvent } from "../types/DiscordEvent";

const event: DiscordEvent = {
	data: {
		name: "messageDelete",
		description: "remove deleted messages from cache and text box",
		event: "messageDelete",
	},
	async execute(message: Message) {
		const { channel } = message;
		if (channel instanceof TextChannel) {
			message.client.cache.channels.get(channel.id)?.removeMessage(message);
		}
	},
};

export default event;
