import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        notiSenderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        notiReceiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        msgId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "messages",
            required: true,
        },
        isLike: {
            type: Boolean,
            required: true,
        },
        profilePic: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        collation: { locale: 'my' },
        versionKey: false,
    }
)

const Notification = mongoose.model("likeNotis", notificationSchema);

export default notificationSchema;