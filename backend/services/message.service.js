import mongoose from "mongoose";
import messageSchema from "../models/message.model.js";

export default class MessageService {
    constructor() {
        this.messageCollection = "messages";
        this.messageModel = mongoose.model(
            this.messageCollection,
            messageSchema
        )
    }

    async createMessage(message) {
        return await this.messageModel.create(message);
    }

    async getMessageByMessageId(messageId) {
        return await this.messageModel.findById(messageId);
    }

    async deleteMessageByMessageId(msgId) {
        return await this.messageModel.findByIdAndDelete({ _id: msgId });
    }

    async updateMessage(msgId, message) {
        return await this.messageModel.findByIdAndUpdate(msgId, { message }, { new: true });
    }
}