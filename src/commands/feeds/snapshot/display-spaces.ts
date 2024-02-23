import { ChatInputCommandInteraction, hyperlink } from "discord.js";

import FeedConfig from "../../../database/FeedConfig";
import { NermanClient } from "../../../types";
import SnapshotSpace from "../../../database/SnapshotSpace";
import { Types } from "mongoose";

export default {
	subCommand: "snapshot.display-spaces",

	async execute(interaction: ChatInputCommandInteraction) {
		console.log("commands/feeds/snapshot: Displaying spaces.", {
			userId: interaction.user.id,
			guildId: interaction.guildId,
			channelId: interaction.channelId
		});

		const channel = interaction.channel;

		if (!channel) {
			throw new Error("No channel.");
		}

		const spaces = await SnapshotSpace.find().exec();

		let output = spaces.length <= 0 ? "Not listening to any Spaces! Trying adding one!" : "";
		for (const space of spaces) {
			output += `- ${hyperlink(space.spaceId, "https://snapshot.org/#/" + space.spaceId)}\n`;
		}

		await interaction.reply({
			ephemeral: true,
			content: output
		});

		console.log("commands/feeds/snapshot: Finished displaying spaces.", {
			userId: interaction.user.id,
			guildId: interaction.guildId,
			channelId: interaction.channelId
		});
	}
};
