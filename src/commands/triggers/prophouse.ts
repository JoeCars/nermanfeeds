import { ChatInputCommandInteraction, SlashCommandBuilder, inlineCode } from "discord.js";
import Feeds from "../../utilities/Feeds";
import { NermanClient } from "../../types";

export default {
	data: new SlashCommandBuilder()
		.setName("trigger-prop-house")
		.setDescription("Trigger a PropHouse event.")
		.addStringOption((option) => {
			const events = Feeds.filterByGroup("PropHouse");
			return option
				.setName("event-name")
				.setDescription("PropHouse events.")
				.addChoices(...events)
				.setRequired(true);
		}),
	isHidden: process.env.DEPLOY_STAGE !== "development",
	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.isChatInputCommand()) {
			return;
		}

		const event = interaction.options.getString("event-name")!;

		console.log("commands/triggers/prop-house: Triggering event.", {
			event
		});

		const prophouse = (interaction.client as NermanClient).libraries.prophouse;

		switch (event) {
			case "prop-house-round-created":
				prophouse.trigger("RoundCreated", {
					creator: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					house: {
						id: "0x84ae050b4861c59f25be37352a66a3f1e0328aaf",
						name: "Nouns DAO JAPAN"
					},
					round: { id: "0xe3ce3916c95b6f2a23a0601426b2c47b960100d8" },
					kind: undefined,
					title: "Round 11",
					description: "",
					event: {} as any
				});
				break;
			case "prop-house-house-created":
				prophouse.trigger("HouseCreated", {
					creator: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					house: {
						id: "0x84ae050b4861c59f25be37352a66a3f1e0328aaf"
					},
					kind: undefined,
					event: {} as any
				});
				break;
			case "prop-house-vote-cast":
				prophouse.trigger("VoteCast", {
					voter: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					round: {
						id: "0xe3ce3916c95b6f2a23a0601426b2c47b960100d8",
						title: "Round 11 (Redo2)"
					},
					house: {
						id: "0x84ae050b4861c59f25be37352a66a3f1e0328aaf",
						name: "Nouns DAO JAPAN"
					},
					proposalTitle: "Order 66",
					proposalId: 1,
					votingPower: "42",
					event: {
						createdAt: 0,
						txHash: ""
					}
				});
				break;
			case "prop-house-proposal-submitted":
				prophouse.trigger("ProposalSubmitted", {
					proposalId: 1,
					proposer: { id: "0x281eC184E704CE57570614C33B3477Ec7Ff07243" },
					round: {
						id: "0xe3ce3916c95b6f2a23a0601426b2c47b960100d8",
						title: "Round 11 (Redo2)"
					},
					house: {
						id: "0x84ae050b4861c59f25be37352a66a3f1e0328aaf",
						name: "Nouns DAO JAPAN"
					},
					metaDataURI: "",
					title: "My Really Rad Proposal!",
					description: "",
					isCancelled: false,
					isWinner: false,
					winningPosition: undefined,
					votingPower: "",
					event: {
						createdAt: 0,
						txHash: ""
					}
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
