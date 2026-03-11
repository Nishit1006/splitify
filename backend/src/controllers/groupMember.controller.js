import mongoose from "mongoose";
import { GroupMember } from "../models/groupMember.model.js";
import { Group } from "../models/group.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import createNotification from "../services/notification.service.js";

export const getGroupMembers = asyncHandler(async (req, res) => {
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

    const group = await Group.findById(groupId).select("name description groupImage");
    if (!group) {
        throw new ApiError(404, "Group not found");
    }

    const members = await GroupMember.find({ group: groupId })
        .populate("user", "username fullName email avatar")
        .sort({ createdAt: 1 });

    res.status(200).json(
        new ApiResponse(200, {
            group,
            members: members.map(m => ({
                _id: m._id,
                user: m.user,
                role: m.role,
                joinedAt: m.createdAt
            }))
        }, "Group members fetched successfully")
    );
});

export const removeGroupMember = asyncHandler(async (req, res) => {
    const { groupId, memberId } = req.params;
    const adminId = req.user._id;

    const admin = await GroupMember.findOne({
        group: groupId,
        user: adminId,
        role: "ADMIN"
    });

    if (!admin) {
        throw new ApiError(403, "Only admin can remove members");
    }

    if (adminId.toString() === memberId) {
        throw new ApiError(400, "Admin cannot remove himself");
    }

    const member = await GroupMember.findOne({
        group: groupId,
        user: memberId
    });

    if (!member) {
        throw new ApiError(404, "Member not found in group");
    }

    await GroupMember.findOneAndDelete({
        group: groupId,
        user: memberId
    });

    const group = await Group.findById(groupId);

    await createNotification({
        userId: memberId,
        message: `You were removed from the group "${group.name}" by ${req.user.username}`,
        type: "other",
        relatedId: groupId,
        relatedModel: "Group"
    });

    res.status(200).json(
        new ApiResponse(200, null, "Member removed successfully")
    );
});
