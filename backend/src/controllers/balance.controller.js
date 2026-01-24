import mongoose from "mongoose";
import { Expense } from "../models/expense.model.js";
import { ExpenseSplit } from "../models/expenseSplit.model.js";
import { Settlement } from "../models/settlement.model.js";
import { GroupMember } from "../models/groupMember.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getGroupBalances = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        throw new ApiError(400, "Invalid group id");
    }

    const isMember = await GroupMember.findOne({
        group: groupId,
        user: userId
    });

    if (!isMember) {
        throw new ApiError(403, "You are not a member of this group");
    }
    const members = await GroupMember.find({ group: groupId }).populate(
        "user",
        "username fullname avatar"
    );

    const balanceMap = {};

    members.forEach(m => {
        balanceMap[m.user._id.toString()] = {
            user: m.user,
            balance: 0
        };
    });

    const expenses = await Expense.find({ groupId });

    for (const expense of expenses) {
        const splits = await ExpenseSplit.find({
            expenseId: expense._id
        });

        balanceMap[expense.paidBy.toString()].balance += expense.totalAmount;

        for (const split of splits) {
            balanceMap[split.userId.toString()].balance -= split.finalAmount;
        }
    }

    const settlements = await Settlement.find({ groupId });

    for (const settlement of settlements) {
        balanceMap[settlement.paidFrom.toString()].balance += settlement.amount;
        balanceMap[settlement.paidTo.toString()].balance -= settlement.amount;
    }

    const youOwe = [];
    const youGet = [];

    const myBalance = balanceMap[userId.toString()].balance;

    Object.values(balanceMap).forEach(entry => {
        if (entry.user._id.toString() === userId.toString()) return;

        const amount = Number(entry.balance.toFixed(2));

        if (amount > 0 && myBalance < 0) {
            youOwe.push({
                user: entry.user,
                amount: Math.min(amount, Math.abs(myBalance))
            });
        }

        if (amount < 0 && myBalance > 0) {
            youGet.push({
                user: entry.user,
                amount: Math.min(Math.abs(amount), myBalance)
            });
        }
    });

    res.status(200).json(
        new ApiResponse(
            200,
            {
                netBalance: Number(myBalance.toFixed(2)),
                youOwe,
                youGet
            },
            "Group balance calculated successfully"
        )
    );
});
