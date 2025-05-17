import bcrypt from "bcryptjs";
import AuthService from "../services/auth.service.js";
import { generateTokenAndSetCookie } from "../utils/index.js";
import { transporter } from "../config/index.js";
import e from "express";

export const signup = async (req, res) => {
    const authService = new AuthService();
    try {
        const { name, username, password, confirmPassword, gender, email } = req.body; // <== add email
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

        // Check if email already exists
        const existedEmail = await authService.getUserByEmail(email);
        if (existedEmail) {
            return res.status(400).json({
                message: "Email already exists",
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
            email,
        };
        const newUser = await authService.createUser(newUserData);
        const { password: pass, ...rest } = newUser._doc;

        if (newUser) {
            // Generate token and set cookie
            generateTokenAndSetCookie(newUser._id, res);

            // Sending welcome email with nodemailer using Brevo SMTP
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: "Welcome to Chatty Twitty",
                text: `Welcome to Chatty Twitty, You have successfully signed up with email: ${email}. Enjoy your chat!`,
            }
            await transporter.sendMail(mailOptions);

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
            email: foundUser?.email,
            verifyOtp: foundUser?.verifyOtp,
            verifyOtpExpireAt: foundUser?.verifyOtpExpireAt,
            isAccountVerified: foundUser?.isAccountVerified,
            resetOtp: foundUser?.resetOtp,
            resetOtpExpireAt: foundUser?.resetOtpExpireAt,
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

// Send verification OPT to user's email
export const sendVerificationOTP = async (req, res) => {
    try {
        const { _id: userId } = req.user
        const authService = new AuthService();
        const user = await authService.getUserById(userId);

        if (user?.isAccountVerified) {
            return res.status(400).json({
                success: false,
                message: "Account already verified",
            });
        }

        // Generate verification OTP = 6 digit random number
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        // Set OTP in user's document
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        await user.save();

        // Send verification OTP to user's email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user?.email,
            subject: "Account Verification OTP",
            text: `Your OTP is ${otp}. This OTP is valid for 24 hours. Verify your account using this OTP.`,
        }
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "Verification OTP sent successfully",
        });
    } catch (error) {
        console.log(`Error sendVerificationOTP controller: ${error}`);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const { otp } = req.body;
        const { _id: userId } = req.user;
        const authService = new AuthService();

        if (!userId || !otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid request: Missing required fields",
            });
        }

        const user = await authService.getUserById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if OTP is valid or not
        if (user?.verifyOtp === '' || user?.verifyOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Check if OTP is expired or not
        if (user?.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired",
            });
        }

        // Update user's isAccountVerified to true, verifyOtp to empty and verifyOtpExpireAt to zero
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Account verified successfully",
        });
    } catch (error) {
        console.log(`Error verifyEmail controller: ${error}`);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const isAuthenticated = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "User is authenticated",
        });
    } catch (error) {
        console.log(`Error isAuthenticated controller: ${error}`);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}