import mongoose from "mongoose";
import userSchema from "../models/user.model.js";

export default class AuthService {
    constructor() {
        this.userCollectionName = "users";
        this.userModel = mongoose.model(
            this.userCollectionName,
            userSchema
        )
    }

    async createUser(user) {
        return await this.userModel.create(user);
    }

    async getUserByUsername(username) {
        return await this.userModel.findOne({ username });
    }

    async getUserByEmail(email) {
        return await this.userModel.findOne({ email });
    }

    async getUserById(id) {
        return await this.userModel.findById(
            {
                _id: id,
            },
            {
                password: 0,
                createdAt: 0,
                updatedAt: 0,
            }
        );
    }
}