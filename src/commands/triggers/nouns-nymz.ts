import { ChatInputCommandInteraction, SlashCommandBuilder, inlineCode } from "discord.js";
import Feeds from "../../utilities/Feeds";
import { NermanClient } from "../../types";
import { WEI_PER_ETH } from "../../constants";

export default {
	data: new SlashCommandBuilder()
		.setName("trigger-nouns-nymz")
		.setDescription("Trigger a NounsNymz event.")
		.addStringOption((option) => {
			const events = Feeds.filterByGroup("NounsNymz");
			return option
				.setName("event-name")
				.setDescription("NounsNymz events.")
				.addChoices(...events)
				.setRequired(true);
		}),
	isHidden: process.env.DEPLOY_STAGE !== "development",
	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.isChatInputCommand()) {
			return;
		}

		const event = interaction.options.getString("event-name")!;

		console.log("commands/triggers/nouns-nymz: Triggering event.", {
			event
		});

		const nounsNymz = (interaction.client as NermanClient).libraries.nounsNymz;

		switch (event) {
			case "nouns-nymz-new-post":
				nounsNymz.trigger("NewPost", {
					doxed: false,
					id: "0x0b7a60408bf4ac733205c837d8f70a9932550cb230dad15e60064a9d4cdac723",
					title: "The Rabbit Hole",
					body: "Reply to replies only. The good conversations start 100 replies deep.",
					timestamp: "",
					userId: "Percy-81721f3625a62ab421fac6ff2369f8572ff06f7973480c4a0f3077a99d7eea93",
					depth: 0,
					upvotes: [],
					_count: {
						descendants: 0
					}
				} as any);
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
