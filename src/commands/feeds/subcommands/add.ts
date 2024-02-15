import { ChatInputCommandInteraction, inlineCode } from "discord.js";

import FeedConfig from "../../../database/FeedConfig";
import Feeds from "../../../utilities/Feeds";

export default {
	subCommand: "feeds.add",

	async execute(interaction: ChatInputCommandInteraction) {
		console.log("commands/feeds/add: Adding new event configuration.", {
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

		const eventKey = Feeds.findKeyOfEvent(event);

		const result = await FeedConfig.registerFeed(interaction.guildId!, channel.id, eventKey);

		if (result.isDuplicate) {
			return interaction.reply({
				ephemeral: true,
				content: "This event is already registered to this channel."
			});
		} else {
			return interaction.reply({
				ephemeral: true,
				content: `You have successfully registered the ${inlineCode(event)} event to channel ${inlineCode(channel.id)}.`
			});
		}
	}
};
