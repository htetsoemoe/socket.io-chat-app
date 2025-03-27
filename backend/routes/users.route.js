import express from 'express';
import { verifyToken } from '../utils/index.js';
import { getUsersForSideBar } from '../controllers/users.controller.js';

const usersRouter = express.Router();
usersRouter.use(verifyToken);
usersRouter.get('/', getUsersForSideBar); // get other users for side bar (except logged in user)

export default usersRouter;