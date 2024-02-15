import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

import Feeds from "../../../utilities/Feeds";

export default {
	data: new SlashCommandBuilder()
		.setName("nouns-nymz")
		.setDescription("Commands to add and remove NounsNymz feeds.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addSubcommand((subcommand) => {
			return subcommand
				.setName("add")
				.setDescription("Add NounsNymz events.")
				.addStringOption((option) => {
					const nounsNymzEvents = Feeds.filterByGroup("NounsNymz");
					nounsNymzEvents.unshift({
						name: "All",
						value: "all"
					});
					return option
						.setName("event")
						.setDescription("The event to register.")
						.setRequired(true)
						.addChoices(...nounsNymzEvents);
				})
				.addChannelOption((option) => {
					return option.setName("channel").setDescription("The feed channelّ.").setRequired(false);
				});
		})
		.addSubcommand((subcommand) => {
			return subcommand
				.setName("remove")
				.setDescription("Remove NounsNymz events.")
				.addStringOption((option) => {
					const nounsNymzEvents = Feeds.filterByGroup("NounsNymz");
					return option
						.setName("event")
						.setDescription("The event to remove.")
						.setRequired(true)
						.addChoices(...nounsNymzEvents);
				})
				.addChannelOption((option) => {
					return option.setName("channel").setDescription("The feed channel.").setRequired(false);
				});
		}),

	execute() {
		console.log("commands/feeds/nouns-nymz: Executed feeds command.");
	}
};
