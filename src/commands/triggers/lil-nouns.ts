import { ChatInputCommandInteraction, SlashCommandBuilder, inlineCode } from "discord.js";
import Feeds from "../../utilities/Feeds";
import { NermanClient } from "../../types";
import { WEI_PER_ETH } from "../../constants";

export default {
	data: new SlashCommandBuilder()
		.setName("trigger-lil-nouns")
		.setDescription("Trigger a LilNouns event.")
		.addStringOption((option) => {
			const events = Feeds.filterByGroup("LilNouns");
			return option
				.setName("event-name")
				.setDescription("LilNouns events.")
				.addChoices(...events)
				.setRequired(true);
		}),
	isHidden: process.env.DEPLOY_STAGE !== "development",
	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.isChatInputCommand()) {
			return;
		}

		const event = interaction.options.getString("event-name")!;

		console.log("commands/triggers/lil-nouns: Triggering event.", {
			event
		});

		const lilNouns = (interaction.client as NermanClient).libraries.lilNouns;

		switch (event) {
			case "lil-nouns-auction-bid":
				lilNouns.trigger("AuctionBid", {
					id: 117,
					amount: BigInt(42 * WEI_PER_ETH),
					bidder: {
						id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243"
					},
					extended: false,
					event: {} as any
				});
				break;
			case "lil-nouns-auction-created":
				lilNouns.trigger("AuctionCreated", {
					id: 117,
					event: {} as any,
					startTime: 0n,
					endTime: 0n
				});
				break;
			case "lil-nouns-proposal-created":
				lilNouns.trigger("ProposalCreatedWithRequirements", {
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
			case "lil-nouns-proposal-status-change":
				lilNouns.trigger("ProposalCanceled", {
					id: 117,
					event: {} as any
				});
				break;
			case "lil-nouns-vote-cast":
				lilNouns.trigger("VoteCast", {
					voter: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					proposalId: 117,
					supportDetailed: 0,
					votes: 4,
					reason: "",
					event: {} as any
				});
				break;
			case "lil-nouns-transfer":
				lilNouns.trigger("Transfer", {
					from: { id: "0x281ec184e704ce57570614c33b3477ec7ff07243" },
					to: { id: "0x281ec184e704ce57570614c33b3477ec7ff07243" },
					tokenId: 117,
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
