import { ChatInputCommandInteraction } from "discord.js";

import remove from "../subcommands/remove";

export default {
	subCommand: "snapshot.remove",

	execute(interaction: ChatInputCommandInteraction) {
		remove.execute(interaction);
	}
};
