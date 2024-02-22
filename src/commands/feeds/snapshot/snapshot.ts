import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

import Feeds from "../../../utilities/Feeds";

export default {
	data: new SlashCommandBuilder()
		.setName("snapshot")
		.setDescription("Commands to add and remove Snapshot feeds.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addSubcommand((subcommand) => {
			return subcommand
				.setName("add")
				.setDescription("Add Snapshot events.")
				.addStringOption((option) => {
					const snapshotEvents = Feeds.filterByGroup("Snapshot");
					snapshotEvents.unshift({
						name: "All",
						value: "all"
					});
					return option
						.setName("event")
						.setDescription("The event to register.")
						.setRequired(true)
						.addChoices(...snapshotEvents);
				})
				.addStringOption((option) => {
					return option.setName("space-ids").setDescription("Permitted Space events.").setRequired(false);
				});
		})
		.addSubcommand((subcommand) => {
			return subcommand
				.setName("remove")
				.setDescription("Remove Snapshot events.")
				.addStringOption((option) => {
					const snapshotEvents = Feeds.filterByGroup("Snapshot");
					return option
						.setName("event")
						.setDescription("The event to remove.")
						.setRequired(true)
						.addChoices(...snapshotEvents);
				});
		})
		.addSubcommand((subcommand) => {
			return subcommand
				.setName("add-spaces")
				.setDescription("Begin listening to a new space.")
				.addStringOption((option) => {
					return option.setName("space-ids").setDescription("New Spaces to listen to.").setRequired(true);
				});
		})
		.addSubcommand((subcommand) => {
			return subcommand.setName("display-spaces").setDescription("List of all spaces listened to.");
		}),

	execute() {
		console.log("commands/feeds/snapshot: Executed feeds command.");
	}
};
