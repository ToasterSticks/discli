import { Command } from "../types/Command";

const command: Command = {
	data: {
		name: "shrug",
		description: "implement /shrug from discord"
	},
	async execute(input, client) {
		client.currentChannel.send(`${input} ¯\\_(ツ)\_/¯`)
	}
}

export default command;
