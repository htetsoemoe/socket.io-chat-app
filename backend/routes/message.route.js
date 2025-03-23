import express from 'express';
import { verifyToken } from '../utils/index.js';
import { sendMessage } from '../controllers/message.controller.js';

const messageRouter = express.Router();
messageRouter.use(verifyToken);
messageRouter.post('/send/userId/:id', sendMessage); // we need validator for this route

export default messageRouter;