import MessageService from "../services/message.service.js";
import ConversationService from "../services/conversation.service.js";
import LikeNotiService from "../services/likeNoti.service.js";
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

export const deleteMsgAndNotificationByMsgId = async (req, res) => {
    try {
        const msgId = req.params.msgId;
        const { isLike } = req.body;
        console.log(`msgId: ${msgId}, isLike: ${isLike}`);

        // If message is like, we need to delete notification
        // if (isLike === true) {
        //     const likeNotiService = new LikeNotiService();
        //     const deleteNoti = await likeNotiService.deleteNotificationByMsgId(msgId);
        // }

        /*
            When delete a message, isLike is false, that's why we can't delete notification.
            So, when delete a message, we need to delete a notification in service using msgId.
            Using ====>     messageSchema.pre("findOneAndDelete", async function (next) {...}
        */

        const messageService = new MessageService();
        const deleteMessage = await messageService.deleteMessageByMessageId(msgId);

        io.emit("deleteMessage", msgId);

        res.status(200).json({
            message: "Delete notification and message successfully",
            status: "success",
        })
    } catch (error) {
        console.log(`Error deleteNotificationByMsgId controller: ${error}`);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}