import "dotenv/config";
import { Client, Events, GatewayIntentBits } from "discord.js";
import mongoose from "mongoose";
import { FederationNounsPool, Nouns, NounsNymz, NounsFork, Propdates, LilNouns, PropHouse, Farcaster } from "nerman";

import { NermanClient } from "./types";
import handleCommands from "./handlers/commands";
import ENSCache from "./utilities/ENSCache";
import Router from "./utilities/Router";
import handleEvents from "./handlers/events";

// Reformatting logs.
const log = console.log;
const err = console.error;
const warn = console.warn;
const debug = console.debug;
console.log = (...args: any[]) => log("\x1b[34m[INFO]\x1b[0m", ...args);
console.error = (...args: any[]) => err("\x1b[31m[ERROR]\x1b[0m", ...args);
console.warn = (...args: any[]) => warn("\x1b[33m[WARN]\x1b[0m", ...args);
console.debug = (...args: any[]) => debug("\x1b[32m[DEBUG]\x1b[0m", ...args);

// Creating Discord client.
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildWebhooks
	]
});

const nouns = new Nouns(process.env.JSON_RPC_URL!, { pollingTime: 60_000 });
(client as NermanClient).libraries = {
	nouns: nouns,
	nounsNymz: new NounsNymz(),
	federation: new FederationNounsPool(nouns.provider),
	nounsFork: new NounsFork(nouns.provider),
	propdates: new Propdates(nouns.provider),
	lilNouns: new LilNouns(nouns.provider),
	prophouse: new PropHouse(process.env.JSON_RPC_URL!),
	farcaster: new Farcaster(),
	ensCache: new ENSCache(nouns),
	router: new Router(client as NermanClient)
};

// Adding commands and events to the Discord client. Everything in the 'commands and events'directory respectively.
handleCommands(client as NermanClient);
handleEvents(client as NermanClient);

// Connecting to database.
const mongoURI =
	process.env.DEPLOY_STAGE === "production" || process.env.DEPLOY_STAGE === "staging"
		? process.env.MONGODB_URI
		: "mongodb://127.0.0.1:27017/nerman-feeds";
const options = {
	heartbeatFrequencyMS: 10000,
	autoIndex: false
};
mongoose.connection.on("error", (error) => {
	console.error("index: Database error.", error);
});
mongoose.connection.on("connected", () => {
	console.log("index: Database connection established.");
});
mongoose.set("strictQuery", true);
mongoose.connect(mongoURI!, options).catch((error: unknown) => {
	console.error("index: Unable to connect to database.", error);
});

// Logging all uncaught errors.
client.on(Events.ShardError, (error) => {
	console.error("index: Websocket connection encountered an error.", error);
});
process.on("unhandledRejection", (error) => {
	console.error("index: Unhandled promise rejection.", error);
});
process.on("warning", (error) => {
	console.warn("index: Warning. Received a warning.", error);
});

// Logging into the bot.
client.login(process.env.DISCORD_TOKEN);
