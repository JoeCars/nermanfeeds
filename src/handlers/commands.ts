import { Collection, REST, Routes, RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";

import { NermanClient, NermanCommand, NermanSubcommand } from "../types";
import { getFiles } from "../utilities/handlers";

export default async function handleCommands(client: NermanClient) {
	client.commands = new Collection();
	client.subCommands = new Collection();

	const commands = await getFiles("commands");

	console.log("handlers/commands: command files.", commands);

	if (commands.length === 0) {
		throw new Error("No slash commands provided");
	}

	const commandsToRegister: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

	for (const commandFile of commands) {
		const command: NermanCommand | NermanSubcommand = (await import(commandFile)).default;

		if (command.isHidden) {
			continue;
		}

		if ((command as NermanSubcommand).subCommand) {
			client.subCommands.set((command as NermanSubcommand).subCommand, command as NermanSubcommand);
		} else if ((command as NermanCommand).data) {
			commandsToRegister.push((command as NermanCommand).data.toJSON());
			client.commands.set((command as NermanCommand).data.name, command as NermanCommand);
		} else {
			throw new Error(
				`${commandFile} failed to load because it does not have a "subCommand", "data", or "execute" property.`
			);
		}
	}

	const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

	console.debug("handlers/commands: Number of commands being registered:", commandsToRegister.length);

	(async () => {
		try {
			await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), {
				body: commandsToRegister
			});

			console.log("handlers/commands: Successfully registered application commands!");
		} catch (error) {
			console.error(error);
		}
	})();
}
