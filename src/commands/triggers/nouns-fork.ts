import { ChatInputCommandInteraction, SlashCommandBuilder, inlineCode } from "discord.js";
import Feeds from "../../utilities/Feeds";
import { NermanClient } from "../../types";
import { WEI_PER_ETH } from "../../constants";

export default {
	data: new SlashCommandBuilder()
		.setName("trigger-nouns-fork")
		.setDescription("Trigger a NounsFork event.")
		.addStringOption((option) => {
			const events = Feeds.filterByGroup("NounsFork");
			return option
				.setName("event-name")
				.setDescription("NounsForkF events.")
				.addChoices(...events)
				.setRequired(true);
		}),
	isHidden: process.env.DEPLOY_STAGE !== "development",
	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.isChatInputCommand()) {
			return;
		}

		const event = interaction.options.getString("event-name")!;

		console.log("commands/triggers/nouns-fork: Triggering event.", {
			event
		});

		const nounsFork = (interaction.client as NermanClient).libraries.nounsFork;

		switch (event) {
			case "nouns-fork-auction-house-auction-created":
				nounsFork.trigger("AuctionCreated", {
					id: 117,
					event: {} as any,
					startTime: 0n,
					endTime: 0n
				});
				break;
			case "nouns-fork-auction-house-auction-bid":
				nounsFork.trigger("AuctionBid", {
					id: 117,
					amount: BigInt(42 * WEI_PER_ETH),
					bidder: {
						id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243"
					},
					extended: false,
					event: {} as any
				});
				break;
			case "nouns-fork-proposal-created":
				nounsFork.trigger("ProposalCreatedWithRequirements", {
					id: 117,
					proposer: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					targets: [],
					values: [],
					signatures: [],
					calldatas: [],
					startBlock: 0n,
					endBlock: 0n,
					description: "# The Lost Continent \n",
					event: {} as any,
					proposalThreshold: 0,
					quorumVotes: 0
				});
				break;
			case "nouns-fork-proposal-status-change":
				nounsFork.trigger("ProposalCanceled", {
					id: 117,
					event: {} as any
				});
				break;
			case "nouns-fork-quit":
				nounsFork.trigger("Quit", {
					msgSender: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					tokenIds: [117, 420],
					event: {} as any
				});
				break;
			case "nouns-fork-vote-cast":
				nounsFork.trigger("VoteCast", {
					voter: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					proposalId: 117,
					supportDetailed: 0,
					votes: 4,
					reason: "",
					event: {} as any
				});
				break;
			case "nouns-fork-tokens-delegate-changed":
				nounsFork.trigger("DelegateChanged", {
					delegator: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					fromDelegate: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					toDelegate: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					numOfVotesChanged: 10,
					event: {} as any
				});
				break;
			case "nouns-fork-tokens-transfer":
				nounsFork.trigger("Transfer", {
					from: { id: "0x281ec184e704ce57570614c33b3477ec7ff07243" },
					to: { id: "0x281ec184e704ce57570614c33b3477ec7ff07243" },
					tokenId: 117,
					event: {} as any
				});
				break;
			case "nouns-fork-tokens-noun-created":
				nounsFork.trigger("NounCreated", {
					id: 117,
					seed: {} as any,
					event: {} as any
				});
				break;
			default:
				throw new Error(`${event} is not a valid event.`);
		}

		interaction.reply({
			content: `${inlineCode(event)} triggered!`,
			ephemeral: true
		});
	}
};
