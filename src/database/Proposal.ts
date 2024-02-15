import { Schema, model, Types } from "mongoose";
import { EventData } from "nerman";

const PROJECT_OPTIONS = ["Nouns", "LilNouns", "NounsFork0"] as const;
type ProjectOptions = (typeof PROJECT_OPTIONS)[number];

const ProposalSchema = new Schema(
	{
		_id: Schema.Types.ObjectId,
		proposalId: {
			type: Number,
			required: true,
			index: { unique: true }
		},
		proposerId: {
			type: String,
			required: true
		},
		startBlock: {
			type: Number,
			default: 0
		},
		endBlock: {
			type: Number,
			default: 0
		},
		quorumVotes: {
			type: Number,
			default: 0
		},
		proposalThreshold: {
			type: Number,
			default: 0
		},
		description: {
			type: String,
			default: ""
		},
		title: {
			type: String,
			required: true
		},
		project: {
			type: String,
			enum: PROJECT_OPTIONS,
			required: true
		}
	},
	{
		timestamps: true,
		statics: {
			async tryCreateProposal(data: EventData.ProposalCreatedWithRequirements, project: ProjectOptions) {
				let proposal = await this.findOne({ proposalId: Number(data.id) }).exec();
				if (proposal) {
					return proposal;
				}

				const titleEndIndex = data.description.indexOf("\n");
				const title = data.description.substring(1, titleEndIndex).trim(); // Title is formatted as '# Title \n'
				const description = data.description.substring(titleEndIndex + 1).trim();

				proposal = await this.create({
					_id: new Types.ObjectId(),
					proposalId: Number(data.id),
					proposerId: data.proposer.id,
					startBlock: data.startBlock,
					endBlock: data.endBlock,
					quorumVotes: data.quorumVotes,
					proposalThreshold: data.proposalThreshold,
					title: title,
					description: description,
					project: project
				});
				return proposal;
			},

			async fetchProposalTitle(proposalId: number, project: ProjectOptions) {
				let title = `Proposal ${proposalId}`;
				try {
					const proposal = await this.findOne({
						proposalId: proposalId,
						project: project
					}).exec();

					if (proposal) {
						title = `Proposal ${proposal.proposalId}: ${proposal.title}`;
					}
				} catch (error) {
					console.error("database/Proposal: Unable to fetch proposal title.", error);
				}

				return title;
			}
		}
	}
);

export default model("Proposal", ProposalSchema);
