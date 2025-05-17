import express from 'express';
import { verifyToken } from '../utils/index.js';
import {
    signupValidator,
    signinValidator,
    verifyEmailOTPValidator,
} from "../validators/auth.validator.js";
import {
    signup,
    signin,
    logout,
    sendVerificationOTP,
    verifyEmail,
    isAuthenticated,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post('/signup', signupValidator, signup);
authRouter.post('/signin', signinValidator, signin);
authRouter.post('/logout', logout);

authRouter.use(verifyToken);
authRouter.post('/send-verify-otp', sendVerificationOTP);
authRouter.post('/verify-account', verifyEmailOTPValidator, verifyEmail);
authRouter.post('/is-auth', isAuthenticated);

export default authRouter;