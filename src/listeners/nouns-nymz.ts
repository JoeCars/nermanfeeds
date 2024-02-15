import { Events, NermanClient } from "../types";
import Proposal from "../database/Proposal";
import * as embeds from "../embeds/nouns-nymz";

export default async function listenToNounsNymzEvents(client: NermanClient) {
	const { nounsNymz, router, nouns } = client.libraries;

	nounsNymz.on("NewPost", async (data) => {
		console.log("listeners/nouns-nymz: On NewPost.", { ...data });

		router.forEachFeedChannel("nouns-nymz-new-post", async (channel) => {
			const embed = await embeds.generateNewPostEmbed(data as Events.NounsNymzPost, nouns);
			channel.send({ embeds: [embed] });
		});
	});
}
