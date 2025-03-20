import express from 'express';
import { 
    signupValidator,
    signinValidator,
} from "../validators/auth.validator.js";
import { 
    signup, 
    signin, 
    logout 
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post('/signup', signupValidator, signup);
authRouter.post('/signin', signinValidator, signin);
authRouter.post('/logout', logout);

export default authRouter;