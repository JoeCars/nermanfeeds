import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

import Feeds from "../../../utilities/Feeds";

export default {
	data: new SlashCommandBuilder()
		.setName("prophouse")
		.setDescription("Commands to add and remove PropHouse feeds.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addSubcommand((subcommand) => {
			return subcommand
				.setName("add")
				.setDescription("Add PropHouse events.")
				.addStringOption((option) => {
					const propHouseEvents = Feeds.filterByGroup("PropHouse");
					propHouseEvents.unshift({
						name: "All",
						value: "all"
					});
					return option
						.setName("event")
						.setDescription("The event to register.")
						.setRequired(true)
						.addChoices(...propHouseEvents);
				})
				.addStringOption((option) => {
					return option.setName("house-addresses").setDescription("Permitted House events.").setRequired(false);
				})
				.addChannelOption((option) => {
					return option.setName("channel").setDescription("The feed channelّ.").setRequired(false);
				});
		})
		.addSubcommand((subcommand) => {
			return subcommand
				.setName("remove")
				.setDescription("Remove PropHouse events.")
				.addStringOption((option) => {
					const propHouseEvents = Feeds.filterByGroup("PropHouse");
					return option
						.setName("event")
						.setDescription("The event to remove.")
						.setRequired(true)
						.addChoices(...propHouseEvents);
				})
				.addChannelOption((option) => {
					return option.setName("channel").setDescription("The feed channel.").setRequired(false);
				});
		}),

	execute() {
		console.log("commands/feeds/prophouse: Executed feeds command.");
	}
};
