import type { Client, Message } from "discord.js";
import { ExtendedMap } from "extended-collections";

export class Cache {
	cacheLimit: number;
	channels: ExtendedMap<string, CacheChannel>;
	constructor(client: Client, cacheLimit = 50, attachments = true) {
		this.cacheLimit = cacheLimit;
		const channels = client.channels.cache.map((_, key) => {
			const arr: [string, CacheChannel] = [
				key,
				new CacheChannel(cacheLimit, attachments),
			];
			return arr;
		});
		this.channels = new ExtendedMap(channels);
	}
}

export class CacheChannel {
	attachments: boolean;
	max: number;
	messages = new ExtendedMap<string, Message>();
	messageList: string[] = [];

	constructor(cacheLimit = 50, attachments = true) {
		this.max = cacheLimit;
		this.attachments = attachments;
	}

	addMessage(message: Message) {
		if (!message.content && !message.attachments.size) return;
		this.messages.set(message.id, message);
		let attachmentLinks = message.attachments.map((x) => x.proxyURL).join("\n");
		if (attachmentLinks.length) {
			attachmentLinks = "\n" + attachmentLinks;
		}
		const msgStr = message.content + (this.attachments ? attachmentLinks : "");
		this.messageList.push(`${message.author.tag}: ${msgStr}`);
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
