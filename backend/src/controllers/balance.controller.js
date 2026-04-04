import mongoose from "mongoose";
import { Expense } from "../models/expense.model.js";
import { ExpenseSplit } from "../models/expenseSplit.model.js";
import { Settlement } from "../models/settlement.model.js";
import { GroupMember } from "../models/groupMember.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const calculateOptimizedSettlements = (balanceMap) => {
    const debtors = [];
    const creditors = [];

    Object.values(balanceMap).forEach(entry => {
        const balance = Number(entry.balance.toFixed(2));
        if (balance < -0.01) {
            debtors.push({ user: entry.user, balance: Math.abs(balance) });
        } else if (balance > 0.01) {
            creditors.push({ user: entry.user, balance: balance });
        }
    });

    debtors.sort((a, b) => b.balance - a.balance);
    creditors.sort((a, b) => b.balance - a.balance);

    const transactions = [];
    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];
        const amount = Math.min(debtor.balance, creditor.balance);
        const settledAmount = Number(amount.toFixed(2));

        transactions.push({
            from: debtor.user,
            to: creditor.user,
            amount: settledAmount
        });

        debtor.balance -= settledAmount;
        creditor.balance -= settledAmount;

        if (debtor.balance < 0.01) i++;
        if (creditor.balance < 0.01) j++;
    }

    return transactions;
};

const buildGroupBalanceMap = async (groupId) => {
    const members = await GroupMember.find({ group: groupId }).populate(
        "user",
        "username fullname avatar"
    );

    const balanceMap = {};
    members.forEach(m => {
        if (m.user) {
            balanceMap[m.user._id.toString()] = { user: m.user, balance: 0 };
        }
    });

    const expenses = await Expense.find({ groupId });
    const expenseIds = expenses.map(e => e._id);

    expenses.forEach(expense => {
        const payerId = expense.paidBy.toString();
        if (balanceMap[payerId]) {
            balanceMap[payerId].balance += expense.totalAmount;
        }
    });

    const splits = await ExpenseSplit.find({ expenseId: { $in: expenseIds } });
    splits.forEach(split => {
        const uid = split.userId.toString();
        if (balanceMap[uid]) {
            balanceMap[uid].balance -= split.finalAmount;
        }
    });

    const settlements = await Settlement.find({ groupId });
    settlements.forEach(settlement => {
        const fromId = settlement.paidFrom.toString();
        const toId = settlement.paidTo.toString();

        if (balanceMap[fromId]) balanceMap[fromId].balance += settlement.amount;
        if (balanceMap[toId]) balanceMap[toId].balance -= settlement.amount;
    });

    return balanceMap;
};

export const getGroupBalances = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user._id.toString();

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        throw new ApiError(400, "Invalid group id");
    }

    const isMember = await GroupMember.findOne({ group: groupId, user: userId });
    if (!isMember) {
        throw new ApiError(403, "You are not a member of this group");
    }

    const balanceMap = await buildGroupBalanceMap(groupId);

    const myEntry = balanceMap[userId];
    if (!myEntry) {
        throw new ApiError(404, "Balance record not found for user");
    }
    const myNetBalance = Number(myEntry.balance.toFixed(2));

    const optimizedTransactions = calculateOptimizedSettlements(balanceMap);

    const youOwe = optimizedTransactions
        .filter(t => t.from._id.toString() === userId)
        .map(t => ({ user: t.to, amount: t.amount }));

    const youGet = optimizedTransactions
        .filter(t => t.to._id.toString() === userId)
        .map(t => ({ user: t.from, amount: t.amount }));

    res.status(200).json(
        new ApiResponse(200, { netBalance: myNetBalance, youOwe, youGet }, "Group balance calculated successfully")
    );
});

export const getTotalUserNetBalance = asyncHandler(async (req, res) => {
    const userId = req.user._id.toString();
    let totalOwed = 0;
    let totalOwedToYou = 0;

    const groupMemberships = await GroupMember.find({ user: userId });
    const groupIds = groupMemberships.map(g => g.group);

    for (const groupId of groupIds) {
        const balanceMap = await buildGroupBalanceMap(groupId);
        const optimizedTransactions = calculateOptimizedSettlements(balanceMap);

        optimizedTransactions.forEach(t => {
            if (t.from._id.toString() === userId) {
                totalOwed += t.amount;
            }
            if (t.to._id.toString() === userId) {
                totalOwedToYou += t.amount;
            }
        });
    }

    res.status(200).json(
        new ApiResponse(200, {
            totalOwed: Number(totalOwed.toFixed(2)),
            totalOwedToYou: Number(totalOwedToYou.toFixed(2))
        }, "Total balances calculated successfully")
    );
});

export const getMyNetGroupBalance = getGroupBalances;