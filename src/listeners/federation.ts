import { NermanClient, Events, VoteChoices } from "../types";
import Proposal from "../database/Proposal";
import UrlConfig from "../database/UrlConfig";
import * as embeds from "../embeds/federation";

export default async function listenToFederationEvents(client: NermanClient) {
	const { federation, router, ensCache, nouns } = client.libraries;

	federation.on("BidPlaced", async (data) => {
		console.log("listeners/federation: On BidPlaced.", { ...data });

		const supportVote = (["AGAINST", "FOR", "ABSTAIN"] as const)[data.support];
		const bidderName = await ensCache.fetchName(data.bidder.id);
		const proposalTitle = await Proposal.fetchProposalTitle(data.propId, "Nouns");

		const GOVERNANCE_POOL_VOTING_ADDRESS = `0x6b2645b468A828a12fEA8C7D644445eB808Ec2B1`;
		const currentBlock = await nouns.provider.getBlockNumber();
		const proposal = await nouns.NounsDAO.Contract.proposals(Number(data.propId));

		let votes = 0;
		if (proposal.startBlock <= currentBlock) {
			// Grabs vote at the snapshot.
			votes = await nouns.NounsToken.Contract.getPriorVotes(GOVERNANCE_POOL_VOTING_ADDRESS, proposal.startBlock);
		} else {
			votes = await nouns.NounsToken.Contract.getCurrentVotes(GOVERNANCE_POOL_VOTING_ADDRESS);
		}
		const voteNumber = votes;

		const embedData: Events.FederationBidPlaced = {
			...data,
			supportVote,
			bidder: { id: data.bidder.id, name: bidderName },
			proposalTitle,
			voteNumber
		};

		console.log("listeners/federation: BidPlaced embed data.", { ...embedData });
		router.forEachFeedChannel("federation-bid-placed", async (channel) => {
			const urls = await UrlConfig.fetchUrls(channel.guildId);
			const embed = embeds.generateFederationBidEmbed(embedData, urls.proposalUrl);
			channel.send({ embeds: [embed] });
		});
		router.forEachNounsProposalForumThread({ id: data.propId, title: embedData.proposalTitle }, async (thread) => {
			const urls = await UrlConfig.fetchUrls(thread.guildId);
			const embed = embeds.generateFederationBidEmbed(embedData, urls.proposalUrl);
			thread.send({ embeds: [embed] });
		});
	});

	federation.on("VoteCast", async (data) => {
		console.log("listeners/federation: On VoteCast.", { ...data });

		const supportVote = (["AGAINST", "FOR", "ABSTAIN"] as const)[data.support];
		const bidderName = await ensCache.fetchName(data.bidder.id);
		const proposalTitle = await Proposal.fetchProposalTitle(data.propId, "Nouns");

		const GOVERNANCE_POOL_VOTING_ADDRESS = `0x6b2645b468A828a12fEA8C7D644445eB808Ec2B1`;
		const voting = await nouns.NounsDAO.Contract.getReceipt(data.propId, GOVERNANCE_POOL_VOTING_ADDRESS);
		const voteNumber = voting.votes;

		const embedData: Events.FederationVoteCast = {
			...data,
			supportVote,
			bidder: { id: data.bidder.id, name: bidderName },
			proposalTitle,
			voteNumber
		};

		console.log("listeners/federation: VoteCast embed data.", { ...embedData });
		router.forEachFeedChannel("federation-vote-cast", async (channel) => {
			const urls = await UrlConfig.fetchUrls(channel.guildId);
			const embed = embeds.generateFederationVoteEmbed(embedData, urls.proposalUrl, true);
			channel.send({ embeds: [embed] });
		});
		router.forEachNounsProposalForumThread({ id: data.propId, title: embedData.proposalTitle }, async (thread) => {
			const urls = await UrlConfig.fetchUrls(thread.guildId);
			const embed = embeds.generateFederationVoteEmbed(embedData, urls.proposalUrl);
			thread.send({ embeds: [embed] });
		});
	});
}
