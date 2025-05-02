import mongoose from "mongoose";
import messageSchema from "../models/message.model.js";

export default class NotificationService {
    constructor() {
        this.messageCollection = "messages";
        this.messageModel = mongoose.model(
            this.messageCollection,
            messageSchema
        );
    }

    async updateMessageIsLike(msgId, isLike) {
        return await this.messageModel.findByIdAndUpdate(
            { _id: msgId, },
            { isLike: isLike },
            { new: true }
        );
    }

}
