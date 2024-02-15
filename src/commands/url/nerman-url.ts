import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("nerman-url")
		.setDescription("Commands to add, remove, and display the guild URLs.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addSubcommand((subcommand) => {
			return subcommand
				.setName("add")
				.setDescription("Register a new set of URLs for this guild.")
				.addStringOption((option) => {
					return option
						.setName("proposal-url")
						.setDescription("The URL for all future proposals.")
						.addChoices(
							{ name: "nouns.wtf", value: "https://nouns.wtf/vote/" },
							{
								name: "nounsagora.com",
								value: "https://nounsagora.com/proposals/"
							},
							{
								name: "lilnouns.wtf/nounsdao",
								value: "https://lilnouns.wtf/vote/nounsdao/"
							}
						)
						.setRequired(false);
				});
		})
		.addSubcommand((subcommand) => {
			return subcommand.setName("remove").setDescription("Removing the URLs registered to this guild.");
		})
		.addSubcommand((subcommand) => {
			return subcommand.setName("display").setDescription("Displaying the URLs registered to this guild.");
		}),

	execute() {
		console.log("commands/nermanUrl: Executed Nerman URL command.");
	}
};
