import { EmbedBuilder, hyperlink, inlineCode, bold } from "discord.js";

import { linkToWallet } from "../utilities/embeds";
import { Events } from "../types";
import { MAX_REASON_LENGTH } from "../constants";

export function generateProposalCreatedEmbed(data: Events.SnapshotProposal) {
	const author = linkToWallet(data.author);
	const spaceUrl = `https://snapshot.org/#/${data.space.id}`;
	const space = hyperlink(data.space.name, spaceUrl);
	const proposalUrl = spaceUrl + `/proposal/${data.id}`;
	let body = data.body;
	if (body.length > MAX_REASON_LENGTH) {
		body = body.substring(0, MAX_REASON_LENGTH).trim() + "...";
	}

	const description = `${author} created a new proposal in ${space}!.\n\n${bold(data.title)}\n\n${body}`;

	const embed = new EmbedBuilder()
		.setColor("#00FFFF")
		.setTitle("Snapshot | New Proposal Created")
		.setURL(proposalUrl)
		.setDescription(description);

	return embed;
}

export function generateProposalCompletedEmbed(data: Events.SnapshotProposal) {
	const spaceUrl = `https://snapshot.org/#/${data.space.id}`;
	const space = hyperlink(data.space.name, spaceUrl);
	const proposalUrl = spaceUrl + `/proposal/${data.id}`;
	const proposal = data.title;

	const results = _formatChoiceScores(data.choices, data.scores);

	const description = `${space}'s ${proposal} is now closed!\n\n${bold("Results:")}\n${results}`;

	const embed = new EmbedBuilder()
		.setColor("#00FFFF")
		.setTitle("Snapshot | Proposal Complete")
		.setURL(proposalUrl)
		.setDescription(description);

	return embed;
}

export function generateVoteCastEmbed(data: Events.SnapshotVote) {
	const voter = linkToWallet(data.voter);
	const choice = inlineCode(data.proposal.choices[data.choice]);
	const votingPower = inlineCode(data.votingPower.toString());
	const spaceUrl = `https://snapshot.org/#/${data.space.id}`;
	const space = hyperlink(data.space.name, spaceUrl);
	const proposalUrl = spaceUrl + `/proposal/${data.id}`;
	const proposal = hyperlink(data.proposal.title, proposalUrl);
	let reason = data.reason;
	if (reason.length > MAX_REASON_LENGTH) {
		reason = reason.substring(0, MAX_REASON_LENGTH).trim() + "...";
	}

	const results = _formatChoiceScores(data.proposal.choices, data.proposal.scores);

	const description = `${voter} cast ${votingPower} votes for ${choice} in ${space}'s ${proposal}!\n\n${reason}\n\n${bold(
		"Current Status:"
	)}\n${results}`;

	const embed = new EmbedBuilder().setColor("#00FFFF").setTitle("Snapshot | New Vote Cast").setDescription(description);

	return embed;
}

export function _formatChoiceScores(choices: string[], scores: number[]) {
	let output = "";
	for (let i = 0; i < choices.length; ++i) {
		output += `- ${bold(choices[i])}: ${scores[i].toFixed(2)}\n`;
	}
	return output;
}
