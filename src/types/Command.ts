import type { Client } from "discord.js";

export interface Command {
	data: {
		name: string;
		description: string;
		usage: string;
	};
	execute(input: string, client: Client): Promise<void>;
}
