import type { Client, Message } from "discord.js";
import { ExtendedMap } from "extended-collections";
import { resolveAttachmentLinks } from "../utils/resolve";

export class Cache {
	private readonly cacheLimit: number;
	public channels: ExtendedMap<string, CacheChannel>;
	public constructor(client: Client, cacheLimit = 50, attachments = true) {
		this.cacheLimit = cacheLimit;
		const channels = client.channels.cache.map((_, key) => {
			const arr: [string, CacheChannel] = [key, new CacheChannel(this.cacheLimit, attachments)];
			return arr;
		});
		this.channels = new ExtendedMap(channels);
	}
}

export class CacheChannel {
	private readonly attachments: boolean;
	private readonly max: number;
	public messages = new ExtendedMap<string, Message>();
	public messageList: string[] = [];

	public constructor(cacheLimit = 50, attachments = true) {
		this.max = cacheLimit;
		this.attachments = attachments;
	}

	public addMessage(message: Message) {
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

	public removeMessage(message: Message) {
		this.messages.delete(message.id);
		this.messageList = this.newMessageList();
		if (message.channelId === message.client.currentChannel.id) {
			message.client.components.chatBox.setContent(this.displayString());
			message.client.components.chatBox.render();
		}
	}

	public editMessage(message: Message) {
		try {
			this.messages.update(message.id, () => message);
		} catch {}
		this.messageList = this.newMessageList();
		if (message.channelId === message.client.currentChannel.id) {
			message.client.components.chatBox.setContent(this.displayString());
			message.client.components.chatBox.render();
		}
	}

	public newMessageList() {
		return [...this.messages.values()].map(this.formatMessage, this);
	}

	public addText(str: string) {
		this.messageList.shift();
		this.messageList.push(str);
	}

	public displayString() {
		return this.messageList.join("\n");
	}

	private formatMessage(message: Message) {
		const msgStr = resolveAttachmentLinks(message, this.attachments) + (message.editedTimestamp ? " (edited)" : "");
		return `${message.author.tag}: ${msgStr}`;
	}
}
