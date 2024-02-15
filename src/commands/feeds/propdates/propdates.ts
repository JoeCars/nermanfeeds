import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

import Feeds from "../../../utilities/Feeds";

export default {
	data: new SlashCommandBuilder()
		.setName("propdates")
		.setDescription("Commands to add and remove Propdates feeds.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addSubcommand((subcommand) => {
			return subcommand
				.setName("add")
				.setDescription("Add Propdates events.")
				.addStringOption((option) => {
					const propdatesEvents = Feeds.filterByGroup("Propdates");
					propdatesEvents.unshift({
						name: "All",
						value: "all"
					});
					return option
						.setName("event")
						.setDescription("The event to register.")
						.setRequired(true)
						.addChoices(...propdatesEvents);
				})
				.addChannelOption((option) => {
					return option.setName("channel").setDescription("The feed channelّ.").setRequired(false);
				});
		})
		.addSubcommand((subcommand) => {
			return subcommand
				.setName("remove")
				.setDescription("Remove Propdates events.")
				.addStringOption((option) => {
					const propdatesEvents = Feeds.filterByGroup("Propdates");
					return option
						.setName("event")
						.setDescription("The event to remove.")
						.setRequired(true)
						.addChoices(...propdatesEvents);
				})
				.addChannelOption((option) => {
					return option.setName("channel").setDescription("The feed channel.").setRequired(false);
				});
		}),

	execute() {
		console.log("commands/feeds/propdates: Executed feeds command.");
	}
};
