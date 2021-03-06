import { Client, TextChannel } from "discord.js";
import { chatBoxOptions, chatInputOptions } from "./ui/components";
import { log, screen, textarea } from "blessed";
import { resolveEmojis, resolveMentions } from "./utils/resolve";
import { Cache } from "./classes/Cache";
import { ExtendedMap } from "extended-collections";
import { config } from "./config";
import { join } from "path";
import { loadFiles } from "./utils/loadFiles";
import { runCommand } from "./utils/runCommand";
import { startEventHandler } from "./utils/startEventHandler";

import type { ClientOptions } from "discord.js";
import type { Command } from "./types/Command";
import type { DiscordEvent } from "./types/DiscordEvent";
import type { Widgets } from "blessed";

const { token, defaultChannel, prefix } = config;

declare module "discord.js" {
	interface Client {
		currentChannel: TextChannel;
		currentGuild: Guild;
		components: {
			screen: Widgets.Screen;
			chatBox: Widgets.Log;
			chatInput: Widgets.TextareaElement;
		};
		lastChannel: TextChannel;
		maps: {
			events: ExtendedMap<string, DiscordEvent>;
			commands: ExtendedMap<string, Command>;
		};
		cache: Cache;
		appendToScreen(str: string): void;
	}
}

const options: ClientOptions = {};

const client = new Client(options).on("ready", () => {
	const cc = client.channels.cache.get(defaultChannel) ?? client.channels.cache.find((ch) => ch.isText());
	if (!cc || !(cc instanceof TextChannel)) {
		throw new Error("Could not find any text channels");
	}
	client.lastChannel = cc;
	client.currentChannel = cc;
	client.currentGuild = client.currentChannel.guild;
	const scr = screen({
		title: `$discli (${client.currentGuild.name})`,
		smartCSR: true
	});
	client.appendToScreen = (str) => {
		const ch = client.cache.channels.get(client.currentChannel.id);
		ch?.addText(str);
		client.components.chatBox.setContent(ch?.displayString() ?? "");
		client.components.screen.render();
	};

	const chBox = log(chatBoxOptions);
	const chInput = textarea(chatInputOptions);

	client.components = {
		screen: scr,
		chatBox: chBox,
		chatInput: chInput
	};

	client.maps = {
		commands: new ExtendedMap(),
		events: new ExtendedMap()
	};

	startEventHandler(client);
	loadFiles(client.maps.commands, join(__dirname, "commands"), client);
	client.components.chatBox.setContent(`Logged in as ${client.user!.username}`);

	client.cache = new Cache(client, 50, true);

	client.components.chatInput.key("enter", () => {
		const input = client.components.chatInput.value;
		if (!/\S+/.test(input)) return;
		client.components.chatInput.clearValue();
		if (input.startsWith(prefix)) return runCommand(input, client);
		client.currentChannel.send(resolveEmojis(resolveMentions(input, client), client));
		client.components.screen.render();
	});

	client.components.screen.key(["escape", "C-c"], () => {
		return process.exit(0);
	});

	client.components.screen.append(client.components.chatBox);
	client.components.screen.append(client.components.chatInput);

	client.components.chatInput.focus();

	client.components.screen.render();
});

client.login(token);
