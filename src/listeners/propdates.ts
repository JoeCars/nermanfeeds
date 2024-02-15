import { NermanClient, Events } from "../types";
import Proposal from "../database/Proposal";
import * as embeds from "../embeds/propdates";

export default async function listenToPropdatesEvents(client: NermanClient) {
	const { propdates, router, ensCache } = client.libraries;

	propdates.on("PostUpdate", async (data) => {
		console.log("listeners/propdates: On PostUpdate.", { ...data });

		const proposalTitle = await Proposal.fetchProposalTitle(data.propId, "Nouns");

		const embedData: Events.PropdatesPostUpdate = {
			...data,
			proposalTitle
		};

		console.log("listeners/propdates: PostUpdate embed data.", { ...embedData });
		router.forEachFeedChannel("propdates-post-update", (channel) => {
			const embed = embeds.generatePostUpdateEmbed(embedData);
			channel.send({ embeds: [embed] });
		});
	});
}
