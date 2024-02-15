import { Schema, model, InferSchemaType } from "mongoose";

const FORUM_TYPE_OPTIONS = ["NounsProposal", "NounsCandidateProposal"] as const;
export type ForumTypeOptions = (typeof FORUM_TYPE_OPTIONS)[number];

const ForumSchema = new Schema(
	{
		_id: Schema.Types.ObjectId,
		guildId: {
			type: String,
			required: true
		},
		channelId: {
			type: String,
			required: true
		},
		threads: {
			type: Map,
			of: String,
			required: true,
			default: new Map<string, string>() // (proposalId / slug, threadId)
		},
		isDeleted: {
			type: Boolean,
			required: false,
			default: false
		},
		forumType: {
			type: String,
			enum: FORUM_TYPE_OPTIONS,
			required: true
		}
	},
	{
		timestamps: true,
		methods: {
			softDelete() {
				this.isDeleted = true;
				return this.save();
			}
		}
	}
);

export type IForum = InferSchemaType<typeof ForumSchema>;

export default model("Forum", ForumSchema);
