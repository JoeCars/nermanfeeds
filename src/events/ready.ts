import { Events } from "discord.js";

import listenToFederationEvents from "../listeners/federation";
import listenToNounsEvents from "../listeners/nouns";
import listenToNounsNymzEvents from "../listeners/nouns-nymz";
import listenToNounsForkEvents from "../listeners/nouns-fork";
import listenToPropdatesEvents from "../listeners/propdates";
import listenToLilNounsEvents from "../listeners/lil-nouns";
import listenToFarcasterEvents from "../listeners/farcaster";
import listenToSnapshotEvents from "../listeners/snapshot";
import { NermanClient } from "../types";
import SnapshotSpace from "../database/SnapshotSpace";

export default {
	name: Events.ClientReady,
	once: true,
	async execute(client: NermanClient) {
		console.log(`events/ready: Ready! Logged in as ${client.user?.tag} in ${process.env.DEPLOY_STAGE} mode.`);

		listenToFarcasterEvents(client);
		listenToFederationEvents(client);
		listenToLilNounsEvents(client);
		listenToNounsForkEvents(client);
		listenToNounsNymzEvents(client);
		listenToNounsEvents(client);
		listenToPropdatesEvents(client);
		listenToSnapshotEvents(client);

		try {
			const spaces = await SnapshotSpace.find().exec();
			for (const space of spaces) {
				client.libraries.snapshot.addSpace(space.spaceId);
			}
			console.debug("events/ready: Snapshot spaces.", client.libraries.snapshot.spaceIds);
		} catch (error) {
			console.error("events/ready: Error when retrieving Snapshot spaces.", error);
		}
	}
};
