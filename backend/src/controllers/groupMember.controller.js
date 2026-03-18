// import mongoose from "mongoose";
// import { GroupMember } from "../models/groupMember.model.js";
// import { Group } from "../models/group.model.js";
// import ApiError from "../utils/ApiError.js";
// import ApiResponse from "../utils/ApiResponse.js";
// import asyncHandler from "../utils/asyncHandler.js";
// import createNotification from "../services/notification.service.js";

// export const getGroupMembers = asyncHandler(async (req, res) => {
//     const { groupId } = req.params;
//     const userId = req.user._id;

//     if (!mongoose.Types.ObjectId.isValid(groupId)) {
//         throw new ApiError(400, "Invalid group id");
//     }

//     const isMember = await GroupMember.findOne({
//         group: groupId,
//         user: userId
//     });

//     if (!isMember) {
//         throw new ApiError(403, "You are not a member of this group");
//     }

//     const group = await Group.findById(groupId).select("name description groupImage");
//     if (!group) {
//         throw new ApiError(404, "Group not found");
//     }

//     const members = await GroupMember.find({ group: groupId })
//         .populate("user", "username fullName email avatar")
//         .sort({ createdAt: 1 });

//     res.status(200).json(
//         new ApiResponse(200, {
//             group,
//             members: members.map(m => ({
//                 _id: m._id,
//                 user: m.user,
//                 role: m.role,
//                 joinedAt: m.createdAt
//             }))
//         }, "Group members fetched successfully")
//     );
// });

// export const removeGroupMember = asyncHandler(async (req, res) => {
//     const { groupId, memberId } = req.params;
//     const adminId = req.user._id;

//     const admin = await GroupMember.findOne({
//         group: groupId,
//         user: adminId,
//         role: "ADMIN"
//     });

//     if (!admin) {
//         throw new ApiError(403, "Only admin can remove members");
//     }

//     if (adminId.toString() === memberId) {
//         throw new ApiError(400, "Admin cannot remove himself");
//     }

//     const member = await GroupMember.findOne({
//         group: groupId,
//         user: memberId
//     });

//     if (!member) {
//         throw new ApiError(404, "Member not found in group");
//     }

//     await GroupMember.findOneAndDelete({
//         group: groupId,
//         user: memberId
//     });

//     const group = await Group.findById(groupId);

//     await createNotification({
//         userId: memberId,
//         message: `You were removed from the group "${group.name}" by ${req.user.username}`,
//         type: "other",
//         relatedId: groupId,
//         relatedModel: "Group"
//     });

//     res.status(200).json(
//         new ApiResponse(200, null, "Member removed successfully")
//     );
// });

import mongoose from "mongoose";
import { GroupMember } from "../models/groupMember.model.js";
import { Group } from "../models/group.model.js";
import { Expense } from "../models/expense.model.js";
import { ExpenseSplit } from "../models/expenseSplit.model.js";
import { Settlement } from "../models/settlement.model.js";
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

    const group = await Group.findById(groupId).select("name description groupImage createdBy");
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

export const leaveGroup = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        throw new ApiError(400, "Invalid group id");
    }

    // Check user is actually a member
    const membership = await GroupMember.findOne({
        group: groupId,
        user: userId
    });

    if (!membership) {
        throw new ApiError(404, "You are not a member of this group");
    }

    const group = await Group.findById(groupId);
    if (!group) {
        throw new ApiError(404, "Group not found");
    }

    const isCreator = group.createdBy.toString() === userId.toString();

    if (isCreator) {
        // ── CREATOR LEAVING ──
        // Count remaining members excluding creator
        const otherMembers = await GroupMember.find({
            group: groupId,
            user: { $ne: userId }
        });

        if (otherMembers.length === 0) {
            // No other members — delete the entire group and all its data
            const expenses = await Expense.find({ groupId });
            const expenseIds = expenses.map(e => e._id);

            if (expenseIds.length > 0) {
                await ExpenseSplit.deleteMany({ expenseId: { $in: expenseIds } });
            }

            await Expense.deleteMany({ groupId });
            await Settlement.deleteMany({ groupId });
            await GroupMember.deleteMany({ group: groupId });
            await Group.findByIdAndDelete(groupId);

            return res.status(200).json(
                new ApiResponse(200, { groupDeleted: true }, "You were the last member. Group has been deleted.")
            );
        }

        // There are other members — transfer ADMIN to the earliest joined member
        const nextAdmin = otherMembers.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        )[0];

        // Promote next member to ADMIN
        await GroupMember.findByIdAndUpdate(nextAdmin._id, { role: "ADMIN" });

        // Update group createdBy to new admin
        await Group.findByIdAndUpdate(groupId, { createdBy: nextAdmin.user });

        // Remove creator from group
        await GroupMember.findByIdAndDelete(membership._id);

        // Notify new admin
        await createNotification({
            userId: nextAdmin.user,
            message: `You are now the admin of "${group.name}" as the previous admin left`,
            type: "other",
            relatedId: groupId,
            relatedModel: "Group"
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                { groupDeleted: false, newAdminId: nextAdmin.user },
                "You have left the group. Admin role transferred."
            )
        );
    }

    // ── REGULAR MEMBER LEAVING ──
    await GroupMember.findByIdAndDelete(membership._id);

    // Notify group admins
    const admins = await GroupMember.find({ group: groupId, role: "ADMIN" });
    for (const admin of admins) {
        await createNotification({
            userId: admin.user,
            message: `${req.user.username} has left the group "${group.name}"`,
            type: "other",
            relatedId: groupId,
            relatedModel: "Group"
        });
    }

    return res.status(200).json(
        new ApiResponse(200, { groupDeleted: false }, "You have successfully left the group")
    );
});