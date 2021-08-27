import type { Client, Message } from "discord.js";
import { ExtendedMap } from "extended-collections";

export class Cache {
	channels: ExtendedMap<string, CacheChannel>;
	constructor(client: Client) {
		const channels = client.channels.cache.map((_, key) => {
			const arr: [string, CacheChannel] = [key, new CacheChannel()];
			return arr;
		});
			this.channels = new ExtendedMap(channels);
	}
}

export class CacheChannel {
	max: number;
	messages = new ExtendedMap<string, Message>();
	messageList: string[] = [];

	constructor(num = 50) {
		this.max = num;
	}

	addMessage(message: Message) {
		if (!message.content) return;
		this.messages.set(message.id, message);
		this.messageList.push(`${message.author.tag}: ${message.content}`);
		if (this.messages.size > this.max) {
			const firstKey = this.messages.at(0)?.[0];
			if (!firstKey) return this.messages.size;
			this.messages.delete(firstKey);
			this.messageList.shift();
		}
	}

	addText(str: string) {
		this.messageList.shift();
		this.messageList.push(str);
	}
	
	displayString() {
		return this.messageList.join("\n");
	}
}
