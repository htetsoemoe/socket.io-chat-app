import mongoose from "mongoose";
import userSchema from "../models/user.model.js";

export default class UserService {
    constructor() {
        this.userCollection = "users";
        this.userModel = mongoose.model(
            this.userCollection,
            userSchema
        );
    }

    // get other users for side bar (except logged in user)
    async getUsersForSideBar(loggedInUserId) {
        return await this.userModel.find(
            {
                _id: { $ne: loggedInUserId },

            },
            {
                password: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
            },
        );
    }

    async getUserById(userId) {
        return await this.userModel.findById(userId, {
            password: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
        });
    }

    // OTP Auth: get user name, isAccountVerified by userId
    async getUserData(userId) {
        return await this.userModel.findById(
            { _id: userId });
    }
}   