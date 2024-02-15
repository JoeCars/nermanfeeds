import { ChatInputCommandInteraction } from "discord.js";

import remove from "../subcommands/remove";

export default {
	subCommand: "federation.remove",

	execute(interaction: ChatInputCommandInteraction) {
		remove.execute(interaction);
	}
};
