import mongoose, { Schema } from "mongoose";

const groupMemberSchema = new Schema(
    {
        groupId: {
            type: Schema.Types.ObjectId,
            ref: "Group",
            required: true,
            index: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

// Compound unique index to prevent duplicate memberships
//groupMemberSchema.index({ groupId: 1, userId: 1 }, { unique: true });

export const GroupMember = mongoose.model("GroupMember", groupMemberSchema);