import express from 'express';
import { verifyToken } from '../utils/index.js';
import {
    sendHeartValidator,
} from "../validators/notification.validator.js";
import {
    sendHeart
} from '../controllers/notification.controller.js';

const notificationRouter = express.Router();
// notificationRouter.use(verifyToken);
notificationRouter.put("/msgId/:msgId", sendHeartValidator, sendHeart);


export default notificationRouter;