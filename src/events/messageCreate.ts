import { Message } from "discord.js";
import { DiscordEvent } from "../types/DiscordEvent";

const event: DiscordEvent = {
	data: {
		name: "message",
		description: "Recieve messages from discord and update sreen",
		event: "messageCreate",
	},
	async execute(message: Message) {
		const { client } = message;
		const ch = client.cache.channels.get(message.channelId);
		if (!ch) return;
		ch.addMessage(message);
		if (message.channelId !== client.currentChannel.id) return;
		client.components.chatBox.setContent(ch.displayString());
		client.components.screen.render();
	},
};

export default event;
