import { ChatInputCommandInteraction, inlineCode, hyperlink } from "discord.js";

import FeedConfig, { IFeedConfig } from "../../../database/FeedConfig";
import Feeds from "../../../utilities/Feeds";

export default {
	subCommand: "feeds.display",

	async execute(interaction: ChatInputCommandInteraction) {
		console.log("commands/feeds/display: Displaying feeds.", {
			userId: interaction.user.id,
			guildId: interaction.guildId,
			channelId: interaction.channelId
		});

		const channel = interaction.options.getChannel("channel") ?? interaction.channel;
		if (!channel) {
			throw new Error("No channel.");
		}

		// Grabbing configuration.
		let feedConfigs;
		try {
			feedConfigs = await FeedConfig.findFeedsInChannel(interaction.guildId!, channel.id);
		} catch (error) {
			console.error("commands/feeds/remove: Unable to find the feed.", {
				error: error
			});
			throw new Error("Unable to find feeds.");
		}

		await interaction.reply({
			ephemeral: true,
			content: generateFeedDisplay(feedConfigs)
		});

		console.log("commands/feeds/display: Finished displaying feeds.", {
			userId: interaction.user.id,
			guildId: interaction.guildId,
			channelId: interaction.channelId
		});
	}
};

function generateFeedDisplay(feedConfigs: IFeedConfig[]) {
	if (feedConfigs.length === 0) {
		return "This channel has no feed configurations.";
	}

	return feedConfigs
		.map((config) => {
			let output = "- " + inlineCode(Feeds.get(config.eventName)!);

			if (config.options?.snapshot?.spaces.length! > 0) {
				output +=
					" (" + config.options?.snapshot?.spaces.map((space) => hyperlink(space.id, space.url)).join(", ") + ")";
			}

			return output;
		})
		.join("\n");
}
