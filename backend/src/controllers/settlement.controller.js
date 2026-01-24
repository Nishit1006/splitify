import mongoose from "mongoose";
import { Settlement } from "../models/settlement.model.js";
import { GroupMember } from "../models/groupMember.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createSettlement = asyncHandler(async (req, res) => {
    const { groupId, paidTo, amount, paymentMethod, referenceNote, proof } = req.body;
    const paidFrom = req.user._id;

    if (!groupId || !paidTo || !amount) {
        throw new ApiError(400, "Required fields missing");
    }

    if (amount <= 0) {
        throw new ApiError(400, "Settlement amount must be positive");
    }

    if (paidFrom.toString() === paidTo.toString()) {
        throw new ApiError(400, "Cannot settle with yourself");
    }

    const members = await GroupMember.find({
        group: groupId,
        user: { $in: [paidFrom, paidTo] }
    });

    if (members.length !== 2) {
        throw new ApiError(403, "Both users must be members of the group");
    }

    const settlement = await Settlement.create({
        groupId,
        paidFrom,
        paidTo,
        amount,
        paymentMethod,
        referenceNote,
        proof
    });

    const populatedSettlement = await Settlement.findById(settlement._id)
        .populate("paidFrom", "username fullname avatar")
        .populate("paidTo", "username fullname avatar")
        .populate("groupId", "name");

    res.status(201).json(
        new ApiResponse(
            201,
            populatedSettlement,
            "Settlement created successfully"
        )
    );
});

export const getGroupSettlements = asyncHandler(async (req, res) => {
    const { groupId } = req.params;

    const isMember = await GroupMember.findOne({
        group: groupId,
        user: req.user._id
    });

    if (!isMember) {
        throw new ApiError(403, "You are not a member of this group");
    }

    const settlements = await Settlement.find({ groupId })
        .populate("paidFrom", "username fullname avatar")
        .populate("paidTo", "username fullname avatar")
        .sort({ settledAt: -1 });

    res.status(200).json(
        new ApiResponse(
            200,
            { settlements },
            "Group settlements fetched successfully"
        )
    );
});

export const getMySettlements = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const settlements = await Settlement.find({
        $or: [{ paidFrom: userId }, { paidTo: userId }]
    })
        .populate("paidFrom", "username fullname avatar")
        .populate("paidTo", "username fullname avatar")
        .populate("groupId", "name")
        .sort({ settledAt: -1 });

    res.status(200).json(
        new ApiResponse(
            200,
            { settlements },
            "Your settlements fetched successfully"
        )
    );
});

export const deleteSettlement = asyncHandler(async (req, res) => {
    const { settlementId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(settlementId)) {
        throw new ApiError(400, "Invalid settlement ID");
    }

    const settlement = await Settlement.findById(settlementId);

    if (!settlement) {
        throw new ApiError(404, "Settlement not found");
    }

    if (settlement.paidFrom.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only payer can delete this settlement");
    }

    await Settlement.findByIdAndDelete(settlementId);

    res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Settlement deleted successfully"
        )
    );
});
