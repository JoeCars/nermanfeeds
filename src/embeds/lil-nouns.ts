import { EmbedBuilder, hyperlink, hideLinkEmbed, inlineCode } from "discord.js";

import { linkToWallet, convertWeiToEth } from "../utilities/embeds";
import { DEFAULT_MINT_ID, MAX_REASON_LENGTH, MAX_TITLE_LENGTH } from "../constants";
import { Events } from "../types";

export function generateAuctionBidEmbed(data: Events.AuctionBid) {
	const bidderLink = linkToWallet(data.bidder);
	const amount = convertWeiToEth(Number(data.amount));
	const lilNoun = hyperlink(`Lil Noun ${data.id}`, `https://lilnouns.wtf/lilnoun/${data.id}`);

	return new EmbedBuilder()
		.setColor("#00FFFF")
		.setTitle(`Lil Nouns | Auction Bid`)
		.setDescription(`${bidderLink} bid ${amount}Ξ on ${lilNoun}`);
}

export function generateAuctionCreatedEmbed(data: Events.AuctionCreated) {
	const lilNouns = hyperlink(`Lilnouns.wtf`, `https://lilnouns.wtf/lilnoun/${data.id}`);

	const embed = new EmbedBuilder().setColor("#00FFFF").setDescription(lilNouns).setTitle(`New Auction | Lil Noun ${data.id}`);

	return embed;
}

export function generateProposalCreatedEmbed(data: Events.ProposalCreated) {
	const title = `New Lil Nouns Proposal | Proposal ${data.id}`;
	const proposalName = data.proposalTitle;
	const url = `https://lilnouns.wtf/vote/${data.id}`;

	const proposalEmbed = new EmbedBuilder()
		.setColor("#00FFFF")
		.setTitle(title)
		.setDescription(`\u200B\n${proposalName}\n\n${hideLinkEmbed(url)}`);

	return proposalEmbed;
}

export function generateProposalStatusChangeEmbed(data: Events.ProposalStatusChange) {
	let title = `Lil Nouns | ${data.proposalTitle}`;
	if (title.length > MAX_TITLE_LENGTH) {
		title = title.substring(0, MAX_TITLE_LENGTH).trim() + "...";
	}

	const description = `https://lilnouns.wtf/vote/${data.id}\n${data.status}`;

	const proposalEmbed = new EmbedBuilder().setColor("#00FFFF").setTitle(title).setDescription(description);

	return proposalEmbed;
}

export function generateVoteCastEmbed(data: Events.VoteCast, hasMarkdown = true) {
	let voter = data.voter.name;
	let choice: string = data.choice;
	let votes = data.votes.toString();
	let reason = data.reason.trim();

	if (hasMarkdown) {
		voter = linkToWallet(data.voter);
		choice = inlineCode(choice);
		votes = inlineCode(votes);
	}

	if (reason.length > MAX_REASON_LENGTH) {
		reason = reason.substring(0, MAX_REASON_LENGTH).trim() + "...";
	}

	let title = `Lil Nouns | ${data.proposalTitle}`;
	if (title.length > MAX_TITLE_LENGTH) {
		title = title.substring(0, MAX_TITLE_LENGTH).trim() + "...";
	}

	const titleUrl = `https://lilnouns.wtf/vote/${data.proposalId}`;
	const description = `${voter} voted ${choice} with ${votes} votes.\n\n${reason}`;

	const voteEmbed = new EmbedBuilder().setColor("#00FFFF").setTitle(title).setURL(titleUrl).setDescription(description);

	return voteEmbed;
}

export function generateTransferEmbed(data: Events.Transfer, hasMarkdown = true) {
	let title = `Transfer | Lil Noun ${data.tokenId}`;
	if (data.from.id === data.to.id) {
		title = `Washing | Lil Noun ${data.tokenId}`;
	} else if (data.from.id === DEFAULT_MINT_ID) {
		title = `Mint | Lil Noun ${data.tokenId}`;
	}

	let fromWallet = data.from.name;
	let toWallet = data.to.name;
	if (hasMarkdown) {
		fromWallet = linkToWallet(data.from);
		toWallet = linkToWallet(data.to);
	}
	const description = `From ${fromWallet} to ${toWallet}`;

	const embed = new EmbedBuilder().setColor("#00FFFF").setTitle(title).setDescription(description);
	return embed;
}
