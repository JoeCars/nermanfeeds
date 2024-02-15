import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

import Feeds from "../../../utilities/Feeds";

export default {
	data: new SlashCommandBuilder()
		.setName("nouns-fork")
		.setDescription("Commands to add and remove NounsFork feeds.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addSubcommand((subcommand) => {
			return subcommand
				.setName("add")
				.setDescription("Add NounsFork events.")
				.addStringOption((option) => {
					const nounsForkEvents = Feeds.filterByGroup("NounsFork");
					nounsForkEvents.unshift({
						name: "All",
						value: "all"
					});
					return option
						.setName("event")
						.setDescription("The event to register.")
						.setRequired(true)
						.addChoices(...nounsForkEvents);
				})
				.addChannelOption((option) => {
					return option.setName("channel").setDescription("The feed channelّ.").setRequired(false);
				});
		})
		.addSubcommand((subcommand) => {
			return subcommand
				.setName("remove")
				.setDescription("Remove NounsFork events.")
				.addStringOption((option) => {
					const nounsForkEvents = Feeds.filterByGroup("NounsFork");
					return option
						.setName("event")
						.setDescription("The event to remove.")
						.setRequired(true)
						.addChoices(...nounsForkEvents);
				})
				.addChannelOption((option) => {
					return option.setName("channel").setDescription("The feed channel.").setRequired(false);
				});
		}),

	execute() {
		console.log("commands/feeds/nouns-fork: Executed feeds command.");
	}
};
