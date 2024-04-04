import { ChatInputCommandInteraction, inlineCode } from "discord.js";

import FeedConfig from "../../../database/FeedConfig";
import Feeds from "../../../utilities/Feeds";

export default {
	subCommand: "feeds.remove",

	async execute(interaction: ChatInputCommandInteraction) {
		console.log("commands/feeds/remove: Removing event configuration.", {
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

		await removeFeed(interaction, channel.id, event);

		console.log("commands/feeds/remove: Finished removing event configuration.", {
			userId: interaction.user.id,
			guildId: interaction.guildId,
			channelId: interaction.channelId
		});
	}
};

async function removeFeed(interaction: ChatInputCommandInteraction, channelId: string, event: string) {
	const eventKey = Feeds.get(event) ? event : Feeds.findKeyOfEvent(event);

	let result;
	try {
		result = await FeedConfig.deleteOne({
			guildId: interaction.guildId!,
			channelId: channelId,
			eventName: eventKey,
			isDeleted: {
				$ne: true
			}
		});
	} catch (error) {
		console.error("commands/feeds/remove: Unable to remove the feed.", {
			error: error
		});
		throw new Error("Unable to remove the feed due to a database issue.");
	}

	if (!result) {
		return interaction.reply({
			ephemeral: true,
			content: `Something's gone wrong! Sorry about that.`
		});
	}

	const eventValue = Feeds.get(eventKey)!;

	if (result.deletedCount === 0) {
		return interaction.reply({
			ephemeral: true,
			content: `${inlineCode(eventValue)} was not registered in ${inlineCode(channelId)}. Please try a different event.`
		});
	}

	await interaction.reply({
		ephemeral: true,
		content: `You have successfully removed ${inlineCode(eventValue)} events from channel ${inlineCode(channelId)}.`
	});
}
