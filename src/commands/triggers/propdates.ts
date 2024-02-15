import { ChatInputCommandInteraction, SlashCommandBuilder, inlineCode } from "discord.js";
import Feeds from "../../utilities/Feeds";
import { NermanClient } from "../../types";

export default {
	data: new SlashCommandBuilder()
		.setName("trigger-propdates")
		.setDescription("Trigger a Propdates event.")
		.addStringOption((option) => {
			const events = Feeds.filterByGroup("Propdates");
			return option
				.setName("event-name")
				.setDescription("Propdates events.")
				.addChoices(...events)
				.setRequired(true);
		}),
	isHidden: process.env.DEPLOY_STAGE !== "development",
	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.isChatInputCommand()) {
			return;
		}

		const event = interaction.options.getString("event-name")!;

		console.log("commands/triggers/propdates: Triggering event.", {
			event
		});

		const propdates = (interaction.client as NermanClient).libraries.propdates;

		switch (event) {
			case "propdates-post-update":
				propdates.trigger("PostUpdate", {
					propId: 117,
					isCompleted: false,
					update: "Made all the changes!",
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
