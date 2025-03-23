import MessageService from "../services/message.service.js";
import ConversationService from "../services/conversation.service.js";

export const sendMessage = async (req, res) => {
    try {
        const user = req.user;
        const senderId = user._id;
        const { id: receiverId } = req.params;
        const { message } = req.body;

        // check if conversation exists
        const conversationService = new ConversationService();
        let conversation = await conversationService.findConversationBySenderAndReceiver(senderId, receiverId);
        
        if (!conversation) {
            // create conversation
            conversation = await conversationService.createConversation({
                participants: [senderId, receiverId],
            });
        }

        // create message
        const messageService = new MessageService();
        const newMessageData = {
            senderId,
            receiverId,
            message,
        };
        const newMessage = await messageService.createMessage(newMessageData);

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }
        await conversation.save();

        const { createdAt, updatedAt, ...rest } = newMessage._doc;
        res.status(201).json({
            data: rest,
            status: "success",
            message: "Message sent successfully",
        });
    } catch (error) {
        console.log(`Error sendMessage controller: ${error}`);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}