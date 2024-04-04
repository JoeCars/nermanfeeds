import { ChatInputCommandInteraction, SlashCommandBuilder, inlineCode } from "discord.js";
import Feeds from "../../utilities/Feeds";
import { NermanClient } from "../../types";
import { WEI_PER_ETH } from "../../constants";

export default {
	data: new SlashCommandBuilder()
		.setName("trigger-nouns")
		.setDescription("Trigger a Nouns event.")
		.addStringOption((option) => {
			const events = Feeds.filterByGroup("Nouns");
			return option
				.setName("event-name")
				.setDescription("Nouns events.")
				.addChoices(...events)
				.setRequired(true);
		}),
	isHidden: process.env.DEPLOY_STAGE !== "development",
	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.isChatInputCommand()) {
			return;
		}

		const event = interaction.options.getString("event-name")!;

		console.log("commands/triggers/nouns: Triggering event.", {
			event
		});

		const nouns = (interaction.client as NermanClient).libraries.nouns;

		switch (event) {
			case "nouns-auction-house-auction-bid":
				nouns.trigger("AuctionBid", {
					id: 117,
					amount: BigInt(42 * WEI_PER_ETH),
					bidder: {
						id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243"
					},
					extended: false,
					event: {} as any
				});
				break;
			case "nouns-auction-house-auction-created":
				nouns.trigger("AuctionCreated", {
					id: 117,
					event: {} as any,
					startTime: 0n,
					endTime: 0n
				});
				break;
			case "nouns-auction-house-auction-end":
				nouns.trigger("AuctionEnd", {
					id: 420,
					amount: `42.0`,
					address: "0x281eC184E704CE57570614C33B3477Ec7Ff07243"
				} as any);
				break;
			case "nouns-token-delegate-changed":
				nouns.trigger("DelegateChanged", {
					delegator: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					fromDelegate: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					toDelegate: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					numOfVotesChanged: 0,
					event: {} as any
				});
				break;
			case "nouns-token-delegate-changed-no-zero":
				nouns.trigger("DelegateChanged", {
					delegator: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					fromDelegate: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					toDelegate: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					numOfVotesChanged: 10,
					event: {} as any
				});
				break;
			case "nouns-token-noun-created":
				nouns.trigger("NounCreated", {
					id: 117,
					seed: {} as any,
					event: {} as any
				});
				break;
			case "nouns-token-transfer":
				nouns.trigger("Transfer", {
					from: { id: "0x281ec184e704ce57570614c33b3477ec7ff07243" },
					to: { id: "0x281ec184e704ce57570614c33b3477ec7ff07243" },
					tokenId: 117,
					event: {} as any
				});
				break;
			case "nouns-dao-proposal-created":
				nouns.trigger("ProposalCreatedWithRequirements", {
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
			case "nouns-dao-proposal-status-change":
				nouns.trigger("ProposalCanceled", {
					id: 117,
					event: {} as any
				});
				break;
			case "nouns-dao-proposal-vote-cast-no-zero":
				nouns.trigger("VoteCast", {
					voter: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					proposalId: 117,
					supportDetailed: 0,
					votes: 4,
					reason: "Dunno.",
					event: {} as any
				});
				break;
			case "nouns-dao-proposal-vote-cast-only-zero":
				nouns.trigger("VoteCast", {
					voter: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					proposalId: 117,
					supportDetailed: 0,
					votes: 0,
					reason: "Rad.",
					event: {} as any
				});
				break;
			case "nouns-dao-escrowed-to-fork":
				nouns.trigger("EscrowedToFork", {
					forkId: 0,
					owner: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					tokenIds: [117, 112],
					proposalIds: [],
					reason: "Bad.",
					event: {} as any
				});
				break;
			case "nouns-dao-execute-fork":
				nouns.trigger("ExecuteFork", {
					forkId: 0,
					forkTreasury: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					forkToken: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					forkEndTimestamp: 110n,
					tokensInEscrow: 240n,
					event: {} as any
				});
				break;
			case "nouns-dao-join-fork":
				nouns.trigger("JoinFork", {
					forkId: 0,
					owner: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					tokenIds: [117, 420, 115],
					proposalIds: [],
					reason: "Really good reason.",
					event: {} as any
				});
				break;
			case "nouns-dao-withdraw-nouns-from-escrow":
				nouns.trigger("DAOWithdrawNounsFromEscrow", {
					tokenIds: [117, 420, 115],
					to: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					event: {} as any
				});
				break;
			case "nouns-dao-data-proposal-candidate-feedback-sent":
				nouns.trigger("CandidateFeedbackSent", {
					msgSender: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					proposer: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					slug: "death-star-construction",
					support: 0,
					reason: "Wow!",
					event: {} as any
				});
				break;
			case "nouns-dao-data-proposal-candidate-canceled":
				nouns.trigger("ProposalCandidateCanceled", {
					msgSender: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					slug: "death-star-construction",
					event: {} as any
				});
				break;
			case "nouns-dao-data-proposal-candidate-created":
				nouns.trigger("ProposalCandidateCreated", {
					msgSender: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					targets: [],
					values: [],
					signatures: [],
					calldatas: [],
					description: "Here's the plan...",
					slug: "death-star-construction",
					proposalIdToUpdate: 0,
					encodedProposalHash: "",
					event: {} as any
				});
				break;
			case "nouns-dao-data-proposal-candidate-updated":
				nouns.trigger("ProposalCandidateUpdated", {
					msgSender: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					targets: [],
					values: [],
					signatures: [],
					calldatas: [],
					description: "Wow! Isn't that incredible?",
					slug: "death-star-construction",
					proposalIdToUpdate: 0,
					encodedProposalHash: "",
					reason: "Had to change it.",
					event: {} as any
				});
				break;
			case "nouns-dao-data-signature-added":
				nouns.trigger("SignatureAdded", {
					signer: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					sig: "",
					expirationTimestamp: 0n,
					proposer: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					slug: "death-star-construction",
					proposalIdToUpdate: 1,
					encodedPropHash: "",
					sigDigest: "",
					reason: "Seems like a good idea to me.",
					event: {} as any
				});
				break;
			case "nouns-dao-data-proposal-feedback-sent":
				nouns.trigger("FeedbackSent", {
					msgSender: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					proposalId: 117,
					support: 1,
					reason: "Seems aight.",
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
