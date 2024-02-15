import { NermanClient, Events } from "../types";
import Proposal from "../database/Proposal";
import * as embeds from "../embeds/prophouse";

export default async function listenToProphouseEvents(client: NermanClient) {
	const { prophouse, router, ensCache } = client.libraries;

	prophouse.on("RoundCreated", async (data) => {
		console.log("listeners/prophouse: On RoundCreated.", {
			...data
		});

		const creatorName = await ensCache.fetchName(data.creator.id);

		const embedData: Events.PropHouseRoundCreated = {
			...data,
			creator: { ...data.creator, name: creatorName }
		};

		console.log("listeners/prophouse: RoundCreated embed data.", { ...embedData });
		router.forEachFeedChannel("prop-house-round-created", (channel) => {
			const embed = embeds.generateRoundCreatedEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	prophouse.on("HouseCreated", async (data) => {
		console.log("listeners/prophouse: On HouseCreated.", {
			...data
		});

		const creatorName = await ensCache.fetchName(data.creator.id);

		const embedData: Events.PropHouseHouseCreated = {
			...data,
			creator: { ...data.creator, name: creatorName }
		};

		console.log("listeners/prophouse: HouseCreated embed data.", { ...embedData });
		router.forEachFeedChannel("prop-house-house-created", (channel) => {
			const embed = embeds.generateHouseCreatedEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	prophouse.on("VoteCast", async (data) => {
		console.log("listeners/prophouse: On VoteCast.", { ...data });

		const voterName = await ensCache.fetchName(data.voter.id);

		const embedData: Events.PropHouseVoteCast = {
			...data,
			voter: { ...data.voter, name: voterName }
		};

		console.log("listeners/prophouse: VoteCast embed data.", { ...embedData });
		router.forEachFeedChannel("prop-house-vote-cast", (channel) => {
			const embed = embeds.generateVoteCastEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	prophouse.on("ProposalSubmitted", async (data) => {
		console.log("listeners/prophouse: On ProposalSubmitted.", {
			...data
		});

		const proposerName = await ensCache.fetchName(data.proposer.id);
		const embedData: Events.PropHouseProposalSubmitted = {
			...data,
			proposer: { ...data.proposer, name: proposerName }
		};

		console.log("listeners/prophouse: ProposalSubmitted embed data.", { ...embedData });
		router.forEachFeedChannel("prop-house-proposal-submitted", (channel) => {
			const embed = embeds.generateProposalSubmittedEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});
}
