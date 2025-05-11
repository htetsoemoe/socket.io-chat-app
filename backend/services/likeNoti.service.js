import mongoose from "mongoose";
import notificationSchema from "../models/notification.model.js";

export default class LikeNotiService {
    constructor() {
        this.likeNotiCollection = "likeNotis";
        this.likeNotiModel = mongoose.model(
            this.likeNotiCollection,
            notificationSchema
        );
    }

    async createLikeNoti({
        notiSenderId,
        notiReceiverId,
        msgId,
        isLike,
        profilePic,
        message,
    }) {
        return await this.likeNotiModel.create({
            notiSenderId,
            notiReceiverId,
            msgId,
            isLike,
            profilePic,
            message,
        });
    }

    async getAllNotificationsByUserId(userId) {
        return await this.likeNotiModel.find({ notiReceiverId: userId })
        .sort({ createdAt: -1 })
        .limit(4);
    }
}