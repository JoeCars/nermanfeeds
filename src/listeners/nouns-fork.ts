import { NermanClient, Events } from "../types";
import Proposal from "../database/Proposal";
import * as embeds from "../embeds/nouns-fork";

export default async function listenToNounsForkEvents(client: NermanClient) {
	const { nounsFork, router, ensCache } = client.libraries;

	nounsFork.on("DelegateChanged", async (data) => {
		console.log("listeners/nouns-fork: On DelegateChanged", { ...data });

		const delegatorName = await ensCache.fetchName(data.delegator.id);
		const fromDelegateName = await ensCache.fetchName(data.fromDelegate.id);
		const toDelegateName = await ensCache.fetchName(data.toDelegate.id);

		const embedData: Events.DelegateChanged = {
			...data,
			delegator: { ...data.delegator, name: delegatorName },
			fromDelegate: { ...data.fromDelegate, name: fromDelegateName },
			toDelegate: { ...data.toDelegate, name: toDelegateName }
		};

		console.log("listeners/nouns-fork: DelegateChanged embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-fork-tokens-delegate-changed", (channel) => {
			const embed = embeds.generateForkDelegateChangedEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	nounsFork.on("Transfer", async (data) => {
		console.log("listeners/nouns-fork: On Transfer", { ...data });

		const fromName = await ensCache.fetchName(data.from.id);
		const toName = await ensCache.fetchName(data.to.id);

		const embedData: Events.Transfer = {
			...data,
			from: { ...data.from, name: fromName },
			to: { ...data.to, name: toName }
		};

		console.log("listeners/nouns-fork: Transfer embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-fork-tokens-transfer", (channel) => {
			const embed = embeds.generateTransferForkNounEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	nounsFork.on("NounCreated", (data) => {
		console.log("listeners/nouns-fork: On NounCreated", { ...data });

		router.forEachFeedChannel("nouns-fork-tokens-noun-created", (channel) => {
			const embed = embeds.generateForkNounCreatedEmbed(data);
			channel.send({ embeds: [embed] });
		});
	});

	nounsFork.on("AuctionCreated", (data) => {
		console.log("listeners/nouns-fork: On AuctionCreated.", { ...data });

		router.forEachFeedChannel("nouns-fork-auction-house-auction-created", (channel) => {
			const embed = embeds.generateForkAuctionCreatedEmbed(data);
			channel.send({ embeds: [embed] });
		});
	});

	nounsFork.on("AuctionBid", async (data) => {
		console.log("listeners/nouns-fork: On AuctionBid.", { ...data });

		const bidderName = await ensCache.fetchName(data.bidder.id);

		const embedData: Events.AuctionBid = {
			...data,
			bidder: {
				...data.bidder,
				name: bidderName
			}
		};

		console.log("listeners/nouns-fork: AuctionBid embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-fork-auction-house-auction-bid", (channel) => {
			const embed = embeds.generateForkAuctionBidEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	nounsFork.on("ProposalCreatedWithRequirements", async (data) => {
		console.log("listeners/nouns-fork: On ProposalCreatedWithRequirements.", { ...data });

		try {
			await Proposal.tryCreateProposal(data, "NounsFork0");
		} catch (error) {
			console.error("events/ready: Error creating a proposal.", {
				error: error
			});
		}

		const proposalTitle = await Proposal.fetchProposalTitle(Number(data.id), "NounsFork0");

		const embedData: Events.ProposalCreated = {
			...data,
			proposalTitle
		};

		console.log("listeners/nouns-fork: ProposalCreatedWithRequirements embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-fork-proposal-created", (channel) => {
			const embed = embeds.generateForkProposalCreatedEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	nounsFork.on("ProposalCanceled", async (data) => {
		console.log("listeners/nouns-fork: On ProposalCanceled.", { ...data });

		const status = "Canceled";
		const proposalTitle = await Proposal.fetchProposalTitle(data.id, "NounsFork0");

		const embedData: Events.ProposalStatusChange = {
			...data,
			status,
			proposalTitle
		};

		console.log("listeners/nouns-fork: ProposalCanceled embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-fork-proposal-status-change", (channel) => {
			const embed = embeds.generateForkProposalStatusChangeEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	nounsFork.on("ProposalQueued", async (data) => {
		console.log("listeners/nouns-fork: On ProposalQueued.", { ...data });

		const status = "Queued";
		const proposalTitle = await Proposal.fetchProposalTitle(data.id, "NounsFork0");

		const embedData: Events.ProposalStatusChange = {
			...data,
			status,
			proposalTitle
		};

		console.log("listeners/nouns-fork: ProposalQueued embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-fork-proposal-status-change", (channel) => {
			const embed = embeds.generateForkProposalStatusChangeEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	nounsFork.on("ProposalExecuted", async (data) => {
		console.log("listeners/nouns-fork: On ProposalExecuted.", { ...data });

		const status = "Executed";
		const proposalTitle = await Proposal.fetchProposalTitle(data.id, "NounsFork0");

		const embedData: Events.ProposalStatusChange = {
			...data,
			status,
			proposalTitle
		};

		console.log("listeners/nouns-fork: ProposalExecuted embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-fork-proposal-status-change", (channel) => {
			const embed = embeds.generateForkProposalStatusChangeEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	nounsFork.on("Quit", async (data) => {
		console.log("listeners/nouns-fork: On Quit.", { ...data });

		const msgSenderName = await ensCache.fetchName(data.msgSender.id);

		const embedData: Events.Quit = {
			...data,
			msgSender: { ...data.msgSender, name: msgSenderName }
		};

		console.log("listeners/nouns-fork: Quit embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-fork-quit", (channel) => {
			const embed = embeds.generateForkQuitEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	nounsFork.on("VoteCast", async (data) => {
		console.log("listeners/nouns-fork: On VoteCast.", { ...data });

		const proposalTitle = await Proposal.fetchProposalTitle(data.proposalId, "NounsFork0");
		const voterName = await ensCache.fetchName(data.voter.id);
		const choice = (["AGAINST", "FOR", "ABSTAIN"] as const)[data.supportDetailed];

		const embedData: Events.VoteCast = {
			...data,
			proposalTitle,
			choice,
			voter: { ...data.voter, name: voterName }
		};

		console.log("listeners/nouns-fork: VoteCast embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-fork-vote-cast", (channel) => {
			const embed = embeds.generateForkVoteCastEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});
}
