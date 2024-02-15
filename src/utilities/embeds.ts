import { hyperlink } from "discord.js";

import { WEI_PER_ETH } from "../constants";

export function linkToWallet({ id, name }: { id: string; name: string }) {
	return hyperlink(name, `https://etherscan.io/address/${id}`);
}

export function linkToNoun(nounId: number) {
	return hyperlink(`Noun ${nounId}`, `https://nouns.wtf/noun/${nounId}`);
}

export function convertWeiToEth(weiAmount: number) {
	return weiAmount / WEI_PER_ETH;
}

export function shortenAddress(address: string) {
	return address.substring(0, 6) + "..." + address.substring(38, 42);
}
