import { Expense } from "../models/expense.model.js";
import { ExpenseSplit } from "../models/expenseSplit.model.js";
import { GroupMember } from "../models/groupMember.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import createNotification from "../services/notification.service.js";
import mongoose from "mongoose";

const calculateEqualSplits = (splitsArray, totalAmount) => {
    const perPersonAmount = Math.floor((totalAmount / splitsArray.length) * 100) / 100;
    let remainder = Number((totalAmount - (perPersonAmount * splitsArray.length)).toFixed(2));

    return splitsArray.map((splitItem) => {
        let finalAmt = perPersonAmount;
        if (remainder > 0) {
            finalAmt = Number((finalAmt + 0.01).toFixed(2));
            remainder = Number((remainder - 0.01).toFixed(2));
        }

        const userId = typeof splitItem === 'object' ? splitItem.userId : splitItem;

        return {
            userId,
            splitValue: 1,
            finalAmount: finalAmt
        };
    });
};

export const addExpense = asyncHandler(async (req, res) => {
    const { groupId, title, description, totalAmount, splitType, expenseDate, paidBy } = req.body;
    let { splits } = req.body;

    let parsedSplits = splits;
    if (typeof splits === "string") {
        try {
            parsedSplits = JSON.parse(splits);
        } catch (error) {
            throw new ApiError(400, "Invalid splits format");
        }
    }

    if (!groupId || !title || !totalAmount || !parsedSplits || !Array.isArray(parsedSplits)) {
        throw new ApiError(400, "Required fields missing or invalid");
    }

    if (totalAmount <= 0) {
        throw new ApiError(400, "Amount must be positive");
    }

    const isMember = await GroupMember.findOne({
        group: groupId,
        user: req.user._id
    });

    if (!isMember) {
        throw new ApiError(403, "You are not a member of this group");
    }

    const actualPayer = paidBy || req.user._id;
    const isPayerMember = await GroupMember.findOne({
        group: groupId,
        user: actualPayer
    });

    if (!isPayerMember) {
        throw new ApiError(400, "The selected payer must be a member of this group");
    }

    const type = splitType || "EQUAL";
    let expenseSplits = [];

    if (type === "EQUAL") {
        if (parsedSplits.length === 0) throw new ApiError(400, "Splits array cannot be empty");
        expenseSplits = calculateEqualSplits(parsedSplits, totalAmount);
    } else if (type === "EXACT") {
        if (parsedSplits.length === 0) throw new ApiError(400, "Splits array cannot be empty");
        const totalSplit = parsedSplits.reduce((sum, s) => sum + s.amount, 0);
        if (Math.abs(totalSplit - totalAmount) > 0.01) {
            throw new ApiError(400, `Split amounts (${totalSplit.toFixed(2)}) don't match total amount (${totalAmount})`);
        }
        expenseSplits = parsedSplits.map(s => ({ userId: s.userId, splitValue: s.amount, finalAmount: s.amount }));
    } else if (type === "PERCENTAGE") {
        if (parsedSplits.length === 0) throw new ApiError(400, "Splits array cannot be empty");
        const totalPercentage = parsedSplits.reduce((sum, s) => sum + s.percentage, 0);
        if (Math.abs(totalPercentage - 100) > 0.01) {
            throw new ApiError(400, `Percentages must add up to 100. Current total: ${totalPercentage.toFixed(2)}%`);
        }
        expenseSplits = parsedSplits.map(s => ({
            userId: s.userId,
            splitValue: s.percentage,
            finalAmount: Number(((totalAmount * s.percentage) / 100).toFixed(2))
        }));
    } else if (type === "SHARES") {
        if (parsedSplits.length === 0) throw new ApiError(400, "Splits array cannot be empty");
        const totalShares = parsedSplits.reduce((sum, s) => sum + s.shares, 0);
        if (totalShares <= 0) throw new ApiError(400, "Total shares must be greater than 0");
        const perShare = totalAmount / totalShares;
        expenseSplits = parsedSplits.map(s => ({
            userId: s.userId,
            splitValue: s.shares,
            finalAmount: Number((perShare * s.shares).toFixed(2))
        }));
    } else {
        throw new ApiError(400, "Invalid split type");
    }

    let receipt = undefined;
    if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        receipt = `data:${req.file.mimetype};base64,${b64}`;
    }

    const expense = await Expense.create({
        groupId,
        title: title.trim(),
        description: description?.trim(),
        totalAmount,
        paidBy: actualPayer,
        splitType: type,
        expenseDate: expenseDate || new Date(),
        receipt
    });

    const splitsWithExpenseId = expenseSplits.map(s => ({
        ...s,
        expenseId: expense._id
    }));

    await ExpenseSplit.insertMany(splitsWithExpenseId);

    const groupMembers = await GroupMember.find({ group: groupId });
    for (const member of groupMembers) {
        if (member.user.toString() !== req.user._id.toString()) {
            await createNotification({
                userId: member.user,
                message: `${req.user.username} added an expense "${expense.title}"`,
                type: "expense_added",
                relatedId: expense._id,
                relatedModel: "Expense"
            });
        }
    }

    const populatedExpense = await Expense.findById(expense._id)
        .populate("paidBy", "username fullname avatar")
        .populate("groupId", "name");

    const populatedSplits = await ExpenseSplit.find({ expenseId: expense._id })
        .populate("userId", "username fullname avatar");

    res.status(201).json(
        new ApiResponse(201, { expense: populatedExpense, splits: populatedSplits }, "Expense added successfully")
    );
});

export const getGroupExpenses = asyncHandler(async (req, res) => {
    const { groupId } = req.params;

    const isMember = await GroupMember.findOne({ group: groupId, user: req.user._id });
    if (!isMember) throw new ApiError(403, "You are not a member of this group");

    const expenses = await Expense.find({ groupId })
        .populate("paidBy", "username fullname avatar")
        .sort({ expenseDate: -1 });

    res.status(200).json(new ApiResponse(200, { expenses }, "Expenses fetched successfully"));
});

export const getExpenseById = asyncHandler(async (req, res) => {
    const { expenseId } = req.params;

    const expense = await Expense.findById(expenseId)
        .populate("paidBy", "username fullname avatar")
        .populate("groupId", "name");

    if (!expense) throw new ApiError(404, "Expense not found");

    const isMember = await GroupMember.findOne({ group: expense.groupId._id, user: req.user._id });
    if (!isMember) throw new ApiError(403, "Access denied");

    const splits = await ExpenseSplit.find({ expenseId: new mongoose.Types.ObjectId(expenseId) })
        .populate("userId", "username fullname avatar");

    res.status(200).json(new ApiResponse(200, { expense, splits }, "Expense details fetched"));
});

export const updateExpense = asyncHandler(async (req, res) => {
    const { expenseId } = req.params;
    const { title, description, totalAmount, splitType, paidBy } = req.body;
    let { splits } = req.body;

    let parsedSplits = splits;
    if (typeof splits === "string") {
        try {
            parsedSplits = JSON.parse(splits);
        } catch (error) {
            throw new ApiError(400, "Invalid splits format");
        }
    }

    const expense = await Expense.findById(expenseId);
    if (!expense) throw new ApiError(404, "Expense not found");

    if (expense.paidBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only expense creator can update");
    }

    const newAmount = totalAmount || expense.totalAmount;
    const newType = splitType || expense.splitType;
    let validatedSplits = [];

    const amountChanged = totalAmount && totalAmount !== expense.totalAmount;
    const typeChanged = splitType && splitType !== expense.splitType;
    const splitsProvided = parsedSplits && Array.isArray(parsedSplits) && parsedSplits.length > 0;

    const financialUpdateOccurred = amountChanged || typeChanged || splitsProvided || (paidBy && paidBy !== expense.paidBy.toString());

    if (splitsProvided) {
        if (newType === "EQUAL") {
            validatedSplits = calculateEqualSplits(parsedSplits, newAmount);
        } else if (newType === "EXACT") {
            const totalSplit = parsedSplits.reduce((sum, s) => sum + s.amount, 0);
            if (Math.abs(totalSplit - newAmount) > 0.01) {
                throw new ApiError(400, `Split amounts (${totalSplit.toFixed(2)}) don't match total amount (${newAmount})`);
            }
            validatedSplits = parsedSplits.map(s => ({ userId: s.userId, splitValue: s.amount, finalAmount: s.amount }));
        } else if (newType === "PERCENTAGE") {
            const totalPercentage = parsedSplits.reduce((sum, s) => sum + s.percentage, 0);
            if (Math.abs(totalPercentage - 100) > 0.01) {
                throw new ApiError(400, `Percentages must add up to 100. Current total: ${totalPercentage.toFixed(2)}%`);
            }
            validatedSplits = parsedSplits.map(s => ({
                userId: s.userId,
                splitValue: s.percentage,
                finalAmount: Number(((newAmount * s.percentage) / 100).toFixed(2))
            }));
        } else if (newType === "SHARES") {
            const totalShares = parsedSplits.reduce((sum, s) => sum + s.shares, 0);
            if (totalShares <= 0) throw new ApiError(400, "Total shares must be greater than 0");
            const perShare = newAmount / totalShares;
            validatedSplits = parsedSplits.map(s => ({
                userId: s.userId,
                splitValue: s.shares,
                finalAmount: Number((perShare * s.shares).toFixed(2))
            }));
        }
    } else if (amountChanged || typeChanged) {
        if (newType !== "EQUAL") {
            throw new ApiError(400, "You must provide a new splits array when updating the total amount for non-EQUAL splits.");
        }
        const existingSplits = await ExpenseSplit.find({ expenseId });
        const existingUserIds = existingSplits.map(s => s.userId);
        validatedSplits = calculateEqualSplits(existingUserIds, newAmount);
    }

    if (paidBy) {
        const isPayerMember = await GroupMember.findOne({ group: expense.groupId, user: paidBy });
        if (!isPayerMember) throw new ApiError(400, "The selected payer must be a member of this group");
        expense.paidBy = paidBy;
    }

    if (title) expense.title = title.trim();
    if (description !== undefined) expense.description = description?.trim();
    if (totalAmount) expense.totalAmount = totalAmount;
    if (splitType) expense.splitType = splitType;

    if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        expense.receipt = `data:${req.file.mimetype};base64,${b64}`;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await expense.save({ session });

        if (validatedSplits.length > 0) {
            await ExpenseSplit.deleteMany({ expenseId: new mongoose.Types.ObjectId(expenseId) }).session(session);

            const splitsWithExpenseId = validatedSplits.map(s => ({ ...s, expenseId: expense._id }));
            await ExpenseSplit.insertMany(splitsWithExpenseId, { session });
        }

        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new ApiError(500, "Failed to update expense safely. Changes rolled back.");
    }

    if (financialUpdateOccurred) {
        const groupMembers = await GroupMember.find({ group: expense.groupId });
        for (const member of groupMembers) {
            if (member.user.toString() !== req.user._id.toString()) {
                await createNotification({
                    userId: member.user,
                    message: `${req.user.username} updated the financial details of "${expense.title}"`,
                    type: "expense_updated",
                    relatedId: expense._id,
                    relatedModel: "Expense"
                });
            }
        }
    }

    const updatedExpense = await Expense.findById(expenseId).populate("paidBy", "username fullname avatar");
    const updatedSplits = await ExpenseSplit.find({ expenseId: new mongoose.Types.ObjectId(expenseId) }).populate("userId", "username fullname avatar");

    res.status(200).json(new ApiResponse(200, { expense: updatedExpense, splits: updatedSplits }, "Expense updated successfully"));
});

export const deleteExpense = asyncHandler(async (req, res) => {
    const { expenseId } = req.params;

    const expense = await Expense.findById(expenseId);
    if (!expense) throw new ApiError(404, "Expense not found");

    if (expense.paidBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only expense creator can delete");
    }

    const groupMembers = await GroupMember.find({ group: expense.groupId });
    for (const member of groupMembers) {
        if (member.user.toString() !== req.user._id.toString()) {
            await createNotification({
                userId: member.user,
                message: `${req.user.username} deleted an expense "${expense.title}"`,
                type: "other",
                relatedId: expense._id,
                relatedModel: "Expense"
            });
        }
    }

    await ExpenseSplit.deleteMany({ expenseId: new mongoose.Types.ObjectId(expenseId) });
    await Expense.findByIdAndDelete(expenseId);

    res.status(200).json(new ApiResponse(200, {}, "Expense deleted successfully"));
});