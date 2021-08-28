import { Client, GuildEmoji } from "discord.js";

export function resolveEmojis(str: string, client: Client): string {
	return str.replace(/:([\w-]{2,32}):/g, (match, g1) => {
		const hasPremium = client.user!.premium;

		const predicate = ({ name, animated }: GuildEmoji) =>
			(hasPremium ? true : !animated) && name === g1;

		const emoji =
			client.currentGuild.emojis.cache.find(predicate) ?? hasPremium
				? client.emojis.cache.find(predicate)
				: null;

		return emoji?.toString() ?? match;
	});
}
