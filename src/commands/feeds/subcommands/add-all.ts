import { ChatInputCommandInteraction, inlineCode } from "discord.js";

import FeedConfig from "../../../database/FeedConfig";
import Feeds from "../../../utilities/Feeds";

export default {
	subCommand: "feeds.add-all",

	async execute(interaction: ChatInputCommandInteraction) {
		console.log("commands/feeds/add-all: Adding all feeds.", {
			userId: interaction.user.id,
			guildId: interaction.guildId,
			channelId: interaction.channelId
		});

		const channel = interaction.options.getChannel("channel") ?? interaction.channel;

		if (!channel) {
			throw new Error("No channel.");
		}

		await addAllFeeds(interaction, channel.id);

		console.log("commands/feeds/add-all: Finished adding all feeds.", {
			userId: interaction.user.id,
			guildId: interaction.guildId,
			channelId: interaction.channelId
		});
	}
};

async function addAllFeeds(interaction: ChatInputCommandInteraction, channelId: string) {
	const eventErrors = [];
	let numOfSuccesses = 0;

	// Inserting events.
	for (const [eventKey, eventValue] of Feeds.getAllEntries()) {
		const eventGroup = eventValue.split(".")[0];

		// Polls require a poll channel, so keeping these event in would only cause errors.
		if (eventGroup === "Poll") {
			continue;
		}

		try {
			await FeedConfig.tryAddFeed(interaction.guildId!, channelId, eventKey);
			numOfSuccesses++;
		} catch (error) {
			console.error("commands/feeds/add-all: Unable to add feed.", {
				error: error,
				event: eventValue,
				channelId: channelId,
				guildId: interaction.guildId
			});
			eventErrors.push(eventValue);
		}
	}

	// Dealing with success.
	if (eventErrors.length === 0) {
		return interaction.reply({
			ephemeral: true,
			content: `Successfully added ${inlineCode(numOfSuccesses.toString())} events!`
		});
	}

	// Dealing with failure.
	let responseBody = `Unable to add ${inlineCode(eventErrors.length.toString())} events.`;
	for (const eventName of eventErrors) {
		responseBody += `\n- ${inlineCode(eventName)}`;
	}
	responseBody += "\nPlease try again.";

	await interaction.reply({
		ephemeral: true,
		content: responseBody
	});
}
