import type { Command } from "../types/Command";

const command: Command = {
	data: {
		name: "memory",
		description: "display memory usage",
		usage: `
- {{prefix}}memory
`
	},
	async execute(_, client) {
		client.appendToScreen(`Memory usage: ${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}M`);
	}
};

export default command;
