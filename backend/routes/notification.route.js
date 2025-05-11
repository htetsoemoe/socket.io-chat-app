import express from 'express';
import { verifyToken } from '../utils/index.js';
import {
    sendHeartValidator,
    getAllNotificationsValidator,
} from "../validators/notification.validator.js";
import {
    sendHeart,
    getAllNotificationsByUserId,
} from '../controllers/notification.controller.js';

const notificationRouter = express.Router();
notificationRouter.use(verifyToken);
notificationRouter.put("/msgId/:msgId", sendHeartValidator, sendHeart);
notificationRouter.get("/userId/:userId", getAllNotificationsValidator, getAllNotificationsByUserId);

export default notificationRouter;