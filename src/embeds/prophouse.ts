import { EmbedBuilder, hyperlink, inlineCode } from "discord.js";

import { linkToWallet } from "../utilities/embeds";
import { Events } from "../types";

export function generateRoundCreatedEmbed(data: Events.PropHouseRoundCreated) {
	const creator = linkToWallet(data.creator);
	const houseUrl = `https://prop.house/${data.house.id}`;
	const house = hyperlink(data.house.name ?? data.house.id, houseUrl);
	const roundUrl = `https://prop.house/${data.round.id}`;
	const round = hyperlink(data.title, roundUrl);

	const description = `${creator} created a new round in ${house}!.\n\n${round}`;

	const embed = new EmbedBuilder()
		.setColor("#00FFFF")
		.setTitle("PropHouse | New Round Created!")
		.setURL(roundUrl)
		.setDescription(description);

	return embed;
}

export function generateHouseCreatedEmbed(data: Events.PropHouseHouseCreated) {
	const url = `https://prop.house/${data.house.id}`;
	const creator = linkToWallet(data.creator);

	const description = `${creator} created a new house!`;

	const embed = new EmbedBuilder()
		.setColor("#00FFFF")
		.setTitle("PropHouse | New House Created!")
		.setURL(url)
		.setDescription(description);

	return embed;
}

export function generateVoteCastEmbed(data: Events.PropHouseVoteCast) {
	const voter = linkToWallet(data.voter);
	const votes = inlineCode(data.votingPower);
	const proposalUrl = `https://prop.house/${data.round.id}/${data.proposalId}`;
	const proposal = hyperlink(data.proposalTitle, proposalUrl);
	const roundUrl = `https://prop.house/${data.round.id}`;
	const round = hyperlink(data.round.title, roundUrl);
	const houseUrl = `https://prop.house/${data.house.id}`;
	const house = hyperlink(data.house.name ?? data.house.id, houseUrl);

	const description = `${voter} cast ${votes} votes for ${proposal} in ${house}'s ${round}!`;

	const embed = new EmbedBuilder()
		.setColor("#00FFFF")
		.setTitle("PropHouse | New Vote Cast!")
		.setURL(proposalUrl)
		.setDescription(description);

	return embed;
}

export function generateProposalSubmittedEmbed(data: Events.PropHouseProposalSubmitted) {
	const proposer = linkToWallet(data.proposer);

	const proposalUrl = `https://prop.house/${data.round.id}/${data.proposalId}`;
	const proposal = hyperlink(data.title, proposalUrl);
	const roundUrl = `https://prop.house/${data.round.id}`;
	const round = hyperlink(data.round.title, roundUrl);
	const houseUrl = `https://prop.house/${data.house.id}`;
	const house = hyperlink(data.house.name ?? data.house.id, houseUrl);

	const description = `${proposer} created a new proposal in ${house}'s ${round}!\n\n${proposal}`;

	const embed = new EmbedBuilder()
		.setColor("#00FFFF")
		.setTitle("PropHouse | New Proposal Submitted!")
		.setURL(proposalUrl)
		.setDescription(description);

	return embed;
}
