import { EmbedBuilder, hyperlink } from "discord.js";

import { Events } from "../types";
import { MAX_REASON_LENGTH } from "../constants";

export function generateNounsCastEmbed(data: Events.NounsCast) {
	const title = "Farcaster | New Nouns Cast!";

	const url = `https://warpcast.com/${data.author}/${data.event.hash}`;
	const author = hyperlink(data.author, `https://warpcast.com/${data.author}`);

	if (data.text.length > MAX_REASON_LENGTH) {
		data.text = data.text.substring(0, MAX_REASON_LENGTH).trim() + "...";
	}

	const description = data.text + `\n\n— ${author}`;

	return new EmbedBuilder().setColor("#00FFFF").setTitle(title).setDescription(description).setURL(url);
}
