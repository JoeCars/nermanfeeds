import { Schema, model } from "mongoose";

const DEFAULT_PROPOSAL_URL = "https://nouns.wtf/vote/";

const UrlConfigSchema = new Schema(
	{
		_id: Schema.Types.ObjectId,
		guildId: {
			type: String,
			required: true
		},
		proposalUrl: {
			type: String,
			required: true,
			default: DEFAULT_PROPOSAL_URL
		}
	},
	{
		timestamps: true,
		statics: {
			async fetchUrls(guildId: string) {
				let config = null;
				try {
					config = await this.findOne({ guildId: guildId }).exec();
				} catch (error) {
					console.error("database/UrlConfig: Unable to fetch the config due to a database error.", {
						error: error,
						guildId: guildId
					});
					config = null;
				}

				return {
					proposalUrl: config ? config.proposalUrl : DEFAULT_PROPOSAL_URL
				};
			}
		}
	}
);

export default model("UrlConfig", UrlConfigSchema);
