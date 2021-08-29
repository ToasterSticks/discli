import { Command } from "../types/Command";

const command: Command = {
	data: {
		name: "memory",
		description: "display memory usage",
	},
	async execute(_, client) {
		client.appendToScreen(
			`Memory usage: ${Math.round(
				process.memoryUsage().heapTotal / 1024 / 1024
			)}mb`
		);
	},
};

export default command;
