import { resolveEmojis } from "#src";
import { Command } from "../types/Command";
import { resolveMentions } from "../utils/resolveMentions";

const command: Command = {
	data: {
		name: "shrug",
		description: "implement /shrug from discord",
	},
	async execute(input, client) {
		client.currentChannel.send(
			`${resolveEmojis(resolveMentions(input, client))} ¯\\_(ツ)\_/¯`
		);
	},
};

export default command;
