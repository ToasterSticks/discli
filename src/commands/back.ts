import type { Command } from "../types/Command";

const command: Command = {
	data: {
		name: "back",
		description: "Go back to the previous channel",
		usage: `
			- {{prefix}}back
		`
	},
	async execute(input, client) {
		const channel = client.lastChannel;
		if (channel.id === client.currentChannel.id) {
			client.appendToScreen("discli: You are already in this channel");
			return;
		}
		if (channel.deleted) {
			client.appendToScreen("discli: Your previous channel was deleted");
			return;
		}
		const ch = client.cache.channels.get(channel.id);
		if (!ch) return;
		client.lastChannel = client.currentChannel;
		client.currentChannel = channel;
		client.currentGuild = channel.guild;
		client.components.chatBox.setContent(ch.displayString());
		client.components.screen.title = `discli (${client.currentGuild.name})`;
		client.appendToScreen(`discli: joined #${channel.name}`);
	}
};

export default command;
