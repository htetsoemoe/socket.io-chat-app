import bcrypt from "bcryptjs";
import AuthService from "../services/auth.service.js";
import { generateTokenAndSetCookie } from "../utils/index.js";

export const signup = async (req, res) => {
    const authService = new AuthService();
    try {
        const { name, username, password, confirmPassword, gender } = req.body;
        // console.log(`name: ${name}, username: ${username}, password: ${password}, confirmPassword: ${confirmPassword}, gender: ${gender}`);

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Password and confirm password do not match",
            });
        }

        // Check if user already exists
        const existedUser = await authService.getUserByUsername(username);
        if (existedUser) {
            return res.status(400).json({
                message: "Username already exists",
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const maleProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUserData = {
            name,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? maleProfilePic : femaleProfilePic,
        };
        const newUser = await authService.createUser(newUserData);
        const { password: pass, ...rest } = newUser._doc;

        if (newUser) {
            // Generate token and set cookie
            generateTokenAndSetCookie(newUser._id, res);

            res.status(201).json({
                user: rest,
                success: true,
                message: "Signup successful",
            })
        }
    } catch (error) {
        console.log(`Error signup controller: ${error}`);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const signin = async (req, res) => {
    const authService = new AuthService();
    try {
        const { username, password } = req.body;
        const foundUser = await authService.getUserByUsername(username);
        if (!foundUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, foundUser?.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password",
            });
        }

        // Generate token and set cookie
        generateTokenAndSetCookie(foundUser?._id, res);
        res.status(200).json({
            _id: foundUser?._id,
            name: foundUser?.name,
            username: foundUser?.username,
            profilePic: foundUser?.profilePic,
        });
    } catch (error) {
        console.log(`Error signin controller: ${error}`);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({
            message: "Logout successful",
        });
    } catch (error) {
        console.log(`Error logout controller: ${error}`);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}
