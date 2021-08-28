import type { Client, Message } from "discord.js";
import { ExtendedMap } from "extended-collections";
import { resolveAttachmentLinks } from "../utils/resolve";

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
		this.messageList.push(this.formatMessage(message));
		if (this.messages.size > this.max) {
			const firstKey = this.messages.at(0)?.[0];
			if (!firstKey) return this.messages.size;
			this.messages.delete(firstKey);
			this.messageList.shift();
		}
	}

	removeMessage(message: Message) {
		this.messages.delete(message.id);
		this.messageList = this.newMessageList();
		if (message.channelId === message.client.currentChannel.id) {
			message.client.components.chatBox.setContent(this.displayString());
			message.client.components.chatBox.render();
		}
	}

	editMessage(message: Message) {
		this.messages.update(message.id, () => message);
		this.messageList = this.newMessageList();
		if (message.channelId === message.client.currentChannel.id) {
			message.client.components.chatBox.setContent(this.displayString());
			message.client.components.chatBox.render();
		}
	}

	newMessageList() {
		return [...this.messages.values()].map(this.formatMessage, this);
	}

	addText(str: string) {
		this.messageList.shift();
		this.messageList.push(str);
	}

	displayString() {
		return this.messageList.join("\n");
	}

	formatMessage(message: Message) {
		const msgStr =
			resolveAttachmentLinks(message, this.attachments) +
			(message.editedTimestamp ? " (edited)" : "");
		return `${message.author.tag}: ${msgStr}`;
	}
}
