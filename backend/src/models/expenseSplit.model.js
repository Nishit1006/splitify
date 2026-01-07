import mongoose, { Schema } from "mongoose";

const expenseSplitSchema = new Schema(
    {
        expenseId: {
            type: Schema.Types.ObjectId,
            ref: "Expense",
            required: true,
            index: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        splitValue: {
            type: Number,
            required: true,
            min: 0
        },
        finalAmount: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

// Compound unique index
//expenseSplitSchema.index({ expenseId: 1, userId: 1 }, { unique: true });

export const ExpenseSplit = mongoose.model("ExpenseSplit", expenseSplitSchema);