import { resolveMentions } from "../utils/resolveMentions";
import { Command } from "../types/Command";

const command: Command = {
	data: {
		name: "shrug",
		description: "implement /shrug from discord",
	},
	async execute(input, client) {
		client.currentChannel.send(
			`${resolveMentions(input, client)} ¯\\_(ツ)\_/¯`
		);
	},
};

export default command;
