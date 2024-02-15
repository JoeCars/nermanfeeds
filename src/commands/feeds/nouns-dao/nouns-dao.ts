import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

import Feeds from "../../../utilities/Feeds";

export default {
	data: new SlashCommandBuilder()
		.setName("nouns-dao")
		.setDescription("Commands to add and remove Nouns feeds.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addSubcommand((subcommand) => {
			return subcommand
				.setName("add")
				.setDescription("Add Nouns events.")
				.addStringOption((option) => {
					const nounsEvents = Feeds.filterByGroup("Nouns");
					nounsEvents.unshift({
						name: "All",
						value: "all"
					});
					return option
						.setName("event")
						.setDescription("The event to register.")
						.setRequired(true)
						.addChoices(...nounsEvents);
				})
				.addChannelOption((option) => {
					return option.setName("channel").setDescription("The feed channelّ.").setRequired(false);
				});
		})
		.addSubcommand((subcommand) => {
			return subcommand
				.setName("remove")
				.setDescription("Remove Nouns events.")
				.addStringOption((option) => {
					const nounsEvents = Feeds.filterByGroup("Nouns");
					return option
						.setName("event")
						.setDescription("The event to remove.")
						.setRequired(true)
						.addChoices(...nounsEvents);
				})
				.addChannelOption((option) => {
					return option.setName("channel").setDescription("The feed channel.").setRequired(false);
				});
		}),

	execute() {
		console.log("commands/feeds/nouns-dao: Executed feeds command.");
	}
};
