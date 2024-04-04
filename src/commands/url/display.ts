import { ChatInputCommandInteraction, codeBlock } from "discord.js";

import UrlConfig from "../../database/UrlConfig";

export default {
	subCommand: "nerman-url.display",

	async execute(interaction: ChatInputCommandInteraction) {
		console.log("commands/url/display: Displaying guild URLs.", {
			guildId: interaction.guildId,
			channelId: interaction.channelId,
			userId: interaction.user.id
		});

		let config;
		try {
			config = await UrlConfig.findOne({
				guildId: interaction.guildId!
			}).exec();
		} catch (error) {
			console.error("commands/url/display: Unable to display config due to a database issue.", {
				error: error
			});
			throw new Error("Unable to display the guild URLs due to a database issue.");
		}

		if (!config) {
			await interaction.reply({
				content: codeBlock("This guild has no URL configuration."),
				ephemeral: true
			});
		} else {
			const response = `Proposal URL: ${config.proposalUrl}`;
			await interaction.reply({
				content: codeBlock(response),
				ephemeral: true
			});
		}

		console.log("commands/url/display: Finished displaying guild URLs.", {
			guildId: interaction.guildId,
			channelId: interaction.channelId,
			userId: interaction.user.id
		});
	}
};
