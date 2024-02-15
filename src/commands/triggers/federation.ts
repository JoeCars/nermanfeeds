import { ChatInputCommandInteraction, SlashCommandBuilder, inlineCode } from "discord.js";
import Feeds from "../../utilities/Feeds";
import { NermanClient } from "../../types";
import { WEI_PER_ETH } from "../../constants";

export default {
	data: new SlashCommandBuilder()
		.setName("trigger-federation")
		.setDescription("Trigger a Federation event.")
		.addStringOption((option) => {
			const events = Feeds.filterByGroup("Federation");
			return option
				.setName("event-name")
				.setDescription("Federation events.")
				.addChoices(...events)
				.setRequired(true);
		}),
	isHidden: process.env.DEPLOY_STAGE !== "development",
	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.isChatInputCommand()) {
			return;
		}

		const event = interaction.options.getString("event-name")!;

		console.log("commands/triggers/federation: Triggering event.", {
			event
		});

		const federation = (interaction.client as NermanClient).libraries.federation;

		switch (event) {
			case "federation-bid-placed":
				federation.trigger("BidPlaced", {
					dao: { id: "0x6f3E6272A167e8AcCb32072d08E0957F9c79223d" },
					propId: 346,
					support: 1,
					amount: BigInt(0.42 * WEI_PER_ETH),
					bidder: { id: "0x2B0E9aA394209fa8D783C9e8cbFb08A15C019cdF" },
					reason: ""
				});
				break;
			case "federation-vote-cast":
				federation.trigger("VoteCast", {
					dao: { id: "0x6f3E6272A167e8AcCb32072d08E0957F9c79223d" },
					propId: 346,
					support: 1,
					amount: BigInt(0.42 * WEI_PER_ETH),
					bidder: { id: "0x2B0E9aA394209fa8D783C9e8cbFb08A15C019cdF" }
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
