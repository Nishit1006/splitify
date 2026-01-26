import { GroupMember } from "../models/groupMember.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import createNotification from "../services/notification.service.js";
import { Group } from "../models/group.model.js";

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
