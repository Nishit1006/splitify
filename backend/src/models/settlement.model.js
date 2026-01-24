import mongoose, { Schema } from "mongoose";

const settlementSchema = new Schema(
    {
        groupId: {
            type: Schema.Types.ObjectId,
            ref: "Group",
            required: true,
            index: true
        },
        paidFrom: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        paidTo: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        paymentMethod: {
            type: String,
            enum: ['cash', 'upi', 'bank_transfer', 'card', 'other'],
            default: 'cash',
            lowercase: true
        },
        referenceNote: {
            type: String,
            trim: true
        },
        settledAt: {
            type: Date,
            default: Date.now,
            required: true
        },
        proof: {
            type: String, // cloudinary url for payment proof
        }
    },
    {
        timestamps: true
    }
);

// Indexes for faster queries
//settlementSchema.index({ groupId: 1, settledAt: -1 });

// Validation to prevent self-settlement
settlementSchema.pre("save", async function () {
    if (this.paidFrom.equals(this.paidTo)) {
        throw new Error("Cannot settle with yourself");
    }
});

export const Settlement = mongoose.model("Settlement", settlementSchema);