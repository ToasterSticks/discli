import { Client } from "discord.js";
import { config } from "../config";

export function runCommand(input: string, client: Client) {
	const commandArgs = input.slice(config.prefix.length).trim().split(/ +/);
	const command = client.maps.commands.get(commandArgs.shift() as string);
	if (!command){
		client.appendToScreen("discli: Invalid command");
		client.components.chatInput.clearValue();
		return;
	}
	command.execute(commandArgs.join(" "), client);
}
