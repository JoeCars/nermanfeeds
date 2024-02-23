import { NermanClient, Events } from "../types";
import * as embeds from "../embeds/snapshot";
import FeedConfig from "../database/FeedConfig";

export default async function listenToSnapshotEvents(client: NermanClient) {
	const { snapshot, router, ensCache } = client.libraries;

	snapshot.on("ProposalCreated", async (data) => {
		console.log("listeners/snapshot: On ProposalCreated.", {
			...data
		});

		const authorName = await ensCache.fetchName(data.author.id);

		const embedData: Events.SnapshotProposal = {
			...data,
			author: { ...data.author, name: authorName }
		};

		console.log("listeners/snapshot: ProposalCreated embed data.", { ...embedData });
		router.forEachFeedChannel("snapshot-proposal-created", async (channel) => {
			try {
				const feedConfig = await FeedConfig.findOne({
					channelId: channel.id,
					guildId: channel.guildId,
					eventName: "snapshot-proposal-created"
				}).exec();
				if (!feedConfig?.includesSpace(embedData.space.id)) {
					return;
				}
			} catch (error) {
				console.error("listeners/snapshot: Unable to retrieve FeedConfig for Snapshot.", error);
			}

			const embed = embeds.generateProposalCreatedEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	snapshot.on("ProposalCompleted", async (data) => {
		console.log("listeners/snapshot: On ProposalCompleted.", {
			...data
		});

		const authorName = await ensCache.fetchName(data.author.id);

		const embedData: Events.SnapshotProposal = {
			...data,
			author: { ...data.author, name: authorName }
		};

		console.log("listeners/snapshot: ProposalCompleted embed data.", { ...embedData });
		router.forEachFeedChannel("snapshot-proposal-completed", async (channel) => {
			try {
				const feedConfig = await FeedConfig.findOne({
					channelId: channel.id,
					guildId: channel.guildId,
					eventName: "snapshot-proposal-completed"
				}).exec();
				if (!feedConfig?.includesSpace(embedData.space.id)) {
					return;
				}
			} catch (error) {
				console.error("listeners/snapshot: Unable to retrieve FeedConfig for Snapshot.", error);
			}

			const embed = embeds.generateProposalCompletedEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	snapshot.on("VoteCast", async (data) => {
		console.log("listeners/snapshot: On VoteCast.", { ...data });

		const voterName = await ensCache.fetchName(data.voter.id);

		const embedData: Events.SnapshotVote = {
			...data,
			voter: { ...data.voter, name: voterName }
		};

		console.log("listeners/snapshot: VoteCast embed data.", { ...embedData });
		router.forEachFeedChannel("snapshot-vote-cast", async (channel) => {
			try {
				const feedConfig = await FeedConfig.findOne({
					channelId: channel.id,
					guildId: channel.guildId,
					eventName: "snapshot-vote-cast"
				}).exec();
				if (!feedConfig?.includesSpace(embedData.space.id)) {
					return;
				}
			} catch (error) {
				console.error("listeners/snapshot: Unable to retrieve FeedConfig for Snapshot.", error);
			}

			const embed = embeds.generateVoteCastEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});
}
