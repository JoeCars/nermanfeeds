import { ChatInputCommandInteraction, SlashCommandBuilder, inlineCode } from "discord.js";
import Feeds from "../../utilities/Feeds";
import { NermanClient } from "../../types";

export default {
	data: new SlashCommandBuilder()
		.setName("trigger-snapshot")
		.setDescription("Trigger a Snapshot event.")
		.addStringOption((option) => {
			const events = Feeds.filterByGroup("Snapshot");
			return option
				.setName("event-name")
				.setDescription("Snapshot events.")
				.addChoices(...events)
				.setRequired(true);
		}),
	isHidden: process.env.DEPLOY_STAGE !== "development",
	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.isChatInputCommand()) {
			return;
		}

		const event = interaction.options.getString("event-name")!;

		console.log("commands/triggers/snapshot: Triggering event.", {
			event
		});

		const snapshot = (interaction.client as NermanClient).libraries.snapshot;

		switch (event) {
			case "snapshot-proposal-created":
				snapshot.trigger("ProposalCreated", {
					id: "0x58adfa5e1c5b081760de8dad8131c6c4e0ff70bcc4cd6ecb6e13a68bfa9eabe1",
					title: "cohort_4",
					body: "DAOpunks!\n\nWe are getting ready for our fifth grant round this year, cohort_4.\n\nAll applications that were submitted are put up for this vote.\n\nVoting will be a weighted voting, allowing you to allocate a percentage of the DAOpunks you own to whoever you choose. You can choose to allocate all 100% of your one or more DAOpunks or IAMA NFTs to 1 applicant, you can split it evenly across 2 applicants, or however many splits you so desire. The choice is yours. The vote is shielded until the end of the snapshot period and final results will only be shown once the voting period is over.\n\nThe top 3 applicants with the most votes will be selected to participate in cohort_4. Each of whom will receive 1 ETH from our treasury.\n\nPlease review each application closely. Your vote could change the course of a life. Thank you everyone and good luck!.\n\nRead all the applications for cohort_4 here:\nhttps://principled-viburnum-d09.notion.site/ca5711b1957a441f8ae2e61261060a7a?v=8409faad0f6547a69be244acbec90515\n\nFor your convenience each Applicant Name listed in the above database matches the Applicant Name listed for this vote.\n\nYou can also listen the AMAs that were conducted with the applicants here: https://paragraph.xyz/@daopunks/cohort_4-amas",
					choices: [
						"eurekajohn",
						"KAF#6633",
						"raybankless.eth",
						"evilpotato.eth",
						"i3#3875",
						"trewkat",
						"ApeironCreations#9049",
						"msjoedor",
						"thinkDecade",
						"auntiehomie",
						"saltypickle.",
						"@oluwasijibom6263",
						"@memebrains",
						"web3ocean",
						"joseacabrerav",
						"vanessagil"
					],
					startTime: 1708848000,
					endTime: 1709452800,
					createdTime: 1708722194,
					snapshot: "19292834",
					state: "pending",
					author: { id: "0x15259752Ba5e5708657B2659Aacb543f101D3355" },
					quorum: 0,
					scores: [],
					votes: 0,
					space: {
						id: "daopunks.eth",
						name: "DAOpunks"
					}
				});
				break;
			case "snapshot-proposal-completed":
				snapshot.trigger("ProposalCompleted", {
					id: "0x1c971cb1b0965da21a65f14639cdd6a8fd1bc830c1c60b995d3fb00964a1e370",
					title: "Will the number of active Ethereum addresses exceed 1 million by the end of Q2?",
					body: "Will the number of active Ethereum addresses exceed 1 million by the end of Q2?",
					choices: ["Yes", "No", "Not sure"],
					startTime: 1708208597,
					endTime: 1708726997,
					createdTime: 1708208597,
					snapshot: "19250515",
					state: "closed",
					author: { id: "0xBc7E700Cf6e6d51eb03C53632d13caE6c6686f2F" },
					quorum: 0,
					scores: [0, 1, 2],
					votes: 0,
					space: {
						id: "thelanddaoprop.eth",
						name: "TheLandSafe Proposals"
					}
				});
				break;
			case "snapshot-vote-cast":
				snapshot.trigger("VoteCast", {
					id: "0xeb2a03d36085375d5cb56c2ebd2d6f57454576fc1548fb7803983c0221037f67",
					voter: { id: "0x2B888954421b424C5D3D9Ce9bB67c9bD47537d12" },
					votingPower: 146001.1493853363,
					created: 1708359318,
					choice: 1,
					reason: "",
					space: {
						id: "safe.eth",
						name: "SafeDAO"
					},
					proposal: {
						id: "0xdb118cf53232045e9ac1da948789988c567532b9a472446a99e44da66a0055e0",
						title: "[SEP #20] [OBRA] Formalizing the Guardian Role onchain with Hats Protocol - Hats Protocol",
						choices: ["Accept", "Make no changes", "Abstain"],
						quorum: 10000000,
						scores: [16484970.573796852, 4188.591314958363, 15336.082661534938],
						votes: 427
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
