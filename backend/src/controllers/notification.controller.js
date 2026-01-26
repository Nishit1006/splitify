import { Notification } from "../models/notification.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getNotifications = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return res
        .status(200)
        .json(new ApiResponse(200, notifications, "Notifications fetched"));
});

export const markNotificationAsRead = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
        { _id: id, userId },
        { isRead: true },
        { new: true }
    );

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, notification, "Notification marked as read"));
});

export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "All notifications marked as read"));
});

export const getUnreadNotificationCount = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const count = await Notification.countDocuments({
        userId,
        isRead: false
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { count }, "Unread notification count"));
});
