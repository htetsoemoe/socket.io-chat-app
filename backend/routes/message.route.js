import express from 'express';
import { verifyToken } from '../utils/index.js';
import { sendMessage, getMessages } from '../controllers/message.controller.js';
import { sendMessageValidator, getMessagesValidator } from '../validators/message.validator.js';

const messageRouter = express.Router();
messageRouter.use(verifyToken);
messageRouter.post('/send/userId/:id', sendMessageValidator, sendMessage);
messageRouter.get('/userId/:id', getMessagesValidator, getMessages);

export default messageRouter;