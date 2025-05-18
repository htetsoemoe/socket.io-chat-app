import express from 'express';
import { verifyToken } from '../utils/index.js';
import {
    signupValidator,
    signinValidator,
    verifyEmailOTPValidator,
    sendResetPasswordOtpValidator,
    resetPasswordValidator,
} from "../validators/auth.validator.js";
import {
    signup,
    signin,
    logout,
    sendVerificationOTP,
    verifyEmail,
    isAuthenticated,
    sendResetPasswordOtp,
    resetPassword,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post('/signup', signupValidator, signup);
authRouter.post('/signin', signinValidator, signin);
authRouter.post('/logout', logout);

authRouter.post('/send-reset-otp', sendResetPasswordOtpValidator, sendResetPasswordOtp);
authRouter.post('/reset-password', resetPasswordValidator, resetPassword);

authRouter.use(verifyToken);
authRouter.post('/send-verify-otp', sendVerificationOTP);
authRouter.post('/verify-account', verifyEmailOTPValidator, verifyEmail);
authRouter.post('/is-auth', isAuthenticated);

export default authRouter;