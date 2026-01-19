import crypto from "crypto";

import { Invitation } from "../models/invitation.model.js";
import { Group } from "../models/group.model.js";
import { GroupMember } from "../models/groupMember.model.js";
import { User } from "../models/user.model.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendGroupInviteEmail } from "../utils/email.js";

export const inviteMemberByUsername = asyncHandler(async (req, res) => {
    const { groupId, username } = req.body;
    const adminId = req.user._id;

    const admin = await GroupMember.findOne({
        group: groupId,
        user: adminId,
        role: "ADMIN"
    });
    if (!admin) {
        throw new ApiError(403, "Only admin can invite members");
    }

    const group = await Group.findById(groupId);
    if (!group) {
        throw new ApiError(404, "Group not found");
    }

    const user = await User.findOne({ username });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const alreadyMember = await GroupMember.findOne({
        group: groupId,
        user: user._id
    });
    if (alreadyMember) {
        throw new ApiError(400, "User already in group");
    }

    const pendingInvite = await Invitation.findOne({
        groupId,
        email: user.email,
        status: "PENDING"
    });
    if (pendingInvite) {
        throw new ApiError(400, "Invitation already sent");
    }

    const invitation = new Invitation({
        groupId,
        email: user.email,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    await invitation.save();

    const acceptLink =
        `${process.env.FRONTEND_URL}/invite/accept/${invitation._rawToken}`;

    const rejectLink =
        `${process.env.FRONTEND_URL}/invite/reject/${invitation._rawToken}`;

    await sendGroupInviteEmail({
        to: user.email,
        groupName: group.name,
        inviterName: req.user.username,
        acceptLink,
        rejectLink
    });

    res.status(201).json(
        new ApiResponse(201, null, "Invitation sent successfully")
    );
});

export const acceptInvitation = asyncHandler(async (req, res) => {
    const { token } = req.params;

    if (!req.user) {
        throw new ApiError(401, "Please login to accept invitation");
    }

    const userId = req.user._id;

    console.log("RAW TOKEN:", req.params.token);
    
    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const invitation = await Invitation.findOne({
        inviteToken: hashedToken,
        status: "PENDING",
        expiresAt: { $gt: new Date() }
    });

    if (!invitation) {
        throw new ApiError(400, "Invitation invalid or expired");
    }

    const user = await User.findById(userId);
    if (!user || user.email !== invitation.email) {
        throw new ApiError(403, "This invitation is not for your account");
    }

    invitation.status = "ACCEPTED";
    await invitation.save();

    const alreadyMember = await GroupMember.findOne({
        group: invitation.groupId,
        user: userId
    });

    if (!alreadyMember) {
        await GroupMember.create({
            group: invitation.groupId,
            user: userId,
            role: "MEMBER"
        });
    }

    res.status(200).json(
        new ApiResponse(200, null, "Joined group successfully")
    );
});


export const rejectInvitation = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const userId = req.user._id;

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const invitation = await Invitation.findOneAndUpdate(
        {
            inviteToken: hashedToken,
            status: "PENDING",
            expiresAt: { $gt: new Date() }
        },
        { status: "REJECTED" },
        { new: true }
    );

    if (!invitation) {
        throw new ApiError(400, "Invitation invalid or expired");
    }

    const user = await User.findById(userId);
    if (!user || user.email !== invitation.email) {
        throw new ApiError(403, "Unauthorized invitation access");
    }

    res.status(200).json(
        new ApiResponse(200, null, "Invitation rejected successfully")
    );
});
