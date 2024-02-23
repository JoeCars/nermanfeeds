import { ChatInputCommandInteraction, TextChannel, inlineCode } from "discord.js";

import FeedConfig from "../../../database/FeedConfig";
import { NermanClient } from "../../../types";
import SnapshotSpace from "../../../database/SnapshotSpace";
import { Types } from "mongoose";

export default {
	subCommand: "snapshot.add-spaces",

	async execute(interaction: ChatInputCommandInteraction) {
		console.log("commands/feeds/snapshot: Adding new spaces.", {
			userId: interaction.user.id,
			guildId: interaction.guildId,
			channelId: interaction.channelId
		});

		const channel = interaction.channel;
		const spaceIdsOptions = interaction.options.getString("space-ids");

		if (!channel) {
			throw new Error("No channel.");
		}
		if (!spaceIdsOptions) {
			throw new Error("No space ids.");
		}

		const spaceIds = spaceIdsOptions.split(",").map((spaceId) => spaceId.trim());
		const snapshot = (interaction.client as NermanClient).libraries.snapshot;

		// Optimize the below to only do the I/O once on the whole list.
		for (const spaceId of spaceIds) {
			const isAlreadyListenedTo = snapshot.spaceIds.includes(spaceId);
			if (!isAlreadyListenedTo) {
				snapshot.addSpace(spaceId);

				SnapshotSpace.create({
					_id: new Types.ObjectId(),
					spaceId: spaceId
				})
					.then(() => {
						console.log("commands/feeds/snapshot: Registered new snapshot space.", {
							spaceId
						});
					})
					.catch((error: any) => {
						console.error("commands/feeds/snapshot: Unable to register new snapshot space.", {
							spaceId,
							error
						});
					});
			}

			const feeds = await FeedConfig.find({
				channelId: channel.id,
				guildId: interaction.guildId,
				eventName: { $regex: /snapshot/, $options: "i" } // Finds all snapshot events.
			}).exec();

			feeds.forEach((feed) => {
				feed.options?.snapshot?.spaces.push({ id: spaceId, url: "https://snapshot.org/#/" + spaceId });
				feed.save();
			});
		}

		const body = spaceIds.map((spaceId) => inlineCode(spaceId)).join(", ") + " added";
		await interaction.reply({
			ephemeral: true,
			content: body
		});

		console.log("commands/feeds/snapshot: Finished adding new spaces.", {
			userId: interaction.user.id,
			guildId: interaction.guildId,
			channelId: interaction.channelId
		});
	}
};
