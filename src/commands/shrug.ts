import { resolveEmojis, resolveMentions } from "../utils/resolve";
import type { Command } from "../types/Command";

const command: Command = {
	data: {
		name: "shrug",
		description: "implement /shrug from discord",
		usage: `
			- {{prefix}}shrug
			- {{prefix}}shrug message
	`
	},
	async execute(input, client) {
		client.currentChannel.send(`${resolveEmojis(resolveMentions(input, client), client)} ¯\\_(ツ)\_/¯`);
	}
};

export default command;
