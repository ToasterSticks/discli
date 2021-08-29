import type { Client, ClientEvents } from "discord.js";
import type { DiscordEvent } from "../types/DiscordEvent";
import { ExtendedMap } from "extended-collections";
import { join } from "path";

import { loadFiles } from "./loadFiles";

async function startEventHandler(client: Client<true>): Promise<ExtendedMap<string, DiscordEvent>> {
	const { events } = client.maps;
	await loadFiles(events, join(__dirname, "..", "events"), client);

	const onEvents = new ExtendedMap<keyof ClientEvents, DiscordEvent[]>();
	const onceEvents = new ExtendedMap<keyof ClientEvents, DiscordEvent[]>();

	for (const [, eventFile] of events) {
		const { data } = eventFile;
		if (data.once) {
			const vals = onceEvents.get(data.event);
			if (!vals) {
				onceEvents.set(data.event, [eventFile]);
			} else {
				vals.push(eventFile);
			}
		} else {
			const vals = onEvents.get(data.event);
			if (!vals) {
				onEvents.set(data.event, [eventFile]);
			} else {
				vals.push(eventFile);
			}
		}
	}

	for (const [event, val] of onEvents) {
		client.on(event, (...params) => {
			for (const dEvent of val) {
				// @ts-expect-error Types being weird
				dEvent.execute(...params);
			}
		});
	}

	for (const [event, val] of onceEvents) {
		client.once(event, (...params) => {
			for (const dEvent of val) {
				// @ts-expect-error Types being weird 2: Electric boogaloo
				dEvent.execute(...params);
			}
		});
	}

	return events;
}

export { startEventHandler };
