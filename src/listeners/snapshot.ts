import { NermanClient, Events } from "../types";
import * as embeds from "../embeds/snapshot";

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
		router.forEachFeedChannel("snapshot-proposal-created", (channel) => {
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
		router.forEachFeedChannel("snapshot-proposal-completed", (channel) => {
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
		router.forEachFeedChannel("snapshot-vote-cast", (channel) => {
			const embed = embeds.generateVoteCastEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});
}
