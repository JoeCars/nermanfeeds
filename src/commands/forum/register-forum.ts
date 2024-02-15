import { ChannelType, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { ObjectId } from "mongodb";

import Forum from "../../database/Forum";

export default {
	data: new SlashCommandBuilder()
		.setName("register-forum")
		.setDescription("Register a forum.")
		.addChannelOption((option) => {
			return option
				.setName("forum-channel")
				.setDescription("The channel designated as a forum.")
				.addChannelTypes(ChannelType.GuildForum)
				.setRequired(true);
		})
		.addStringOption((option) => {
			return option
				.setName("forum-type")
				.setDescription("The type of forum which determines the events it will receive.")
				.setChoices(
					{ value: "NounsCandidateProposal", name: "NounsCandidateProposal" },
					{ value: "NounsProposal", name: "NounsProposal" }
				)
				.setRequired(true);
		})
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

	async execute(interaction: ChatInputCommandInteraction) {
		const forumChannel = interaction.options.getChannel("forum-channel");
		const forumType = interaction.options.getString("forum-type");

		if (!forumChannel) {
			throw new Error("No channel provided!");
		}
		if (!forumType) {
			throw new Error("No forum type provided!");
		}

		let forum = undefined;
		try {
			forum = await Forum.create({
				_id: new ObjectId(),
				guildId: interaction.guildId,
				channelId: forumChannel.id,
				forumType: forumType
			});
		} catch (error) {
			console.error("commands/forum/register-nouns-candidate-proposal-forum: Received error.", {
				error: error,
				guildId: interaction.guildId,
				channelId: forumChannel.id
			});
			throw new Error("Unable to register proposal candidate forum due to a database error!");
		}

		interaction.reply({
			content: `Successfully registered proposal candidate forum.`,
			ephemeral: true
		});
	}
};
