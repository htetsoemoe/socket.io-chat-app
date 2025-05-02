import NotificationService from "../services/notification.service.js";

export const sendHeart = async (req, res) => {
    try {
        const {isLike, senderId, receiverId} = req.body;
        const msgId = req.params.msgId;

        const notificationService = new NotificationService();
        await notificationService.updateMessageIsLike(msgId, isLike);

        res.status(200).json({
            data: {
                isLike,
                senderId,
                receiverId,
                msgId,
            },
            status: "success",
            message: "Heart sent successfully",
        })
    } catch (error) {
        console.log(`Error sendHeart controller: ${error}`);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}