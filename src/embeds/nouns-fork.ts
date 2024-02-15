import { EmbedBuilder, hyperlink, inlineCode } from "discord.js";

import { linkToWallet, convertWeiToEth } from "../utilities/embeds";
import { DEFAULT_MINT_ID, MAX_REASON_LENGTH, MAX_TITLE_LENGTH } from "../constants";
import { Events } from "../types";

export function generateForkAuctionBidEmbed(data: Events.AuctionBid) {
	const bidderLink = linkToWallet(data.bidder);
	const amount = convertWeiToEth(Number(data.amount));

	return new EmbedBuilder()
		.setColor("#00FFFF")
		.setTitle(`Fork 0 | Auction Bid`)
		.setDescription(`${bidderLink} bid ${amount}Ξ on Noun ${data.id}`);
}

export function generateForkAuctionCreatedEmbed(data: Events.AuctionCreated) {
	const embed = new EmbedBuilder()
		.setColor("#00FFFF")
		.setTitle(`Fork 0 | New Auction | Noun ${data.id}`)
		.setImage(`http://noun.pics/${data.id}.png`);

	return embed;
}

export function generateTransferForkNounEmbed(data: Events.Transfer, hasMarkdown = true) {
	let title = `Transfer | Noun ${data.tokenId}`;
	if (data.from.id === data.to.id) {
		title = `Washing | Noun ${data.tokenId}`;
	} else if (data.from.id === DEFAULT_MINT_ID) {
		title = `Mint | Noun ${data.tokenId}`;
	}
	title = `Fork 0 | ${title}`;

	let fromWallet = data.from.name;
	let toWallet = data.to.name;
	if (hasMarkdown) {
		fromWallet = linkToWallet(data.from);
		toWallet = linkToWallet(data.to);
	}
	const description = `From ${fromWallet} to ${toWallet}`;

	const embed = new EmbedBuilder()
		.setColor("#00FFFF")
		.setTitle(title)
		.setDescription(description)
		.setImage(`http://noun.pics/${data.tokenId}.png`);
	return embed;
}

export function generateForkDelegateChangedEmbed(data: Events.DelegateChanged, hasMarkdown = true) {
	const title = "Fork 0 | Delegate Changed";
	const titleUrl = `https://etherscan.io/tx/${data.event?.transactionHash}`;

	let delegator = data.delegator.name;
	let newDelegate = data.toDelegate.name;
	let voteCount = data.numOfVotesChanged!.toString();

	if (hasMarkdown) {
		delegator = linkToWallet(data.delegator);
		newDelegate = linkToWallet(data.toDelegate);
		voteCount = inlineCode(voteCount);
	}

	const message = `${delegator} delegated ${voteCount} votes to ${newDelegate}.`;

	const embed = new EmbedBuilder().setTitle(title).setColor("#00FFFF").setDescription(message);

	if (hasMarkdown) {
		embed.setURL(titleUrl);
	}

	return embed;
}

export function generateForkNounCreatedEmbed(data: Events.NounCreated) {
	const title = `Fork 0 | Noun Created | Noun ${data.id}`;

	const titleUrl = `https://nouns.wtf/noun/${data.id}`;

	const embed = new EmbedBuilder()
		.setColor("#00FFFF")
		.setTitle(title)
		.setURL(titleUrl)
		.setDescription(`${data.id % 10 !== 0 ? "Auction Created" : "Nounder's Noun"}`)
		.setImage(`http://noun.pics/${data.id}.png`);

	return embed;
}

export function generateForkProposalCreatedEmbed(data: Events.ProposalCreated) {
	const title = "Fork 0 | New Proposal";
	const titleUrl = `https://etherscan.io/tx/${data.event.transactionHash}`;
	const description = "\n" + data.proposalTitle;

	const proposalEmbed = new EmbedBuilder().setColor("#00FFFF").setTitle(title).setDescription(description).setURL(titleUrl);

	return proposalEmbed;
}

export function generateForkProposalStatusChangeEmbed(data: Events.ProposalStatusChange) {
	let title = `Fork 0 | ${data.proposalTitle}`;
	if (title.length > MAX_TITLE_LENGTH) {
		title = title.substring(0, MAX_TITLE_LENGTH).trim() + "...";
	}
	const description = data.status;

	const proposalEmbed = new EmbedBuilder().setColor("#00FFFF").setTitle(title).setDescription(description);

	return proposalEmbed;
}

export function generateForkQuitEmbed(data: Events.Quit) {
	const title = "Fork 0 | Quit";

	const quitter = linkToWallet(data.msgSender);
	const tokenNumber = inlineCode(data.tokenIds.length.toString());
	const description = `${quitter} quit with ${tokenNumber} token(s).`;

	const embed = new EmbedBuilder().setColor("#00FFFF").setTitle(title).setDescription(description);

	return embed;
}

export function generateForkVoteCastEmbed(data: Events.VoteCast, hasMarkdown = true) {
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

	let title = "Fork 0 | " + data.proposalTitle;
	if (title.length > MAX_TITLE_LENGTH) {
		title = title.substring(0, MAX_TITLE_LENGTH).trim() + "...";
	}

	const description = `${voter} voted ${choice} with ${votes} votes.\n\n${reason}`;

	const voteEmbed = new EmbedBuilder().setColor("#00FFFF").setTitle(title).setDescription(description);

	return voteEmbed;
}
