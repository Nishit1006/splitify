import { Expense } from "../models/expense.model.js";
import { ExpenseSplit } from "../models/expenseSplit.model.js";
import { GroupMember } from "../models/groupMember.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

export const addExpense = asyncHandler(async (req, res) => {
    const { groupId, title, description, totalAmount, splitType, splits, expenseDate } = req.body;

    if (!groupId || !title || !totalAmount || !splits || !Array.isArray(splits)) {
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

    const expense = await Expense.create({
        groupId,
        title: title.trim(),
        description: description?.trim(),
        totalAmount,
        paidBy: req.user._id,
        splitType: splitType || "EQUAL",
        expenseDate: expenseDate || new Date()
    });

    let expenseSplits = [];

    if (splitType === "EQUAL" || !splitType) {
        const perPersonAmount = totalAmount / splits.length;

        expenseSplits = splits.map(userId => ({
            expenseId: expense._id,
            userId,
            splitValue: 1,
            finalAmount: perPersonAmount
        }));
    }

    else if (splitType === "EXACT") {
        const totalSplit = splits.reduce((sum, s) => sum + s.amount, 0);

        if (Math.abs(totalSplit - totalAmount) > 0.01) {
            throw new ApiError(400, "Split amounts don't match total amount");
        }

        expenseSplits = splits.map(s => ({
            expenseId: expense._id,
            userId: s.userId,
            splitValue: s.amount,
            finalAmount: s.amount
        }));
    }

    else if (splitType === "PERCENTAGE") {
        const totalPercentage = splits.reduce((sum, s) => sum + s.percentage, 0);

        if (Math.abs(totalPercentage - 100) > 0.01) {
            throw new ApiError(400, "Percentages must add up to 100");
        }

        expenseSplits = splits.map(s => ({
            expenseId: expense._id,
            userId: s.userId,
            splitValue: s.percentage,
            finalAmount: (totalAmount * s.percentage) / 100
        }));
    }

    else if (splitType === "SHARES") {
        const totalShares = splits.reduce((sum, s) => sum + s.shares, 0);
        const perShare = totalAmount / totalShares;

        expenseSplits = splits.map(s => ({
            expenseId: expense._id,
            userId: s.userId,
            splitValue: s.shares,
            finalAmount: perShare * s.shares
        }));
    } else {
        throw new ApiError(400, "Invalid split type");
    }

    await ExpenseSplit.insertMany(expenseSplits);

    const populatedExpense = await Expense.findById(expense._id)
        .populate("paidBy", "username fullname avatar")
        .populate("groupId", "name");

    const populatedSplits = await ExpenseSplit.find({ expenseId: expense._id })
        .populate("userId", "username fullname avatar");

    res.status(201).json(
        new ApiResponse(
            201,
            { expense: populatedExpense, splits: populatedSplits },
            "Expense added successfully"
        )
    );
});

export const getGroupExpenses = asyncHandler(async (req, res) => {
    const { groupId } = req.params;

    const isMember = await GroupMember.findOne({
        group: groupId,
        user: req.user._id
    });

    if (!isMember) {
        throw new ApiError(403, "You are not a member of this group");
    }

    const expenses = await Expense.find({ groupId })
        .populate("paidBy", "username fullname avatar")
        .sort({ expenseDate: -1 });

    res.status(200).json(
        new ApiResponse(200, { expenses }, "Expenses fetched successfully")
    );
});



export const getExpenseById = asyncHandler(async (req, res) => {
    const { expenseId } = req.params;

    const expense = await Expense.findById(expenseId)
        .populate("paidBy", "username fullname avatar")
        .populate("groupId", "name");

    if (!expense) {
        throw new ApiError(404, "Expense not found");
    }

    const isMember = await GroupMember.findOne({
        group: expense.groupId._id,
        user: req.user._id
    });

    if (!isMember) {
        throw new ApiError(403, "Access denied");
    }

    const splits = await ExpenseSplit.find({
        expenseId: new mongoose.Types.ObjectId(expenseId)
    })
    .populate("userId", "username fullname avatar");

    res.status(200).json(
        new ApiResponse(200, { expense, splits }, "Expense details fetched")
    );
});


export const updateExpense = asyncHandler(async (req, res) => {
    const { expenseId } = req.params;
    const { title, description, totalAmount, splitType, splits } = req.body;

    const expense = await Expense.findById(expenseId);

    if (!expense) {
        throw new ApiError(404, "Expense not found");
    }

    if (expense.paidBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only expense creator can update");
    }

    if (title) expense.title = title.trim();
    if (description !== undefined) expense.description = description?.trim();
    if (totalAmount) expense.totalAmount = totalAmount;
    if (splitType) expense.splitType = splitType;

    await expense.save();

    if (splits && Array.isArray(splits) && splits.length > 0) {

        await ExpenseSplit.deleteMany({
            expenseId: new mongoose.Types.ObjectId(expenseId)
        });

        let expenseSplits = [];

        if (expense.splitType === "EQUAL") {
            const perPersonAmount = expense.totalAmount / splits.length;

            expenseSplits = splits.map(userId => ({
                expenseId: expense._id,
                userId,
                splitValue: 1,
                finalAmount: perPersonAmount
            }));
        }

        else if (expense.splitType === "EXACT") {
            expenseSplits = splits.map(s => ({
                expenseId: expense._id,
                userId: s.userId,
                splitValue: s.amount,
                finalAmount: s.amount
            }));
        }

        else if (expense.splitType === "PERCENTAGE") {
            expenseSplits = splits.map(s => ({
                expenseId: expense._id,
                userId: s.userId,
                splitValue: s.percentage,
                finalAmount: (expense.totalAmount * s.percentage) / 100
            }));
        }

        else if (expense.splitType === "SHARES") {
            const totalShares = splits.reduce((sum, s) => sum + s.shares, 0);

            expenseSplits = splits.map(s => ({
                expenseId: expense._id,
                userId: s.userId,
                splitValue: s.shares,
                finalAmount: (expense.totalAmount * s.shares) / totalShares
            }));
        }

        await ExpenseSplit.insertMany(expenseSplits);
    }

    const updatedExpense = await Expense.findById(expenseId)
        .populate("paidBy", "username fullname avatar");

    const updatedSplits = await ExpenseSplit.find({
        expenseId: new mongoose.Types.ObjectId(expenseId)
    })
    .populate("userId", "username fullname avatar");

    res.status(200).json(
        new ApiResponse(
            200,
            { expense: updatedExpense, splits: updatedSplits },
            "Expense updated successfully"
        )
    );
});

export const deleteExpense = asyncHandler(async (req, res) => {
    const { expenseId } = req.params;

    const expense = await Expense.findById(expenseId);

    if (!expense) {
        throw new ApiError(404, "Expense not found");
    }

    if (expense.paidBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only expense creator can delete");
    }

    await ExpenseSplit.deleteMany({
        expenseId: new mongoose.Types.ObjectId(expenseId)
    });

    await Expense.findByIdAndDelete(expenseId);

    res.status(200).json(
        new ApiResponse(200, {}, "Expense deleted successfully")
    );
});