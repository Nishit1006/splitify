import mongoose, { Schema } from "mongoose";

const groupMemberSchema = new Schema(
    {
        group: {
            type: Schema.Types.ObjectId,
            ref: "Group",
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        role: {
            type: String,
            enum: ["ADMIN", "MEMBER"],
            default: "MEMBER"
        }
    },
    { timestamps: true }
);

groupMemberSchema.index({ group: 1, user: 1 }, { unique: true });

export const GroupMember = mongoose.model("GroupMember", groupMemberSchema);
