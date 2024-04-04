import { ChatInputCommandInteraction } from "discord.js";

import UrlConfig from "../../database/UrlConfig";

export default {
	subCommand: "nerman-url.remove",

	async execute(interaction: ChatInputCommandInteraction) {
		console.log("commands/url/remove: Removing URL config.", {
			guildId: interaction.guildId,
			channelId: interaction.channelId,
			userId: interaction.user.id
		});

		let oldConfig;
		try {
			oldConfig = await UrlConfig.findOne({
				guildId: interaction.guildId!
			}).exec();
		} catch (error) {
			console.error("commands/url/remove: Unable to find config due to an error.", {
				error: error
			});
			throw new Error("Unable to remove the URL config due to a database error.");
		}

		if (!oldConfig) {
			return interaction.reply({
				content: "This guild did not have any registered URL configs, so nothing was removed.",
				ephemeral: true
			});
		}

		try {
			await UrlConfig.findOneAndDelete({
				_id: oldConfig._id,
				guildId: oldConfig.guildId
			}).exec();
		} catch (error) {
			console.error("commands/url/remove: Unable to remove the config due to an error.", {
				error: error
			});
			throw new Error("Unable to remove the URL config due to a database error.");
		}

		await interaction.reply({
			content: "Successfully removed this guild's URL config.",
			ephemeral: true
		});

		console.log("commands/url/remove: Finished removing URL config.", {
			guildId: interaction.guildId,
			channelId: interaction.channelId,
			userId: interaction.user.id
		});
	}
};
