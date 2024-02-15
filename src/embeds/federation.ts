import { EmbedBuilder, hyperlink, inlineCode } from "discord.js";

import { linkToWallet, convertWeiToEth } from "../utilities/embeds";
import { Events } from "../types";
import { MAX_TITLE_LENGTH } from "../constants";

export function generateFederationBidEmbed(data: Events.FederationBidPlaced, proposalUrl: string, hasMarkdown = true) {
	let title = `Nouns Gov Pool | ${data.proposalTitle}`;
	if (title.length > MAX_TITLE_LENGTH) {
		title = title.substring(0, MAX_TITLE_LENGTH).trim() + "...";
	}
	const url = `https://www.federation.wtf/governance-pools/0x0f722d69B3D8C292E85F2b1E5D9F4439edd58F1e/${data.propId}`;

	const amount = convertWeiToEth(Number(data.amount));
	let bidderLink = data.bidder.name;
	let vote: string = data.supportVote;
	let bidAmount = `${amount}Ξ`;
	let voteNumber = data.voteNumber.toString();

	if (hasMarkdown) {
		bidderLink = linkToWallet(data.bidder);
		vote = inlineCode(data.supportVote);
		bidAmount = inlineCode(bidAmount);
		voteNumber = inlineCode(voteNumber.toString());
	}

	const text = `${bidderLink} bid ${bidAmount} to vote ${vote} with ${voteNumber} votes.`;

	return new EmbedBuilder().setColor("#00FFFF").setTitle(title).setDescription(text).setURL(url);
}

export function generateFederationVoteEmbed(data: Events.FederationVoteCast, proposalUrl: string, hasMarkdown = true) {
	let title = `Nouns Gov Pool | ${data.proposalTitle}`;
	if (title.length > MAX_TITLE_LENGTH) {
		title = title.substring(0, MAX_TITLE_LENGTH).trim() + "...";
	}

	const url = `https://www.federation.wtf/governance-pools/0x0f722d69B3D8C292E85F2b1E5D9F4439edd58F1e/${data.propId}`;

	const amount = convertWeiToEth(Number(data.amount));
	let bidAmount = `${amount}Ξ`;
	let bidderLink = data.bidder.name;
	let vote: string = data.supportVote;
	let proposal = `Proposal ${data.propId}`;
	let voteNumber = data.voteNumber.toString();

	if (hasMarkdown) {
		bidAmount = inlineCode(bidAmount);
		bidderLink = linkToWallet(data.bidder);
		vote = inlineCode(data.supportVote);
		proposal = hyperlink(`Proposal ${data.propId}`, `${proposalUrl}${data.propId}`);
		voteNumber = inlineCode(voteNumber);
	}

	const text = `Voted ${vote} with ${voteNumber} votes on ${proposal}.\nWinning bid: ${bidAmount} from ${bidderLink}`;

	return new EmbedBuilder().setColor("#00FFFF").setTitle(title).setDescription(text).setURL(url);
}
