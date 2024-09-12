import { Client, Collection, SlashCommandBuilder } from "discord.js";
import { Farcaster, FederationNounsPool, LilNouns, Nouns, NounsFork, NounsNymz, Propdates, EventData, Snapshot } from "nerman";

import ENSCache from "./utilities/ENSCache";
import Router from "./utilities/Router";

export interface NermanClient extends Client {
	events: Collection<string, NermanEvent>;
	commands: Collection<string, NermanCommand>;
	subCommands: Collection<string, NermanSubcommand>;
	libraries: {
		nouns: Nouns;
		nounsNymz: NounsNymz;
		federation: FederationNounsPool;
		nounsFork: NounsFork;
		propdates: Propdates;
		lilNouns: LilNouns;
		farcaster: Farcaster;
		snapshot: Snapshot;
		ensCache: ENSCache;
		router: Router;
	};
}
export interface NermanEvent {
	name: string;
	execute: (...args: any[]) => void;
	once?: boolean;
}
export interface NermanCommand {
	data: SlashCommandBuilder;
	execute: (...args: any[]) => void;
	isHidden?: boolean;
}
export interface NermanSubcommand {
	subCommand: string;
	execute: (...args: any[]) => void;
	isHidden?: boolean;
}

export type VoteChoices = "FOR" | "AGAINST" | "ABSTAIN";
export interface Account {
	id: string;
	name: string;
}
export namespace Events {
	export interface NounsCast extends EventData.Farcaster.NounsCast {}
	export interface FederationBidPlaced extends EventData.Federation.BidPlaced {
		supportVote: VoteChoices;
		bidder: Account;
		voteNumber: number;
		proposalTitle: string;
	}
	export interface FederationVoteCast extends EventData.Federation.VoteCast {
		supportVote: VoteChoices;
		bidder: Account;
		voteNumber: string;
		proposalTitle: string;
	}
	export interface AuctionBid extends EventData.AuctionBid {
		bidder: Account;
	}
	export interface AuctionCreated extends EventData.AuctionCreated {}
	export interface ProposalCreated extends EventData.ProposalCreated {
		proposalTitle: string;
	}
	export interface ProposalStatusChange extends EventData.ProposalCanceled {
		status: string;
		proposalTitle: string;
	}
	export interface VoteCast extends EventData.VoteCast {
		voter: Account;
		choice: VoteChoices;
		proposalTitle: string;
	}
	export interface Transfer extends EventData.Transfer {
		to: Account;
		from: Account;
	}
	export interface DelegateChanged extends EventData.DelegateChanged {
		delegator: Account;
		fromDelegate: Account;
		toDelegate: Account;
	}
	export interface NounCreated extends EventData.NounCreated {}
	export interface Quit extends EventData.Quit {
		msgSender: Account;
	}
	export interface NounsNymzPost extends EventData.NounsNymz.NewPost {
		doxed: boolean;
	}
	export interface AuctionEnd extends EventData.AuctionComplete {
		bidder: Account;
		address: string;
		amount: number;
	}
	export interface CandidateFeedbackSent extends EventData.CandidateFeedbackSent {
		msgSender: Account;
		proposer: Account;
		supportVote: VoteChoices;
	}
	export interface FeedbackSent extends EventData.FeedbackSent {
		msgSender: Account;
		proposalTitle: string;
		supportVote: VoteChoices;
	}
	export interface ProposalCandidateCanceled extends EventData.ProposalCandidateCanceled {
		msgSender: Account;
	}
	export interface ProposalCandidateCreated extends EventData.ProposalCandidateCreated {
		msgSender: Account;
	}
	export interface ProposalCandidateUpdated extends EventData.ProposalCandidateUpdated {
		msgSender: Account;
	}
	export interface SignatureAdded extends EventData.SignatureAdded {
		proposer: Account;
		signer: Account;
		votes: number;
	}
	export interface EscrowedToFork extends EventData.EscrowedToFork {
		owner: Account;
		currentEscrowAmount: number;
		currentPercentage: number;
	}
	export interface EscrowedToFork extends EventData.EscrowedToFork {
		owner: Account;
		tokensInEscrow: number;
	}
	export interface JoinFork extends EventData.JoinFork {
		owner: Account;
	}
	export interface WithdrawNounsFromEscrow extends EventData.DAOWithdrawNounsFromEscrow {
		to: Account;
	}
	export interface PropdatesPostUpdate extends EventData.Propdates.PostUpdate {
		proposalTitle: string;
	}
	export interface ExecuteFork extends EventData.ExecuteFork {}
	export interface SnapshotProposal extends EventData.Snapshot.Proposal {
		author: Account;
	}
	export interface SnapshotVote extends EventData.Snapshot.Vote {
		voter: Account;
	}
}
