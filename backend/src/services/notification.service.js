import { Notification } from "../models/notification.model.js";

const createNotification = async ({
    userId,
    message,
    type,
    relatedId,
    relatedModel
}) => {
    return await Notification.create({
        userId,
        message,
        type,
        relatedId,
        relatedModel
    });
};

export default createNotification;
