import MessageService from "../services/message.service.js";

export const sendMessage = async (req, res) => {
    try {
        const user = req.user;
        console.log(`sendMessage controller...`);
        console.log(`SenderId: ${user._id}`);
        console.log(`user: ${JSON.stringify(user)}`);

        res.status(201).json({
            user,
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