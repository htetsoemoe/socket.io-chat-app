import NotificationService from "../services/notification.service.js";
import UserService from "../services/users.service.js";
import MessageService from "../services/message.service.js";
import LikeNotiService from "../services/likeNoti.service.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendHeart = async (req, res) => {
    try {
        // senderId is the user who send the message
        // receiverId is the user who receive the message
        const { isLike, senderId, receiverId } = req.body;
        const msgId = req.params.msgId;

        const notificationService = new NotificationService();
        const userService = new UserService();
        const messageService = new MessageService();
        const likeNotiService = new LikeNotiService();

        // auth user for sendNotification event
        const authUser = req.user; // user clicked on heart
        console.log(`authUser: ${JSON.stringify(authUser)}`);

        await notificationService.updateMessageIsLike(msgId, isLike);

        const notiReceiverSocketId = getReceiverSocketId(senderId);
        console.log(`notiReceiverSocketId: ${notiReceiverSocketId}`);

        const navbarNotiReceiverSocketId = getReceiverSocketId(senderId);
        console.log(`navbarNotiReceiverSocketId: ${navbarNotiReceiverSocketId}`);

        // We need to find navbar notification sender name using receiverId
        const notiSender = await userService.getUserById(receiverId);
        console.log(`notiSender: ${JSON.stringify(notiSender)}`);

        // We need to find message content using msgId
        const foundMessage = await messageService.getMessageByMessageId(msgId);
        console.log(`foundMessage: ${JSON.stringify(foundMessage?.message)}`);

        // This is a love reaction event
        if (notiReceiverSocketId) {
            io.to(notiReceiverSocketId).emit("receiveLoveReaction", {
                isLike,
                senderId,
                receiverId,
                msgId,
            });
        }

        // This is a navbar notification event
        if (navbarNotiReceiverSocketId) {
            io.to(navbarNotiReceiverSocketId).emit("navNotification", {
                notiSenderName: notiSender?.username,
                msgId,
                profilePic: notiSender?.profilePic, // <== change this to notiSender?.profilePic
                message: `${notiSender?.name} liked your message. "${String(foundMessage?.message).slice(0, 20)}..."`,
                // <== change this to notiSender?.name
            })
        }

        // We need to save this event to database as a notification
        const newLikeNotiData = {
            notiSenderId: notiSender?._id,
            notiReceiverId: senderId, // this is notification receiver(auth user)
            msgId: msgId,
            isLike: true,
            profilePic: notiSender?.profilePic,
            message: `${notiSender?.name} liked your message. "${String(foundMessage?.message).slice(0, 20)}..."`,
        }
        const newLikeNoti = await likeNotiService.createLikeNoti(newLikeNotiData);

        res.status(200).json({
            data: {
                isLike,
                senderId,
                receiverId,
                msgId,
            },
            status: "success",
            message: "Heart sent and create a notification successfully",
        })
    } catch (error) {
        console.log(`Error sendHeart controller: ${error}`);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const getAllNotificationsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const likeNotiService = new LikeNotiService();
        const foundNotis = await likeNotiService.getAllNotificationsByUserId(userId);

        res.status(200).json({
            notifications: foundNotis,
            status: "success",
            message: "Get all notifications successfully",
        })

    } catch (error) {
        console.log(`Error getAllNotifications controller: ${error}`);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}