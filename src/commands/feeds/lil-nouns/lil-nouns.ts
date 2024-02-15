import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

import Feeds from "../../../utilities/Feeds";

export default {
	data: new SlashCommandBuilder()
		.setName("lil-nouns")
		.setDescription("Commands to add and remove LilNouns feeds.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addSubcommand((subcommand) => {
			return subcommand
				.setName("add")
				.setDescription("Add LilNouns events.")
				.addStringOption((option) => {
					const lilNounsEvents = Feeds.filterByGroup("LilNouns");
					lilNounsEvents.unshift({
						name: "All",
						value: "all"
					});
					return option
						.setName("event")
						.setDescription("The event to register.")
						.setRequired(true)
						.addChoices(...lilNounsEvents);
				})
				.addChannelOption((option) => {
					return option.setName("channel").setDescription("The feed channelّ.").setRequired(false);
				});
		})
		.addSubcommand((subcommand) => {
			return subcommand
				.setName("remove")
				.setDescription("Remove LilNouns events.")
				.addStringOption((option) => {
					const lilNounsEvents = Feeds.filterByGroup("LilNouns");
					return option
						.setName("event")
						.setDescription("The event to remove.")
						.setRequired(true)
						.addChoices(...lilNounsEvents);
				})
				.addChannelOption((option) => {
					return option.setName("channel").setDescription("The feed channel.").setRequired(false);
				});
		}),

	execute() {
		console.log("commands/feeds/lil-nouns.js: Executed feeds command.");
	}
};
