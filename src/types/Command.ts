import { Client } from "discord.js";

export interface Command {
	data: {
		name: string;
		description?: string;
	};
	execute(input: string, client: Client): Promise<void>;
}
