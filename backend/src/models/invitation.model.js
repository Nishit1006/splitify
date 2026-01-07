import mongoose, { Schema } from "mongoose";

const invitationSchema = new Schema(
    {
        groupId: {
            type: Schema.Types.ObjectId,
            ref: "Group",
            required: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        inviteToken: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        status: {
            type: String,
            enum: ['PENDING', 'ACCEPTED', 'EXPIRED'],
            default: 'PENDING',
            uppercase: true
        },
        expiresAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Auto-generate invite token before saving
invitationSchema.pre("save", async function (next) {
    if (this.isNew && !this.inviteToken) {
        this.inviteToken = require('crypto').randomBytes(32).toString('hex');
    }
    next();
});

export const Invitation = mongoose.model("Invitation", invitationSchema);