import { EmbedBuilder, hyperlink, inlineCode, italic, hideLinkEmbed } from "discord.js";

import { linkToWallet, convertWeiToEth, linkToNoun } from "../utilities/embeds";
import { MAX_REASON_LENGTH, MAX_TITLE_LENGTH, DEFAULT_MINT_ID } from "../constants";
import { Events } from "../types";

export function generateDelegateChangedEmbed(data: Events.DelegateChanged, hasMarkdown = true) {
	const title = "Delegate Changed";
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

export function generateNounCreatedEmbed(data: Events.NounCreated) {
	const title = `Noun Created | Noun ${data.id}`;

	const titleUrl = `https://nouns.wtf/noun/${data.id}`;

	const embed = new EmbedBuilder()
		.setColor("#00FFFF")
		.setTitle(title)
		.setURL(titleUrl)
		.setDescription(`${data.id % 10 !== 0 ? "Auction Created" : "Nounder's Noun"}`)
		.setImage(`http://noun.pics/${data.id}.png`);

	return embed;
}

export function generateTransferNounEmbed(data: Events.Transfer, hasMarkdown = true) {
	let title = `Transfer | Noun ${data.tokenId}`;
	if (data.from.id === data.to.id) {
		title = `Washing | Noun ${data.tokenId}`;
	} else if (data.from.id === DEFAULT_MINT_ID) {
		title = `Mint | Noun ${data.tokenId}`;
	}

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

export function generateAuctionBidEmbed(data: Events.AuctionBid) {
	const bidderLink = hyperlink(data.bidder.name, `https://etherscan.io/address/${data.bidder.id}`);
	const nounsLink = linkToNoun(Number(data.id));
	const amount = convertWeiToEth(Number(data.amount));

	return new EmbedBuilder()
		.setColor("#00FFFF")
		.setTitle(`Auction Bid`)
		.setDescription(`${bidderLink} bid ${amount}Ξ on ${nounsLink}`);
}

export function generateAuctionCreatedEmbed(data: Events.AuctionCreated) {
	const nounsWTF = hyperlink("Nouns.wtf", `https://nouns.wtf/noun/${data.id}`);
	const pronouns = hyperlink("Pronouns.gg", `https://pronouns.gg/noun/${data.id}`);
	const nounOClock = hyperlink("Nounoclock.app", `https://www.nounoclock.app/`);

	const embed = new EmbedBuilder()
		.setColor("#00FFFF")
		.setTitle(`New Auction | Noun ${data.id}`)
		.setDescription(`${nounsWTF}\n${pronouns}\n${nounOClock}`)
		.setImage(`http://noun.pics/${data.id}.png`);

	return embed;
}

export function generateAuctionEndEmbed(data: Events.AuctionEnd, hasMarkdown = true) {
	const title = `SOLD! Noun ${data.id} for ${data.amount}Ξ`;
	let bidder = data.bidder.name;
	if (hasMarkdown) {
		bidder = linkToWallet(data.bidder);
	}
	const description = `Winner: ${bidder}`;

	const embed = new EmbedBuilder()
		.setColor("#00FFFF")
		.setTitle(title)
		.setDescription(description)
		.setImage(`https://noun.pics/${data.id}.png`);

	return embed;
}

export function generateCandidateFeedbackSentEmbed(data: Events.CandidateFeedbackSent) {
	const proposalTitle = data.slug
		.split("-")
		.filter((word) => {
			return word.trim();
		})
		.map((word) => {
			return word[0].toUpperCase() + word.substring(1);
		})
		.join(" ");
	let title = `New Candidate Feedback | ${proposalTitle}`;
	if (title.length > MAX_TITLE_LENGTH) {
		title = title.substring(0, MAX_TITLE_LENGTH) + "...";
	}

	const feedbacker = linkToWallet(data.msgSender);
	const proposalDescription = `${feedbacker}'s current sentiment: ${inlineCode(data.supportVote)}.`;
	let proposalReason = "";
	if (data.reason.trim()) {
		proposalReason = "\n\n" + data.reason.trim();
	}
	if (proposalReason.length > MAX_REASON_LENGTH) {
		proposalReason = "\n\n" + proposalReason.substring(0, MAX_REASON_LENGTH).trim() + "...";
	}
	const description = proposalDescription + proposalReason;

	const url = `https://nouns.wtf/candidates/${data.proposer.id.toLowerCase()}-${data.slug}`;

	const embed = new EmbedBuilder().setColor("#00FFFF").setTitle(title).setDescription(description).setURL(url);

	return embed;
}

export function generateFeedbackSentEmbed(data: Events.FeedbackSent, proposalUrl: string) {
	let title = `New Feedback | ${data.proposalTitle}`;
	if (title.length > MAX_TITLE_LENGTH) {
		title = title.substring(0, MAX_TITLE_LENGTH).trim() + "...";
	}

	const feedbacker = linkToWallet(data.msgSender);
	const proposalDescription = `${feedbacker}'s current sentiment: ${inlineCode(data.supportVote)}.`;
	let proposalReason = "";
	if (data.reason.trim()) {
		proposalReason = "\n\n" + data.reason.trim();
	}
	if (proposalReason.length > MAX_REASON_LENGTH) {
		proposalReason = "\n\n" + proposalReason.substring(0, MAX_REASON_LENGTH).trim() + "...";
	}
	const description = proposalDescription + proposalReason;

	const url = `${proposalUrl}${data.proposalId}`;

	const embed = new EmbedBuilder().setColor("#00FFFF").setTitle(title).setDescription(description).setURL(url);

	return embed;
}

export function generateProposalCandidateCanceledEmbed(data: Events.ProposalCandidateCanceled) {
	const title = `Proposal Candidate Canceled`;

	const proposer = linkToWallet(data.msgSender);
	const proposalTitle = data.slug
		.trim()
		.split("-")
		.filter((word) => {
			return word.trim();
		})
		.map((word) => {
			return word[0].toUpperCase() + word.substring(1).toLowerCase();
		})
		.join(" ");
	const proposalUrl = `https://nouns.wtf/candidates/${data.msgSender.id.toLowerCase()}-${data.slug}`;
	const proposalName = hyperlink(proposalTitle, proposalUrl);
	const description = `${proposer} has ${inlineCode("CANCELED")} their proposal candidate (${proposalName}).`;

	const embed = new EmbedBuilder().setColor("#00FFFF").setTitle(title).setDescription(description);

	return embed;
}

export function generateProposalCandidateCreatedEmbed(proposal: Events.ProposalCandidateCreated) {
	const proposalTitle = proposal.slug
		.split("-")
		.filter((word) => {
			return word.trim();
		})
		.map((word) => {
			return word[0].toUpperCase() + word.substring(1);
		})
		.join(" ");
	let title = `New Proposal Candidate | ${proposalTitle}`;
	if (title.length > MAX_TITLE_LENGTH) {
		title = title.substring(0, MAX_TITLE_LENGTH) + "...";
	}

	const proposer = linkToWallet(proposal.msgSender);
	const description = `Proposed by ${proposer}`;

	const url = `https://nouns.wtf/candidates/${proposal.msgSender.id.toLowerCase()}-${proposal.slug}`;

	const embed = new EmbedBuilder().setColor("#00FFFF").setTitle(title).setDescription(description).setURL(url);

	return embed;
}

export function generateProposalCandidateUpdatedEmbed(data: Events.ProposalCandidateUpdated) {
	const title = `Proposal Candidate Updated`;

	const proposer = linkToWallet(data.msgSender);
	const proposalTitle = data.slug
		.trim()
		.split("-")
		.filter((word) => {
			return word.trim();
		})
		.map((word) => {
			return word[0].toUpperCase() + word.substring(1).toLowerCase();
		})
		.join(" ");
	const proposalUrl = `https://nouns.wtf/candidates/${data.msgSender.id.toLowerCase()}-${data.slug}`;
	const proposalName = hyperlink(proposalTitle, proposalUrl);
	let reason = data.reason || "";
	if (reason.length > MAX_REASON_LENGTH) {
		reason = reason.substring(0, MAX_REASON_LENGTH).trim() + "...";
	}

	const description = `${proposer} has ${inlineCode("UPDATED")} their proposal candidate (${proposalName}).\n\n${reason}`;

	const embed = new EmbedBuilder().setColor("#00FFFF").setTitle(title).setDescription(description);

	return embed;
}

export function generateSignatureAddedEmbed(data: Events.SignatureAdded) {
	const proposalTitle = data.slug
		.split("-")
		.filter((word) => {
			return word.trim();
		})
		.map((word) => {
			return word[0].toUpperCase() + word.substring(1);
		})
		.join(" ");
	let title = `Candidate Proposal Signed | ${proposalTitle}`;
	if (title.length > MAX_TITLE_LENGTH) {
		title = title.substring(0, MAX_TITLE_LENGTH) + "...";
	}

	const proposer = linkToWallet(data.proposer);
	const signer = linkToWallet(data.signer);
	const votes = inlineCode(data.votes.toString());
	const reason = data.reason ? `\n\n${data.reason}` : "";
	const description = `${signer} signed ${proposer}'s proposal with ${votes} vote(s).${reason}`;

	const url = `https://nouns.wtf/candidates/${data.proposer.id.toLowerCase()}-${data.slug}`;

	const embed = new EmbedBuilder().setColor("#00FFFF").setTitle(title).setDescription(description).setURL(url);

	return embed;
}

export function generateEscrowedToForkEmbed(data: Events.EscrowedToFork) {
	const title = `Tokens Escrowed To Fork ${data.forkId}!`;

	const owner = linkToWallet(data.owner);
	const tokenNumber = inlineCode(data.tokenIds.length.toString());
	const escrowDescription = `${owner} escrowed ${tokenNumber} token(s).`;

	const status = italic(`\n\n${data.currentEscrowAmount} Nouns in escrow - ${data.currentPercentage}% of fork threshold.`);

	let escrowReason = "";
	if (data.reason.trim()) {
		escrowReason = "\n\n" + data.reason.trim();
	}
	if (escrowReason.length > MAX_REASON_LENGTH) {
		escrowReason = "\n\n" + escrowReason.substring(0, MAX_REASON_LENGTH).trim() + "...";
	}
	const description = escrowDescription + status + escrowReason;

	const url = `https://nouns.wtf/fork/${data.forkId}`;

	const embed = new EmbedBuilder().setColor("#00FFFF").setTitle(title).setDescription(description).setURL(url);

	return embed;
}

export function generateExecuteForkEmbed(data: Events.ExecuteFork) {
	const title = `Fork Executed!`;

	const url = `https://nouns.wtf/fork/${data.forkId}`;

	const forkName = hyperlink(`Fork ${data.forkId}`, url);

	const description = `${forkName} executed with ${inlineCode(Number(data.tokensInEscrow).toString())} tokens!`;

	const embed = new EmbedBuilder().setColor("#00FFFF").setTitle(title).setDescription(description).setURL(url);

	return embed;
}

export function generateJoinForkEmbed(data: Events.JoinFork) {
	const title = `Fork ${data.forkId} Joined!`;

	const url = `https://nouns.wtf/fork/${data.forkId}`;

	const owner = linkToWallet(data.owner);
	const fork = hyperlink(`Fork ${data.forkId}`, url);
	const tokens = inlineCode(data.tokenIds.length.toString());

	let reason = data.reason.trim();
	if (reason.length > MAX_REASON_LENGTH) {
		reason = reason.substring(0, MAX_REASON_LENGTH).trim() + "...";
	}
	if (reason) {
		reason = "\n\n" + reason;
	}

	const description = `${owner} joined ${fork} with ${tokens} token(s).` + reason;

	const embed = new EmbedBuilder().setColor("#00FFFF").setTitle(title).setDescription(description).setURL(url);

	return embed;
}

export function generatePropCreatedEmbed(proposal: Events.ProposalCreated, proposalUrl: string) {
	const title = "New Proposal!";
	const proposalName = proposal.proposalTitle;
	const url = `${proposalUrl}${proposal.id}`;

	const proposalEmbed = new EmbedBuilder()
		.setColor("#00FFFF")
		.setTitle(title)
		.setDescription(`\u200B\n${proposalName}\n\n${hideLinkEmbed(url)}`);

	return proposalEmbed;
}

export function generatePropStatusChangeEmbed(data: Events.ProposalStatusChange, url: string) {
	let title = data.proposalTitle;
	if (title.length > MAX_TITLE_LENGTH) {
		title = title.substring(0, MAX_TITLE_LENGTH).trim() + "...";
	}

	const description = `${url}${data.id}\n${data.status}`;

	const proposalEmbed = new EmbedBuilder().setColor("#00FFFF").setTitle(title).setDescription(description);

	return proposalEmbed;
}

export function generatePropVoteCastEmbed(data: Events.VoteCast, proposalUrl: string, hasMarkdown = true) {
	let voter = data.voter.name;
	let choice: string = data.choice;
	let votes = data.votes.toString();
	let reason = data.reason.trim();

	if (reason.length > MAX_REASON_LENGTH) {
		reason = reason.substring(0, MAX_REASON_LENGTH).trim() + "...";
		reason +=
			"\n" +
			hyperlink(
				"read more",
				`https://www.nouns.camp/proposals/${data.proposalId}#${data.voter.id.toLowerCase()}-${data.proposalId}`
			);
	}

	if (hasMarkdown) {
		voter = linkToWallet(data.voter);
		choice = inlineCode(choice);
		votes = inlineCode(votes);
	}

	let title = data.proposalTitle;
	if (title.length > MAX_TITLE_LENGTH) {
		title = title.substring(0, MAX_TITLE_LENGTH).trim() + "...";
	}

	const titleUrl = `${proposalUrl}${data.proposalId}`;
	const description = `${voter} voted ${choice} with ${votes} votes.\n\n${reason}`;

	const voteEmbed = new EmbedBuilder().setColor("#00FFFF").setTitle(title).setURL(titleUrl).setDescription(description);

	return voteEmbed;
}

export function generateWithdrawNounsFromEscrowEmbed(data: Events.WithdrawNounsFromEscrow) {
	const title = `Nouns Withdrawn From Escrow!`;

	const withdrawer = linkToWallet(data.to);
	const nounsWithdrawn = inlineCode(data.tokenIds.length.toString());

	const description = `${withdrawer} withdrew ${nounsWithdrawn} tokens from escrow.`;

	const embed = new EmbedBuilder().setColor("#00FFFF").setTitle(title).setDescription(description);

	return embed;
}
