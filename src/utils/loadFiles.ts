import { join } from "path";
import { readdir } from "fs/promises";

import type { Client } from "discord.js";
import type { Command } from "../types/Command";
import type { DiscordEvent } from "../types/DiscordEvent";
import type { ExtendedMap } from "extended-collections";

type handledTypes = DiscordEvent | Command;

async function loadFiles<T extends handledTypes>(
	collection: ExtendedMap<string, T>,
	path: string,
	client: Client
): Promise<void> {
	const files = await readdir(path, { withFileTypes: true });
	for (const element of files) {
		if (element.isFile() && element.name.endsWith(".js")) {
			const imp: { default: T } = await import(join(path, element.name));
			collection.set(imp.default.data.name, imp.default);
		} else if (element.isDirectory()) {
			await loadFiles(collection, join(path, element.name), client);
		}
	}
}

export { loadFiles };
