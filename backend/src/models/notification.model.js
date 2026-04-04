import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: String,
            enum: ['expense_added', 'settlement_received', 'group_invite', 'member_added', 'expense_updated', 'other'],
            default: 'other',
            lowercase: true
        },
        isRead: {
            type: Boolean,
            default: false,
            index: true
        },
        relatedId: {
            type: Schema.Types.ObjectId,
        },
        relatedModel: {
            type: String,
            enum: ['Expense', 'Group', 'Settlement', 'Invitation'] // FIXED: Added 'Invitation'
        }
    },
    {
        timestamps: true
    }
);

export const Notification = mongoose.model("Notification", notificationSchema);