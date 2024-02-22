import { ChatInputCommandInteraction, TextChannel } from "discord.js";

import FeedConfig from "../../../database/FeedConfig";
import Feeds from "../../../utilities/Feeds";
import { NermanClient } from "../../../types";

export default {
	subCommand: "snapshot.add",

	async execute(interaction: ChatInputCommandInteraction) {
		console.log("commands/feeds/snapshot: Adding new feed.", {
			userId: interaction.user.id,
			guildId: interaction.guildId,
			channelId: interaction.channelId
		});

		const channel = interaction.channel;
		const event = interaction.options.getString("event");
		const options = {
			snapshot: {
				spaces: (await fetchPermittedSpaces(interaction))!
			}
		};

		if (!channel) {
			throw new Error("No channel.");
		}
		if (!event) {
			throw new Error("No event");
		}
		if (!options) {
			throw new Error("No options");
		}

		const eventResults = [];
		if (event === "all") {
			const results = await FeedConfig.registerAllProjectFeeds(interaction.guildId!, channel.id, "PropHouse", options);
			eventResults.push(...results);
		} else {
			const results = await FeedConfig.registerFeed(interaction.guildId!, channel.id, event, options);
			eventResults.push(results);
		}

		const resultMessage = Feeds.formatResultMessage(eventResults, channel as TextChannel);

		await interaction.reply({
			ephemeral: true,
			content: resultMessage
		});

		console.log("commands/feeds/snapshot: Finished adding new feed.", {
			userId: interaction.user.id,
			guildId: interaction.guildId,
			channelId: interaction.channelId
		});
	}
};

async function fetchPermittedSpaces(interaction: ChatInputCommandInteraction) {
	const spaceIds = interaction.options.getString("space-ids");
	if (!spaceIds) {
		return undefined;
	}

	const permittedSpaces = spaceIds.split(",").map((spaceId) => {
		return {
			id: spaceId.trim(),
			url: "https://snapshot.org/#/" + spaceId.trim()
		};
	});

	return permittedSpaces;
}
