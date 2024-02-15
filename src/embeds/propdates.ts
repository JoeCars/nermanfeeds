import { EmbedBuilder, inlineCode } from "discord.js";

import { MAX_REASON_LENGTH, MAX_TITLE_LENGTH } from "../constants";
import { Events } from "../types";

export function generatePostUpdateEmbed(data: Events.PropdatesPostUpdate) {
	let title = `Propdate | ${data.proposalTitle}`;
	if (title.length > MAX_TITLE_LENGTH) {
		title = title.substring(0, MAX_TITLE_LENGTH).trim() + "...";
	}

	const url = `https://propdates.wtf/prop/${data.propId}`;

	let status = "IN PROGRESS";
	if (data.isCompleted) {
		status = "COMPLETE";
	}
	status = inlineCode(status);

	let update = data.update;
	if (update.length > MAX_REASON_LENGTH) {
		update = update.substring(0, MAX_REASON_LENGTH).trim();
		update += "...";
	}

	const description = `Current Status: ${status}\n\n${update}`;

	return new EmbedBuilder().setColor("#00FFFF").setTitle(title).setDescription(description).setURL(url);
}
