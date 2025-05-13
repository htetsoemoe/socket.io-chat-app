import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        isLike: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
        collation: { locale: 'my' },
        versionKey: false,
    }
);

messageSchema.pre("findOneAndDelete", async function (next) {
    try {
        const messageId = this.getQuery()._id;
        await mongoose.model("likeNotis").deleteOne({ msgId: messageId });
        next();
    } catch (error) {
       next(error);
    }
});

mongoose.model("messages", messageSchema);
export default messageSchema;