import MessageService from "../services/message.service.js";
import ConversationService from "../services/conversation.service.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

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
            isLike: false,
        };
        const newMessage = await messageService.createMessage(newMessageData);

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }
        await conversation.save();

        // Emit a new message event to the receiver
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            // io.to(<socket_id>).emit() used to send events to specific client
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

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

export const getMessages = async (req, res) => {
    try {
        const user = req.user;
        const senderId = user._id;
        const { id: receiverId } = req.params;

        const conversationService = new ConversationService();
        const conversation = await conversationService.getAllMessagesByUserToChatId(senderId, receiverId);

        if (!conversation) {
            return res.status(404).json({
                data: [],
                message: "Conversation not found",
            })
        }

        const messages = conversation.messages;
        res.status(200).json({
            data: messages,
            status: "success",
            message: "Messages retrieved successfully",
        });
    } catch (error) {
        console.log(`Error getMessages controller: ${error}`);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}