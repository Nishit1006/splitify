import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema(
    {
        groupId: {
            type: Schema.Types.ObjectId,
            ref: "Group",
            required: true,
            index: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },
        paidBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        splitType: {
            type: String,
            enum: ['EQUAL', 'EXACT', 'PERCENTAGE', 'SHARES'],
            default: 'EQUAL',
            uppercase: true
        },
        expenseDate: {
            type: Date,
            default: Date.now,
            required: true
        },
        receipt: {
            type: String, // cloudinary url
        }
    },
    {
        timestamps: true
    }
);

// Compound index for faster queries
//expenseSchema.index({ groupId: 1, expenseDate: -1 });

export const Expense = mongoose.model("Expense", expenseSchema);