import { Schema, model } from "mongoose";

const SnapshotSpaceSchema = new Schema(
	{
		_id: Schema.Types.ObjectId,
		spaceId: {
			type: String,
			required: true,
			unique: true
		}
	},
	{
		timestamps: true
	}
);

export default model("SnapshotSpace", SnapshotSpaceSchema);
