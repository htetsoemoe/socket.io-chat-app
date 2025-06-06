import express from 'express';
import { verifyToken } from '../utils/index.js';
import { 
    sendMessage, 
    getMessages, 
    deleteMsgAndNotificationByMsgId,
    updateMessage,
} from '../controllers/message.controller.js';
import { 
    sendMessageValidator, 
    getMessagesValidator, 
    deleteMsgAndNotificationByMsgIdValidator,
    updateMessageValidator, 
} from '../validators/message.validator.js';

const messageRouter = express.Router();
messageRouter.use(verifyToken);
messageRouter.post('/send/userId/:id', sendMessageValidator, sendMessage);
messageRouter.get('/userId/:id', getMessagesValidator, getMessages);
messageRouter.delete('/:msgId', deleteMsgAndNotificationByMsgIdValidator, deleteMsgAndNotificationByMsgId);
messageRouter.put("/:msgId", updateMessageValidator, updateMessage);

export default messageRouter;