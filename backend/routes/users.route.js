import express from 'express';
import { verifyToken } from '../utils/index.js';
import {
    getUsersForSideBar,
    getUserData,
} from '../controllers/users.controller.js';

const usersRouter = express.Router();
usersRouter.use(verifyToken);
usersRouter.get('/', getUsersForSideBar); // get other users for side bar (except logged in user)
usersRouter.get('/data', verifyToken, getUserData); // OTP Auth: get user name, isAccountVerified by userId

export default usersRouter;