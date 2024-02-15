import { NermanClient } from "../types";
import Proposal from "../database/Proposal";
import * as embeds from "../embeds/farcaster";

export default async function listenToFarcasterEvents(client: NermanClient) {
	const { farcaster, router, ensCache } = client.libraries;

	farcaster.on("NounsCast", (data) => {
		console.log("listeners/farcaster: On NounsCast.", {
			...data
		});

		router.forEachFeedChannel("farcaster-nouns-cast", (channel) => {
			const embed = embeds.generateNounsCastEmbed(data);
			channel.send({ embeds: [embed] });
		});
	});
}
