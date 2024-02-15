import { ChatInputCommandInteraction, SlashCommandBuilder, inlineCode } from "discord.js";
import Feeds from "../../utilities/Feeds";
import { NermanClient } from "../../types";

export default {
	data: new SlashCommandBuilder()
		.setName("trigger-farcaster")
		.setDescription("Trigger a Farcaster event.")
		.addStringOption((option) => {
			const farcasterEvents = Feeds.filterByGroup("Farcaster");
			return option
				.setName("event-name")
				.setDescription("Farcaster events.")
				.addChoices(...farcasterEvents)
				.setRequired(true);
		}),
	isHidden: process.env.DEPLOY_STAGE !== "development",
	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.isChatInputCommand()) {
			return;
		}

		const event = interaction.options.getString("event-name")!;

		console.log("commands/triggers/farcaster: Triggering event.", {
			event
		});

		const farcaster = (interaction.client as NermanClient).libraries.farcaster;

		switch (event) {
			case "farcaster-nouns-cast":
				farcaster.trigger("NounsCast", {
					text: "Who's on the Tal'Dorei Council?",
					author: "toadyhawk.eth",
					event: {
						hash: "0xd0d373a1",
						signature: "",
						signer: "",
						fid: 0,
						network: "",
						timestamp: 0,
						type: ""
					},
					embeds: [],
					mentions: [],
					mentionsPositions: []
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
