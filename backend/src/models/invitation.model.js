import mongoose, { Schema } from "mongoose";
import crypto from "crypto";

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
            enum: ["PENDING", "ACCEPTED", "REJECTED", "EXPIRED"],
            default: "PENDING",
            uppercase: true
        },
        expiresAt: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
);

/* 🔐 Generate token BEFORE validation */
invitationSchema.pre("validate", function () {
    if (!this.inviteToken) {
        const rawToken = crypto.randomBytes(32).toString("hex");

        this.inviteToken = crypto
            .createHash("sha256")
            .update(rawToken)
            .digest("hex");

        this._rawToken = rawToken; // not persisted
    }
});

/* ⏰ Auto-delete expired invitations */
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Invitation = mongoose.model("Invitation", invitationSchema);
