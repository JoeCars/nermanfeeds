import { ChatInputCommandInteraction, TextChannel } from "discord.js";

import FeedConfig from "../../../database/FeedConfig";
import Feeds from "../../../utilities/Feeds";
import { NermanClient } from "../../../types";

export default {
	subCommand: "prophouse.add",

	async execute(interaction: ChatInputCommandInteraction) {
		console.log("commands/feeds/prophouse: Adding new feed.", {
			userId: interaction.user.id,
			guildId: interaction.guildId,
			channelId: interaction.channelId
		});

		const channel = interaction.options.getChannel("channel") ?? interaction.channel;
		const event = interaction.options.getString("event");
		const options = {
			prophouse: {
				permittedHouses: (await fetchPermittedHouses(interaction))!
			}
		};

		if (!channel) {
			throw new Error("No channel.");
		}
		if (!event) {
			throw new Error("No event");
		}
		if (!options) {
			throw new Error("No options");
		}

		const eventResults = [];
		if (event === "all") {
			const results = await FeedConfig.registerAllProjectFeeds(interaction.guildId!, channel.id, "PropHouse", options);
			eventResults.push(...results);
		} else {
			const results = await FeedConfig.registerFeed(interaction.guildId!, channel.id, event, options);
			eventResults.push(results);
		}

		const resultMessage = Feeds.formatResultMessage(eventResults, channel as TextChannel);

		await interaction.reply({
			ephemeral: true,
			content: resultMessage
		});

		console.log("commands/feeds/prophouse: Finished adding new feed.", {
			userId: interaction.user.id,
			guildId: interaction.guildId,
			channelId: interaction.channelId
		});
	}
};

async function fetchPermittedHouses(interaction: ChatInputCommandInteraction) {
	const houses = interaction.options.getString("house-addresses");
	if (!houses) {
		return undefined;
	}

	const permittedHouses = houses.split(",").map((address) => {
		return {
			address: address.trim(),
			name: "",
			url: ""
		};
	});

	const propHouse = (interaction.client as NermanClient).libraries.prophouse;
	for (const house of permittedHouses) {
		const houseDetails = await propHouse.prophouse.query.getHouse(house.address);
		house.name = houseDetails.name ?? house.address;
		house.url = `https://prop.house/${house.address}`;
	}

	return permittedHouses;
}
