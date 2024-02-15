import { EmbedBuilder, hyperlink, bold } from "discord.js";
import { Nouns } from "nerman";

import { shortenAddress } from "../utilities/embeds";
import { Events } from "../types";
import { MAX_REASON_LENGTH, MAX_TITLE_LENGTH } from "../constants";

export function getPostUrl(postId: number) {
	return `https://nouns.nymz.xyz/posts/${postId}`;
}

export function getUserUrl(userId: string) {
	return `https://nouns.nymz.xyz/users/${userId}`;
}

export function getTitle(post: Events.NounsNymzPost) {
	return (post.root ? `Reply In: ${post.root.title}` : post.title) || "New Post!";
}

export function extractAnonymousUsernameFromId(userId: string) {
	let lastDashIndex = userId.lastIndexOf("-");
	if (lastDashIndex === -1) {
		lastDashIndex = userId.length;
	}
	return userId.substring(0, lastDashIndex);
}

export async function findUsername(post: Events.NounsNymzPost, nouns: Nouns) {
	if (!post.doxed) {
		return exports.extractAnonymousUsernameFromId(post.userId);
	}
	const username = (await nouns.ensReverseLookup(post.userId)) ?? (await shortenAddress(post.userId));
	return username;
}

export async function getUsernameHyperlink(post: Events.NounsNymzPost, nouns: Nouns) {
	const usernameUrl = exports.getUserUrl(post.userId);
	const username = await exports.findUsername(post, nouns);
	return hyperlink(username, usernameUrl);
}

export function generatePostBody(post: Events.NounsNymzPost, username: string) {
	if (post.body.length > MAX_REASON_LENGTH) {
		post.body = post.body.substring(0, MAX_REASON_LENGTH).trim() + "...";
	}
	return `${post.body}\n\n${bold("Username")}\n${username}`;
}

export async function generateNewPostEmbed(post: Events.NounsNymzPost, nouns: Nouns) {
	let title = exports.getTitle(post);
	if (title.length > MAX_TITLE_LENGTH) {
		title = title.substring(0, MAX_TITLE_LENGTH).trim() + "...";
	}

	const url = exports.getPostUrl(post.id);
	let username = await exports.getUsernameHyperlink(post, nouns);
	if (!post.doxed) {
		username = `${bold("Anon -")} ${username}`;
	}
	const body = exports.generatePostBody(post, username);
	return new EmbedBuilder().setColor("#00FFFF").setTitle(title).setDescription(body).setURL(url);
}
