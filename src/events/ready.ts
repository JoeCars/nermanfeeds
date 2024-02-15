import { Events } from "discord.js";

import listenToFederationEvents from "../listeners/federation";
import listenToNounsEvents from "../listeners/nouns";
import listenToNounsNymzEvents from "../listeners/nouns-nymz";
import listenToNounsForkEvents from "../listeners/nouns-fork";
import listenToPropdatesEvents from "../listeners/propdates";
import listenToLilNounsEvents from "../listeners/lil-nouns";
import listenToProphouseEvents from "../listeners/prophouse";
import listenToFarcasterEvents from "../listeners/farcaster";
import { NermanClient } from "../types";

export default {
	name: Events.ClientReady,
	once: true,
	execute(client: NermanClient) {
		console.log(`events/ready: Ready! Logged in as ${client.user?.tag} in ${process.env.DEPLOY_STAGE} mode.`);

		listenToFarcasterEvents(client);
		listenToFederationEvents(client);
		listenToLilNounsEvents(client);
		listenToNounsForkEvents(client);
		listenToNounsNymzEvents(client);
		listenToNounsEvents(client);
		listenToPropdatesEvents(client);
		listenToProphouseEvents(client);
	}
};
