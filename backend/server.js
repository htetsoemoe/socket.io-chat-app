import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './db/connectDB.js';
import { morgan, logger } from './config/index.js';
import { validateRequest, errorHandler, notFoundHandler } from './utils/index.js';
import authRouter from './routes/auth.route.js';
import messageRouter from './routes/message.route.js';
import usersRouter from './routes/users.route.js';
import notificationRouter from './routes/notification.route.js';
import { server, app } from './socket/socket.js';

dotenv.config();
// const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan({ logger }));

app.get('/', (req, res) => {
    res.send('Hello World');
});
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/messages', messageRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/noti', notificationRouter);

app.use(validateRequest);
app.use(notFoundHandler);
app.use(errorHandler);

server.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
}); 
