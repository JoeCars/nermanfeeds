import { TextChannel, inlineCode } from "discord.js";

const events = new Map<string, string>();

// Farcaster
events.set("farcaster-nouns-cast", "Farcaster.NounsCast");

// Federation
events.set("federation-bid-placed", "Federation.BidPlaced");
events.set("federation-vote-cast", "Federation.VoteCast");

// LilNouns
events.set("lil-nouns-auction-bid", "LilNouns.AuctionBid");
events.set("lil-nouns-auction-created", "LilNouns.AuctionCreated");
events.set("lil-nouns-proposal-created", "LilNouns.ProposalCreated");
events.set("lil-nouns-proposal-status-change", "LilNouns.ProposalStatusChange");
events.set("lil-nouns-vote-cast", "LilNouns.VoteCast");
events.set("lil-nouns-transfer", "LilNouns.Transfer");

// NounsFork
events.set("nouns-fork-auction-house-auction-created", "NounsFork.AuctionHouse.AuctionCreated");
events.set("nouns-fork-auction-house-auction-bid", "NounsFork.AuctionHouse.AuctionBid");
events.set("nouns-fork-proposal-created", "NounsFork.ProposalCreated");
events.set("nouns-fork-proposal-status-change", "NounsFork.ProposalStatusChange");
events.set("nouns-fork-quit", "NounsFork.Quit");
events.set("nouns-fork-vote-cast", "NounsFork.VoteCast");
events.set("nouns-fork-tokens-delegate-changed", "NounsFork.Tokens.DelegateChanged");
events.set("nouns-fork-tokens-transfer", "NounsFork.Tokens.Transfer");
events.set("nouns-fork-tokens-noun-created", "NounsFork.Tokens.NounCreated");

// NounsNymz
events.set("nouns-nymz-new-post", "NounsNymz.NewPost");

// Nouns
events.set("nouns-auction-house-auction-bid", "Nouns.AuctionHouse.AuctionBid");
events.set("nouns-auction-house-auction-created", "Nouns.AuctionHouse.AuctionCreated");
events.set("nouns-auction-house-auction-end", "Nouns.AuctionHouse.AuctionEnd");
events.set("nouns-token-delegate-changed", "Nouns.Token.DelegateChanged");
events.set("nouns-token-delegate-changed-no-zero", "Nouns.Token.DelegateChangedNoZero");
events.set("nouns-token-noun-created", "Nouns.Token.NounCreated");
events.set("nouns-token-transfer", "Nouns.Token.Transfer");
events.set("nouns-dao-proposal-created", "Nouns.DAO.ProposalCreated");
events.set("nouns-dao-proposal-status-change", "Nouns.DAO.ProposalStatusChange");
events.set("nouns-dao-proposal-vote-cast-no-zero", "Nouns.DAO.ProposalVoteCastNoZero");
events.set("nouns-dao-proposal-vote-cast-only-zero", "Nouns.DAO.ProposalVoteCastOnlyZero");
events.set("nouns-dao-escrowed-to-fork", "Nouns.DAO.EscrowedToFork");
events.set("nouns-dao-execute-fork", "Nouns.DAO.ExecuteFork");
events.set("nouns-dao-join-fork", "Nouns.DAO.JoinFork");
events.set("nouns-dao-withdraw-nouns-from-escrow", "Nouns.DAO.WithdrawNounsFromEscrow");
events.set("nouns-dao-data-proposal-candidate-feedback-sent", "Nouns.DAOData.ProposalCandidateFeedbackSent");
events.set("nouns-dao-data-proposal-candidate-canceled", "Nouns.DAOData.ProposalCandidateCanceled");
events.set("nouns-dao-data-proposal-candidate-created", "Nouns.DAOData.ProposalCandidateCreated");
events.set("nouns-dao-data-proposal-candidate-updated", "Nouns.DAOData.ProposalCandidateUpdated");
events.set("nouns-dao-data-signature-added", "Nouns.DAOData.SignatureAdded");
events.set("nouns-dao-data-proposal-feedback-sent", "Nouns.DAOData.ProposalFeedbackSent");

// Propdates
events.set("propdates-post-update", "Propdates.PostUpdate");

// Snapshot
events.set("snapshot-proposal-created", "Snapshot.ProposalCreated");
events.set("snapshot-proposal-completed", "Snapshot.ProposalCompleted");
events.set("snapshot-vote-cast", "Snapshot.VoteCast");

export default class Feeds {
	public static filterByGroup(group: string) {
		return [...events.entries()]
			.filter((pair) => {
				const eventGroup = pair[1].split(".")[0];
				const isGroup = eventGroup === group;

				return isGroup;
			})
			.map(([key, value]) => {
				return { name: value, value: key };
			});
	}

	public static findKeyOfEvent(eventDisplayName: string) {
		for (const [key, value] of events.entries()) {
			if (value === eventDisplayName) {
				return key;
			}
		}
		throw new Error(`Unable to find feed corresponding to ${eventDisplayName}`);
	}

	public static getAllKeys() {
		return [...events.keys()];
	}

	public static getAllValues() {
		return [...events.values()];
	}

	public static getAllEntries() {
		return [...events.entries()];
	}

	public static get(key: string) {
		return events.get(key);
	}

	public static formatResultMessage(
		eventResults: {
			event: string;
			isDuplicate: boolean;
		}[],
		channel: TextChannel
	) {
		let resultMessage = "";

		let failedEvents = eventResults.filter(({ isDuplicate }) => {
			return isDuplicate;
		});
		if (failedEvents.length > 0) {
			const failedEventsMessage = failedEvents
				.map((result) => {
					return inlineCode(events.get(result.event)!);
				})
				.join(", ");
			resultMessage += failedEventsMessage + " events were already registered.\n";
		}

		let successfulEvents = eventResults.filter(({ isDuplicate }) => {
			return !isDuplicate;
		});
		if (successfulEvents.length > 0) {
			const successfulEventsMessage = successfulEvents
				.map((result) => {
					return inlineCode(events.get(result.event)!);
				})
				.join(", ");
			resultMessage += `You have successfully registered ${successfulEventsMessage} to channel ${inlineCode(
				channel.id
			)}.`;
		}

		return resultMessage;
	}
}
