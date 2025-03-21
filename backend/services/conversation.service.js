import mongoose from "mongoose";
import conversationSchema from "../models/conversation.model";

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
}