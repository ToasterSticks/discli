import type { Channel } from "discord.js";
import { TextChannel } from "discord.js";

import type { Command } from "../types/Command";

const command: Command = {
	data: {
		name: "channel",
		description: "Change current channel",
		usage: `
			- {{prefix}}channel [Server Name] [channel-name]
			- {{prefix}}channel [channel-id]
		`
	},
	async execute(input, client) {
		let channel;
		// A single channel id as param
		if (/^\d{17,19}$/.test(input)) {
			channel = client.channels.cache.get(input);
			// {prefix}channel guild name channel-name
		} else if (/^.+ #?\S+$/.test(input)) {
			const match = /^(?<guildName>.+) #?(?<channelName>\S+)$/.exec(input);
			if (match) {
				const guildName = match.groups?.guildName ?? "";
				const guild = client.guilds.cache.find((g) => g.name === guildName);
				if (!guild) {
					client.appendToScreen(`discli: Invalid server ${guildName}`);
					return;
				}
				channel = guild.channels.cache.find(
					(c): c is TextChannel => c.name === match.groups?.channelName && c instanceof TextChannel
				);
			}
		} else {
			client.appendToScreen("discli: Invalid arguments");
		}
		if (!(channel instanceof TextChannel)) {
			client.appendToScreen("discli: Invalid channel");
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
