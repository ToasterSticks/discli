import { config } from "../config";
import { Command } from "../types/Command";

const command: Command = {
	data: {
		name: "help",
		description: "show description and usage of commands",
		usage: `
- {{prefix}}help
- {{prefix}}help [command name]
		`,
	},
	async execute(input, client) {
		const command = client.maps.commands.get(input);
		if (!command) {
			client.appendToScreen("discli: invalid Command");
		} else {
			const { name, description, usage } = command.data;
			client.appendToScreen(`${config.prefix}${name}: ${description}\nusage:\n${usage.replaceAll("{{prefix}}", config.prefix).trim()}`);
		}
	}
};

export default command;
