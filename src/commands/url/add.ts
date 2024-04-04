import { ChatInputCommandInteraction } from "discord.js";
import { Types } from "mongoose";

import UrlConfig from "../../database/UrlConfig";

export default {
	subCommand: "nerman-url.add",

	async execute(interaction: ChatInputCommandInteraction) {
		console.log("commands/url/add: Adding URLs to this guild.", {
			guildId: interaction.guildId,
			channelId: interaction.channelId,
			userId: interaction.user.id
		});

		let urlConfig;
		try {
			urlConfig = await UrlConfig.findOne({
				guildId: interaction.guildId!
			}).exec();
		} catch (error) {
			console.error("commands/url/add: Unable to retrieve UrlConfig due to a database issue.", {
				error: error
			});
			throw new Error("Unable to register UrlConfig due to a database issue.");
		}

		if (urlConfig) {
			return interaction.reply({
				content:
					"Unable to register URLs for this guild, because it already has registered URLs.\nPlease remove the current URLs before trying to add new ones.",
				ephemeral: true
			});
		}

		const proposalUrl = interaction.options.getString("proposal-url") ?? undefined;

		let newConfig;
		try {
			newConfig = await UrlConfig.create({
				_id: new Types.ObjectId(),
				guildId: interaction.guildId,
				proposalUrl: proposalUrl
			});
		} catch (error) {
			console.error("commands/url/add: Unable to register UrlConfig due to a database issue.", {
				error: error
			});
			throw new Error("Unable to register UrlConfig due to a database issue.");
		}

		await interaction.reply({
			content: "Successfully registered URLs to this guild.",
			ephemeral: true
		});

		console.log("commands/url/add: Finished adding URLs to this guild.", {
			guildId: interaction.guildId,
			channelId: interaction.channelId,
			userId: interaction.user.id,
			proposalUrl: newConfig.proposalUrl
		});
	}
};
