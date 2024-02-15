import { Events, ChatInputCommandInteraction } from "discord.js";
import { NermanClient } from "../types";

export default {
	name: Events.InteractionCreate,
	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.isChatInputCommand()) {
			return;
		}

		const command = (interaction.client as NermanClient).commands.get(interaction.commandName);
		if (!command) {
			return;
		}

		let commandName = interaction.commandName;

		const subCommand = interaction.options?.getSubcommand(false);

		try {
			if (subCommand) {
				commandName = `${interaction.commandName}.${subCommand}`;
				const subCommandGroup = interaction.options.getSubcommandGroup(false);
				if (subCommandGroup) {
					commandName = `${interaction.commandName}.${subCommandGroup}.${subCommand}`;
				}

				const subCommandFile = (interaction.client as NermanClient).subCommands.get(commandName);
				if (!subCommandFile) {
					throw Error("Invalid subcommand");
				}

				await subCommandFile.execute(interaction);
			}

			await command.execute(interaction);

			console.log("events/interaction-create: Finished executing interaction created event.", {
				commandName: commandName,
				channelId: interaction.channelId,
				guildId: interaction.guildId,
				userId: interaction.user.id
			});
		} catch (error) {
			console.warn("events/interaction-create: Encountered an error. Attempting to defer.", error);

			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: (error as any).message || "There was an error while executing this command!",
					ephemeral: true
				});
			} else {
				await interaction.reply({
					content: (error as any).message || "There was an error while executing this command!",
					ephemeral: true
				});
			}
		}
	}
};
