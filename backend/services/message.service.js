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
}