import { GroupMember } from "../models/groupMember.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

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

    await GroupMember.findOneAndDelete({
        group: groupId,
        user: memberId
    });

    res.status(200).json(
        new ApiResponse(200, null, "Member removed successfully")
    );
});
