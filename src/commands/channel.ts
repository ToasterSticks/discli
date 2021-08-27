import { Client, TextChannel } from "discord.js";
import { Command } from "../types/Command";

const command: Command = {
	data: {
		name: "channel",
		description: "Change current channel",
	},
	async execute(input, client: Client) {
		let channel;
		// A single channel id as param
		if (/^\d{17,19}$/.test(input)) {
			channel = client.channels.cache.get(input);
			// {prefix}channel guild name channel-name
		} else if (/^.+ #?\S+$/.test(input)) {
			const match = /^(?<guildName>.+) #?(?<channelName>\S+)$/.exec(input);
			if (match) {
				const guildName = match.groups?.guildName;
				const guild = client.guilds.cache.find((g) => g.name === guildName!);
				if (!guild) {
					client.appendToScreen(`discli: Invalid server ${guildName}`);
					return;
				}
				channel = guild.channels.cache.find(
					(c) => c.name === match.groups?.channelName!
				);
			}
		} else {
			client.appendToScreen("discli: Invalid arguments");
		}
		if (!channel) {
			client.appendToScreen("discli: Invalid channel");
			return;
		}
		if (!(channel instanceof TextChannel)) {
			client.appendToScreen("discli: You can only use text channels");
			return;
		}
		const ch = client.cache.channels.get(channel.id);
		if (!ch) return;
		client.currentChannel = channel;
		client.currentGuild = channel.guild;
		client.components.chatBox.setContent(ch.displayString());
		client.appendToScreen(`discli: joined #${channel.name}`)
		client.components.screen.render();
	},
};

export default command;
