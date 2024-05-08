import { NermanClient, Events } from "../types";
import Proposal from "../database/Proposal";
import UrlConfig from "../database/UrlConfig";
import * as embeds from "../embeds/nouns";

export default async function listenToNounsEvents(client: NermanClient) {
	const { nouns, router, ensCache } = client.libraries;

	nouns.on("AuctionEnd", async (data) => {
		let bidData = undefined;
		if (typeof data === "object") {
			bidData = data;
		} else if (typeof data === "number") {
			bidData = await nouns.NounsAuctionHouse.getLatestBidData(data);
		}

		if (!bidData) {
			return console.error("listeners/nouns: No bid data found.");
		}

		console.log("listeners/nouns: On AuctionEnd.", { ...data });

		const bidderName = await ensCache.fetchName((bidData as any).address);

		const embedData: Events.AuctionEnd = {
			...data,
			bidder: { id: (data as any).address, name: bidderName }
		} as Events.AuctionEnd;

		console.log("listeners/nouns: AuctionEnd embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-auction-house-auction-end", (channel) => {
			const embed = embeds.generateAuctionEndEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	nouns.on("AuctionCreated", (data) => {
		console.log("listeners/nouns: On AuctionCreated.", { ...data });

		router.forEachFeedChannel("nouns-auction-house-auction-created", (channel) => {
			const embed = embeds.generateAuctionCreatedEmbed(data);
			channel.send({ embeds: [embed] });
		});
	});

	nouns.on("AuctionBid", async (data) => {
		console.log("listeners/nouns: On AuctionBid.", { ...data });

		const bidderName = await ensCache.fetchName(data.bidder.id);

		const embedData: Events.AuctionBid = {
			...data,
			bidder: { ...data.bidder, name: bidderName }
		};

		console.log("listeners/nouns: AuctionBid embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-auction-house-auction-bid", (channel) => {
			const embed = embeds.generateAuctionBidEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	nouns.on("DelegateChanged", async (data) => {
		console.log("listeners/nouns: On DelegateChanged.", { ...data });

		const delegatorName = await ensCache.fetchName(data.delegator.id);
		const fromDelegateName = await ensCache.fetchName(data.fromDelegate.id);
		const toDelegateName = await ensCache.fetchName(data.toDelegate.id);

		const embedData: Events.DelegateChanged = {
			...data,
			delegator: { ...data.delegator, name: delegatorName },
			fromDelegate: { ...data.fromDelegate, name: fromDelegateName },
			toDelegate: { ...data.toDelegate, name: toDelegateName }
		};

		console.log("listeners/nouns: DelegateChanged embed data.", { ...embedData });
		if (data.numOfVotesChanged !== 0) {
			router.forEachFeedChannel("nouns-token-delegate-changed-no-zero", (channel) => {
				const embed = embeds.generateDelegateChangedEmbed(embedData);
				channel.send({ embeds: [embed] });
			});
		}
		router.forEachFeedChannel("nouns-token-delegate-changed", (channel) => {
			const embed = embeds.generateDelegateChangedEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	nouns.on("Transfer", async (data) => {
		console.log("listeners/nouns: On Transfer.", { ...data });

		const fromName = await ensCache.fetchName(data.from.id);
		const toName = await ensCache.fetchName(data.to.id);

		const embedData: Events.Transfer = {
			...data,
			from: { ...data.from, name: fromName },
			to: { ...data.to, name: toName }
		};

		console.log("listeners/nouns: Transfer embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-token-transfer", (channel) => {
			const embed = embeds.generateTransferNounEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	nouns.on("NounCreated", (data) => {
		console.log("listeners/nouns: On NounCreated.", { ...data });

		router.forEachFeedChannel("nouns-token-noun-created", (channel) => {
			const embed = embeds.generateNounCreatedEmbed(data);
			channel.send({ embeds: [embed] });
		});
	});

	nouns.on("VoteCast", async (data) => {
		console.log("listeners/nouns: On VoteCast.", { ...data });

		const proposalTitle = await Proposal.fetchProposalTitle(data.proposalId, "Nouns");
		const voterName = await ensCache.fetchName(data.voter.id);
		const choice = (["AGAINST", "FOR", "ABSTAIN"] as const)[data.supportDetailed];

		const embedData: Events.VoteCast = {
			...data,
			proposalTitle,
			choice,
			voter: { ...data.voter, name: voterName }
		};

		console.log("listeners/nouns: VoteCast embed data.", { ...embedData });
		if (Number(data.votes) === 0) {
			router.forEachFeedChannel("nouns-dao-proposal-vote-cast-only-zero", async (channel) => {
				const urls = await UrlConfig.fetchUrls(channel.guildId);
				const embed = embeds.generatePropVoteCastEmbed(embedData, urls.proposalUrl);
				channel.send({ embeds: [embed] });
			});
		} else {
			router.forEachFeedChannel("nouns-dao-proposal-vote-cast-no-zero", async (channel) => {
				const urls = await UrlConfig.fetchUrls(channel.guildId);
				const embed = embeds.generatePropVoteCastEmbed(embedData, urls.proposalUrl);
				channel.send({ embeds: [embed] });
			});
		}

		router.forEachNounsProposalForumThread({ id: data.proposalId, title: embedData.proposalTitle }, async (thread) => {
			const urls = await UrlConfig.fetchUrls(thread.guildId);
			const embed = embeds.generatePropVoteCastEmbed(embedData, urls.proposalUrl);
			thread.send({ embeds: [embed] });
		});
	});

	nouns.on("ProposalCreated", async (data) => {
		console.log("listeners/nouns: On ProposalCreated.", { ...data });

		try {
			await Proposal.tryCreateProposal(data, "Nouns");
		} catch (error) {
			console.error("listeners/nouns: Error creating a proposal.", {
				error: error
			});
		}

		const proposalTitle = await Proposal.fetchProposalTitle(Number(data.id), "Nouns");

		const embedData: Events.ProposalCreated = {
			...data,
			proposalTitle
		};

		console.log("listeners/nouns: ProposalCreated embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-dao-proposal-created", async (channel) => {
			const urls = await UrlConfig.fetchUrls(channel.guildId);
			const embed = embeds.generatePropCreatedEmbed(embedData, urls.proposalUrl);
			channel.send({ embeds: [embed] });
		});

		router.forEachNounsProposalForumThread({ id: Number(data.id), title: embedData.proposalTitle }, async (thread) => {
			const urls = await UrlConfig.fetchUrls(thread.guildId);
			const embed = embeds.generatePropCreatedEmbed(embedData, urls.proposalUrl);
			thread.send({ embeds: [embed] });
		});
	});

	nouns.on("ProposalCanceled", async (data) => {
		console.log("listeners/nouns: On ProposalCanceled.", { ...data });

		const status = "Canceled";
		const proposalTitle = await Proposal.fetchProposalTitle(data.id, "Nouns");

		const embedData: Events.ProposalStatusChange = {
			...data,
			status,
			proposalTitle
		};

		console.log("listeners/nouns: ProposalCanceled embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-dao-proposal-status-change", async (channel) => {
			const urls = await UrlConfig.fetchUrls(channel.guildId);
			const embed = embeds.generatePropStatusChangeEmbed(embedData, urls.proposalUrl);
			channel.send({ embeds: [embed] });
		});

		router.forEachNounsProposalForumThread({ id: data.id, title: embedData.proposalTitle }, async (thread) => {
			const urls = await UrlConfig.fetchUrls(thread.guildId);
			const embed = embeds.generatePropStatusChangeEmbed(embedData, urls.proposalUrl);
			thread.send({ embeds: [embed] });
		});
	});

	nouns.on("ProposalQueued", async (data) => {
		console.log("listeners/nouns: On ProposalQueued.", { ...data });

		const status = "Queued";
		const proposalTitle = await Proposal.fetchProposalTitle(data.id, "Nouns");

		const embedData: Events.ProposalStatusChange = {
			...data,
			status,
			proposalTitle
		};

		console.log("listeners/nouns: ProposalQueued embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-dao-proposal-status-change", async (channel) => {
			const urls = await UrlConfig.fetchUrls(channel.guildId);
			const embed = embeds.generatePropStatusChangeEmbed(embedData, urls.proposalUrl);
			channel.send({ embeds: [embed] });
		});

		router.forEachNounsProposalForumThread({ id: data.id, title: embedData.proposalTitle }, async (thread) => {
			const urls = await UrlConfig.fetchUrls(thread.guildId);
			const embed = embeds.generatePropStatusChangeEmbed(embedData, urls.proposalUrl);
			thread.send({ embeds: [embed] });
		});
	});

	nouns.on("ProposalVetoed", async (data) => {
		console.log("listeners/nouns: On ProposalVetoed.", { ...data });

		const status = "Vetoed";
		const proposalTitle = await Proposal.fetchProposalTitle(data.id, "Nouns");

		const embedData: Events.ProposalStatusChange = {
			...data,
			status,
			proposalTitle
		};

		console.log("listeners/nouns: ProposalVetoed embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-dao-proposal-status-change", async (channel) => {
			const urls = await UrlConfig.fetchUrls(channel.guildId);
			const embed = embeds.generatePropStatusChangeEmbed(embedData, urls.proposalUrl);
			channel.send({ embeds: [embed] });
		});

		router.forEachNounsProposalForumThread({ id: data.id, title: embedData.proposalTitle }, async (thread) => {
			const urls = await UrlConfig.fetchUrls(thread.guildId);
			const embed = embeds.generatePropStatusChangeEmbed(embedData, urls.proposalUrl);
			thread.send({ embeds: [embed] });
		});
	});

	nouns.on("ProposalExecuted", async (data) => {
		console.log("listeners/nouns: On ProposalExecuted.", { ...data });

		const status = "Executed";
		const proposalTitle = await Proposal.fetchProposalTitle(data.id, "Nouns");

		const embedData: Events.ProposalStatusChange = {
			...data,
			status,
			proposalTitle
		};

		console.log("listeners/nouns: ProposalExecuted embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-dao-proposal-status-change", async (channel) => {
			const urls = await UrlConfig.fetchUrls(channel.guildId);
			const embed = embeds.generatePropStatusChangeEmbed(embedData, urls.proposalUrl);
			channel.send({ embeds: [embed] });
		});

		router.forEachNounsProposalForumThread({ id: data.id, title: embedData.proposalTitle }, async (thread) => {
			const urls = await UrlConfig.fetchUrls(thread.guildId);
			const embed = embeds.generatePropStatusChangeEmbed(embedData, urls.proposalUrl);
			thread.send({ embeds: [embed] });
		});
	});

	nouns.on("DAOWithdrawNounsFromEscrow", async (data) => {
		console.log("listeners/nouns: On DAOWithdrawNounsFromEscrow", { ...data });

		const toName = await ensCache.fetchName(data.to.id);

		const embedData: Events.WithdrawNounsFromEscrow = {
			...data,
			to: { ...data.to, name: toName }
		};

		console.log("listeners/nouns: DAOWithdrawNounsFromEscrow embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-dao-withdraw-nouns-from-escrow", async (channel) => {
			const embed = embeds.generateWithdrawNounsFromEscrowEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	nouns.on("EscrowedToFork", async (data) => {
		console.log("listeners/nouns: On EscrowedToFork", { ...data });

		const ownerName = await ensCache.fetchName(data.owner.id);

		// Grabbing fork threshold numbers.
		const currentEscrowAmount = Number(await nouns.NounsDAO.Contract.numTokensInForkEscrow());
		const thresholdNumber = Number(await nouns.NounsDAO.Contract.forkThreshold()) + 1; // +1 because it needs to be strictly greater than forkThreshold().
		const currentPercentage = Math.floor((currentEscrowAmount / thresholdNumber) * 100);

		const embedData: Events.EscrowedToFork = {
			...data,
			owner: { ...data.owner, name: ownerName },
			currentEscrowAmount,
			currentPercentage,
			tokensInEscrow: currentEscrowAmount
		};

		console.log("listeners/nouns: EscrowedToFork embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-dao-escrowed-to-fork", async (channel) => {
			const embed = embeds.generateEscrowedToForkEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	nouns.on("ExecuteFork", async (data) => {
		console.log("listeners/nouns: On ExecuteFork", { ...data });

		router.forEachFeedChannel("nouns-dao-execute-fork", async (channel) => {
			const embed = embeds.generateExecuteForkEmbed(data);
			channel.send({ embeds: [embed] });
		});
	});

	nouns.on("JoinFork", async (data) => {
		console.log("listeners/nouns: On JoinFork", { ...data });

		const ownerName = await ensCache.fetchName(data.owner.id);

		const embedData = { ...data, owner: { ...data.owner, name: ownerName } };

		console.log("listeners/nouns: JoinFork embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-dao-join-fork", async (channel) => {
			const embed = embeds.generateJoinForkEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});

	nouns.on("CandidateFeedbackSent", async (data) => {
		console.log("listeners/nouns: On CandidateFeedbackSent", { ...data });

		const msgSenderName = await ensCache.fetchName(data.msgSender.id);
		const proposerName = await ensCache.fetchName(data.proposer.id);
		const supportVote = (["AGAINST", "FOR", "ABSTAIN"] as const)[data.support];

		const embedData: Events.CandidateFeedbackSent = {
			...data,
			msgSender: { ...data.msgSender, name: msgSenderName },
			proposer: { ...data.proposer, name: proposerName },
			supportVote
		};

		console.log("listeners/nouns: CandidateFeedbackSent embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-dao-data-proposal-candidate-feedback-sent", async (channel) => {
			const embed = embeds.generateCandidateFeedbackSentEmbed(embedData);
			channel.send({ embeds: [embed] });
		});

		router.forEachNounsProposalCandidateForumThread({ slug: data.slug, proposer: data.proposer.id }, async (thread) => {
			const embed = embeds.generateCandidateFeedbackSentEmbed(embedData);
			embed.setTitle("New Candidate Feedback");
			thread.send({ embeds: [embed] });
		});
	});

	nouns.on("FeedbackSent", async (data) => {
		console.log("listeners/nouns: On FeedbackSent", { ...data });

		const msgSenderName = await ensCache.fetchName(data.msgSender.id);
		const supportVote = (["AGAINST", "FOR", "ABSTAIN"] as const)[data.support];
		const proposalTitle = await Proposal.fetchProposalTitle(data.proposalId, "Nouns");

		const embedData: Events.FeedbackSent = {
			...data,
			supportVote,
			proposalTitle,
			msgSender: { ...data.msgSender, name: msgSenderName }
		};

		console.log("listeners/nouns: FeedbackSent embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-dao-data-proposal-feedback-sent", async (channel) => {
			const urls = await UrlConfig.fetchUrls(channel.guildId);
			const embed = embeds.generateFeedbackSentEmbed(embedData, urls.proposalUrl);
			channel.send({ embeds: [embed] });
		});

		router.forEachNounsProposalForumThread({ id: data.proposalId, title: embedData.proposalTitle }, async (thread) => {
			const urls = await UrlConfig.fetchUrls(thread.guildId);
			const embed = embeds.generateFeedbackSentEmbed(embedData, urls.proposalUrl);
			thread.send({ embeds: [embed] });
		});
	});

	nouns.on("ProposalCandidateCanceled", async (data) => {
		console.log("listeners/nouns: On ProposalCandidateCanceled", { ...data });

		const msgSenderName = await ensCache.fetchName(data.msgSender.id);
		const embedData: Events.ProposalCandidateCanceled = {
			...data,
			msgSender: { ...data.msgSender, name: msgSenderName }
		};

		console.log("listeners/nouns: ProposalCandidateCanceled embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-dao-data-proposal-candidate-canceled", async (channel) => {
			const embed = embeds.generateProposalCandidateCanceledEmbed(embedData);
			channel.send({ embeds: [embed] });
		});

		router.forEachNounsProposalCandidateForumThread({ slug: data.slug, proposer: data.msgSender.id }, async (thread) => {
			const embed = embeds.generateProposalCandidateCanceledEmbed(embedData);
			thread.send({ embeds: [embed] });
		});
	});

	nouns.on("ProposalCandidateCreated", async (data) => {
		console.log("listeners/nouns: On ProposalCandidateCreated.", { ...data });

		const msgSenderName = await ensCache.fetchName(data.msgSender.id);
		const embedData: Events.ProposalCandidateCreated = {
			...data,
			msgSender: { ...data.msgSender, name: msgSenderName }
		};

		console.log("listeners/nouns: ProposalCandidateCreated embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-dao-data-proposal-candidate-created", async (channel) => {
			const embed = embeds.generateProposalCandidateCreatedEmbed(embedData);
			channel.send({ embeds: [embed] });
		});

		router.forEachNounsProposalCandidateForumThread({ slug: data.slug, proposer: data.msgSender.id }, async (thread) => {
			const embed = embeds.generateProposalCandidateCreatedEmbed(embedData);
			embed.setTitle("New Proposal Candidate");
			thread.send({ embeds: [embed] });
		});
	});

	nouns.on("ProposalCandidateUpdated", async (data) => {
		console.log("listeners/nouns: On ProposalCandidateUpdated", { ...data });

		const msgSenderName = await ensCache.fetchName(data.msgSender.id);
		const embedData: Events.ProposalCandidateUpdated = {
			...data,
			msgSender: { ...data.msgSender, name: msgSenderName }
		};

		console.log("listeners/nouns: ProposalCandidateUpdated embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-dao-data-proposal-candidate-updated", async (channel) => {
			const embed = embeds.generateProposalCandidateUpdatedEmbed(embedData);
			channel.send({ embeds: [embed] });
		});

		router.forEachNounsProposalCandidateForumThread({ slug: data.slug, proposer: data.msgSender.id }, async (thread) => {
			const embed = embeds.generateProposalCandidateUpdatedEmbed(embedData);
			thread.send({ embeds: [embed] });
		});
	});

	nouns.on("SignatureAdded", async (data) => {
		console.log("listeners/nouns: On SignatureAdded.", { ...data });

		const proposerName = await ensCache.fetchName(data.proposer.id);
		const signerName = await ensCache.fetchName(data.signer.id);
		const votes = Number(await nouns.NounsToken.Contract.getCurrentVotes(data.signer.id));

		const embedData: Events.SignatureAdded = {
			...data,
			proposer: { ...data.proposer, name: proposerName },
			signer: { ...data.signer, name: signerName },
			votes
		};

		console.log("listeners/nouns: SignatureAdded embed data.", { ...embedData });
		router.forEachFeedChannel("nouns-dao-data-signature-added", async (channel) => {
			const embed = embeds.generateSignatureAddedEmbed(embedData);
			channel.send({ embeds: [embed] });
		});

		router.forEachNounsProposalCandidateForumThread({ slug: data.slug, proposer: data.proposer.id }, async (thread) => {
			const embed = embeds.generateSignatureAddedEmbed(embedData);
			embed.setTitle("Candidate Proposal Signed");
			thread.send({ embeds: [embed] });
		});
	});
}
