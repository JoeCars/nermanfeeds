import { Schema, model, Types, HydratedDocument, Model, ObjectId } from "mongoose";

import Feeds from "../utilities/Feeds";

interface House {
	address: string;
	name: string;
	url: string;
}

interface Space {
	id: string;
	name: string;
	url: string;
}

interface Options {
	prophouse?: {
		permittedHouses: House[];
	};
	snapshot?: {
		spaces: Space[];
	};
}

export interface IFeedConfig {
	_id: ObjectId;
	guildId: string;
	channelId: string;
	eventName: string;
	isDeleted?: boolean;
	options?: Options;
}

interface IFeedConfigMethods {
	softDelete: () => Promise<HydratedDocument<IFeedConfig, IFeedConfigMethods>>;
	includesHouse: (houseAddress: string) => boolean;
	includesSpace: (spaceId: string) => boolean;
}

interface FeedConfigModel extends Model<IFeedConfig, {}, IFeedConfigMethods> {
	findChannels: (eventName: string) => Promise<HydratedDocument<IFeedConfig, IFeedConfigMethods>[]>;
	findFeedsInGuild: (guildId: string) => Promise<HydratedDocument<IFeedConfig, IFeedConfigMethods>[]>;
	findFeedsInChannel: (guildId: string, channelId: string) => Promise<HydratedDocument<IFeedConfig, IFeedConfigMethods>[]>;
	tryAddFeed: (
		guildId: string,
		channelId: string,
		eventName: string
	) => Promise<HydratedDocument<IFeedConfig, IFeedConfigMethods>>;
	registerFeed: (
		guildId: string,
		channelId: string,
		event: string,
		options?: Options
	) => Promise<{ event: string; isDuplicate: boolean }>;
	registerAllProjectFeeds: (
		guildId: string,
		channelId: string,
		event: string,
		options?: Options
	) => Promise<{ event: string; isDuplicate: boolean }[]>;
}

const FeedConfigSchema = new Schema<IFeedConfig, FeedConfigModel, IFeedConfigMethods>(
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
		eventName: {
			type: String,
			enum: Feeds.getAllKeys(),
			required: true
		},
		isDeleted: {
			type: Boolean,
			required: false,
			default: false
		},
		options: {
			prophouse: {
				permittedHouses: [
					{
						address: {
							type: String,
							required: true
						},
						name: {
							type: String,
							required: true
						},
						url: {
							type: String,
							required: true
						}
					}
				]
			},
			snapshot: {
				spaces: [
					{
						id: {
							type: String,
							required: true
						},
						name: {
							type: String,
							required: true
						},
						url: {
							type: String,
							required: true
						}
					}
				]
			}
		}
	},
	{
		timestamps: true,
		statics: {
			async findChannels(eventName: string) {
				return this.find({
					eventName: eventName,
					isDeleted: {
						$ne: true
					}
				}).exec();
			},
			async findFeedsInGuild(guildId: string) {
				return this.find({
					guildId: guildId,
					isDeleted: {
						$ne: true
					}
				}).exec();
			},
			async findFeedsInChannel(guildId: string, channelId: string) {
				return this.find({
					guildId: guildId,
					channelId: channelId,
					isDeleted: {
						$ne: true
					}
				}).exec();
			},
			async tryAddFeed(guildId: string, channelId: string, eventName: string) {
				let feed = await this.findOne({
					guildId: guildId,
					channelId: channelId,
					eventName: eventName,
					isDeleted: {
						$ne: true
					}
				}).exec();

				if (!feed) {
					feed = await this.create({
						_id: new Types.ObjectId(),
						guildId: guildId,
						channelId: channelId,
						eventName: eventName
					});
				}

				return feed;
			},
			async registerFeed(guildId: string, channelId: string, event: string, options: Options = {}) {
				try {
					const numOfConfigs = await this.countDocuments({
						guildId: guildId,
						channelId: channelId,
						eventName: event,
						isDeleted: {
							$ne: true
						}
					});

					if (numOfConfigs !== 0) {
						return {
							event: event,
							isDuplicate: true
						};
					}

					await this.create({
						_id: new Types.ObjectId(),
						guildId: guildId,
						channelId: channelId,
						eventName: event,
						options: options
					});

					return {
						event: event,
						isDuplicate: false
					};
				} catch (error) {
					console.error("db/schemas/FeedConfig.js: Unable to register feed.", {
						feed: event,
						error: error
					});

					throw new Error("Unable to register feed.");
				}
			},
			async registerAllProjectFeeds(guildId: string, channelId: string, projectName: string, options: Options = {}) {
				const eventResults = [];

				const feedEvents = Feeds.filterByGroup(projectName).map(({ value }) => {
					return value;
				});

				for (const feedEvent of feedEvents) {
					const results = await (this as any).registerFeed(guildId, channelId, feedEvent, options);
					eventResults.push(results);
				}

				return eventResults;
			}
		},
		methods: {
			softDelete() {
				this.isDeleted = true;
				return this.save();
			},
			includesHouse(houseAddress: string) {
				// All houses permitted if there are no options.
				if (!this.options || !this.options.prophouse) {
					return true;
				}
				if (this.options.prophouse.permittedHouses.length <= 0) {
					return true;
				}

				return this.options.prophouse.permittedHouses.map((house: House) => house.address).includes(houseAddress);
			},
			includesSpace(spaceId: string) {
				// All houses permitted if there are no options.
				if (!this.options || !this.options.snapshot) {
					return true;
				}
				if (this.options.snapshot.spaces.length <= 0) {
					return true;
				}

				return this.options.snapshot.spaces.map((space: Space) => space.id).includes(spaceId);
			}
		}
	}
);

export default model<IFeedConfig, FeedConfigModel>("FeedConfig", FeedConfigSchema);
