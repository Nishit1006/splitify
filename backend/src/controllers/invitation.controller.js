import crypto from "crypto";
import mongoose from "mongoose";
import { Invitation } from "../models/invitation.model.js";
import { Group } from "../models/group.model.js";
import { GroupMember } from "../models/groupMember.model.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import { sendGroupInviteEmail } from "../utils/email.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import createNotification from "../services/notification.service.js";

export const sendInvite = asyncHandler(async (req, res) => {
    const { groupId, identifier } = req.body;

    if (!groupId || !identifier) throw new ApiError(400, "Group ID and email/username are required");

    const group = await Group.findById(groupId);
    if (!group) throw new ApiError(404, "Group not found");

    const isEmail = identifier.includes('@');

    let targetUser = await User.findOne(
        isEmail
            ? { email: identifier.toLowerCase().trim() }
            : { username: identifier.toLowerCase().trim() }
    );

    if (!isEmail && !targetUser) {
        throw new ApiError(404, "User with this username not found");
    }

    // FIXED: Prevent the user from trying to invite themselves
    if (targetUser && targetUser._id.toString() === req.user._id.toString()) {
        throw new ApiError(400, "You cannot invite yourself to the group");
    }

    const targetEmail = targetUser ? targetUser.email : identifier.toLowerCase().trim();

    if (targetUser) {
        const isMember = await GroupMember.findOne({ group: groupId, user: targetUser._id });
        if (isMember) throw new ApiError(400, "User is already a member of this group");
    }

    const existingInvite = await Invitation.findOne({ groupId, email: targetEmail });

    if (existingInvite) {
        const timeSinceLastInvite = Date.now() - new Date(existingInvite.createdAt).getTime();
        const tenMinutes = 10 * 60 * 1000;

        if (timeSinceLastInvite < tenMinutes) {
            const remainingMinutes = Math.ceil((tenMinutes - timeSinceLastInvite) / 60000);
            throw new ApiError(400, `Invitation already sent. Please wait ${remainingMinutes} minute(s) before resending.`);
        } else {
            await Invitation.findByIdAndDelete(existingInvite._id);
            await Notification.deleteMany({ relatedId: existingInvite._id, relatedModel: "Invitation" });
        }
    }

    const invitation = new Invitation({
        groupId,
        email: targetEmail,
        invitedBy: req.user._id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    await invitation.validate();
    await invitation.save();

    const acceptLink = `${process.env.FRONTEND_URL}/invite/accept/${invitation._rawToken}`;
    const rejectLink = `${process.env.FRONTEND_URL}/invite/reject/${invitation._rawToken}`;

    try {
        await sendGroupInviteEmail({
            to: targetEmail,
            groupName: group.name,
            inviterName: req.user.username,
            acceptLink,
            rejectLink
        });
    } catch (err) {
        console.error("Failed to send invite email:", err);
    }

    if (targetUser) {
        await createNotification({
            userId: targetUser._id,
            message: `${req.user.username} invited you to join the group "${group.name}"`,
            type: "group_invite",
            relatedId: invitation._id,
            relatedModel: "Invitation"
        });
    }

    res.status(200).json(new ApiResponse(200, { invitation }, "Invitation sent successfully"));
});

export const acceptInvite = asyncHandler(async (req, res) => {
    const { inviteId } = req.params;

    let invitation;

    if (mongoose.Types.ObjectId.isValid(inviteId)) {
        invitation = await Invitation.findById(inviteId);
    }

    if (!invitation) {
        const hashedToken = crypto.createHash("sha256").update(inviteId).digest("hex");
        invitation = await Invitation.findOne({ inviteToken: hashedToken });
    }

    if (!invitation) throw new ApiError(404, "Invalid or expired invitation");

    const group = await Group.findById(invitation.groupId);
    if (!group) throw new ApiError(404, "Group no longer exists");

    const isMember = await GroupMember.findOne({ group: group._id, user: req.user._id });
    if (isMember) {
        await Invitation.findByIdAndDelete(invitation._id);
        throw new ApiError(400, "You are already a member of this group");
    }

    await GroupMember.create({
        group: group._id,
        user: req.user._id,
        role: "MEMBER"
    });

    await Invitation.findByIdAndDelete(invitation._id);

    await Notification.updateMany(
        { relatedId: invitation._id, userId: req.user._id },
        { isRead: true }
    );

    res.status(200).json(new ApiResponse(200, { groupId: group._id }, "Successfully joined the group"));
});

export const rejectInvite = asyncHandler(async (req, res) => {
    const { inviteId } = req.params;

    let invitation;

    if (mongoose.Types.ObjectId.isValid(inviteId)) {
        invitation = await Invitation.findById(inviteId);
    }

    if (!invitation) {
        const hashedToken = crypto.createHash("sha256").update(inviteId).digest("hex");
        invitation = await Invitation.findOne({ inviteToken: hashedToken });
    }

    if (!invitation) throw new ApiError(404, "Invalid or expired invitation");

    await Invitation.findByIdAndDelete(invitation._id);

    await Notification.updateMany(
        { relatedId: invitation._id, userId: req.user._id },
        { isRead: true }
    );

    res.status(200).json(new ApiResponse(200, {}, "Invitation rejected"));
});
