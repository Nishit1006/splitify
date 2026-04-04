import mongoose from "mongoose";
import { Group } from "../models/group.model.js";
import { GroupMember } from "../models/groupMember.model.js";
import { Expense } from "../models/expense.model.js";
import { ExpenseSplit } from "../models/expenseSplit.model.js";
import { Settlement } from "../models/settlement.model.js";
import { Notification } from "../models/notification.model.js";
import { Invitation } from "../models/invitation.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createGroup = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        throw new ApiError(400, "Group name is required");
    }

    let groupImage = undefined;
    if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        groupImage = `data:${req.file.mimetype};base64,${b64}`;
    }

    const group = await Group.create({
        name,
        description,
        createdBy: req.user._id,
        groupImage
    });

    await GroupMember.create({
        group: group._id,
        user: req.user._id,
        role: "ADMIN"
    });

    return res.status(201).json(
        new ApiResponse(201, { group }, "Group created successfully")
    );
});

export const getMyGroups = asyncHandler(async (req, res) => {
    const memberships = await GroupMember.find({
        user: req.user._id
    }).populate("group");

    const groups = memberships
        .map(m => m.group)
        .filter(Boolean);

    res.status(200).json(
        new ApiResponse(200, { groups }, "Groups fetched successfully")
    );
});

export const getGroupMembers = asyncHandler(async (req, res) => {
    const { groupId } = req.params;

    const members = await GroupMember.find({ group: groupId })
        .populate("user", "username fullName avatar _id");

    const group = await Group.findById(groupId);

    if (!group) {
        throw new ApiError(404, "Group not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {
            group,
            members: members.map(m => ({
                _id: m._id,
                user: m.user,
                role: m.role,
            }))
        }, "Members fetched successfully")
    );
});

export const deleteGroup = asyncHandler(async (req, res) => {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
        throw new ApiError(404, "Group not found");
    }

    if (group.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only the group creator can delete this group");
    }

    const expenses = await Expense.find({ groupId });
    const expenseIds = expenses.map(e => e._id);

    const settlements = await Settlement.find({ groupId });
    const settlementIds = settlements.map(s => s._id);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        if (expenseIds.length > 0) {
            await ExpenseSplit.deleteMany({ expenseId: { $in: expenseIds } }).session(session);
        }

        await Expense.deleteMany({ groupId }).session(session);
        await Settlement.deleteMany({ groupId }).session(session);
        await GroupMember.deleteMany({ group: groupId }).session(session);
        await Invitation.deleteMany({ groupId }).session(session);

        await Notification.deleteMany({
            $or: [
                { relatedId: groupId, relatedModel: "Group" },
                { relatedId: { $in: expenseIds }, relatedModel: "Expense" },
                { relatedId: { $in: settlementIds }, relatedModel: "Settlement" }
            ]
        }).session(session);

        await Group.findByIdAndDelete(groupId).session(session);

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json(
            new ApiResponse(200, {}, "Group deleted successfully")
        );
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new ApiError(500, "Failed to delete group safely. Changes rolled back.");
    }
});