import { Nouns } from "nerman";
import { shortenAddress } from "./embeds";

export default class ENSCache {
	private nouns: Nouns;
	private cache: Map<string, string>;

	constructor(nouns: Nouns) {
		this.nouns = nouns;
		this.cache = new Map();
	}

	async fetchName(walletAddress: string) {
		let name: string | null | undefined = this.cache.get(walletAddress);
		if (name) {
			return name;
		}

		name = await this.nouns.ensReverseLookup(walletAddress);
		if (!name) {
			name = shortenAddress(walletAddress);
		}

		this.cache.set(walletAddress, name);
		return name;
	}
}


