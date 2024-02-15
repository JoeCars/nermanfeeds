import { ChatInputCommandInteraction, TextChannel } from "discord.js";

import FeedConfig from "../../../database/FeedConfig";
import Feeds from "../../../utilities/Feeds";

export default {
	subCommand: "nouns-nymz.add",

	async execute(interaction: ChatInputCommandInteraction) {
		console.log("commands/feeds/nouns-nymz: Adding new feed.", {
			userId: interaction.user.id,
			guildId: interaction.guildId,
			channelId: interaction.channelId
		});

		const channel = interaction.options.getChannel("channel") ?? interaction.channel;
		const event = interaction.options.getString("event");

		if (!channel) {
			throw new Error("No channel.");
		}
		if (!event) {
			throw new Error("No event");
		}

		const eventResults = [];
		if (event === "all") {
			const results = await FeedConfig.registerAllProjectFeeds(interaction.guildId!, channel.id, "NounsNymz");
			eventResults.push(...results);
		} else {
			const results = await FeedConfig.registerFeed(interaction.guildId!, channel.id, event);
			eventResults.push(results);
		}

		const resultMessage = Feeds.formatResultMessage(eventResults, channel as TextChannel);

		await interaction.reply({
			ephemeral: true,
			content: resultMessage
		});

		console.log("commands/feeds/nouns-nymz: Finished adding new feed.", {
			userId: interaction.user.id,
			guildId: interaction.guildId,
			channelId: interaction.channelId
		});
	}
};
