import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        gender: {
            type: String,
            required: true,
            enum: ["male", "female"],
        },
        profilePic: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            required: true,
        },
        verifyOtp: {
            type: String,
            default: "",
        },
        verifyOtpExpireAt: {
            type: Number,
            default: 0,
        },
        isAccountVerified: {
            type: Boolean,
            default: false,
        },
        resetOtp: {
            type: String,
            default: "",
        },
        resetOtpExpireAt: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        collation: { locale: 'my' },
        versionKey: false,
    }
);

export default userSchema;