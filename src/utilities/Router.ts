import { ChannelType, DiscordErrorData, ForumChannel, hideLinkEmbed, TextChannel, ThreadChannel } from "discord.js";

import Forum, { ForumTypeOptions, IForum } from "../database/Forum";
import FeedConfig from "../database/FeedConfig";
import UrlConfig from "../database/UrlConfig";
import { NermanClient } from "../types";
import { UNKNOWN_CHANNEL_ERROR_CODE, MAX_THREAD_NAME_LENGTH } from "../constants";

type Proposal = { id: number; title: string };
type Candidate = { slug: string; proposer: string };

export default class Router {
	private client: NermanClient;

	constructor(client: NermanClient) {
		this.client = client;
	}

	async forEachFeedChannel(feedName: string, callback: (channel: TextChannel) => void) {
		const feeds = await FeedConfig.findChannels(feedName);
		console.log(`utilities/Router: Sending to ${feeds.length} ${feedName} channels.`);

		for (const feed of feeds) {
			try {
				const channel = await this.client.channels.fetch(feed.channelId);
				if (channel && channel.isTextBased()) {
					callback(channel as TextChannel);
				}
			} catch (error: unknown) {
				console.log("utilities/Router: Unable to retrieve feed channel.", {
					channelId: feed.channelId,
					guildId: feed.guildId,
					feedEvent: feed.eventName,
					error
				});
				if ((error as DiscordErrorData).code === UNKNOWN_CHANNEL_ERROR_CODE) {
					feed.softDelete()
						.then(() => {
							console.log("utilities/Router: Feed soft-delete succeeded.", {
								channelId: feed.channelId,
								guildId: feed.guildId,
								feedEvent: feed.eventName
							});
						})
						.catch((err: unknown) => {
							console.error("utilities/Router: Feed soft-delete failed.", {
								error: err,
								channelId: feed.channelId,
								guildId: feed.guildId,
								feedEvent: feed.eventName
							});
						});
				}
			}
		}
	}

	async forEachNounsProposalForumThread(proposal: Proposal, callback: (thread: ThreadChannel) => void) {
		const forums = await Forum.find({
			isDeleted: { $ne: true },
			forumType: "NounsProposal"
		}).exec();

		console.log(`utilities/Router: Sending to ${forums.length} Nouns Proposal forums.`);

		for (const forum of forums) {
			try {
				const channel = await this.client.channels.fetch(forum.channelId);
				if (!channel || channel.type !== ChannelType.GuildForum) {
					return;
				}

				let thread: ThreadChannel | null = null;
				let threadId = forum.threads.get(`${proposal.id}`); // Mongoose only supports string keys.
				if (threadId) {
					thread = await channel.threads.fetch(threadId);
				}

				if (!thread) {
					thread = await createNounsProposalThread(proposal, channel);

					forum.threads.set(proposal.id.toString(), thread.id);
					forum.save();
				}

				callback(thread);
			} catch (error) {
				console.error("utilities/Router: Failed to route to forum.", {
					error,
					channelId: forum.channelId,
					guildId: forum.guildId
				});
				if ((error as DiscordErrorData).code === UNKNOWN_CHANNEL_ERROR_CODE) {
					forum
						.softDelete()
						.then(() => {
							console.log("utilities/Router: Forum soft-delete succeeded.", {
								channelId: forum.channelId,
								guildId: forum.guildId,
								forumType: forum.forumType
							});
						})
						.catch((err: unknown) => {
							console.error("utilities/Router: Forum soft-delete failed.", {
								error: err,
								channelId: forum.channelId,
								guildId: forum.guildId,
								forumType: forum.forumType
							});
						});
				}
			}
		}
	}

	async forEachNounsProposalCandidateForumThread(candidate: Candidate, callback: (thread: ThreadChannel) => void) {
		const forums = await Forum.find({
			isDeleted: { $ne: true },
			forumType: "NounsCandidateProposal"
		}).exec();

		console.log(`utilities/Router: Sending to ${forums.length} Nouns Candidate Proposal forums.`);

		// Formatting slug, because MongoDB doesn't accept map keys with ".".
		const threadSlugId = candidate.slug.replace(/\./g, ",");

		for (const forum of forums) {
			try {
				const channel = await this.client.channels.fetch(forum.channelId);
				if (!channel || channel.type !== ChannelType.GuildForum) {
					return;
				}

				let thread: ThreadChannel | null = null;
				let threadId = forum.threads.get(threadSlugId);
				if (threadId) {
					thread = await channel.threads.fetch(threadId);
				}

				if (!thread) {
					thread = await createNounsCandidateProposalThread(candidate, channel);

					forum.threads.set(threadSlugId, thread.id);
					forum.save();
				}

				callback(thread);
			} catch (error) {
				console.error("utilities/Router: Failed to route to forum.", {
					error,
					channelId: forum.channelId,
					guildId: forum.guildId
				});
				if ((error as DiscordErrorData).code === UNKNOWN_CHANNEL_ERROR_CODE) {
					forum
						.softDelete()
						.then(() => {
							console.log("utilities/Router: Forum soft-delete succeeded.", {
								channelId: forum.channelId,
								guildId: forum.guildId,
								forumType: forum.forumType
							});
						})
						.catch((err: unknown) => {
							console.error("utilities/Router: Forum soft-delete failed.", {
								error: err,
								channelId: forum.channelId,
								guildId: forum.guildId,
								forumType: forum.forumType
							});
						});
				}
			}
		}
	}
}

async function createNounsProposalThread(proposal: Proposal, channel: ForumChannel) {
	let threadName = proposal.title.split(" ").splice(1).join(" "); // Removing 'Proposal'.
	if (threadName.length > MAX_THREAD_NAME_LENGTH) {
		threadName = threadName.substring(0, MAX_THREAD_NAME_LENGTH).trim() + "...";
	}

	const url = (await UrlConfig.fetchUrls(channel.guildId)).proposalUrl;
	const thread = await channel.threads.create({
		name: threadName,
		message: { content: hideLinkEmbed(url + proposal.id) }
	});

	return thread;
}

async function createNounsCandidateProposalThread(candidate: Candidate, channel: ForumChannel) {
	let threadName = candidate.slug
		.trim()
		.split("-")
		.filter((word) => {
			return word.trim();
		})
		.map((word) => {
			const capitalizedWord = word[0].toUpperCase() + word.substring(1).toLowerCase();
			return capitalizedWord.trim();
		})
		.join(" ");

	if (threadName.length > MAX_THREAD_NAME_LENGTH) {
		threadName = threadName.substring(0, MAX_THREAD_NAME_LENGTH).trim() + "...";
	}

	const url = `https://nouns.wtf/candidates/${candidate.proposer.toLowerCase()}-${candidate.slug}`;
	const thread = await channel.threads.create({
		name: threadName,
		message: { content: hideLinkEmbed(url) }
	});

	return thread;
}
