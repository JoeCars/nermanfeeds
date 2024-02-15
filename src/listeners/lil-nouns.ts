import { NermanClient, Events } from "../types";
import Proposal from "../database/Proposal";
import * as embeds from "../embeds/lil-nouns";

export default async function listenToLilNounsEvents(client: NermanClient) {
	const { lilNouns, router, ensCache } = client.libraries;

	lilNouns.on("AuctionBid", async (data) => {
		console.log("listeners/lil-nouns: On AuctionBid.", { ...data });

		const bidderName = await ensCache.fetchName(data.bidder.id);

		const embedData: Events.AuctionBid = {
			...data,
			bidder: {
				...data.bidder,
				name: bidderName
			}
		};

		console.log("listeners/lil-nouns: AuctionBid embed data.", { ...embedData });
		router.forEachFeedChannel("lil-nouns-auction-bid", (channel) => {
			const embed = embeds.generateAuctionBidEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	lilNouns.on("AuctionCreated", async (data) => {
		console.log("listeners/lil-nouns: On AuctionCreated.", { ...data });

		router.forEachFeedChannel("lil-nouns-auction-created", (channel) => {
			const embed = embeds.generateAuctionCreatedEmbed(data);
			channel.send({ embeds: [embed] });
		});
	});

	lilNouns.on("ProposalCreatedWithRequirements", async (data) => {
		console.log("listeners/lil-nouns: On ProposalCreatedWithRequirements.", { ...data });

		try {
			await Proposal.tryCreateProposal(data, "LilNouns");
		} catch (error) {
			console.error("listeners/lil-nouns: Error creating a proposal.", {
				error: error
			});
		}

		const proposalTitle = await Proposal.fetchProposalTitle(Number(data.id), "LilNouns");

		const embedData: Events.ProposalCreated = {
			...data,
			proposalTitle
		};

		console.log("listeners/lil-nouns: ProposalCreatedWithRequirements embed data.", { ...embedData });
		router.forEachFeedChannel("lil-nouns-proposal-created", (channel) => {
			const embed = embeds.generateProposalCreatedEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	lilNouns.on("ProposalCanceled", async (data) => {
		console.log("listeners/lil-nouns: On ProposalCanceled.", { ...data });

		const status = "Canceled";
		const proposalTitle = await Proposal.fetchProposalTitle(data.id, "LilNouns");

		const embedData: Events.ProposalStatusChange = {
			...data,
			status,
			proposalTitle
		};

		console.log("listeners/lil-nouns: ProposalCanceled embed data.", { ...embedData });
		router.forEachFeedChannel("lil-nouns-proposal-status-change", (channel) => {
			const embed = embeds.generateProposalStatusChangeEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	lilNouns.on("ProposalQueued", async (data) => {
		console.log("listeners/lil-nouns: On ProposalQueued.", { ...data });

		const status = "Queued";
		const proposalTitle = await Proposal.fetchProposalTitle(data.id, "LilNouns");

		const embedData: Events.ProposalStatusChange = {
			...data,
			status,
			proposalTitle
		};

		console.log("listeners/lil-nouns: ProposalQueued embed data.", { ...embedData });
		router.forEachFeedChannel("lil-nouns-proposal-status-change", (channel) => {
			const embed = embeds.generateProposalStatusChangeEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	lilNouns.on("ProposalVetoed", async (data) => {
		console.log("listeners/lil-nouns: On ProposalVetoed.", { ...data });

		const status = "Vetoed";
		const proposalTitle = await Proposal.fetchProposalTitle(data.id, "LilNouns");

		const embedData: Events.ProposalStatusChange = {
			...data,
			status,
			proposalTitle
		};

		console.log("listeners/lil-nouns: ProposalVetoed embed data.", { ...embedData });
		router.forEachFeedChannel("lil-nouns-proposal-status-change", (channel) => {
			const embed = embeds.generateProposalStatusChangeEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	lilNouns.on("ProposalExecuted", async (data) => {
		console.log("listeners/lil-nouns: On ProposalExecuted.", { ...data });

		const status = "Executed";
		const proposalTitle = await Proposal.fetchProposalTitle(data.id, "LilNouns");

		const embedData: Events.ProposalStatusChange = {
			...data,
			status,
			proposalTitle
		};

		console.log("listeners/lil-nouns: ProposalExecuted embed data.", { ...embedData });
		router.forEachFeedChannel("lil-nouns-proposal-status-change", (channel) => {
			const embed = embeds.generateProposalStatusChangeEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	lilNouns.on("VoteCast", async (data) => {
		console.log("listeners/lil-nouns: On VoteCast.", { ...data });

		const proposalTitle = await Proposal.fetchProposalTitle(data.proposalId, "LilNouns");
		const voterName = await ensCache.fetchName(data.voter.id);
		const choice = (["AGAINST", "FOR", "ABSTAIN"] as const)[data.supportDetailed];

		const embedData: Events.VoteCast = {
			...data,
			proposalTitle,
			choice,
			voter: { ...data.voter, name: voterName }
		};

		console.log("listeners/lil-nouns: VoteCast embed data.", { ...embedData });
		router.forEachFeedChannel("lil-nouns-vote-cast", (channel) => {
			const embed = embeds.generateVoteCastEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	lilNouns.on("Transfer", async (data) => {
		console.log("listeners/lil-nouns: On Transfer.", { ...data });

		const fromName = await ensCache.fetchName(data.from.id);
		const toName = await ensCache.fetchName(data.to.id);

		const embedData: Events.Transfer = {
			...data,
			from: { ...data.from, name: fromName },
			to: { ...data.to, name: toName }
		};

		console.log("listeners/lil-nouns: Transfer embed data.", { ...embedData });
		router.forEachFeedChannel("lil-nouns-transfer", (channel) => {
			const embed = embeds.generateTransferEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});
}
