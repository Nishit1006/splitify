import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        description: {
            type: String,
            trim: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        groupImage: {
            type: String, // cloudinary url
        }
    },
    {
        timestamps: true
    }
);

export const Group = mongoose.model("Group", groupSchema);