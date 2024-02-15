import { ChatInputCommandInteraction, inlineCode } from "discord.js";

import FeedConfig from "../../../database/FeedConfig";

export default {
	subCommand: "feeds.remove-all",

	async execute(interaction: ChatInputCommandInteraction) {
		console.log("commands/feeds/remove-all: Removing all feeds.", {
			userId: interaction.user.id,
			guildId: interaction.guildId,
			channelId: interaction.channelId
		});

		const channel = interaction.options.getChannel("channel") ?? interaction.channel;

		if (!channel) {
			throw new Error("Could not retrieve channel for removal.");
		}

		await removeAllFeeds(interaction, channel.id);

		console.log("commands/feeds/remove-all: Finished removing all feeds.", {
			userId: interaction.user.id,
			guildId: interaction.guildId,
			channelId: interaction.channelId
		});
	}
};

async function removeAllFeeds(interaction: ChatInputCommandInteraction, channelId: string) {
	let result;
	try {
		result = await FeedConfig.deleteMany({
			guildId: interaction.guildId,
			channelId: channelId,
			isDeleted: {
				$ne: true
			}
		});
	} catch (error) {
		console.error("commands/feeds/remove: Unable to remove the feeds.", {
			error: error
		});
		throw new Error("Unable to remove feeds due to a database issue.");
	}

	if (!result) {
		return interaction.reply({
			ephemeral: true,
			content: `Something's gone wrong! Sorry about that.`
		});
	}

	await interaction.reply({
		ephemeral: true,
		content: `You have successfully removed ${inlineCode(result.deletedCount.toString())} events from channel ${inlineCode(
			channelId
		)}.`
	});
}
