import { Schema, model } from "mongoose";

const AdminSchema = new Schema(
	{
		_id: Schema.Types.ObjectId,
		guildId: {
			type: String,
			required: true
		},
		userId: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
);

export default model("AdminSchema", AdminSchema);
