import mongoose from "mongoose";
import conversationSchema from "../models/conversation.model.js";

export default class ConversationService {
    constructor() {
        this.conversationCollection = "conversations";
        this.conversationModel = mongoose.model(
            this.conversationCollection,
            conversationSchema
        )
    }

    async createConversation(conversation) {
        return await this.conversationModel.create(conversation);
    }

    async findConversationBySenderAndReceiver(senderId, receiverId) {
        return await this.conversationModel.findOne({
            participants: {
                $all: [senderId, receiverId],
            },
        });
    }

    async getAllMessagesByUserToChatId(userId, chatUserId) {
        return await this.conversationModel.findOne({
            participants: {
                $all: [userId, chatUserId],
            },
        }).populate("messages");
    }
}