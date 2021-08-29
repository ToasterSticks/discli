import { Client, TextChannel } from 'discord.js';
import { Command } from '../types/Command';

const command: Command = {
	data: {
		name: 'back',
		description: 'Go back to previous channel',
	},
	async execute(input, client: Client) {
		const channel = client.lastChannel;
		if (channel.id === client.currentChannel.id) {
			client.appendToScreen('discli: You are already in this channel');
			return;
		}
		if (channel.deleted) {
			client.appendToScreen('discli: Your previous channel was deleted');
			return;
		}
		if (!(channel instanceof TextChannel)) {
			client.appendToScreen('discli: You can only use text channels');
			return;
		}
		const ch = client.cache.channels.get(channel.id);
		if (!ch) return;
		client.lastChannel = client.currentChannel;
		client.currentChannel = channel;
		client.currentGuild = channel.guild;
		client.components.chatBox.setContent(ch.displayString());
		client.appendToScreen(`discli: joined #${channel.name}`);
		client.components.screen.title = `discli (${client.currentGuild.name})`;
		client.components.screen.render();

		const messages = await client.currentChannel.messages.search({ sortOrder: 'asc' });

		for (const message of messages.values()) client.emit('messageCreate', message);
	},
};

export default command;
